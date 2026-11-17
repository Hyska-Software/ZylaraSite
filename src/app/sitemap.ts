import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { legalPaths } from '@/lib/legal';
import { languageAlternates, localizedPath } from '@/lib/locale';
import { pagePaths } from '@/lib/pages';
import { siteUrl } from '@/lib/url';

/**
 * Sitemap do site.
 *
 * As páginas de conteúdo saem de `pagePaths`/`legalPaths` — o mesmo registro que
 * alimenta menu e rodapé — para não existir uma rota publicada só aqui.
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
