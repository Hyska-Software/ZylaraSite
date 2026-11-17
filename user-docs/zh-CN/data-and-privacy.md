---
title: 数据与隐私
description: 数据存放在哪里、什么会离开本机，以及如何备份和清除。
---

Zylara 是本地优先的。对话、附件、生成的文件、技能、设置和凭据都放在你电脑上的一个文件夹里，
没有 Zylara 账号，也没有自建的统计或遥测。

## 数据存放在哪里

| 平台 | 文件夹 |
| --- | --- |
| Windows | `%APPDATA%\app.zylara.chat`（缓存也放在 `%LOCALAPPDATA%\app.zylara.chat`） |
| macOS | `~/Library/Application Support/app.zylara.chat` |
| Linux | `~/.local/share/app.zylara.chat` |

可以在 **设置 → 数据 → 打开文件夹** 或命令面板中的 **打开数据文件夹** 打开它。

| 路径 | 内容 |
| --- | --- |
| `zylara.db` | 对话、消息、产物元数据、智能体、记忆、例行任务、频道、用量和插件记录（SQLite） |
| `settings.json` | 偏好设置 |
| `secrets.json`（+ `secrets.bak`） | API 密钥和 ChatGPT 会话 |
| `attachments/` | 你发送的文件 |
| `artifacts/<id>/` | 智能体创建的文件 |
| `skills/`、`skills-bundled/` | 你的技能和内置副本 |
| `code-runs/<id>/` | 代码执行用的临时工作区（每次运行后删除） |
| `themes/` | 已安装的主题包 |
| `plugins/<id>/<version>/` | 已安装的插件文件 |
| `agent-workspaces/` | 没有项目文件夹的智能体所使用的内部目录 |
| `updates/`、`managed-install.json` | 下载缓存和受管安装标记 |

## 凭据

密钥由后端写入 `secrets.json`，绝不会发送到界面：渲染进程收到的是打码的标识、邮箱和过期时间，
而不是 token。文件损坏时会从 `secrets.bak` 恢复。插件密钥使用 `plugin:<id>:<key>` 命名空间，
插件只能知道某个密钥是否存在，永远读不到它。

环境变量也会被读取（例如 `OPENAI_API_KEY`、`ANTHROPIC_API_KEY`、`OPENCODE_API_KEY`），已有的
OpenCode CLI 登录也会被复用，但这些值只在内存中读取。

## 什么会离开本机

| 目的地 | 何时 |
| --- | --- |
| 你选择的提供商 API | 每一轮，携带你的凭据 |
| Bing 或 DuckDuckGo | 仅当智能体搜索网页时 |
| 智能体抓取的页面 | 仅当智能体读取某个 URL 时 |
| GitHub 发布信息（`release.json`、发布 API） | 启动时以及每小时一次，用于检查更新 |
| 插件仓库与包 URL | 当你安装或更新插件时 |
| GHCR（容器镜像仓库） | 当你下载电脑操作镜像时 |
| Microsoft WebView2 引导程序 | 仅在缺少 WebView2 的 Windows 安装过程中 |

没有 Zylara 中继：请求直接从你的电脑发往上面的目的地。模型目录在构建时由 models.dev 生成并
打包进应用，所以选择器可以离线使用。

## 备份与恢复

关闭 Zylara，然后复制整个数据文件夹。这一份拷贝包含对话、附件、产物、技能、设置和密钥。

恢复时，关闭应用，把文件夹放回原位，再启动 Zylara。请把应用版本与备份一起保存：由较新版本
写入的数据库可能无法在旧版本中打开。

另外还有两种可携带的导出：

- 对话上的 **导出** 会写出一个 Markdown 文件。
- 智能体上的 **导出** 会写出一个包含配置和记忆的 `zylara-agent` JSON。

这些导出不包含产物和附件——用 **另存为…** 保存它们，或复制数据文件夹。

## 清除

| 范围 | 做法 |
| --- | --- |
| 一个对话 | `⋯` 菜单 → **删除** |
| 一个文件 | 资料库或产物面板 → **删除** |
| 应用中的全部内容 | **设置 → 数据 → 危险区域 → 清除数据…**（两次确认） |
| Windows 上的应用文件 | `Uninstall Zylara.exe`；加上 **同时移除我的数据** 或 `--purge` 可一并删除数据文件夹 |
| macOS/Linux 上的应用文件 | 移除应用/包，然后手动删除数据文件夹 |

卸载会 **保留** 对话、附件、产物、设置和 API 密钥，除非你选择移除它们。应用内的
**清除数据…** 会删除这些内容并把设置重置为默认值；该操作无法撤销。

## 日志

没有通用的应用日志。诊断信息分布在特定位置：

- 安装程序日志：Windows 上的 `%TEMP%\Zylara-Setup-<date>.log`；
- 受管更新日志：数据文件夹中的 `install.log`；
- 插件活动：`zylara.db` 中的插件日志和审计表；
- 缓存诊断：命令面板中的 **缓存诊断**。

报告问题时，请说明版本（**设置 → 关于**）、提供商和模型，以及应用显示的确切消息。不要粘贴
密钥。

下一步：[疑难解答](/docs/troubleshooting)。
