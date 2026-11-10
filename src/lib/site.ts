/**
 * Configuração única do site.
 *
 * Nada aqui deve ser inventado nos componentes: todo link externo vem daqui.
 * A versão publicada e as URLs dos instaladores **não** ficam neste arquivo:
 * elas vêm da release mais recente do GitHub (`@/lib/releases`), com o
 * fallback pinado abaixo apenas para quando a API estiver indisponível.
 * TODO(P4): substituir `community.x` pelo perfil real quando definido.
 */

const REPO = 'https://github.com/Hyska-Software/LuminaAi';

/**
 * Versão usada só se a API do GitHub falhar no build e no ISR. É o último
 * release conhecido: mantenha atualizado ao cortar uma versão que inicia a
 * série (ex.: 1.0.0), nunca a cada patch.
 */
export const fallbackReleaseVersion = '0.3.9';

const fallbackAsset = (file: string) =>
  `${REPO}/releases/download/v${fallbackReleaseVersion}/${file}`;

export const downloadPlatforms = ['windows', 'macos', 'linux'] as const;

export type DownloadPlatform = (typeof downloadPlatforms)[number];

/** Arquitetura do build; `x64` cobre Intel/AMD 64-bit. */
export type DownloadArch = 'x64' | 'arm64';

/** Um asset publicado no release, com o formato que o usuário escolhe na página. */
export type ReleaseFile = {
  format: string;
  arch: DownloadArch;
  file: string;
  /** URL absoluta do asset na release publicada. */
  url: string;
};

export type DownloadTarget = {
  /** Arquivo padrão da plataforma (o que o botão principal entrega). */
  files: readonly ReleaseFile[];
};

/**
 * Release resolvida no servidor (`getLatestRelease`) e passada aos componentes.
 * O tipo mora aqui para que os componentes client o importem sem tocar no
 * módulo `server-only` que faz o fetch.
 */
export type LatestRelease = {
  version: string;
  tag: string;
  /** Página da versão publicada (notas de release). */
  notesUrl: string;
  checksumsUrl: string;
  publishedAt: string | null;
  downloads: Record<DownloadPlatform, DownloadTarget>;
  /** `fallback` quando a API falhou e a página está servindo a versão pinada. */
  source: 'github' | 'fallback';
};

/** Instaladores do último release conhecido; só usado no fallback. */
export const fallbackDownloads = {
  windows: {
    files: [
      {
        format: '.exe',
        arch: 'x64',
        file: `Lumina-Setup-${fallbackReleaseVersion}-windows-x64.exe`,
        url: fallbackAsset(`Lumina-Setup-${fallbackReleaseVersion}-windows-x64.exe`),
      },
    ],
  },
  macos: {
    files: [
      {
        format: '.dmg',
        arch: 'arm64',
        file: `Lumina-${fallbackReleaseVersion}-macos-arm64.dmg`,
        url: fallbackAsset(`Lumina-${fallbackReleaseVersion}-macos-arm64.dmg`),
      },
    ],
  },
  linux: {
    files: [
      {
        format: 'AppImage',
        arch: 'x64',
        file: `Lumina-${fallbackReleaseVersion}-linux-x64.AppImage`,
        url: fallbackAsset(`Lumina-${fallbackReleaseVersion}-linux-x64.AppImage`),
      },
      {
        format: '.deb',
        arch: 'x64',
        file: `Lumina-${fallbackReleaseVersion}-linux-x64.deb`,
        url: fallbackAsset(`Lumina-${fallbackReleaseVersion}-linux-x64.deb`),
      },
      {
        format: '.rpm',
        arch: 'x64',
        file: `Lumina-${fallbackReleaseVersion}-linux-x64.rpm`,
        url: fallbackAsset(`Lumina-${fallbackReleaseVersion}-linux-x64.rpm`),
      },
    ],
  },
} satisfies Record<DownloadPlatform, DownloadTarget>;

export const site = {
  name: 'Lumina',
  /** Usado em <title>, JSON-LD e rodapé. */
  tagline: {
    en: 'The local-first agent workspace',
    'pt-BR': 'O workspace de agentes local-first',
  },
  repoUrl: REPO,
  releasesUrl: `${REPO}/releases`,
  community: {
    x: 'https://x.com/lumina',
  },
  license: 'MIT',
} as const;

export const navSections = [
  { id: 'features', labelKey: 'features' },
  { id: 'workflow', labelKey: 'workflow' },
  { id: 'positioning', labelKey: 'positioning' },
  { id: 'faq', labelKey: 'faq' },
] as const;

export type NavSectionId = (typeof navSections)[number]['id'];
