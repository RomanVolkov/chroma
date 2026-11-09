import { importThemeFile } from './index';
import { EXPORTERS } from '../exporters';
import type { SchemeData } from '../../worker/types';

const sampleScheme: SchemeData = {
  name: 'Cyberpunk Neon',
  variant: 'dark',
  colors: {
    bg: '#0d0e15',
    bg_alt: '#151722',
    bg_deep: '#07080b',
    fg: '#f0f3f6',
    fg_dim: '#8590a6',
    fg_muted: '#5a6275',
    surface: '#1b1d2a',
    surface_hi: '#25293c',
    border: '#32374e',
    overlay: '#5a6275',
    cursor: '#ff007f',
    selection_bg: '#25293c',
    selection_fg: '#ffffff',
    accent: '#00f0ff',
    accent_alt: '#ff007f',
    accent_info: '#ffe600',
    warn: '#ff9900',
    blue: '#00a8ff',
  },
  ansi: {
    colors: [
      '#0d0e15', '#ff3366', '#33ff77', '#ffe600', '#00f0ff', '#ff007f', '#00ffff', '#f0f3f6',
      '#5a6275', '#ff6699', '#66ff99', '#fff066', '#33f3ff', '#ff3399', '#66ffff', '#ffffff'
    ],
  },
};

function runTests() {
  console.log('--- Starting Import & Confidence Threshold Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, desc: string) {
    if (cond) {
      console.log(`  ✓ ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Test Dotfiles TOML export & import
  const dotfilesExp = EXPORTERS.find(e => e.id === 'dotfiles-toml')!;
  const dotfilesContent = dotfilesExp.generate(sampleScheme);
  assert(dotfilesContent.includes('[tools]'), 'Dotfiles export includes [tools] table');
  assert(dotfilesContent.includes('bat = "base16"'), 'Dotfiles export includes tools.bat = "base16"');

  const r1 = importThemeFile(dotfilesContent, 'cyberpunk.toml');
  assert(r1.success && r1.confidence >= 90, `Dotfiles TOML imported with confidence ${r1.confidence}% >= 90%`);
  assert(r1.scheme?.colors.bg === '#0d0e15', `Dotfiles TOML colors bg matched: ${r1.scheme?.colors.bg}`);
  assert(r1.scheme?.tools?.bat === 'base16', 'Imported scheme contains tools.bat = "base16"');

  const customToml = dotfilesContent.replace('bat = "base16"', 'bat = "TwoDark"');
  const rCustom = importThemeFile(customToml, 'custom.toml');
  assert(rCustom.scheme?.tools?.bat === 'TwoDark', 'Custom tools.bat = "TwoDark" preserved on import');

  // 2. Test Kitty export & import
  const kittyExp = EXPORTERS.find(e => e.id === 'kitty')!;
  const kittyContent = kittyExp.generate(sampleScheme);
  const r2 = importThemeFile(kittyContent, 'kitty.conf');
  assert(r2.success && r2.confidence >= 90, `Kitty config imported with confidence ${r2.confidence}% >= 90%`);
  assert(r2.scheme?.colors.bg === '#0d0e15', `Kitty colors bg matched: ${r2.scheme?.colors.bg}`);

  // 3. Test Alacritty export & import
  const alacrittyExp = EXPORTERS.find(e => e.id === 'alacritty')!;
  const alacrittyContent = alacrittyExp.generate(sampleScheme);
  const r3 = importThemeFile(alacrittyContent, 'alacritty.toml');
  assert(r3.success && r3.confidence >= 90, `Alacritty imported with confidence ${r3.confidence}% >= 90%`);
  assert(r3.scheme?.colors.bg === '#0d0e15', `Alacritty colors bg matched: ${r3.scheme?.colors.bg}`);

  // 4. Test Ghostty export & import
  const ghosttyExp = EXPORTERS.find(e => e.id === 'ghostty')!;
  const ghosttyContent = ghosttyExp.generate(sampleScheme);
  const r4 = importThemeFile(ghosttyContent, 'ghostty.conf');
  assert(r4.success && r4.confidence >= 90, `Ghostty imported with confidence ${r4.confidence}% >= 90%`);

  // 5. Test VS Code export & import
  const vscodeExp = EXPORTERS.find(e => e.id === 'vscode')!;
  const vscodeContent = vscodeExp.generate(sampleScheme);
  const r5 = importThemeFile(vscodeContent, 'theme.json');
  assert(r5.success && r5.confidence >= 90, `VS Code imported with confidence ${r5.confidence}% >= 90%`);

  // 6. Test Windows Terminal export & import
  const wtExp = EXPORTERS.find(e => e.id === 'windows-terminal')!;
  const wtContent = wtExp.generate(sampleScheme);
  const r6 = importThemeFile(wtContent, 'wt.json');
  assert(r6.success && r6.confidence >= 90, `Windows Terminal imported with confidence ${r6.confidence}% >= 90%`);

  // 7. Test Base16 YAML export & import
  const base16Exp = EXPORTERS.find(e => e.id === 'base16')!;
  const base16Content = base16Exp.generate(sampleScheme);
  const r7 = importThemeFile(base16Content, 'base16.yaml');
  assert(r7.success && r7.confidence >= 90, `Base16 YAML imported with confidence ${r7.confidence}% >= 90%`);

  // 8. Test WezTerm export & import
  const weztermExp = EXPORTERS.find(e => e.id === 'wezterm')!;
  const weztermContent = weztermExp.generate(sampleScheme);
  const r8 = importThemeFile(weztermContent, 'wezterm.lua');
  assert(r8.success && r8.confidence >= 90, `WezTerm imported with confidence ${r8.confidence}% >= 90%`);

  // 9. Test Foot export & import
  const footExp = EXPORTERS.find(e => e.id === 'foot')!;
  const footContent = footExp.generate(sampleScheme);
  const r9 = importThemeFile(footContent, 'foot.ini');
  assert(r9.success && r9.confidence >= 90, `Foot imported with confidence ${r9.confidence}% >= 90%`);

  // 10. Test Xresources export & import
  const xrExp = EXPORTERS.find(e => e.id === 'xresources')!;
  const xrContent = xrExp.generate(sampleScheme);
  const r10 = importThemeFile(xrContent, '.Xresources');
  assert(r10.success && r10.confidence >= 90, `Xresources imported with confidence ${r10.confidence}% >= 90%`);

  // --- Strict Negative Tests (< 90% Confidence Rejection) ---
  console.log('\n--- Testing Rejection of Ambiguous / Low-Confidence Files ---');

  // Negative 1: Random Markdown
  const md = '# README\nHere is a color: `#ff0000` and another `#00ff00`.';
  const rNeg1 = importThemeFile(md, 'README.md');
  assert(!rNeg1.success, `Random Markdown rejected: success=false (confidence=${rNeg1.confidence}%)`);

  // Negative 2: Partial config with only 1 color and no recognizable structure
  const partial = 'background = "#14171d"\nother_setting = true\n';
  const rNeg2 = importThemeFile(partial, 'random.conf');
  assert(!rNeg2.success, `Incomplete random config rejected: success=false (confidence=${rNeg2.confidence}%)`);

  // Negative 3: Generic package.json
  const pkg = '{\n  "name": "my-app",\n  "version": "1.0.0"\n}';
  const rNeg3 = importThemeFile(pkg, 'package.json');
  assert(!rNeg3.success, `Generic JSON package rejected: success=false (confidence=${rNeg3.confidence}%)`);

  // Negative 4: Empty string
  const rNeg4 = importThemeFile('', 'empty.txt');
  assert(!rNeg4.success, `Empty input rejected: success=false`);

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
