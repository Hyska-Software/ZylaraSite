import { getTranslations } from 'next-intl/server';
import { DownloadOptions } from '@/components/ui/DownloadOptions';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getLatestRelease } from '@/lib/releases';
import { site } from '@/lib/site';

export async function DownloadSection() {
  const t = await getTranslations('Download');
  const release = await getLatestRelease();

  return (
    <section
      id="download"
      aria-labelledby="download-title"
      className="scroll-mt-24 border-t border-border bg-surface py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          id="download-title"
        />

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-2xs text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            {t('latest', { version: release.version })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t('platforms')}</span>
        </p>

        <div className="mt-10">
          <DownloadOptions release={release} />
        </div>

        <p className="mt-6 text-xs text-foreground-muted">
          {t('note')}{' '}
          <a
            href={site.docsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            {t('guideLink')}
          </a>{' '}
          <span aria-hidden="true">·</span>{' '}
          <a
            href={release.checksumsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            {t('checksums')}
          </a>
        </p>
      </div>
    </section>
  );
}
