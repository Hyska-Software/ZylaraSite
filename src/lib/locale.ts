import type { Locale } from '@/i18n/routing';

export function alternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'pt-BR' : 'en';
}

/** Prefixo de `href` para âncoras internas: `/` (en) ou `/pt-BR`. */
export function localePath(locale: Locale): string {
  return locale === 'en' ? '/' : `/${locale}`;
}
