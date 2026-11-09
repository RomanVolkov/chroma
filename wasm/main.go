//go:build js && wasm

package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"
)

func main() {
	c := make(chan struct{}, 0)

	engine := js.Global().Get("Object").New()
	engine.Set("extractPalette", js.FuncOf(extractPalette))
	engine.Set("serializeToml", js.FuncOf(serializeToml))

	js.Global().Set("__chromaEngine", engine)
	fmt.Println("[Wasm] Chroma Engine successfully loaded and bound to __chromaEngine")

	<-c
}

type ExtractResult struct {
	Swatches []Swatch `json:"swatches"`
	Scheme   Scheme   `json:"scheme"`
	TOML     string   `json:"toml"`
}

func extractPalette(this js.Value, args []js.Value) any {
	if len(args) < 3 {
		return js.ValueOf(map[string]any{"error": "insufficient arguments"})
	}

	pixelUint8Array := args[0]
	variant := args[1].String()
	k := args[2].Int()
	if k <= 0 {
		k = 16
	}

	length := pixelUint8Array.Get("length").Int()
	bytes := make([]byte, length)
	js.CopyBytesToGo(bytes, pixelUint8Array)

	// Convert RGBA buffer to []RGB (skipping transparent pixels)
	numPixels := length / 4
	pixels := make([]RGB, 0, numPixels)
	for i := 0; i < length; i += 4 {
		a := bytes[i+3]
		if a < 128 {
			continue
		}
		pixels = append(pixels, RGB{
			R: bytes[i],
			G: bytes[i+1],
			B: bytes[i+2],
		})
	}

	if len(pixels) == 0 {
		return js.ValueOf(map[string]any{"error": "no visible pixels found"})
	}

	swatches := ClusterPixels(pixels, k, 20)
	scheme := MapSwatchesToScheme("Chroma Theme", variant, swatches)
	tomlStr := SerializeTOML(scheme)

	result := ExtractResult{
		Swatches: swatches,
		Scheme:   scheme,
		TOML:     tomlStr,
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return js.ValueOf(map[string]any{"error": err.Error()})
	}

	return js.ValueOf(string(jsonBytes))
}

func serializeToml(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return js.ValueOf("")
	}
	schemeJSON := args[0].String()
	var scheme Scheme
	if err := json.Unmarshal([]byte(schemeJSON), &scheme); err != nil {
		return js.ValueOf(fmt.Sprintf("# Error parsing scheme JSON: %v", err))
	}
	return js.ValueOf(SerializeTOML(scheme))
}
