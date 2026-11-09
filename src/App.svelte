<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from './lib/theme.svelte';
  import HeaderBar from './lib/components/HeaderBar.svelte';
  import ImageCanvas from './lib/components/ImageCanvas.svelte';
  import PaletteBars from './lib/components/PaletteBars.svelte';
  import SlotEditor from './lib/components/SlotEditor.svelte';
  import TerminalPreview from './lib/components/TerminalPreview.svelte';
  import ExportModal from './lib/components/ExportModal.svelte';
  import { initEngine } from './worker/client';
  import { X, AlertTriangle } from 'lucide-svelte';

  let showTomlDrawer = $state(false);
  let showExportModal = $state(false);

  onMount(() => {
    // Warm up the Go WebAssembly runtime in the background
    initEngine().catch((err) => {
      console.error('Failed to initialize Wasm engine:', err);
      theme.error = 'Wasm engine failed to initialize: ' + (err?.message || err);
    });
    theme.updateToml();
  });
</script>

<div class="h-screen w-screen flex flex-col bg-[#0d0f12] text-[#e6edf3] overflow-hidden">
  <!-- Error Notification Banner (if any) -->
  {#if theme.error}
    <div class="bg-red-950/90 border-b border-red-800/80 px-4 py-2 flex items-center justify-between text-xs text-red-200 z-50">
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 text-red-400 shrink-0" />
        <span>{theme.error}</span>
      </div>
      <button onclick={() => (theme.error = null)} class="p-1 hover:bg-red-900/50 rounded">
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  {/if}

  <!-- Top Navigation & Controls -->
  <HeaderBar
    onToggleCode={() => (showTomlDrawer = !showTomlDrawer)}
    onOpenExport={() => (showExportModal = true)}
  />

  <!-- Main Studio Workspace -->
  <div class="flex-1 flex overflow-hidden relative">
    <!-- Left Column: Single-Image Focus & Vertical Color Bars Palette -->
    <div class="flex-1 flex flex-col h-full border-r border-[#262b35] overflow-hidden">
      <ImageCanvas />
      <PaletteBars />
    </div>

    <!-- Right Column: Theme Inspector & Live Preview -->
    <aside class="w-96 flex flex-col h-full bg-[#0d0f12] overflow-hidden shrink-0 border-l border-[#1c2027]">
      <!-- Live Code Preview Card (Clean Editor Tab, No macOS dots) -->
      <div class="p-3 border-b border-[#262b35] bg-[#14171d]/50 shrink-0">
        <TerminalPreview />
      </div>

      <!-- Scrollable Color Slot Editor -->
      <div class="flex-1 overflow-y-auto">
        <SlotEditor />
      </div>
    </aside>

    <!-- Raw TOML Drawer Slide-Over -->
    {#if showTomlDrawer}
      <div class="absolute inset-y-0 right-0 w-96 z-40 bg-[#14171d] border-l border-[#262b35] shadow-2xl flex flex-col">
        <div class="h-12 border-b border-[#262b35] px-4 flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-neutral-300">Raw TOML Output</span>
          <button
            onclick={() => (showTomlDrawer = false)}
            class="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="flex-1 p-4 overflow-auto">
          <pre class="font-mono text-[11px] leading-relaxed text-neutral-300 select-all whitespace-pre-wrap">{theme.toml}</pre>
        </div>
      </div>
    {/if}

    <!-- 30 Dev Tools Export Modal -->
    {#if showExportModal}
      <ExportModal onClose={() => (showExportModal = false)} />
    {/if}
  </div>
</div>
