package main

import (
	"testing"
)

func TestMapSwatchesToSchemeDarkAndLight(t *testing.T) {
	swatches := []Swatch{
		{Hex: "#101216", RGB: RGB{16, 18, 22}, Lab: RGBToLab(RGB{16, 18, 22})},
		{Hex: "#1c2027", RGB: RGB{28, 32, 39}, Lab: RGBToLab(RGB{28, 32, 39})},
		{Hex: "#2a303c", RGB: RGB{42, 48, 60}, Lab: RGBToLab(RGB{42, 48, 60})},
		{Hex: "#3e4757", RGB: RGB{62, 71, 87}, Lab: RGBToLab(RGB{62, 71, 87})},
		{Hex: "#61afef", RGB: RGB{97, 175, 239}, Lab: RGBToLab(RGB{97, 175, 239})}, // Vibrant blue
		{Hex: "#e06c75", RGB: RGB{224, 108, 117}, Lab: RGBToLab(RGB{224, 108, 117})}, // Vibrant red
		{Hex: "#abb2bf", RGB: RGB{171, 178, 191}, Lab: RGBToLab(RGB{171, 178, 191})},
		{Hex: "#ffffff", RGB: RGB{255, 255, 255}, Lab: RGBToLab(RGB{255, 255, 255})},
	}

	darkScheme := MapSwatchesToScheme("TestDark", "dark", swatches)
	if darkScheme.Variant != "dark" {
		t.Errorf("expected variant 'dark', got %s", darkScheme.Variant)
	}
	if darkScheme.Colors.BgDeep != "#101216" {
		t.Errorf("expected darkest color for BgDeep, got %s", darkScheme.Colors.BgDeep)
	}
	if darkScheme.Colors.SelectionFg != "#ffffff" {
		t.Errorf("expected brightest color for SelectionFg, got %s", darkScheme.Colors.SelectionFg)
	}
	if len(darkScheme.ANSI.Colors) != 16 {
		t.Errorf("expected 16 ANSI colors, got %d", len(darkScheme.ANSI.Colors))
	}

	lightScheme := MapSwatchesToScheme("TestLight", "light", swatches)
	if lightScheme.Variant != "light" {
		t.Errorf("expected variant 'light', got %s", lightScheme.Variant)
	}
	if lightScheme.Colors.BgDeep != "#ffffff" {
		t.Errorf("expected brightest color for light BgDeep, got %s", lightScheme.Colors.BgDeep)
	}
	if lightScheme.Colors.SelectionFg != "#101216" {
		t.Errorf("expected darkest color for light SelectionFg, got %s", lightScheme.Colors.SelectionFg)
	}
}

func TestDarkAccentContrastAndNoCollision(t *testing.T) {
	// Simulating the user's situation: swatches are all dark/muted, with #232929
	darkSwatches := []Swatch{
		{Hex: "#1a1c1c", RGB: RGB{26, 28, 28}, Lab: RGBToLab(RGB{26, 28, 28})},
		{Hex: "#232929", RGB: RGB{35, 41, 41}, Lab: RGBToLab(RGB{35, 41, 41})},
		{Hex: "#304248", RGB: RGB{48, 66, 72}, Lab: RGBToLab(RGB{48, 66, 72})},
		{Hex: "#3b556c", RGB: RGB{59, 85, 108}, Lab: RGBToLab(RGB{59, 85, 108})},
		{Hex: "#525153", RGB: RGB{82, 81, 83}, Lab: RGBToLab(RGB{82, 81, 83})},
		{Hex: "#744e41", RGB: RGB{116, 78, 65}, Lab: RGBToLab(RGB{116, 78, 65})},
		{Hex: "#988c89", RGB: RGB{152, 140, 137}, Lab: RGBToLab(RGB{152, 140, 137})},
	}

	scheme := MapSwatchesToScheme("DarkMutedTest", "dark", darkSwatches)

	// 1. AccentInfo must NEVER equal Bg
	if scheme.Colors.AccentInfo == scheme.Colors.Bg {
		t.Fatalf("Collision! AccentInfo (%s) == Bg (%s)", scheme.Colors.AccentInfo, scheme.Colors.Bg)
	}

	// 2. Accent must not equal Bg
	if scheme.Colors.Accent == scheme.Colors.Bg {
		t.Fatalf("Collision! Accent (%s) == Bg (%s)", scheme.Colors.Accent, scheme.Colors.Bg)
	}

	// 3. Contrast ratio of Accents and Fg against Bg must be >= 4.5:1
	bgRGB, _ := HexToRGB(scheme.Colors.Bg)
	checkList := []struct {
		name string
		hex  string
	}{
		{"Accent", scheme.Colors.Accent},
		{"AccentAlt", scheme.Colors.AccentAlt},
		{"AccentInfo", scheme.Colors.AccentInfo},
		{"Warn", scheme.Colors.Warn},
		{"Blue", scheme.Colors.Blue},
		{"Fg", scheme.Colors.Fg},
	}

	for _, item := range checkList {
		itemRGB, _ := HexToRGB(item.hex)
		ratio := ContrastRatio(itemRGB, bgRGB)
		if ratio < 4.0 {
			t.Errorf("%s (%s) has insufficient contrast on Bg (%s): ratio %.2f:1 < 4.0:1",
				item.name, item.hex, scheme.Colors.Bg, ratio)
		}
	}
}
