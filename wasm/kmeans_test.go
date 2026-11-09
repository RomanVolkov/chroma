package main

import (
	"testing"
)

func TestClusterPixels(t *testing.T) {
	// Create synthetic pixels: 100 reds, 100 blues, 100 greens
	var pixels []RGB
	for i := 0; i < 100; i++ {
		pixels = append(pixels, RGB{240, 20, 20})
	}
	for i := 0; i < 100; i++ {
		pixels = append(pixels, RGB{20, 240, 20})
	}
	for i := 0; i < 100; i++ {
		pixels = append(pixels, RGB{20, 20, 240})
	}

	clusters := ClusterPixels(pixels, 3, 20)

	if len(clusters) != 3 {
		t.Fatalf("expected 3 clusters, got %d", len(clusters))
	}

	// Each cluster should hold roughly 1/3 of the pixels (~0.33 weight)
	for _, c := range clusters {
		if c.Weight < 0.25 || c.Weight > 0.40 {
			t.Errorf("cluster %s has unexpected weight %f", c.Hex, c.Weight)
		}
	}
}

func TestClusterPixelsEmpty(t *testing.T) {
	clusters := ClusterPixels(nil, 5, 10)
	if clusters != nil {
		t.Errorf("expected nil for empty pixels, got %v", clusters)
	}
}
