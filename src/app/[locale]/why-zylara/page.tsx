import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { CheckIcon, MinusIcon } from '@/components/pages/PageIcons';
import { PageCta } from '@/components/pages/PageCta';
import { PageHero } from '@/components/pages/PageHero';
import { PageNav } from '@/components/pages/PageNav';
import { PageSection } from '@/components/pages/PageSection';
import { FolderFragment } from '@/components/sections/fragments';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/pageMeta';
import { pagePaths, pageSections } from '@/lib/pages';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string }> };

type Point = { title: string; description: string };
type Row = { label: string; cells: string[] };
type Audience = {
  forTitle: string;
  forItems: string[];
  notForTitle: string;
  notForItems: string[];
};

const path = pagePaths.whyZylara;

/** A faixa de download lê a release publicada, então a página revalida junto. */
export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildPageMetadata({ locale, path, namespace: 'WhyZylaraPage' });
}

/**
 * Página "Por que Zylara".
 *
 * Leva o posicionamento da landing um passo adiante: princípios, comparação por
 * categoria de ferramenta (sem nomear produtos), o custo real do local-first, a
 * lista de limites e para quem o app é — e não é.
 */
export default async function WhyZylaraPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('WhyZylaraPage');
  const release = await getLatestRelease();

  /** Âncoras compartilhadas com a navbar (`@/lib/pages`). */
  const [
    principlesSection,
    compareSection,
    localFirstSection,
    limitsSection,
    audienceSection,
  ] = pageSections.whyZylara;

  const principles = t.raw('principles.items') as Point[];
  const columns = t.raw('compare.columns') as string[];
  const rows = t.raw('compare.rows') as Row[];
  const localFirst = t.raw('localFirst.items') as Point[];
  const limits = t.raw('limits.items') as Point[];
  const audience = t.raw('audience') as Audience;

  return (
    <>
      <SkipLink />
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
              { href: `#${principlesSection.id}`, label: t(`${principlesSection.key}.title`) },
              { href: `#${compareSection.id}`, label: t(`${compareSection.key}.title`) },
              { href: `#${localFirstSection.id}`, label: t(`${localFirstSection.key}.title`) },
              { href: `#${limitsSection.id}`, label: t(`${limitsSection.key}.title`) },
              { href: `#${audienceSection.id}`, label: t(`${audienceSection.key}.title`) },
            ],
          }}
        />

        <PageSection
          id={principlesSection.id}
          eyebrow={t('principles.eyebrow')}
          title={t('principles.title')}
          subtitle={t('principles.subtitle')}
        >
          <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {principles.map((point) => (
              <div key={point.title} className="border-t border-border pt-5">
                <dt className="text-base font-medium text-foreground">{point.title}</dt>
                <dd className="mt-2 max-w-prose text-sm text-foreground-muted">
                  {point.description}
                </dd>
              </div>
            ))}
          </dl>
        </PageSection>

        <PageSection
          id={compareSection.id}
          eyebrow={t('compare.eyebrow')}
          title={t('compare.title')}
          subtitle={t('compare.subtitle')}
          tone="surface"
        >
          <div className="overflow-x-auto rounded-2xl border border-border bg-background">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {columns.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={
                        index === 1
                          ? 'px-4 py-3 text-left text-xs font-medium text-accent'
                          : 'px-4 py-3 text-left text-xs font-medium text-foreground-muted'
                      }
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-b-0">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-foreground"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, index) => (
                      <td
                        key={`${row.label}-${columns[index + 1] ?? index}`}
                        className={
                          index === 0
                            ? 'px-4 py-3 text-sm text-foreground'
                            : 'px-4 py-3 text-sm text-foreground-muted'
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 max-w-3xl text-xs text-foreground-muted">{t('compare.note')}</p>
        </PageSection>

        <PageSection
          id={localFirstSection.id}
          eyebrow={t('localFirst.eyebrow')}
          title={t('localFirst.title')}
          subtitle={t('localFirst.subtitle')}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-start lg:gap-12">
            <dl className="flex flex-col">
              {localFirst.map((item) => (
                <div key={item.title} className="border-t border-border py-4 first:border-t-0 first:pt-0">
                  <dt className="text-base font-medium text-foreground">{item.title}</dt>
                  <dd className="mt-1 max-w-prose text-sm text-foreground-muted">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>

            <FolderFragment decorative />
          </div>
        </PageSection>

        <PageSection
          id={limitsSection.id}
          eyebrow={t('limits.eyebrow')}
          title={t('limits.title')}
          subtitle={t('limits.subtitle')}
          tone="surface"
        >
          <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {limits.map((limit) => (
              <li key={limit.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground-muted"
                >
                  <MinusIcon />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{limit.title}</span>
                  <span className="mt-1 block text-sm text-foreground-muted">
                    {limit.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection
          id={audienceSection.id}
          eyebrow={t('audience.eyebrow')}
          title={t('audience.title')}
          subtitle={t('audience.subtitle')}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-raised p-5 md:p-6">
              <h3 className="text-lg font-medium text-foreground">{audience.forTitle}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {audience.forItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground-muted">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface-raised p-5 md:p-6">
              <h3 className="text-lg font-medium text-foreground">{audience.notForTitle}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {audience.notForItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground-muted">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground-muted"
                    >
                      <MinusIcon />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>

        <PageNav current="whyZylara" />
        <PageCta release={release} />
      </main>

      <SiteFooter />
    </>
  );
}
