'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import {
  downloadPlatforms,
  isExperimentalPlatform,
  site,
  type DownloadPlatform,
  type LatestRelease,
  type ReleaseFile,
} from '@/lib/site';
import { PlatformIcon } from './PlatformIcon';

/**
 * Seletor de download da página `/download`.
 *
 * A plataforma é uma tablist (setas/Home/End); o formato, um grupo de rádios
 * nativos (`sr-only` + `peer`), então teclado e leitor de tela funcionam sem
 * script extra. A URL guarda só o hash (`#macos`), o que permite deep link a
 * partir dos cards da landing sem transformar cada clique em uma entrada de
 * histórico.
 *
 * A release chega resolvida pelo servidor (`getLatestRelease`): o client só
 * escolhe plataforma/formato e nunca fala com a API do GitHub.
 *
 * macOS e Linux ainda são builds experimentais (`experimentalPlatforms`): a aba
 * ganha o selo "Beta" e o painel mostra o aviso antes do botão de download.
 */
export function DownloadConsole({ release }: { release: LatestRelease }) {
  const t = useTranslations('DownloadPage');
  const tPlatform = useTranslations('Download');
  const tabsId = useId();
  const formatName = useId();

  const [platform, setPlatform] = useState<DownloadPlatform>('windows');
  const [fileIndex, setFileIndex] = useState(0);
  const [copied, setCopied] = useState<'link' | 'command' | null>(null);

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.slice(1);
      if (!isPlatform(id)) return;
      setPlatform(id);
      setFileIndex(0);
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const files = release.downloads[platform].files;
  const active = files[Math.min(fileIndex, files.length - 1)];

  function selectPlatform(id: DownloadPlatform) {
    setPlatform(id);
    setFileIndex(0);
    const url = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, '', url);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const focused = event.currentTarget.dataset.platform;
    const index = focused ? downloadPlatforms.indexOf(focused as DownloadPlatform) : -1;
    if (index < 0) return;
    const last = downloadPlatforms.length - 1;
    let next: number;

    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    const target = downloadPlatforms[next];
    if (!target) return;
    selectPlatform(target);
    document.getElementById(`${tabsId}-${target}`)?.focus();
  }

  async function copy(value: string, kind: 'link' | 'command') {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  }

  if (!active) return null;

  const url = active.url;
  const platformLabel = tPlatform(`${platform}.label`);
  const command = commandFor(platform, url);
  const verify = verifyFor(platform, active.file);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised">
      <div
        role="tablist"
        aria-label={t('platformsLabel')}
        className="flex items-stretch gap-1 overflow-x-auto border-b border-border px-3 sm:px-5"
      >
        {downloadPlatforms.map((id) => {
          const selected = id === platform;
          return (
            <button
              key={id}
              id={`${tabsId}-${id}`}
              type="button"
              role="tab"
              data-platform={id}
              aria-selected={selected}
              aria-controls={`${tabsId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectPlatform(id)}
              onKeyDown={onTabKeyDown}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 border-b-2 px-2.5 py-4 text-sm transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                selected
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground-muted hover:text-foreground',
              )}
            >
              <PlatformIcon platform={id} size={16} />
              {tPlatform(`${id}.label`)}
              {isExperimentalPlatform(id) ? (
                <span className="rounded-full bg-warning-soft px-1.5 py-0.5 text-2xs text-warning">
                  {tPlatform('experimentalBadge')}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        id={`${tabsId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabsId}-${platform}`}
        className="grid gap-10 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-8"
      >
        <div className="flex min-w-0 flex-col">
          <fieldset>
            <legend className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
              {t('formatLabel')}
            </legend>

            {files.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <label key={file.file} className="cursor-pointer">
                    <input
                      type="radio"
                      name={formatName}
                      checked={index === fileIndex}
                      onChange={() => setFileIndex(index)}
                      className="peer sr-only"
                    />
                    <span className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground-muted transition-colors duration-150 peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:text-foreground">
                      {file.format}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-3">
                <span className="inline-flex h-9 items-center rounded-lg border border-foreground bg-foreground px-3 font-mono text-xs text-background">
                  {active.format}
                </span>
              </p>
            )}
          </fieldset>

          {isExperimentalPlatform(platform) ? (
            <div
              role="note"
              className="mt-5 rounded-xl border border-warning/30 bg-warning-soft/60 p-3"
            >
              <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
                <WarningIcon />
                {t('experimentalTitle')}
              </p>
              <p className="mt-1.5 text-xs text-foreground-muted">{t('experimentalBody')}</p>
            </div>
          ) : null}

          <a
            href={url}
            className="mt-6 inline-flex h-12 w-fit items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors duration-150 hover:bg-foreground/90 active:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('download', { platform: platformLabel, version: release.version })}
          </a>

          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-foreground-subtle">
            <span className="break-all text-foreground-muted">{active.file}</span>
            <span aria-hidden="true">·</span>
            <span>{t(`arch.${active.arch}`)}</span>
          </p>

          <p className="mt-3 max-w-sm text-xs text-foreground-muted">
            {t(`notes.${platform}`)}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <a
              href={release.notesUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              <FileIcon />
              {t('releaseNotes')}
            </a>
            <a
              href={site.releasesUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
            >
              <PackageIcon />
              {t('allFormats')}
            </a>
            <button
              type="button"
              onClick={() => copy(url, 'link')}
              className="inline-flex items-center gap-1.5 rounded-full text-foreground-muted transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <LinkIcon />
              {copied === 'link' ? t('linkCopied') : t('copyLink')}
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
            {t('commandLabel')}
          </p>

          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex items-start gap-3 p-3">
              <span aria-hidden="true" className="select-none font-mono text-xs text-foreground-subtle">
                $
              </span>
              <code className="min-w-0 flex-1 break-all font-mono text-xs leading-relaxed text-foreground-muted">
                {command}
              </code>
              <button
                type="button"
                onClick={() => copy(command, 'command')}
                aria-label={copied === 'command' ? t('commandCopied') : t('copyCommand')}
                title={copied === 'command' ? t('commandCopied') : t('copyCommand')}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-foreground-subtle transition-colors duration-150 hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {copied === 'command' ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="border-t border-border px-3 py-2 text-2xs text-foreground-subtle">
              {t('commandHint')}
            </p>
          </div>

          <span role="status" aria-live="polite" className="sr-only">
            {copied === 'command' ? t('commandCopied') : copied === 'link' ? t('linkCopied') : ''}
          </span>

          <details className="group rounded-xl border border-border bg-background">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm text-foreground transition-colors duration-150 hover:text-accent [&::-webkit-details-marker]:hidden">
              {t('verify')}
              <ChevronIcon />
            </summary>
            <div className="border-t border-border px-3 py-3">
              <p className="text-xs text-foreground-muted">{t('verifyBody')}</p>
              <code className="mt-3 block break-all rounded-lg bg-surface px-2.5 py-2 font-mono text-2xs text-foreground-muted">
                {verify}
              </code>
              <a
                href={release.checksumsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                <FileIcon />
                {t('checksums')}
              </a>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function isPlatform(value: string): value is DownloadPlatform {
  return (downloadPlatforms as readonly string[]).includes(value);
}

/** Gera os comandos a partir do asset real: sem pacote inventado no gerenciador. */
function commandFor(platform: DownloadPlatform, url: string) {
  if (platform === 'windows') {
    // No PowerShell 5.1 `curl` é alias de Invoke-WebRequest; `curl.exe` é o binário.
    return `curl.exe -LO ${url}`;
  }
  return `curl -LO ${url}`;
}

function verifyFor(platform: DownloadPlatform, file: ReleaseFile['file']) {
  return platform === 'windows'
    ? `Get-FileHash .\\${file} -Algorithm SHA256`
    : `shasum -a 256 ${file}`;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.5 5.5V3.75c0-.69.56-1.25 1.25-1.25h5c.69 0 1.25.56 1.25 1.25v5c0 .69-.56 1.25-1.25 1.25H10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <rect
        x="2.5"
        y="5.5"
        width="7"
        height="8"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.75 9.25a3 3 0 0 0 4.24 0l1.5-1.5a3 3 0 0 0-4.24-4.24l-.7.7M9.25 6.75a3 3 0 0 0-4.24 0l-1.5 1.5a3 3 0 0 0 4.24 4.24l.7-.7"
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

function WarningIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 2.5 14.25 13.5H1.75L8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8 6.25v3.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-foreground-subtle transition-transform duration-150 group-open:rotate-180"
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
