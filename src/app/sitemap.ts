import type { MetadataRoute } from 'next';
import { legalPaths } from '@/lib/legal';
import { siteUrl } from '@/lib/url';

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
