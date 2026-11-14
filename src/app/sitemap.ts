import type { MetadataRoute } from 'next';
import { legalPaths } from '@/lib/legal';
import { pagePaths } from '@/lib/pages';
import { siteUrl } from '@/lib/url';

/**
 * Sitemap do site.
 *
 * As quatro páginas de conteúdo saem de `pagePaths` — o mesmo registro que
 * alimenta menu e rodapé — para não existir uma rota publicada só aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          'pt-BR': `${siteUrl}/pt-BR`,
        },
      },
    },
    {
      url: `${siteUrl}/download`,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/download`,
          'pt-BR': `${siteUrl}/pt-BR/download`,
        },
      },
    },
    {
      url: `${siteUrl}${pagePaths.features}`,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}${pagePaths.features}`,
          'pt-BR': `${siteUrl}/pt-BR${pagePaths.features}`,
        },
      },
    },
    {
      url: `${siteUrl}${pagePaths.howItWorks}`,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}${pagePaths.howItWorks}`,
          'pt-BR': `${siteUrl}/pt-BR${pagePaths.howItWorks}`,
        },
      },
    },
    {
      url: `${siteUrl}${pagePaths.whyZylara}`,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}${pagePaths.whyZylara}`,
          'pt-BR': `${siteUrl}/pt-BR${pagePaths.whyZylara}`,
        },
      },
    },
    {
      url: `${siteUrl}${pagePaths.faq}`,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}${pagePaths.faq}`,
          'pt-BR': `${siteUrl}/pt-BR${pagePaths.faq}`,
        },
      },
    },
    {
      url: `${siteUrl}${legalPaths.terms}`,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${siteUrl}${legalPaths.terms}`,
          'pt-BR': `${siteUrl}/pt-BR${legalPaths.terms}`,
        },
      },
    },
    {
      url: `${siteUrl}${legalPaths.privacy}`,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${siteUrl}${legalPaths.privacy}`,
          'pt-BR': `${siteUrl}/pt-BR${legalPaths.privacy}`,
        },
      },
    },
  ];
}
