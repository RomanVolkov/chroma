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
