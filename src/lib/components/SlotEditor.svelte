<script lang="ts">
  import { theme } from '../theme.svelte';
  import ColorSlot from './ColorSlot.svelte';
  import type { SchemeColors } from '../../worker/types';
  import { Sliders } from 'lucide-svelte';

  let { onOpenAdjustments }: { onOpenAdjustments?: () => void } = $props();

  const baseSlots: { key: keyof SchemeColors; label: string }[] = [
    { key: 'bg', label: 'bg' },
    { key: 'bg_alt', label: 'bg_alt' },
    { key: 'bg_deep', label: 'bg_deep' },
    { key: 'surface', label: 'surface' },
    { key: 'surface_hi', label: 'surface_hi' },
    { key: 'border', label: 'border' },
    { key: 'overlay', label: 'overlay' },
  ];

  const textSlots: { key: keyof SchemeColors; label: string }[] = [
    { key: 'fg', label: 'fg' },
    { key: 'fg_dim', label: 'fg_dim' },
    { key: 'fg_muted', label: 'fg_muted' },
    { key: 'cursor', label: 'cursor' },
    { key: 'selection_bg', label: 'selection_bg' },
    { key: 'selection_fg', label: 'selection_fg' },
  ];

  const accentSlots: { key: keyof SchemeColors; label: string }[] = [
    { key: 'accent', label: 'accent' },
    { key: 'accent_alt', label: 'accent_alt' },
    { key: 'accent_info', label: 'accent_info' },
    { key: 'warn', label: 'warn' },
    { key: 'blue', label: 'blue' },
  ];

  const ansiLabels = [
    'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'br_black', 'br_red', 'br_green', 'br_yellow', 'br_blue', 'br_magenta', 'br_cyan', 'br_white'
  ];

  function selectBase(key: keyof SchemeColors, label: string) {
    if (theme.activeSlot?.type === 'base' && theme.activeSlot?.key === key) {
      theme.setActiveSlot(null);
    } else {
      theme.setActiveSlot({ type: 'base', key, label });
    }
  }

  function selectAnsi(index: number) {
    if (theme.activeSlot?.type === 'ansi' && theme.activeSlot?.key === index) {
      theme.setActiveSlot(null);
    } else {
      theme.setActiveSlot({ type: 'ansi', key: index, label: `ANSI ${ansiLabels[index]}` });
    }
  }

  function changeBase(key: keyof SchemeColors, hex: string) {
    theme.scheme.colors[key] = hex;
    theme.updateToml();
  }

  function changeAnsi(index: number, hex: string) {
    theme.scheme.ansi.colors[index] = hex;
    theme.updateToml();
  }

  $effect(() => {
    if (theme.activeSlot) {
      const id = theme.activeSlot.type === 'base'
        ? `slot-${theme.activeSlot.key}`
        : `slot-ansi-${theme.activeSlot.key}`;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
</script>

<div class="flex flex-col gap-5 p-4 overflow-y-auto max-h-full">
  <!-- Top Bar: Header + Adjust Button close to colors -->
  <div class="flex items-center justify-between pb-2 border-b border-[#1c2027]">
    <div class="flex items-center gap-1.5">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">Theme Colors</span>
      <span class="text-[10px] text-neutral-500 font-mono">({theme.scheme.variant})</span>
    </div>

    {#if onOpenAdjustments}
      <button
        onclick={onOpenAdjustments}
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1a1e26] hover:bg-[#202631] border border-[#262b35] hover:border-indigo-500/40 text-neutral-300 hover:text-indigo-300 text-[11px] font-medium transition-all cursor-pointer shadow-xs"
        title="Adjust brightness, contrast, saturation, warmth, and hue"
      >
        <Sliders class="w-3.5 h-3.5 text-indigo-400" />
        <span>Adjust</span>
      </button>
    {/if}
  </div>

  <!-- Accents Section -->
  <div>
    <h3 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Accent & Signals</h3>
    <div class="grid grid-cols-2 gap-1.5">
      {#each accentSlots as slot}
        <ColorSlot
          id="slot-{slot.key}"
          label={slot.label}
          color={theme.scheme.colors[slot.key]}
          isActive={theme.activeSlot?.type === 'base' && theme.activeSlot?.key === slot.key}
          onselect={() => selectBase(slot.key, slot.label)}
          onchange={(hex) => changeBase(slot.key, hex)}
        />
      {/each}
    </div>
  </div>

  <!-- Base Section -->
  <div>
    <h3 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Surfaces & Borders</h3>
    <div class="grid grid-cols-2 gap-1.5">
      {#each baseSlots as slot}
        <ColorSlot
          id="slot-{slot.key}"
          label={slot.label}
          color={theme.scheme.colors[slot.key]}
          isActive={theme.activeSlot?.type === 'base' && theme.activeSlot?.key === slot.key}
          onselect={() => selectBase(slot.key, slot.label)}
          onchange={(hex) => changeBase(slot.key, hex)}
        />
      {/each}
    </div>
  </div>

  <!-- Text Section -->
  <div>
    <h3 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Typography & Selection</h3>
    <div class="grid grid-cols-2 gap-1.5">
      {#each textSlots as slot}
        <ColorSlot
          id="slot-{slot.key}"
          label={slot.label}
          color={theme.scheme.colors[slot.key]}
          isActive={theme.activeSlot?.type === 'base' && theme.activeSlot?.key === slot.key}
          onselect={() => selectBase(slot.key, slot.label)}
          onchange={(hex) => changeBase(slot.key, hex)}
        />
      {/each}
    </div>
  </div>

  <!-- ANSI 16 Grid -->
  <div>
    <h3 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">ANSI Palette (Normal & Bright)</h3>
    <div class="grid grid-cols-8 gap-1.5 p-2 rounded-lg bg-[#14171d] border border-[#262b35]">
      {#each theme.scheme.ansi.colors as color, idx}
        <button
          id="slot-ansi-{idx}"
          onclick={() => selectAnsi(idx)}
          class="aspect-square rounded flex flex-col items-center justify-center relative border transition-all cursor-pointer {theme.activeSlot?.type === 'ansi' && theme.activeSlot?.key === idx ? 'ring-2 ring-indigo-500 border-white scale-105 z-10' : 'border-white/10 hover:border-white/40'}"
          style="background-color: {color};"
          title="{ansiLabels[idx]}: {color}"
        >
          <span class="text-[9px] font-mono mix-blend-difference text-white/80 select-none">{idx}</span>
        </button>
      {/each}
    </div>
  </div>
</div>
