---
title: Workspaces e sessões
description: Abra uma pasta, decida se confia nela e rode sessões de código com modelo e modo de permissão próprios.
---

O layout Código liga uma conversa a uma pasta no seu disco. O agente então pode ler e editar
arquivos, rodar comandos, manter um plano e produzir um diff que você revisa antes de commitar.

## Comece com uma pasta

Na primeira vez que você muda para **Código**, a coluna central mostra **Comece com uma pasta**:
*"Abra uma pasta para o agente poder ler, editar e rodar comandos aqui."*

- **Abrir pasta…** abre o seletor nativo de pastas.
- **Workspaces recentes** lista pastas que você usou antes.
- Sem pasta, não há nada a fazer neste layout: Código não é um chat que por acaso tem acesso a
  arquivos.

Repositórios Git e pastas comuns funcionam. Em uma pasta comum o painel de Alterações continua
funcionando — ele é montado a partir do diário do agente —, mas a aba **Commits** mostra **Não é um
repositório Git**.

## Confiança

Antes do primeiro turno em uma pasta, o Zylara pergunta **Confiar nesta pasta?**:

| Escolha | Efeito |
| --- | --- |
| **Confiar** | O agente pode ler, editar e rodar comandos na pasta. `AGENTS.md`/`CLAUDE.md` e habilidades locais entram como instruções do projeto. |
| **Abrir somente leitura** | O agente só pode ler. Sem edições, sem comandos, e as instruções do projeto não são carregadas. |
| **Cancelar** | Não abre o workspace |

Um workspace não confiável mantém um selo **Somente leitura** no cabeçalho, e as ferramentas de
shell continuam indisponíveis. Você pode revogar a confiança depois pelo menu do workspace.

A confiança importa porque uma pasta pode conter instruções: `AGENTS.md`, `CLAUDE.md` e arquivos
de habilidade são lidos como orientação para o agente. Só confie em pastas nas quais você deixaria
um colega rodar comandos.

## Sessões

A barra lateral de Código lista **Workspaces** e as sessões deles:

| Controle | Para que serve |
| --- | --- |
| **Nova sessão** | Inicia uma conversa nova no workspace selecionado (`Ctrl/⌘ Shift+A`) |
| **Abrir pasta** | Adiciona outro workspace |
| **Adicionar sessão do Chat** | Liga uma conversa existente do Chat ao Código |
| **Buscar** | Filtra workspaces e sessões |
| **Plugins**, **Habilidades** | As mesmas páginas do Chat |
| Filtros | **Todos**, **Com git**, **Sem git**, **Não confiáveis**, **Com sessões**, **Sem sessões** |
| **Sem workspace** | Sessões que perderam a pasta |

Cada sessão carrega o **próprio modelo** e o **próprio modo de permissão**, e os dois podem mudar
entre turnos. Trocar o modelo insere um divisor na transcrição, então respostas antigas preservam
sua origem.

### Ligando uma conversa do Chat

**Adicionar sessão do Chat** abre um diálogo: *"Escolha uma conversa do Chat para trabalhar nela
também no Código. Ela continua disponível nos dois layouts."* Sessões ligadas ganham a marca
**Do Chat** na barra lateral do Código, e **Remover do Código** (no menu da conversa do Chat)
desfaz a ligação sem excluir nada.

## O que o agente pode fazer em uma sessão

- Ler arquivos (paginados, com números de linha), listar pastas, buscar por nome ou conteúdo.
- Criar arquivos e substituir trechos exatos, depois de ler o arquivo primeiro.
- Rodar comandos, rodar o comando de teste/lint detectado do projeto e gerenciar jobs em segundo
  plano.
- Ler status, diff e log do Git.
- Manter uma lista de tarefas e, no modo de planejamento, propor um plano.
- Delegar a subagentes.

Ele não pode preparar, commitar, enviar, buscar nem puxar: essas são as suas ações na workbench — veja
[Workbench](/docs/code-workbench).

## Menu do workspace

| Ação | Resultado |
| --- | --- |
| **Abrir terminal** | Shell no caminho do projeto, sem iniciar uma sessão |
| **Revelar no gerenciador de arquivos** | Abre a pasta no navegador de arquivos do sistema |
| **Remover do Zylara** | Esquece o workspace e a lista de sessões dele; a pasta não é excluída |
| **Revogar confiança** | Volta a pasta para somente leitura nos turnos seguintes |

## As sessões são separadas por layout

Uma sessão do Código nunca aparece na barra lateral do Chat, e uma conversa do Chat nunca aparece
no Código a menos que você a ligue. Isso é de propósito: o perfil de Código expõe ferramentas de
arquivo e de shell, e misturar os dois históricos em silêncio mudaria o que o modelo pode fazer. A
explicação completa está em [Conversas](/docs/conversations#sessoes-e-layouts).

Próximo: [Workbench](/docs/code-workbench).
