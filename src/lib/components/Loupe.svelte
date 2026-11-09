<script lang="ts">
  let { x = 0, y = 0, hex = '#000000', visible = false }: { x: number; y: number; hex: string; visible: boolean } = $props();
</script>

{#if visible}
  <div
    class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 transition-transform duration-75"
    style="left: {x}px; top: {y - 48}px;"
  >
    <!-- Magnified Color Disc -->
    <div
      class="w-12 h-12 rounded-full border-2 border-white/80 shadow-2xl flex items-center justify-center ring-2 ring-black/60 relative overflow-hidden backdrop-blur-xs"
      style="background-color: {hex};"
    >
      <div class="w-1 h-1 bg-white rounded-full ring-1 ring-black"></div>
    </div>

    <!-- Hex Badge -->
    <span class="px-2 py-0.5 rounded bg-black/85 text-[11px] font-mono text-neutral-200 border border-white/10 shadow-lg tracking-wider">
      {hex.toUpperCase()}
    </span>
  </div>
{/if}
