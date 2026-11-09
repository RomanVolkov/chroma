<script lang="ts">
  import { theme } from '../theme.svelte';
</script>

<div
  class="rounded-lg border shadow-lg overflow-hidden font-mono text-[11.5px] transition-colors duration-150 select-text"
  style="background-color: {theme.scheme.colors.bg}; border-color: {theme.scheme.colors.border};"
>
  <!-- Minimal Editor Tab Header (No macOS window dots) -->
  <div
    class="px-3 py-1.5 border-b flex items-center justify-between text-[11px] transition-colors"
    style="background-color: {theme.scheme.colors.bg_deep}; border-color: {theme.scheme.colors.border};"
  >
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: {theme.scheme.colors.accent};"></span>
      <span class="font-medium" style="color: {theme.scheme.colors.fg};">palette.ts</span>
    </div>
    <span class="text-[10px] uppercase font-mono tracking-wider" style="color: {theme.scheme.colors.fg_muted};">
      {theme.scheme.variant}
    </span>
  </div>

  <!-- Code Block with Line Numbers & Syntax Highlights -->
  <div class="p-3 leading-relaxed flex overflow-x-auto">
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

    <!-- Code lines -->
    <div class="flex-1 space-y-0.5 whitespace-pre">
      <div><span style="color: {theme.scheme.colors.fg_muted};">// Perceptual CIELAB theme extractor</span></div>
      <div><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">export async function</span> <span style="color: {theme.scheme.colors.accent};">buildPalette</span><span style="color: {theme.scheme.colors.fg};">(</span></div>
      <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">img</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">ImageData</span><span style="color: {theme.scheme.colors.fg};">,</span></div>
      <div class="pl-4"><span style="color: {theme.scheme.colors.fg};">variant</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.ansi.colors[2]};">'{theme.scheme.variant}'</span></div>
      <div><span style="color: {theme.scheme.colors.fg};">)</span><span style="color: {theme.scheme.colors.fg_dim};">:</span> <span style="color: {theme.scheme.colors.accent_info};">Promise</span><span style="color: {theme.scheme.colors.fg_dim};">&lt;</span><span style="color: {theme.scheme.colors.accent_info};">ThemeScheme</span><span style="color: {theme.scheme.colors.fg_dim};">&gt;</span> <span style="color: {theme.scheme.colors.fg};">{"{"}</span></div>
      <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">const</span> <span style="color: {theme.scheme.colors.fg};">clusters</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">await</span> <span style="color: {theme.scheme.colors.accent};">quantizeLab</span><span style="color: {theme.scheme.colors.fg};">(img, </span><span style="color: {theme.scheme.colors.warn};">16</span><span style="color: {theme.scheme.colors.fg};">);</span></div>
      <!-- Line 7 with simulated active selection -->
      <div class="pl-4 -mx-1 px-1 rounded-xs inline-block" style="background-color: {theme.scheme.colors.selection_bg};">
        <span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">const</span> <span style="color: {theme.scheme.colors.selection_fg};">contrast</span> <span style="color: {theme.scheme.colors.accent_alt};">=</span> <span style="color: {theme.scheme.colors.accent};">wcagRatio</span><span style="color: {theme.scheme.colors.selection_fg};">(clusters, </span><span style="color: {theme.scheme.colors.warn};">4.5</span><span style="color: {theme.scheme.colors.selection_fg};">);</span>
      </div>
      <div class="pl-4"><span style="color: {theme.scheme.colors.accent_alt}; font-weight: 600;">return</span> <span style="color: {theme.scheme.colors.accent};">mapRoles</span><span style="color: {theme.scheme.colors.fg};">(clusters, variant);</span><span class="inline-block w-1.5 h-3.5 align-middle ml-0.5 animate-pulse rounded-xs" style="background-color: {theme.scheme.colors.cursor};"></span></div>
      <div><span style="color: {theme.scheme.colors.fg};">{"}"}</span></div>
    </div>
  </div>
</div>
