export interface Swatch {
  hex: string;
  rgb: { R: number; G: number; B: number };
  lab: { L: number; A: number; B: number };
  weight: number;
  count: number;
}

export interface SchemeColors {
  bg: string;
  bg_alt: string;
  bg_deep: string;
  fg: string;
  fg_dim: string;
  fg_muted: string;
  surface: string;
  surface_hi: string;
  border: string;
  overlay: string;
  cursor: string;
  selection_bg: string;
  selection_fg: string;
  accent: string;
  accent_alt: string;
  accent_info: string;
  warn: string;
  blue: string;
}

export interface SchemeData {
  name: string;
  variant: 'dark' | 'light';
  colors: SchemeColors;
  ansi: {
    colors: string[];
  };
  tools?: Record<string, string>;
}

export interface ExtractResult {
  swatches: Swatch[];
  scheme: SchemeData;
  toml: string;
}

export type WorkerRequest =
  | { id: string; type: 'INIT'; baseUrl: string }
  | { id: string; type: 'EXTRACT'; pixels: Uint8Array; variant: 'dark' | 'light'; k: number }
  | { id: string; type: 'SERIALIZE_TOML'; scheme: SchemeData };

export type WorkerResponse =
  | { id: string; type: 'READY' }
  | { id: string; type: 'EXTRACT_SUCCESS'; data: ExtractResult }
  | { id: string; type: 'SERIALIZE_SUCCESS'; toml: string }
  | { id: string; type: 'ERROR'; error: string };
