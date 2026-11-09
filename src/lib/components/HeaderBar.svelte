<script lang="ts">
  import { theme } from '../theme.svelte';
  import { Copy, Check, Moon, Sun, Code2, Download } from 'lucide-svelte';

  let { onToggleCode, onOpenExport }: { onToggleCode: () => void; onOpenExport: () => void } = $props();

  let copied = $state(false);

  function copyToml() {
    navigator.clipboard.writeText(theme.toml);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  function handleNameChange(e: Event) {
    theme.scheme.name = (e.target as HTMLInputElement).value;
    theme.updateToml();
  }
</script>

<header class="h-13 border-b border-[#262b35] bg-[#14171d] px-4 flex items-center justify-between select-none shrink-0 z-30">
  <!-- Brand + Theme Name Input -->
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
      <span class="font-bold text-xs tracking-widest uppercase text-neutral-200">CHROMA</span>
    </div>

    <div class="w-[1px] h-4 bg-neutral-800 mx-1"></div>

    <div class="flex items-center gap-1.5">
      <input
        type="text"
        value={theme.scheme.name}
        oninput={handleNameChange}
        placeholder="Theme Name"
        class="bg-[#1a1e26] border border-[#262b35] hover:border-neutral-700 focus:border-indigo-500 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-200 focus:outline-hidden w-44 tracking-wide"
      />
    </div>
  </div>

  <!-- Right Actions: Variant Toggle, Preview Code, Copy, Export into... -->
  <div class="flex items-center gap-2">
    <!-- Dark / Light Variant Segmented Control -->
    <div class="flex items-center bg-[#1a1e26] border border-[#262b35] rounded-lg p-0.5 text-xs">
      <button
        onclick={() => theme.setVariant('dark')}
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors {theme.scheme.variant === 'dark' ? 'bg-[#262b35] text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'}"
        title="Dark Scheme Variant"
      >
        <Moon class="w-3.5 h-3.5" />
        <span class="text-[11px]">Dark</span>
      </button>
      <button
        onclick={() => theme.setVariant('light')}
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors {theme.scheme.variant === 'light' ? 'bg-[#262b35] text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'}"
        title="Light Scheme Variant"
      >
        <Sun class="w-3.5 h-3.5" />
        <span class="text-[11px]">Light</span>
      </button>
    </div>

    <div class="w-[1px] h-4 bg-neutral-800 mx-1"></div>

    <!-- Toggle Raw TOML View -->
    <button
      onclick={onToggleCode}
      class="p-1.5 rounded-lg border border-[#262b35] bg-[#1a1e26] hover:bg-[#202631] text-neutral-300 transition-colors cursor-pointer"
      title="View Raw TOML"
    >
      <Code2 class="w-4 h-4" />
    </button>

    <!-- Copy Dotfiles TOML -->
    <button
      onclick={copyToml}
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262b35] bg-[#1a1e26] hover:bg-[#202631] text-xs font-medium text-neutral-200 transition-all cursor-pointer"
      title="Copy dotfiles TOML to clipboard"
    >
      {#if copied}
        <Check class="w-3.5 h-3.5 text-emerald-400" />
        <span class="text-emerald-400 text-[11px]">Copied!</span>
      {:else}
        <Copy class="w-3.5 h-3.5 text-neutral-400" />
        <span class="text-[11px]">Copy TOML</span>
      {/if}
    </button>

    <!-- Primary Export Button: "Export into..." -->
    <button
      onclick={onOpenExport}
      class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
      title="Export theme into 50 popular dev tools"
    >
      <Download class="w-3.5 h-3.5" />
      <span class="text-[11px]">Export into...</span>
    </button>
  </div>
</header>
