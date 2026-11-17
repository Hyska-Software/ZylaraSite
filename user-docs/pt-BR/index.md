---
title: Visão geral
description: O Zylara é um app desktop local-first para conversar com modelos de IA, criar arquivos e rodar agentes de código na sua própria máquina.
---

O Zylara é um app desktop para trabalhar com modelos de IA no seu próprio computador. Conversas,
anexos, arquivos gerados e a memória dos agentes ficam em uma pasta de dados local; as requisições
vão direto para o provedor que você conectou.

Ele vem com três layouts que compartilham o mesmo motor:

| Layout | Para que serve | Comece aqui |
| --- | --- | --- |
| **Chat** | Fazer perguntas, analisar documentos, criar arquivos, buscar na web | [Interface](/docs/interface) |
| **Código** | Trabalhar dentro de uma pasta: ler, editar, rodar comandos, revisar diffs, commit | [Workspaces e sessões](/docs/code-workspaces) |
| **Agentes** | Personas duradouras com memória, rotinas, canais e uso do computador opcional | [Agentes](/docs/agents) |

## Três formas de começar

1. **Acabou de instalar?** Siga [Primeiros passos](/docs/first-steps): conecte um provedor, escolha
   um modelo e envie sua primeira mensagem.
2. **Quer arquivos?** Peça um relatório, uma planilha ou uma imagem e leia
   [Artefatos](/docs/artifacts) para saber como o resultado é pré-visualizado e salvo.
3. **Tem uma base de código?** Abra a pasta no layout Código e leia
   [Permissões e aprovações](/docs/permissions-and-approvals) antes de deixar o agente editar
   qualquer coisa.

## O que você pode fazer

- Converse com 464 modelos de 26 provedores, incluindo OpenCode Go e Zen, OpenAI (chave de API ou
  seu plano ChatGPT), Anthropic e Gemini. Veja [Modelos e provedores](/docs/models-and-providers).
- Envie PDF, DOCX, XLSX, PPTX, texto, código e imagens como contexto — veja
  [Anexos](/docs/attachments).
- Receba arquivos de verdade (Markdown, HTML, CSV, JSON, código, PDF, Office, imagens, áudio, vídeo,
  ZIP) com uma pré-visualização por formato — veja [Artefatos](/docs/artifacts).
- Deixe o agente rodar Python ou Node para montar esses arquivos, com adesão opcional e limites —
  veja [Execução de código](/docs/code-execution).
- Trabalhe em uma pasta real com diffs, aprovações, commits e um terminal — veja
  [Workbench](/docs/code-workbench).
- Rode objetivos longos rodada por rodada, em vez de uma mensagem por vez — veja
  [Objetivos e tarefas](/docs/goals-and-tasks).
- Mantenha agentes com memória, agendamentos e canais compartilhados — veja [Agentes](/docs/agents).
- Estenda o app com plugins assinados — veja [Plugins](/docs/plugins).

## Como esta documentação está organizada

| Seção | Páginas |
| --- | --- |
| **Comece aqui** | Visão geral, [O que é o Zylara](/docs/introduction), [Instalação](/docs/installation), [Primeiros passos](/docs/first-steps) |
| **Chat** | [Interface](/docs/interface), [Conversas](/docs/conversations), [Modelos e provedores](/docs/models-and-providers), [Anexos](/docs/attachments), [Artefatos](/docs/artifacts), [Biblioteca](/docs/library), [Busca na web e fontes](/docs/web-search), [Interface generativa](/docs/generative-ui), [Markdown e matemática](/docs/markdown-and-math) |
| **Ferramentas** | [Execução de código](/docs/code-execution), [Habilidades](/docs/skills), [Personalização](/docs/customization) |
| **Código** | [Workspaces e sessões](/docs/code-workspaces), [Workbench](/docs/code-workbench), [Permissões e aprovações](/docs/permissions-and-approvals), [Objetivos e tarefas](/docs/goals-and-tasks) |
| **Agentes** | [Agentes](/docs/agents), [Rotinas e filas](/docs/routines-and-queues), [Canais e equipes](/docs/channels-and-teams), [Uso do computador](/docs/computer-use) |
| **Referência** | [Plugins](/docs/plugins), [Referência de configurações](/docs/settings-reference), [Atalhos de teclado](/docs/keyboard-shortcuts), [Dados e privacidade](/docs/data-and-privacy), [Solução de problemas](/docs/troubleshooting) |

## Requisitos em resumo

- Windows 10/11, macOS 11+ (arm64) ou uma distribuição Linux capaz de rodar o pacote `.deb`, `.rpm`
  ou `.AppImage`.
- Uma credencial de provedor: uma chave do OpenCode Console, uma chave da OpenAI ou conta ChatGPT,
  uma chave da Anthropic, uma chave do Gemini ou qualquer um dos outros provedores suportados.
- Opcional: Python 3.9+ e/ou Node para [execução de código](/docs/code-execution), Docker para o
  [sandbox de comandos](/docs/permissions-and-approvals#sandbox-de-comandos-do-docker) e
  [uso do computador](/docs/computer-use).

Esta documentação descreve o Zylara **0.13.1**. Tudo o que depende da versão (instaladores,
atualizações, o catálogo de modelos) está marcado na página.
