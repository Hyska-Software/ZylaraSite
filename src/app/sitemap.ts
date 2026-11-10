import type { MetadataRoute } from 'next';
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
  ];
}
