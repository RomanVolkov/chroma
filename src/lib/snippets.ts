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
      { tokens: [
        { type: 'text', text: '  }' }
      ]},
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

  // 4. Python
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

  // 5. Lua
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

  // 6. HTML / CSS
  {
    id: 'html',
    name: 'HTML & CSS',
    filename: 'index.html',
    lines: [
      { tokens: [{ type: 'comment', text: '<!-- Chroma UI Component Hierarchy -->' }] },
      { tokens: [
        { type: 'tag', text: '<!doctype html>' }
      ]},
      { tokens: [
        { type: 'tag', text: '<html' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'lang' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"en"' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'class' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"dark"' },
        { type: 'tag', text: '>' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'tag', text: '<head>' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'tag', text: '<meta' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'charset' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"UTF-8"' },
        { type: 'tag', text: ' />' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'tag', text: '<title>' },
        { type: 'text', text: 'Chroma Studio' },
        { type: 'tag', text: '</title>' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'tag', text: '</head>' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'tag', text: '<body' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'class' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"surface-app"' },
        { type: 'tag', text: '>' }
      ]},
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'tag', text: '<header' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'class' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"studio-bar"' },
        { type: 'tag', text: '>' }
      ]},
      { tokens: [
        { type: 'text', text: '      ' },
        { type: 'tag', text: '<h1' },
        { type: 'text', text: ' ' },
        { type: 'property', text: 'class' },
        { type: 'operator', text: '=' },
        { type: 'string', text: '"text-accent font-bold"' },
        { type: 'tag', text: '>' },
        { type: 'text', text: 'Palette Engine' },
        { type: 'tag', text: '</h1>' }
      ], isSelected: true },
      { tokens: [
        { type: 'text', text: '    ' },
        { type: 'tag', text: '</header>' }
      ]},
      { tokens: [
        { type: 'text', text: '  ' },
        { type: 'tag', text: '</body>' }
      ], hasCursor: true },
      { tokens: [
        { type: 'tag', text: '</html>' }
      ]}
    ]
  }
];
