import 'server-only';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { absoluteUrl } from '@/lib/url';

/**
 * Metadata das páginas de conteúdo.
 *
 * Todas seguem o mesmo contrato: `metaTitle` e `metaDescription` no namespace
 * da página, canônico com prefixo de idioma e `hreflang` para os dois catálogos.
 * A imagem social continua sendo a de `[locale]/opengraph-image.tsx`, herdada
 * pela rota — nada de asset novo por página.
 */
export async function buildPageMetadata({
  locale,
  path,
  namespace,
}: {
  locale: string;
  /** Caminho canônico sem prefixo de idioma, ex.: `/features`. */
  path: string;
  /** Namespace que expõe `metaTitle` e `metaDescription`. */
  namespace: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const localized = locale === 'en' ? path : `/${locale}${path}`;

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localized,
      languages: {
        en: path,
        'pt-BR': `/pt-BR${path}`,
        'x-default': path,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Zylara',
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: absoluteUrl(localized),
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      alternateLocale: locale === 'en' ? ['pt_BR'] : ['en_US'],
    },
  };
}
