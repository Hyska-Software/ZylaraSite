/**
 * Gera `src/components/brand/provider-glyphs.ts` a partir dos SVGs mono da
 * LobeHub (`@lobehub/icons-static-svg`, MIT) — a mesma coleção que o app usa em
 * `docs/MODEL_ICONS.md`.
 *
 * Uso: node scripts/build-provider-glyphs.mjs
 *
 * O arquivo gerado guarda apenas `viewBox` + `d` de cada marca; o componente
 * `ProviderIcons.tsx` renderiza. Rode o script só ao adicionar/atualizar marca.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CDN = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons';

/** chave do componente → nome do arquivo na coleção */
const BRANDS = {
  opencode: 'opencode',
  openai: 'openai',
  anthropic: 'anthropic',
  google: 'gemini',
  deepseek: 'deepseek',
  zai: 'zai',
  qwen: 'qwen',
  kimi: 'kimi',
  minimax: 'minimax',
  mistral: 'mistral',
  grok: 'grok',
  nvidia: 'nvidia',
  xiaomimimo: 'xiaomimimo',
  hunyuan: 'hunyuan',
  longcat: 'longcat',
  stepfun: 'stepfun',
  meta: 'meta',
};

function parse(svg, name) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${name}: viewBox ausente`);

  // Só glifos mono: o path precisa herdar a cor do texto.
  if (!svg.includes('currentColor')) throw new Error(`${name}: não é mono`);

  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (paths.length === 0) throw new Error(`${name}: nenhum path`);

  return { viewBox, paths };
}

const entries = [];

for (const [key, file] of Object.entries(BRANDS)) {
  const response = await fetch(`${CDN}/${file}.svg`);
  if (!response.ok) throw new Error(`${file}.svg → HTTP ${response.status}`);

  const svg = await response.text();
  const { viewBox, paths } = parse(svg, file);

  entries.push({ key, viewBox, paths });
  console.log(`${key.padEnd(10)} ${paths.length} path(s)  viewBox=${viewBox}`);
}

const body = entries
  .map(({ key, viewBox, paths }) => {
    const list = paths.map((d) => `      '${d}',`).join('\n');
    return `  ${key}: {\n    viewBox: '${viewBox}',\n    paths: [\n${list}\n    ],\n  },`;
  })
  .join('\n');

const output = `/**
 * ARQUIVO GERADO — não edite à mão.
 * Fonte: @lobehub/icons-static-svg (lobehub/lobe-icons, licença MIT), variantes
 * mono. Regenerar com: node scripts/build-provider-glyphs.mjs
 */

export type ProviderGlyph = { viewBox: string; paths: readonly string[] };

export const PROVIDER_GLYPHS = {
${body}
} as const satisfies Record<string, ProviderGlyph>;

export type ProviderIconName = keyof typeof PROVIDER_GLYPHS;
`;

const target = join(process.cwd(), 'src', 'components', 'brand', 'provider-glyphs.ts');
writeFileSync(target, output, 'utf8');
console.log(`\n${entries.length} marcas → ${target}`);
