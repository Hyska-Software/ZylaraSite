import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { downloadPlatforms } from '@/lib/site';

/**
 * Cards de plataforma da landing.
 *
 * Cada card não baixa o binário: leva à página de download já na plataforma
 * certa (`/download#macos`), onde o usuário escolhe formato, confere nome e
 * tamanho do arquivo e lê a verificação SHA-256.
 */
export async function DownloadOptions() {
  const t = await getTranslations('Download');

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {downloadPlatforms.map((id) => (
        <li key={id}>
          <Link
            href={`/download#${id}`}
            className="group flex h-full flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-5 transition-colors duration-150 hover:border-border-strong hover:bg-surface-hover"
          >
            <span className="flex flex-1 items-start justify-between gap-3">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">{t(`${id}.label`)}</span>
                <span className="text-xs text-foreground-subtle">{t(`${id}.detail`)}</span>
              </span>
              <DownloadIcon />
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-foreground-muted transition-colors duration-150 group-hover:text-foreground">
              {t('choose')}
              <ArrowIcon />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-foreground-subtle transition-colors duration-150 group-hover:text-foreground"
    >
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
      width="12"
      height="12"
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
