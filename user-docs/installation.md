---
title: Installation
description: Install Zylara on Windows, macOS or Linux from the published release, verify the SHA-256, run it for the first time, update and uninstall.
---

Zylara ships as a native release on GitHub: an installer for Windows, a disk image for macOS
and native packages for Linux. Every release publishes `SHA256SUMS.txt` and `release.json`
next to the artifacts, and the app itself reads that feed to offer updates.

:::downloads
:::

The block above is generated from the latest published release, so the version, the file names
and the links are the ones that exist right now. In the commands below, `<version>` stands for
that version.

## Before you install

| Requirement | Details |
| --- | --- |
| Windows | Windows 10/11 (x64) with WebView2. If WebView2 is missing, the installer runs the official Microsoft bootstrapper. |
| macOS | macOS 11 or newer on Apple silicon. Official builds are **arm64** only; there is no Intel build. |
| Linux | x64 distribution able to install `.deb`/`.rpm`, or FUSE for the `.AppImage`. Packages target an Ubuntu 22.04 baseline and need WebKitGTK. |
| Provider credential | One of the supported providers — see [Models and providers](/docs/models-and-providers). The app opens without one, but cannot answer. |
| Optional | Python 3.9+ and/or Node for [code execution](/docs/code-execution); Docker for the command sandbox and [computer use](/docs/computer-use). |

Node and Rust are **not** required: the app ships as a compiled binary.

## Windows

1. Run the `Zylara-Setup-<version>-windows-x64.exe` from the release.
2. Choose the install scope:
   - **Just for me** — installs to `%LOCALAPPDATA%\Programs\Zylara`, no administrator prompt,
     per-user shortcuts.
   - **For all users** — installs to `%ProgramFiles%\Zylara`, requires elevation, and registers
     the app for every account.
3. Keep the default folder unless you have a reason to change it.
4. Pick the options: **Desktop shortcut**, **Start menu shortcut**, **Open Zylara when
   finished**.
5. Wait for the progress step. If WebView2 is missing, the installer downloads and installs it
   silently before finishing.

The scope is fixed after installation: to change it, uninstall and install again.

The installers are **not code-signed**, so SmartScreen may show “Windows protected your PC”.
Use **More info → Run anyway** only if the file came from the release above and the SHA-256
matches — see [Verify the download](#verify-the-download).

### Silent and scripted installs

```powershell
Zylara-Setup-<version>-windows-x64.exe --silent --scope user
```

| Flag | Effect |
| --- | --- |
| `--setup` | Opens the wizard (same as double-clicking) |
| `--silent` | No UI; errors go to the installer log |
| `--scope user` / `--scope machine` | Per-user or per-machine install |
| `--dir <path>` | Target folder |
| `--desktop` / `--no-desktop` | Create or skip the desktop shortcut |
| `--start-menu` / `--no-start-menu` | Create or skip the Start menu entry |
| `--launch` / `--no-launch` | Launch the app when the install finishes |

The installer writes a log to `%TEMP%\Zylara-Setup-<date>.log`.

## macOS

1. Open the `.dmg` and drag **Zylara** to `Applications`.
2. The build is signed ad-hoc, not notarized. If Gatekeeper blocks the first launch,
   right-click the app and choose **Open**, or allow it in **System Settings → Privacy &
   Security**.
3. The build is arm64-only; on an Intel Mac it will not run.

## Linux

| Package | Command |
| --- | --- |
| Debian/Ubuntu | `sudo apt install ./Zylara-<version>-linux-x64.deb` |
| Fedora/RHEL | `sudo dnf install ./Zylara-<version>-linux-x64.rpm` |
| Any distribution | `chmod +x Zylara-<version>-linux-x64.AppImage && ./Zylara-<version>-linux-x64.AppImage` |

The AppImage bundles the media framework, so audio and video previews work without extra
packages. Without FUSE, run it with `--appimage-extract-and-run`.

### Managed per-user install

The release also ships `Zylara-install-<version>-linux-x64.sh` and
`Zylara-install-<version>-macos-arm64.sh`. They verify size and SHA-256 and install per user,
without administrator rights:

- Linux: `~/.local/opt/zylara/Zylara.AppImage` plus a `zylara-managed.desktop` entry.
- macOS: `~/Applications/Zylara.app`.

Managed installs record themselves in `<app-data>/managed-install.json`, which is what enables
**Install and restart** in updates. The scripts are not silent: they print what they will do
before writing.

## Verify the download

Every release publishes `SHA256SUMS.txt` next to the artifacts — the **SHA-256 checksums** link
in the download block opens it. Compare it with the file you downloaded:

```powershell
Get-FileHash .\Zylara-Setup-<version>-windows-x64.exe -Algorithm SHA256
```

```bash
sha256sum -c SHA256SUMS.txt
```

Do not install a binary whose hash does not match, or that came from anywhere other than the
project's release page.

## First launch

On first start Zylara creates its data folder and opens the welcome screen. With no credential
configured, the composer shows a banner with an **Open Providers** action — that is the expected
state, not an error.

- Windows: `%APPDATA%\app.zylara.chat`
- macOS: `~/Library/Application Support/app.zylara.chat`
- Linux: `~/.local/share/app.zylara.chat`

See [Data and privacy](/docs/data-and-privacy) for what is stored there.

## Updates

The app checks the release feed when it opens and once an hour. When a stable version is newer,
the title bar shows a chip with the release notes and the download size.

- The download is verified with SHA-256 before anything is installed.
- Nothing installs by itself: the app asks first, then opens the platform installer.
- Managed installs (Linux x64 and macOS arm64) get **Install and restart**; the app replaces its
  own payload and reopens.
- The manual check lives in Settings → About → Updates.

## Uninstall

| Platform | How |
| --- | --- |
| Windows | **Settings → Apps → Installed apps → Zylara → Uninstall**, or run `Uninstall Zylara.exe` from the install folder. Silent: `Uninstall Zylara.exe --silent`. |
| macOS | Drag `Zylara.app` to the Trash; remove the data folder manually to erase everything. |
| Linux | Remove the package (`apt remove zylara` / `dnf remove zylara`) or delete the AppImage and the `.desktop` entry. |

By default the uninstaller **keeps your data** (conversations, attachments, artifacts, settings
and API keys). The Windows uninstaller offers **Also remove my data**; the `--purge` flag does
the same silently. That step cannot be undone.

Next: [First steps](/docs/first-steps).
