import 'server-only';

import type { Metadata } from 'next';
import { docsChrome } from '@/content/docs/chrome';
import type { Locale } from '@/i18n/routing';
import { docPath } from '@/lib/docs';
import { getDocsData } from '@/lib/docsContent';
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
 * Título e descrição vêm do próprio arquivo (`frontmatter` de `user-docs/`), e
 * canônico/hreflang usam o caminho da página — uma página nova no `nav.json`
 * entra nos buscadores em todos os idiomas publicados sem configuração extra.
 */
export function buildDocsMetadata({ locale, slug }: { locale: Locale; slug: string }): Metadata {
  const page = getDocsData(locale).pages[slug];
  if (!page) return {};

  const chrome = docsChrome(locale);
  const path = docPath(slug);
  const localized = localizedPath(locale, path);
  const title = `${page.title} · Zylara ${chrome.label}`;

  return {
    title,
    description: page.description,
    alternates: {
      canonical: localized,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'article',
      siteName: 'Zylara',
      title,
      description: page.description,
      url: absoluteUrl(localized),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}
