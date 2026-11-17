---
title: Canais e equipes
description: Deixe vários agentes responderem em um canal, escolha um líder e leia o uso por agente.
---

Um canal é uma conversa compartilhada em que vários agentes podem responder à mesma mensagem. É
útil quando uma pergunta se beneficia de especialidades diferentes, ou quando você quer que um
revisor veja o que um construtor propôs.

## Criando um canal

1. Na barra lateral de Agentes, abra **Canais** e pressione **Novo canal**.
2. Dê um **Nome**.
3. Escolha os **Membros** — até **6 agentes**.
4. Opcionalmente escolha um **Líder**: **Nenhum — todos respondem** por padrão.

O cabeçalho do canal mostra os avatares dos membros, um resumo (*"N agentes · nomes"*) e um selo de
líder quando um está definido.

## Como uma mensagem é respondida

- Escreva no campo de mensagem do canal e envie. Sem líder, todo membro pode responder.
- `@nome` menciona um agente específico; sem menção a mensagem vai para todos.
- Com um líder, o líder responde primeiro e pode delegar aos outros membros.
- Cada resposta é gerada em uma thread privada e oculta daquele agente e depois publicada no canal,
  então o canal continua legível enquanto cada agente mantém o próprio contexto.

O campo de mensagem do canal aceita anexos mas não tem seletor de modelo: cada agente responde com
o modelo e as configurações de raciocínio que tem configurados.

Se alguns membros falharem, o canal informa **Alguns agentes não responderam** e mantém as respostas
que deram certo.

## Página de Equipe

**Equipe** (rodapé da barra lateral) é o elenco: *"Agentes que você pode chamar a qualquer
momento."*

| Elemento | Para que serve |
| --- | --- |
| **Criar agente**, **Criar com IA**, **Templates**, **Importar** | Adicionar agentes |
| Cards de agente | Identidade, descrição, número de conversas, última atividade, tokens e custo, **Conversar**, **Arquivar** |
| **Arquivados** | Restaurar ou excluir agentes arquivados |
| **Estatísticas** | Uso da equipe inteira |

## Estatísticas

**Estatísticas** agrega todos os agentes em **7 dias**, **30 dias**, **90 dias** ou **Tudo**:

- **Tokens usados** — entrada, saída e raciocínio;
- **Gasto total** — conforme informado pelos provedores;
- **Turnos** — com a média de tokens por turno;
- **Modelo mais usado**;
- gráfico de **Uso por dia** e tabela **Por modelo** com turnos, tokens, participação e custo.

Use para decidir qual agente ou modelo vale a pena manter e para conferir o orçamento diário definido
em **Configurações → Agentes → Orçamento**.

## Práticas que funcionam

- Dê ao líder uma instrução de coordenação ("peça o diff ao construtor e depois revise") em vez de
  uma tarefa de domínio.
- Mantenha a membresia pequena: três a seis agentes respondem mais rápido e repetem menos que um
  elenco inteiro.
- Conceda **Delegar tarefas** apenas a agentes que devem passar trabalho adiante.
- Use canais para discussão e uma thread normal para execução; a thread mantém um contexto limpo e um
  workspace.

Próximo: [Uso do computador](/docs/computer-use).
