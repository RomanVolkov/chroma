<script lang="ts">
  import { theme } from '../theme.svelte';
  import {
    DEFAULT_ADJUSTMENTS,
    applyAdjustmentsToColors,
    autoFixContrast,
    type ThemeAdjustments
  } from '../adjustments';
  import { Sliders, RotateCcw, Sparkles, X, Sun, Contrast, Droplets, Thermometer, RefreshCw } from 'lucide-svelte';

  let { onClose }: { onClose: () => void } = $props();

  let adjustments = $state<ThemeAdjustments>({ ...DEFAULT_ADJUSTMENTS });
  let baseColorsSnapshot = $state({ ...theme.scheme.colors });

  function handleSliderChange() {
    theme.scheme.colors = applyAdjustmentsToColors(baseColorsSnapshot, adjustments);
    theme.updateToml();
  }

  function resetAdjustments() {
    adjustments = { ...DEFAULT_ADJUSTMENTS };
    theme.scheme.colors = { ...baseColorsSnapshot };
    theme.updateToml();
  }

  function handleAutoFix() {
    theme.scheme.colors = autoFixContrast(theme.scheme.colors, theme.scheme.variant);
    baseColorsSnapshot = autoFixContrast(baseColorsSnapshot, theme.scheme.variant);
    theme.updateToml();
  }
</script>

<div class="h-full flex flex-col bg-[#14171d] border-l border-[#262b35] select-none text-xs">
  <!-- Header -->
  <div class="h-12 border-b border-[#262b35] px-4 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-2">
      <Sliders class="w-4 h-4 text-indigo-400" />
      <span class="font-semibold text-neutral-200">Global Adjustments</span>
    </div>
    <div class="flex items-center gap-1">
      <button
        onclick={resetAdjustments}
        class="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
        title="Reset all adjustments"
      >
        <RotateCcw class="w-3.5 h-3.5" />
      </button>
      <button
        onclick={onClose}
        class="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>

  <!-- Sliders Container -->
  <div class="flex-1 p-4 space-y-5 overflow-y-auto">
    <!-- Auto-Fix Contrast Action Box -->
    <div class="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-medium text-neutral-200 text-[11.5px]">Harmonize & Contrast</span>
        <span class="text-[10px] text-indigo-300">WCAG AA</span>
      </div>
      <p class="text-[10.5px] text-neutral-400 leading-relaxed">
        Pushes text and accent luminance apart from backgrounds and selection colors to prevent collisions.
      </p>
      <button
        onclick={handleAutoFix}
        class="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors cursor-pointer shadow-sm"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>Auto-Fix Collisions & Contrast</span>
      </button>
    </div>

    <!-- 1. Brightness Slider -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-neutral-300 text-[11px]">
        <div class="flex items-center gap-1.5">
          <Sun class="w-3.5 h-3.5 text-neutral-400" />
          <span>Brightness</span>
        </div>
        <span class="font-mono text-neutral-400">{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}</span>
      </div>
      <input
        type="range"
        min="-50"
        max="50"
        bind:value={adjustments.brightness}
        oninput={handleSliderChange}
        class="w-full accent-indigo-500 h-1.5 bg-[#262b35] rounded-lg cursor-pointer"
      />
    </div>

    <!-- 2. Contrast Slider -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-neutral-300 text-[11px]">
        <div class="flex items-center gap-1.5">
          <Contrast class="w-3.5 h-3.5 text-neutral-400" />
          <span>Contrast</span>
        </div>
        <span class="font-mono text-neutral-400">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
      </div>
      <input
        type="range"
        min="-50"
        max="50"
        bind:value={adjustments.contrast}
        oninput={handleSliderChange}
        class="w-full accent-indigo-500 h-1.5 bg-[#262b35] rounded-lg cursor-pointer"
      />
    </div>

    <!-- 3. Saturation Slider -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-neutral-300 text-[11px]">
        <div class="flex items-center gap-1.5">
          <Droplets class="w-3.5 h-3.5 text-neutral-400" />
          <span>Saturation</span>
        </div>
        <span class="font-mono text-neutral-400">{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}</span>
      </div>
      <input
        type="range"
        min="-100"
        max="100"
        bind:value={adjustments.saturation}
        oninput={handleSliderChange}
        class="w-full accent-indigo-500 h-1.5 bg-[#262b35] rounded-lg cursor-pointer"
      />
    </div>

    <!-- 4. Temperature Slider -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-neutral-300 text-[11px]">
        <div class="flex items-center gap-1.5">
          <Thermometer class="w-3.5 h-3.5 text-neutral-400" />
          <span>Warmth / Temperature</span>
        </div>
        <span class="font-mono text-neutral-400">{adjustments.temperature > 0 ? `+${adjustments.temperature}` : adjustments.temperature}</span>
      </div>
      <input
        type="range"
        min="-100"
        max="100"
        bind:value={adjustments.temperature}
        oninput={handleSliderChange}
        class="w-full accent-amber-500 h-1.5 bg-[#262b35] rounded-lg cursor-pointer"
      />
    </div>

    <!-- 5. Hue Shift Slider -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-neutral-300 text-[11px]">
        <div class="flex items-center gap-1.5">
          <RefreshCw class="w-3.5 h-3.5 text-neutral-400" />
          <span>Hue Rotation</span>
        </div>
        <span class="font-mono text-neutral-400">{adjustments.hueShift}°</span>
      </div>
      <input
        type="range"
        min="-180"
        max="180"
        bind:value={adjustments.hueShift}
        oninput={handleSliderChange}
        class="w-full accent-indigo-500 h-1.5 bg-[#262b35] rounded-lg cursor-pointer"
      />
    </div>
  </div>
</div>
