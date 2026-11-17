/**
 * Acesso ao catálogo da documentação.
 *
 * O conteúdo mora em `src/content/docs` (um arquivo por idioma); aqui ficam só
 * as consultas que as páginas e o shell usam — navegação agrupada, âncoras do
 * índice, anterior/próxima e o caminho canônico de cada página. A ordem das
 * páginas na navegação é a ordem do array `pages` do catálogo, então
 * acrescentar uma página é acrescentar um objeto, sem mexer em rota nenhuma.
 */

import type {
  DocGroupId,
  DocPage,
  DocSlug,
  DocsChrome,
  DocsContent,
} from '@/content/docs/types';
import { docsCatalog } from '@/content/docs';
import { routing, type Locale } from '@/i18n/routing';

/** Página de entrada da documentação; é também o `slug` da rota `/docs`. */
export const docsEntrySlug = 'intro' satisfies DocSlug;

/** Ordem fixa dos grupos na navegação lateral. */
export const docGroupOrder = ['start', 'configure', 'help'] as const satisfies readonly DocGroupId[];

export type DocsNavItem = {
  slug: DocSlug;
  title: string;
  summary: string;
  /** Caminho sem prefixo de idioma, para o `Link` do next-intl. */
  href: string;
};

export type DocsNavGroup = { id: DocGroupId; label: string; pages: DocsNavItem[] };

export type DocsTocItem = { id: string; title: string };

/** Caminho canônico da página, sem prefixo de idioma. A entrada é `/docs`. */
export function docPath(slug: DocSlug): string {
  return slug === docsEntrySlug ? '/docs' : `/docs/${slug}`;
}

export function docsContent(locale: Locale): DocsContent {
  return docsCatalog[locale];
}

export function docsChrome(locale: Locale): DocsChrome {
  return docsCatalog[locale].chrome;
}

export function docsPage(locale: Locale, slug: DocSlug): DocPage | undefined {
  return docsCatalog[locale].pages.find((page) => page.slug === slug);
}

/** Slugs publicados, na ordem do catálogo. */
export function docsSlugs(locale: Locale): DocSlug[] {
  return docsCatalog[locale].pages.map((page) => page.slug);
}

/**
 * Valida um segmento de rota: só slug publicado vira página; o resto cai em
 * `notFound()`. Evita cast de `string` para `DocSlug` na rota dinâmica.
 */
export function isDocSlug(value: string): value is DocSlug {
  return docsSlugs(routing.defaultLocale).some((slug) => slug === value);
}

function toNavItem(page: DocPage): DocsNavItem {
  return { slug: page.slug, title: page.title, summary: page.summary, href: docPath(page.slug) };
}

/** Páginas de um idioma agrupadas para a navegação lateral (grupos vazios saem). */
export function docsNav(locale: Locale): DocsNavGroup[] {
  const { pages, chrome } = docsCatalog[locale];

  return docGroupOrder
    .map((id) => ({
      id,
      label: chrome.groups[id],
      pages: pages.filter((page) => page.group === id).map(toNavItem),
    }))
    .filter((group) => group.pages.length > 0);
}

/** Índice "Nesta página": as seções do conteúdo, na ordem em que aparecem. */
export function docsToc(page: DocPage): DocsTocItem[] {
  return page.sections.map((section) => ({ id: section.id, title: section.title }));
}

/** Links de continuação na ordem em que a navegação mostra as páginas. */
export function docsNeighbours(
  locale: Locale,
  slug: DocSlug,
): { previous?: DocsNavItem; next?: DocsNavItem } {
  const pages = docsCatalog[locale].pages;
  const index = pages.findIndex((page) => page.slug === slug);
  if (index < 0) return {};

  const previous = index > 0 ? pages[index - 1] : undefined;
  const next = index < pages.length - 1 ? pages[index + 1] : undefined;

  return {
    ...(previous ? { previous: toNavItem(previous) } : {}),
    ...(next ? { next: toNavItem(next) } : {}),
  };
}

/** Índice da busca (Ctrl K): todas as páginas, com o grupo como contexto. */
export function docsSearchIndex(
  locale: Locale,
): (DocsNavItem & { group: string })[] {
  return docsNav(locale).flatMap((group) =>
    group.pages.map((page) => ({ ...page, group: group.label })),
  );
}

export type { DocPage, DocSlug, DocsChrome, DocGroupId };
