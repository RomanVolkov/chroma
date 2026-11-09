<script lang="ts">
  import { theme } from '../theme.svelte';
  import { SNIPPETS, type SyntaxToken } from '../snippets';
  import { calculateContrastRatio, autoFixContrast } from '../adjustments';
  import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-svelte';

  let selectedLangId = $state('typescript');

  const activeSnippet = $derived(
    SNIPPETS.find((s) => s.id === selectedLangId) || SNIPPETS[0]
  );

  const contrastRatio = $derived(
    calculateContrastRatio(theme.scheme.colors.fg, theme.scheme.colors.bg)
  );
  const selectionRatio = $derived(
    calculateContrastRatio(theme.scheme.colors.selection_fg, theme.scheme.colors.selection_bg)
  );

  const isLowContrast = $derived(contrastRatio < 4.5 || selectionRatio < 3.0);

  function fixContrast() {
    theme.scheme.colors = autoFixContrast(theme.scheme.colors, theme.scheme.variant);
    theme.updateToml();
  }

  function getTokenStyle(token: SyntaxToken, isSelected: boolean): string {
    if (isSelected) {
      if (token.type === 'comment') return `color: ${theme.scheme.colors.fg_muted}; font-style: italic;`;
      return `color: ${theme.scheme.colors.selection_fg};`;
    }

    const c = theme.scheme.colors;
    switch (token.type) {
      case 'comment':
        return `color: ${c.fg_muted}; font-style: italic;`;
      case 'keyword':
        return `color: ${c.accent_alt}; font-weight: 600;`;
      case 'function':
        return `color: ${c.accent}; font-weight: 600;`;
      case 'type':
        return `color: ${c.accent_info};`;
      case 'string':
        return `color: ${theme.scheme.ansi.colors[2]};`;
      case 'number':
      case 'boolean':
        return `color: ${c.warn};`;
      case 'property':
        return `color: ${c.blue};`;
      case 'variable':
        return `color: ${c.fg};`;
      case 'operator':
        return `color: ${c.accent_alt};`;
      case 'tag':
        return `color: ${c.accent}; font-weight: 600;`;
      case 'punctuation':
        return `color: ${c.fg_dim};`;
      default:
        return `color: ${c.fg};`;
    }
  }
</script>

<div
  class="h-full flex flex-col font-mono text-[12px] transition-colors duration-150 select-text overflow-hidden"
  style="background-color: {theme.scheme.colors.bg};"
>
  <!-- Language Selector Tabs Header -->
  <div
    class="h-10 px-4 border-b flex items-center justify-between text-[11px] transition-colors shrink-0"
    style="background-color: {theme.scheme.colors.bg_deep}; border-color: {theme.scheme.colors.border};"
  >
    <div class="flex items-center gap-1.5 overflow-x-auto">
      {#each SNIPPETS as snippet}
        <button
          onclick={() => (selectedLangId = snippet.id)}
          class="px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer {selectedLangId === snippet.id ? 'font-semibold border shadow-xs' : 'opacity-65 hover:opacity-100'}"
          style="
            background-color: {selectedLangId === snippet.id ? theme.scheme.colors.surface_hi : 'transparent'};
            color: {selectedLangId === snippet.id ? theme.scheme.colors.accent : theme.scheme.colors.fg_muted};
            border-color: {selectedLangId === snippet.id ? theme.scheme.colors.border : 'transparent'};
          "
        >
          {snippet.filename}
        </button>
      {/each}
    </div>

    <!-- Active Variant Tag -->
    <div class="flex items-center gap-2 shrink-0">
      <span class="text-[10px] uppercase font-mono tracking-wider font-semibold" style="color: {theme.scheme.colors.fg_muted};">
        {theme.scheme.variant}
      </span>
    </div>
  </div>

  <!-- Big Code Canvas with Line Numbers & Syntax Highlights -->
  <div class="flex-1 p-4 leading-relaxed flex overflow-auto">
    <!-- Line numbers gutter -->
    <div
      class="select-none pr-4 mr-4 border-r text-right space-y-0.5 shrink-0 opacity-40 font-mono text-[11.5px]"
      style="color: {theme.scheme.colors.fg_muted}; border-color: {theme.scheme.colors.border};"
    >
      {#each activeSnippet.lines as _, i}
        <div>{i + 1}</div>
      {/each}
    </div>

    <!-- Code lines -->
    <div class="flex-1 space-y-0.5 whitespace-pre min-w-0">
      {#each activeSnippet.lines as line}
        <div
          class="flex items-center min-h-[1.5em] px-1 rounded-xs transition-colors {line.isSelected ? 'shadow-xs' : ''}"
          style="{line.isSelected ? `background-color: ${theme.scheme.colors.selection_bg};` : ''}"
        >
          {#each line.tokens as token}
            <span style="{getTokenStyle(token, !!line.isSelected)}">{token.text}</span>
          {/each}

          {#if line.hasCursor}
            <span
              class="inline-block w-2 h-4 align-middle ml-0.5 animate-pulse rounded-xs"
              style="background-color: {theme.scheme.colors.cursor};"
            ></span>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Live WCAG Contrast & Collision Status Footer -->
  <div
    class="h-9 px-4 border-t flex items-center justify-between text-[11px] transition-colors shrink-0"
    style="background-color: {theme.scheme.colors.bg_deep}; border-color: {theme.scheme.colors.border};"
  >
    <div class="flex items-center gap-3">
      {#if isLowContrast}
        <div class="flex items-center gap-1.5 text-amber-300">
          <AlertTriangle class="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span class="font-medium text-[11px]">Contrast Alert ({contrastRatio.toFixed(1)}:1)</span>
        </div>
      {:else}
        <div class="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span class="font-medium text-[11px]">WCAG AA Passed ({contrastRatio.toFixed(1)}:1)</span>
        </div>
      {/if}
      <span class="text-neutral-500 text-[10px]">| Selection Contrast: {selectionRatio.toFixed(1)}:1</span>
    </div>

    {#if isLowContrast}
      <button
        onclick={fixContrast}
        class="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10.5px] font-medium transition-colors cursor-pointer"
        title="Automatically adjust luminance to satisfy WCAG AA contrast (4.5:1)"
      >
        <Sparkles class="w-3 h-3" />
        <span>Auto-Fix Contrast</span>
      </button>
    {/if}
  </div>
</div>
