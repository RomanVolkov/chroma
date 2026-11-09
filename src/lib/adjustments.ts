import type { SchemeColors } from '../worker/types';

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

  const bg = res.bg;

  // Fix foreground text colors against background
  const textKeys: (keyof SchemeColors)[] = ['fg', 'fg_dim', 'accent', 'accent_alt', 'accent_info', 'warn', 'blue'];
  for (const k of textKeys) {
    let currentHex = res[k];
    let ratio = calculateContrastRatio(currentHex, bg);

    if (ratio < minTextRatio) {
      // Adjust lightness in HSL until ratio >= 4.5 or max attempts reached
      const rgb = hexToRgb(currentHex);
      let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

      for (let step = 0; step < 25; step++) {
        if (variant === 'dark') {
          l = Math.min(96, l + 3);
        } else {
          l = Math.max(8, l - 3);
        }
        const candidate = rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b);
        ratio = calculateContrastRatio(candidate, bg);
        if (ratio >= minTextRatio) {
          res[k] = candidate;
          break;
        }
      }
    }
  }

  // Fix selection background vs text collision:
  // Ensure selection_bg has visible distinction from bg, and selection_fg has high contrast on selection_bg
  let selBgRatio = calculateContrastRatio(res.selection_bg, bg);
  if (selBgRatio < 1.3) {
    // Push selection_bg slightly lighter in dark mode, darker in light mode
    const rgb = hexToRgb(res.selection_bg);
    let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    l = variant === 'dark' ? Math.min(50, l + 15) : Math.max(50, l - 15);
    res.selection_bg = rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b);
  }

  let selFgRatio = calculateContrastRatio(res.selection_fg, res.selection_bg);
  if (selFgRatio < minSelectionRatio) {
    res.selection_fg = variant === 'dark' ? '#f0f6fc' : '#0d1117';
  }

  return res;
}
