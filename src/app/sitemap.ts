import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { docPath, docsIndexSlug, docsSlugs } from '@/lib/docs';
import { getDocsData } from '@/lib/docsContent';
import { legalPaths } from '@/lib/legal';
import { languageAlternates, localizedPath } from '@/lib/locale';
import { pagePaths } from '@/lib/pages';
import { siteUrl } from '@/lib/url';

/**
 * Sitemap do site.
 *
 * As páginas de conteúdo saem de `pagePaths`/`legalPaths` — o mesmo registro que
 * alimenta menu e rodapé — para não existir uma rota publicada só aqui. A
 * documentação sai do `nav.json` do acervo: página nova no Markdown entra no
 * sitemap no próximo build, sem edição.
 * `alternates.languages` vem de `languageAlternates`: um idioma novo em
 * `routing.ts` entra no sitemap sozinho, sem editar oito blocos na mão.
 */
type Entry = {
  path: string;
  changeFrequency: 'monthly' | 'weekly' | 'yearly';
  priority: number;
};

const entries: Entry[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/download', changeFrequency: 'weekly', priority: 0.9 },
  { path: docPath(docsIndexSlug), changeFrequency: 'weekly', priority: 0.8 },
  // Páginas de tópico da documentação: `nav.json` é a única fonte da lista. Os
  // slugs valem para todos os idiomas; só o texto muda, e o `hreflang` de cada
  // entrada já aponta para as três versões.
  ...docsSlugs(getDocsData(routing.defaultLocale))
    .filter((slug) => slug !== docsIndexSlug)
    .map((slug) => ({
      path: docPath(slug),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  { path: pagePaths.features, changeFrequency: 'monthly', priority: 0.8 },
  { path: pagePaths.howItWorks, changeFrequency: 'monthly', priority: 0.7 },
  { path: pagePaths.whyZylara, changeFrequency: 'monthly', priority: 0.7 },
  { path: pagePaths.faq, changeFrequency: 'monthly', priority: 0.7 },
  { path: legalPaths.terms, changeFrequency: 'yearly', priority: 0.3 },
  { path: legalPaths.privacy, changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    url: `${siteUrl}${localizedPath(routing.defaultLocale, entry.path)}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    // O sitemap exige URLs absolutas em `alternates`; a metadata do Next resolve
    // caminhos relativos contra o `metadataBase`, o XML do sitemap não.
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languageAlternates(entry.path)).map(([hreflang, path]) => [
          hreflang,
          `${siteUrl}${path}`,
        ]),
      ),
    },
  }));
}
