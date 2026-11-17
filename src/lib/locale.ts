import { locales, routing, type Locale } from '@/i18n/routing';

/**
 * Utilitários de caminho e de SEO por idioma.
 *
 * O site usa `localePrefix: 'as-needed'`: o idioma padrão não recebe prefixo e
 * os demais recebem o código na frente. Tudo o que precisa montar uma URL ou um
 * `hreflang` passa por aqui, para que acrescentar um catálogo em `routing.ts`
 * valha para o site inteiro sem caçar `'pt-BR'` hardcoded nas páginas.
 */

/** Prefixo do idioma: `''` para o padrão e `/pt-BR` (ou `/zh-CN`) para os demais. */
export function localePrefix(locale: Locale | string): string {
  return locale === routing.defaultLocale ? '' : `/${locale}`;
}

/**
 * Caminho de um recurso dentro de um idioma, sempre começando por `/`.
 * A home é `'/'`: continua `'/'` no idioma padrão e vira `/pt-BR` nos demais.
 */
export function localizedPath(locale: Locale | string, path: string): string {
  const prefix = localePrefix(locale);
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
}

/**
 * `hreflang` de todos os catálogos para um mesmo caminho, no formato que
 * `alternates.languages` (metadata) e o sitemap esperam. `x-default` fica no
 * idioma padrão.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = localizedPath(locale, path);
  }

  languages['x-default'] = localizedPath(routing.defaultLocale, path);

  return languages;
}

/** `openGraph.locale` no formato `idioma_PAÍS` exigido pela spec do Open Graph. */
const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  'pt-BR': 'pt_BR',
  'zh-CN': 'zh_CN',
};

export function ogLocale(locale: Locale): string {
  return openGraphLocales[locale];
}

/** Os demais idiomas publicados, para `openGraph.alternateLocale`. */
export function ogAlternateLocales(locale: Locale): string[] {
  return locales.filter((other) => other !== locale).map(ogLocale);
}
