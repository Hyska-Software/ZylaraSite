---
title: Referência de configurações
description: Cada aba de configurações, controle, padrão e faixa de valores em um só lugar.
---

Abra as configurações com `Ctrl/⌘ ,`, pela engrenagem da barra lateral ou com **Abrir
configurações** na paleta de comandos. As abas seguem sempre esta ordem: Geral, Temas, Design,
Terminal, Provedores, Modelo padrão, Instruções, Ferramentas, Plugins, Agentes, Dados, Sobre.
Plugins podem acrescentar as próprias abas no fim.

## Geral

| Controle | Valores |
| --- | --- |
| **Tema** | **Claro**, **Escuro**, **Sistema** |
| **Idioma** | Inglês (padrão), Português (Brasil), Espanhol |
| **Tamanho do texto** | 90%–115%, em passos de 5% |
| **Layouts** | Mostra ou esconde **Chat**, **Código**, **Agentes** |
| **Enviar com** | `Enter` ou `Ctrl/⌘ Enter`; `Shift+Enter` é sempre uma nova linha |
| **Reduzir movimento** | Desativa transições e animações |
| **Mostrar uso de tokens** | Tokens e duração abaixo de cada resposta |
| **Raciocínio recolhido por padrão** | Blocos de raciocínio começam fechados |
| **Limite de auto-compactação** | 50%–90%, padrão 85% |
| **Continuar rodando na bandeja do sistema** | Fechar a janela mantém turnos e agendamentos vivos |

## Temas

Modo de aparência, a lista de temas instalados (o embutido **Zylara** mais os incluídos **aurora**,
**ember**, **grove**, **nebula**, **nocturne**), **Instalar tema…**, **Recarregar temas**, **Abrir
pasta de temas** e, por tema, **Usar** / **Ativo** / **Remover**. Veja
[Personalização](/docs/customization#temas).

## Design

Interface contribuída por plugins: abas de layout (**Chat**, **Código**, **Agentes**), **Presets**,
**Variantes de componente**, **Desativar interface de plugins** / **Ativar interface de plugins**,
**Redefinir este layout**, **Redefinir toda a interface de plugins**, além de **Conflitos** e
**Modificações ativas**.

## Terminal

| Controle | Padrão |
| --- | --- |
| Família da fonte | JetBrains Mono Variable |
| Tamanho da fonte | Segue o tema |

## Provedores

Os provedores em destaque (OpenCode Go, OpenCode Zen, OpenAI, Anthropic, Gemini), **Ver mais
provedores** para os outros 21, **Conectar** / **Gerenciar** por provedor, o campo de chave de API,
**Testar conexão**, **Atualizar modelos**, **Console** (painel do provedor), **Abrir pasta de
dados**.

**OpenAI** mostra ainda **Continuar com ChatGPT**, **Copiar link**, **Sair**, **Usar chave de API
como alternativa** e o uso do plano quando conectado.

**Adicionar provedor** registra um endpoint compatível com OpenAI; `http://` só é aceito para
localhost.

**Confiabilidade** por provedor:

| Controle | Padrão |
| --- | --- |
| **Timeout dos cabeçalhos da resposta (s)** | 120 |
| **Timeout do primeiro token (s)** | 180 |
| **Timeout de inatividade do stream (s)** | 120 |
| **Timeout total do stream (s)** | 1800 (30 min) |
| **Novas tentativas por etapa** | Padrão do provedor |
| **Backoff base (ms)** / **Backoff máximo (ms)** | Padrão do provedor |
| **Orçamento de retentativas (ms)** | Padrão do provedor |
| **Retry-After máximo (ms)** | Padrão do provedor |

`0` desativa um timeout ou o orçamento de retentativas. Veja
[Modelos e provedores](/docs/models-and-providers#timeouts-e-novas-tentativas).

## Modelo padrão

Provedor, modelo e raciocínio padrão para conversas novas. O modelo sempre pode ser trocado no campo
de mensagem; esta aba define só o ponto de partida.

## Instruções

Uma instrução de sistema em texto livre aplicada às suas conversas, com contador de caracteres e
salvamento automático. Ela vai como parte do prompt do sistema, então alterá-la invalida o cache de
prompt das conversas existentes.

## Ferramentas

### Ferramentas do agente

| Interruptor | Efeito |
| --- | --- |
| **Busca na web** | Oferece a ferramenta de busca ao modelo |
| **Criar arquivos** | Oferece a criação de artefatos |
| **Enviar anexos ao modelo** | Inclui o conteúdo dos anexos nas requisições |
| **Gerar título automático** | Nomeia conversas a partir da primeira mensagem |

### Cache de prompt

| Controle | Valores |
| --- | --- |
| **Mostrar indicador** | Mostra o chip de cache no Chat e o medidor de contexto do Código |
| **TTL do cache (Anthropic)** | 1 hora (padrão) ou 5 minutos |
| **Retenção do cache (OpenAI)** | Automática, Em memória, 24 horas |

### Execução de código

**Permitir execução de código** (desligado por padrão) e **Timeout de execução** (10–600 s, padrão
120). Veja [Execução de código](/docs/code-execution).

### Sandbox de comandos

**Ambiente** (**Este computador** ou **Docker**), **Imagem do Docker** (padrão `node:22-bookworm`),
**Rede no contêiner**, **Memória (MB)**, **CPUs**, **PIDs**, **Rootfs somente leitura**, **Validar
imagem**, **Baixar imagem**. Veja
[Permissões e aprovações](/docs/permissions-and-approvals#sandbox-de-comandos-do-docker).

### Sessões de código

| Controle | Valores |
| --- | --- |
| **Modo de permissão padrão** | **Somente leitura**, **Revisão**, **Edição**, **Autônomo** |
| **Abrir diff do arquivo** | **Em uma aba do chat (padrão)** ou **No painel lateral** |

### Ambiente de código

Detecção de Python e Node (caminho configurado ou `PATH`), versões, **Verificar de novo**, a lista de
pacotes opcionais (`python-docx`, `openpyxl`, `python-pptx`, `reportlab`, `Pillow`) e **Copiar comando
de instalação**.

### Habilidades

**Painel de habilidades na barra lateral**, contagens por origem, **Gerenciar habilidades**, **Abrir
pasta de habilidades**. Veja [Habilidades](/docs/skills).

## Plugins

**Ativar plugins**, **Atualizações automáticas**, **Permitir plugins confiáveis**, **Modo
desenvolvedor**, **Modo seguro**, **URLs de registro**, **Desativar todos os plugins**. Veja
[Plugins](/docs/plugins).

## Agentes

| Seção | Controles |
| --- | --- |
| **Execução e fila** | Turnos concorrentes globais, turnos por agente (padrão 1), mensagens na fila por thread |
| **Orçamento** | Limite diário por agente, em US$ |
| **Notificações** | Ativadas, **Não perturbe**, **Aprovações**, **Perguntas**, **Conclusões**, **Tarefas** |
| **Navegador controlado** | Hosts permitidos, hosts bloqueados, hosts privados, navegador nas rotinas |
| **Apps de desktop** | Aplicativos permitidos e bloqueados para o uso do computador |
| **Desktop privado** | Imagem, estado do contêiner, ações por turno (20), ações por hora (120), limpeza, diagnóstico |

Veja [Agentes](/docs/agents) e [Uso do computador](/docs/computer-use).

## Dados

| Seção | Conteúdo |
| --- | --- |
| **Armazenamento** | O caminho da pasta de dados e **Abrir pasta** |
| **Zona de perigo** | **Limpar dados…** com duas confirmações: apaga conversas, anexos, artefatos, configurações e chaves de API |

Veja [Dados e privacidade](/docs/data-and-privacy#apagar).

## Sobre

Versão, stack, tamanho do catálogo e uso de armazenamento; **Atualizações** com **Atualizações
automáticas**, **Verificar agora**, **Pular esta versão** e **Ver no GitHub**; links para o OpenCode,
o Console do OpenCode, o ChatGPT, o uso do plano ChatGPT e o repositório.

Próximo: [Atalhos de teclado](/docs/keyboard-shortcuts).
