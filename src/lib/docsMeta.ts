import 'server-only';

import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import { docPath, docsChrome, docsPage, type DocSlug } from '@/lib/docs';
import {
  languageAlternates,
  localizedPath,
  ogAlternateLocales,
  ogLocale,
} from '@/lib/locale';
import { absoluteUrl } from '@/lib/url';

/**
 * Metadata de uma página da documentação.
 *
 * Título e descrição saem do catálogo da documentação (não de `messages/`), e o
 * canônico/hreflang usam o caminho da própria página — então uma página nova
 * aparece nos buscadores em todos os idiomas publicados sem configuração extra.
 */
export function buildDocsMetadata({ locale, slug }: { locale: Locale; slug: DocSlug }): Metadata {
  const page = docsPage(locale, slug);
  if (!page) return {};

  const chrome = docsChrome(locale);
  const path = docPath(slug);
  const localized = localizedPath(locale, path);
  const title = `${page.title} · Zylara ${chrome.label}`;

  return {
    title,
    description: page.summary,
    alternates: {
      canonical: localized,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'article',
      siteName: 'Zylara',
      title,
      description: page.summary,
      url: absoluteUrl(localized),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}
