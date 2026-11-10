<script lang="ts">
  import { theme } from '../theme.svelte';
  import { SNIPPETS, type SyntaxToken } from '../snippets';
  import { calculateContrastRatio, autoFixContrast } from '../adjustments';
  import { Sparkles, CheckCircle, AlertTriangle, X } from 'lucide-svelte';

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

  const isFgMutedActive = $derived(
    theme.activeSlot?.type === 'base' && theme.activeSlot?.key === 'fg_muted'
  );
  const isFgMutedHovered = $derived(
    theme.hoveredSlot?.type === 'base' && theme.hoveredSlot?.key === 'fg_muted'
  );

  function fixContrast() {
    theme.scheme.colors = autoFixContrast(theme.scheme.colors, theme.scheme.variant);
    theme.updateToml();
  }

  interface TokenMapping {
    type: 'base' | 'ansi';
    key: keyof SchemeColors | number;
    label: string;
    roleName: string;
  }

  function getTokenMapping(token: SyntaxToken, isSelected: boolean): TokenMapping {
    switch (token.type) {
      case 'comment':
        return { type: 'base', key: 'fg_muted', label: 'fg_muted', roleName: 'Comment' };
      case 'keyword':
        return { type: 'base', key: 'accent_alt', label: 'accent_alt (Keyword)', roleName: 'Keyword' };
      case 'function':
        return { type: 'base', key: 'blue', label: 'blue (Function)', roleName: 'Function' };
      case 'type':
        return { type: 'base', key: 'accent_info', label: 'accent_info (Type)', roleName: 'Type' };
      case 'string':
        return { type: 'ansi', key: 2, label: 'ANSI green', roleName: 'String' };
      case 'number':
      case 'boolean':
        return { type: 'base', key: 'warn', label: 'warn (Constant)', roleName: 'Constant/Number' };
      case 'property':
        return { type: 'base', key: 'accent_info', label: 'accent_info (Property)', roleName: 'Property' };
      case 'variable':
        return isSelected
          ? { type: 'base', key: 'selection_fg', label: 'selection_fg', roleName: 'Selection Text' }
          : { type: 'base', key: 'fg', label: 'fg', roleName: 'Variable' };
      case 'operator':
        return { type: 'base', key: 'accent_info', label: 'accent_info (Operator)', roleName: 'Operator' };
      case 'tag':
        return { type: 'base', key: 'accent', label: 'accent', roleName: 'Tag' };
      case 'punctuation':
        return { type: 'base', key: 'fg_dim', label: 'fg_dim', roleName: 'Punctuation' };
      default:
        return isSelected
          ? { type: 'base', key: 'selection_fg', label: 'selection_fg', roleName: 'Selection Text' }
          : { type: 'base', key: 'fg', label: 'fg', roleName: 'Text' };
    }
  }

  function isTokenActive(token: SyntaxToken, isSelected: boolean): boolean {
    if (!theme.activeSlot) return false;
    const mapping = getTokenMapping(token, isSelected);
    return theme.activeSlot.type === mapping.type && theme.activeSlot.key === mapping.key;
  }

  function handleTokenClick(e: MouseEvent, token: SyntaxToken, isSelected: boolean) {
    e.stopPropagation();
    const mapping = getTokenMapping(token, isSelected);
    if (
      theme.activeSlot &&
      theme.activeSlot.type === mapping.type &&
      theme.activeSlot.key === mapping.key
    ) {
      theme.setActiveSlot(null);
    } else {
      theme.setActiveSlot({
        type: mapping.type,
        key: mapping.key,
        label: mapping.label,
      });
    }
  }

  function handleLineClick(e: MouseEvent, line: CodeLine) {
    if (line.isSelected) {
      e.stopPropagation();
      if (
        theme.activeSlot &&
        theme.activeSlot.type === 'base' &&
        theme.activeSlot.key === 'selection_bg'
      ) {
        theme.setActiveSlot(null);
      } else {
        theme.setActiveSlot({
          type: 'base',
          key: 'selection_bg',
          label: 'selection_bg',
        });
      }
    }
  }

  function handleBackgroundClick() {
    if (
      theme.activeSlot &&
      theme.activeSlot.type === 'base' &&
      theme.activeSlot.key === 'bg'
    ) {
      theme.setActiveSlot(null);
    } else {
      theme.setActiveSlot({
        type: 'base',
        key: 'bg',
        label: 'bg',
      });
    }
  }

  function getTokenStyle(token: SyntaxToken, isSelected: boolean): string {
    const c = theme.scheme.colors;
    const a = theme.scheme.ansi.colors;
    switch (token.type) {
      case 'comment':
        return `color: ${c.fg_muted}; font-style: italic;`;
      case 'keyword':
        return `color: ${c.accent_alt || a[5]}; font-weight: 600;`;
      case 'function':
        return `color: ${c.blue || a[4]}; font-weight: 600;`;
      case 'type':
        return `color: ${c.accent_info || a[6]};`;
      case 'string':
        return `color: ${a[2]};`;
      case 'number':
      case 'boolean':
        return `color: ${c.warn || a[3]};`;
      case 'property':
        return `color: ${c.accent_info || a[6]};`;
      case 'variable':
        return `color: ${isSelected ? (c.selection_fg || c.fg) : c.fg};`;
      case 'operator':
        return `color: ${c.accent_info || a[6]};`;
      case 'tag':
        return `color: ${c.accent || a[5]}; font-weight: 600;`;
      case 'punctuation':
        return `color: ${c.fg_dim};`;
      default:
        return `color: ${isSelected ? (c.selection_fg || c.fg) : c.fg};`;
    }
  }
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') theme.setActiveSlot(null); }} />

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

    <!-- Active Variant Tag & Active Slot Pill -->
    <div class="flex items-center gap-2.5 shrink-0">
      {#if theme.activeSlot}
        {@const activeColor = theme.activeSlot.type === 'base' ? (theme.scheme.colors as any)[theme.activeSlot.key] : theme.scheme.ansi.colors[theme.activeSlot.key as number]}
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#14171d]/90 border border-indigo-500/40 text-[11px] font-medium text-neutral-200 shadow-xs animate-in fade-in duration-100">
          <span class="text-neutral-400 text-[10px]">Slot:</span>
          <span class="text-indigo-300 font-semibold">{theme.activeSlot.label}</span>
          <span class="w-2.5 h-2.5 rounded-full border border-white/20 inline-block shrink-0 shadow-xs" style="background-color: {activeColor};"></span>
          <span class="text-[10px] font-mono text-neutral-400">{activeColor}</span>
          <button
            onclick={(e) => { e.stopPropagation(); theme.setActiveSlot(null); }}
            class="ml-0.5 p-0.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
            title="Drop selection (Esc or click again)"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      {/if}

      <span class="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-60" style="color: {theme.scheme.colors.fg_muted};">
        {theme.scheme.variant}
      </span>
    </div>
  </div>

  <!-- Big Code Canvas with Line Numbers & Syntax Highlights -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={handleBackgroundClick}
    class="flex-1 p-4 leading-relaxed flex overflow-auto cursor-default"
    title="Click empty canvas to select background color"
  >
    <!-- Line numbers gutter -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onmouseenter={() => theme.setHoveredSlot({ type: 'base', key: 'fg_muted', label: 'fg_muted' })}
      onmouseleave={() => theme.setHoveredSlot(null)}
      onclick={(e) => {
        e.stopPropagation();
        if (theme.activeSlot?.type === 'base' && theme.activeSlot?.key === 'fg_muted') {
          theme.setActiveSlot(null);
        } else {
          theme.setActiveSlot({ type: 'base', key: 'fg_muted', label: 'fg_muted' });
        }
      }}
      class="select-none pr-4 mr-4 border-r text-right space-y-0.5 shrink-0 font-mono text-[11.5px] cursor-pointer transition-all px-0.5 -mx-0.5 rounded-xs {isFgMutedActive ? 'ring-2 ring-indigo-400 bg-indigo-500/25 font-bold shadow-xs' : isFgMutedHovered ? 'ring-1 ring-indigo-300/80 bg-white/15' : ''}"
      style="color: {theme.scheme.colors.fg_muted}; border-color: {theme.scheme.colors.border};"
      title="Click to edit Line Numbers / Comments (fg_muted: {theme.scheme.colors.fg_muted})"
    >
      {#each activeSnippet.lines as _, i}
        <div>{i + 1}</div>
      {/each}
    </div>

    <!-- Code lines -->
    <div class="flex-1 space-y-0.5 whitespace-pre min-w-0">
      {#each activeSnippet.lines as line}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          onmouseenter={() => line.isSelected && theme.setHoveredSlot({ type: 'base', key: 'selection_bg', label: 'selection_bg' })}
          onmouseleave={() => theme.setHoveredSlot(null)}
          onclick={(e) => handleLineClick(e, line)}
          class="flex items-center min-h-[1.5em] px-1 rounded-xs transition-colors {line.isSelected ? 'shadow-xs cursor-pointer' : ''}"
          style="{line.isSelected ? `background-color: ${theme.scheme.colors.selection_bg};` : ''}"
          title={line.isSelected ? 'Click to edit selection_bg' : undefined}
        >
          {#each line.tokens as token}
            {@const mapping = getTokenMapping(token, !!line.isSelected)}
            {@const active = isTokenActive(token, !!line.isSelected)}
            {@const hovered = theme.hoveredSlot?.type === mapping.type && theme.hoveredSlot?.key === mapping.key}
            {@const colorVal = mapping.type === 'base' ? (theme.scheme.colors as any)[mapping.key] : theme.scheme.ansi.colors[mapping.key as number]}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
              onmouseenter={() => theme.setHoveredSlot({ type: mapping.type, key: mapping.key, label: mapping.label })}
              onmouseleave={() => theme.setHoveredSlot(null)}
              onclick={(e) => handleTokenClick(e, token, !!line.isSelected)}
              class="cursor-pointer transition-all px-0.5 -mx-0.5 rounded-xs hover:ring-1 hover:ring-indigo-400 hover:bg-white/10 {active ? 'ring-2 ring-indigo-400 bg-indigo-500/25 font-bold shadow-xs' : hovered ? 'ring-1 ring-indigo-300/80 bg-white/15' : ''}"
              style="{getTokenStyle(token, !!line.isSelected)}"
              title="Click to edit {mapping.roleName} ({mapping.label}: {colorVal})"
            >{token.text}</span>
          {/each}

          {#if line.hasCursor}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
              onmouseenter={() => theme.setHoveredSlot({ type: 'base', key: 'cursor', label: 'cursor' })}
              onmouseleave={() => theme.setHoveredSlot(null)}
              onclick={(e) => {
                e.stopPropagation();
                if (theme.activeSlot?.type === 'base' && theme.activeSlot?.key === 'cursor') {
                  theme.setActiveSlot(null);
                } else {
                  theme.setActiveSlot({ type: 'base', key: 'cursor', label: 'cursor' });
                }
              }}
              class="inline-block w-2 h-4 align-middle ml-0.5 animate-pulse rounded-xs cursor-pointer hover:ring-2 hover:ring-indigo-400"
              style="background-color: {theme.scheme.colors.cursor};"
              title="Click to edit cursor ({theme.scheme.colors.cursor})"
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
