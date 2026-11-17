import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DocsArticle } from '@/components/docs/DocsArticle';
import { docsChrome } from '@/content/docs/chrome';
import { routing } from '@/i18n/routing';
import { docsIndexSlug, docsNeighbours, docsToc } from '@/lib/docs';
import { getDocsData } from '@/lib/docsContent';
import { buildDocsMetadata } from '@/lib/docsMeta';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildDocsMetadata({ locale, slug: docsIndexSlug });
}

/**
 * Entrada da documentação (`/docs`).
 *
 * É o `index.md` do acervo: a página que responde "o que é, como começo, onde
 * clico depois". O corpo vem de `DocsArticle`, o mesmo renderer das demais — a
 * rota só resolve idioma, página e vizinhos.
 */
export default async function DocsEntryPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const data = getDocsData(locale);
  const page = data.pages[docsIndexSlug];
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
