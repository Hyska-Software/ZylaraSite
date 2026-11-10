import { getTranslations } from 'next-intl/server';
import { ExternalButtonLink } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';

export async function FinalCta() {
  const t = await getTranslations('FinalCta');

  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border bg-surface-raised p-8 md:flex-row md:items-center md:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t('title')}
            </h2>
            <p className="mt-3 text-base text-foreground-muted">{t('subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/download"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors duration-150 hover:bg-foreground/90"
            >
              {t('ctaPrimary')}
            </Link>
            <ExternalButtonLink href={site.repoUrl} variant="secondary">
              {t('ctaSecondary')}
            </ExternalButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
