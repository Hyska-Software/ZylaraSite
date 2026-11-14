import { getTranslations } from 'next-intl/server';
import { PlatformIcon } from '@/components/download/PlatformIcon';
import { Link } from '@/i18n/navigation';
import { downloadPlatforms, isExperimentalPlatform, type LatestRelease } from '@/lib/site';

/**
 * Cards de plataforma da landing.
 *
 * Cada card entrega o instalador principal direto da release (o mesmo href que
 * a página `/download` monta) e deixa o caminho secundário para "outros
 * formatos" no link `#<plataforma>` — o clique de download não passa mais por
 * uma página intermediária.
 *
 * macOS e Linux ainda são builds experimentais: o card ganha o selo "Beta" e
 * o aviso fica numa linha única abaixo da grade, sem competir com o CTA.
 */
export async function DownloadOptions({ release }: { release: LatestRelease }) {
  const t = await getTranslations('Download');

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {downloadPlatforms.map((platform) => {
          const primary = release.downloads[platform].files[0];
          if (!primary) return null;

          return (
            <li
              key={platform}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 transition-colors duration-150 hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {t(`${platform}.label`)}
                    </span>
                    {isExperimentalPlatform(platform) ? (
                      <span className="rounded-full bg-warning-soft px-1.5 py-0.5 text-2xs text-warning">
                        {t('experimentalBadge')}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-foreground-muted">{t(`${platform}.detail`)}</span>
                </div>
                <PlatformIcon
                  platform={platform}
                  size={18}
                  className="shrink-0 text-foreground-muted"
                />
              </div>

              <p className="break-all font-mono text-2xs text-foreground-muted">{primary.file}</p>

              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={primary.url}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-xs font-medium text-background transition-colors duration-150 hover:bg-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <DownloadIcon />
                  {t('downloadFormat', { format: primary.format })}
                </a>
                <Link
                  href={`/download#${platform}`}
                  className="inline-flex items-center gap-1 text-xs text-foreground-muted transition-colors duration-150 hover:text-foreground"
                >
                  {t('otherFormats')}
                  <ArrowIcon />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs text-foreground-muted">{t('experimentalNote')}</p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5v7m0 0 2.75-2.75M8 9.5 5.25 6.75M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
    >
      <path
        d="M2.5 6h7m0 0L6.75 3.25M9.5 6 6.75 8.75"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
