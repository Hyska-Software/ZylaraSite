import { getTranslations } from 'next-intl/server';
import { absoluteUrl } from '@/lib/url';
import type { LatestRelease } from '@/lib/site';

type FaqItem = { question: string; answer: string };

/**
 * Dados estruturados da landing.
 *
 * `SoftwareApplication` descreve o app com o que a página já afirma — versão
 * publicada, MIT, três sistemas e custo zero do aplicativo — e `FAQPage` usa
 * exatamente as mesmas perguntas do `<details>` renderizado, para que a marcação
 * nunca divirja do conteúdo visível. `</` é escapado porque o JSON vai inline.
 */

function serialize(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export async function StructuredData({ release }: { release: LatestRelease }) {
  const metadata = await getTranslations('Metadata');
  const faq = await getTranslations('Faq');
  const items = faq.raw('items') as FaqItem[];

  const application = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Zylara',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Coding agent',
    operatingSystem: 'Windows, macOS, Linux',
    softwareVersion: release.version,
    description: metadata('description'),
    url: absoluteUrl('/'),
    downloadUrl: absoluteUrl('/download'),
    license: 'https://opensource.org/license/mit',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hyska Software',
    },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(application) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(faqPage) }} />
    </>
  );
}
