import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DocsArticle } from '@/components/docs/DocsArticle';
import { routing } from '@/i18n/routing';
import { docsChrome, docsEntrySlug, docsNeighbours, docsPage, docsToc } from '@/lib/docs';
import { buildDocsMetadata } from '@/lib/docsMeta';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string }> };

/** A página de entrada mostra os instaladores: revalida junto com a release. */
export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildDocsMetadata({ locale, slug: docsEntrySlug });
}

/**
 * Entrada da documentação (`/docs`).
 *
 * É o `intro` do catálogo: a página que responde "o que é, como baixo, o que
 * faço depois". O resto do corpo vem de `DocsArticle`, o mesmo renderer das
 * demais páginas — a rota só resolve idioma, conteúdo e vizinhos.
 */
export default async function DocsEntryPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const page = docsPage(locale, docsEntrySlug);
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
