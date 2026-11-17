import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DownloadConsole } from '@/components/download/DownloadConsole';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { routing } from '@/i18n/routing';
import { languageAlternates, localizedPath, ogAlternateLocales, ogLocale } from '@/lib/locale';
import { getLatestRelease } from '@/lib/releases';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/url';

type Props = { params: Promise<{ locale: string }> };

type Highlight = { title: string; description: string };

/** A versão publicada muda sem deploy: revalida a página a cada 30 min. */
export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'DownloadPage' });
  const path = localizedPath(locale, '/download');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: path,
      languages: languageAlternates('/download'),
    },
    openGraph: {
      type: 'website',
      siteName: 'Zylara',
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: absoluteUrl(path),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}

export default async function DownloadPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('DownloadPage');
  const highlights = t.raw('highlights') as Highlight[];
  const release = await getLatestRelease();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-60"
          />

          <div className="container-page relative">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16">
              <div className="max-w-2xl">
                <p className="text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle">
                  {t('eyebrow')}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-foreground md:text-5xl lg:text-6xl">
                  {t('title')}
                </h1>
                <p className="mt-5 max-w-xl text-lg text-foreground-muted">{t('subtitle')}</p>

                <a
                  href={site.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-2 rounded text-sm text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
                >
                  <ArrowIcon />
                  {t('guide')}
                </a>
              </div>

              {/* Versão publicada: a release mais recente do repositório. */}
              <div className="rounded-2xl border border-border bg-surface-raised p-5">
                <p className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
                  {t('versionLabel')}
                </p>
                <p className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-2xl tracking-tight text-foreground">
                    v{release.version}
                  </span>
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-2xs text-success">
                    {t('versionBadge')}
                  </span>
                </p>

                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-xs">
                  <a
                    href={release.notesUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-foreground-muted transition-colors duration-150 hover:text-foreground"
                  >
                    <FileIcon />
                    {t('releaseNotes')}
                  </a>
                  <a
                    href={site.releasesUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-foreground-muted transition-colors duration-150 hover:text-foreground"
                  >
                    <PackageIcon />
                    {t('allReleases')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-page">
            <h2 className="sr-only">{t('chooseTitle')}</h2>
            <DownloadConsole release={release} />
          </div>
        </section>

        <section className="border-t border-border bg-surface py-14 md:py-16">
          <div className="container-page">
            <dl className="grid gap-x-10 gap-y-8 md:grid-cols-3">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="border-t border-border pt-5">
                  <dt className="text-base font-medium text-foreground">{highlight.title}</dt>
                  <dd className="mt-2 text-sm text-foreground-muted">{highlight.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-foreground-subtle"
    >
      <path
        d="M11 3v8H3M11 3 3 11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9 1.75H4.75c-.69 0-1.25.56-1.25 1.25v10c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V5.25L9 1.75Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9 1.75v3.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.75 13.75 4.6v6.8L8 14.25 2.25 11.4V4.6L8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M2.25 4.6 8 7.5l5.75-2.9M8 7.5v6.75" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
