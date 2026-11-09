import type { SchemeData, SchemeColors } from '../../worker/types';

export interface ImportResult {
  success: boolean;
  confidence: number; // 0 to 100
  formatName: string;
  scheme?: SchemeData;
  error?: string;
}

function cleanHex(raw: string | undefined | null): string | null {
  if (!raw) return null;
  raw = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!raw.startsWith('#')) {
    raw = '#' + raw;
  }
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
    return raw.toLowerCase();
  }
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[1], g = raw[2], b = raw[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

function normalizeScheme(
  name: string,
  variant: 'dark' | 'light',
  colors: Partial<SchemeColors>,
  ansiColors: (string | null | undefined)[],
  tools?: Record<string, string>
): SchemeData {
  const bg = colors.bg || '#14171d';
  const fg = colors.fg || '#e6edf3';
  const accent = colors.accent || colors.blue || ansiColors[4] || '#58a6ff';

  const default16 = [
    bg, '#ff7b72', '#7ee787', '#d29922', '#58a6ff', '#bc8cff', '#39c5cf', fg,
    '#484f58', '#ffa198', '#aff5b4', '#e3b341', '#79c0ff', '#d2a8ff', '#56d4dd', '#ffffff',
  ];

  const fullAnsi = default16.map((fallback, idx) => ansiColors[idx] || fallback);

  return {
    name,
    variant,
    colors: {
      bg,
      bg_alt: colors.bg_alt || (variant === 'dark' ? '#1a1e26' : '#f0f3f6'),
      bg_deep: colors.bg_deep || (variant === 'dark' ? '#0d0f12' : '#ffffff'),
      fg,
      fg_dim: colors.fg_dim || (variant === 'dark' ? '#8b949e' : '#57606a'),
      fg_muted: colors.fg_muted || (variant === 'dark' ? '#6e7681' : '#8c959f'),
      surface: colors.surface || (variant === 'dark' ? '#1c2027' : '#eaeef2'),
      surface_hi: colors.surface_hi || (variant === 'dark' ? '#262b35' : '#d0d7de'),
      border: colors.border || (variant === 'dark' ? '#30363d' : '#d0d7de'),
      overlay: colors.overlay || colors.fg_muted || '#6e7681',
      cursor: colors.cursor || accent,
      selection_bg: colors.selection_bg || (variant === 'dark' ? '#262b35' : '#ddf4ff'),
      selection_fg: colors.selection_fg || (variant === 'dark' ? '#f0f6fc' : '#0969da'),
      accent,
      accent_alt: colors.accent_alt || fullAnsi[5] || '#bc8cff',
      accent_info: colors.accent_info || fullAnsi[6] || '#39c5cf',
      warn: colors.warn || fullAnsi[3] || '#d29922',
      blue: colors.blue || fullAnsi[4] || '#58a6ff',
    },
    ansi: {
      colors: fullAnsi,
    },
    tools: {
      bat: tools?.bat || 'base16',
      ...(tools || {}),
    },
  };
}

// 1. Dotfiles TOML Parser
function parseDotfilesToml(content: string, filename: string): ImportResult | null {
  if (!content.includes('[colors]') && !content.includes('[ansi]')) return null;

  let confidence = 0;
  if (content.includes('[colors]')) confidence += 50;
  if (content.includes('[ansi]')) confidence += 30;
  if (/name\s*=\s*["'][^"']+["']/.test(content)) confidence += 15;
  if (/variant\s*=\s*["'](dark|light)["']/.test(content)) confidence += 5;

  if (confidence < 90) return null;

  const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
  const variantMatch = content.match(/variant\s*=\s*["'](dark|light)["']/);
  const name = nameMatch ? nameMatch[1] : filename.replace(/\.[^/.]+$/, '');
  const variant: 'dark' | 'light' = (variantMatch?.[1] as any) || 'dark';

  const colors: Partial<SchemeColors> = {};
  const colorKeys: (keyof SchemeColors)[] = [
    'bg', 'bg_alt', 'bg_deep', 'fg', 'fg_dim', 'fg_muted',
    'surface', 'surface_hi', 'border', 'overlay', 'cursor',
    'selection_bg', 'selection_fg', 'accent', 'accent_alt',
    'accent_info', 'warn', 'blue'
  ];

  for (const k of colorKeys) {
    const regex = new RegExp(`^\\s*${k}\\s*=\\s*["']([^"']+)["']`, 'm');
    const m = content.match(regex);
    if (m) {
      const h = cleanHex(m[1]);
      if (h) colors[k] = h;
    }
  }

  const ansi: string[] = [];
  const ansiMatch = content.match(/\[ansi\]\s*colors\s*=\s*\[([\s\S]*?)\]/);
  if (ansiMatch) {
    const hexes = ansiMatch[1].match(/#[0-9a-fA-F]{6}/g);
    if (hexes) {
      for (const h of hexes) ansi.push(h.toLowerCase());
    }
  }

  const tools: Record<string, string> = { bat: 'base16' };
  const toolsMatch = content.match(/\[tools\]([\s\S]*?)(?=\n\[|$)/);
  if (toolsMatch) {
    const lines = toolsMatch[1].split('\n');
    for (const line of lines) {
      const kv = line.split('#')[0].match(/^\s*([a-zA-Z0-9_-]+)\s*=\s*["']([^"']+)["']/);
      if (kv) {
        tools[kv[1]] = kv[2];
      }
    }
  }

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Dotfiles TOML',
    scheme: normalizeScheme(name, variant, colors, ansi, tools),
  };
}

// 2. Kitty Config Parser
function parseKitty(content: string, filename: string): ImportResult | null {
  const hasBg = /^\s*background\s+#[0-9a-fA-F]{6}/m.test(content);
  const hasFg = /^\s*foreground\s+#[0-9a-fA-F]{6}/m.test(content);
  const color0Count = (content.match(/^\s*color\d+\s+#[0-9a-fA-F]{6}/gm) || []).length;

  let confidence = 0;
  if (hasBg) confidence += 30;
  if (hasFg) confidence += 30;
  if (color0Count >= 8) confidence += 35;
  if (filename.endsWith('.conf') || filename.includes('kitty')) confidence += 5;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/^\s*background\s+(#[0-9a-fA-F]{6})/m)?.[1]);
  const fg = cleanHex(content.match(/^\s*foreground\s+(#[0-9a-fA-F]{6})/m)?.[1]);
  const selBg = cleanHex(content.match(/^\s*selection_background\s+(#[0-9a-fA-F]{6})/m)?.[1]);
  const selFg = cleanHex(content.match(/^\s*selection_foreground\s+(#[0-9a-fA-F]{6})/m)?.[1]);
  const cursor = cleanHex(content.match(/^\s*cursor\s+(#[0-9a-fA-F]{6})/m)?.[1]);

  const ansi: string[] = new Array(16);
  for (let i = 0; i < 16; i++) {
    const m = content.match(new RegExp(`^\\s*color${i}\\s+(#[0-9a-fA-F]{6})`, 'm'));
    if (m) ansi[i] = m[1].toLowerCase();
  }

  const name = filename.replace(/\.[^/.]+$/, '') || 'Kitty Theme';
  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Kitty Terminal',
    scheme: normalizeScheme(name, 'dark', {
      bg: bg || undefined,
      fg: fg || undefined,
      selection_bg: selBg || undefined,
      selection_fg: selFg || undefined,
      cursor: cursor || undefined,
    }, ansi),
  };
}

// 3. Alacritty TOML Parser
function parseAlacritty(content: string, filename: string): ImportResult | null {
  const hasPrimary = content.includes('[colors.primary]');
  const hasNormal = content.includes('[colors.normal]');
  const hasBright = content.includes('[colors.bright]');

  let confidence = 0;
  if (hasPrimary) confidence += 40;
  if (hasNormal) confidence += 35;
  if (hasBright) confidence += 20;
  if (filename.includes('alacritty')) confidence += 5;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/background\s*=\s*["']([^"']+)["']/)?.[1]);
  const fg = cleanHex(content.match(/foreground\s*=\s*["']([^"']+)["']/)?.[1]);

  const getSlot = (key: string) => cleanHex(content.match(new RegExp(`${key}\\s*=\\s*["']([^"']+)["']`))?.[1]);

  const ansi = [
    getSlot('black') || '#000000',
    getSlot('red') || '#ff0000',
    getSlot('green') || '#00ff00',
    getSlot('yellow') || '#ffff00',
    getSlot('blue') || '#0000ff',
    getSlot('magenta') || '#ff00ff',
    getSlot('cyan') || '#00ffff',
    getSlot('white') || '#ffffff',
  ];

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Alacritty',
    scheme: normalizeScheme(filename.replace(/\.[^/.]+$/, '') || 'Alacritty Theme', 'dark', { bg: bg || undefined, fg: fg || undefined }, ansi),
  };
}

// 4. Ghostty Parser
function parseGhostty(content: string, filename: string): ImportResult | null {
  const paletteCount = (content.match(/^\s*palette\s*=\s*\d+=#[0-9a-fA-F]{6}/gm) || []).length;
  const hasBg = /^\s*background\s*=\s*["']?#[0-9a-fA-F]{6}/m.test(content);
  const hasFg = /^\s*foreground\s*=\s*["']?#[0-9a-fA-F]{6}/m.test(content);

  let confidence = 0;
  if (paletteCount >= 8) confidence += 50;
  if (hasBg) confidence += 25;
  if (hasFg) confidence += 20;
  if (filename.includes('ghostty')) confidence += 5;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/^\s*background\s*=\s*["']?(#[0-9a-fA-F]{6})/m)?.[1]);
  const fg = cleanHex(content.match(/^\s*foreground\s*=\s*["']?(#[0-9a-fA-F]{6})/m)?.[1]);
  const cursor = cleanHex(content.match(/^\s*cursor-color\s*=\s*["']?(#[0-9a-fA-F]{6})/m)?.[1]);

  const ansi: string[] = new Array(16);
  for (let i = 0; i < 16; i++) {
    const m = content.match(new RegExp(`^\\s*palette\\s*=\\s*${i}=["']?(#[0-9a-fA-F]{6})`, 'm'));
    if (m) ansi[i] = m[1].toLowerCase();
  }

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Ghostty',
    scheme: normalizeScheme(filename.replace(/\.[^/.]+$/, '') || 'Ghostty Theme', 'dark', { bg: bg || undefined, fg: fg || undefined, cursor: cursor || undefined }, ansi),
  };
}

// 5. VS Code JSON Theme Parser
function parseVSCode(content: string, filename: string): ImportResult | null {
  try {
    const json = JSON.parse(content);
    if (!json || typeof json !== 'object') return null;

    const colors = json.colors || {};
    const hasEditorBg = 'editor.background' in colors;
    const hasEditorFg = 'editor.foreground' in colors;
    const hasTokenColors = Array.isArray(json.tokenColors);

    let confidence = 0;
    if (hasEditorBg) confidence += 40;
    if (hasEditorFg) confidence += 30;
    if (hasTokenColors) confidence += 20;
    if (json.type === 'dark' || json.type === 'light') confidence += 10;

    if (confidence < 90) return null;

    const bg = cleanHex(colors['editor.background']);
    const fg = cleanHex(colors['editor.foreground']);
    const selBg = cleanHex(colors['editor.selectionBackground']);
    const cursor = cleanHex(colors['editorCursor.foreground']);
    const variant = json.type === 'light' ? 'light' : 'dark';

    const ansi = [
      cleanHex(colors['terminal.ansiBlack']) || '#000000',
      cleanHex(colors['terminal.ansiRed']) || '#ff0000',
      cleanHex(colors['terminal.ansiGreen']) || '#00ff00',
      cleanHex(colors['terminal.ansiYellow']) || '#ffff00',
      cleanHex(colors['terminal.ansiBlue']) || '#0000ff',
      cleanHex(colors['terminal.ansiMagenta']) || '#ff00ff',
      cleanHex(colors['terminal.ansiCyan']) || '#00ffff',
      cleanHex(colors['terminal.ansiWhite']) || '#ffffff',
      cleanHex(colors['terminal.ansiBrightBlack']) || '#808080',
      cleanHex(colors['terminal.ansiBrightRed']) || '#ff8080',
      cleanHex(colors['terminal.ansiBrightGreen']) || '#80ff80',
      cleanHex(colors['terminal.ansiBrightYellow']) || '#ffff80',
      cleanHex(colors['terminal.ansiBrightBlue']) || '#8080ff',
      cleanHex(colors['terminal.ansiBrightMagenta']) || '#ff80ff',
      cleanHex(colors['terminal.ansiBrightCyan']) || '#80ffff',
      cleanHex(colors['terminal.ansiBrightWhite']) || '#ffffff',
    ];

    return {
      success: true,
      confidence: Math.min(100, confidence),
      formatName: 'VS Code',
      scheme: normalizeScheme(json.name || filename.replace(/\.[^/.]+$/, ''), variant, {
        bg: bg || undefined,
        fg: fg || undefined,
        selection_bg: selBg || undefined,
        cursor: cursor || undefined,
      }, ansi),
    };
  } catch {
    return null;
  }
}

// 6. Base16 YAML Parser
function parseBase16(content: string, filename: string): ImportResult | null {
  const baseCount = (content.match(/base0[0-9a-fA-F]:\s*["']?[0-9a-fA-F]{6}/g) || []).length;
  let confidence = 0;
  if (baseCount >= 16) confidence += 90;
  if (content.includes('system: "base16"') || content.includes('system: base16')) confidence += 10;

  if (confidence < 90) return null;

  const getBase = (id: string) => cleanHex(content.match(new RegExp(`${id}:\\s*["']?([0-9a-fA-F]{6})`))?.[1]);

  const bg = getBase('base00');
  const fg = getBase('base05');
  const ansi = [
    getBase('base00') || '#000000',
    getBase('base08') || '#ff0000',
    getBase('base0B') || '#00ff00',
    getBase('base0A') || '#ffff00',
    getBase('base0D') || '#0000ff',
    getBase('base0E') || '#ff00ff',
    getBase('base0C') || '#00ffff',
    getBase('base05') || '#ffffff',
    getBase('base03') || '#808080',
    getBase('base08') || '#ff8080',
    getBase('base0B') || '#80ff80',
    getBase('base0A') || '#ffff80',
    getBase('base0D') || '#8080ff',
    getBase('base0E') || '#ff80ff',
    getBase('base0C') || '#80ffff',
    getBase('base07') || '#ffffff',
  ];

  const nameMatch = content.match(/name:\s*["']?([^"'\n]+)/);
  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Base16 YAML',
    scheme: normalizeScheme(nameMatch?.[1]?.trim() || filename.replace(/\.[^/.]+$/, ''), 'dark', { bg: bg || undefined, fg: fg || undefined }, ansi),
  };
}

// 7. Windows Terminal JSON Parser
function parseWindowsTerminal(content: string, filename: string): ImportResult | null {
  try {
    const json = JSON.parse(content);
    const obj = Array.isArray(json?.schemes) ? json.schemes[0] : json;
    if (!obj || typeof obj !== 'object') return null;

    let confidence = 0;
    if ('background' in obj && 'foreground' in obj) confidence += 40;
    if ('cursorColor' in obj) confidence += 20;
    if ('black' in obj && 'blue' in obj && 'red' in obj) confidence += 35;

    if (confidence < 90) return null;

    const ansi = [
      cleanHex(obj.black) || '#000000',
      cleanHex(obj.red) || '#ff0000',
      cleanHex(obj.green) || '#00ff00',
      cleanHex(obj.yellow) || '#ffff00',
      cleanHex(obj.blue) || '#0000ff',
      cleanHex(obj.purple) || '#ff00ff',
      cleanHex(obj.cyan) || '#00ffff',
      cleanHex(obj.white) || '#ffffff',
      cleanHex(obj.brightBlack) || '#808080',
      cleanHex(obj.brightRed) || '#ff8080',
      cleanHex(obj.brightGreen) || '#80ff80',
      cleanHex(obj.brightYellow) || '#ffff80',
      cleanHex(obj.brightBlue) || '#8080ff',
      cleanHex(obj.brightPurple) || '#ff80ff',
      cleanHex(obj.brightCyan) || '#80ffff',
      cleanHex(obj.brightWhite) || '#ffffff',
    ];

    return {
      success: true,
      confidence: Math.min(100, confidence),
      formatName: 'Windows Terminal',
      scheme: normalizeScheme(obj.name || filename.replace(/\.[^/.]+$/, ''), 'dark', {
        bg: cleanHex(obj.background) || undefined,
        fg: cleanHex(obj.foreground) || undefined,
        cursor: cleanHex(obj.cursorColor) || undefined,
        selection_bg: cleanHex(obj.selectionBackground) || undefined,
      }, ansi),
    };
  } catch {
    return null;
  }
}

// 8. Helix TOML Parser
function parseHelix(content: string, filename: string): ImportResult | null {
  let confidence = 0;
  if (content.includes('"ui.background"')) confidence += 45;
  if (content.includes('"ui.text"')) confidence += 35;
  if (content.includes('"ui.cursor"')) confidence += 15;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/"ui\.background"\s*=\s*\{\s*bg\s*=\s*["']([^"']+)["']/)?.[1]);
  const fg = cleanHex(content.match(/"ui\.text"\s*=\s*\{\s*fg\s*=\s*["']([^"']+)["']/)?.[1]);
  const cursor = cleanHex(content.match(/"ui\.cursor"\s*=\s*\{[^}]*bg\s*=\s*["']([^"']+)["']/)?.[1]);
  const selBg = cleanHex(content.match(/"ui\.selection"\s*=\s*\{\s*bg\s*=\s*["']([^"']+)["']/)?.[1]);

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Helix',
    scheme: normalizeScheme(filename.replace(/\.[^/.]+$/, '') || 'Helix Theme', 'dark', {
      bg: bg || undefined,
      fg: fg || undefined,
      cursor: cursor || undefined,
      selection_bg: selBg || undefined,
    }, []),
  };
}

// 9. WezTerm Lua Parser
function parseWezTerm(content: string, filename: string): ImportResult | null {
  const hasColors = /colors\s*=\s*\{/.test(content);
  const hasBg = /background\s*=\s*["'](#[0-9a-fA-F]{6})["']/.test(content);
  const hasFg = /foreground\s*=\s*["'](#[0-9a-fA-F]{6})["']/.test(content);
  const hasAnsi = /ansi\s*=\s*\{/.test(content);
  const hasBrights = /brights\s*=\s*\{/.test(content);

  let confidence = 0;
  if (hasColors) confidence += 25;
  if (hasBg && hasFg) confidence += 35;
  if (hasAnsi) confidence += 25;
  if (hasBrights) confidence += 15;
  if (filename.includes('wezterm') || filename.endsWith('.lua')) confidence += 5;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/background\s*=\s*["'](#[0-9a-fA-F]{6})["']/)?.[1]);
  const fg = cleanHex(content.match(/foreground\s*=\s*["'](#[0-9a-fA-F]{6})["']/)?.[1]);
  const cursor = cleanHex(content.match(/cursor_bg\s*=\s*["'](#[0-9a-fA-F]{6})["']/)?.[1]);
  const selBg = cleanHex(content.match(/selection_bg\s*=\s*["'](#[0-9a-fA-F]{6})["']/)?.[1]);
  const selFg = cleanHex(content.match(/selection_fg\s*=\s*["'](#[0-9a-fA-F]{6})["']/)?.[1]);

  const ansiMatches = content.match(/#[0-9a-fA-F]{6}/g) || [];
  const ansi = ansiMatches.slice(0, 16);

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'WezTerm',
    scheme: normalizeScheme(filename.replace(/\.[^/.]+$/, '') || 'WezTerm Theme', 'dark', {
      bg: bg || undefined,
      fg: fg || undefined,
      cursor: cursor || undefined,
      selection_bg: selBg || undefined,
      selection_fg: selFg || undefined,
    }, ansi),
  };
}

// 10. Foot INI Parser
function parseFoot(content: string, filename: string): ImportResult | null {
  const hasSection = /\[colors\]/i.test(content);
  const hasBg = /^\s*background\s*=\s*[0-9a-fA-F]{6}/m.test(content);
  const hasFg = /^\s*foreground\s*=\s*[0-9a-fA-F]{6}/m.test(content);
  const regCount = (content.match(/^\s*regular\d\s*=\s*[0-9a-fA-F]{6}/gm) || []).length;
  const brightCount = (content.match(/^\s*bright\d\s*=\s*[0-9a-fA-F]{6}/gm) || []).length;

  let confidence = 0;
  if (hasSection) confidence += 25;
  if (hasBg && hasFg) confidence += 35;
  if (regCount >= 8) confidence += 30;
  if (brightCount >= 8) confidence += 10;
  if (filename.includes('foot')) confidence += 5;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/^\s*background\s*=\s*([0-9a-fA-F]{6})/m)?.[1]);
  const fg = cleanHex(content.match(/^\s*foreground\s*=\s*([0-9a-fA-F]{6})/m)?.[1]);

  const ansi: string[] = [];
  for (let i = 0; i < 8; i++) {
    const m = content.match(new RegExp(`^\\s*regular${i}\\s*=\\s*([0-9a-fA-F]{6})`, 'm'));
    ansi.push(cleanHex(m?.[1]) || '#000000');
  }
  for (let i = 0; i < 8; i++) {
    const m = content.match(new RegExp(`^\\s*bright${i}\\s*=\\s*([0-9a-fA-F]{6})`, 'm'));
    ansi.push(cleanHex(m?.[1]) || '#ffffff');
  }

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Foot Terminal',
    scheme: normalizeScheme(filename.replace(/\.[^/.]+$/, '') || 'Foot Theme', 'dark', {
      bg: bg || undefined,
      fg: fg || undefined,
    }, ansi),
  };
}

// 11. Xresources Parser
function parseXresources(content: string, filename: string): ImportResult | null {
  const hasBg = /\*\.?background:\s*#[0-9a-fA-F]{6}/i.test(content);
  const hasFg = /\*\.?foreground:\s*#[0-9a-fA-F]{6}/i.test(content);
  const colorCount = (content.match(/\*\.?color\d+:\s*#[0-9a-fA-F]{6}/gi) || []).length;

  let confidence = 0;
  if (hasBg && hasFg) confidence += 45;
  if (colorCount >= 8) confidence += 45;
  if (filename.includes('Xresources') || filename.includes('xresources')) confidence += 10;

  if (confidence < 90) return null;

  const bg = cleanHex(content.match(/\*\.?background:\s*(#[0-9a-fA-F]{6})/i)?.[1]);
  const fg = cleanHex(content.match(/\*\.?foreground:\s*(#[0-9a-fA-F]{6})/i)?.[1]);
  const cursor = cleanHex(content.match(/\*\.?cursorColor:\s*(#[0-9a-fA-F]{6})/i)?.[1]);

  const ansi: string[] = new Array(16);
  for (let i = 0; i < 16; i++) {
    const m = content.match(new RegExp(`\\*\\.?color${i}:\\s*(#[0-9a-fA-F]{6})`, 'i'));
    if (m) ansi[i] = m[1].toLowerCase();
  }

  return {
    success: true,
    confidence: Math.min(100, confidence),
    formatName: 'Xresources',
    scheme: normalizeScheme(filename.replace(/\.[^/.]+$/, '') || 'Xresources Theme', 'dark', {
      bg: bg || undefined,
      fg: fg || undefined,
      cursor: cursor || undefined,
    }, ansi),
  };
}

// Master Dispatcher with >= 90% Confidence Enforcement
export function importThemeFile(content: string, filename: string = 'theme'): ImportResult {
  if (!content || content.trim().length === 0) {
    return {
      success: false,
      confidence: 0,
      formatName: 'Unknown',
      error: 'File content is empty.',
    };
  }

  const parsers = [
    parseDotfilesToml,
    parseKitty,
    parseAlacritty,
    parseGhostty,
    parseVSCode,
    parseWindowsTerminal,
    parseBase16,
    parseHelix,
    parseWezTerm,
    parseFoot,
    parseXresources,
  ];

  for (const parser of parsers) {
    const res = parser(content, filename);
    if (res && res.success && res.confidence >= 90) {
      return res;
    }
  }

  // If no parser reached 90% confidence threshold, strictly reject/drop
  return {
    success: false,
    confidence: 35,
    formatName: 'Unrecognized',
    error: 'Import dropped: confidence was below 90%. Could not reliably identify the theme format.',
  };
}
