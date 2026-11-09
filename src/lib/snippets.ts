export interface SyntaxToken {
  type:
    | 'comment'
    | 'keyword'
    | 'function'
    | 'type'
    | 'string'
    | 'number'
    | 'boolean'
    | 'operator'
    | 'variable'
    | 'property'
    | 'punctuation'
    | 'text'
    | 'tag';
  text: string;
}

export type CodeLine = {
  tokens: SyntaxToken[];
  isSelected?: boolean;
  hasCursor?: boolean;
};

export interface LanguageSnippet {
  id: string;
  name: string;
  filename: string;
  lines: CodeLine[];
}

export const SNIPPETS: LanguageSnippet[] = [
  // 1. TypeScript
  {
    id: 'typescript',
    name: 'TypeScript',
    filename: 'theme_engine.ts',
    lines: [
      { tokens: [{ type: 'comment', text: '/**' }] },
      { tokens: [{ type: 'comment', text: ' * Chroma Perceptual Palette Engine' }] },
      { tokens: [{ type: 'comment', text: ' * Quantizes image pixels into accessible CIELAB color tokens.' }] },
      { tokens: [{ type: 'comment', text: ' */' }] },
      { tokens: [
        { type: 'keyword', text: 'import' },
        { type: 'text', text: ' { ' },
        { type: 'variable', text: 'KMeans' },
        { type: 'punctuation', text: ', ' },
        { type: 'variable', text: 'LabCluster' },
        { type: 'text', text: ' } ' },
        { type: 'keyword', text: 'from' },
        { type: 'text', text: ' ' },
        { type: 'string', text: "'./quantize/kmeans'" },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'export interface' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'PaletteOptions' },
        { type: 'text', text: ' <' },
        { type: 'type', text: 'T' },
        { type: 'text', text: ' ' },
        { type: 'keyword', text: 'extends' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'Record' },
        { type: 'text', text: '<' },
        { type: 'type', text: 'string' },
        { type: 'punctuation', text: ', ' },
        { type: 'type', text: 'string' },
        { type: 'text', text: '>> {' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'property', text: 'readonly variant' },
        { type: 'punctuation', text: ': ' },
        { type: 'string', text: "'dark'" },
        { type: 'operator', text: ' | ' },
        { type: 'string', text: "'light'" },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'property', text: 'clusterCount' },
        { type: 'operator', text: '?: ' },
        { type: 'type', text: 'number' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'property', text: 'minContrastRatio' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'number' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [{ type: 'text', text: '}' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'export async function' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'extractColorTokens' },
        { type: 'text', text: '<' },
        { type: 'type', text: 'T' },
        { type: 'text', text: '>(' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'variable', text: 'buffer' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'Uint8ClampedArray' },
        { type: 'punctuation', text: ', ' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'variable', text: 'options' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'PaletteOptions' },
        { type: 'text', text: '<' },
        { type: 'type', text: 'T' },
        { type: 'text', text: '>' }
      ]},
      { tokens: [
        { type: 'text', text: '): ' },
        { type: 'type', text: 'Promise' },
        { type: 'text', text: '<' },
        { type: 'type', text: 'LabCluster' },
        { type: 'text', text: '[]> {' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'if' },
        { type: 'text', text: ' (!' },
        { type: 'variable', text: 'buffer' },
        { type: 'operator', text: ' || ' },
        { type: 'variable', text: 'buffer' },
        { type: 'property', text: '.length' },
        { type: 'operator', text: ' === ' },
        { type: 'number', text: '0' },
        { type: 'text', text: ') {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'throw new' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'Error' },
        { type: 'text', text: '(' },
        { type: 'string', text: "'Buffer cannot be empty'" },
        { type: 'text', text: ');' }
      ]},
      { tokens: [{ type: 'text', text: '  }' }] },
      { tokens: [] },
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'const' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'k' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'options' },
        { type: 'property', text: '.clusterCount' },
        { type: 'operator', text: ' ?? ' },
        { type: 'number', text: '16' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'const' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'engine' },
        { type: 'operator', text: ' = ' },
        { type: 'keyword', text: 'new' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'KMeans' },
        { type: 'text', text: '({ ' },
        { type: 'property', text: 'iterations' },
        { type: 'punctuation', text: ': ' },
        { type: 'number', text: '25' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'tolerance' },
        { type: 'punctuation', text: ': ' },
        { type: 'number', text: '0.25' },
        { type: 'text', text: ' });' }
      ]},
      { tokens: [] },
      { tokens: [{ type: 'comment', text: '  // Active selection line test' }], isSelected: true },
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'const' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'clusters' },
        { type: 'operator', text: ' = ' },
        { type: 'keyword', text: 'await' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'engine' },
        { type: 'property', text: '.clusterPixels' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'buffer' },
        { type: 'punctuation', text: ', ' },
        { type: 'variable', text: 'k' },
        { type: 'text', text: ');' }
      ], isSelected: true },
      { tokens: [] },
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'clusters' },
        { type: 'property', text: '.filter' },
        { type: 'text', text: '((' },
        { type: 'variable', text: 'c' },
        { type: 'text', text: ') ' },
        { type: 'operator', text: '=>' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'c' },
        { type: 'property', text: '.weight' },
        { type: 'operator', text: ' >= ' },
        { type: 'number', text: '0.015' },
        { type: 'text', text: ');' }
      ], hasCursor: true },
      { tokens: [{ type: 'text', text: '}' }] }
    ]
  },

  // 2. Go
  {
    id: 'go',
    name: 'Go',
    filename: 'mapper.go',
    lines: [
      { tokens: [{ type: 'comment', text: '// Package quantize provides CIELAB perceptual clustering.' }] },
      { tokens: [
        { type: 'keyword', text: 'package' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'quantize' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'import' },
        { type: 'text', text: ' (' }
      ]},
      { tokens: [{ type: 'text', text: '  ' }, { type: 'string', text: '"context"' }]},
      { tokens: [{ type: 'text', text: '  ' }, { type: 'string', text: '"fmt"' }]},
      { tokens: [{ type: 'text', text: '  ' }, { type: 'string', text: '"math"' }]},
      { tokens: [{ type: 'text', text: ')' }] },
      { tokens: [] },
      { tokens: [{ type: 'comment', text: '// Centroid represents an extracted color cluster.' }] },
      { tokens: [
        { type: 'keyword', text: 'type' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'Centroid' },
        { type: 'text', text: ' ' },
        { type: 'keyword', text: 'struct' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'property', text: 'Hex' },
        { type: 'text', text: '    ' },
        { type: 'type', text: 'string' },
        { type: 'text', text: '  ' },
        { type: 'string', text: '`json:"hex"`' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'property', text: 'Weight' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'float64' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '`json:"weight"`' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'property', text: 'Luminance' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'float64' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '`json:"luminance"`' }
      ]},
      { tokens: [{ type: 'text', text: '}' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'func' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'MapPalette' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'ctx' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'context.Context' },
        { type: 'punctuation', text: ', ' },
        { type: 'variable', text: 'points' },
        { type: 'text', text: ' []' },
        { type: 'type', text: 'Centroid' },
        { type: 'text', text: ') (' },
        { type: 'operator', text: '*' },
        { type: 'type', text: 'Scheme' },
        { type: 'punctuation', text: ', ' },
        { type: 'type', text: 'error' },
        { type: 'text', text: ') {' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'if' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'len' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'points' },
        { type: 'text', text: ') ' },
        { type: 'operator', text: '<' },
        { type: 'text', text: ' ' },
        { type: 'number', text: '8' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'boolean', text: 'nil' },
        { type: 'punctuation', text: ', ' },
        { type: 'function', text: 'fmt.Errorf' },
        { type: 'text', text: '(' },
        { type: 'string', text: '"insufficient clusters: %d"' },
        { type: 'punctuation', text: ', ' },
        { type: 'function', text: 'len' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'points' },
        { type: 'text', text: '))' }
      ]},
      { tokens: [{ type: 'text', text: '  }' }] },
      { tokens: [] },
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'variable', text: 'scheme' },
        { type: 'operator', text: ' := &' },
        { type: 'type', text: 'Scheme' },
        { type: 'text', text: '{' }
      ], isSelected: true },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'Background' },
        { type: 'punctuation', text: ': ' },
        { type: 'variable', text: 'points' },
        { type: 'text', text: '[' },
        { type: 'number', text: '0' },
        { type: 'text', text: '].' },
        { type: 'property', text: 'Hex' },
        { type: 'punctuation', text: ',' }
      ], isSelected: true },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'Foreground' },
        { type: 'punctuation', text: ': ' },
        { type: 'variable', text: 'points' },
        { type: 'text', text: '[' },
        { type: 'function', text: 'len' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'points' },
        { type: 'text', text: ')' },
        { type: 'operator', text: '-' },
        { type: 'number', text: '1' },
        { type: 'text', text: '].' },
        { type: 'property', text: 'Hex' },
        { type: 'punctuation', text: ',' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'ContrastRatio' },
        { type: 'punctuation', text: ': ' },
        { type: 'number', text: '4.52' },
        { type: 'punctuation', text: ',' }
      ]},
      { tokens: [{ type: 'text', text: '  }' }] },
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'scheme' },
        { type: 'punctuation', text: ', ' },
        { type: 'boolean', text: 'nil' }
      ], hasCursor: true },
      { tokens: [{ type: 'text', text: '}' }] }
    ]
  },

  // 3. Rust
  {
    id: 'rust',
    name: 'Rust',
    filename: 'palette.rs',
    lines: [
      { tokens: [{ type: 'comment', text: '//! Perceptual Color Palette Generator in Rust' }] },
      { tokens: [
        { type: 'keyword', text: 'use' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'std' },
        { type: 'punctuation', text: '::' },
        { type: 'variable', text: 'collections' },
        { type: 'punctuation', text: '::' },
        { type: 'type', text: 'HashMap' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: '#[derive(Debug, Clone, PartialEq)]' }
      ]},
      { tokens: [
        { type: 'keyword', text: 'pub enum' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'ThemeVariant' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [{ type: 'text', text: '    ' }, { type: 'property', text: 'Dark' }, { type: 'punctuation', text: ',' }]},
      { tokens: [{ type: 'text', text: '    ' }, { type: 'property', text: 'Light' }, { type: 'punctuation', text: ',' }]},
      { tokens: [{ type: 'text', text: '}' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'pub struct' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'ThemeColors' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'pub' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'background' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'String' },
        { type: 'punctuation', text: ',' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'pub' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'foreground' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'String' },
        { type: 'punctuation', text: ',' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'pub' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'accent' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'String' },
        { type: 'punctuation', text: ',' }
      ]},
      { tokens: [{ type: 'text', text: '}' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'impl' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'ThemeColors' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'pub fn' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'calculate_contrast' },
        { type: 'text', text: '(&' },
        { type: 'variable', text: 'self' },
        { type: 'text', text: ') -> ' },
        { type: 'type', text: 'f64' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '        ' },
        { type: 'keyword', text: 'let' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'lum_bg' },
        { type: 'operator', text: ' = ' },
        { type: 'function', text: 'relative_luminance' },
        { type: 'text', text: '(&' },
        { type: 'variable', text: 'self' },
        { type: 'property', text: '.background' },
        { type: 'text', text: ');' }
      ]},
      { tokens: [
        { type: 'text', text: '        ' },
        { type: 'keyword', text: 'let' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'lum_fg' },
        { type: 'operator', text: ' = ' },
        { type: 'function', text: 'relative_luminance' },
        { type: 'text', text: '(&' },
        { type: 'variable', text: 'self' },
        { type: 'property', text: '.foreground' },
        { type: 'text', text: ');' }
      ]},
      { tokens: [
        { type: 'text', text: '        (lum_fg + ' },
        { type: 'number', text: '0.05' },
        { type: 'text', text: ') / (lum_bg + ' },
        { type: 'number', text: '0.05' },
        { type: 'text', text: ')' }
      ], isSelected: true },
      { tokens: [{ type: 'text', text: '    }' }] },
      { tokens: [{ type: 'text', text: '}' }], hasCursor: true }
    ]
  },

  // 4. C
  {
    id: 'c',
    name: 'C',
    filename: 'engine.c',
    lines: [
      { tokens: [{ type: 'comment', text: '/* Chroma CIELAB delta-e color math in C */' }] },
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<stdio.h>' }
      ]},
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<stdlib.h>' }
      ]},
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<math.h>' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: '#define' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'MAX_CLUSTERS' },
        { type: 'text', text: ' ' },
        { type: 'number', text: '16' }
      ]},
      { tokens: [
        { type: 'keyword', text: '#define' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'MIN_CONTRAST' },
        { type: 'text', text: ' ' },
        { type: 'number', text: '4.5' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'typedef struct' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'L' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'a' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'b' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'weight' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '} ' },
        { type: 'type', text: 'LabColor' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [] },
      { tokens: [{ type: 'comment', text: '/* Calculate Euclidean distance in Lab color space */' }] },
      { tokens: [
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'delta_e76' },
        { type: 'text', text: '(' },
        { type: 'keyword', text: 'const' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'LabColor' },
        { type: 'operator', text: '*' },
        { type: 'variable', text: 'c1' },
        { type: 'punctuation', text: ', ' },
        { type: 'keyword', text: 'const' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'LabColor' },
        { type: 'operator', text: '*' },
        { type: 'variable', text: 'c2' },
        { type: 'text', text: ') {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'dl' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'c1' },
        { type: 'operator', text: '->' },
        { type: 'property', text: 'L' },
        { type: 'operator', text: ' - ' },
        { type: 'variable', text: 'c2' },
        { type: 'operator', text: '->' },
        { type: 'property', text: 'L' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'da' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'c1' },
        { type: 'operator', text: '->' },
        { type: 'property', text: 'a' },
        { type: 'operator', text: ' - ' },
        { type: 'variable', text: 'c2' },
        { type: 'operator', text: '->' },
        { type: 'property', text: 'a' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'db' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'c1' },
        { type: 'operator', text: '->' },
        { type: 'property', text: 'b' },
        { type: 'operator', text: ' - ' },
        { type: 'variable', text: 'c2' },
        { type: 'operator', text: '->' },
        { type: 'property', text: 'b' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'sqrt' },
        { type: 'text', text: '(dl * dl + da * da + db * db);' }
      ], isSelected: true },
      { tokens: [{ type: 'text', text: '}' }] },
      { tokens: [] },
      { tokens: [
        { type: 'type', text: 'int' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'main' },
        { type: 'text', text: '(' },
        { type: 'type', text: 'void' },
        { type: 'text', text: ') {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'function', text: 'printf' },
        { type: 'text', text: '(' },
        { type: 'string', text: '"Chroma Engine Initialized\\n"' },
        { type: 'text', text: ');' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'number', text: '0' },
        { type: 'punctuation', text: ';' }
      ], hasCursor: true },
      { tokens: [{ type: 'text', text: '}' }] }
    ]
  },

  // 5. C++
  {
    id: 'cpp',
    name: 'C++',
    filename: 'quantize.cpp',
    lines: [
      { tokens: [{ type: 'comment', text: '// Chroma Color Clustering Module in Modern C++20' }] },
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<vector>' }
      ]},
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<memory>' }
      ]},
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<cmath>' }
      ]},
      { tokens: [
        { type: 'keyword', text: '#include' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '<string>' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'namespace' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'chroma' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'struct' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'ThemeScheme' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'std::string' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'name' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'std::vector' },
        { type: 'text', text: '<' },
        { type: 'type', text: 'std::string' },
        { type: 'text', text: '> ' },
        { type: 'property', text: 'palette' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'double' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'contrast_ratio' },
        { type: 'operator', text: '{' },
        { type: 'number', text: '4.5' },
        { type: 'operator', text: '};' }
      ]},
      { tokens: [{ type: 'text', text: '};' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'class' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'Quantizer' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [{ type: 'keyword', text: 'public:' }] },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'explicit' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'Quantizer' },
        { type: 'text', text: '(' },
        { type: 'type', text: 'size_t' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'max_k' },
        { type: 'operator', text: ' = ' },
        { type: 'number', text: '16' },
        { type: 'text', text: ')' }
      ]},
      { tokens: [
        { type: 'text', text: '        : ' },
        { type: 'property', text: 'k_' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'max_k' },
        { type: 'text', text: ') {}' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'auto' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'cluster' },
        { type: 'text', text: '(' },
        { type: 'keyword', text: 'const' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'std::vector' },
        { type: 'text', text: '<' },
        { type: 'type', text: 'uint8_t' },
        { type: 'text', text: '>& ' },
        { type: 'variable', text: 'pixels' },
        { type: 'text', text: ') -> ' },
        { type: 'type', text: 'ThemeScheme' },
        { type: 'text', text: ' {' }
      ]},
      { tokens: [
        { type: 'text', text: '        ' },
        { type: 'type', text: 'ThemeScheme' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'scheme' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [
        { type: 'text', text: '        ' },
        { type: 'variable', text: 'scheme' },
        { type: 'property', text: '.name' },
        { type: 'operator', text: ' = ' },
        { type: 'string', text: '"Chroma Theme"' },
        { type: 'punctuation', text: ';' }
      ], isSelected: true },
      { tokens: [
        { type: 'text', text: '        ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'scheme' },
        { type: 'punctuation', text: ';' }
      ], hasCursor: true },
      { tokens: [{ type: 'text', text: '    }' }] },
      { tokens: [{ type: 'keyword', text: 'private:' }] },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'type', text: 'size_t' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'k_' },
        { type: 'punctuation', text: ';' }
      ]},
      { tokens: [{ type: 'text', text: '};' }] },
      { tokens: [] },
      { tokens: [{ type: 'text', text: '} // namespace chroma' }] }
    ]
  },

  // 6. Bash
  {
    id: 'bash',
    name: 'Bash',
    filename: 'deploy.sh',
    lines: [
      { tokens: [{ type: 'comment', text: '#!/usr/bin/env bash' }] },
      { tokens: [{ type: 'comment', text: '# Deploy Chroma Color Scheme to System Dotfiles' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'set' },
        { type: 'text', text: ' -euo pipefail' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'readonly' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'DOTFILES_DIR' },
        { type: 'operator', text: '="${' },
        { type: 'variable', text: 'DOTFILES' },
        { type: 'operator', text: ':-' },
        { type: 'string', text: '"$HOME/.dotfiles"' },
        { type: 'operator', text: '}"' }
      ]},
      { tokens: [
        { type: 'keyword', text: 'readonly' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'THEME_NAME' },
        { type: 'operator', text: '="${' },
        { type: 'number', text: '1' },
        { type: 'operator', text: ':-' },
        { type: 'string', text: '"chroma-theme"' },
        { type: 'operator', text: '}"' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'function', text: 'log_info' },
        { type: 'text', text: '() {' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'printf' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '"\\033[38;2;88;166;255m[INFO]\\033[0m %s\\n"' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '"$*"' }
      ]},
      { tokens: [{ type: 'text', text: '}' }] },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'if' },
        { type: 'text', text: ' [[ ! -d ' },
        { type: 'string', text: '"$DOTFILES_DIR/theme"' },
        { type: 'text', text: ' ]]; ' },
        { type: 'keyword', text: 'then' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'echo' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '"Error: dotfiles theme directory not found"' },
        { type: 'text', text: ' >&2' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'exit' },
        { type: 'text', text: ' ' },
        { type: 'number', text: '1' }
      ]},
      { tokens: [{ type: 'keyword', text: 'fi' }] },
      { tokens: [] },
      { tokens: [
        { type: 'function', text: 'log_info' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '"Switching active theme to: ${THEME_NAME}"' }
      ], isSelected: true },
      { tokens: [
        { type: 'keyword', text: 'echo' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '"${THEME_NAME}"' },
        { type: 'operator', text: ' > ' },
        { type: 'string', text: '"$DOTFILES_DIR/theme/current"' }
      ], isSelected: true },
      { tokens: [] },
      { tokens: [{ type: 'comment', text: '# Trigger automatic terminal and tmux reload' }] },
      { tokens: [
        { type: 'keyword', text: 'if' },
        { type: 'text', text: ' command -v tmux &>/dev/null; ' },
        { type: 'keyword', text: 'then' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'tmux' },
        { type: 'text', text: ' source-file ' },
        { type: 'string', text: '"$DOTFILES_DIR/theme/generated/tmux.conf"' }
      ]},
      { tokens: [{ type: 'keyword', text: 'fi' }] },
      { tokens: [] },
      { tokens: [
        { type: 'function', text: 'log_info' },
        { type: 'text', text: ' ' },
        { type: 'string', text: '"Theme applied successfully."' }
      ], hasCursor: true }
    ]
  },

  // 7. Python
  {
    id: 'python',
    name: 'Python',
    filename: 'theme_builder.py',
    lines: [
      { tokens: [{ type: 'comment', text: '#!/usr/bin/env python3' }] },
      { tokens: [{ type: 'comment', text: '"""Chroma Theme Exporter & Contrast Validator."""' }] },
      { tokens: [
        { type: 'keyword', text: 'from' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'dataclasses' },
        { type: 'text', text: ' ' },
        { type: 'keyword', text: 'import' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'dataclass' }
      ]},
      { tokens: [
        { type: 'keyword', text: 'from' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'typing' },
        { type: 'text', text: ' ' },
        { type: 'keyword', text: 'import' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'List' },
        { type: 'punctuation', text: ', ' },
        { type: 'variable', text: 'Optional' }
      ]},
      { tokens: [] },
      { tokens: [{ type: 'keyword', text: '@dataclass(frozen=True)' }] },
      { tokens: [
        { type: 'keyword', text: 'class' },
        { type: 'text', text: ' ' },
        { type: 'type', text: 'Theme' },
        { type: 'text', text: ':' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'name' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'str' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'variant' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'str' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'colors' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'List' },
        { type: 'text', text: '[' },
        { type: 'type', text: 'str' },
        { type: 'text', text: ']' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'property', text: 'contrast_ratio' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'float' },
        { type: 'operator', text: ' = ' },
        { type: 'number', text: '4.5' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'def' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'is_accessible' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'self' },
        { type: 'text', text: ') -> ' },
        { type: 'type', text: 'bool' },
        { type: 'text', text: ':' }
      ]},
      { tokens: [
        { type: 'text', text: '        ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'self' },
        { type: 'property', text: '.contrast_ratio' },
        { type: 'operator', text: ' >= ' },
        { type: 'number', text: '4.5' }
      ], isSelected: true },
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'def' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'generate' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'image_path' },
        { type: 'punctuation', text: ': ' },
        { type: 'type', text: 'str' },
        { type: 'text', text: ') -> ' },
        { type: 'type', text: 'Optional' },
        { type: 'text', text: '[' },
        { type: 'type', text: 'Theme' },
        { type: 'text', text: ']:' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'variable', text: 'swatches' },
        { type: 'operator', text: ' = ' },
        { type: 'function', text: 'quantize_image' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'image_path' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'k' },
        { type: 'operator', text: '=' },
        { type: 'number', text: '16' },
        { type: 'text', text: ')' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'function', text: 'Theme' },
        { type: 'text', text: '(' },
        { type: 'property', text: 'name' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"Chroma"' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'variant' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"dark"' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'colors' },
        { type: 'operator', text: '=' },
        { type: 'variable', text: 'swatches' },
        { type: 'text', text: ')' }
      ], hasCursor: true }
    ]
  },

  // 8. Lua
  {
    id: 'lua',
    name: 'Lua (Neovim)',
    filename: 'theme.lua',
    lines: [
      { tokens: [{ type: 'comment', text: '-- Neovim 0.10+ Native Highlight Group Setup' }] },
      { tokens: [
        { type: 'keyword', text: 'local' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'M' },
        { type: 'operator', text: ' = ' },
        { type: 'punctuation', text: '{}' }
      ]},
      { tokens: [
        { type: 'keyword', text: 'local' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'hl' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'vim' },
        { type: 'property', text: '.api' },
        { type: 'property', text: '.nvim_set_hl' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'function' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'M' },
        { type: 'property', text: '.setup' },
        { type: 'text', text: '(' },
        { type: 'variable', text: 'colors' },
        { type: 'text', text: ')' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'function', text: 'hl' },
        { type: 'text', text: '(' },
        { type: 'number', text: '0' },
        { type: 'punctuation', text: ', ' },
        { type: 'string', text: '"Normal"' },
        { type: 'punctuation', text: ', { ' },
        { type: 'property', text: 'fg' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'colors' },
        { type: 'property', text: '.fg' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'bg' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'colors' },
        { type: 'property', text: '.bg' },
        { type: 'text', text: ' })' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'function', text: 'hl' },
        { type: 'text', text: '(' },
        { type: 'number', text: '0' },
        { type: 'punctuation', text: ', ' },
        { type: 'string', text: '"Function"' },
        { type: 'punctuation', text: ', { ' },
        { type: 'property', text: 'fg' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'colors' },
        { type: 'property', text: '.accent' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'bold' },
        { type: 'operator', text: ' = ' },
        { type: 'boolean', text: 'true' },
        { type: 'text', text: ' })' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'function', text: 'hl' },
        { type: 'text', text: '(' },
        { type: 'number', text: '0' },
        { type: 'punctuation', text: ', ' },
        { type: 'string', text: '"Visual"' },
        { type: 'punctuation', text: ', { ' },
        { type: 'property', text: 'bg' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'colors' },
        { type: 'property', text: '.selection_bg' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'fg' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'colors' },
        { type: 'property', text: '.selection_fg' },
        { type: 'text', text: ' })' }
      ], isSelected: true },
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'function', text: 'hl' },
        { type: 'text', text: '(' },
        { type: 'number', text: '0' },
        { type: 'punctuation', text: ', ' },
        { type: 'string', text: '"Keyword"' },
        { type: 'punctuation', text: ', { ' },
        { type: 'property', text: 'fg' },
        { type: 'operator', text: ' = ' },
        { type: 'variable', text: 'colors' },
        { type: 'property', text: '.accent_alt' },
        { type: 'punctuation', text: ', ' },
        { type: 'property', text: 'italic' },
        { type: 'operator', text: ' = ' },
        { type: 'boolean', text: 'true' },
        { type: 'text', text: ' })' }
      ]},
      { tokens: [
        { type: 'keyword', text: 'end' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'keyword', text: 'return' },
        { type: 'text', text: ' ' },
        { type: 'variable', text: 'M' }
      ], hasCursor: true }
    ]
  },
  // 9. Markdown
  {
    id: 'markdown',
    name: 'Markdown',
    filename: 'DOCUMENT.md',
    lines: [
      { tokens: [
        { type: 'operator', text: '# ' },
        { type: 'tag', text: 'Chroma Theme Studio' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'punctuation', text: '> ' },
        { type: 'comment', text: 'Single-image color palette generator with zero server dependencies.' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'operator', text: '## ' },
        { type: 'type', text: 'Core Architecture' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'operator', text: '- ' },
        { type: 'punctuation', text: '**' },
        { type: 'keyword', text: 'Engine' },
        { type: 'punctuation', text: '**' },
        { type: 'text', text: ': Pure ' },
        { type: 'type', text: 'Go' },
        { type: 'text', text: ' compiled to ' },
        { type: 'string', text: '`WebAssembly`' },
        { type: 'text', text: ' running in worker thread.' }
      ]},
      { tokens: [
        { type: 'operator', text: '- ' },
        { type: 'punctuation', text: '**' },
        { type: 'keyword', text: 'Contrast' },
        { type: 'punctuation', text: '**' },
        { type: 'text', text: ': Automated ' },
        { type: 'warn', text: 'WCAG 2.0 AA' },
        { type: 'text', text: ' threshold enforcement.' }
      ]},
      { tokens: [
        { type: 'operator', text: '- ' },
        { type: 'punctuation', text: '**' },
        { type: 'keyword', text: 'Export' },
        { type: 'punctuation', text: '**' },
        { type: 'text', text: ': Native bundles for ' },
        { type: 'number', text: '50' },
        { type: 'text', text: '+ developer tools.' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'operator', text: '### ' },
        { type: 'type', text: 'Installation & Preview' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'punctuation', text: '```' },
        { type: 'keyword', text: 'bash' }
      ]},
      { tokens: [
        { type: 'comment', text: '# Clone and launch the local studio' }
      ]},
      { tokens: [
        { type: 'variable', text: 'git' },
        { type: 'text', text: ' clone ' },
        { type: 'string', text: 'https://github.com/RomanVolkov/chroma.git' }
      ]},
      { tokens: [
        { type: 'variable', text: 'cd' },
        { type: 'text', text: ' chroma && ' },
        { type: 'variable', text: 'npm' },
        { type: 'text', text: ' run dev' }
      ], isSelected: true },
      { tokens: [
        { type: 'punctuation', text: '```' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'operator', text: '### ' },
        { type: 'type', text: 'Keyboard Shortcuts' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'punctuation', text: '| ' },
        { type: 'property', text: 'Key' },
        { type: 'punctuation', text: ' | ' },
        { type: 'property', text: 'Action' },
        { type: 'punctuation', text: ' |' }
      ]},
      { tokens: [
        { type: 'punctuation', text: '| :--- | :--- |' }
      ]},
      { tokens: [
        { type: 'punctuation', text: '| ' },
        { type: 'string', text: '`Esc`' },
        { type: 'punctuation', text: ' | ' },
        { type: 'text', text: 'Drop active token color selection |' }
      ]},
      { tokens: [
        { type: 'punctuation', text: '| ' },
        { type: 'string', text: '`Click`' },
        { type: 'punctuation', text: ' | ' },
        { type: 'text', text: 'Inspect and tune word color in editor |' }
      ]},
      { tokens: [] },
      { tokens: [
        { type: 'punctuation', text: 'Explore live documentation at ' },
        { type: 'punctuation', text: '[' },
        { type: 'blue', text: 'Chroma Studio' },
        { type: 'punctuation', text: '](' },
        { type: 'string', text: 'https://romanvolkov.github.io/chroma/' },
        { type: 'punctuation', text: ')' },
        { type: 'punctuation', text: '.' }
      ], hasCursor: true }
    ]
  }
];
