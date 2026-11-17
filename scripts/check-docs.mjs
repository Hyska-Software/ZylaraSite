#!/usr/bin/env node
/**
 * Paridade da documentação entre o inglês e as traduções.
 *
 * O inglês mora na raiz de `user-docs/` e é a fonte da verdade; cada idioma
 * publicado tem uma sobreposição em `user-docs/<idioma>/` com `nav.json` e os
 * `.md` traduzidos. Este script confere o que o site assume em silêncio:
 *
 * - a navegação do idioma tem as mesmas seções, na mesma ordem, com os mesmos
 *   slugs (e portanto as mesmas rotas);
 * - toda página existe no idioma, com `title` e `description`;
 * - a estrutura de blocos bate com o original (títulos, cercas de código,
 *   tabelas com as mesmas colunas e linhas, listas e diretivas `:::`), porque o
 *   renderizador desenha a página traduzida com o mesmo recorte;
 * - todo link interno aponta para uma página existente e para uma âncora que
 *   existe de verdade no destino, já que a âncora é gerada do título traduzido;
 * - as URLs externas são as mesmas do original;
 * - o rodapé de continuação foi traduzido (`Próximo:`, `下一步：`...).
 *
 * Uso: node scripts/check-docs.mjs [--quiet]
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'user-docs');
const quiet = process.argv.includes('--quiet');

/** Marcadores de "próxima página" aceitos em cada idioma. */
const CONTINUATION = /^(next|more|próxim[oa]s?|mais|下一步|更多)\s*[:：]/i;

const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function note(message) {
  notes.push(message);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

/** Âncora de um título — a mesma regra de `src/lib/docsMarkdown.ts`. */
function headingId(value) {
  return value
    .replace(/[`*_[\]]/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/* -------------------------------------------------------------------------- */
/* Leitura do Markdown                                                        */
/* -------------------------------------------------------------------------- */

const HEADING = /^(#{1,6})\s+(.*)$/;
const FENCE = /^\s*```/;
const DIRECTIVE = /^:::([a-z][a-z0-9-]*)\s*$/;
const TABLE_ROW = /^\|/;
const TABLE_DIVIDER = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const BULLET = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;

function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { meta: {}, body: source };

  const meta = {};
  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const at = line.indexOf(':');
    if (at < 0) continue;
    meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }

  return { meta, body: source.slice(match[0].length) };
}

/** Divide uma linha de tabela em células, respeitando `code` com `|` dentro. */
function splitRow(line) {
  const cells = [];
  let current = '';
  let inCode = false;

  for (let index = 1; index < line.length; index += 1) {
    const char = line[index];
    if (char === '`') inCode = !inCode;

    if (char === '|' && !inCode) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    if (char === '|' && index === line.length - 1) break;
    current += char;
  }

  const tail = current.replace(/\|\s*$/, '').trim();
  if (tail) cells.push(tail);

  return cells;
}

/**
 * Recorte estrutural de uma página, suficiente para comparar idiomas.
 * Nada aqui tenta renderizar: só conta e ordena o que o site desenha.
 */
function scan(source) {
  const { meta, body } = frontmatter(source);
  const lines = body.split(/\r?\n/);

  const headings = [];
  const fences = [];
  const tables = [];
  const slots = [];
  const lists = [];
  const paragraphs = [];
  const links = [];
  const externalLinks = [];

  const usedIds = new Set();

  const collectLinks = (text, line) => {
    for (const match of text.matchAll(LINK)) {
      const href = match[2] ?? '';
      links.push({ text: match[1] ?? '', href, line });
      if (/^https?:\/\//.test(href)) externalLinks.push(href);
    }
  };

  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = HEADING.exec(trimmed);
    if (heading && (heading[1] ?? '').length >= 2) {
      const text = (heading[2] ?? '').trim();
      const base = headingId(text);
      let id = base;
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(id);
      headings.push({ level: heading[1].length, text, id, line: index + 1 });
      collectLinks(text, index + 1);
      index += 1;
      continue;
    }

    const directive = DIRECTIVE.exec(trimmed);
    if (directive) {
      slots.push(directive[1]);
      index += 1;
      while (index < lines.length && (lines[index] ?? '').trim() !== ':::') index += 1;
      index += 1;
      continue;
    }

    if (FENCE.test(line)) {
      fences.push(trimmed.slice(3).trim());
      index += 1;
      while (index < lines.length && !FENCE.test(lines[index] ?? '')) index += 1;
      index += 1;
      continue;
    }

    if (TABLE_ROW.test(trimmed)) {
      const rows = [];
      let columns = 0;

      while (index < lines.length && TABLE_ROW.test((lines[index] ?? '').trim())) {
        const raw = (lines[index] ?? '').trim();
        if (!TABLE_DIVIDER.test(raw)) {
          const cells = splitRow(raw);
          if (rows.length === 0 && columns === 0) columns = cells.length;
          else rows.push(cells.length);
          collectLinks(raw, index + 1);
        }
        index += 1;
      }

      tables.push({ columns, rows, line: index });
      continue;
    }

    if (BULLET.test(line)) {
      const baseIndent = (BULLET.exec(line)?.[1] ?? '').length;
      const ordered = /^\s*\d+\./.test(line);
      let items = 0;
      let nested = 0;

      while (index < lines.length) {
        const current = lines[index] ?? '';
        const bullet = BULLET.exec(current);

        if (!current.trim()) break;
        if (!bullet) {
          // Continuação do item atual.
          if ((current.length - current.trimStart().length) <= baseIndent) break;
          collectLinks(current.trim(), index + 1);
          index += 1;
          continue;
        }

        const indent = (bullet[1] ?? '').length;
        if (indent > baseIndent) {
          nested += 1;
          collectLinks(bullet[3] ?? '', index + 1);
          index += 1;
          continue;
        }
        if (indent < baseIndent) break;

        items += 1;
        collectLinks(bullet[3] ?? '', index + 1);
        index += 1;
      }

      lists.push({ ordered, items, nested });
      continue;
    }

    // Parágrafo: linhas seguidas até uma linha em branco ou um novo bloco.
    const paragraph = [];
    while (index < lines.length) {
      const current = lines[index] ?? '';
      if (!current.trim()) break;
      if (paragraph.length > 0 && (HEADING.test(current.trim()) || FENCE.test(current) || TABLE_ROW.test(current.trim()) || BULLET.test(current))) break;
      paragraph.push(current.trim());
      index += 1;
    }

    const text = paragraph.join(' ');
    if (text) {
      paragraphs.push({ text, line: index });
      collectLinks(text, index);
    }
  }

  return { meta, headings, fences, tables, slots, lists, paragraphs, links, externalLinks };
}

/* -------------------------------------------------------------------------- */
/* Comparação                                                                 */
/* -------------------------------------------------------------------------- */

function describe(value) {
  return JSON.stringify(value);
}

function compareStructure(name, source, translated) {
  const checks = [
    ['títulos', source.headings.length, translated.headings.length],
    ['blocos de código', source.fences.length, translated.fences.length],
    ['tabelas', source.tables.length, translated.tables.length],
    ['listas', source.lists.length, translated.lists.length],
    ['diretivas :::', source.slots.length, translated.slots.length],
  ];

  for (const [label, expected, actual] of checks) {
    if (expected !== actual) {
      fail(`${name}: ${label} — ${actual} na tradução, ${expected} no inglês`);
      return false;
    }
  }

  const levels = (page) => page.headings.map((heading) => heading.level).join(',');
  if (levels(source) !== levels(translated)) {
    fail(`${name}: níveis de título diferentes — ${levels(translated)} contra ${levels(source)}`);
    return false;
  }

  const langs = source.fences.join(',');
  if (langs !== translated.fences.join(',')) {
    fail(`${name}: linguagens de código diferentes — ${describe(translated.fences)} contra ${describe(source.fences)}`);
    return false;
  }

  for (const [position, table] of source.tables.entries()) {
    const other = translated.tables[position];
    if (table.columns !== other.columns || table.rows.length !== other.rows.length) {
      fail(
        `${name}: tabela ${position + 1} — ${other.columns}x${other.rows.length} na tradução, ` +
          `${table.columns}x${table.rows.length} no inglês`,
      );
      return false;
    }
  }

  const shape = (page) => page.lists.map((list) => `${list.ordered ? 'o' : 'u'}${list.items}/${list.nested}`).join(' ');
  if (shape(source) !== shape(translated)) {
    fail(`${name}: listas diferentes — ${shape(translated)} contra ${shape(source)}`);
    return false;
  }

  if (source.slots.join(',') !== translated.slots.join(',')) {
    fail(`${name}: diretivas diferentes — ${describe(translated.slots)} contra ${describe(source.slots)}`);
    return false;
  }

  const externals = (page) => [...new Set(page.externalLinks)].sort().join(' ');
  if (externals(source) !== externals(translated)) {
    fail(`${name}: URLs externas diferentes — ${externals(translated) || 'nenhuma'}`);
    return false;
  }

  return true;
}

/** Âncora traduzida correspondente: mesmo título, na mesma posição. */
function suggestAnchor(source, translated, anchor) {
  const position = source.headings.findIndex((heading) => heading.id === anchor);
  if (position < 0) return null;
  return translated.headings[position]?.id ?? null;
}

function checkLinks(slug, name, page, pages, englishPages) {
  const internal = (href) => href.startsWith('/docs') || href.startsWith('#');

  for (const link of page.links) {
    if (!internal(link.href)) continue;

    const inPage = link.href.startsWith('#');
    const [path, anchor] = link.href.split('#');
    const slugTarget = (path ?? '').replace(/^\/docs\/?/, '');

    if (inPage && !anchor) {
      fail(`${name}:${link.line}: link de âncora vazio`);
      continue;
    }

    if (!inPage && !pages.has(slugTarget)) {
      fail(`${name}:${link.line}: link para página inexistente ${link.href}`);
      continue;
    }

    if (!anchor) continue;

    const target = inPage ? page : pages.get(slugTarget);
    if (target.headings.some((heading) => heading.id === anchor)) continue;

    const original = inPage ? englishPages.get(slug) : englishPages.get(slugTarget);
    const suggestion = original ? suggestAnchor(original, target, anchor) : null;

    fail(
      `${name}:${link.line}: âncora inexistente ${link.href}` +
        (suggestion ? ` — use #${suggestion}` : ''),
    );
  }

  // A mesma lista de páginas de destino, para não perder um link na tradução.
  const targets = (current) =>
    current.links
      .filter((link) => link.href.startsWith('/docs'))
      .map((link) => (link.href.split('#')[0] ?? '').replace(/^\/docs\/?/, ''))
      .sort()
      .join(' ');

  const source = englishPages.get(slug);
  if (source && targets(source) !== targets(page)) {
    fail(`${name}: os links internos não batem com o inglês — ${targets(page)}`);
  }
}

function checkTrailer(name, source, translated) {
  const last = (page) => page.paragraphs[page.paragraphs.length - 1]?.text ?? '';
  const sourceTail = last(source);
  if (!CONTINUATION.test(sourceTail)) return;

  const tail = last(translated);
  if (!CONTINUATION.test(tail)) {
    fail(`${name}: o rodapé de continuação não foi traduzido — "${tail.slice(0, 60)}"`);
  }
}

/* -------------------------------------------------------------------------- */
/* Execução                                                                   */
/* -------------------------------------------------------------------------- */

const locales = readdirSync(ROOT)
  .filter((entry) => statSync(join(ROOT, entry)).isDirectory())
  .filter((entry) => {
    try {
      statSync(join(ROOT, entry, 'nav.json'));
      return true;
    } catch {
      return false;
    }
  });

if (locales.length === 0) {
  console.error('Nenhum idioma em user-docs/ (esperava subpastas com nav.json).');
  process.exit(1);
}

const baseNav = readJson(join(ROOT, 'nav.json'));
const baseSlugs = baseNav.sections.flatMap((section) => section.items.map((item) => item.slug));

const sources = new Map();
for (const slug of baseSlugs) {
  const file = slug === '' ? 'index.md' : `${slug}.md`;
  sources.set(slug, scan(read(join(ROOT, file))));
}

let pages = 0;

for (const locale of locales) {
  const nav = readJson(join(ROOT, locale, 'nav.json'));
  const slugs = nav.sections.flatMap((section) => section.items.map((item) => item.slug));

  if (nav.sections.length !== baseNav.sections.length) {
    fail(`${locale}/nav.json: ${nav.sections.length} seções, esperava ${baseNav.sections.length}`);
  }

  if (slugs.join(' ') !== baseSlugs.join(' ')) {
    fail(`${locale}/nav.json: slugs fora de ordem — ${slugs.join(', ')}`);
  }

  const localized = new Map();

  for (const slug of baseSlugs) {
    const file = slug === '' ? 'index.md' : `${slug}.md`;
    const source = sources.get(slug);

    let raw;
    try {
      raw = read(join(ROOT, locale, file));
    } catch {
      fail(`${locale}/${file}: tradução ausente`);
      continue;
    }

    const page = scan(raw);

    if (!page.meta.title?.trim() || !page.meta.description?.trim()) {
      fail(`${locale}/${file}: frontmatter incompleto (title e description são obrigatórios)`);
    }

    if (page.meta.title?.includes('`') || page.meta.description?.includes('`')) {
      note(`${locale}/${file}: frontmatter com crases — o texto é exibido como está`);
    }

    compareStructure(`${locale}/${file}`, source, page);
    checkTrailer(`${locale}/${file}`, source, page);

    localized.set(slug, page);
    pages += 1;
  }

  for (const [slug, page] of localized) {
    const file = slug === '' ? 'index.md' : `${slug}.md`;
    checkLinks(slug, `${locale}/${file}`, page, localized, sources);
  }
}

/* -------------------------------------------------------------------------- */
/* Relatório                                                                  */
/* -------------------------------------------------------------------------- */

if (notes.length && !quiet) {
  for (const message of notes) console.warn(`aviso: ${message}`);
}

if (failures.length) {
  console.error(`\nParidade da documentação falhou (${failures.length} problemas):`);
  for (const message of failures) console.error(`  ${message}`);
  console.error(`\nIdiomas verificados: ${locales.join(', ')} · ${pages} páginas.`);
  process.exit(1);
}

console.log(
  `Documentação em paridade: ${locales.join(', ')} — ${pages} páginas traduzidas, ` +
    `${baseSlugs.length} páginas por idioma.`,
);
