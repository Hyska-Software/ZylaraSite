import { getTranslations } from 'next-intl/server';
import { PlatformIcon } from '@/components/download/PlatformIcon';
import type { DocsChrome } from '@/content/docs/types';
import {
  downloadPlatforms,
  isExperimentalPlatform,
  site,
  type LatestRelease,
  type ReleaseFile,
} from '@/lib/site';

/**
 * Instaladores da release publicada, dentro de uma página da documentação.
 *
 * Os dados são os mesmos de `/download`: `getLatestRelease()` resolve a release
 * estável mais recente do GitHub e o bloco mostra os arquivos que existem de
 * verdade — formato, arquitetura, tamanho e a URL do asset — em vez de nomes
 * escritos à mão no Markdown. Publicar uma versão e refazer o build atualiza a
 * página sem editar texto.
 */
export async function DocsInstallers({
  release,
  chrome,
}: {
  release: LatestRelease;
  chrome: DocsChrome;
}) {
  const t = await getTranslations('Download');

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle">
          {chrome.publishedVersion}
        </p>
        <p className="font-mono text-sm text-foreground">v{release.version}</p>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {downloadPlatforms.map((platform) => {
          const files = release.downloads[platform].files;

          return (
            <div key={platform} className="border-t border-border pt-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <PlatformIcon
                  platform={platform}
                  size={15}
                  className="shrink-0 text-foreground-muted"
                />
                <span className="truncate">{t(`${platform}.label`)}</span>
                {isExperimentalPlatform(platform) ? (
                  <span className="shrink-0 rounded-full bg-warning-soft px-1.5 py-0.5 text-2xs text-warning">
                    {t('experimentalBadge')}
                  </span>
                ) : null}
              </p>

              <ul className="mt-1.5 flex flex-col">
                {files.map((file) => (
                  <li key={file.file}>
                    <a
                      href={file.url}
                      className="group flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-md px-1 py-1 transition-colors duration-150 hover:bg-surface-hover"
                    >
                      <span className="w-14 shrink-0 font-mono text-2xs text-foreground">
                        {file.format}
                      </span>
                      <span className="w-9 shrink-0 font-mono text-2xs text-foreground-subtle">
                        {file.arch}
                      </span>
                      <span className="w-14 shrink-0 font-mono text-2xs text-foreground-subtle">
                        {formatSize(file)}
                      </span>
                      <span className="min-w-0 flex-1 font-mono text-2xs break-all text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 group-hover:text-foreground">
                        {file.file}
                      </span>
                      <DownloadIcon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs">
        <a
          href={release.checksumsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-foreground"
        >
          {chrome.checksums}
        </a>
        <a
          href={release.notesUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-foreground"
        >
          {chrome.releaseNotes}
        </a>
        <a
          href={site.releasesUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-foreground"
        >
          {chrome.allReleases}
        </a>
      </p>
    </div>
  );
}

/** Tamanho do asset em MB/KB; sem o dado da API, a coluna fica vazia. */
function formatSize(file: ReleaseFile): string {
  if (!file.size) return '—';

  const megabytes = file.size / (1024 * 1024);
  if (megabytes >= 10) return `${Math.round(megabytes)} MB`;
  if (megabytes >= 1) return `${megabytes.toFixed(1)} MB`;

  return `${Math.max(1, Math.round(file.size / 1024))} KB`;
}

function DownloadIcon() {
  return (
    <svg
      width="12"
      height="12"
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
