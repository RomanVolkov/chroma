<p align="center">
  <img src="public/icon.svg" width="96" height="96" alt="Chroma Logo" />
</p>

<h1 align="center">Chroma</h1>

<p align="center">
  <strong>Single-image theme studio powered by Go WebAssembly and Svelte 5.</strong><br />
  Extracts harmonious color schemes from wallpapers and photos, validates contrast, and exports to 50+ developer tools.
</p>

<p align="center">
  <a href="https://romanvolkov.github.io/chroma/"><img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-58a6ff?style=flat&logo=github" alt="Live Demo" /></a>
  <a href="https://github.com/RomanVolkov/chroma"><img src="https://img.shields.io/badge/GitHub-RomanVolkov%2Fchroma-blue?style=flat&logo=github" alt="Repository" /></a>
  <a href="https://svelte.dev/"><img src="https://img.shields.io/badge/Svelte-5-FF3E00?style=flat&logo=svelte&logoColor=white" alt="Svelte 5" /></a>
  <a href="https://go.dev/"><img src="https://img.shields.io/badge/Go_Wasm-1.24-00ADD8?style=flat&logo=go&logoColor=white" alt="Go Wasm" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat" alt="License: MIT" /></a>
</p>

---

## View the Live Site

Experience Chroma directly in your browser:  
👉 **[https://romanvolkov.github.io/chroma/](https://romanvolkov.github.io/chroma/)**

---

## Overview

Chroma is a client-side theme studio built for developers who want cohesive, accessible terminal and code editor palettes derived from their desktop wallpapers. Everything runs 100% in the browser with zero server dependencies or network uploads.

A pure Go engine compiled to WebAssembly runs inside a Web Worker to cluster image colors in the perceptually uniform **CIELAB** color space via k-means. Extracted colors are mapped into semantic roles (background, foreground, cursor, selections, and standard ANSI 0–15 colors) with automatic WCAG contrast validation and live multi-language code previews.

Themes can be exported into **50 popular developer tool configurations** (or downloaded as a complete ZIP bundle) and imported back from existing configurations with a strict 90% confidence threshold.

---

## Key Features

- **Go WebAssembly Color Engine**: Perceptually uniform CIELAB k-means clustering running asynchronously in a Web Worker for smooth, instant quantization.
- **Center-Stage Multi-Language Preview**: Live syntax-highlighted code editor preview across 8 languages:
  - TypeScript, Go, Rust, C, C++, Bash, Python, and Lua.
  - Interactive selection highlight, line numbers, cursor, and command bars.
- **WCAG 2.0 Contrast Checker & Auto-Fix**: Real-time contrast ratios against the background color with a one-click **"Auto-Fix Contrast"** action that nudges tones to meet AA standards.
- **Color Tuning Studio**: Non-blocking slide-over drawer to adjust brightness, contrast, saturation, color temperature (warmth), and hue rotation in real-time.
- **Interactive Eyedropper & Loupe**: Real-time pixel magnifier to sample any pixel from your wallpaper into any active theme slot.
- **50 Dev Tool Exporters**: Export into Neovim, VS Code, Kitty, Alacritty, Ghostty, WezTerm, Helix, Zed, Tmux, Starship, Windows Terminal, Foot, Base16, and 37 more formats, with a one-click ZIP bundle download.
- **High-Confidence Import**: Drop existing theme configs (Dotfiles TOML, Kitty, Alacritty, Ghostty, VS Code, Base16, WezTerm, Foot, Xresources) to preview or edit them. Files scoring below 90% confidence are dropped to prevent corrupted schemas.
- **Typography**: Powered by the **Iosevka Mono** font for clean, readable code and terminal previews.

---

## Supported Tools

### Export Formats (50)
| Category | Supported Tools |
| :--- | :--- |
| **Editors & IDEs** | Neovim, Vim, VS Code, JetBrains / IDEA, Emacs, Zed, Helix, Sublime Text, Micro |
| **Terminals** | Kitty, Ghostty, Alacritty, WezTerm, Warp, Windows Terminal, Foot, Zellij, iTerm2, Rio, Xresources |
| **Shells & Multiplexers** | Tmux, Starship, Fish, Zsh Syntax Highlighting, Nushell |
| **CLI & TUI Utilities** | Bat, Delta, Fzf, Btop, Bottom, Lazygit, Yazi, Tig, K9s |
| **Window Managers & Bars** | Hyprland, i3 / Sway, Waybar, Rofi, Fuzzel, Swaylock |
| **Browsers & Readers** | Chrome / Chromium, Firefox, Qutebrowser, Discord (Vencord) |
| **Standards & Specs** | Dotfiles TOML (`~/.dotfiles/theme/schemes/*.toml`), Base16 YAML, CSS Variables |

### Import Formats (>= 90% Confidence Gated)
- Dotfiles TOML (`[colors]`, `[ansi]`)
- Kitty Terminal (`background`, `foreground`, `color0`–`color15`)
- Alacritty (`[colors.primary]`, `[colors.normal]`, `[colors.bright]`)
- Ghostty (`palette = N=#hex`, `background`, `foreground`)
- VS Code JSON (`editor.background`, `editor.foreground`, `tokenColors`)
- Windows Terminal JSON (`schemes` object / array)
- Base16 YAML (`base00`–`base0F`)
- Helix TOML (`ui.background`, `ui.text`, `ui.cursor`)
- WezTerm Lua (`colors = { ... }`)
- Foot INI (`[colors]`, `regular0`–`regular7`)
- Xresources (`*.background`, `*.color0`–`*.color15`)

---

## Repository Structure

```
chroma/
├── .github/
│   └── workflows/deploy.yml   # GitHub Pages automated build & deployment
├── public/
│   ├── favicon.svg            # Chroma app favicon
│   └── icon.svg               # Chroma project icon
├── src/
│   ├── App.svelte             # Main workspace layout
│   ├── lib/
│   │   ├── adjustments.ts     # WCAG contrast math & HSL/CIELAB adjustments
│   │   ├── snippets.ts        # 8-language highlighted code snippets
│   │   ├── theme.svelte.ts    # Svelte 5 reactive theme store
│   │   ├── components/        # Studio UI components
│   │   │   ├── AdjustmentsDrawer.svelte
│   │   │   ├── ExportModal.svelte
│   │   │   ├── HeaderBar.svelte
│   │   │   ├── ImageCanvas.svelte
│   │   │   ├── PaletteBars.svelte
│   │   │   ├── SlotEditor.svelte
│   │   │   └── TerminalPreview.svelte
│   │   ├── exporters/         # 50 developer tool theme exporters
│   │   └── importers/         # High-confidence schema parsers & tests
│   └── worker/                # Go WebAssembly runtime client & worker
├── wasm/                      # Pure Go core compiled to WebAssembly
│   ├── cielab.go              # CIELAB color math & delta-E calculations
│   ├── kmeans.go              # Fast k-means color quantization
│   ├── mapper.go              # Role mapping & contrast enforcement
│   ├── toml.go                # Dotfiles TOML serialization
│   └── main.go                # WebAssembly JS bridge
├── index.html
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js**: v20 or v22+
- **Go**: v1.24+ (for building WebAssembly)

### Installation

```bash
# Clone the repository
git clone https://github.com/RomanVolkov/chroma.git
cd chroma

# Install dependencies
npm install
```

### Development

```bash
# Run local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Tests

```bash
# Run both Go WebAssembly tests and TypeScript import confidence tests
npm test
```

### Production Build

```bash
# Compiles Go WebAssembly binary and builds optimized Vite bundle
npm run build
```

The output bundle will be placed in `dist/`, ready for static hosting.

---

## Deployment

Deployments to GitHub Pages are fully automated via GitHub Actions on every push to `main`.

1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` and the workflow will build the Wasm binary and deploy the site to:
   `https://romanvolkov.github.io/chroma/`

---

## License

This project is licensed under the [MIT License](LICENSE).
