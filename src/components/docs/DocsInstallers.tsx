import { getTranslations } from 'next-intl/server';
import { PlatformIcon } from '@/components/download/PlatformIcon';
import type { DocsChrome } from '@/content/docs/types';
import {
  downloadPlatforms,
  isExperimentalPlatform,
  site,
  type LatestRelease,
} from '@/lib/site';

/**
 * Instaladores da release publicada, dentro de um bloco de conteúdo.
 *
 * A versão e as URLs vêm de `getLatestRelease()` (o mesmo fetch da página
 * `/download`), então publicar no GitHub atualiza a documentação sozinha. Cada
 * linha é o arquivo de verdade da release — formato, arquitetura e nome —, sem
 * inventar pacote que não existe.
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
    <div className="flex flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-2xs uppercase tracking-[0.12em] text-foreground-subtle">
          {chrome.latest}
        </p>
        <p className="font-mono text-xs text-foreground">v{release.version}</p>
      </div>

      <dl className="mt-3 flex flex-col gap-4">
        {downloadPlatforms.map((platform) => {
          const files = release.downloads[platform].files;

          return (
            <div
              key={platform}
              className="grid gap-2 border-t border-border pt-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5"
            >
              <dt className="flex items-center gap-2 text-sm font-medium text-foreground">
                <PlatformIcon
                  platform={platform}
                  size={15}
                  className="shrink-0 text-foreground-muted"
                />
                <span className="truncate">{t(`${platform}.label`)}</span>
                {isExperimentalPlatform(platform) ? (
                  <span className="shrink-0 rounded-full bg-warning-soft px-1.5 py-0.5 text-2xs text-warning">
                    {chrome.beta}
                  </span>
                ) : null}
              </dt>

              <dd className="min-w-0">
                <ul aria-label={chrome.formats} className="flex flex-col gap-1.5">
                  {files.map((file) => (
                    <li key={file.url || file.file} className="min-w-0">
                      <a
                        href={file.url}
                        className="group flex min-w-0 items-center gap-2 rounded-md py-0.5 text-xs"
                      >
                        <span className="shrink-0 rounded-[5px] border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-2xs text-foreground">
                          {file.format}
                        </span>
                        <span className="shrink-0 font-mono text-2xs text-foreground-subtle">
                          {file.arch}
                        </span>
                        <span className="truncate font-mono text-2xs text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 group-hover:text-foreground">
                          {file.file}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs">
        <a
          href={release.checksumsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-foreground"
        >
          {chrome.checksums}
        </a>
        <a
          href={site.releasesUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded text-foreground-muted underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-foreground"
        >
          {chrome.allDownloads}
        </a>
      </p>
    </div>
  );
}
