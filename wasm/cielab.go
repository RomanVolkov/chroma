package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

// RGB represents an 8-bit sRGB color.
type RGB struct {
	R, G, B uint8
}

// Lab represents a color in the CIELAB (D65) color space.
// L: [0, 100] (Perceptual Lightness)
// a: [-128, 127] (Green to Red)
// b: [-128, 127] (Blue to Yellow)
type Lab struct {
	L, A, B float64
}

// HexToRGB parses a hex color string ("#RRGGBB" or "RRGGBB").
func HexToRGB(hex string) (RGB, error) {
	hex = strings.TrimPrefix(hex, "#")
	if len(hex) != 6 {
		return RGB{}, fmt.Errorf("invalid hex color: %s", hex)
	}
	n, err := strconv.ParseUint(hex, 16, 32)
	if err != nil {
		return RGB{}, err
	}
	return RGB{
		R: uint8((n >> 16) & 0xFF),
		G: uint8((n >> 8) & 0xFF),
		B: uint8(n & 0xFF),
	}, nil
}

// RGBToHex formats an RGB color as "#RRGGBB".
func RGBToHex(c RGB) string {
	return fmt.Sprintf("#%02x%02x%02x", c.R, c.G, c.B)
}

// RGBToLab converts an sRGB color to CIELAB under D65 illuminant.
func RGBToLab(c RGB) Lab {
	// 1. sRGB to linear RGB
	rLinear := sRGBToLinear(float64(c.R) / 255.0)
	gLinear := sRGBToLinear(float64(c.G) / 255.0)
	bLinear := sRGBToLinear(float64(c.B) / 255.0)

	// 2. Linear RGB to CIE XYZ (D65 standard observer matrix)
	x := rLinear*0.4124564 + gLinear*0.3575761 + bLinear*0.1804375
	y := rLinear*0.2126729 + gLinear*0.7151522 + bLinear*0.0721750
	z := rLinear*0.0193339 + gLinear*0.1191920 + bLinear*0.9503041

	// D65 reference white points
	const (
		xn = 0.95047
		yn = 1.00000
		zn = 1.08883
	)

	// 3. XYZ to CIELAB
	fx := labF(x / xn)
	fy := labF(y / yn)
	fz := labF(z / zn)

	l := math.Max(0, math.Min(100, (116.0*fy)-16.0))
	a := 500.0 * (fx - fy)
	b := 200.0 * (fy - fz)

	return Lab{L: l, A: a, B: b}
}

// LabToRGB converts a CIELAB color (D65) back to clamped sRGB.
func LabToRGB(lab Lab) RGB {
	const (
		xn = 0.95047
		yn = 1.00000
		zn = 1.08883
	)

	fy := (lab.L + 16.0) / 116.0
	fx := fy + (lab.A / 500.0)
	fz := fy - (lab.B / 200.0)

	x := xn * labInvF(fx)
	y := yn * labInvF(fy)
	z := zn * labInvF(fz)

	// XYZ to linear RGB (inverse D65 matrix)
	rLinear := x*3.2404542 - y*1.5371385 - z*0.4985314
	gLinear := -x*0.9692660 + y*1.8760108 + z*0.0415560
	bLinear := x*0.0556434 - y*0.2040259 + z*1.0572252

	// Linear RGB to sRGB
	return RGB{
		R: clampUint8(linearToSRGB(rLinear) * 255.0),
		G: clampUint8(linearToSRGB(gLinear) * 255.0),
		B: clampUint8(linearToSRGB(bLinear) * 255.0),
	}
}

// Chroma returns the color saturation/vibrancy in CIELAB (distance from neutral axis).
func (lab Lab) Chroma() float64 {
	return math.Sqrt(lab.A*lab.A + lab.B*lab.B)
}

// Hue returns the hue angle in degrees [0, 360).
func (lab Lab) Hue() float64 {
	h := math.Atan2(lab.B, lab.A) * (180.0 / math.Pi)
	if h < 0 {
		h += 360.0
	}
	return h
}

// DeltaE computes Euclidean CIE76 color distance in CIELAB space.
func DeltaE(c1, c2 Lab) float64 {
	dL := c1.L - c2.L
	dA := c1.A - c2.A
	dB := c1.B - c2.B
	return math.Sqrt(dL*dL + dA*dA + dB*dB)
}

func sRGBToLinear(v float64) float64 {
	if v <= 0.04045 {
		return v / 12.92
	}
	return math.Pow((v+0.055)/1.055, 2.4)
}

func linearToSRGB(v float64) float64 {
	if v <= 0.0031308 {
		return 12.92 * v
	}
	return 1.055*math.Pow(v, 1.0/2.4) - 0.055
}

func labF(t float64) float64 {
	const delta = 6.0 / 29.0
	if t > delta*delta*delta {
		return math.Cbrt(t)
	}
	return (t / (3.0 * delta * delta)) + (4.0 / 29.0)
}

func labInvF(t float64) float64 {
	const delta = 6.0 / 29.0
	if t > delta {
		return t * t * t
	}
	return 3.0 * delta * delta * (t - (4.0 / 29.0))
}

func clampUint8(v float64) uint8 {
	if v <= 0 {
		return 0
	}
	if v >= 255 {
		return 255
	}
	return uint8(math.Round(v))
}

// RelativeLuminance returns standard WCAG 2.0 relative luminance [0, 1].
func RelativeLuminance(c RGB) float64 {
	rLinear := sRGBToLinear(float64(c.R) / 255.0)
	gLinear := sRGBToLinear(float64(c.G) / 255.0)
	bLinear := sRGBToLinear(float64(c.B) / 255.0)
	return 0.2126*rLinear + 0.7152*gLinear + 0.0722*bLinear
}

// ContrastRatio calculates the WCAG 2.0 contrast ratio between two RGB colors (1.0 to 21.0).
func ContrastRatio(c1, c2 RGB) float64 {
	l1 := RelativeLuminance(c1)
	l2 := RelativeLuminance(c2)
	lighter := math.Max(l1, l2)
	darker := math.Min(l1, l2)
	return (lighter + 0.05) / (darker + 0.05)
}

// EnsureContrastHex adjusts the lightness of hex color in CIELAB space so that
// it meets minRatio against bgRGB (default 4.5:1 for WCAG AA).
func EnsureContrastHex(hex string, bgRGB RGB, minRatio float64, isDark bool) string {
	rgb, err := HexToRGB(hex)
	if err != nil {
		if isDark {
			return "#e6edf3"
		}
		return "#1f2328"
	}

	ratio := ContrastRatio(rgb, bgRGB)
	if ratio >= minRatio && strings.ToLower(hex) != strings.ToLower(RGBToHex(bgRGB)) {
		return RGBToHex(rgb)
	}

	lab := RGBToLab(rgb)
	// Ensure minimal chroma so the color doesn't completely collapse to pure grayscale
	if lab.Chroma() < 12.0 {
		lab.A *= 1.5
		lab.B *= 1.5
	}

	bestHex := hex
	bestRatio := ratio

	for step := 0; step < 35; step++ {
		if isDark {
			lab.L = math.Min(96.0, lab.L+2.5)
		} else {
			lab.L = math.Max(8.0, lab.L-2.5)
		}
		candRGB := LabToRGB(lab)
		curRatio := ContrastRatio(candRGB, bgRGB)
		if curRatio > bestRatio {
			bestRatio = curRatio
			bestHex = RGBToHex(candRGB)
		}
		if curRatio >= minRatio {
			return RGBToHex(candRGB)
		}
	}

	return bestHex
}
