import type { SchemeColors, SchemeData } from '../worker/types';

export interface ThemeAdjustments {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  saturation: number; // -100 to 100
  hueShift: number;   // -180 to 180
  temperature: number;// -100 to 100 (cool to warm)
}

export const DEFAULT_ADJUSTMENTS: ThemeAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hueShift: 0,
  temperature: 0,
};

// --- WCAG 2.0 Relative Luminance & Contrast Calculation ---

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return { r: 128, g: 128, b: 128 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const sRGB = [r / 255, g / 255, b / 255];
  const linear = sRGB.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- HSL Conversions & Color Adjustments ---

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360 / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export function adjustHex(hex: string, adj: ThemeAdjustments): string {
  const { r, g, b } = hexToRgb(hex);
  let { h, s, l } = rgbToHsl(r, g, b);

  // 1. Hue Shift (-180 to 180 deg)
  h = (h + adj.hueShift + 360) % 360;

  // 2. Temperature (-100 to 100): warm shifts toward 35° (amber), cool toward 215° (blue)
  if (adj.temperature !== 0) {
    const targetHue = adj.temperature > 0 ? 35 : 215;
    const factor = Math.abs(adj.temperature) / 100 * 0.35;
    let diff = targetHue - h;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    h = (h + diff * factor + 360) % 360;
  }

  // 3. Saturation (-100 to 100)
  if (adj.saturation !== 0) {
    if (adj.saturation > 0) {
      s = s + (100 - s) * (adj.saturation / 100);
    } else {
      s = s * (1 + adj.saturation / 100);
    }
  }

  // 4. Brightness (-100 to 100)
  if (adj.brightness !== 0) {
    if (adj.brightness > 0) {
      l = l + (100 - l) * (adj.brightness / 100);
    } else {
      l = l * (1 + adj.brightness / 100);
    }
  }

  // 5. Contrast (-100 to 100): S-curve pivot around 50% lightness
  if (adj.contrast !== 0) {
    const factor = (adj.contrast + 100) / 100;
    l = 50 + (l - 50) * factor;
  }

  const res = hslToRgb(h, s, l);
  return rgbToHex(res.r, res.g, res.b);
}

export function applyAdjustmentsToColors(colors: SchemeColors, adj: ThemeAdjustments): SchemeColors {
  const result: any = {};
  for (const [key, val] of Object.entries(colors)) {
    result[key] = adjustHex(val, adj);
  }
  return result as SchemeColors;
}

// --- Smart Contrast Fixer (WCAG AA enforcement) ---

export function autoFixContrast(colors: SchemeColors, variant: 'dark' | 'light'): SchemeColors {
  const res = { ...colors };
  const minTextRatio = 4.5; // WCAG AA for normal text
  const minSelectionRatio = 3.5;
  const isDark = variant === 'dark';

  const bg = res.bg;

  // Fix foreground text colors against background
  const textKeys: (keyof SchemeColors)[] = [
    'fg', 'fg_dim', 'fg_muted', 'accent', 'accent_alt', 'accent_info', 'warn', 'blue', 'cursor'
  ];

  for (const k of textKeys) {
    let currentHex = res[k];
    let ratio = calculateContrastRatio(currentHex, bg);
    const rgb = hexToRgb(currentHex);
    let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

    if (ratio < minTextRatio || currentHex.toLowerCase() === bg.toLowerCase() || (isDark && l < 58) || (!isDark && l > 48)) {
      // Adjust lightness and saturation in HSL for vibrant, legible contrast
      s = Math.max(s, 40); // Ensure healthy saturation

      for (let step = 0; step < 30; step++) {
        if (isDark) {
          l = Math.min(96, Math.max(65, l + 2.5));
        } else {
          l = Math.max(8, Math.min(38, l - 2.5));
        }
        const candidate = rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b);
        ratio = calculateContrastRatio(candidate, bg);
        if (ratio >= minTextRatio && candidate.toLowerCase() !== bg.toLowerCase()) {
          res[k] = candidate;
          break;
        }
      }
    }
  }

  // Prevent distinct accents from collapsing into the exact same color
  if (res.accent_info.toLowerCase() === res.accent.toLowerCase()) {
    const rgb = hexToRgb(res.accent_info);
    let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    h = (h + 60) % 360;
    res.accent_info = rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b);
  }

  // Fix selection background vs text collision:
  // Ensure selection_bg has visible distinction from bg, and selection_fg has high contrast on selection_bg
  let selBgRatio = calculateContrastRatio(res.selection_bg, bg);
  if (selBgRatio < 1.3 || res.selection_bg.toLowerCase() === bg.toLowerCase()) {
    // Push selection_bg slightly lighter in dark mode, darker in light mode
    const rgb = hexToRgb(res.selection_bg);
    let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    l = isDark ? Math.min(50, l + 16) : Math.max(50, l - 16);
    res.selection_bg = rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b);
  }

  let selFgRatio = calculateContrastRatio(res.selection_fg, res.selection_bg);
  if (selFgRatio < minSelectionRatio || res.selection_fg.toLowerCase() === res.selection_bg.toLowerCase()) {
    res.selection_fg = isDark ? '#f0f6fc' : '#0d1117';
  }

  return res;
}

// --- Algorithmic Dark <-> Light Variant Converter (when no image pixels are present) ---

export function convertThemeVariant(scheme: SchemeData, targetVariant: 'dark' | 'light'): SchemeData {
  if (scheme.variant === targetVariant) return scheme;

  const isToLight = targetVariant === 'light';
  const oldBg = hexToRgb(scheme.colors.bg);
  const oldBgHsl = rgbToHsl(oldBg.r, oldBg.g, oldBg.b);
  const bgHue = oldBgHsl.h;

  let bg: string, bg_alt: string, bg_deep: string, surface: string, surface_hi: string, border: string, overlay: string;
  let fg: string, fg_dim: string, fg_muted: string;
  let selBg: string, selFg: string;

  if (isToLight) {
    const c1 = hslToRgb(bgHue, Math.min(oldBgHsl.s, 15), 97);
    bg = rgbToHex(c1.r, c1.g, c1.b);
    const c2 = hslToRgb(bgHue, Math.min(oldBgHsl.s, 15), 94);
    bg_alt = rgbToHex(c2.r, c2.g, c2.b);
    bg_deep = '#ffffff';
    const c3 = hslToRgb(bgHue, Math.min(oldBgHsl.s, 15), 92);
    surface = rgbToHex(c3.r, c3.g, c3.b);
    const c4 = hslToRgb(bgHue, Math.min(oldBgHsl.s, 18), 86);
    surface_hi = rgbToHex(c4.r, c4.g, c4.b);
    const c5 = hslToRgb(bgHue, Math.min(oldBgHsl.s, 15), 80);
    border = rgbToHex(c5.r, c5.g, c5.b);
    overlay = '#57606a';

    fg = '#1f2328';
    fg_dim = '#57606a';
    fg_muted = '#8c959f';

    const cSel = hslToRgb(bgHue, 40, 88);
    selBg = rgbToHex(cSel.r, cSel.g, cSel.b);
    selFg = '#0969da';
  } else {
    const c1 = hslToRgb(bgHue, Math.max(oldBgHsl.s, 18), 10);
    bg = rgbToHex(c1.r, c1.g, c1.b);
    const c2 = hslToRgb(bgHue, Math.max(oldBgHsl.s, 18), 13);
    bg_alt = rgbToHex(c2.r, c2.g, c2.b);
    const c3 = hslToRgb(bgHue, Math.max(oldBgHsl.s, 20), 6);
    bg_deep = rgbToHex(c3.r, c3.g, c3.b);
    const c4 = hslToRgb(bgHue, Math.max(oldBgHsl.s, 18), 15);
    surface = rgbToHex(c4.r, c4.g, c4.b);
    const c5 = hslToRgb(bgHue, Math.max(oldBgHsl.s, 18), 19);
    surface_hi = rgbToHex(c5.r, c5.g, c5.b);
    const c6 = hslToRgb(bgHue, Math.max(oldBgHsl.s, 15), 24);
    border = rgbToHex(c6.r, c6.g, c6.b);
    overlay = '#6e7681';

    fg = '#e6edf3';
    fg_dim = '#8b949e';
    fg_muted = '#6e7681';

    const cSel = hslToRgb(bgHue, 35, 20);
    selBg = rgbToHex(cSel.r, cSel.g, cSel.b);
    selFg = '#f0f6fc';
  }

  // Adjust accents: preserve hue, modulate lightness so they stand out cleanly
  const adjustAccent = (hex: string): string => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const targetL = isToLight ? Math.min(42, Math.max(28, hsl.l * 0.6)) : Math.max(68, Math.min(80, hsl.l * 1.4));
    const res = hslToRgb(hsl.h, Math.max(hsl.s, 45), targetL);
    return rgbToHex(res.r, res.g, res.b);
  };

  const colors: SchemeColors = {
    bg,
    bg_alt,
    bg_deep,
    fg,
    fg_dim,
    fg_muted,
    surface,
    surface_hi,
    border,
    overlay,
    cursor: adjustAccent(scheme.colors.cursor || scheme.colors.accent),
    selection_bg: selBg,
    selection_fg: selFg,
    accent: adjustAccent(scheme.colors.accent),
    accent_alt: adjustAccent(scheme.colors.accent_alt),
    accent_info: adjustAccent(scheme.colors.accent_info),
    warn: adjustAccent(scheme.colors.warn),
    blue: adjustAccent(scheme.colors.blue),
  };

  // Convert ANSI colors
  const ansi = [...(scheme.ansi?.colors || [])];
  if (ansi.length >= 16) {
    if (isToLight) {
      ansi[0] = '#24292f'; // black
      ansi[7] = '#ffffff'; // white
      ansi[8] = '#6e7681'; // bright black
      ansi[15] = '#1f2328';// bright white
      for (let i = 1; i < 7; i++) ansi[i] = adjustAccent(ansi[i]);
      for (let i = 9; i < 15; i++) ansi[i] = adjustAccent(ansi[i]);
    } else {
      ansi[0] = bg;
      ansi[7] = fg;
      ansi[8] = '#484f58';
      ansi[15] = '#ffffff';
      for (let i = 1; i < 7; i++) ansi[i] = adjustAccent(ansi[i]);
      for (let i = 9; i < 15; i++) ansi[i] = adjustAccent(ansi[i]);
    }
  }

  return {
    ...scheme,
    variant: targetVariant,
    colors,
    ansi: {
      colors: ansi,
    },
  };
}
