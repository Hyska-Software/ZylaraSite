import type { DocsContent } from '@/content/docs/types';

/** 中文文档内容（随站点其他页面同步维护）。 */
export const zhCN: DocsContent = {
  chrome: {
    label: '文档',
    menu: '菜单',
    closeMenu: '关闭菜单',
    nav: '文档',
    search: '搜索',
    searchPlaceholder: '搜索文档',
    searchEmpty: '没有匹配此搜索的页面。',
    searchHint: 'Ctrl K',
    searchOpen: '打开搜索',
    onThisPage: '本页内容',
    groups: {
      start: '入门',
      configure: '配置',
      help: '帮助',
    },
    previous: '上一篇',
    next: '下一篇',
    pagination: '页面导航',
    repository: '仓库',
    latest: '已发布版本',
    formats: '格式',
    allDownloads: '全部版本',
    checksums: 'SHA-256 校验值',
    copy: '复制',
    copied: '已复制',
    beta: '测试版',
  },

  pages: [
    {
      slug: 'intro',
      group: 'start',
      title: '简介',
      summary: 'Zylara 是什么、如何下载,以及首次启动时该做什么。',
      lede: 'Zylara 是一个本地优先的代码智能体工作台。它先规划再写入,执行前请求批准,并展示每一处改动——文件与密钥都不会离开你的电脑。',
      sections: [
        {
          id: 'download',
          title: '下载',
          blocks: [
            {
              kind: 'text',
              text: '下面的安装包来自[仓库](https://github.com/Hyska-Software/ZylaraAi/releases)发布的最新稳定版。Windows 是主要构建,macOS 与 Linux 仍为测试构建。',
            },
            { kind: 'installers' },
            {
              kind: 'text',
              text: '[下载页](/download)列出了所有格式、各平台的架构以及该版本的 SHA-256 校验值。',
            },
          ],
        },
        {
          id: 'first-run',
          title: '首次启动',
          blocks: [
            {
              kind: 'list',
              ordered: true,
              items: [
                '在 设置 → 提供商 中连接一个提供商:OpenCode(Go 或 Zen)密钥、ChatGPT 账号或 OpenAI 密钥,或 Anthropic 密钥。',
                '在输入框的模型选择器中选择模型。目录包含 160+ 个模型,推理强度按模型设置。',
                '在标题栏选择模式:`Chat`、`Code` 或 `Agents`。',
                '开始对话,或打开一个文件夹让智能体在其中工作。',
              ],
            },
            {
              kind: 'note',
              label: '开始之前',
              text: '如果你已经在使用 OpenCode CLI,它的密钥会被自动检测,不需要重新粘贴。',
            },
          ],
        },
        {
          id: 'modes',
          title: '模式',
          blocks: [
            {
              kind: 'list',
              items: [
                '`Chat` — 文档对话、带引用的网络搜索、产物与生成式 UI。',
                '`Code` — 代码工作区:写入前先规划、逐步审批、查看 diff 与终端。',
                '`Agents` — 多个智能体并行工作,各自拥有计划与记录。',
              ],
            },
          ],
        },
        {
          id: 'local-first',
          title: '本地优先',
          blocks: [
            {
              kind: 'text',
              text: '对话、附件与产物保存在本机的 SQLite 数据库中。API 密钥只存于本地,永远不会暴露给渲染进程。请求直接发往你选择的提供商,不经过 Zylara 的服务器。',
            },
            {
              kind: 'list',
              items: [
                '历史记录、搜索、置顶、重命名与导出都在应用内完成。',
                '只有在智能体调用工具时才会进行网络搜索与网页读取。',
                '代码执行需手动开启,并在隔离的工作区中运行,带超时与取消。',
              ],
            },
          ],
        },
        {
          id: 'next-steps',
          title: '下一步',
          blocks: [
            {
              kind: 'list',
              items: [
                '[安装](/docs/install) — 安装包、校验值与更新。',
                '[提供商与模型](/docs/providers) — 各提供商的认证方式。',
                '[权限](/docs/permissions) — 计划模式、审批与代码执行。',
                '[故障排查](/docs/troubleshooting) — 打不开或连不上时怎么办。',
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'install',
      group: 'start',
      title: '安装',
      summary: '各平台安装包、校验值验证、更新与卸载。',
      lede: 'Zylara 在各平台都以原生安装包分发。页面上的版本来自 GitHub 最新发布,因此无需部署即可跟随应用更新。',
      sections: [
        {
          id: 'downloads',
          title: '安装包',
          blocks: [
            {
              kind: 'text',
              text: '下载适用于你的平台的安装包。macOS 与 Linux 仍为测试构建,版本之间可能有变化。',
            },
            { kind: 'installers' },
          ],
        },
        {
          id: 'verify',
          title: '验证校验值',
          blocks: [
            {
              kind: 'text',
              text: '每次发布都会附上 `SHA256SUMS.txt`。运行安装包之前,先比对下载文件的哈希与该列表中的值。',
            },
            {
              kind: 'code',
              tabs: [
                {
                  label: 'Windows',
                  code: 'certutil -hashfile Zylara-Setup-<版本>-windows-x64.exe SHA256',
                },
                { label: 'macOS', code: 'shasum -a 256 Zylara-<版本>-macos-arm64.dmg' },
                { label: 'Linux', code: 'sha256sum Zylara-<版本>-linux-x64.AppImage' },
              ],
            },
            {
              kind: 'note',
              label: '哈希不一致',
              text: '如果校验值不匹配,请重新下载:下载不完整是最常见的原因。哈希不符的安装包不要运行。',
            },
          ],
        },
        {
          id: 'requirements',
          title: '环境要求',
          blocks: [
            {
              kind: 'table',
              head: ['平台', '需要预先安装'],
              rows: [
                ['Windows 10/11 (x64)', 'WebView2 — 当前 Windows 构建已自带'],
                ['macOS (arm64)', '较新的 macOS;测试构建'],
                ['Linux (x64)', 'AppImage、`.deb` 或 `.rpm`;较新的 glibc'],
              ],
            },
            {
              kind: 'text',
              text: '只有在使用可选的代码执行时才需要 Python 3.9+ 和/或 Node。设置 → 工具 会显示检测到的环境与缺少的组件。',
            },
          ],
        },
        {
          id: 'updates',
          title: '更新',
          blocks: [
            {
              kind: 'text',
              text: '应用在启动时以及每小时检查一次发布。存在更新的稳定版本时,标题栏会显示提示,包含更新内容与下载大小。',
            },
            {
              kind: 'list',
              items: [
                '安装之前,下载内容会通过 SHA-256 校验。',
                '不会静默安装:安装始终需要确认。',
                'Windows 上应用会退出并打开 Zylara 安装向导;macOS 上打开 DMG;Linux 上打开安装包或 AppImage。',
                '手动检查位于 设置 → 关于 → 更新。',
              ],
            },
          ],
        },
        {
          id: 'uninstall',
          title: '卸载',
          blocks: [
            {
              kind: 'list',
              items: [
                'Windows:在开始菜单中使用“卸载 Zylara”;卸载程序可以选择保留数据。',
                'macOS:将 Zylara 从“应用程序”拖到废纸篓。',
                'Linux:通过包管理器移除(`.deb`/`.rpm`),或删除 AppImage 文件。',
              ],
            },
            {
              kind: 'text',
              text: '数据保存在应用数据目录:SQLite 历史、产物与密钥。删除该目录会彻底重置应用。',
            },
          ],
        },
      ],
    },

    {
      slug: 'providers',
      group: 'configure',
      title: '提供商与模型',
      summary: '如何为 OpenCode、OpenAI 与 Anthropic 配置认证并选择模型。',
      lede: 'Zylara 直接连接三类提供商。至少连接其中一个,然后在对话中选择模型。',
      sections: [
        {
          id: 'providers',
          title: '提供商',
          blocks: [
            {
              kind: 'table',
              head: ['提供商', '如何认证'],
              rows: [
                [
                  'OpenCode Go / Zen',
                  '来自 OpenCode Console 的 API 密钥。已安装的 OpenCode CLI 密钥会被自动检测。',
                ],
                [
                  'OpenAI',
                  '使用“继续使用 ChatGPT”(官方 OAuth,无需 API 密钥),或平台的 `sk-…` API 密钥。',
                ],
                [
                  'Anthropic',
                  '来自 Claude Console 的 `sk-ant-…` API 密钥(按量付费,不使用订阅)。也会检测 `ANTHROPIC_API_KEY`。',
                ],
              ],
            },
            {
              kind: 'note',
              label: 'ChatGPT 套餐',
              text: '使用 ChatGPT 登录时,模型列表来自你的账号,标题栏会显示套餐标识。',
            },
          ],
        },
        {
          id: 'models',
          title: '模型',
          blocks: [
            {
              kind: 'text',
              text: '目录汇集了三个提供商的 160+ 个模型。输入框的选择器只列出你账号可用的模型。',
            },
            {
              kind: 'list',
              items: [
                '推理强度按模型设置:关闭、按强度级别或按 token 预算。',
                '对话可以置顶、重命名、导出,并在本地历史中搜索。',
                '本地技能(`SKILL.md`)指导智能体生成各类文件格式。',
              ],
            },
          ],
        },
        {
          id: 'keys',
          title: '密钥存放位置',
          blocks: [
            {
              kind: 'text',
              text: '密钥只写入本地应用数据目录,永远不会暴露给渲染进程。请求直接发往你选择的提供商。',
            },
            {
              kind: 'note',
              label: '隐私',
              text: '数据不经过 Zylara 的服务器。详见[隐私政策](/privacy)。',
            },
          ],
        },
      ],
    },

    {
      slug: 'permissions',
      group: 'configure',
      title: '权限',
      summary: '写入前先规划、按工具审批,以及可选的代码执行。',
      lede: '智能体不会在暗处行动:它先规划、请求批准,并展示改动。这是应用的权限约定。',
      sections: [
        {
          id: 'plan-mode',
          title: '计划模式',
          blocks: [
            {
              kind: 'text',
              text: '计划模式下,智能体先调研,并写出包含步骤、受影响文件与每项改动风险的计划。在你批准之前不会写入任何内容。',
            },
            {
              kind: 'list',
              items: [
                '批准计划后才会执行;拒绝则让智能体回到调研阶段。',
                '计划仅对当前轮次有效:范围变了会重新请求计划。',
                '随时可以退出计划模式,回到对话。',
              ],
            },
          ],
        },
        {
          id: 'approvals',
          title: '审批',
          blocks: [
            {
              kind: 'table',
              head: ['操作', '行为'],
              rows: [
                ['读取工作区文件', '在当前轮次内允许,读取记录显示在时间线中。'],
                ['写入或编辑文件', '请求批准,并在应用之前展示 diff。'],
                ['运行命令', '请求批准;请求中会显示命令与目录。'],
                ['网络搜索与网页读取', '仅在智能体认为任务需要时使用。'],
              ],
            },
          ],
        },
        {
          id: 'sandbox',
          title: '代码执行',
          blocks: [
            {
              kind: 'text',
              text: '代码执行需手动开启。开启后,智能体在隔离工作区中编写并运行 Python 与 Node 脚本,带超时、限制与取消,并把生成的文件作为产物返回。',
            },
            {
              kind: 'list',
              items: [
                '沙箱工作区之外不会执行任何内容。',
                '取消会中断正在运行的进程。',
                '生成的产物进入资料库,并可另存为文件。',
              ],
            },
          ],
        },
        {
          id: 'review',
          title: '复查',
          blocks: [
            {
              kind: 'text',
              text: '每处改动都会在侧边面板中以 diff 显示,包含文件、新增与删除的行。本地历史按对话保存已批准的内容。',
            },
          ],
        },
      ],
    },

    {
      slug: 'troubleshooting',
      group: 'help',
      title: '故障排查',
      summary: '安装包打不开、提供商连不上、AppImage 无法运行。',
      lede: '最初几分钟里最常见的问题,以及提交 issue 之前该检查什么。',
      sections: [
        {
          id: 'installer',
          title: '安装包打不开',
          blocks: [
            {
              kind: 'list',
              items: [
                '将文件哈希与发布的 `SHA256SUMS.txt` 对比:下载不完整是最常见的原因。',
                'Windows 上 SmartScreen 会对新安装包要求确认——选择“更多信息”,仅在哈希一致时继续。',
                'macOS 上首次运行时右键点击应用 → 打开。',
              ],
            },
            {
              kind: 'note',
              label: '重新安装',
              text: '卸载不会删除数据:在同一目录重新安装会保留历史记录。',
            },
          ],
        },
        {
          id: 'provider',
          title: '提供商连不上',
          blocks: [
            {
              kind: 'list',
              items: [
                '确认密钥完整粘贴,且属于 设置 → 提供商 中选择的那个提供商。',
                '`ANTHROPIC_API_KEY` 等变量在应用启动时读取:设置之后请重新打开 Zylara。',
                '使用 ChatGPT 登录时,确认账号套餐符合条件,且套餐额度没有用完。',
              ],
            },
          ],
        },
        {
          id: 'linux',
          title: 'AppImage 无法运行',
          blocks: [
            {
              kind: 'text',
              text: 'AppImage 需要可执行权限。如果系统无法通过 `FUSE` 挂载,请加上 `--appimage-extract-and-run` 运行。',
            },
            {
              kind: 'code',
              tabs: [
                {
                  label: '终端',
                  code: 'chmod +x Zylara-*.AppImage\n./Zylara-*.AppImage --appimage-extract-and-run',
                },
              ],
            },
            {
              kind: 'text',
              text: '更喜欢原生包?可以改用同一发布中的 `.deb`(Debian/Ubuntu)或 `.rpm`(Fedora/openSUSE)。',
            },
          ],
        },
        {
          id: 'report',
          title: '提交 issue',
          blocks: [
            {
              kind: 'text',
              text: '如果以上都不能解决,请提交 issue,附上应用版本、系统以及发生了什么。复现步骤比截图更有帮助。',
            },
            {
              kind: 'list',
              items: [
                '[提交 issue](https://github.com/Hyska-Software/ZylaraAi/issues)',
                '[已发布版本](https://github.com/Hyska-Software/ZylaraAi/releases)',
                '[仓库 README](https://github.com/Hyska-Software/ZylaraAi#readme)',
              ],
            },
          ],
        },
      ],
    },
  ],
};
