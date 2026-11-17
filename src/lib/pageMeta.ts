import 'server-only';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import {
  languageAlternates,
  localizedPath,
  ogAlternateLocales,
  ogLocale,
} from '@/lib/locale';
import { absoluteUrl } from '@/lib/url';

/**
 * Metadata das páginas de conteúdo.
 *
 * Todas seguem o mesmo contrato: `metaTitle` e `metaDescription` no namespace
 * da página, canônico com prefixo de idioma e `hreflang` para todos os
 * catálogos publicados (`@/lib/locale`). A imagem social continua sendo a de
 * `[locale]/opengraph-image.tsx`, herdada pela rota — nada de asset novo por
 * página.
 */
export async function buildPageMetadata({
  locale,
  path,
  namespace,
}: {
  locale: Locale;
  /** Caminho canônico sem prefixo de idioma, ex.: `/features`. */
  path: string;
  /** Namespace que expõe `metaTitle` e `metaDescription`. */
  namespace: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const localized = localizedPath(locale, path);

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localized,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: 'Zylara',
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: absoluteUrl(localized),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}
