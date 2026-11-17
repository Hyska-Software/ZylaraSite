import type { DocsContent } from '@/content/docs/types';

/** Documentation content in English (default locale). */
export const en: DocsContent = {
  chrome: {
    label: 'Docs',
    menu: 'Menu',
    closeMenu: 'Close menu',
    nav: 'Documentation',
    search: 'Search',
    searchPlaceholder: 'Search the documentation',
    searchEmpty: 'No page matches this search.',
    searchHint: 'Ctrl K',
    searchOpen: 'Open search',
    onThisPage: 'On this page',
    groups: {
      start: 'Introduction',
      configure: 'Configure',
      help: 'Help',
    },
    previous: 'Previous',
    next: 'Next',
    pagination: 'Page navigation',
    repository: 'Repository',
    latest: 'Published version',
    formats: 'Formats',
    allDownloads: 'All releases',
    checksums: 'SHA-256 checksums',
    copy: 'Copy',
    copied: 'Copied',
    beta: 'Beta',
  },

  pages: [
    {
      slug: 'intro',
      group: 'start',
      title: 'Introduction',
      summary: 'What Zylara is, how to download it and what to expect on first run.',
      lede: 'Zylara is a local-first workspace for coding agents. It plans before it writes, asks for approval before it runs anything and shows every diff — without your files or keys leaving your machine.',
      sections: [
        {
          id: 'download',
          title: 'Download',
          blocks: [
            {
              kind: 'text',
              text: 'The installers below come from the latest stable release published in the [repository](https://github.com/Hyska-Software/ZylaraAi/releases). Windows is the main build; macOS and Linux are still beta builds.',
            },
            { kind: 'installers' },
            {
              kind: 'text',
              text: 'The [download page](/download) lists every format, the architectures for each platform and the SHA-256 checksums of the release.',
            },
          ],
        },
        {
          id: 'first-run',
          title: 'First run',
          blocks: [
            {
              kind: 'list',
              ordered: true,
              items: [
                'Connect a provider in Settings → Providers: an OpenCode (Go or Zen) key, a ChatGPT account or OpenAI key, or an Anthropic key.',
                'Pick a model in the composer selector. The catalog carries 160+ models and reasoning effort is set per model.',
                'Choose the mode in the title bar: `Chat`, `Code` or `Agents`.',
                'Start a conversation or open a folder for the agent to work in.',
              ],
            },
            {
              kind: 'note',
              label: 'Before you start',
              text: 'If you already use the OpenCode CLI, its key is detected automatically — no need to paste it again.',
            },
          ],
        },
        {
          id: 'modes',
          title: 'Modes',
          blocks: [
            {
              kind: 'list',
              items: [
                '`Chat` — conversation with documents, web search with citations, artifacts and generative UI.',
                '`Code` — coding workspace with a plan before writes, approvals, diffs and a terminal.',
                '`Agents` — several agents in parallel, each with its own plan and transcript.',
              ],
            },
          ],
        },
        {
          id: 'local-first',
          title: 'Local-first',
          blocks: [
            {
              kind: 'text',
              text: 'Conversations, attachments and artifacts live in a SQLite database on your machine. API keys are stored locally and never exposed to the renderer. Requests go straight to the provider you chose: nothing passes through a Zylara server.',
            },
            {
              kind: 'list',
              items: [
                'History, search, pinning, renaming and exporting all happen inside the app.',
                'Web search and page reading only run when the agent uses the tool.',
                'Code execution is opt-in and runs in an isolated workspace with a timeout and cancellation.',
              ],
            },
          ],
        },
        {
          id: 'next-steps',
          title: 'Next steps',
          blocks: [
            {
              kind: 'list',
              items: [
                '[Install](/docs/install) — installers, checksum verification and updates.',
                '[Providers and models](/docs/providers) — how to authenticate with each provider.',
                '[Permissions](/docs/permissions) — plan mode, approvals and code execution.',
                '[Troubleshooting](/docs/troubleshooting) — when something will not open or connect.',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'install',
      group: 'start',
      title: 'Install',
      summary: 'Installers per platform, checksum verification, updates and uninstalling.',
      lede: 'Zylara ships as a native installer on every platform. The published version is read from the latest GitHub release, so this page follows the app without a deploy.',
      sections: [
        {
          id: 'downloads',
          title: 'Installers',
          blocks: [
            {
              kind: 'text',
              text: 'Download the package for your platform. macOS and Linux are still beta builds and may change between versions.',
            },
            { kind: 'installers' },
          ],
        },
        {
          id: 'verify',
          title: 'Verify the checksum',
          blocks: [
            {
              kind: 'text',
              text: 'Every release publishes a `SHA256SUMS.txt`. Compare the hash of the downloaded file with the one in the list before running the installer.',
            },
            {
              kind: 'code',
              tabs: [
                {
                  label: 'Windows',
                  code: 'certutil -hashfile Zylara-Setup-<version>-windows-x64.exe SHA256',
                },
                { label: 'macOS', code: 'shasum -a 256 Zylara-<version>-macos-arm64.dmg' },
                { label: 'Linux', code: 'sha256sum Zylara-<version>-linux-x64.AppImage' },
              ],
            },
            {
              kind: 'note',
              label: 'Hash mismatch',
              text: 'If the checksum does not match, download the file again: an incomplete download is the usual cause. Never run an installer whose hash does not match.',
            },
          ],
        },
        {
          id: 'requirements',
          title: 'Requirements',
          blocks: [
            {
              kind: 'table',
              head: ['Platform', 'What has to be installed'],
              rows: [
                ['Windows 10/11 (x64)', 'WebView2 — already present on current Windows builds'],
                ['macOS (arm64)', 'A recent macOS; beta build'],
                ['Linux (x64)', 'AppImage, `.deb` or `.rpm`; recent glibc'],
              ],
            },
            {
              kind: 'text',
              text: 'Python 3.9+ and/or Node are only needed for optional code execution. Settings → Tools shows the detected environment and what is missing.',
            },
          ],
        },
        {
          id: 'updates',
          title: 'Updates',
          blocks: [
            {
              kind: 'text',
              text: 'The app checks releases when it opens and once an hour. When a newer stable version exists, a notice appears in the title bar with the release notes and download size.',
            },
            {
              kind: 'list',
              items: [
                'Downloads are verified with SHA-256 before any installation.',
                'Nothing installs by itself: installation always asks for confirmation.',
                'On Windows the app quits and opens the Zylara wizard; on macOS it opens the DMG; on Linux it opens the package or the AppImage.',
                'The manual check lives in Settings → About → Updates.',
              ],
            },
          ],
        },
        {
          id: 'uninstall',
          title: 'Uninstall',
          blocks: [
            {
              kind: 'list',
              items: [
                'Windows: use “Uninstall Zylara” from the Start menu; the uninstaller can keep your data.',
                'macOS: drag Zylara from Applications to the Trash.',
                'Linux: remove it with your package manager (`.deb`/`.rpm`) or delete the AppImage.',
              ],
            },
            {
              kind: 'text',
              text: 'Data lives in the app data folder — SQLite history, artifacts and keys. Deleting that folder resets the app completely.',
            },
          ],
        },
      ],
    },

    {
      slug: 'providers',
      group: 'configure',
      title: 'Providers and models',
      summary: 'How to authenticate with OpenCode, OpenAI and Anthropic and pick models.',
      lede: 'Zylara talks directly to three provider families. You connect at least one and pick the model inside the conversation.',
      sections: [
        {
          id: 'providers',
          title: 'Providers',
          blocks: [
            {
              kind: 'table',
              head: ['Provider', 'How to authenticate'],
              rows: [
                [
                  'OpenCode Go / Zen',
                  'API key from the OpenCode Console. A key from an existing OpenCode CLI install is detected automatically.',
                ],
                [
                  'OpenAI',
                  'Continue with ChatGPT (official OAuth, no API key) or an `sk-…` platform API key.',
                ],
                [
                  'Anthropic',
                  '`sk-ant-…` API key from the Claude Console (pay-as-you-go, no subscription). `ANTHROPIC_API_KEY` is detected too.',
                ],
              ],
            },
            {
              kind: 'note',
              label: 'ChatGPT plan',
              text: 'When signed in with ChatGPT, the model list is the one from your account and the app shows a plan indicator in the title bar.',
            },
          ],
        },
        {
          id: 'models',
          title: 'Models',
          blocks: [
            {
              kind: 'text',
              text: 'The catalog gathers 160+ models from the three providers. The composer selector only lists what is available to your account.',
            },
            {
              kind: 'list',
              items: [
                'Reasoning effort is set per model: off, by effort level or by token budget.',
                'Conversations can be pinned, renamed, exported and searched in local history.',
                'Local skills (`SKILL.md`) guide the agent when generating each file format.',
              ],
            },
          ],
        },
        {
          id: 'keys',
          title: 'Where keys are kept',
          blocks: [
            {
              kind: 'text',
              text: 'Keys are written locally in the app data folder and never exposed to the renderer. Requests go straight to the provider you chose.',
            },
            {
              kind: 'note',
              label: 'Privacy',
              text: 'Nothing passes through a Zylara server. Details are in the [privacy policy](/privacy).',
            },
          ],
        },
      ],
    },

    {
      slug: 'permissions',
      group: 'configure',
      title: 'Permissions',
      summary: 'A plan before writes, approval per tool and opt-in code execution.',
      lede: 'The agent does nothing in the dark: it plans, asks for approval and shows what changed. This is the app permission contract.',
      sections: [
        {
          id: 'plan-mode',
          title: 'Plan mode',
          blocks: [
            {
              kind: 'text',
              text: 'In plan mode the agent investigates and writes a plan with the steps, the affected files and the risk of each change. Nothing is written until you approve.',
            },
            {
              kind: 'list',
              items: [
                'Approving the plan unlocks execution; rejecting it sends the agent back to investigation.',
                'The plan is tied to the turn: change the scope and a new plan is requested.',
                'You can leave plan mode at any point and go back to the conversation.',
              ],
            },
          ],
        },
        {
          id: 'approvals',
          title: 'Approvals',
          blocks: [
            {
              kind: 'table',
              head: ['Action', 'Behaviour'],
              rows: [
                ['Reading workspace files', 'Allowed during the turn, with reads listed in the timeline.'],
                ['Writing or editing files', 'Asks for approval and shows the diff before applying.'],
                ['Running commands', 'Asks for approval; command and directory are shown in the request.'],
                ['Web search and page reading', 'Only when the agent judges it necessary for the task.'],
              ],
            },
          ],
        },
        {
          id: 'sandbox',
          title: 'Code execution',
          blocks: [
            {
              kind: 'text',
              text: 'Code execution is opt-in. When enabled, the agent writes and runs Python and Node scripts in an isolated workspace with a timeout, limits and cancellation — and hands the generated files back as artifacts.',
            },
            {
              kind: 'list',
              items: [
                'Nothing runs outside the sandbox workspace.',
                'Cancelling interrupts the running process.',
                'Generated artifacts go to the Library and can be saved as files.',
              ],
            },
          ],
        },
        {
          id: 'review',
          title: 'Review',
          blocks: [
            {
              kind: 'text',
              text: 'Every change shows up as a diff in the side panel, with file, added and removed lines. Local history keeps what was approved, per conversation.',
            },
          ],
        },
      ],
    },

    {
      slug: 'troubleshooting',
      group: 'help',
      title: 'Troubleshooting',
      summary: 'The installer will not open, the provider will not connect, the AppImage will not run.',
      lede: 'The most common problems of the first few minutes, and what to check before opening an issue.',
      sections: [
        {
          id: 'installer',
          title: 'The installer will not open',
          blocks: [
            {
              kind: 'list',
              items: [
                'Compare the file hash with the release `SHA256SUMS.txt`: an incomplete download is the usual cause.',
                'On Windows, SmartScreen asks for confirmation on new installers — use “More info” and continue only if the hash matches.',
                'On macOS, right-click the app → Open the first time you run it.',
              ],
            },
            {
              kind: 'note',
              label: 'Reinstalling',
              text: 'Uninstalling does not delete your data: reinstalling over the same folder keeps the history.',
            },
          ],
        },
        {
          id: 'provider',
          title: 'The provider will not connect',
          blocks: [
            {
              kind: 'list',
              items: [
                'Check that the key was pasted in full and belongs to the provider selected in Settings → Providers.',
                'Variables such as `ANTHROPIC_API_KEY` are read when the app opens: set them, then reopen Zylara.',
                'With ChatGPT sign-in, confirm the account has an eligible plan and that the plan limit was not reached.',
              ],
            },
          ],
        },
        {
          id: 'linux',
          title: 'The AppImage will not run',
          blocks: [
            {
              kind: 'text',
              text: 'An AppImage needs execute permission. If the system cannot mount it through `FUSE`, run it with `--appimage-extract-and-run`.',
            },
            {
              kind: 'code',
              tabs: [
                {
                  label: 'Terminal',
                  code: 'chmod +x Zylara-*.AppImage\n./Zylara-*.AppImage --appimage-extract-and-run',
                },
              ],
            },
            {
              kind: 'text',
              text: 'Prefer a native package? Use the `.deb` (Debian/Ubuntu) or the `.rpm` (Fedora/openSUSE) from the same release.',
            },
          ],
        },
        {
          id: 'report',
          title: 'Open an issue',
          blocks: [
            {
              kind: 'text',
              text: 'If none of the above helps, open an issue with the app version, your system and what happened. Reproduction steps help more than a screenshot.',
            },
            {
              kind: 'list',
              items: [
                '[Open an issue](https://github.com/Hyska-Software/ZylaraAi/issues)',
                '[Published releases](https://github.com/Hyska-Software/ZylaraAi/releases)',
                '[Repository README](https://github.com/Hyska-Software/ZylaraAi#readme)',
              ],
            },
          ],
        },
      ],
    },
  ],
};
