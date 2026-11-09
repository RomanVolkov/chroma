<script lang="ts">
  import { theme } from '../theme.svelte';
  import { calculateContrastRatio, autoFixContrast } from '../adjustments';
  import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-svelte';

  type Lang = 'typescript' | 'go' | 'rust' | 'python' | 'lua' | 'html';

  let selectedLang = $state<Lang>('typescript');

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
</script>

<div
  class="rounded-lg border shadow-lg overflow-hidden font-mono text-[11.5px] transition-colors duration-150 select-text flex flex-col"
  style="background-color: {theme.scheme.colors.bg}; border-color: {theme.scheme.colors.border};"
>
  <!-- Language Selector Tabs Header -->
  <div
    class="px-3 py-1.5 border-b flex items-center justify-between text-[11px] transition-colors gap-2"
    style="background-color: {theme.scheme.colors.bg_deep}; border-color: {theme.scheme.colors.border};"
  >
    <div class="flex items-center gap-1.5 overflow-x-auto">
      {#each [
        { id: 'typescript', label: 'TypeScript', ext: 'palette.ts' },
        { id: 'go', label: 'Go', ext: 'main.go' },
        { id: 'rust', label: 'Rust', ext: 'theme.rs' },
        { id: 'python', label: 'Python', ext: 'theme.py' },
        { id: 'lua', label: 'Lua', ext: 'init.lua' },
        { id: 'html', label: 'HTML', ext: 'index.html' }
      ] as item}
        <button
          onclick={() => (selectedLang = item.id as Lang)}
          class="px-2 py-0.5 rounded text-[10.5px] transition-colors cursor-pointer {selectedLang === item.id ? 'font-semibold border' : 'opacity-60 hover:opacity-100'}"
          style="
            background-color: {selectedLang === item.id ? theme.scheme.colors.surface_hi : 'transparent'};
            color: {selectedLang === item.id ? theme.scheme.colors.accent : theme.scheme.colors.fg_muted};
            border-color: {selectedLang === item.id ? theme.scheme.colors.border : 'transparent'};
          "
        >
          {item.ext}
        </button>
      {/each}
    </div>

    <!-- Variant Badge -->
    <span class="text-[10px] uppercase font-mono tracking-wider shrink-0" style="color: {theme.scheme.colors.fg_muted};">
      {theme.scheme.variant}
    </span>
  </div>

  <!-- Code Block with Line Numbers & Syntax Highlights -->
  <div class="p-3 leading-relaxed flex overflow-x-auto min-h-[190px]">
    <!-- Line numbers gutter -->
    <div
      class="select-none pr-3 mr-3 border-r text-right space-y-0.5 shrink-0"
      style="color: {theme.scheme.colors.fg_muted}; border-color: {theme.scheme.colors.border}; opacity: 0.6;"
    >
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>10</div>
    </div>

    <!-- Code lines per language -->
    <div class="flex-1 space-y-0.5 whitespace-pre">
      {#if selectedLang === 'typescript'}
        <div><span style="color: {theme.scheme.colors.fg_muted};">// Perceptual CIELAB theme extractor</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">export async function</span> <span style="color: {theme.scheme.colors.accent};">buildPalette</span><span style="color: {theme.scheme.colors.fg};">(</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">img</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">ImageData</span><span style="color: {theme.scheme.colors.fg};">,</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">variant</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.ansi.colors[2]};">'{theme.scheme.variant}'</span></div>
        <div><span style="color: {theme.scheme.colors.fg};">)</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">Promise</span><span style="color: {theme.scheme.colors.fg_dim};">&lt;</span><span style="color: {theme.scheme.colors.accent_info};">ThemeScheme</span><span style="color: {theme.scheme.colors.fg_dim};">&gt;</span> <span style="color: {theme.scheme.colors.fg};">{"{"}</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">const</span> <span style="color: {theme.scheme.colors.fg};">clusters</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">await</span> <span style="color: {theme.scheme.colors.accent};">quantizeLab</span><span style="color: {theme.scheme.colors.fg};">(img, </span><span style="color: {theme.scheme.colors.warn};">16</span><span style="color: {theme.scheme.colors.fg};">);</span></div>
        <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
          <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">const</span> <span style="color: {theme.scheme.colors.selection_fg};">contrast</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent};">wcagRatio</span><span style="color: {theme.scheme.colors.selection_fg};">(clusters, </span><span style="color: {theme.scheme.colors.warn};">4.5</span><span style="color: {theme.scheme.colors.selection_fg};">);</span>
        </div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">return</span> <span style="color: {theme.scheme.colors.accent};">mapRoles</span><span style="color: {theme.scheme.colors.fg};">(clusters, variant);</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
        <div><span style="color: {theme.scheme.colors.fg};">{"}"}</span></div>
      {:else if selectedLang === 'go'}
        <div><span style="color: {theme.scheme.colors.fg_muted};">// Package theme handles color science</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">package</span> <span style="color: {theme.scheme.colors.fg};">theme</span></div>
        <div>&nbsp;</div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">type</span> <span style="color: {theme.scheme.colors.accent_info};">Palette</span> <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">struct</span> <span style="color: {theme.scheme.colors.fg};">{"{"}</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">Dominant</span> <span style="color: {theme.scheme.colors.accent_info};">[]LabColor</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">Contrast</span> <span style="color: {theme.scheme.colors.accent_info};">float64</span></div>
        <div><span style="color: {theme.scheme.colors.fg};">{"}"}</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">func</span> <span style="color: {theme.scheme.colors.accent};">Extract</span><span style="color: {theme.scheme.colors.fg};">(img</span> <span style="color: {theme.scheme.colors.accent_info};">image.Image</span><span style="color: {theme.scheme.colors.fg};">) (*</span><span style="color: {theme.scheme.colors.accent_info};">Palette</span><span style="color: {theme.scheme.colors.fg};">, </span><span style="color: {theme.scheme.colors.accent_alt};">error</span><span style="color: {theme.scheme.colors.fg};">) {"{"}</span></div>
        <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
          <span style="color: {theme.scheme.colors.selection_fg};">return &amp;</span><span style="color: {theme.scheme.colors.accent_info};">Palette</span><span style="color: {theme.scheme.colors.selection_fg};">{"{"}Contrast: </span><span style="color: {theme.scheme.colors.warn};">4.5</span><span style="color: {theme.scheme.colors.selection_fg};">{"}"}, </span><span style="color: {theme.scheme.colors.warn};">nil</span>
        </div>
        <div><span style="color: {theme.scheme.colors.fg};">{"}"}</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
      {:else if selectedLang === 'rust'}
        <div><span style="color: {theme.scheme.colors.fg_muted};">// Chroma color clustering in Rust</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">use</span> <span style="color: {theme.scheme.colors.accent_info};">palette</span><span style="color: {theme.scheme.colors.fg_dim};">::</span><span style="color: {theme.scheme.colors.fg};">Lab;</span></div>
        <div>&nbsp;</div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">pub fn</span> <span style="color: {theme.scheme.colors.accent};">extract</span><span style="color: {theme.scheme.colors.fg};">(pixels: &amp;[</span><span style="color: {theme.scheme.colors.accent_info};">u8</span><span style="color: {theme.scheme.colors.fg};">]) -&gt; </span><span style="color: {theme.scheme.colors.accent_info};">Result</span><span style="color: {theme.scheme.colors.fg};">&lt;</span><span style="color: {theme.scheme.colors.accent_info};">Theme</span><span style="color: {theme.scheme.colors.fg};">, </span><span style="color: {theme.scheme.colors.accent_info};">Error</span><span style="color: {theme.scheme.colors.fg};">&gt; {"{"}</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">let</span> <span style="color: {theme.scheme.colors.fg};">centroids</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent};">kmeans_lab</span><span style="color: {theme.scheme.colors.fg};">(pixels, </span><span style="color: {theme.scheme.colors.warn};">16</span><span style="color: {theme.scheme.colors.fg};">)?;</span></div>
        <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
          <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">let</span> <span style="color: {theme.scheme.colors.selection_fg};">contrast</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent};">wcag_ratio</span><span style="color: {theme.scheme.colors.selection_fg};">(&amp;centroids, </span><span style="color: {theme.scheme.colors.warn};">4.5</span><span style="color: {theme.scheme.colors.selection_fg};">);</span>
        </div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.accent_info};">Ok</span><span style="color: {theme.scheme.colors.fg};">(</span><span style="color: {theme.scheme.colors.accent_info};">Theme</span><span style="color: {theme.scheme.colors.fg_dim};">::</span><span style="color: {theme.scheme.colors.accent};">new</span><span style="color: {theme.scheme.colors.fg};">(</span><span style="color: {theme.scheme.ansi.colors[2]};">"{theme.scheme.name}"</span><span style="color: {theme.scheme.colors.fg};">, centroids))</span></div>
        <div><span style="color: {theme.scheme.colors.fg};">{"}"}</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
      {:else if selectedLang === 'python'}
        <div><span style="color: {theme.scheme.colors.fg_muted};"># Chroma Python theme generator</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">from</span> <span style="color: {theme.scheme.colors.fg};">dataclasses</span> <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">import</span> <span style="color: {theme.scheme.colors.accent_info};">dataclass</span></div>
        <div>&nbsp;</div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">@dataclass</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">class</span> <span style="color: {theme.scheme.colors.accent_info};">ChromaTheme</span><span style="color: {theme.scheme.colors.fg};">:</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">name</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">str</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.ansi.colors[2]};">"{theme.scheme.name}"</span></div>
        <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
          <span style="color: {theme.scheme.colors.selection_fg};">contrast</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">float</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.warn};">4.5</span>
        </div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">variant</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">str</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.ansi.colors[2]};">"{theme.scheme.variant}"</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
      {:else if selectedLang === 'lua'}
        <div><span style="color: {theme.scheme.colors.fg_muted};">-- Neovim colorscheme configuration</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">local</span> <span style="color: {theme.scheme.colors.fg};">hl = vim.api.nvim_set_hl</span></div>
        <div>&nbsp;</div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">local</span> <span style="color: {theme.scheme.colors.accent};">setup</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">function</span><span style="color: {theme.scheme.colors.fg};">()</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">hl(</span><span style="color: {theme.scheme.colors.warn};">0</span><span style="color: {theme.scheme.colors.fg};">, </span><span style="color: {theme.scheme.ansi.colors[2]};">"Function"</span><span style="color: {theme.scheme.colors.fg};">, {"{"} fg = </span><span style="color: {theme.scheme.ansi.colors[2]};">"{theme.scheme.colors.accent}"</span><span style="color: {theme.scheme.colors.fg};">, bold = </span><span style="color: {theme.scheme.colors.warn};">true</span> <span style="color: {theme.scheme.colors.fg};">{"}"})</span></div>
        <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
          <span style="color: {theme.scheme.colors.selection_fg};">hl(</span><span style="color: {theme.scheme.colors.warn};">0</span><span style="color: {theme.scheme.colors.selection_fg};">, </span><span style="color: {theme.scheme.ansi.colors[2]};">"Visual"</span><span style="color: {theme.scheme.colors.selection_fg};">, {"{"} bg = </span><span style="color: {theme.scheme.ansi.colors[2]};">"{theme.scheme.colors.selection_bg}"</span><span style="color: {theme.scheme.colors.selection_fg};"> {"}"})</span>
        </div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">hl(</span><span style="color: {theme.scheme.colors.warn};">0</span><span style="color: {theme.scheme.colors.fg};">, </span><span style="color: {theme.scheme.ansi.colors[2]};">"Keyword"</span><span style="color: {theme.scheme.colors.fg};">, {"{"} fg = </span><span style="color: {theme.scheme.ansi.colors[2]};">"{theme.scheme.colors.accent_alt}"</span> <span style="color: {theme.scheme.colors.fg};">{"}"})</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">end</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
      {:else if selectedLang === 'html'}
        <div><span style="color: {theme.scheme.colors.fg_muted};">&lt;!-- Chroma theme design system --&gt;</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt};">&lt;</span><span style="color: {theme.scheme.colors.accent}; font-weight: 600;">section</span> <span style="color: {theme.scheme.colors.accent_info};">class</span><span style="color: {theme.scheme.colors.fg_dim};">=</span><span style="color: {theme.scheme.ansi.colors[2]};">"studio-card"</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span></div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt};">&lt;</span><span style="color: {theme.scheme.colors.accent}; font-weight: 600;">h1</span> <span style="color: {theme.scheme.colors.accent_info};">class</span><span style="color: {theme.scheme.colors.fg_dim};">=</span><span style="color: {theme.scheme.ansi.colors[2]};">"title"</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span><span style="color: {theme.scheme.colors.accent};">{theme.scheme.name}</span><span style="color: {theme.scheme.colors.accent_alt};">&lt;/</span><span style="color: {theme.scheme.colors.accent};">h1</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span></div>
        <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
          <span style="color: {theme.scheme.colors.accent_alt};">&lt;</span><span style="color: {theme.scheme.colors.accent}; font-weight: 600;">p</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span><span style="color: {theme.scheme.colors.selection_fg};">Selected text demonstration</span><span style="color: {theme.scheme.colors.accent_alt};">&lt;/</span><span style="color: {theme.scheme.colors.accent};">p</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span>
        </div>
        <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt};">&lt;</span><span style="color: {theme.scheme.colors.accent}; font-weight: 600;">button</span> <span style="color: {theme.scheme.colors.accent_info};">type</span><span style="color: {theme.scheme.colors.fg_dim};">=</span><span style="color: {theme.scheme.ansi.colors[2]};">"button"</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span><span style="color: {theme.scheme.colors.fg};">Export</span><span style="color: {theme.scheme.colors.accent_alt};">&lt;/</span><span style="color: {theme.scheme.colors.accent};">button</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span></div>
        <div><span style="color: {theme.scheme.colors.accent_alt};">&lt;/</span><span style="color: {theme.scheme.colors.accent}; font-weight: 600;">section</span><span style="color: {theme.scheme.colors.accent_alt};">&gt;</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
      {/if}
    </div>
  </div>

  <!-- Live WCAG Contrast & Collision Status Footer -->
  <div
    class="px-3 py-1.5 border-t flex items-center justify-between text-[11px] transition-colors"
    style="background-color: {theme.scheme.colors.bg_deep}; border-color: {theme.scheme.colors.border};"
  >
    <div class="flex items-center gap-2">
      {#if isLowContrast}
        <AlertTriangle class="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span class="text-amber-300 text-[10.5px]">
          Contrast: {contrastRatio.toFixed(1)}:1 (Low)
        </span>
      {:else}
        <CheckCircle class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span class="text-emerald-400 text-[10.5px]">
          WCAG AA: {contrastRatio.toFixed(1)}:1
        </span>
      {/if}
      <span class="text-neutral-500 text-[10px]">| Sel: {selectionRatio.toFixed(1)}:1</span>
    </div>

    {#if isLowContrast}
      <button
        onclick={fixContrast}
        class="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-medium transition-colors cursor-pointer"
        title="Automatically adjust luminance to satisfy WCAG AA contrast (4.5:1)"
      >
        <Sparkles class="w-2.5 h-2.5" />
        <span>Auto-Fix Contrast</span>
      </button>
    {/if}
  </div>
</div>
