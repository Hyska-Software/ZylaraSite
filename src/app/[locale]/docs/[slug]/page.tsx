import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DocsArticle } from '@/components/docs/DocsArticle';
import { routing } from '@/i18n/routing';
import { docsChrome, docsEntrySlug, docsNeighbours, docsPage, docsSlugs, docsToc, isDocSlug } from '@/lib/docs';
import { buildDocsMetadata } from '@/lib/docsMeta';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Uma rota para todas as páginas de tópico; `/docs` tem arquivo próprio. */
export function generateStaticParams() {
  return docsSlugs(routing.defaultLocale)
    .filter((slug) => slug !== docsEntrySlug)
    .map((slug) => ({ slug }));
}

export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isDocSlug(slug)) notFound();

  return buildDocsMetadata({ locale, slug });
}

export default async function DocsTopicPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isDocSlug(slug)) notFound();
  setRequestLocale(locale);

  const page = docsPage(locale, slug);
  if (!page) notFound();

  const release = await getLatestRelease();
  const { previous, next } = docsNeighbours(locale, page.slug);

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
