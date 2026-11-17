---
title: 安装
description: 从已发布的版本在 Windows、macOS 或 Linux 上安装 Zylara，校验 SHA-256，首次运行，更新和卸载。
---

Zylara 以 GitHub 上的原生版本发布：Windows 安装程序、macOS 磁盘映像和 Linux 原生包。每个版本都在产物旁发布 `SHA256SUMS.txt` 和 `release.json`，应用本身读取该发布源来提供更新。

:::downloads
:::

上面的区块根据最新发布的版本生成，因此版本号、文件名和链接都是当前实际存在的。在下面的命令中，`<version>` 代表该版本。

## 安装之前

| 要求 | 说明 |
| --- | --- |
| Windows | Windows 10/11（x64）并带有 WebView2。如果缺少 WebView2，安装程序会运行微软官方引导程序。 |
| macOS | Apple 芯片上运行 macOS 11 或更新版本。官方构建只提供 **arm64**；没有 Intel 构建。 |
| Linux | 能够安装 `.deb`/`.rpm` 的 x64 发行版，或支持 FUSE 以运行 `.AppImage`。包以 Ubuntu 22.04 为基线，需要 WebKitGTK。 |
| 提供商凭据 | 受支持的提供商之一 — 参见[模型与提供商](/docs/models-and-providers)。没有凭据时应用也能打开，但无法回答。 |
| 可选 | 用于[代码执行](/docs/code-execution)的 Python 3.9+ 和/或 Node；用于命令沙箱和[电脑操作](/docs/computer-use)的 Docker。 |

Node 和 Rust **不是**必需的：应用以编译好的二进制形式发布。

## Windows

1. 运行版本中的 `Zylara-Setup-<version>-windows-x64.exe`。
2. 选择安装范围：
   - **仅为我安装** — 安装到 `%LOCALAPPDATA%\Programs\Zylara`，不弹出管理员提示，快捷方式按用户创建。
   - **为所有用户安装** — 安装到 `%ProgramFiles%\Zylara`，需要提权，并为每个账户注册应用。
3. 除非有理由更改，否则保留默认文件夹。
4. 选择选项：**桌面快捷方式**、**开始菜单快捷方式**、**完成后打开 Zylara**。
5. 等待进度步骤。如果缺少 WebView2，安装程序会在完成前静默下载并安装它。

安装范围在安装完成后即固定：如需更改，先卸载再重新安装。

安装程序**未做代码签名**，因此 SmartScreen 可能显示“Windows 已保护你的电脑”。仅当文件来自上面的版本且 SHA-256 匹配时，才使用 **更多信息 → 仍要运行** — 参见[验证下载](#验证下载)。

### 静默安装与脚本安装

```powershell
Zylara-Setup-<version>-windows-x64.exe --silent --scope user
```

| 参数 | 作用 |
| --- | --- |
| `--setup` | 打开向导（等同于双击） |
| `--silent` | 无界面；错误写入安装日志 |
| `--scope user` / `--scope machine` | 按用户或按机器安装 |
| `--dir <path>` | 目标文件夹 |
| `--desktop` / `--no-desktop` | 创建或跳过桌面快捷方式 |
| `--start-menu` / `--no-start-menu` | 创建或跳过开始菜单条目 |
| `--launch` / `--no-launch` | 安装完成后启动应用 |

安装程序会把日志写入 `%TEMP%\Zylara-Setup-<date>.log`。

## macOS

1. 打开 `.dmg`，将 **Zylara** 拖到 `Applications`。
2. 该构建采用 ad-hoc 签名，未经公证。如果 Gatekeeper 阻止首次启动，右键点击应用并选择 **打开**，或在 **系统设置 → 隐私与安全性** 中允许它。
3. 该构建仅支持 arm64；在 Intel Mac 上无法运行。

## Linux

| 包 | 命令 |
| --- | --- |
| Debian/Ubuntu | `sudo apt install ./Zylara-<version>-linux-x64.deb` |
| Fedora/RHEL | `sudo dnf install ./Zylara-<version>-linux-x64.rpm` |
| 任意发行版 | `chmod +x Zylara-<version>-linux-x64.AppImage && ./Zylara-<version>-linux-x64.AppImage` |

AppImage 内置媒体框架，因此音频和视频预览无需额外安装包即可工作。没有 FUSE 时，使用 `--appimage-extract-and-run` 运行它。

### 托管的按用户安装

该版本还提供 `Zylara-install-<version>-linux-x64.sh` 和 `Zylara-install-<version>-macos-arm64.sh`。它们校验大小和 SHA-256，并按用户安装，无需管理员权限：

- Linux：`~/.local/opt/zylara/Zylara.AppImage`，外加一个 `zylara-managed.desktop` 条目。
- macOS：`~/Applications/Zylara.app`。

托管安装会把自己记录在 `<app-data>/managed-install.json` 中，更新中的 **安装并重启** 就依赖这个文件。脚本不是静默的：它们在写入前会打印将要执行的操作。

## 验证下载

每个版本都在产物旁发布 `SHA256SUMS.txt` — 下载区块中的 **SHA-256 校验和** 链接会打开它。将其与你下载的文件比较：

```powershell
Get-FileHash .\Zylara-Setup-<version>-windows-x64.exe -Algorithm SHA256
```

```bash
sha256sum -c SHA256SUMS.txt
```

不要安装哈希不匹配的二进制文件，也不要安装来自项目发布页以外任何地方的二进制文件。

## 首次启动

首次启动时，Zylara 创建数据文件夹并打开欢迎界面。未配置凭据时，输入框会显示带有 **打开提供商** 操作的横幅 — 这是预期状态，不是错误。

- Windows：`%APPDATA%\app.zylara.chat`
- macOS：`~/Library/Application Support/app.zylara.chat`
- Linux：`~/.local/share/app.zylara.chat`

关于其中存储的内容，参见[数据与隐私](/docs/data-and-privacy)。

## 更新

应用在打开时检查一次发布源，之后每小时检查一次。当稳定版本更新时，标题栏会显示一个带有发布说明和下载大小的标签。

- 在安装任何内容之前，下载都会用 SHA-256 校验。
- 不会自动安装任何内容：应用先询问，然后打开平台安装程序。
- 托管安装（Linux x64 和 macOS arm64）提供 **安装并重启**；应用替换自身的程序文件并重新打开。
- 手动检查位于 设置 → 关于 → 更新。

## 卸载

| 平台 | 方法 |
| --- | --- |
| Windows | **设置 → 应用 → 已安装的应用 → Zylara → 卸载**，或从安装文件夹运行 `Uninstall Zylara.exe`。静默：`Uninstall Zylara.exe --silent`。 |
| macOS | 将 `Zylara.app` 拖到废纸篓；手动删除数据文件夹以清除所有内容。 |
| Linux | 移除包（`apt remove zylara` / `dnf remove zylara`），或删除 AppImage 和 `.desktop` 条目。 |

默认情况下，卸载程序**会保留你的数据**（对话、附件、产物、设置和 API 密钥）。Windows 卸载程序提供 **同时删除我的数据**；`--purge` 参数会静默执行同样的操作。该步骤无法撤销。

下一步：[快速上手](/docs/first-steps)。
