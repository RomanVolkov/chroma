<script lang="ts">
  let {
    id,
    label,
    color,
    isActive = false,
    isHovered = false,
    onselect,
    onhover,
    onleave,
    onchange,
  }: {
    id?: string;
    label: string;
    color: string;
    isActive?: boolean;
    isHovered?: boolean;
    onselect: () => void;
    onhover?: () => void;
    onleave?: () => void;
    onchange: (hex: string) => void;
  } = $props();

  let inputHex = $state('');
  let colorInputRef: HTMLInputElement | undefined = $state();

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

  function openColorPicker() {
    if (!colorInputRef) return;
    if (typeof colorInputRef.showPicker === 'function') {
      try {
        colorInputRef.showPicker();
      } catch {
        colorInputRef.click();
      }
    } else {
      colorInputRef.click();
    }
  }

  function handleDblClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') {
      return;
    }
    e.preventDefault();
    onselect();
    openColorPicker();
  }
</script>

<div
  {id}
  role="button"
  tabindex="0"
  onmouseenter={onhover}
  onmouseleave={onleave}
  onclick={onselect}
  ondblclick={handleDblClick}
  onkeydown={(e) => e.key === 'Enter' && onselect()}
  title="Click to select, double-click to open color editor"
  class="flex items-center justify-between p-1.5 px-2 rounded-lg border transition-all duration-100 cursor-pointer group select-none {isActive ? 'bg-[#1e232d] border-indigo-400 shadow-md ring-2 ring-indigo-500/70 scale-[1.02]' : isHovered ? 'bg-[#1c222c] border-indigo-400 shadow-sm ring-2 ring-indigo-400/60 scale-[1.01]' : 'bg-[#14171d]/80 border-[#262b35] hover:bg-[#1a1e26] hover:border-neutral-700'}"
>
  <div class="flex items-center gap-2 min-w-0">
    <!-- Swatch with hidden color input for custom tweak -->
    <div class="relative w-4 h-4 rounded shadow-xs shrink-0 border border-white/15 overflow-hidden" style="background-color: {color};">
      <input
        bind:this={colorInputRef}
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
