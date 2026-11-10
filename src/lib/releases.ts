import 'server-only';

import { cache } from 'react';
import {
  downloadPlatforms,
  fallbackDownloads,
  fallbackReleaseVersion,
  type DownloadArch,
  type DownloadPlatform,
  type LatestRelease,
  type ReleaseFile,
} from '@/lib/site';

/**
 * Fonte da verdade da versão publicada.
 *
 * A cada build/ISR o site pergunta ao GitHub qual é a release estável mais
 * recente e monta os links a partir dos assets **reais** (nome e URL vindos da
 * API), então publicar uma versão no repositório basta para o site atualizar —
 * nada de constante de versão no código.
 *
 * - ISR de 30 min (`RELEASE_TTL`): são 2 requisições/hora, muito abaixo do
 *   limite anônimo do GitHub (60/h por IP).
 * - `GITHUB_TOKEN` é opcional; quando definido, sobe o limite para 5k/h.
 * - `tags: ['github-release']` deixa a porta aberta para um webhook futuro
 *   chamar `revalidateTag('github-release')` e refletir o release na hora.
 * - Qualquer falha (rede, rate limit, asset faltando) cai no fallback pinado em
 *   `@/lib/site`, com warning no log do servidor — a página nunca quebra.
 */

const REPO = 'https://github.com/Hyska-Software/ZylaraAi';
const RELEASE_API = 'https://api.github.com/repos/Hyska-Software/ZylaraAi/releases/latest';
const RELEASE_TTL = 60 * 30;
const RELEASE_TAG = 'github-release';

type GithubAsset = {
  name?: unknown;
  browser_download_url?: unknown;
};

type GithubRelease = {
  tag_name?: unknown;
  html_url?: unknown;
  published_at?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  assets?: unknown;
};

type ClassifiedAsset = ReleaseFile & { platform: DownloadPlatform; rank: number };

/** Extensões que nunca viram botão de download. */
const IGNORED_EXTENSIONS = ['.txt', '.json', '.yml', '.yaml', '.sig', '.blockmap', '.zip'];

const LINUX_FORMATS = [
  { extension: '.appimage', format: 'AppImage', rank: 1 },
  { extension: '.deb', format: '.deb', rank: 2 },
  { extension: '.rpm', format: '.rpm', rank: 3 },
] as const;

/** `v0.3.9` / `0.3.9` / `1.0.0-beta.1`; tags fora disso são ignoradas. */
const VERSION_PATTERN = /^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

function archOf(name: string): DownloadArch {
  return /(?:arm64|aarch64)/i.test(name) ? 'arm64' : 'x64';
}

/**
 * Traduz o nome do artefato em plataforma + formato. Retorna `null` para
 * arquivos auxiliares (checksums, manifesto, assinaturas).
 */
function classifyAsset(name: string): ClassifiedAsset | null {
  const lower = name.toLowerCase();

  if (!lower || IGNORED_EXTENSIONS.some((extension) => lower.endsWith(extension))) return null;

  if (lower.endsWith('.exe') && lower.includes('windows')) {
    return { platform: 'windows', format: '.exe', arch: archOf(name), file: name, url: '', rank: 0 };
  }

  if (lower.endsWith('.dmg') && lower.includes('macos')) {
    return { platform: 'macos', format: '.dmg', arch: archOf(name), file: name, url: '', rank: 0 };
  }

  if (lower.includes('linux')) {
    const match = LINUX_FORMATS.find((format) => lower.endsWith(format.extension));
    if (match) {
      return {
        platform: 'linux',
        format: match.format,
        arch: archOf(name),
        file: name,
        url: '',
        rank: match.rank,
      };
    }
  }

  return null;
}

/** Converte o JSON da API em `LatestRelease`; `null` quando não dá para confiar. */
export function parseRelease(payload: unknown): LatestRelease | null {
  if (!payload || typeof payload !== 'object') return null;

  const release = payload as GithubRelease;
  if (release.draft === true || release.prerelease === true) return null;

  const tag = typeof release.tag_name === 'string' ? release.tag_name.trim() : '';
  if (!VERSION_PATTERN.test(tag)) return null;
  const version = tag.replace(/^v/, '');
  const tagName = `v${version}`;

  const assets = Array.isArray(release.assets) ? (release.assets as GithubAsset[]) : [];
  const files: Record<DownloadPlatform, ClassifiedAsset[]> = {
    windows: [],
    macos: [],
    linux: [],
  };
  let checksumsUrl = '';

  for (const asset of assets) {
    const name = typeof asset.name === 'string' ? asset.name : '';
    const url = typeof asset.browser_download_url === 'string' ? asset.browser_download_url : '';
    if (!name || !url) continue;

    if (name === 'SHA256SUMS.txt') {
      checksumsUrl = url;
      continue;
    }

    const classified = classifyAsset(name);
    if (!classified) continue;
    files[classified.platform].push({ ...classified, url });
  }

  // Uma release incompleta (build falhou no meio) não deve virar CTA quebrado.
  for (const platform of downloadPlatforms) {
    if (files[platform].length === 0) return null;
  }

  const downloads = {
    windows: { files: sortFiles(files.windows) },
    macos: { files: sortFiles(files.macos) },
    linux: { files: sortFiles(files.linux) },
  } satisfies LatestRelease['downloads'];

  return {
    version,
    tag: tagName,
    notesUrl:
      typeof release.html_url === 'string' && release.html_url
        ? release.html_url
        : `${REPO}/releases/tag/${tagName}`,
    checksumsUrl: checksumsUrl || `${REPO}/releases/download/${tagName}/SHA256SUMS.txt`,
    publishedAt: typeof release.published_at === 'string' ? release.published_at : null,
    downloads,
    source: 'github',
  };
}

/** Formato preferido primeiro (`AppImage` → `.deb` → `.rpm`) e x64 antes de arm64. */
function sortFiles(files: ClassifiedAsset[]): ReleaseFile[] {
  return [...files]
    .sort((a, b) => a.rank - b.rank || a.file.localeCompare(b.file))
    .map(({ format, arch, file, url }) => ({ format, arch, file, url }));
}

/** Último release conhecido: usado quando o GitHub não responde. */
export function fallbackRelease(): LatestRelease {
  return {
    version: fallbackReleaseVersion,
    tag: `v${fallbackReleaseVersion}`,
    notesUrl: `${REPO}/releases/tag/v${fallbackReleaseVersion}`,
    checksumsUrl: `${REPO}/releases/download/v${fallbackReleaseVersion}/SHA256SUMS.txt`,
    publishedAt: null,
    downloads: fallbackDownloads,
    source: 'fallback',
  };
}

async function fetchLatestRelease(): Promise<LatestRelease> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(RELEASE_API, {
      headers,
      next: { revalidate: RELEASE_TTL, tags: [RELEASE_TAG] },
    });

    if (!response.ok) {
      console.warn(
        `[releases] GitHub respondeu ${response.status} em ${RELEASE_API}; servindo v${fallbackReleaseVersion}.`,
      );
      return fallbackRelease();
    }

    const release = parseRelease(await response.json());
    if (!release) {
      console.warn(
        `[releases] release mais recente sem assets completos para todas as plataformas; servindo v${fallbackReleaseVersion}.`,
      );
      return fallbackRelease();
    }

    return release;
  } catch (error) {
    console.warn(
      `[releases] falha ao consultar o GitHub (${String(error)}); servindo v${fallbackReleaseVersion}.`,
    );
    return fallbackRelease();
  }
}

/** Deduplica as chamadas dentro do mesmo render (página + hero + rodapé). */
export const getLatestRelease = cache(fetchLatestRelease);
