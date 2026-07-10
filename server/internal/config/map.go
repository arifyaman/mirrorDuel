package config

import (
	"bytes"
	"fmt"
	"image/color"
	"image/png"
	"os"
)

// DefaultMapWidth/DefaultMapHeight define the obstacle grid resolution.
// Each tile is 1x1 world units, so a 20x20 grid exactly covers the
// FloorSize=20 arena (tile centers land on half-integer coordinates,
// e.g. -9.5, -8.5, ..., 9.5).
const (
	DefaultMapWidth  = 20
	DefaultMapHeight = 20
)

// LoadObstacleMap reads a PNG file and converts it into a row-major
// blocking-tile grid: white pixels are empty (false), black (or any pixel
// with luminance below the midpoint) are blocking (true). Fully
// transparent pixels are always treated as empty, regardless of RGB.
// The image must be exactly DefaultMapWidth x DefaultMapHeight pixels.
func LoadObstacleMap(path string) (grid []bool, width, height int, err error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, 0, 0, fmt.Errorf("read map file %q: %w", path, err)
	}
	img, err := png.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, 0, 0, fmt.Errorf("decode map png %q: %w", path, err)
	}

	bounds := img.Bounds()
	width = bounds.Dx()
	height = bounds.Dy()
	if width != DefaultMapWidth || height != DefaultMapHeight {
		return nil, 0, 0, fmt.Errorf("map image %q must be %dx%d pixels, got %dx%d", path, DefaultMapWidth, DefaultMapHeight, width, height)
	}

	grid = make([]bool, width*height)
	for row := 0; row < height; row++ {
		for col := 0; col < width; col++ {
			c := img.At(bounds.Min.X+col, bounds.Min.Y+row)
			grid[row*width+col] = isBlockingPixel(c)
		}
	}
	return grid, width, height, nil
}

// isBlockingPixel decides whether a pixel counts as a blocking tile.
// Fully transparent pixels are always treated as empty (white). Otherwise
// the pixel is blocking if its (un-premultiplied) luminance is below 50%.
func isBlockingPixel(c color.Color) bool {
	r, g, b, a := c.RGBA() // 16-bit per channel, alpha-premultiplied
	if a == 0 {
		return false
	}
	rf := float64(r) / float64(a)
	gf := float64(g) / float64(a)
	bf := float64(b) / float64(a)
	lum := 0.299*rf + 0.587*gf + 0.114*bf
	return lum < 0.5
}

// EmptyObstacleGrid returns a grid with no blocking tiles — used as a
// safety-net fallback when the configured map file is missing or invalid,
// so the server still starts with a playable (empty) arena instead of
// crashing.
func EmptyObstacleGrid(width, height int) []bool {
	return make([]bool, width*height)
}

// BuildObstaclesFromGrid converts a row-major blocking-tile grid into a
// list of 1x1 Obstacle cubes. The whole grid is centered on the world
// origin, so tile centers land on half-integer coordinates.
func BuildObstaclesFromGrid(grid []bool, width, height int) []Obstacle {
	halfW := float32(width) / 2
	halfH := float32(height) / 2

	var obstacles []Obstacle
	for row := 0; row < height; row++ {
		for col := 0; col < width; col++ {
			if !grid[row*width+col] {
				continue
			}
			obstacles = append(obstacles, Obstacle{
				X:         float32(col) - halfW + 0.5,
				Z:         float32(row) - halfH + 0.5,
				HalfWidth: 0.5,
				HalfDepth: 0.5,
			})
		}
	}
	return obstacles
}

// PackObstacleBitmask packs a row-major bool grid into a bit-packed byte
// slice (LSB-first within each byte) for compact network transmission to
// clients.
func PackObstacleBitmask(grid []bool, width, height int) []byte {
	n := width * height
	bitmask := make([]byte, (n+7)/8)
	for i, blocked := range grid {
		if blocked {
			bitmask[i/8] |= 1 << uint(i%8)
		}
	}
	return bitmask
}
