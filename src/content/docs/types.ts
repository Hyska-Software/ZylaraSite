/**
 * Modelo da documentação publicada.
 *
 * O conteúdo **não** mora no código: cada página é um arquivo Markdown em
 * `user-docs/`, e `user-docs/nav.json` é a árvore da navegação lateral (fonte de
 * verdade do seu time). `@/lib/docsMarkdown` lê esses arquivos no build e
 * produz os blocos abaixo; os componentes só sabem desenhar blocos.
 *
 * Nada aqui é JSX nem HTML: são dados serializáveis, o que mantém a renderização
 * fora de `dangerouslySetInnerHTML` e deixa a tipografia nas mãos do site.
 */

/** Trecho de texto com a marcação que o acervo usa: `code`, **forte**, *ênfase* e links. */
export type InlineNode =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: InlineNode[] }
  | { t: 'em'; c: InlineNode[] }
  | { t: 'code'; v: string }
  | { t: 'link'; v: string; href: string };

export type DocListItem = {
  content: InlineNode[];
  /** Sub-lista do item (segundo nível), quando o passo tem opções. */
  children?: DocList;
};

export type DocList = {
  ordered: boolean;
  /** Primeiro número da lista ordenada (`1` na maioria das páginas). */
  start: number;
  items: DocListItem[];
};

export type DocBlock =
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; id: string; text: string }
  | { type: 'p'; content: InlineNode[] }
  | { type: 'list'; list: DocList }
  | { type: 'table'; head: InlineNode[][]; rows: InlineNode[][][] }
  | { type: 'code'; lang: string; code: string }
  /** Conteúdo que o site resolve na hora (não vem do Markdown), ex.: instaladores. */
  | { type: 'slot'; name: DocSlotName };

/** Ganchos que o Markdown pede e o site preenche com dados reais. */
export type DocSlotName = 'downloads';

export type DocPage = {
  /** Nome do arquivo sem `.md`; vazio para a página de entrada (`index.md`). */
  slug: string;
  title: string;
  /** Uma frase: subtítulo da página, `meta description` e resultado da busca. */
  description: string;
  blocks: DocBlock[];
};

export type DocsNavItem = {
  slug: string;
  title: string;
  description: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

/** Árvore de navegação achatada em uma árvore de páginas carregadas. */
export type DocsData = {
  sections: DocsNavSection[];
  /** Indexado por `slug`; `''` é a entrada. */
  pages: Record<string, DocPage>;
};

/**
 * Rótulos da moldura da documentação (busca, índice, anterior/próxima).
 *
 * O conteúdo e os títulos das páginas vêm do acervo em inglês; estes rótulos
 * são da interface e continuam traduzidos nos catálogos de idioma do site.
 */
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
  previous: string;
  next: string;
  pagination: string;
  repository: string;
  copy: string;
  copied: string;
  /** Bloco de downloads: versão publicada, tamanho e links da release. */
  downloads: string;
  publishedVersion: string;
  releaseNotes: string;
  allReleases: string;
  checksums: string;
};
