# Chroma: Single-Image Theme Generator (Go Wasm + Svelte 5)

## Overview
Chroma is a focused, client-side single-image workbench that extracts cohesive color themes from a photo or wallpaper and exports them into the user's custom dotfiles `.toml` format (`~/.dotfiles/theme/schemes/*.toml`). The heavy computation (CIELAB color space conversions, k-means clustering, luminance/chroma sorting, WCAG contrast verification, and TOML serialization) runs inside a background WebAssembly engine compiled from pure Go, while the interface is built with Svelte 5 and Tailwind CSS adopting the dark studio aesthetic of `darkslide_app`. The entire application is a zero-dependency static site deployable directly to GitHub Pages.

## Context (from discovery)
- **Target Schema**: Matches `~/.dotfiles/theme/schemes/*.toml`:
  - `name`, `variant` ("dark" | "light")
  - `[colors]`: `bg`, `bg_alt`, `bg_deep`, `fg`, `fg_dim`, `fg_muted`, `surface`, `surface_hi`, `border`, `overlay`, `cursor`, `selection_bg`, `selection_fg`, `accent`, `accent_alt`, `accent_info`, `warn`, `blue`
  - `[ansi]`: 16-color array for terminal colors
  - `[tools]`: optional tool integrations (e.g., `bat`)
- **Design Inspiration**: `/Users/romanvolkov/dev/personal/darkslide/darkslide_app` (deep dark studio theme, compact control groups, clean typography, single-image focus).
- **Core Workflow**: Single-image focus (no gallery/library clutter). User drops an image -> Go Wasm extracts dominant palette and maps roles -> user inspects/fine-tunes via interactive eyedropper or swatches -> live terminal mock preview updates -> user exports `.toml` or copies to clipboard.

## Development Approach
- **testing approach**: Regular (code first, then tests)
- complete each task fully before moving to the next
- make small, focused changes
- **Testing enforcement**:
  - Write unit tests for Go color conversions, k-means clustering, and TOML mapping/serialization
  - Write component/smoke tests for frontend build and worker bridge
  - All tests must pass before completing each task
- maintain clean separation between Go Wasm engine and Svelte 5 presentation layer

## Testing Strategy
- **Go Unit Tests**: `go test ./wasm/...` testing CIELAB conversions, k-means centroid clustering, and TOML serialization against the target schema.
- **Frontend / Integration Tests**: `npm run build` and `npm run test` (Vitest) validating Svelte components and Web Worker messaging protocol.

## Progress Tracking
- [x] Task 1: Project Scaffolding, Go Wasm Build & GitHub Actions
- [x] Task 2: Go CIELAB Color Science & K-Means Quantization
- [x] Task 3: Go Theme Schema, Role Mapper & TOML Serializer
- [x] Task 4: Go WebAssembly Bridge & Web Worker Client
- [x] Task 5: Svelte 5 Reactive Theme State & Focused Image Canvas
- [x] Task 6: Studio Slot Editor, Terminal Preview & Darkslide UI Shell

## Solution Overview
The application is organized into:
1. `wasm/`: Pure Go library compiled with `GOOS=js GOARCH=wasm`. Exposes palette extraction and TOML generation to the browser via `syscall/js`.
2. `src/worker/`: Web Worker that runs the Wasm binary in the background so heavy image analysis never stutters the browser UI.
3. `src/lib/`: Svelte 5 runes-based state management and studio components inspired by `darkslide_app`.
4. GitHub Pages build pipeline bundling everything into self-contained static assets.

## What Goes Where
- **Implementation Steps** (`[ ]` checkboxes): Tasks performed directly in `/Users/romanvolkov/dev/tools/chroma`.
- **Post-Completion**: Setting up GitHub repository remote and enabling GitHub Pages in repo settings.

## Implementation Steps

### Task 1: Project Scaffolding, Go Wasm Build & GitHub Actions

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `go.mod`
- Create: `.github/workflows/deploy.yml`
- Create: `public/wasm_exec.js`

- [x] initialize Go module (`chroma`) and npm package with Svelte 5, Vite, Tailwind CSS, and Vitest
- [x] copy standard Go `wasm_exec.js` into `public/` via `cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" public/`
- [x] configure `vite.config.ts` with relative base path support for GitHub Pages and worker bundling
- [x] configure Tailwind CSS and standard Darkslide dark palette tokens
- [x] add GitHub Actions deployment workflow for GitHub Pages
- [x] run `npm run build` - must pass before Task 2

### Task 2: Go CIELAB Color Science & K-Means Quantization

**Files:**
- Create: `wasm/cielab.go`
- Create: `wasm/cielab_test.go`
- Create: `wasm/kmeans.go`
- Create: `wasm/kmeans_test.go`

- [x] implement sRGB to linear RGB, XYZ, and CIELAB color space conversions in `wasm/cielab.go`
- [x] implement Euclidean DeltaE distance calculation in CIELAB space
- [x] implement k-means clustering in Lab space with frequency-weighted centroids in `wasm/kmeans.go`
- [x] write unit tests in `wasm/cielab_test.go` verifying color space round-trips and distance accuracy
- [x] write unit tests in `wasm/kmeans_test.go` verifying clustering convergence with synthetic color groups
- [x] run `go test ./wasm/...` - must pass before Task 3

### Task 3: Go Theme Schema, Role Mapper & TOML Serializer

**Files:**
- Create: `wasm/types.go`
- Create: `wasm/mapper.go`
- Create: `wasm/mapper_test.go`
- Create: `wasm/toml.go`
- Create: `wasm/toml_test.go`

- [x] define `Scheme`, `Colors`, and `ANSI` Go types matching `~/.dotfiles/theme/schemes/*.toml` in `wasm/types.go`
- [x] implement role mapping in `wasm/mapper.go`: luminance sorting for dark/light base backgrounds, highest luminance for text, highest chroma for accents
- [x] implement ANSI 16-color generation matching standard terminal hues with lightness offsets for bright slots
- [x] implement TOML serialization in `wasm/toml.go` formatting clean TOML output with headers
- [x] write unit tests in `wasm/mapper_test.go` testing dark and light variant assignments
- [x] write unit tests in `wasm/toml_test.go` validating that generated TOML parses cleanly and conforms to dotfiles format
- [x] run `go test ./wasm/...` - must pass before Task 4

### Task 4: Go WebAssembly Bridge & Web Worker Client

**Files:**
- Create: `wasm/main.go`
- Create: `src/worker/engine.worker.ts`
- Create: `src/worker/client.ts`
- Create: `src/worker/types.ts`

- [x] implement `wasm/main.go` with JS bindings using `syscall/js` to handle `extractPalette` and `serializeToml`
- [x] add npm build script `build:wasm` (`GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o public/engine.wasm ./wasm`)
- [x] create `src/worker/types.ts` defining typed request and response contracts
- [x] implement `src/worker/engine.worker.ts` to instantiate Go runtime and process messages asynchronously
- [x] implement `src/worker/client.ts` offering a clean Promise-based API for Svelte components
- [x] run `npm run build:wasm && npm run build` - must pass before Task 5

### Task 5: Svelte 5 Reactive Theme State & Focused Image Canvas

**Files:**
- Create: `src/lib/theme.svelte.ts`
- Create: `src/lib/components/ImageCanvas.svelte`
- Create: `src/lib/components/SwatchShelf.svelte`
- Create: `src/lib/components/Loupe.svelte`

- [x] implement reactive theme store in `src/lib/theme.svelte.ts` using Svelte 5 runes (`$state`, `$derived`) managing image data, active slot selection, and extracted colors
- [x] build `ImageCanvas.svelte` with single-image focus: drag-and-drop zone, image rendering, pan/zoom controls
- [x] implement interactive loupe / eyedropper tool with instant pixel sampling from native canvas
- [x] build `SwatchShelf.svelte` displaying the top 16 dominant color pills extracted by Wasm
- [x] run `npm run build` - must pass before Task 6

### Task 6: Studio Slot Editor, Terminal Preview & Darkslide UI Shell

**Files:**
- Create: `src/lib/components/SlotEditor.svelte`
- Create: `src/lib/components/ColorSlot.svelte`
- Create: `src/lib/components/TerminalPreview.svelte`
- Create: `src/lib/components/HeaderBar.svelte`
- Modify: `src/App.svelte`

- [x] build `SlotEditor.svelte` with Darkslide studio aesthetic: Base colors, Text colors, Accents, and 2x8 ANSI grid
- [x] build `ColorSlot.svelte` with color swatch, hex code, active selection ring, and click-to-assign support
- [x] build `TerminalPreview.svelte` showing a realistic terminal prompt, git status, and syntax highlighted code snippet using active theme colors
- [x] build `HeaderBar.svelte` with Theme Name input, Dark/Light variant toggle, "Export .toml" download, and "Copy TOML" button
- [x] assemble complete workbench in `src/App.svelte`
- [x] run `npm run build` and verify full end-to-end build succeeds

## Post-Completion
- Initialize remote GitHub repository and push `chroma`
- Enable GitHub Pages in GitHub repository settings under GitHub Actions
