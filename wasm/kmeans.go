package main

import (
	"math"
	"math/rand"
	"sort"
)

// Swatch represents an extracted color cluster.
type Swatch struct {
	Hex    string  `json:"hex"`
	RGB    RGB     `json:"rgb"`
	Lab    Lab     `json:"lab"`
	Weight float64 `json:"weight"` // fraction of image [0.0 - 1.0]
	Count  int     `json:"count"`
}

// ClusterPixels runs k-means clustering on the given pixel slice in CIELAB space.
func ClusterPixels(pixels []RGB, k int, maxIter int) []Swatch {
	if len(pixels) == 0 {
		return nil
	}
	if k > len(pixels) {
		k = len(pixels)
	}

	// 1. Convert pixels to Lab space
	labs := make([]Lab, len(pixels))
	for i, p := range pixels {
		labs[i] = RGBToLab(p)
	}

	// 2. K-means++ initialization
	centroids := initKMeansPlusPlus(labs, k)

	assignments := make([]int, len(labs))
	for iter := 0; iter < maxIter; iter++ {
		// Assignment step
		for i, lab := range labs {
			bestDist := math.MaxFloat64
			bestIdx := 0
			for cIdx, centroid := range centroids {
				dist := DeltaE(lab, centroid)
				if dist < bestDist {
					bestDist = dist
					bestIdx = cIdx
				}
			}
			assignments[i] = bestIdx
		}

		// Update step
		sumL := make([]float64, k)
		sumA := make([]float64, k)
		sumB := make([]float64, k)
		counts := make([]int, k)

		for i, cIdx := range assignments {
			sumL[cIdx] += labs[i].L
			sumA[cIdx] += labs[i].A
			sumB[cIdx] += labs[i].B
			counts[cIdx]++
		}

		maxShift := 0.0
		for cIdx := 0; cIdx < k; cIdx++ {
			if counts[cIdx] == 0 {
				// Re-seed empty cluster with random pixel
				randIdx := rand.Intn(len(labs))
				centroids[cIdx] = labs[randIdx]
				continue
			}
			newCenter := Lab{
				L: sumL[cIdx] / float64(counts[cIdx]),
				A: sumA[cIdx] / float64(counts[cIdx]),
				B: sumB[cIdx] / float64(counts[cIdx]),
			}
			shift := DeltaE(centroids[cIdx], newCenter)
			if shift > maxShift {
				maxShift = shift
			}
			centroids[cIdx] = newCenter
		}

		if maxShift < 0.25 {
			break
		}
	}

	// Count final membership and calculate weights
	counts := make([]int, k)
	for _, cIdx := range assignments {
		counts[cIdx]++
	}

	totalPixels := float64(len(pixels))
	swatches := make([]Swatch, 0, k)
	for i, centroid := range centroids {
		if counts[i] == 0 {
			continue
		}
		rgb := LabToRGB(centroid)
		swatches = append(swatches, Swatch{
			Hex:    RGBToHex(rgb),
			RGB:    rgb,
			Lab:    centroid,
			Weight: float64(counts[i]) / totalPixels,
			Count:  counts[i],
		})
	}

	// Sort dominant swatches by weight descending
	sort.Slice(swatches, func(i, j int) bool {
		return swatches[i].Weight > swatches[j].Weight
	})

	return swatches
}

// initKMeansPlusPlus chooses initial centroids with probability proportional to squared distance.
func initKMeansPlusPlus(points []Lab, k int) []Lab {
	centroids := make([]Lab, 0, k)
	r := rand.New(rand.NewSource(42)) // deterministic seed for reproducibility

	// Pick first centroid uniformly at random
	firstIdx := r.Intn(len(points))
	centroids = append(centroids, points[firstIdx])

	distances := make([]float64, len(points))

	for len(centroids) < k {
		sumDistSq := 0.0
		for i, pt := range points {
			// Find distance to closest chosen centroid
			minD := math.MaxFloat64
			for _, c := range centroids {
				d := DeltaE(pt, c)
				if d < minD {
					minD = d
				}
			}
			d2 := minD * minD
			distances[i] = d2
			sumDistSq += d2
		}

		if sumDistSq == 0 {
			// All remaining points are duplicates
			for len(centroids) < k {
				centroids = append(centroids, points[r.Intn(len(points))])
			}
			break
		}

		// Roulette wheel selection
		target := r.Float64() * sumDistSq
		cum := 0.0
		chosen := 0
		for i, d2 := range distances {
			cum += d2
			if cum >= target {
				chosen = i
				break
			}
		}
		centroids = append(centroids, points[chosen])
	}

	return centroids
}
