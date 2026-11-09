<p align="center">
  <img src="public/icon.svg" width="96" height="96" alt="Chroma Logo" />
</p>

<h1 align="center">Chroma</h1>

<p align="center">
  <strong>Create color schemes from images or existing themes.</strong>
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

👉 **[https://romanvolkov.github.io/chroma/](https://romanvolkov.github.io/chroma/)**

---

## Overview

The main goal of Chroma is to create color schemes from images or from existing color schemes if you want to tweak them. Everything runs locally in your browser with zero server dependencies.

---

## Key Features

- **Live Preview**: Syntax-highlighted code editor preview across 9 languages (TypeScript, Go, Rust, C, C++, Bash, Python, Lua, and Markdown).
- **Contrast Check & Auto-Fix**: Checks readability against background with a one-click button to fix low-contrast text.
- **Adjustments**: Sliders to tweak brightness, contrast, saturation, warmth, and hue.
- **50 Exporters**: Export into Neovim, VS Code, Kitty, Alacritty, Ghostty, WezTerm, Helix, Zed, Tmux, Starship, and 40 more tools (or download all in a ZIP).
- **Import**: Load existing theme configs (Dotfiles TOML, Kitty, Alacritty, Ghostty, VS Code, Base16, WezTerm, Foot, Xresources) to preview or edit them.

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

### Import Formats
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
npm run dev
```

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

---

## Deployment

Deployments to GitHub Pages are automated via GitHub Actions on every push to `main`.

---

## License

This project is licensed under the [MIT License](LICENSE).
