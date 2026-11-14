import { absoluteUrl } from '@/lib/url';

/**
 * Dados estruturados das páginas de conteúdo.
 *
 * `BreadcrumbList` sai de `PageHero` com a mesma trilha visível na tela;
 * `FaqJsonLd` sai apenas de `/faq` e usa exatamente as perguntas renderizadas
 * no acordeão. `</` é escapado porque o JSON vai inline (mesma abordagem de
 * `StructuredData.tsx`).
 */

function serialize(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

type Crumb = { name: string; path: string };

export function BreadcrumbJsonLd({ trail }: { trail: Crumb[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />
  );
}

type Question = { question: string; answer: string };

export function FaqJsonLd({ items }: { items: Question[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />
  );
}
