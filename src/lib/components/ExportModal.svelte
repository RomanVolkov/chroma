<script lang="ts">
  import { theme } from '../theme.svelte';
  import { EXPORTERS, type ThemeExporter } from '../exporters';
  import JSZip from 'jszip';
  import { X, Download, Copy, Check, Search, Archive, FileCode } from 'lucide-svelte';

  let { onClose }: { onClose: () => void } = $props();

  let searchQuery = $state('');
  let selectedCategory = $state<'All' | 'Editor' | 'Terminal' | 'CLI' | 'Desktop' | 'App'>('All');
  let selectedExporter = $state<ThemeExporter>(EXPORTERS[0]);
  let copied = $state(false);
  let isZipping = $state(false);

  const filteredExporters = $derived(
    EXPORTERS.filter((exp) => {
      const matchCat = selectedCategory === 'All' || exp.category === selectedCategory;
      const matchQuery = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    })
  );

  const previewCode = $derived(selectedExporter.generate(theme.scheme));
  const slug = $derived(
    theme.scheme.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'theme'
  );
  const currentFilename = $derived(selectedExporter.filename(slug));

  function copyCode() {
    navigator.clipboard.writeText(previewCode);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  function downloadCurrent() {
    const blob = new Blob([previewCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function downloadAllZip() {
    isZipping = true;
    try {
      const zip = new JSZip();
      const folderName = `${slug}-theme-pack`;
      const root = zip.folder(folderName)!;

      for (const exp of EXPORTERS) {
        const content = exp.generate(theme.scheme);
        const fname = exp.filename(slug);
        const subfolder = exp.category.toLowerCase() + 's';
        root.folder(subfolder)?.file(fname, content);
      }

      root.file(`${slug}.toml`, EXPORTERS[0].generate(theme.scheme));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-all-50-themes.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      isZipping = false;
    }
  }
</script>

<!-- Non-blocking Right Studio Drawer (leaves Code Preview and Palette 100% visible) -->
<div class="h-full w-full bg-[#14171d] border-l border-[#262b35] shadow-2xl flex flex-col overflow-hidden select-none">
  <!-- Header -->
  <div class="h-13 border-b border-[#262b35] px-4 flex items-center justify-between shrink-0 bg-[#101318]">
    <div class="flex items-center gap-2.5">
      <FileCode class="w-4 h-4 text-indigo-400" />
      <div>
        <h2 class="text-xs font-semibold text-neutral-100 uppercase tracking-wider">Export into...</h2>
        <p class="text-[10px] text-neutral-400">{EXPORTERS.length} tool formats supported</p>
      </div>
    </div>

    <div class="flex items-center gap-1.5">
      <button
        onclick={downloadAllZip}
        disabled={isZipping}
        class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-indigo-200 text-[11px] font-medium transition-all cursor-pointer"
        title="Download all formats in a single organized zip archive"
      >
        <Archive class="w-3.5 h-3.5" />
        <span>{isZipping ? 'Zipping...' : 'Download (.ZIP)'}</span>
      </button>

      <button
        onclick={onClose}
        class="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors ml-1 cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>

  <!-- Search & Category Filters -->
  <div class="p-3 border-b border-[#1c2027] bg-[#12151b] shrink-0">
    <div class="relative">
      <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Filter formats (e.g. neovim, kitty, idea)..."
        class="w-full bg-[#1a1e26] border border-[#262b35] focus:border-indigo-500 rounded-md pl-8 pr-3 py-1 text-xs text-neutral-200 focus:outline-hidden"
      />
    </div>

    <!-- Category filter tabs -->
    <div class="flex items-center gap-1 mt-2 text-[10px] overflow-x-auto">
      {#each ['All', 'Editor', 'Terminal', 'CLI', 'Desktop', 'App'] as cat}
        <button
          onclick={() => (selectedCategory = cat as any)}
          class="px-2 py-0.5 rounded transition-colors cursor-pointer {selectedCategory === cat ? 'bg-[#262b35] text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-300'}"
        >
          {cat}
        </button>
      {/each}
    </div>
  </div>

  <!-- Main Body: Format selector + preview -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Format selector column (Left) -->
    <div class="w-44 border-r border-[#262b35] flex flex-col bg-[#101318] shrink-0 overflow-y-auto p-1.5 space-y-1">
      {#each filteredExporters as exp}
        <button
          onclick={() => (selectedExporter = exp)}
          class="w-full text-left px-2.5 py-1.5 rounded text-[11px] flex flex-col transition-colors cursor-pointer {selectedExporter.id === exp.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-medium' : 'text-neutral-300 hover:bg-[#1a1e26] border border-transparent'}"
        >
          <span class="truncate">{exp.name}</span>
          <span class="text-[9.5px] text-neutral-400 font-mono truncate">{exp.filename(slug)}</span>
        </button>
      {/each}
    </div>

    <!-- Preview column (Right) -->
    <div class="flex-1 flex flex-col bg-[#0d0f12] overflow-hidden">
      <!-- Toolbar -->
      <div class="h-9 border-b border-[#262b35] px-3 flex items-center justify-between bg-[#14171d]/60 text-xs shrink-0">
        <span class="font-mono text-neutral-300 text-[10.5px] font-medium truncate">{currentFilename}</span>
        <div class="flex items-center gap-1.5">
          <button
            onclick={copyCode}
            class="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a1e26] border border-[#262b35] hover:bg-[#202631] text-[10.5px] text-neutral-300 transition-colors cursor-pointer"
          >
            {#if copied}
              <Check class="w-3 h-3 text-emerald-400" />
              <span class="text-emerald-400">Copied</span>
            {:else}
              <Copy class="w-3 h-3 text-neutral-400" />
              <span>Copy</span>
            {/if}
          </button>

          <button
            onclick={downloadCurrent}
            class="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-[10.5px] font-medium text-white transition-colors cursor-pointer"
          >
            <Download class="w-3 h-3" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- Preview code text -->
      <div class="flex-1 p-3 overflow-auto">
        <pre class="font-mono text-[11px] leading-relaxed text-neutral-300 select-all whitespace-pre-wrap">{previewCode}</pre>
      </div>
    </div>
  </div>
</div>
