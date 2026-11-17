/**
 * Modelo do conteúdo da documentação.
 *
 * A prosa das páginas **não** mora em `messages/*.json` (que é para a interface):
 * ela vive em uma coleção tipada por idioma (`src/content/docs/<locale>.ts`).
 * Assim o `tsc` garante a paridade entre catálogos — mesma página, mesmas
 * seções, mesmos blocos — sem precisar de um checador à parte, e acrescentar
 * conteúdo novo é só editar um objeto.
 *
 * Um bloco é declarativo: quem renderiza é `DocsArticle`, que aplica os mesmos
 * tokens e a mesma tipografia do resto do site.
 */

import type { Locale } from '@/i18n/routing';

/** Identificador estável da página: é o `slug` da rota (`/docs/<slug>`). */
export type DocSlug = 'intro' | 'install' | 'providers' | 'permissions' | 'troubleshooting';

/** Grupos da navegação lateral, na ordem em que aparecem. */
export type DocGroupId = 'start' | 'configure' | 'help';

/**
 * Blocos de conteúdo.
 *
 * `text` e `items` aceitam a marcação inline mínima de `DocsInline`:
 * `[rótulo](url)` vira link e `` `x` `` vira código.
 */
export type DocBlock =
  | { kind: 'text'; text: string }
  | { kind: 'list'; items: readonly string[]; ordered?: boolean }
  /** Aviso neutro: rótulo + texto, sem caixa colorida (DESIGN.md §15). */
  | { kind: 'note'; label: string; text: string }
  /** Bloco de código com abas; a primeira aba é a padrão. */
  | { kind: 'code'; tabs: readonly DocCodeTab[] }
  | { kind: 'table'; head: readonly string[]; rows: readonly (readonly string[])[] }
  /** Instaladores da release publicada, resolvidos no servidor. */
  | { kind: 'installers' };

export type DocCodeTab = { label: string; code: string };

export type DocSection = {
  /** Âncora da seção e id do item no índice "Nesta página". */
  id: string;
  title: string;
  blocks: readonly DocBlock[];
};

export type DocPage = {
  slug: DocSlug;
  group: DocGroupId;
  /** `h1` da página e rótulo na navegação lateral. */
  title: string;
  /** Uma linha: aparece na busca e na `meta description`. */
  summary: string;
  /** Parágrafo de abertura, abaixo do título. */
  lede: string;
  sections: readonly DocSection[];
};

/** Rótulos fixos do shell da documentação. */
export type DocsChrome = {
  /** Marca no topo da navegação lateral ("Docs"). */
  label: string;
  menu: string;
  closeMenu: string;
  nav: string;
  search: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchHint: string;
  searchOpen: string;
  onThisPage: string;
  groups: Record<DocGroupId, string>;
  previous: string;
  next: string;
  pagination: string;
  repository: string;
  latest: string;
  formats: string;
  allDownloads: string;
  checksums: string;
  copy: string;
  copied: string;
  beta: string;
};

export type DocsContent = {
  chrome: DocsChrome;
  /** Ordem da navegação, do "anterior/próxima" e do índice da busca. */
  pages: readonly DocPage[];
};

/** O catálogo precisa existir para todo idioma publicado. */
export type DocsCatalog = Record<Locale, DocsContent>;
