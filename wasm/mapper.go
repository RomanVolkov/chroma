package main

import (
	"math"
	"sort"
)

// MapSwatchesToScheme generates a complete Scheme from extracted swatches and variant ("dark" | "light").
func MapSwatchesToScheme(name string, variant string, swatches []Swatch) Scheme {
	if len(swatches) == 0 {
		return defaultDarkScheme(name)
	}

	if variant != "light" {
		variant = "dark"
	}

	// 1. Sort by Lightness (L*)
	byLightness := make([]Swatch, len(swatches))
	copy(byLightness, swatches)
	sort.Slice(byLightness, func(i, j int) bool {
		return byLightness[i].Lab.L < byLightness[j].Lab.L
	})

	// 2. Sort by Chroma (C*)
	byChroma := make([]Swatch, len(swatches))
	copy(byChroma, swatches)
	sort.Slice(byChroma, func(i, j int) bool {
		return byChroma[i].Lab.Chroma() > byChroma[j].Lab.Chroma()
	})

	n := len(byLightness)
	var colors Colors

	if variant == "dark" {
		// Deepest colors -> backgrounds & surfaces
		colors.BgDeep = byLightness[0].Hex
		colors.Bg = getHexSafe(byLightness, int(math.Min(float64(n-1), 1)))
		colors.BgAlt = getHexSafe(byLightness, int(math.Min(float64(n-1), 2)))
		colors.Surface = getHexSafe(byLightness, int(math.Min(float64(n-1), 3)))
		colors.SurfaceHi = getHexSafe(byLightness, int(math.Min(float64(n-1), 4)))
		colors.Border = getHexSafe(byLightness, int(math.Min(float64(n-1), 5)))
		colors.Overlay = getHexSafe(byLightness, int(math.Min(float64(n-1), 6)))

		// Brightest colors -> foreground text
		colors.SelectionFg = byLightness[n-1].Hex
		colors.Fg = getHexSafe(byLightness, n-2)
		colors.FgDim = getHexSafe(byLightness, n-3)
		colors.FgMuted = getHexSafe(byLightness, n-4)
		colors.SelectionBg = colors.SurfaceHi
	} else {
		// Light mode: inverse lightness
		colors.BgDeep = byLightness[n-1].Hex
		colors.Bg = getHexSafe(byLightness, n-2)
		colors.BgAlt = getHexSafe(byLightness, n-3)
		colors.Surface = getHexSafe(byLightness, n-4)
		colors.SurfaceHi = getHexSafe(byLightness, n-5)
		colors.Border = getHexSafe(byLightness, n-6)
		colors.Overlay = getHexSafe(byLightness, n-7)

		colors.SelectionFg = byLightness[0].Hex
		colors.Fg = getHexSafe(byLightness, 1)
		colors.FgDim = getHexSafe(byLightness, 2)
		colors.FgMuted = getHexSafe(byLightness, 3)
		colors.SelectionBg = colors.SurfaceHi
	}

	// 3. Assign Accents from high chroma with strict WCAG contrast enforcement
	bgRGB, _ := HexToRGB(colors.Bg)
	isDark := variant == "dark"

	// Ensure Accents never merge with Bg and meet WCAG AA contrast (>= 4.5:1)
	colors.Accent = EnsureContrastHex(byChroma[0].Hex, bgRGB, 4.5, isDark)
	colors.Cursor = colors.Accent

	// Find distinct second accent (different hue angle)
	firstHue := byChroma[0].Lab.Hue()
	secondAccent := byChroma[0]
	for _, s := range byChroma[1:] {
		diff := math.Abs(s.Lab.Hue() - firstHue)
		if diff > 180 {
			diff = 360 - diff
		}
		if diff > 45.0 {
			secondAccent = s
			break
		}
	}
	colors.AccentAlt = EnsureContrastHex(secondAccent.Hex, bgRGB, 4.5, isDark)

	// If AccentAlt accidentally ended up identical to Accent, adjust hue angle
	if colors.AccentAlt == colors.Accent {
		lab := RGBToLab(mustRGB(colors.AccentAlt))
		lab.A = -lab.A
		lab.B = -lab.B
		colors.AccentAlt = EnsureContrastHex(RGBToHex(LabToRGB(lab)), bgRGB, 4.5, isDark)
	}

	// Find warm hue (amber/orange/red ~ 20-70 deg)
	warnSwatch := findClosestHue(byChroma, 40.0)
	colors.Warn = EnsureContrastHex(warnSwatch.Hex, bgRGB, 4.5, isDark)

	// Find blue hue (~ 230-260 deg)
	blueSwatch := findClosestHue(byChroma, 240.0)
	colors.Blue = EnsureContrastHex(blueSwatch.Hex, bgRGB, 4.5, isDark)

	// Info accent (cyan/teal ~ 180-210 deg)
	infoSwatch := findClosestHue(byChroma, 195.0)
	colors.AccentInfo = EnsureContrastHex(infoSwatch.Hex, bgRGB, 4.5, isDark)

	// Guard: Ensure Foreground text meets high contrast against background
	colors.Fg = EnsureContrastHex(colors.Fg, bgRGB, 7.0, isDark)
	colors.FgDim = EnsureContrastHex(colors.FgDim, bgRGB, 4.5, isDark)
	colors.FgMuted = EnsureContrastHex(colors.FgMuted, bgRGB, 3.5, isDark)

	// Guard: Ensure selection_fg contrasts on selection_bg, and selection_bg differs from bg
	selBgRGB, _ := HexToRGB(colors.SelectionBg)
	if ContrastRatio(selBgRGB, bgRGB) < 1.3 || colors.SelectionBg == colors.Bg {
		lab := RGBToLab(selBgRGB)
		if isDark {
			lab.L = math.Min(50.0, lab.L+15.0)
		} else {
			lab.L = math.Max(50.0, lab.L-15.0)
		}
		colors.SelectionBg = RGBToHex(LabToRGB(lab))
		selBgRGB = LabToRGB(lab)
	}
	colors.SelectionFg = EnsureContrastHex(colors.SelectionFg, selBgRGB, 4.5, isDark)

	// 4. ANSI 16 Palette
	ansi := generateANSI(colors, byChroma, variant)

	return Scheme{
		Name:    name,
		Variant: variant,
		Colors:  colors,
		ANSI:    ansi,
		Tools: map[string]string{
			"bat": "base16",
		},
	}
}

func getHexSafe(list []Swatch, idx int) string {
	if len(list) == 0 {
		return "#888888"
	}
	if idx < 0 {
		idx = 0
	}
	if idx >= len(list) {
		idx = len(list) - 1
	}
	return list[idx].Hex
}

func findClosestHue(swatches []Swatch, targetHue float64) Swatch {
	bestDiff := 360.0
	bestSwatch := swatches[0]
	for _, s := range swatches {
		diff := math.Abs(s.Lab.Hue() - targetHue)
		if diff > 180 {
			diff = 360 - diff
		}
		if diff < bestDiff {
			bestDiff = diff
			bestSwatch = s
		}
	}
	return bestSwatch
}

func generateANSI(colors Colors, swatches []Swatch, variant string) ANSI {
	bgRGB, _ := HexToRGB(colors.Bg)
	isDark := variant == "dark"

	// Standard hue targets: Red(20), Green(130), Yellow(65), Blue(240), Magenta(310), Cyan(190)
	red := EnsureContrastHex(findClosestHue(swatches, 20.0).Hex, bgRGB, 4.5, isDark)
	green := EnsureContrastHex(findClosestHue(swatches, 130.0).Hex, bgRGB, 4.5, isDark)
	yellow := EnsureContrastHex(findClosestHue(swatches, 65.0).Hex, bgRGB, 4.5, isDark)
	blue := EnsureContrastHex(findClosestHue(swatches, 240.0).Hex, bgRGB, 4.5, isDark)
	magenta := EnsureContrastHex(findClosestHue(swatches, 310.0).Hex, bgRGB, 4.5, isDark)
	cyan := EnsureContrastHex(findClosestHue(swatches, 190.0).Hex, bgRGB, 4.5, isDark)

	var normal [8]string
	if variant == "dark" {
		normal = [8]string{colors.Surface, red, green, yellow, blue, magenta, cyan, colors.Fg}
	} else {
		normal = [8]string{colors.Fg, red, green, yellow, blue, magenta, cyan, colors.Surface}
	}

	var ansi ANSI
	copy(ansi.Colors[0:8], normal[:])

	// Bright slots (8-15): boost lightness by 12% in Lab space
	for i := 0; i < 8; i++ {
		rgb, err := HexToRGB(normal[i])
		if err != nil {
			ansi.Colors[8+i] = normal[i]
			continue
		}
		lab := RGBToLab(rgb)
		if variant == "dark" {
			lab.L = math.Min(100.0, lab.L+12.0)
		} else {
			lab.L = math.Max(0.0, lab.L-12.0)
		}
		ansi.Colors[8+i] = RGBToHex(LabToRGB(lab))
	}

	return ansi
}

func mustRGB(hex string) RGB {
	c, _ := HexToRGB(hex)
	return c
}

func defaultDarkScheme(name string) Scheme {
	return Scheme{
		Name:    name,
		Variant: "dark",
		Colors: Colors{
			Bg:          "#1a1b26",
			BgAlt:       "#16161e",
			BgDeep:      "#13141c",
			Fg:          "#c0caf5",
			FgDim:       "#a9b1d6",
			FgMuted:     "#7aa2f7",
			Surface:     "#24283b",
			SurfaceHi:   "#292e42",
			Border:      "#414868",
			Overlay:     "#565f89",
			Cursor:      "#7aa2f7",
			SelectionBg: "#283457",
			SelectionFg: "#c0caf5",
			Accent:      "#7aa2f7",
			AccentAlt:   "#bb9af7",
			AccentInfo:  "#7dcfff",
			Warn:        "#e0af68",
			Blue:        "#7aa2f7",
		},
		ANSI: ANSI{
			Colors: [16]string{
				"#15161e", "#f7768e", "#9ece6a", "#e0af68", "#7aa2f7", "#bb9af7", "#7dcfff", "#a9b1d6",
				"#414868", "#f7768e", "#9ece6a", "#e0af68", "#7aa2f7", "#bb9af7", "#7dcfff", "#c0caf5",
			},
		},
		Tools: map[string]string{
			"bat": "base16",
		},
	}
}
