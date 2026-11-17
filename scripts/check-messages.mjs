#!/usr/bin/env node
/**
 * Garante paridade de chaves e de itens de array entre os catálogos de mensagens.
 * Uso: node scripts/check-messages.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'messages');
const files = readdirSync(dir).filter((file) => file.endsWith('.json'));

if (files.length < 2) {
  console.error(`Esperava ao menos 2 catálogos em messages/, encontrei ${files.length}.`);
  process.exit(1);
}

/** Achata um objeto em caminhos `a.b.c`, marcando arrays como folhas. */
function flatten(value, prefix = '', out = new Set()) {
  if (Array.isArray(value)) {
    out.add(prefix);
    value.forEach((item, index) => {
      if (item && typeof item === 'object') flatten(item, `${prefix}[${index}]`, out);
    });
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  out.add(prefix);
  return out;
}

/**
 * Mapeia cada array para o próprio comprimento, por caminho `a.b`.
 * `flatten` marca o array como folha e expande só os itens de objeto: sem esta
 * checagem, um item a menos em `pt-BR` passaria como paridade válida.
 */
function collectArrayLengths(value, prefix = '', out = new Map()) {
  if (Array.isArray(value)) {
    if (prefix) out.set(prefix, value.length);
    value.forEach((item, index) => {
      if (item && typeof item === 'object') collectArrayLengths(item, `${prefix}[${index}]`, out);
    });
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectArrayLengths(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

const catalogs = files.map((file) => {
  const messages = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  return { file, keys: flatten(messages), lengths: collectArrayLengths(messages) };
});

const [reference, ...others] = catalogs;
let failed = false;

for (const catalog of others) {
  const missing = [...reference.keys].filter((key) => !catalog.keys.has(key));
  const extra = [...catalog.keys].filter((key) => !reference.keys.has(key));
  const drift = [...reference.lengths].filter(
    ([path, length]) => catalog.lengths.has(path) && catalog.lengths.get(path) !== length,
  );

  if (missing.length || extra.length || drift.length) {
    failed = true;
    console.error(`\n${catalog.file} divergiu de ${reference.file}:`);
    for (const key of missing) console.error(`  faltando: ${key}`);
    for (const key of extra) console.error(`  sobrando: ${key}`);
    for (const [path, length] of drift) {
      console.error(
        `  array com ${catalog.lengths.get(path)} itens em ${catalog.file} (esperado ${length}): ${path}`,
      );
    }
  }
}

const total = reference.keys.size;
if (failed) {
  console.error(`\nParidade de mensagens falhou (${files.join(', ')}).`);
  process.exit(1);
}

console.log(`Mensagens em paridade: ${files.join(', ')} — ${total} chaves por catálogo.`);
