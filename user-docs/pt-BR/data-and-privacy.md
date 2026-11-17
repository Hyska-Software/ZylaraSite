---
title: Dados e privacidade
description: Onde ficam seus dados, o que sai da máquina, como fazer backup e como apagar tudo.
---

O Zylara é local-first. Conversas, anexos, arquivos gerados, habilidades, configurações e
credenciais ficam em uma pasta no seu computador, e não existe conta Zylara, analytics nem
telemetria própria.

## Onde os dados ficam

| Plataforma | Pasta |
| --- | --- |
| Windows | `%APPDATA%\app.zylara.chat` (o cache também fica em `%LOCALAPPDATA%\app.zylara.chat`) |
| macOS | `~/Library/Application Support/app.zylara.chat` |
| Linux | `~/.local/share/app.zylara.chat` |

Abra por **Configurações → Dados → Abrir pasta** ou com **Abrir pasta de dados** na paleta de
comandos.

| Caminho | Conteúdo |
| --- | --- |
| `zylara.db` | Conversas, mensagens, metadados de artefatos, agentes, memórias, rotinas, canais, uso e registros de plugins (SQLite) |
| `settings.json` | Preferências |
| `secrets.json` (+ `secrets.bak`) | Chaves de API e a sessão do ChatGPT |
| `attachments/` | Arquivos que você enviou |
| `artifacts/<id>/` | Arquivos que o agente criou |
| `skills/`, `skills-bundled/` | Suas habilidades e as cópias incluídas |
| `code-runs/<id>/` | Workspaces temporários da execução de código (removidos depois de cada execução) |
| `themes/` | Pacotes de tema instalados |
| `plugins/<id>/<version>/` | Arquivos de plugins instalados |
| `agent-workspaces/` | Pastas internas para agentes sem pasta de projeto |
| `updates/`, `managed-install.json` | Cache de downloads e marcador de instalação gerenciada |

## Credenciais

As chaves são gravadas em `secrets.json` pelo backend e nunca enviadas à interface: o renderer
recebe identificadores mascarados, e-mail e expiração, não tokens. Um arquivo corrompido é
recuperado a partir de `secrets.bak`. Segredos de plugins usam o namespace `plugin:<id>:<key>`, e
um plugin só consegue saber se um segredo existe, nunca lê-lo.

O ambiente também é lido (por exemplo `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENCODE_API_KEY`) e
um login existente da CLI do OpenCode é reaproveitado, mas esses valores são lidos apenas em
memória.

## O que sai da máquina

| Destino | Quando |
| --- | --- |
| A API do provedor que você escolheu | A cada turno, com a sua credencial |
| Bing ou DuckDuckGo | Só quando o agente busca na web |
| As páginas que o agente abre | Só quando o agente lê uma URL |
| Releases do GitHub (`release.json`, API de releases) | Na inicialização e a cada hora, para procurar atualizações |
| Registros de plugins e URLs de pacotes | Quando você instala ou atualiza um plugin |
| GHCR (registro de contêineres) | Quando você baixa a imagem de uso do computador |
| Bootstrapper do Microsoft WebView2 | Só numa instalação no Windows sem WebView2 |

Não existe relay do Zylara: as requisições vão direto da sua máquina para o destino acima. O
catálogo de modelos é montado a partir do models.dev no build e vem dentro do app, então o seletor
funciona offline.

## Backup e restauração

Feche o Zylara e copie a pasta de dados inteira. Essa única cópia contém conversas, anexos,
artefatos, habilidades, configurações e chaves.

Para restaurar, feche o app, coloque a pasta de volta no lugar e inicie o Zylara. Mantenha a versão
do app junto do backup: um banco escrito por uma versão mais nova pode não abrir em uma mais antiga.

Também existem duas exportações portáteis:

- **Exportar** em uma conversa grava um arquivo Markdown.
- **Exportar** em um agente grava um JSON `zylara-agent` com a configuração e as memórias.

Artefatos e anexos não entram nessas exportações — salve-os com **Salvar como…** ou copie a pasta de
dados.

## Apagar

| Escopo | Como |
| --- | --- |
| Uma conversa | Menu `⋯` → **Excluir** |
| Um arquivo | Biblioteca ou painel de artefatos → **Excluir** |
| Tudo no app | **Configurações → Dados → Zona de perigo → Limpar dados…** (duas confirmações) |
| Arquivos do app no Windows | `Uninstall Zylara.exe`; acrescente **Remover também meus dados** ou `--purge` para apagar a pasta de dados também |
| Arquivos do app no macOS/Linux | Remova o app/pacote e depois apague a pasta de dados à mão |

Desinstalar **mantém** conversas, anexos, artefatos, configurações e chaves de API a menos que você
escolha removê-los. O **Limpar dados…** dentro do app apaga esses itens e volta as configurações aos
padrões; não dá para desfazer.

## Logs

Não existe log geral da aplicação. O diagnóstico fica em lugares específicos:

- log do instalador: `%TEMP%\Zylara-Setup-<date>.log` no Windows;
- log da atualização gerenciada: `install.log` na pasta de dados;
- atividade de plugins: o log e as tabelas de auditoria dentro de `zylara.db`;
- diagnóstico de cache: **Diagnóstico de cache** na paleta de comandos.

Ao relatar um problema, informe a versão (**Configurações → Sobre**), o provedor e o modelo, e a
mensagem exata que o app mostrou. Não cole chaves.

Próximo: [Solução de problemas](/docs/troubleshooting).
