#!/usr/bin/env node
/**
 * Gera os assets de marca a partir da arte oficial do app.
 *
 * Fonte única: public/brand/lumina-mark.svg (arte oficial, não recolorida).
 * Saídas:      public/brand/lumina-tile.svg  (tile grafite-claro, macOS/favicon)
 *              public/icon.svg               (favicon 32px)
 *
 * Uso: npm run brand
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sourcePath = join(root, 'public/brand/lumina-mark.svg');
const source = readFileSync(sourcePath, 'utf8');

// viewBox oficial: "-400 -400 6025 6025" → conteúdo com ~400 de respiro por lado.
const VIEW_MIN = -400;
const VIEW_SIZE = 6025;

const inner = /<g id="Lumina">([\s\S]*?)<\/g>/.exec(source);
if (!inner) {
  console.error('Não encontrei <g id="Lumina"> em public/brand/lumina-mark.svg.');
  process.exit(1);
}
const artwork = inner[1].trim();

/** Monta um tile quadrado com a arte centralizada e um respiro proporcional. */
function buildTile({ size, inset, background, radius, label }) {
  const innerSize = size * (1 - inset * 2);
  const scale = innerSize / VIEW_SIZE;
  const offset = (size - innerSize) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${label}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale}) translate(${-VIEW_MIN} ${-VIEW_MIN})">
${artwork.replace(/^/gm, '    ')}
  </g>
</svg>
`;
}

const tile = buildTile({
  size: 180,
  inset: 0.11,
  background: '#EBEBEB',
  radius: 40,
  label: 'Lumina',
});

const icon = buildTile({
  size: 32,
  inset: 0.09,
  background: '#EBEBEB',
  radius: 7,
  label: 'Lumina',
});

writeFileSync(join(root, 'public/brand/lumina-tile.svg'), tile, 'utf8');
writeFileSync(join(root, 'public/icon.svg'), icon, 'utf8');

console.log('Marca gerada a partir de public/brand/lumina-mark.svg:');
console.log('  public/brand/lumina-tile.svg');
console.log('  public/icon.svg');
