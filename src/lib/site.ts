/**
 * Configuração única do site.
 *
 * Nada aqui deve ser inventado nos componentes: todo link externo vem daqui.
 * A versão publicada e as URLs dos instaladores **não** ficam neste arquivo:
 * elas vêm da release mais recente do GitHub (`@/lib/releases`), com o
 * fallback pinado abaixo apenas para quando a API estiver indisponível.
 */

const REPO = 'https://github.com/Hyska-Software/ZylaraAi';

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

/**
 * Plataformas cujo build ainda é experimental/beta. O site precisa avisar isso
 * antes do clique no download (página `/download` e cards da landing); quando um
 * build sair do beta, basta removê-lo daqui.
 */
export const experimentalPlatforms = ['macos', 'linux'] as const;

export type ExperimentalPlatform = (typeof experimentalPlatforms)[number];

export function isExperimentalPlatform(platform: DownloadPlatform): platform is ExperimentalPlatform {
  return (experimentalPlatforms as readonly string[]).includes(platform);
}

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
        file: `Zylara-Setup-${fallbackReleaseVersion}-windows-x64.exe`,
        url: fallbackAsset(`Zylara-Setup-${fallbackReleaseVersion}-windows-x64.exe`),
      },
    ],
  },
  macos: {
    files: [
      {
        format: '.dmg',
        arch: 'arm64',
        file: `Zylara-${fallbackReleaseVersion}-macos-arm64.dmg`,
        url: fallbackAsset(`Zylara-${fallbackReleaseVersion}-macos-arm64.dmg`),
      },
    ],
  },
  linux: {
    files: [
      {
        format: 'AppImage',
        arch: 'x64',
        file: `Zylara-${fallbackReleaseVersion}-linux-x64.AppImage`,
        url: fallbackAsset(`Zylara-${fallbackReleaseVersion}-linux-x64.AppImage`),
      },
      {
        format: '.deb',
        arch: 'x64',
        file: `Zylara-${fallbackReleaseVersion}-linux-x64.deb`,
        url: fallbackAsset(`Zylara-${fallbackReleaseVersion}-linux-x64.deb`),
      },
      {
        format: '.rpm',
        arch: 'x64',
        file: `Zylara-${fallbackReleaseVersion}-linux-x64.rpm`,
        url: fallbackAsset(`Zylara-${fallbackReleaseVersion}-linux-x64.rpm`),
      },
    ],
  },
} satisfies Record<DownloadPlatform, DownloadTarget>;

export const site = {
  name: 'Zylara',
  repoUrl: REPO,
  releasesUrl: `${REPO}/releases`,
  /** Guia de instalação e compilação vive no README do repositório. */
  docsUrl: `${REPO}#readme`,
  issuesUrl: `${REPO}/issues`,
  license: 'MIT',
} as const;

/**
 * Itens do menu suspenso "Features" do cabeçalho. A ordem aqui é a ordem dos
 * cards em `FeatureBento` e cada `id` é o âncora do card correspondente —
 * mexer em um lado exige mexer no outro (`src/components/sections/FeatureBento.tsx`).
 *
 * O mesmo `id` é o âncora da seção detalhada em `/features`, então o menu leva
 * direto ao conteúdo expandido de cada recurso.
 */
export const featureMenu = [
  { key: 'localFirst', id: 'features-local-first' },
  { key: 'planMode', id: 'features-plan-mode' },
  { key: 'permissions', id: 'features-permissions' },
  { key: 'diffs', id: 'features-diffs' },
  { key: 'skills', id: 'features-skills' },
  { key: 'modes', id: 'features-modes' },
] as const;

export type FeatureMenuKey = (typeof featureMenu)[number]['key'];

/** Âncora (`#id`) do card correspondente em `FeatureBento` e da seção em `/features`. */
export function featureAnchor(key: FeatureMenuKey) {
  return featureMenu.find((item) => item.key === key)?.id ?? 'features';
}
