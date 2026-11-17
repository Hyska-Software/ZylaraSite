/**
 * Registro das páginas de conteúdo do site.
 *
 * O cabeçalho, o rodapé, o sitemap e os links "próxima/anterior" leem a mesma
 * lista — assim uma página nova não existe só em um lugar. Os rótulos do menu
 * continuam nas chaves `Nav.*` dos catálogos, porque são os mesmos nomes que a
 * landing usava quando estes itens eram âncoras.
 */

import type { Locale } from '@/i18n/routing';
import { localizedPath } from '@/lib/locale';

export const pagePaths = {
  features: '/features',
  howItWorks: '/how-it-works',
  whyZylara: '/why-zylara',
  faq: '/faq',
} as const;

export type PageId = keyof typeof pagePaths;

/** Ordem das páginas no menu e nos links de continuação. */
export const pageOrder = ['features', 'howItWorks', 'whyZylara', 'faq'] as const satisfies
  readonly PageId[];

/** Rótulo de cada página no menu: reutiliza as chaves `Nav.*`. */
export const pageLabelKeys = {
  features: 'features',
  howItWorks: 'workflow',
  whyZylara: 'positioning',
  faq: 'faq',
} as const satisfies Record<PageId, string>;

/**
 * Caminho de um recurso dentro da página `/features`, para o `Link` do
 * next-intl (que aplica o prefixo de idioma). O âncora é o mesmo `id` do card
 * correspondente na landing, então deep links antigos continuam válidos.
 */
export function featurePageHref(anchor: string) {
  return `${pagePaths.features}#${anchor}`;
}

/** Caminho com prefixo de idioma, para `<a>` que não passa pelo `Link`. */
export function pageHref(locale: Locale, id: PageId) {
  return localizedPath(locale, pagePaths[id]);
}

/**
 * Seções de cada página, na ordem em que aparecem.
 *
 * A página usa `id` para o `aria-labelledby`/âncora e `key` para buscar
 * `eyebrow`, `title` e `subtitle` no catálogo; a navbar usa a mesma lista, então
 * um submenu nunca aponta para um âncora que deixou de existir.
 */
export const pageSections = {
  howItWorks: [
    { id: 'loop', key: 'loop' },
    { id: 'turn', key: 'turn' },
    { id: 'permissions', key: 'permissions' },
    { id: 'control', key: 'control' },
    { id: 'modes', key: 'modes' },
  ],
  whyZylara: [
    { id: 'principles', key: 'principles' },
    { id: 'compare', key: 'compare' },
    { id: 'local-first', key: 'localFirst' },
    { id: 'limits', key: 'limits' },
    { id: 'audience', key: 'audience' },
  ],
} as const;

/** Âncora do primeiro grupo do FAQ; os demais vêm de `FaqPage.groups`. */
export const faqGeneralSectionId = 'general';

/** Caminho de uma seção da página, para o `Link` do next-intl. */
export function pageSectionHref(path: string, sectionId: string) {
  return `${path}#${sectionId}`;
}
