<script lang="ts">
  let {
    label,
    color,
    isActive = false,
    onselect,
    onchange,
  }: {
    label: string;
    color: string;
    isActive?: boolean;
    onselect: () => void;
    onchange: (hex: string) => void;
  } = $props();

  let inputHex = $state('');

  $effect(() => {
    inputHex = color;
  });

  function handleHexChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    inputHex = val;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      onchange(val);
    }
  }

  function handleColorInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    inputHex = val;
    onchange(val);
  }
</script>

<div
  role="button"
  tabindex="0"
  onclick={onselect}
  onkeydown={(e) => e.key === 'Enter' && onselect()}
  class="flex items-center justify-between p-1.5 px-2 rounded-lg border transition-all cursor-pointer group select-none {isActive ? 'bg-[#1e232d] border-indigo-500 shadow-sm ring-1 ring-indigo-500/50' : 'bg-[#14171d]/80 border-[#262b35] hover:bg-[#1a1e26] hover:border-neutral-700'}"
>
  <div class="flex items-center gap-2 min-w-0">
    <!-- Swatch with hidden color input for custom tweak -->
    <div class="relative w-4 h-4 rounded shadow-xs shrink-0 border border-white/15 overflow-hidden" style="background-color: {color};">
      <input
        type="color"
        value={color}
        oninput={handleColorInput}
        class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        title="Open color wheel"
      />
    </div>
    <span class="text-xs text-neutral-300 truncate font-mono text-[11px]">{label}</span>
  </div>

  <input
    type="text"
    value={inputHex}
    oninput={handleHexChange}
    class="w-16 bg-transparent text-right font-mono text-[11px] text-neutral-400 group-hover:text-neutral-200 focus:text-neutral-100 focus:outline-hidden uppercase"
    spellcheck="false"
  />
</div>
