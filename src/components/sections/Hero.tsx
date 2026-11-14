import { getTranslations } from 'next-intl/server';
import { AnimatedZylara } from '@/components/brand/AnimatedZylara';
import { ExternalButtonLink } from '@/components/ui/Button';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { AppPreview } from '@/components/sections/AppPreview';
import { ProofBar } from '@/components/sections/ProofBar';
import { getLatestRelease } from '@/lib/releases';
import { site } from '@/lib/site';

export async function Hero() {
  const t = await getTranslations('Hero');
  const release = await getLatestRelease();

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col items-start">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1 text-2xs text-foreground-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t('eyebrow')}
            </p>

            <h1 className="mt-6 text-4xl font-semibold tracking-tighter text-foreground md:text-5xl lg:text-6xl">
              {t('title')}
              <br />
              <span className="text-accent">{t('titleAccent')}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-foreground-muted">{t('subtitle')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <DownloadCta release={release} />
              <ExternalButtonLink href={site.repoUrl} size="lg" variant="secondary">
                {t('ctaSecondary')}
              </ExternalButtonLink>
            </div>

            <ProofBar release={release} />

            <p className="mt-3 text-xs text-foreground-muted">{t('note')}</p>
          </div>

          <div className="relative">
            <AnimatedZylara size={112} className="absolute -top-12 -right-3 z-10 hidden lg:block" />
            <AppPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
