import { extractPalette, serializeToml } from '../worker/client';
import type { ExtractResult, SchemeColors, SchemeData, Swatch } from '../worker/types';

export interface ActiveSlot {
  type: 'base' | 'ansi';
  key: keyof SchemeColors | number;
  label: string;
}

const DEFAULT_SCHEME: SchemeData = {
  name: 'Chroma Theme',
  variant: 'dark',
  colors: {
    bg: '#14171d',
    bg_alt: '#1a1e26',
    bg_deep: '#0d0f12',
    fg: '#e6edf3',
    fg_dim: '#8b949e',
    fg_muted: '#6e7681',
    surface: '#1c2027',
    surface_hi: '#262b35',
    border: '#30363d',
    overlay: '#6e7681',
    cursor: '#58a6ff',
    selection_bg: '#262b35',
    selection_fg: '#f0f6fc',
    accent: '#58a6ff',
    accent_alt: '#bc8cff',
    accent_info: '#39c5cf',
    warn: '#d29922',
    blue: '#58a6ff',
  },
  ansi: {
    colors: [
      '#14171d', '#ff7b72', '#7ee787', '#d29922', '#58a6ff', '#bc8cff', '#39c5cf', '#d2a8ff',
      '#484f58', '#ffa198', '#aff5b4', '#e3b341', '#79c0ff', '#d2a8ff', '#56d4dd', '#f0f6fc',
    ],
  },
};

export class ThemeStore {
  imageUrl = $state<string | null>(null);
  imageWidth = $state<number>(0);
  imageHeight = $state<number>(0);
  isAnalyzing = $state<boolean>(false);
  error = $state<string | null>(null);

  swatches = $state<Swatch[]>([]);
  scheme = $state<SchemeData>(JSON.parse(JSON.stringify(DEFAULT_SCHEME)));
  toml = $state<string>('');

  activeSlot = $state<ActiveSlot>({
    type: 'base',
    key: 'accent',
    label: 'Accent',
  });

  // Cached downscaled pixels for instant re-clustering on variant switch
  private cachedPixels: Uint8Array | null = null;

  async loadFile(file: File) {
    this.isAnalyzing = true;
    this.error = null;

    try {
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
      }
      this.imageUrl = URL.createObjectURL(file);

      // Derive theme name from filename
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      this.scheme.name = baseName.charAt(0).toUpperCase() + baseName.slice(1);

      // Load image into HTMLImageElement to downscale to ~384px for fast k-means
      const img = new Image();
      img.src = this.imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      this.imageWidth = img.naturalWidth;
      this.imageHeight = img.naturalHeight;

      // Downsample to max 384x384 for clustering
      const maxDim = 384;
      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Failed to create canvas context');

      ctx.drawImage(img, 0, 0, targetW, targetH);
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      this.cachedPixels = new Uint8Array(imgData.data.buffer);

      // Run extraction in Go WebAssembly worker
      const result: ExtractResult = await extractPalette(
        this.cachedPixels.slice(),
        this.scheme.variant,
        16
      );

      this.swatches = [...result.swatches];
      this.scheme = {
        name: this.scheme.name,
        variant: this.scheme.variant,
        colors: { ...result.scheme.colors },
        ansi: { colors: [...result.scheme.ansi.colors] },
        tools: { ...this.scheme.tools },
      };
      this.toml = result.toml;
    } catch (err: any) {
      console.error('Error extracting palette from image:', err);
      this.error = err?.message || 'Failed to process image';
    } finally {
      this.isAnalyzing = false;
    }
  }

  async setVariant(variant: 'dark' | 'light') {
    this.scheme.variant = variant;
    if (this.cachedPixels) {
      this.isAnalyzing = true;
      try {
        const result = await extractPalette(this.cachedPixels.slice(), variant, 16);
        this.swatches = [...result.swatches];
        this.scheme = {
          name: this.scheme.name,
          variant: this.scheme.variant,
          colors: { ...result.scheme.colors },
          ansi: { colors: [...result.scheme.ansi.colors] },
          tools: { ...this.scheme.tools },
        };
        this.toml = result.toml;
      } catch (err: any) {
        console.error('Error updating variant:', err);
        this.error = err?.message || 'Failed to update variant';
      } finally {
        this.isAnalyzing = false;
      }
    } else {
      await this.updateToml();
    }
  }

  async distributePalette() {
    if (!this.cachedPixels) return;
    this.isAnalyzing = true;
    try {
      const result = await extractPalette(this.cachedPixels.slice(), this.scheme.variant, 16);
      this.swatches = [...result.swatches];
      this.scheme = {
        name: this.scheme.name,
        variant: this.scheme.variant,
        colors: { ...result.scheme.colors },
        ansi: { colors: [...result.scheme.ansi.colors] },
        tools: { ...this.scheme.tools },
      };
      this.toml = result.toml;
    } catch (err: any) {
      console.error('Error distributing palette:', err);
      this.error = err?.message || 'Failed to distribute palette';
    } finally {
      this.isAnalyzing = false;
    }
  }

  setActiveSlot(slot: ActiveSlot) {
    this.activeSlot = slot;
  }

  async assignColor(hex: string) {
    if (!this.activeSlot) return;

    if (this.activeSlot.type === 'base') {
      const key = this.activeSlot.key as keyof SchemeColors;
      this.scheme.colors[key] = hex;
    } else if (this.activeSlot.type === 'ansi') {
      const idx = this.activeSlot.key as number;
      this.scheme.ansi.colors[idx] = hex;
    }

    await this.updateToml();
  }

  async updateToml() {
    try {
      this.toml = await serializeToml(this.scheme);
    } catch (err: any) {
      console.error('Failed to update TOML:', err);
    }
  }
}

export const theme = new ThemeStore();
