---
title: O que é o Zylara
description: Um app desktop de IA local-first construído em Tauri e React, com três layouts e sem servidor próprio.
---

O Zylara é um cliente desktop para grandes modelos de linguagem. É uma janela nativa (Tauri 2 com
interface React) que fala direto com o provedor que você escolher. Não existe conta Zylara, servidor
de retransmissão nem upload das suas conversas.

## Local-first por padrão

| O que | Onde fica |
| --- | --- |
| Conversas e mensagens | `zylara.db` (SQLite) na sua pasta de dados do app |
| Anexos que você envia | `attachments/` na mesma pasta |
| Arquivos que o agente cria | `artifacts/` na mesma pasta |
| Chaves de API e a sessão do ChatGPT | `secrets.json` na mesma pasta, lido apenas pelo backend |
| Habilidades que você escreve | `skills/` na mesma pasta |

O renderer nunca recebe uma chave ou um token: ele recebe identificadores mascarados e metadados. Os
únicos destinos de rede são o provedor que você selecionou, o feed de atualizações e os registros de
plugins que você configurar — veja [Dados e privacidade](/docs/data-and-privacy).

## Três layouts, um motor

A pílula de layout na barra de título alterna entre **Chat**, **Código** e **Agentes**. Os três usam
o mesmo motor de conversa (streaming, ferramentas, raciocínio, artefatos), mas expõem ferramentas e
contextos diferentes.

- **Chat** é o padrão: uma lista de conversas, um campo de mensagem, anexos, busca na web, arquivos
  gerados e a Biblioteca.
- **Código** amarra uma conversa a uma pasta no disco. O agente pode ler e editar arquivos, rodar
  comandos, manter um plano e uma lista de tarefas, e o app mostra um diff para revisão. Nada é
  preparado ou commitado sem você.
- **Agentes** dá a uma persona o próprio modelo, instruções, memória, workspace, modo de permissão,
  rotinas e canais, para que ela continue trabalhando entre conversas.

As sessões são separadas por layout: uma conversa de Chat nunca aparece em Código ou Agentes, a menos
que você a adicione explicitamente ao Código. Veja
[Conversas](/docs/conversations#sessoes-e-layouts).

## Traga seu próprio provedor

O Zylara não revende acesso a modelos. Você conecta um provedor e paga direto a ele:

- **OpenCode Go** e **OpenCode Zen** (chave do OpenCode Console)
- **OpenAI** — chave de API, ou **Continuar com ChatGPT** para usar um plano ChatGPT elegível
- **Anthropic** — API oficial, pagamento por uso
- **Gemini**
- Mais 21 provedores baseados em chave (DeepSeek, xAI, Mistral, Moonshot, Z.AI, MiniMax,
  OpenRouter, Groq, Together, Fireworks, Cerebras, NVIDIA NIM, DeepInfra, SiliconFlow,
  SambaNova, Scaleway, Novita, Venice AI, Inception, StepFun, Vercel AI Gateway)

O catálogo incluído lista 26 provedores e 464 modelos com tamanho de contexto, limite de saída,
preço e suporte a visão e raciocínio. Veja [Modelos e provedores](/docs/models-and-providers).

## O que você pode fazer

| Recurso | Página |
| --- | --- |
| Analisar documentos e imagens | [Anexos](/docs/attachments) |
| Criar e pré-visualizar arquivos | [Artefatos](/docs/artifacts) |
| Rodar código para montar formatos reais | [Execução de código](/docs/code-execution) |
| Buscar na web com citações | [Busca na web e fontes](/docs/web-search) |
| Receber respostas interativas (tabelas, gráficos, formulários) | [Interface generativa](/docs/generative-ui) |
| Trabalhar em um repositório | [Workbench](/docs/code-workbench) |
| Rodar um objetivo longo | [Objetivos e tarefas](/docs/goals-and-tasks) |
| Manter assistentes com memória e agendamentos | [Agentes](/docs/agents) |
| Adicionar recursos de terceiros | [Plugins](/docs/plugins) |

## O que o Zylara não é

- **Não é um serviço de nuvem.** Não existe versão hospedada; fechar o app interrompe tudo, incluindo
  rotinas agendadas e objetivos que esperam por uma rodada.
- **Não é um sandbox por padrão.** A execução de código roda com as suas permissões de usuário. O
  sandbox de comandos do Docker é opcional e cobre ferramentas no estilo `run_command`, não
  `run_code`. Veja [Execução de código](/docs/code-execution#seguranca).
- **Não é uma IDE.** O workbench lê, gera diff, faz commit e roda um terminal, mas não substitui um
  editor em refatorações grandes.
- **Não é um modelo.** O comportamento, os limites e os preços dos modelos vêm do provedor; o app
  exibe o que o provedor informa.

## Plataformas e projeto

O Zylara roda no Windows 10/11 (WebView2), no macOS 11+ (arm64) e no Linux (`.deb`, `.rpm`,
`.AppImage`). É um projeto de código aberto sob a licença MIT, mantido sem plano comercial; essa
afirmação descreve o propósito do projeto e não restringe os direitos concedidos pela licença.

Próximo: [Instalação](/docs/installation).
