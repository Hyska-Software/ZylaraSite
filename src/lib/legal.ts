/**
 * Dados das páginas legais (Termos de Serviço e Política de Privacidade).
 *
 * Nada aqui é inventado no texto: contato, data da última revisão e a ordem das
 * jurisdições vivem num único lugar. O conteúdo jurídico em si fica nos
 * catálogos (`messages/*.json`), para que trocar a redação não exija código.
 *
 * `legalRegions` é a ordem do seletor de região e das seções ancoradas em cada
 * página. Trocar a ordem (ou remover uma jurisdição) basta aqui: as mensagens
 * seguem a mesma chave.
 */

export const legalContactEmail = 'legal@hyska.com.br';

/** Data editorial da última revisão; renderizada com `<time dateTime>`. */
export const legalUpdatedAt = '2026-11-10';

export const legalRegions = ['unitedStates', 'europe', 'brazil'] as const;

export type LegalRegionId = (typeof legalRegions)[number];

/** Slugs internos; o `Link` do next-intl aplica o prefixo de idioma. */
export const legalPaths = {
  terms: '/terms',
  privacy: '/privacy',
} as const;

export type LegalDocumentId = keyof typeof legalPaths;
