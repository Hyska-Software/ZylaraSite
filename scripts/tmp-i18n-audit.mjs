#!/usr/bin/env node
/** Auditoria temporaria de i18n: chaves usadas x chaves no catalogo + textos soltos no JSX. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const en = JSON.parse(readFileSync(join(ROOT, 'messages/en.json'), 'utf8'));
const pt = JSON.parse(readFileSync(join(ROOT, 'messages/pt-BR.json'), 'utf8'));

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (['.ts', '.tsx'].includes(extname(full))) out.push(full);
  }
  return out;
}

const files = walk(join(ROOT, 'src'));

function getPath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), obj);
}

const used = new Map(); // key -> [files]
const hardcoded = [];

for (const file of files) {
  const rel = file.replace(ROOT, '').replace(/\\/g, '/').slice(1);
  const src = readFileSync(file, 'utf8');

  // namespaces declarados no arquivo
  const namespaces = [];
  for (const m of src.matchAll(/useTranslations\(\s*['"`]([^'"`]*)['"`]/g)) namespaces.push(m[1]);
  for (const m of src.matchAll(/getTranslations\(\s*(?:await\s*)?\{?\s*(?:namespace\s*:\s*)?['"`]([^'"`]*)['"`]/g))
    namespaces.push(m[1]);

  const ns = namespaces[0] ?? '';

  // chamadas t('chave')
  for (const m of src.matchAll(/\bt(?:\.rich)?\(\s*['"`]([^'"`]+)['"`]/g)) {
    const full = ns ? `${ns}.${m[1]}` : m[1];
    if (!used.has(full)) used.set(full, []);
    used.get(full).push(rel);
  }

  // strings soltas em JSX: >Texto< e atributos alt/aria-label/title/placeholder
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    if (/\bt\(|\bt\.rich\(|translate|messages/.test(trimmed)) return;

    for (const m of line.matchAll(/\b(?:alt|aria-label|title|placeholder|aria-describedby|aria-labelledby)="([^"{}]{3,})"/g)) {
      hardcoded.push({ rel, line: i + 1, text: m[1], kind: 'attr' });
    }
    for (const m of line.matchAll(/>\s*([A-Za-zÀ-ÿ][^<>{}=]{3,}?)\s*</g)) {
      const text = m[1].trim();
      if (/^[\d\s.,:;+%·/–—-]+$/.test(text)) continue;
      if (/^(https?:|\/|\$)/.test(text)) continue;
      hardcoded.push({ rel, line: i + 1, text, kind: 'jsx' });
    }
    for (const m of line.matchAll(/(?:label|text|description|title|name|placeholder|alt)\s*[:=]\s*\{?\s*['"`]([^'"`]{6,})['"`]/g)) {
      hardcoded.push({ rel, line: i + 1, text: m[1], kind: 'prop' });
    }
  });
}

function flattenKeys(value, prefix = '', out = new Set()) {
  if (Array.isArray(value)) {
    out.add(prefix);
    value.forEach((item, index) => {
      if (item && typeof item === 'object') flattenKeys(item, `${prefix}.${index}`, out);
    });
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [k, child] of Object.entries(value)) flattenKeys(child, prefix ? `${prefix}.${k}` : k, out);
    return out;
  }
  out.add(prefix);
  return out;
}

const catalogKeys = flattenKeys(en);

const missingInCatalog = [...used.keys()].filter((k) => !catalogKeys.has(k) && ![...catalogKeys].some((c) => c.startsWith(`${k}.`)));

console.log('=== CHAVES USADAS NO CODIGO MAS AUSENTES NO CATALOGO ===');
if (missingInCatalog.length === 0) console.log('(nenhuma)');
for (const k of missingInCatalog) console.log(`  ${k}  <- ${[...new Set(used.get(k))].join(', ')}`);

// chaves nunca usadas (ignorando folhas de arrays que sempre aparecem como pai)
const unused = [...catalogKeys].filter((k) => {
  if (used.has(k)) return false;
  if ([...used.keys()].some((u) => u.startsWith(`${k}.`))) return false;
  if (k.includes('[') || /\.\d+$/.test(k)) return false; // itens de array: usados via map
  return true;
});
console.log(`\n=== CHAVES NO CATALOGO SEM USO DIRETO (${unused.length}) ===`);
for (const k of unused) console.log(`  ${k}`);

console.log(`\n=== POSSIVEIS TEXTOS SEM TRADUCAO NO CODIGO (${hardcoded.length}) ===`);
for (const h of hardcoded) console.log(`  ${h.rel}:${h.line}  [${h.kind}] ${h.text.slice(0, 90)}`);

// strings em pt-BR dentro do en.json (conteudo nao traduzido)
const PT = /[ãõçáéíóúâêôàÃÕÇÁÉÍÓÚÂÊÔ]|\b(para|não|com|você|sobre|quando|porque|política|dados)\b/i;
function leaves(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) v.forEach((item, i) => leaves({ [i]: item }, full, out));
    else if (v && typeof v === 'object') leaves(v, full, out);
    else out.push([full, String(v)]);
  }
  return out;
}
const ptInEn = leaves(en).filter(([, v]) => PT.test(v) && v.length > 25);
console.log(`\n=== VALORES SUSPEITOS (PT dentro do en.json) (${ptInEn.length}) ===`);
for (const [k, v] of ptInEn) console.log(`  ${k}: ${v.slice(0, 120)}`);
