import { getTranslations } from 'next-intl/server';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { ButtonLink } from '@/components/ui/Button';
import type { LatestRelease } from '@/lib/site';

/**
 * Faixa de download do pé das páginas de conteúdo.
 *
 * Usa o mesmo `DownloadCta` da hero — o botão entrega o instalador da
 * plataforma detectada — e deixa `/download` como segundo caminho para quem
 * quer escolher formato e conferir checksum.
 */
export async function PageCta({ release }: { release: LatestRelease }) {
  const t = await getTranslations('Pages');

  return (
    <section
      aria-labelledby="page-cta-title"
      className="border-t border-border bg-surface py-16 md:py-20"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
              {t('ctaEyebrow')}
            </p>
            <h2
              id="page-cta-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              {t('ctaTitle')}
            </h2>
            <p className="mt-3 text-base text-foreground-muted">{t('ctaBody')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DownloadCta release={release} />
            <ButtonLink href="/download" variant="secondary" size="lg">
              {t('ctaSecondary')}
            </ButtonLink>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-4 text-xs text-foreground-muted">
          {t('note')}
        </p>
      </div>
    </section>
  );
}
