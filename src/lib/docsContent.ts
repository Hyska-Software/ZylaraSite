import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cache } from 'react';
import type {
  DocBlock,
  DocPage,
  DocsData,
  DocsNavItem,
  DocsNavSection,
  InlineNode,
} from '@/content/docs/types';
import { routing, type Locale } from '@/i18n/routing';
import { parseDoc } from '@/lib/docsMarkdown';

/**
 * Carrega o acervo de `user-docs/` no build, por idioma.
 *
 * O site é pré-renderizado, então ler os arquivos aqui é seguro: quem publica
 * edita o Markdown, e `next build` gera as páginas. Nada de cópia paralela do
 * conteúdo — `nav.json` é a navegação e cada `slug` é o próprio arquivo.
 *
 * O inglês mora na raiz de `user-docs/` e é a fonte da verdade: define a ordem
 * das seções, a lista de páginas e o texto de quem ainda não tem tradução. Cada
 * idioma publicado pode ter uma sobreposição em `user-docs/<idioma>/` com o
 * próprio `nav.json` e os `.md` traduzidos; o que faltar cai no inglês, então
 * uma tradução parcial continua publicável.
 *
 * A leitura acontece no servidor; os componentes recebem apenas dados já
 * montados, e as páginas da documentação são estáticas (`dynamicParams: false`),
 * então não existe `fs` em tempo de requisição.
 */

const DOCS_ROOT = join(process.cwd(), 'user-docs');

/** Raiz do acervo de um idioma: o inglês na raiz, os demais na subpasta. */
function localeRoot(locale: Locale): string {
  return locale === routing.defaultLocale ? DOCS_ROOT : join(DOCS_ROOT, locale);
}

type NavFile = {
  sections?: {
    title?: unknown;
    items?: { title?: unknown; slug?: unknown; description?: unknown }[];
  }[];
};

/** Seções cruas do `nav.json`, sem descartar nada: a ordem é comparável. */
type RawNavSection = { title: string; items: DocsNavItem[] };

function parseNav(file: string): RawNavSection[] | null {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as NavFile;

    return (parsed.sections ?? []).map((section) => ({
      title: typeof section.title === 'string' ? section.title : '',
      items: (section.items ?? []).flatMap((item) => {
        const slug = typeof item.slug === 'string' ? item.slug : '';
        const title = typeof item.title === 'string' ? item.title : '';
        const description = typeof item.description === 'string' ? item.description : '';
        if (!title) return [];
        return [{ slug, title, description }];
      }),
    }));
  } catch (error) {
    console.warn(`[docs] não consegui ler ${file}: ${String(error)}`);
    return null;
  }
}

/**
 * Navegação do idioma.
 *
 * A árvore do inglês manda na ordem e no conjunto de páginas; o `nav.json` do
 * idioma só traduz — título de seção por posição, item por `slug`. Assim uma
 * página nova na raiz aparece em todos os idiomas (no texto em inglês, até ser
 * traduzida) em vez de sumir da navegação.
 */
function readNav(locale: Locale): DocsNavSection[] {
  const base = parseNav(join(DOCS_ROOT, 'nav.json'));
  if (!base) return [];

  const localized = locale === routing.defaultLocale ? null : parseNav(join(localeRoot(locale), 'nav.json'));

  return base.flatMap((section, index) => {
    const overlay = localized?.[index];
    const title = overlay?.title.trim() || section.title;

    const items = section.items.map((item) => {
      const translated = overlay?.items.find((candidate) => candidate.slug === item.slug);
      return {
        slug: item.slug,
        title: translated?.title.trim() || item.title,
        description: translated?.description.trim() || item.description,
      };
    });

    return title && items.length > 0 ? [{ title, items }] : [];
  });
}

function readPage(locale: Locale, slug: string): DocPage | null {
  const file = slug === '' ? 'index.md' : `${slug}.md`;
  const roots = localeRoot(locale) === DOCS_ROOT ? [DOCS_ROOT] : [localeRoot(locale), DOCS_ROOT];

  for (const root of roots) {
    let source: string;

    try {
      source = readFileSync(join(root, file), 'utf8');
    } catch (error) {
      // Arquivo ausente na tradução é o caso normal da sobreposição parcial.
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.warn(`[docs] falha ao ler ${join(root, file)}: ${String(error)}`);
      }
      continue;
    }

    const { title, description, blocks } = parseDoc(source);

    return {
      slug,
      // O frontmatter manda; sem ele, cai no `title` do nav.json.
      title: title || slug,
      description,
      blocks,
    };
  }

  console.warn(`[docs] não encontrei ${file} (idioma ${locale})`);
  return null;
}

/** Texto "cru" dos trechos inline, ignorando o conteúdo de `code` (que é literal). */
function plainText(nodes: readonly InlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.t === 'text') return node.v;
      if (node.t === 'strong' || node.t === 'em') return plainText(node.c);
      return '';
    })
    .join('');
}

/** Aviso de sintaxe que o parser não cobre: aparece como texto, não quebra a página. */
const warned = new Set<string>();

function warn(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[docs] ${message}`);
}

function warnOnLeftoverMarkup(page: DocPage) {
  const walk = (blocks: DocBlock[]) => {
    for (const block of blocks) {
      const texts =
        block.type === 'p'
          ? [plainText(block.content)]
          : block.type === 'table'
            ? [...block.head.map(plainText), ...block.rows.flat().map(plainText)]
            : block.type === 'list'
              ? block.list.items.map((item) => plainText(item.content))
              : [];

      for (const text of texts) {
        if (/\*\*|`/.test(text)) {
          warn(`${page.slug || 'index'}: marcação não reconhecida em "${text.slice(0, 60)}"`);
        }
      }
    }
  };

  walk(page.blocks);
}

/** Links internos: `/docs/<slug>#<âncora>` precisa existir do outro lado. */
function warnOnBrokenLinks(page: DocPage, pages: Record<string, DocPage>) {
  const check = (nodes: readonly InlineNode[]) => {
    for (const node of nodes) {
      if (node.t === 'strong' || node.t === 'em') {
        check(node.c);
        continue;
      }
      if (node.t !== 'link' || !node.href.startsWith('/docs')) continue;

      const [path, anchor] = node.href.split('#');
      const slug = (path ?? '').replace(/^\/docs\/?/, '');
      const target = pages[slug];

      if (!target) {
        warn(`${page.slug || 'index'}: link para página inexistente ${node.href}`);
        continue;
      }

      if (anchor) {
        const hasAnchor = target.blocks.some(
          (block) => (block.type === 'h2' || block.type === 'h3') && block.id === anchor,
        );
        if (!hasAnchor) warn(`${page.slug || 'index'}: âncora inexistente em ${node.href}`);
      }
    }
  };

  for (const block of page.blocks) {
    if (block.type === 'p') check(block.content);
    if (block.type === 'list') block.list.items.forEach((item) => check(item.content));
    if (block.type === 'table') [...block.head, ...block.rows.flat()].forEach(check);
  }
}

export const getDocsData = cache((locale: Locale): DocsData => {
  const sections = readNav(locale);
  const pages: Record<string, DocPage> = {};

  for (const section of sections) {
    for (const item of section.items) {
      if (pages[item.slug]) continue;
      const page = readPage(locale, item.slug);
      if (!page) continue;
      pages[item.slug] = page;
      warnOnLeftoverMarkup(page);
    }
  }

  for (const page of Object.values(pages)) warnOnBrokenLinks(page, pages);

  return { sections, pages };
});
