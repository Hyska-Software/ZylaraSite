/**
 * Consultas sobre o acervo da documentação.
 *
 * `nav.json` define ordem, títulos e agrupamento; aqui isso vira o que a
 * interface precisa — navegação lateral, índice da página, anterior/próxima e o
 * índice da busca. Funções puras: recebem os dados já carregados por
 * `@/lib/docsContent` e devolvem estruturas prontas para os componentes.
 */

import type { DocPage, DocsData, DocsNavItem } from '@/content/docs/types';

/** Slug da página de entrada (`index.md`, publicada em `/docs`). */
export const docsIndexSlug = '';

/** Caminho canônico sem prefixo de idioma. */
export function docPath(slug: string): string {
  return slug ? `/docs/${slug}` : '/docs';
}

/** Item de navegação já resolvido para `Link` do next-intl. */
export type DocsPageLink = {
  slug: string;
  href: string;
  title: string;
  summary: string;
};

export type DocsNavGroup = {
  /** Chave estável do grupo (a seção do `nav.json`, por posição). */
  id: string;
  label: string;
  pages: DocsPageLink[];
};

export type DocsTocItem = { id: string; title: string };

function toLink(item: DocsNavItem): DocsPageLink {
  return {
    slug: item.slug,
    href: docPath(item.slug),
    title: item.title,
    summary: item.description,
  };
}

/** Navegação lateral: seções do `nav.json` com as páginas que existem em disco. */
export function docsGroups(data: DocsData): DocsNavGroup[] {
  return data.sections
    .map((section, index) => ({
      id: `section-${index}`,
      label: section.title,
      pages: section.items.filter((item) => data.pages[item.slug]).map(toLink),
    }))
    .filter((group) => group.pages.length > 0);
}

/** Todas as páginas na ordem da navegação (base de anterior/próxima e busca). */
export function docsOrder(data: DocsData): DocsPageLink[] {
  return docsGroups(data).flatMap((group) => group.pages);
}

export function docsSlugs(data: DocsData): string[] {
  return docsOrder(data).map((page) => page.slug);
}

/** Links de continuação, na ordem em que a navegação mostra as páginas. */
export function docsNeighbours(
  data: DocsData,
  slug: string,
): { previous?: DocsPageLink; next?: DocsPageLink } {
  const pages = docsOrder(data);
  const index = pages.findIndex((page) => page.slug === slug);
  if (index < 0) return {};

  const previous = index > 0 ? pages[index - 1] : undefined;
  const next = index < pages.length - 1 ? pages[index + 1] : undefined;

  return {
    ...(previous ? { previous } : {}),
    ...(next ? { next } : {}),
  };
}

/** Índice "Nesta página": todo `##` do arquivo, na ordem. */
export function docsToc(page: DocPage): DocsTocItem[] {
  return page.blocks.flatMap((block) =>
    block.type === 'h2' ? [{ id: block.id, title: block.text }] : [],
  );
}

/** Índice da busca (Ctrl K): páginas com o grupo como contexto. */
export function docsSearchIndex(data: DocsData): (DocsPageLink & { group: string })[] {
  return docsGroups(data).flatMap((group) =>
    group.pages.map((page) => ({ ...page, group: group.label })),
  );
}
