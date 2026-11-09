<script lang="ts">
  import { onMount } from 'svelte';
  import { theme, generateDotfilesToml } from './lib/theme.svelte';
  import HeaderBar from './lib/components/HeaderBar.svelte';
  import ImageCanvas from './lib/components/ImageCanvas.svelte';
  import PaletteBars from './lib/components/PaletteBars.svelte';
  import SlotEditor from './lib/components/SlotEditor.svelte';
  import TerminalPreview from './lib/components/TerminalPreview.svelte';
  import ExportModal from './lib/components/ExportModal.svelte';
  import AdjustmentsDrawer from './lib/components/AdjustmentsDrawer.svelte';
  import { initEngine } from './worker/client';
  import { X, AlertTriangle, Check, Copy } from 'lucide-svelte';

  let showTomlDrawer = $state(false);
  let showAdjustmentsDrawer = $state(false);
  let showExportModal = $state(false);
  let tomlCopied = $state(false);

  function copyDrawerToml() {
    navigator.clipboard.writeText(theme.toml || generateDotfilesToml(theme.scheme));
    tomlCopied = true;
    setTimeout(() => (tomlCopied = false), 2000);
  }

  onMount(() => {
    // Warm up the Go WebAssembly runtime in the background
    initEngine().catch((err) => {
      console.error('Failed to initialize Wasm engine:', err);
      theme.error = 'Wasm engine failed to initialize: ' + (err?.message || err);
    });
    theme.updateToml();
  });
</script>

<div class="h-screen w-screen flex flex-col bg-[#0d0f12] text-[#e6edf3] overflow-hidden font-mono">
  <!-- Status Success Notification Banner -->
  {#if theme.statusMessage}
    <div class="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 z-50">
      <div class="flex items-center gap-2">
        <Check class="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{theme.statusMessage}</span>
      </div>
      <button onclick={() => (theme.statusMessage = null)} class="p-1 hover:bg-emerald-900/50 rounded cursor-pointer">
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  {/if}

  <!-- Error Notification Banner (if any) -->
  {#if theme.error}
    <div class="bg-red-950/90 border-b border-red-800/80 px-4 py-2 flex items-center justify-between text-xs text-red-200 z-50">
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 text-red-400 shrink-0" />
        <span>{theme.error}</span>
      </div>
      <button onclick={() => (theme.error = null)} class="p-1 hover:bg-red-900/50 rounded cursor-pointer">
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  {/if}

  <!-- Top Navigation & Controls -->
  <HeaderBar
    onToggleCode={() => {
      showTomlDrawer = !showTomlDrawer;
      if (showTomlDrawer) {
        theme.updateToml();
        showAdjustmentsDrawer = false;
        showExportModal = false;
      }
    }}
    onToggleAdjustments={() => {
      showAdjustmentsDrawer = !showAdjustmentsDrawer;
      if (showAdjustmentsDrawer) {
        showTomlDrawer = false;
        showExportModal = false;
      }
    }}
    onOpenExport={() => {
      showExportModal = !showExportModal;
      if (showExportModal) {
        showAdjustmentsDrawer = false;
        showTomlDrawer = false;
      }
    }}
  />

  <!-- Main Studio Workspace (Center Stage: Code Preview + Palette; Right Sidebar: Image & Slot Editor) -->
  <div class="flex-1 flex overflow-hidden relative">
    <!-- Center Stage: Full-Size Code Preview & Extracted Palette Strip -->
    <div class="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <div class="flex-1 overflow-hidden">
        <TerminalPreview />
      </div>
      <PaletteBars />
    </div>

    <!-- Right Sidebar: Photo Dropper & Slot Color Swatches -->
    <aside class="w-[430px] flex flex-col h-full bg-[#0d0f12] overflow-hidden shrink-0 border-l border-[#262b35]">
      <!-- Focused Image Dropper & Canvas (Top Half) -->
      <div class="h-64 shrink-0 border-b border-[#262b35] flex flex-col bg-[#0a0c0f] relative overflow-hidden">
        <ImageCanvas />
      </div>

      <!-- Scrollable Color Slot Editor (Bottom Half) -->
      <div class="flex-1 overflow-y-auto bg-[#0d0f12]">
        <SlotEditor onOpenAdjustments={() => {
          showAdjustmentsDrawer = !showAdjustmentsDrawer;
          if (showAdjustmentsDrawer) {
            showExportModal = false;
            showTomlDrawer = false;
          }
        }} />
      </div>
    </aside>

    <!-- Slide-over Right Drawers (Overlays sidebar without covering the Code Preview and Palette) -->

    <!-- 1. Export Into Drawer (50 formats) -->
    {#if showExportModal}
      <div class="absolute inset-y-0 right-0 w-[520px] z-40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-150">
        <ExportModal onClose={() => (showExportModal = false)} />
      </div>
    {/if}

    <!-- 2. Global Adjustments Drawer -->
    {#if showAdjustmentsDrawer}
      <div class="absolute inset-y-0 right-0 w-88 z-40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-150">
        <AdjustmentsDrawer onClose={() => (showAdjustmentsDrawer = false)} />
      </div>
    {/if}

    <!-- 3. Raw TOML Drawer Slide-Over -->
    {#if showTomlDrawer}
      <div class="absolute inset-y-0 right-0 w-96 z-40 bg-[#14171d] border-l border-[#262b35] shadow-2xl flex flex-col animate-in slide-in-from-right duration-150">
        <div class="h-12 border-b border-[#262b35] px-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-neutral-300">Raw TOML Output</span>
            <span class="text-[10px] text-neutral-500 font-mono">({theme.scheme.name.toLowerCase().replace(/\s+/g, '-')}.toml)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              onclick={copyDrawerToml}
              class="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1a1e26] hover:bg-[#202631] text-[11px] font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer border border-[#262b35]"
              title="Copy TOML to clipboard"
            >
              {#if tomlCopied}
                <Check class="w-3 h-3 text-emerald-400" />
                <span class="text-emerald-400">Copied!</span>
              {:else}
                <Copy class="w-3 h-3 text-neutral-400" />
                <span>Copy</span>
              {/if}
            </button>
            <button
              onclick={() => (showTomlDrawer = false)}
              class="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="flex-1 p-4 overflow-auto bg-[#0d0f12]">
          <pre class="font-mono text-[11px] leading-relaxed text-neutral-300 select-all whitespace-pre-wrap">{theme.toml || generateDotfilesToml(theme.scheme)}</pre>
        </div>
      </div>
    {/if}
  </div>
</div>
