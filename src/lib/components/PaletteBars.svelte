<script lang="ts">
  import { theme } from '../theme.svelte';
  import { Sparkles, Check } from 'lucide-svelte';

  let hoveredIndex = $state<number | null>(null);
  let distributedFlash = $state(false);

  function handleDistribute() {
    theme.distributePalette();
    distributedFlash = true;
    setTimeout(() => (distributedFlash = false), 1500);
  }

  function getActiveColor(): string {
    if (!theme.activeSlot) return '';
    if (theme.activeSlot.type === 'base') {
      return (theme.scheme.colors as any)[theme.activeSlot.key] || '';
    } else {
      return theme.scheme.ansi.colors[theme.activeSlot.key as number] || '';
    }
  }
</script>

<div class="border-t border-[#262b35] bg-[#101318] flex flex-col shrink-0 select-none">
  <!-- Bar Header & Action Bar -->
  <div class="h-8 px-4 flex items-center justify-between border-b border-[#1c2027] text-xs">
    <div class="flex items-center gap-2">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        {#if theme.lastImportedFormat}
          Theme Palette ({theme.lastImportedFormat})
        {:else}
          Extracted Palette
        {/if}
      </span>
      {#if theme.swatches.length > 0}
        <span class="text-[10px] text-neutral-400 font-mono">({theme.swatches.length} tones)</span>
      {/if}
    </div>

    {#if theme.cachedPixels && theme.swatches.length > 0}
      <button
        onclick={handleDistribute}
        class="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-[11px] font-medium transition-all cursor-pointer"
        title="Distribute extracted dominant colors into the theme roles (bg, fg, accent, ANSI)"
      >
        {#if distributedFlash}
          <Check class="w-3 h-3 text-emerald-400" />
          <span class="text-emerald-400">Distributed!</span>
        {:else}
          <Sparkles class="w-3 h-3 text-indigo-400" />
          <span>Distribute into Theme</span>
        {/if}
      </button>
    {/if}
  </div>

  <!-- Vertical Color Bars Strip -->
  <div class="h-20 flex w-full relative bg-[#0b0d11] overflow-hidden">
    {#if theme.swatches.length === 0}
      <!-- Empty Placeholder Strip -->
      <div class="flex-1 flex items-center justify-center text-xs text-neutral-400 italic">
        Import an image above to extract color bars
      </div>
    {:else}
      {#each theme.swatches as swatch, idx}
        {@const isActive = getActiveColor().toLowerCase() === swatch.hex.toLowerCase()}
        <!-- Vertical Bar Column -->
        <button
          onclick={() => theme.assignColor(swatch.hex)}
          onmouseenter={() => (hoveredIndex = idx)}
          onmouseleave={() => (hoveredIndex = null)}
          class="flex-1 h-full relative group transition-all duration-150 cursor-pointer border-r border-black/20 last:border-r-0 flex flex-col justify-end p-1.5"
          style="background-color: {swatch.hex};"
          title="{swatch.hex} ({(swatch.weight * 100).toFixed(1)}% of image){theme.activeSlot ? ` — Click to assign to ${theme.activeSlot.label}` : ''}"
        >
          <!-- Active Slot Indicator Dot -->
          {#if isActive}
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-black shadow-md"></div>
          {/if}

          <!-- Hover Overlay with Hex Code and Weight -->
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 backdrop-blur-xs rounded px-1.5 py-0.5 text-center shadow-lg border border-white/10"
          >
            <span class="text-[10px] font-mono text-white tracking-wider block">{swatch.hex}</span>
            <span class="text-[8.5px] font-mono text-neutral-400 block">{(swatch.weight * 100).toFixed(0)}%</span>
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>
