import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageCta } from '@/components/pages/PageCta';
import { PageHero } from '@/components/pages/PageHero';
import { PageNav } from '@/components/pages/PageNav';
import { FaqJsonLd } from '@/components/seo/PageStructuredData';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/pageMeta';
import { faqGeneralSectionId, pagePaths } from '@/lib/pages';
import { getLatestRelease } from '@/lib/releases';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

type Question = { question: string; answer: string };
type Group = { id: string; label: string; items: Question[] };

const path = pagePaths.faq;

/** A faixa de download lê a release publicada, então a página revalida junto. */
export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildPageMetadata({ locale, path, namespace: 'FaqPage' });
}

/**
 * Página completa de perguntas frequentes.
 *
 * O primeiro grupo reutiliza `Faq.items` — as mesmas perguntas que a landing
 * renderiza no acordeão curto — para não haver duas redações da mesma resposta.
 * Os demais grupos trazem perguntas que só aparecem depois do download. O
 * `FaqJsonLd` usa exatamente a lista visível, na mesma ordem.
 */
export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('FaqPage');
  const tFaq = await getTranslations('Faq');
  const tLegal = await getTranslations('Legal');
  const release = await getLatestRelease();

  const general = tFaq.raw('items') as Question[];
  const groups = t.raw('groups') as Group[];
  const allItems = [...general, ...groups.flatMap((group) => group.items)];

  return (
    <>
      <SiteHeader />

      <main id="main">
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          crumb={t('eyebrow')}
          path={path}
          actions={<DownloadCta release={release} />}
          quickNav={{
            label: t('quickNavLabel'),
            items: [
              { href: `#${faqGeneralSectionId}`, label: t('generalTitle') },
              ...groups.map((group) => ({ href: `#${group.id}`, label: group.label })),
            ],
          }}
        />

        <FaqGroup id={faqGeneralSectionId} title={t('generalTitle')} items={general} />

        {groups.map((group) => (
          <FaqGroup key={group.id} id={group.id} title={group.label} items={group.items} />
        ))}

        <section
          aria-labelledby="faq-help-title"
          className="border-t border-border bg-surface py-12 md:py-14"
        >
          <div className="container-page">
            <div className="max-w-xl rounded-xl border border-border bg-background p-5">
              <h2 id="faq-help-title" className="text-sm font-medium text-foreground">
                {tFaq('issueTitle')}
              </h2>
              <p className="mt-1.5 text-sm text-foreground-muted">{tFaq('issueBody')}</p>
              <a
                href={site.issuesUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {tFaq('issueCta')}
              </a>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-foreground-muted">
              <Link
                href="/terms"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {tLegal('terms')}
              </Link>
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {tLegal('privacy')}
              </Link>
            </p>
          </div>
        </section>

        <PageNav current="faq" />
        <PageCta release={release} />
      </main>

      <SiteFooter />

      <FaqJsonLd items={allItems} />
    </>
  );
}

/**
 * Grupo de perguntas: título à esquerda, acordeão à direita.
 *
 * Cada grupo tem seu próprio `name` no `<details>`, então abrir uma pergunta
 * fecha a anterior do mesmo grupo sem fechar as perguntas de outros grupos.
 */
function FaqGroup({ id, title, items }: { id: string; title: string; items: Question[] }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 border-t border-border py-12 md:py-14"
    >
      <div className="container-page grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-12">
        <h2
          id={`${id}-title`}
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h2>

        <ul className="flex flex-col">
          {items.map((item, index) => (
            <li
              key={item.question}
              id={`faq-${id}-${index + 1}`}
              className="scroll-mt-24 border-t border-border last:border-b"
            >
              <details className="group" name={`faq-${id}`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-foreground transition-colors duration-150 hover:text-accent [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-foreground-muted transition-transform duration-200 group-open:rotate-180"
                  >
                    <path
                      d="M3.5 5.5 7 9l3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="pb-5 pr-8 text-sm text-foreground-muted">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
