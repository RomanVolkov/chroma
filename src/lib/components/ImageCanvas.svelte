<script lang="ts">
  import { theme } from '../theme.svelte';
  import Loupe from './Loupe.svelte';
  import { Upload, ZoomIn, ZoomOut, RotateCcw, Crosshair, X } from 'lucide-svelte';

  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let containerEl = $state<HTMLDivElement | null>(null);

  let isDragging = $state(false);
  let isEyedropperActive = $state(true);

  let scale = $state(1.0);
  let panX = $state(0);
  let panY = $state(0);
  let isPanning = $state(false);
  let startPanX = $state(0);
  let startPanY = $state(0);

  // Loupe state
  let loupeVisible = $state(false);
  let loupeX = $state(0);
  let loupeY = $state(0);
  let hoveredHex = $state('#000000');

  let currentImage: HTMLImageElement | null = null;

  $effect(() => {
    if (theme.imageUrl && canvasEl) {
      const img = new Image();
      img.src = theme.imageUrl;
      img.onload = () => {
        currentImage = img;
        renderCanvas();
        fitToView();
      };
    } else if (!theme.imageUrl) {
      currentImage = null;
    }
  });

  function fitToView() {
    if (!currentImage || !containerEl) return;
    const cw = containerEl.clientWidth - 48;
    const ch = containerEl.clientHeight - 48;
    const sw = cw / currentImage.naturalWidth;
    const sh = ch / currentImage.naturalHeight;
    scale = Math.min(sw, sh, 1.0);
    panX = 0;
    panY = 0;
  }

  function renderCanvas() {
    if (!canvasEl || !currentImage) return;
    canvasEl.width = currentImage.naturalWidth;
    canvasEl.height = currentImage.naturalHeight;
    const ctx = canvasEl.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(currentImage, 0, 0);
  }

  function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        theme.loadFile(file);
      } else {
        theme.importTheme(file);
      }
    }
  }

  function handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        theme.loadFile(file);
      } else {
        theme.importTheme(file);
      }
      input.value = '';
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!canvasEl || !currentImage) return;

    if (isPanning) {
      panX += e.clientX - startPanX;
      panY += e.clientY - startPanY;
      startPanX = e.clientX;
      startPanY = e.clientY;
      return;
    }

    if (!isEyedropperActive) {
      loupeVisible = false;
      return;
    }

    const rect = canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      loupeVisible = false;
      return;
    }

    const naturalX = Math.floor((x / rect.width) * canvasEl.width);
    const naturalY = Math.floor((y / rect.height) * canvasEl.height);

    const ctx = canvasEl.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const p = ctx.getImageData(naturalX, naturalY, 1, 1).data;
    const hex = `#${((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1)}`;

    hoveredHex = hex;
    loupeX = e.clientX;
    loupeY = e.clientY;
    loupeVisible = true;
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      // Middle click or Shift+Click for panning
      isPanning = true;
      startPanX = e.clientX;
      startPanY = e.clientY;
      loupeVisible = false;
    } else if (e.button === 0 && isEyedropperActive && loupeVisible) {
      // Sample pixel into active slot
      theme.assignColor(hoveredHex);
    }
  }

  function handleMouseUp() {
    isPanning = false;
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    scale = Math.max(0.1, Math.min(5.0, scale * zoomFactor));
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={containerEl}
  class="relative flex-1 h-full flex items-center justify-center overflow-hidden bg-[#0a0c0f] select-none cursor-crosshair"
  ondragover={(e) => { e.preventDefault(); isDragging = true; }}
  ondragleave={() => (isDragging = false)}
  ondrop={handleFileDrop}
  onmousemove={handleMouseMove}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onwheel={handleWheel}
  role="region"
  aria-label="Image Studio Canvas"
>
  {#if !theme.imageUrl}
    <!-- Empty State: Drop zone or Imported Theme view -->
    <div class="flex flex-col items-center justify-center p-6 text-center max-w-sm w-full">
      {#if theme.lastImportedFormat}
        <div class="mb-4 flex flex-col items-center animate-in fade-in duration-200">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium mb-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Imported from {theme.lastImportedFormat}
          </div>
          <span class="text-sm font-semibold text-neutral-200 tracking-wide">{theme.scheme.name}</span>
          <span class="text-[11px] text-neutral-400 mt-0.5">Active theme loaded from file</span>
        </div>
      {/if}

      <label class="flex flex-col items-center justify-center p-5 w-full border border-dashed border-[#262b35] hover:border-indigo-500/50 rounded-xl bg-[#14171d]/60 backdrop-blur-xs cursor-pointer transition-all hover:bg-[#1a1e26]/80 group">
        <input type="file" accept="image/*,.toml,.json,.yaml,.yml,.conf,.lua,.ini,.Xresources,text/plain" class="hidden" onchange={handleFileInput} />
        <div class="w-9 h-9 rounded-lg bg-neutral-900 border border-[#262b35] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:border-indigo-500/40 transition-all text-neutral-400 group-hover:text-indigo-400">
          <Upload class="w-4 h-4" />
        </div>
        <span class="text-xs font-medium text-neutral-200 mb-0.5">
          {theme.lastImportedFormat ? 'Replace with photo or theme' : 'Open wallpaper or photo'}
        </span>
        <span class="text-[10px] text-neutral-400">Drag & drop file or click to browse</span>
      </label>
    </div>
  {:else}
    <!-- Zoomable / Pannable Image Layer -->
    <div
      class="transition-transform duration-75 will-change-transform flex items-center justify-center"
      style="transform: translate({panX}px, {panY}px) scale({scale}); transform-origin: center center;"
    >
      <canvas
        bind:this={canvasEl}
        class="max-w-none shadow-2xl rounded border border-white/5 pointer-events-auto"
      ></canvas>
    </div>

    <!-- Active Slot Pill (Bottom overlay) -->
    {#if theme.activeSlot}
      <div class="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14171d]/90 backdrop-blur-md border border-[#262b35] text-xs shadow-xl animate-in fade-in duration-150">
        <span class="text-neutral-400">Target slot:</span>
        <span class="font-medium text-neutral-200 capitalize">{theme.activeSlot.label}</span>
        <div
          class="w-3.5 h-3.5 rounded border border-white/20"
          style="background-color: {theme.activeSlot.type === 'base' ? (theme.scheme.colors as any)[theme.activeSlot.key] : theme.scheme.ansi.colors[theme.activeSlot.key as number]};"
        ></div>
        <button
          onclick={() => theme.setActiveSlot(null)}
          class="ml-1 p-0.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Clear active slot"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    {/if}

    <!-- Canvas Floating Toolbar -->
    <div class="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-lg bg-[#14171d]/90 backdrop-blur-md border border-[#262b35] text-xs shadow-xl">
      <button
        onclick={() => (scale = Math.min(5.0, scale * 1.25))}
        class="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
        title="Zoom In"
      >
        <ZoomIn class="w-4 h-4" />
      </button>
      <button
        onclick={() => (scale = Math.max(0.1, scale * 0.8))}
        class="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut class="w-4 h-4" />
      </button>
      <button
        onclick={fitToView}
        class="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
        title="Fit to View"
      >
        <RotateCcw class="w-4 h-4" />
      </button>
      <div class="w-[1px] h-3 bg-neutral-800 mx-1"></div>
      <button
        onclick={() => (isEyedropperActive = !isEyedropperActive)}
        class="px-2 py-1 rounded flex items-center gap-1.5 transition-colors {isEyedropperActive ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-neutral-400 hover:bg-neutral-800'}"
        title="Toggle Eyedropper"
      >
        <Crosshair class="w-3.5 h-3.5" />
        <span class="text-[11px] font-medium">Eyedropper</span>
      </button>
    </div>

    <!-- Replace Image Floating Button -->
    <label class="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14171d]/90 backdrop-blur-md border border-[#262b35] text-xs font-medium text-neutral-300 hover:text-neutral-100 hover:bg-[#1a1e26] cursor-pointer shadow-xl transition-colors">
      <input type="file" accept="image/*" class="hidden" onchange={handleFileInput} />
      <Upload class="w-3.5 h-3.5 text-neutral-400" />
      <span>Replace Image</span>
    </label>

    <!-- Eyedropper Magnifier Loupe -->
    <Loupe
      visible={loupeVisible}
      x={loupeX}
      y={loupeY}
      hex={hoveredHex}
    />
  {/if}

  <!-- Loading Overlay -->
  {#if theme.isAnalyzing}
    <div class="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
      <div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-xs font-mono text-neutral-300 tracking-wider">Quantizing CIELAB clusters...</span>
    </div>
  {/if}
</div>
