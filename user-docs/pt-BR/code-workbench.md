---
title: Workbench
description: Arquivos, alterações, diffs, commits, branches, histórico e o terminal, lado a lado com o agente.
---

O layout Código coloca uma workbench ao lado da transcrição. O painel direito tem três abas —
**Arquivos**, **Alterações** e **Terminal** — e arquivos, diffs e histórico abrem como abas
centrais.

## Arquivos

A árvore lista o workspace com selos de status do Git: **Modificado**, **Adicionado**,
**Excluído**, **Renomeado**, **Copiado**, **Conflitado**, **Não rastreado** e **Ignorado**.
**Filtrar arquivos…** estreita a árvore; um contador informa *"Mostrando N de M arquivos"*.

Clicar em um arquivo abre uma aba central com números de linha e destaque de sintaxe. Arquivos
Markdown ganham alternância **Documento / Código**, e a aba oferece **Quebra de linha**,
**Recarregar arquivo** e **Abrir no editor externo**. Imagens e PDFs aparecem embutidos. Os
arquivos são somente leitura na workbench: edições passam pelo agente ou pelo seu editor.

## Alterações

O painel agrupa as alterações por estado:

| Grupo | Significado |
| --- | --- |
| **Preparado** | No índice, pronto para commitar |
| **Não preparado** | Modificado na árvore de trabalho |
| **Novo** | Arquivos não rastreados |
| **Da sessão** | Arquivos que o agente tocou nesta sessão |

Um selo marca a origem: **agent** quando a alteração veio do diário do agente, **agent + git**
quando os dois concordam. **Preparar tudo** e **Despreparar tudo** agem no grupo; cada arquivo tem
**Preparar** e **Reverter**.

O menu de filtro troca a comparação: **Último turno**, **Não commitado**, **Não preparado**,
**Preparado**, **Commit <hash>**, **Branch <name>** e **Comparar com um branch**.

Conflitos de merge mostram um aviso — *"Conflitos de merge — resolva antes de commitar"* — e
bloqueiam **Preparar tudo** até serem resolvidos.

### Diff e reversão

Abrir um arquivo alterado mostra um diff unificado ou lado a lado, com trechos recolhíveis e
**Copiar patch**. Arquivos grandes ou binários caem em um card em vez de um diff.

- **Reverter arquivo** restaura aquele arquivo ao conteúdo anterior, depois de uma confirmação.
- **Reverter turno** (rodapé do turno, **Reverter**) desfaz toda alteração de arquivo do último
  turno.
- Nenhuma das duas exclui a conversa.

Reverter é baseado no diário: alterações que o agente fez pelas próprias ferramentas podem ser
desfeitas. Arquivos reescritos por um comando de shell que o agente rodou (um formatador, um
gerador) aparecem apenas como alterações do Git, e são revertidos pelo Git, não pelo diário.

## Commit

A barra de commit fica sob o painel de Alterações:

| Campo | Opções |
| --- | --- |
| Escopo | **Tudo**, **Preparado (N)** ou **Seleção (N)** |
| Mensagem | **Mensagem do commit…**, ou **Sugerir** para uma mensagem escrita por IA |
| Ação | **Commit**, com o motivo exibido quando está desativado |

O commit fica desativado quando não há workspace aberto, quando a pasta não é um repositório,
quando não há alterações, quando nada está preparado para o escopo escolhido ou quando a mensagem
está vazia. O sucesso mostra **Commit criado (hash)**.

O agente nunca prepara, commita nem envia. A revisão é sua.

## Branches e remotes

O seletor de branch na barra do painel troca de branch e cria novas (**Trocar branch**,
**Novo branch**, **Criar e trocar**, agrupados em locais e remotos). O menu Git oferece
**Fetch**, **Pull** e **Push** como ações explícitas. Eles nunca são disparados pelo agente.

## Histórico

**Commits** abre o histórico de commits como aba central, e o painel mostra uma lista recolhível
de **Commits recentes (N)**. Selecionar um commit mostra seus arquivos e o diff; o filtro de
Alterações consegue comparar a árvore de trabalho com ele.

## Terminal

A aba **Terminal** é o seu shell, não o do agente:

- Ele começa na pasta do workspace com o shell do seu sistema.
- **Novo terminal**, **Limpar terminal**, **Encerrar processo**, **Reiniciar terminal**.
- O status mostra **Executando** ou **Encerrado (código N)**.
- Até quatro terminais, 5.000 linhas de histórico, usando o tema do app e a fonte de
  **Configurações → Terminal**.
- Fechar uma aba de terminal encerra a árvore de processos dela.

`Ctrl/⌘ Shift+T` abre um terminal como aba central. O agente usa comandos e jobs em segundo plano;
quando precisa de um processo interativo, ele te pede.

## Resumo do turno

Ao fim de um turno em um workspace, a transcrição mostra a duração, os tokens, os arquivos
alterados e um contador `+42 −7` com **Ver alterações** e **Reverter**. **Ver alterações** abre o
diff daquele turno, que é o jeito mais rápido de revisar o que o agente fez antes de commitar.

Próximo: [Permissões e aprovações](/docs/permissions-and-approvals).
