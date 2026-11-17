---
title: Interface
description: Onde fica cada controle: barra de título, barra lateral, campo de mensagem, transcrição, painéis e a paleta de comandos.
---

O Zylara tem uma janela só: barra de título, barra lateral, uma coluna central (transcrição mais
campo de mensagem) e um painel direito opcional. Os três layouts reaproveitam essa moldura e mudam a
barra lateral e as ferramentas disponíveis.

## Barra de título

| Elemento | O que faz |
| --- | --- |
| Marca | Volta para o início do layout |
| **Alternar barra lateral** | Mostra ou oculta a barra lateral (`Ctrl/⌘ B`) |
| Pílula **Chat · Código · Agentes** | Troca de layout. Clique com o botão direito para ocultar layouts que você não usa. Fica oculta quando só um layout está ativado. |
| Chip do **plano ChatGPT** | Aparece quando você entrou com o ChatGPT; abre o uso do plano |
| Chip de atualização | Aparece quando existe uma versão estável mais nova |
| Controles da janela | Minimizar, maximizar, fechar |

## Barra lateral (layout Chat)

De cima para baixo:

1. **Nova conversa** — inicia uma conversa vazia (`Ctrl/⌘ N`).
2. **Biblioteca** — todo arquivo de todas as conversas, mais os arquivos que você envia.
3. **Plugins** — plugins instalados, descobríveis e atualizáveis.
4. **Habilidades** — ativa, desativa e inspeciona habilidades (oculto quando **Painel de
   habilidades na barra lateral** está desligado em **Configurações → Ferramentas**).
5. **Buscar conversas** — abre a paleta de comandos (`Ctrl/⌘ K`).
6. Histórico de conversas, agrupado como **Fixadas**, **Hoje**, **Ontem**, **Últimos 7 dias**,
   **Últimos 30 dias** e **Mais antigas**. As linhas podem ser reordenadas com `Alt+↑` / `Alt+↓`.
7. **Configurações** no rodapé, com a versão do app.

Cada linha de conversa tem um menu `⋯`: **Fixar/Desfixar**, **Renomear**, **Exportar** (Markdown),
**Usar no Código** / **Remover do Código**, **Excluir**.

## Campo de mensagem

O campo flutuante na parte de baixo da coluna central.

| Controle | Função |
| --- | --- |
| **+** | Anexa arquivos (documentos, imagens ou todos os arquivos) |
| Botão do globo | **Busca na web** para esta mensagem |
| Botão de ferramentas | **Criar arquivos** (artefatos) |
| Pílula do modelo | Abre **Selecionar modelo** |
| ✦ | Modo de raciocínio (esforço ou orçamento) |
| Enviar / ⚡ / ↑ | Envia, **Enviar agora** (interrompe) e **Enfileirar mensagem** durante o streaming |
| ■ | **Parar resposta** |
| Chip de permissão | Só em Código e Agentes — veja [Permissões e aprovações](/docs/permissions-and-approvals) |
| Chip de plano | Só em Código e Agentes — plano e progresso das tarefas |

Abaixo do campo: "O Zylara pode cometer erros. Verifique informações importantes."

Digite `/` para comandos de barra (plugins, `/creator` e os comandos de Código `/plan`, `/compact`,
`/commit`, `/test`, `/review` e outros) e `@` para referenciar um arquivo — `@` exige um workspace,
então aparece no layout Código e em threads de agente com uma pasta.

## Transcrição

Cada resposta pode conter, nesta ordem:

- um **bloco de raciocínio** (recolhido por padrão se você ativou **Raciocínio recolhido por
  padrão**), listando o raciocínio e cada chamada de ferramenta com o status e a saída expansível;
- a resposta em Markdown, com tabelas, matemática, diagramas e código;
- **chips de citação** quando o agente buscou na web;
- **cards de artefato** para arquivos gerados;
- um rodapé com **Copiar resposta**, **Regenerar resposta**, **Útil** / **Não foi útil**, o nome do
  modelo e, quando ativado, tokens e duração.

Suas próprias mensagens têm **Copiar mensagem** e **Editar mensagem** (a edição oferece **Salvar e
reenviar**). Durante o streaming, um botão **Ir para o fim da conversa** aparece se você rolar para
cima.

## Painel direito

O mesmo dock abriga dois painéis:

- **Artefatos** — lista de arquivos com pré-visualização por formato, **Salvar como…**, **Abrir no
  app padrão**, **Excluir** e navegação anterior/seguinte. Veja [Artefatos](/docs/artifacts).
- **Fontes** — cada página que o agente leu, com título, domínio e link. Pode flutuar sobre o chat
  ou ancorar ao lado dele, e é redimensionável.

Nos layouts Código e Agentes esse dock também mostra o painel Arquivos/Alterações/Terminal — veja
[Workbench](/docs/code-workbench).

## Paleta de comandos

`Ctrl/⌘ K` abre a paleta de qualquer lugar. Comece com `>` para buscar comandos ou `#` para buscar
conversas; sem prefixo, ela busca nos dois.

Os comandos são agrupados como **Conversas**, **Navegação**, **Ferramentas**, **Plugins**,
**Aparência**, **Configurações** e **Sistema**, e incluem: nova conversa, fixar conversa, exportar,
copiar a última resposta, parar resposta, regenerar, trocar de layout, focar o campo de mensagem,
alternar a barra lateral, abrir artefatos ou fontes, abrir a Biblioteca, gerenciar habilidades,
trocar de modelo, alternar busca na web, criação de arquivos ou execução de código, alternar tema,
abrir configurações, abrir a pasta de dados, recarregar o catálogo de modelos e instalar um plugin a
partir de um arquivo.

`↑`/`↓` navegam, `Enter` executa, `Ctrl/⌘ Enter` executa a ação secundária (fixar/desfixar) e `Esc`
limpa a busca e depois fecha.

## Estado vazio

Uma conversa nova mostra **"Como posso ajudar?"** com quatro cards de sugestão — **Analisar um
documento**, **Buscar na web**, **Criar um arquivo**, **Explicar código** — e dicas de atalho para
comandos, barra lateral e envio.

## Aonde ir agora

- [Conversas](/docs/conversations) — histórico, edição, fila.
- [Atalhos de teclado](/docs/keyboard-shortcuts) — a lista completa.
- [Personalização](/docs/customization) — tema, tamanho do texto, layouts, idioma.
