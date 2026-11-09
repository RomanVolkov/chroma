package main

// Scheme represents the user's dotfiles theme schema.
type Scheme struct {
	Name    string            `json:"name" toml:"name"`
	Variant string            `json:"variant" toml:"variant"` // "dark" or "light"
	Colors  Colors            `json:"colors" toml:"colors"`
	ANSI    ANSI              `json:"ansi" toml:"ansi"`
	Tools   map[string]string `json:"tools,omitempty" toml:"tools,omitempty"`
}

// Colors maps all UI roles.
type Colors struct {
	Bg          string `json:"bg" toml:"bg"`
	BgAlt       string `json:"bg_alt" toml:"bg_alt"`
	BgDeep      string `json:"bg_deep" toml:"bg_deep"`
	Fg          string `json:"fg" toml:"fg"`
	FgDim       string `json:"fg_dim" toml:"fg_dim"`
	FgMuted     string `json:"fg_muted" toml:"fg_muted"`
	Surface     string `json:"surface" toml:"surface"`
	SurfaceHi   string `json:"surface_hi" toml:"surface_hi"`
	Border      string `json:"border" toml:"border"`
	Overlay     string `json:"overlay" toml:"overlay"`
	Cursor      string `json:"cursor" toml:"cursor"`
	SelectionBg string `json:"selection_bg" toml:"selection_bg"`
	SelectionFg string `json:"selection_fg" toml:"selection_fg"`
	Accent      string `json:"accent" toml:"accent"`
	AccentAlt   string `json:"accent_alt" toml:"accent_alt"`
	AccentInfo  string `json:"accent_info" toml:"accent_info"`
	Warn        string `json:"warn" toml:"warn"`
	Blue        string `json:"blue" toml:"blue"`
}

// ANSI contains the 16 terminal colors (0-7 normal, 8-15 bright).
type ANSI struct {
	Colors [16]string `json:"colors" toml:"colors"`
}
