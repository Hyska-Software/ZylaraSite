import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DocsArticle } from '@/components/docs/DocsArticle';
import { docsChrome } from '@/content/docs/chrome';
import { routing } from '@/i18n/routing';
import { docsIndexSlug, docsNeighbours, docsSlugs, docsToc } from '@/lib/docs';
import { getDocsData } from '@/lib/docsContent';
import { buildDocsMetadata } from '@/lib/docsMeta';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string; slug: string }> };

/**
 * Páginas de tópico: uma rota para tudo o que está no `nav.json` e tem arquivo
 * em `user-docs/`. `/docs` fica em `page.tsx` porque não tem segmento.
 *
 * `dynamicParams: false` mantém a documentação 100% estática: o conteúdo é lido
 * do disco no build, então não pode existir render sob demanda em runtime.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  // A lista de slugs é a mesma em todos os idiomas — o `nav.json` do inglês é a
  // árvore de referência, e os demais só traduzem título e texto.
  return docsSlugs(getDocsData(routing.defaultLocale))
    .filter((slug) => slug !== docsIndexSlug)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildDocsMetadata({ locale, slug });
}

export default async function DocsTopicPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const data = getDocsData(locale);
  const page = data.pages[slug];
  if (!page) notFound();

  const { previous, next } = docsNeighbours(data, page.slug);
  const release = page.blocks.some((block) => block.type === 'slot')
    ? await getLatestRelease()
    : null;

  return (
    <DocsArticle
      page={page}
      toc={docsToc(page)}
      chrome={docsChrome(locale)}
      release={release}
      previous={previous}
      next={next}
    />
  );
}
