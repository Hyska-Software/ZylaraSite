---
title: Instalação
description: Instale o Zylara no Windows, macOS ou Linux a partir do release publicado, verifique o SHA-256, abra pela primeira vez, atualize e desinstale.
---

O Zylara é distribuído como um release nativo no GitHub: um instalador para Windows, uma imagem de
disco para macOS e pacotes nativos para Linux. Todo release publica `SHA256SUMS.txt` e
`release.json` junto aos artefatos, e o próprio app lê esse feed para oferecer atualizações.

:::downloads
:::

O bloco acima é gerado a partir do último release publicado, então a versão, os nomes dos arquivos e
os links são os que existem agora. Nos comandos abaixo, `<version>` representa essa versão.

## Antes de instalar

| Requisito | Detalhes |
| --- | --- |
| Windows | Windows 10/11 (x64) com WebView2. Se o WebView2 estiver ausente, o instalador executa o bootstrapper oficial da Microsoft. |
| macOS | macOS 11 ou mais recente em Apple silicon. As builds oficiais são somente **arm64**; não existe build para Intel. |
| Linux | Distribuição x64 capaz de instalar `.deb`/`.rpm`, ou FUSE para o `.AppImage`. Os pacotes miram a base do Ubuntu 22.04 e precisam de WebKitGTK. |
| Credencial de provedor | Um dos provedores suportados — veja [Modelos e provedores](/docs/models-and-providers). O app abre sem ela, mas não consegue responder. |
| Opcional | Python 3.9+ e/ou Node para [execução de código](/docs/code-execution); Docker para o sandbox de comandos e [uso do computador](/docs/computer-use). |

Node e Rust **não** são necessários: o app é distribuído como um binário compilado.

## Windows

1. Execute o `Zylara-Setup-<version>-windows-x64.exe` do release.
2. Escolha o escopo da instalação:
   - **Somente para mim** — instala em `%LOCALAPPDATA%\Programs\Zylara`, sem prompt de administrador,
     com atalhos por usuário.
   - **Para todos os usuários** — instala em `%ProgramFiles%\Zylara`, exige elevação e registra o app
     para todas as contas.
3. Mantenha a pasta padrão, a menos que você tenha um motivo para mudá-la.
4. Escolha as opções: **Atalho na área de trabalho**, **Atalho no menu Iniciar**, **Abrir o Zylara
   ao concluir**.
5. Aguarde a etapa de progresso. Se o WebView2 estiver ausente, o instalador baixa e instala em
   silêncio antes de concluir.

O escopo fica fixo depois da instalação: para mudá-lo, desinstale e instale de novo.

Os instaladores **não são assinados digitalmente**, então o SmartScreen pode mostrar “O Windows
protegeu o seu PC”. Use **Mais informações → Executar assim mesmo** apenas se o arquivo veio do
release acima e a soma SHA-256 confere — veja [Verificar o download](#verificar-o-download).

### Instalações silenciosas e por script

```powershell
Zylara-Setup-<version>-windows-x64.exe --silent --scope user
```

| Flag | Efeito |
| --- | --- |
| `--setup` | Abre o assistente (o mesmo que dar um duplo clique) |
| `--silent` | Sem interface; os erros vão para o log do instalador |
| `--scope user` / `--scope machine` | Instalação por usuário ou por máquina |
| `--dir <path>` | Pasta de destino |
| `--desktop` / `--no-desktop` | Cria ou ignora o atalho na área de trabalho |
| `--start-menu` / `--no-start-menu` | Cria ou ignora a entrada no menu Iniciar |
| `--launch` / `--no-launch` | Abre o app quando a instalação termina |

O instalador grava um log em `%TEMP%\Zylara-Setup-<date>.log`.

## macOS

1. Abra o `.dmg` e arraste o **Zylara** para `Applications`.
2. A build é assinada ad-hoc, não notarizada. Se o Gatekeeper bloquear a primeira execução, clique
   com o botão direito no app e escolha **Abrir**, ou libere em **Ajustes do Sistema → Privacidade e
   Segurança**.
3. A build é somente arm64; em um Mac com Intel ela não roda.

## Linux

| Pacote | Comando |
| --- | --- |
| Debian/Ubuntu | `sudo apt install ./Zylara-<version>-linux-x64.deb` |
| Fedora/RHEL | `sudo dnf install ./Zylara-<version>-linux-x64.rpm` |
| Qualquer distribuição | `chmod +x Zylara-<version>-linux-x64.AppImage && ./Zylara-<version>-linux-x64.AppImage` |

O AppImage traz o framework de mídia embutido, então pré-visualizações de áudio e vídeo funcionam sem
pacotes extras. Sem FUSE, rode com `--appimage-extract-and-run`.

### Instalação gerenciada por usuário

O release também inclui `Zylara-install-<version>-linux-x64.sh` e
`Zylara-install-<version>-macos-arm64.sh`. Eles verificam tamanho e SHA-256 e instalam por usuário,
sem direitos de administrador:

- Linux: `~/.local/opt/zylara/Zylara.AppImage` mais uma entrada `zylara-managed.desktop`.
- macOS: `~/Applications/Zylara.app`.

Instalações gerenciadas se registram em `<app-data>/managed-install.json`, e é isso que habilita
**Instalar e reiniciar** nas atualizações. Os scripts não são silenciosos: eles imprimem o que vão
fazer antes de gravar.

## Verificar o download

Todo release publica `SHA256SUMS.txt` junto aos artefatos — o link **Somas SHA-256** no bloco de
downloads abre o arquivo. Compare com o arquivo que você baixou:

```powershell
Get-FileHash .\Zylara-Setup-<version>-windows-x64.exe -Algorithm SHA256
```

```bash
sha256sum -c SHA256SUMS.txt
```

Não instale um binário cuja soma não confere, nem um que tenha vindo de qualquer outro lugar que não
a página de releases do projeto.

## Primeira execução

Na primeira inicialização o Zylara cria a pasta de dados e abre a tela de boas-vindas. Sem credencial
configurada, o campo de mensagem mostra um banner com a ação **Abrir provedores** — esse é o estado
esperado, não um erro.

- Windows: `%APPDATA%\app.zylara.chat`
- macOS: `~/Library/Application Support/app.zylara.chat`
- Linux: `~/.local/share/app.zylara.chat`

Veja [Dados e privacidade](/docs/data-and-privacy) para saber o que fica guardado ali.

## Atualizações

O app consulta o feed de releases ao abrir e uma vez por hora. Quando há uma versão estável mais
nova, a barra de título mostra um chip com as notas da versão e o tamanho do download.

- O download é verificado com SHA-256 antes de qualquer instalação.
- Nada é instalado sozinho: o app pergunta primeiro e depois abre o instalador da plataforma.
- Instalações gerenciadas (Linux x64 e macOS arm64) recebem **Instalar e reiniciar**; o app substitui
  o próprio payload e reabre.
- A verificação manual fica em Configurações → Sobre → Atualizações.

## Desinstalar

| Plataforma | Como |
| --- | --- |
| Windows | **Configurações → Aplicativos → Aplicativos instalados → Zylara → Desinstalar**, ou execute `Uninstall Zylara.exe` da pasta de instalação. Silencioso: `Uninstall Zylara.exe --silent`. |
| macOS | Arraste o `Zylara.app` para a Lixeira; remova a pasta de dados manualmente para apagar tudo. |
| Linux | Remova o pacote (`apt remove zylara` / `dnf remove zylara`) ou apague o AppImage e a entrada `.desktop`. |

Por padrão o desinstalador **mantém seus dados** (conversas, anexos, artefatos, configurações e
chaves de API). O desinstalador do Windows oferece **Remover também meus dados**; a flag `--purge`
faz o mesmo em silêncio. Essa etapa não pode ser desfeita.

Próximo: [Primeiros passos](/docs/first-steps).
