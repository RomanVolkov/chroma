# Chroma

Single-image color theme studio powered by a Go WebAssembly core and Svelte 5. Chroma extracts cohesive palettes from wallpapers or photos and exports them directly into your dotfiles `.toml` format (`~/.dotfiles/theme/schemes/*.toml`).

Designed for fast, client-side, zero-latency workflows with zero server dependencies — ready to host on GitHub Pages.

## Features

- **Single-Image Focus**: Clean, distraction-free canvas dedicated to the photo you're working on.
- **Go WebAssembly Engine**: Color clustering (k-means) in perceptual CIELAB color space running inside a Web Worker.
- **Interactive Eyedropper & Loupe**: Real-time pixel magnifier to sample colors directly from the image into any slot.
- **Live Terminal Preview**: Real-time mock terminal demonstrating syntax highlighting, prompt colors, and contrast against `bg`.
- **Dotfiles TOML Export**: One-click download of `<theme-name>.toml` formatted to match `~/.dotfiles/theme/schemes/`, plus direct clipboard copy.
- **Dark & Light Variants**: Luminance-aware role re-mapping at the flip of a switch.
- **Darkslide Studio Aesthetic**: Deep neutral surfaces and compact control groups.

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server with hot reload
npm run dev

# Build WebAssembly binary and static bundle (for GitHub Pages)
npm run build

# Run unit tests
npm test
```

## Architecture

- `wasm/`: Pure Go core compiled to WebAssembly (`cielab.go`, `kmeans.go`, `mapper.go`, `toml.go`, `main.go`).
- `src/worker/`: Web Worker harness running `engine.wasm` asynchronously off the main thread.
- `src/lib/`: Svelte 5 runes-based reactive state and studio components.
- `.github/workflows/deploy.yml`: Automated CI/CD deployment to GitHub Pages on push.
