package main

import (
	"math"
	"testing"
)

func TestHexAndRGB(t *testing.T) {
	tests := []struct {
		hex string
		rgb RGB
	}{
		{"#000000", RGB{0, 0, 0}},
		{"#ffffff", RGB{255, 255, 255}},
		{"#ff0000", RGB{255, 0, 0}},
		{"#00ff00", RGB{0, 255, 0}},
		{"#0000ff", RGB{0, 0, 255}},
		{"#282c34", RGB{40, 44, 52}},
	}

	for _, tc := range tests {
		parsed, err := HexToRGB(tc.hex)
		if err != nil {
			t.Fatalf("HexToRGB(%s) failed: %v", tc.hex, err)
		}
		if parsed != tc.rgb {
			t.Errorf("HexToRGB(%s) = %v; want %v", tc.hex, parsed, tc.rgb)
		}

		formatted := RGBToHex(tc.rgb)
		if formatted != tc.hex {
			t.Errorf("RGBToHex(%v) = %s; want %s", tc.rgb, formatted, tc.hex)
		}
	}
}

func TestColorSpaceRoundTrip(t *testing.T) {
	colors := []RGB{
		{0, 0, 0},
		{255, 255, 255},
		{128, 128, 128},
		{230, 80, 40},
		{40, 180, 220},
		{18, 22, 28},
	}

	for _, original := range colors {
		lab := RGBToLab(original)
		recovered := LabToRGB(lab)

		diffR := math.Abs(float64(int(original.R) - int(recovered.R)))
		diffG := math.Abs(float64(int(original.G) - int(recovered.G)))
		diffB := math.Abs(float64(int(original.B) - int(recovered.B)))

		// Allow at most 1 unit rounding tolerance per 8-bit channel
		if diffR > 1 || diffG > 1 || diffB > 1 {
			t.Errorf("Roundtrip mismatch for %v: got %v (Lab=%v)", original, recovered, lab)
		}
	}
}

func TestDeltaE(t *testing.T) {
	c1 := RGBToLab(RGB{255, 0, 0})
	c2 := RGBToLab(RGB{255, 0, 0})
	c3 := RGBToLab(RGB{0, 255, 0})

	if DeltaE(c1, c2) != 0 {
		t.Errorf("DeltaE of identical colors must be 0, got %f", DeltaE(c1, c2))
	}
	if DeltaE(c1, c3) <= 0 {
		t.Errorf("DeltaE of different colors must be > 0")
	}
	if DeltaE(c1, c3) != DeltaE(c3, c1) {
		t.Errorf("DeltaE must be symmetric")
	}
}
