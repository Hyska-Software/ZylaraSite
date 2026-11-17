/**
 * Leitor do Markdown do acervo (`user-docs/`).
 *
 * O site não usa um parser de Markdown completo de propósito: o acervo foi
 * escrito com um subconjunto conhecido — frontmatter `title`/`description`,
 * `##`/`###`, parágrafos, listas (com um nível de sub-lista), tabelas com pipe,
 * blocos de código com linguagem e marcação inline (`code`, **forte**, *ênfase*,
 * links). Implementar exatamente esse recorte evita dependência nova, mantém a
 * saída como dados tipados (nada de `dangerouslySetInnerHTML`) e deixa qualquer
 * sintaxe não suportada visível como texto — nunca como página quebrada.
 */

import type {
  DocBlock,
  DocList,
  DocListItem,
  DocSlotName,
  InlineNode,
} from '@/content/docs/types';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

type Frontmatter = { title: string; description: string };

/** Lê o cabeçalho `---` e devolve os campos que o site usa. */
function readFrontmatter(source: string): { meta: Frontmatter; body: string } {
  const match = FRONTMATTER.exec(source);
  const meta: Frontmatter = { title: '', description: '' };
  if (!match) return { meta, body: source };

  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 0) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    if (key === 'title') meta.title = value;
    if (key === 'description') meta.description = value;
  }

  return { meta, body: source.slice(match[0].length) };
}

/**
 * Âncora de um título: minúsculas, sem marcação e com `-` no lugar do resto.
 *
 * Aceita `\p{L}\p{N}`, não só ASCII: um `##` em chinês precisa virar `id` de
 * verdade, e não string vazia. Para o inglês o resultado é idêntico ao de antes.
 */
export function headingId(value: string): string {
  return value
    .replace(/[`*_[\]]/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/* -------------------------------------------------------------------------- */
/* Inline                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Code span com delimitador de crase do mesmo tamanho (regra do CommonMark).
 *
 * Existe por causa de células como `` ` ```mermaid ` ``: a cerca de três crases
 * dentro de um span de uma crase não pode fechá-lo, então o conteúdo sai inteiro
 * em vez de virar texto com crases soltas.
 */
function matchCodeSpan(value: string, start: number): { v: string; next: number } | null {
  let openEnd = start;
  while (value[openEnd] === '`') openEnd += 1;
  const run = openEnd - start;

  let cursor = openEnd;

  while (cursor < value.length) {
    if (value[cursor] !== '`') {
      cursor += 1;
      continue;
    }

    let closeEnd = cursor;
    while (value[closeEnd] === '`') closeEnd += 1;

    if (closeEnd - cursor === run) {
      let content = value.slice(openEnd, cursor);
      // Um espaço em cada ponta só existe para caber crase no início/fim.
      if (content.length > 2 && content.startsWith(' ') && content.endsWith(' ')) {
        content = content.slice(1, -1);
      }
      return { v: content, next: closeEnd };
    }

    cursor = closeEnd;
  }

  return null;
}

function parseInline(value: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let buffer = '';
  let index = 0;

  const flush = () => {
    if (buffer) nodes.push({ t: 'text', v: buffer });
    buffer = '';
  };

  while (index < value.length) {
    const char = value[index];

    if (char === '`') {
      const span = matchCodeSpan(value, index);
      if (span) {
        flush();
        nodes.push({ t: 'code', v: span.v });
        index = span.next;
        continue;
      }
    }

    if (char === '[') {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(value.slice(index));
      if (link?.[1] && link[2]) {
        flush();
        nodes.push({ t: 'link', v: link[1], href: link[2] });
        index += link[0].length;
        continue;
      }
    }

    if (value.startsWith('***', index)) {
      const end = value.indexOf('***', index + 3);
      if (end > index) {
        flush();
        nodes.push({
          t: 'strong',
          c: [{ t: 'em', c: parseInline(value.slice(index + 3, end)) }],
        });
        index = end + 3;
        continue;
      }
    }

    if (value.startsWith('**', index)) {
      const end = value.indexOf('**', index + 2);
      if (end > index) {
        flush();
        nodes.push({ t: 'strong', c: parseInline(value.slice(index + 2, end)) });
        index = end + 2;
        continue;
      }
    }

    if (char === '*') {
      const end = value.indexOf('*', index + 1);
      if (end > index + 1) {
        flush();
        nodes.push({ t: 'em', c: parseInline(value.slice(index + 1, end)) });
        index = end + 1;
        continue;
      }
    }

    buffer += char;
    index += 1;
  }

  flush();
  return nodes;
}

/** Texto puro de um trecho inline — usado na busca e no índice da página. */
export function inlineText(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.t === 'text' || node.t === 'code' || node.t === 'link') return node.v;
      return inlineText(node.c);
    })
    .join('');
}

/* -------------------------------------------------------------------------- */
/* Blocos                                                                     */
/* -------------------------------------------------------------------------- */

const BULLET = /^(\s*)(?:([-*])|(\d+)\.)\s+(.*)$/;
const HEADING = /^(#{2,3})\s+(.*)$/;
const TABLE_ROW = /^\|/;

/** Divide uma linha de tabela em células, respeitando `code` com pipe dentro. */
function splitRow(line: string): string[] {
  const cells: string[] = [];
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

const TABLE_DIVIDER = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

/**
 * Diretiva de bloco resolvido pelo site (`:::downloads`), no estilo do Pandoc.
 * O conteúdo vem de dados reais (a release publicada), não do arquivo.
 */
const DIRECTIVE = /^:::([a-z][a-z0-9-]*)\s*$/;
const SLOTS: readonly DocSlotName[] = ['downloads'];

type ListResult = { list: DocList; next: number };

/** Item ainda em texto cru: a marcação inline só é lida depois das continuações. */
type RawListItem = { text: string; children?: DocList };

function parseList(lines: string[], start: number): ListResult {
  const first = BULLET.exec(lines[start] ?? '');
  const baseIndent = first?.[1]?.length ?? 0;
  const ordered = Boolean(first?.[3]);
  const startNumber = ordered ? Number(first?.[3] ?? 1) : 1;

  const raw: RawListItem[] = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const bullet = BULLET.exec(line);

    if (!line.trim()) {
      // Uma linha em branco só continua a lista se o próximo item pertencer a ela.
      const nextBullet = BULLET.exec(lines[index + 1] ?? '');
      const nextIndent = nextBullet?.[1]?.length ?? 0;
      if (nextBullet && nextIndent >= baseIndent) {
        index += 1;
        continue;
      }
      break;
    }

    if (!bullet) {
      const indent = line.length - line.trimStart().length;
      const lastItem = raw[raw.length - 1];

      if (lastItem && indent > baseIndent) {
        // Continuação do item atual: entra no mesmo texto e a marcação inline
        // (um `**forte**` que atravessa a quebra de linha) é lida inteira depois.
        lastItem.text = `${lastItem.text} ${line.trim()}`;
        index += 1;
        continue;
      }

      break;
    }

    const indent = bullet[1]?.length ?? 0;
    const isOrdered = Boolean(bullet[3]);

    if (indent > baseIndent) {
      const lastItem = raw[raw.length - 1];
      if (!lastItem) break;

      const nested = parseList(lines, index);
      lastItem.children = nested.list;
      index = nested.next;
      continue;
    }

    if (indent < baseIndent) break;
    if (isOrdered !== ordered) break;

    raw.push({ text: bullet[4] ?? '' });
    index += 1;
  }

  const items: DocListItem[] = raw.map((item) => ({
    content: parseInline(item.text),
    ...(item.children ? { children: item.children } : {}),
  }));

  return { list: { ordered, start: startNumber, items }, next: index };
}

function isBlockStart(line: string): boolean {
  return (
    HEADING.test(line) ||
    line.startsWith('```') ||
    DIRECTIVE.test(line) ||
    TABLE_ROW.test(line) ||
    BULLET.test(line)
  );
}

function parseBlocks(body: string): DocBlock[] {
  const lines = body.split(/\r?\n/);
  const blocks: DocBlock[] = [];
  const usedIds = new Set<string>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = HEADING.exec(trimmed);
    if (heading) {
      const level = heading[1]?.length === 3 ? 'h3' : 'h2';
      const text = (heading[2] ?? '').trim();
      const base = headingId(text);
      let id = base;
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(id);
      blocks.push({ type: level, id, text });
      index += 1;
      continue;
    }

    const directive = DIRECTIVE.exec(trimmed);
    if (directive) {
      const name = directive[1] ?? '';
      // O corpo da diretiva é escrito pela documentação para leitura no arquivo;
      // o site só usa o nome, então o conteúdo entre `:::` e o fechamento é pulado.
      index += 1;
      while (index < lines.length && (lines[index] ?? '').trim() !== ':::') index += 1;
      index += 1;

      if ((SLOTS as readonly string[]).includes(name)) {
        blocks.push({ type: 'slot', name: name as DocSlotName });
      } else {
        console.warn(`[docs] diretiva desconhecida: :::${name}`);
      }
      continue;
    }

    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? '').trim().startsWith('```')) {
        code.push(lines[index] ?? '');
        index += 1;
      }
      index += 1; // fecha a cerca
      blocks.push({ type: 'code', lang, code: code.join('\n') });
      continue;
    }

    if (TABLE_ROW.test(trimmed)) {
      const header: string[] = [];
      const rows: InlineNode[][][] = [];
      let hasDivider = false;

      while (index < lines.length && TABLE_ROW.test((lines[index] ?? '').trim())) {
        const raw = (lines[index] ?? '').trim();
        if (TABLE_DIVIDER.test(raw)) {
          hasDivider = true;
        } else if (!hasDivider) {
          header.push(...splitRow(raw));
        } else {
          rows.push(splitRow(raw).map((cell) => parseInline(cell)));
        }
        index += 1;
      }

      blocks.push({
        type: 'table',
        head: (header.length > 0 ? header : ['', '']).map((cell) => parseInline(cell)),
        rows,
      });
      continue;
    }

    if (BULLET.test(line)) {
      const { list, next } = parseList(lines, index);
      blocks.push({ type: 'list', list });
      index = next;
      continue;
    }

    // Parágrafo: linhas seguidas até uma linha em branco ou o começo de um bloco.
    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index] ?? '';
      if (!current.trim()) break;
      if (paragraph.length > 0 && isBlockStart(current)) break;
      paragraph.push(current.trim());
      index += 1;
    }

    const text = paragraph.join(' ').trim();
    if (text) blocks.push({ type: 'p', content: parseInline(text) });
  }

  return blocks;
}

export type ParsedDoc = { title: string; description: string; blocks: DocBlock[] };

/**
 * Marca a continuação no rodapé do arquivo: `Next: [Página](/docs/...)`.
 * Cada idioma escreve na própria língua; o site só precisa reconhecer o rótulo
 * para descartar o parágrafo repetido.
 */
const CONTINUATION = /^(next|próxim[oa]s?|下一步)\s*[:：]/i;

/** Parágrafo que é apenas um link — continuação escrita sem rótulo. */
function isBareLink(nodes: readonly InlineNode[]): boolean {
  const meaningful = nodes.filter((node) => node.t !== 'text' || node.v.trim() !== '');
  return meaningful.length === 1 && meaningful[0]?.t === 'link';
}

/**
 * Converte um arquivo do acervo em página.
 *
 * O parágrafo final `Next: [Página](/docs/...)`, que 23 páginas usam como
 * continuação, é descartado: o site já mostra anterior/próxima na base do
 * artigo, e repetir o mesmo link duas vezes seguidas só polui. As traduções
 * escrevem o mesmo rodapé no próprio idioma (`Próximo:`, `下一步：`).
 */
export function parseDoc(source: string): ParsedDoc {
  const { meta, body } = readFrontmatter(source);
  const blocks = parseBlocks(body);

  const last = blocks[blocks.length - 1];
  if (last?.type === 'p') {
    const text = inlineText(last.content).trim();
    if (CONTINUATION.test(text) || isBareLink(last.content)) blocks.pop();
  }

  return { title: meta.title, description: meta.description, blocks };
}
