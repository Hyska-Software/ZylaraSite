---
title: Agentes
description: Crie personas com modelo, instruções, memória, workspace e permissões próprios, e acompanhe o que elas custam.
---

Um agente é uma persona que você configura uma vez e reutiliza em várias conversas: nome, papel,
modelo, instruções, memória opcional, uma pasta opcional e um modo de permissão. O layout Agentes é
onde você cria, conversa e gerencia esses agentes.

## O layout

A barra lateral é organizada em torno dos agentes:

| Área | Conteúdo |
| --- | --- |
| Cabeçalho | **Buscar agentes ou conversas**, **Atividade** (turnos em andamento), **Quadro de tarefas**, **Novo agente** |
| **Fixados** | Agentes que você mantém no topo |
| Grupos de agentes | Agentes por departamento, cada um com as threads recentes e **Ver todos (N)** |
| **Canais** | Conversas com vários agentes, com **Novo canal** |
| Rodapé | **Plugins**, **Equipe**, **Rotinas**, **Configurações** |

A casa de um agente mostra o avatar, o nome e o papel, dois chips — **Workspace · *permissão*** e
***tokens* tokens · *custo*** — e as ações **Nova conversa**, **Abrir conversa principal**,
**Editar agente** e as sugestões **Comece com**, seguidas de **Conversas recentes**.

O painel direito tem quatro abas: **Tela**, **Rotinas**, **Navegador** e **Dados**. Quando o agente
tem um workspace, o painel de Arquivos/Alterações/Terminal aparece no mesmo dock.

## Criando um agente

**Novo agente** abre o editor com seis abas:

| Aba | Campos |
| --- | --- |
| **Identidade** | **Nome**, **Papel** (padrão *Assistant*), **Departamento** (General, Research, Engineering, Quality, Content, Operations, Data, Support), **Descrição** |
| **Avatar** | Corpo, expressão, cor e formato do mascote, ou **Enviar imagem** (PNG/JPEG/GIF/WebP, até 10 MB) |
| **Modelo** | **Provedor**, **Modelo**, **Provedor de fallback**, **Modelo de fallback** ou **Nenhum** |
| **Comportamento** | **Instruções do agente**, **Sugestões para começar** (até três), **Pasta de trabalho** ou **Pasta interna do app**, **Permissões**, **Imagem Docker do agente** (opcional), **Ambiente de computador** |
| **Capacidades** | Doze interruptores mais listas de permitidos para **Ferramentas**, **Habilidades** e **Servidores MCP**, e **Memória durável** |
| **Memória** | As memórias que o agente guardou, com adicionar, fixar e excluir |

O subtítulo é explícito: *"Instruções não concedem permissões ao agente."* Um prompt pode pedir
algo; só o modo de permissão e as capacidades permitem.

Os **Templates** da página de Equipe partem de oito personas prontas: Assistant, Researcher,
Engineer, Reviewer, Writer, Operations, Analyst e Support. **Criar com IA** esboça um agente a
partir de uma descrição; o rascunho é revisado no editor antes de salvar.

## Capacidades

| Capacidade | Habilita |
| --- | --- |
| **Buscar na web** | Busca na web com citações |
| **Acesso a arquivos** | Leitura e escrita no workspace, e artefatos |
| **Rodar código** | O sandbox de código, quando a execução de código está ativa globalmente |
| **Delegar tarefas** | Delegar, transferir e publicar em canais |
| **Automações** | As rotinas do próprio agente |
| **Memória compartilhada** | Escrever memórias visíveis a outros agentes |
| **Escrever habilidades** | Criar e versionar arquivos `SKILL.md` |
| **Criar agentes** | Criar novos agentes |
| **Uso do computador** | Capturas de tela, cliques e teclado, com aprovação por ação |
| **Captura de tela** | Acesso somente leitura à tela |
| **Navegador controlado** | Um navegador isolado dirigido por CDP |
| **Substituir Docker** | Uma imagem Docker por agente |

As listas de permitidos estreitam o que o agente vê: só as ferramentas, habilidades e servidores
MCP listados são oferecidos.

## Memória

Com **Memória durável** ativa, o agente guarda fatos, preferências, procedimentos e notas entre
conversas. Ele escreve pela ferramenta `memory` (listar, salvar, atualizar, esquecer).

| Limite | Valor |
| --- | --- |
| Tamanho por memória | 4 KiB |
| Memórias por agente | 200 |
| Orçamento de contexto | 8 KiB (5 KiB privadas + 3 KiB compartilhadas) |

A memória é injetada no começo do turno como um bloco volátil, itens fixados primeiro, depois as
mais recentes. Ela nunca entra no prompt do sistema congelado, então ativá-la ou desativá-la não
invalida todo o cache de prompt. **Dados → Memória** no painel lista tudo, com as abas **Privadas**
e **Compartilhadas**; excluir tudo exige confirmação.

Desligar a memória durável mantém as notas, mas as tira do contexto.

## Workspace

Um agente pode trabalhar em uma pasta:

- **Pasta interna do app** — uma pasta privada por conversa em `<app-data>/agent-workspaces/`,
  separada das outras conversas. As ferramentas de arquivo funcionam ali, mas shell, jobs,
  planejamento e ferramentas MCP não.
- **Pasta de trabalho** — uma pasta que você escolhe. Depois de **Confiar nesta pasta? → Confiar e
  selecionar**, toda ferramenta fica confinada a ela e o conjunto completo de ferramentas de Código
  fica disponível.

Trocar a pasta é recusado enquanto um turno está rodando, e as threads existentes mantêm o
workspace com que começaram. Uma conversa também pode definir o próprio chip **Pasta**.

## Equipe e estatísticas

**Equipe** lista *"Agentes que você pode chamar a qualquer momento"* com **Criar agente**, **Criar
com IA**, **Templates**, **Estatísticas** e **Importar**. Cada card mostra a identidade, a
descrição, o número de conversas, a última atividade, tokens e custo, com **Conversar** e
**Arquivar**. Agentes arquivados ficam em uma seção separada, com **Restaurar** e excluir.

**Estatísticas** cobre **7 dias**, **30 dias**, **90 dias** ou **Tudo**, com cards de **Tokens
usados** (entrada, saída, raciocínio), **Gasto total**, **Turnos** (média de tokens por turno) e
**Modelo mais usado**, um gráfico de **Uso por dia** e uma tabela **Por modelo**. Os custos são os
valores informados pelos provedores.

## Compartilhamento e ciclo de vida

| Ação | Resultado |
| --- | --- |
| **Exportar** | Grava um JSON `zylara-agent` com a configuração e as memórias |
| **Importar** | Recria um agente a partir desse arquivo, validando versão, modelo e workspace |
| **Duplicar** | Copia a configuração, não as conversas nem as memórias |
| **Arquivar** | Mantém o histórico e bloqueia novos turnos; **Restaurar** na seção de arquivados |
| **Excluir** | Só quando o agente não tem outras conversas; excluir um agente arquivado remove a persona, a conversa principal e todas as conversas dele |

**Configurações → Agentes** acrescenta um orçamento diário por agente em US$, limites de turnos
concorrentes e de mensagens na fila por thread, e preferências de notificação (aprovações,
perguntas, conclusões, tarefas, não perturbe).

Próximo: [Rotinas e filas](/docs/routines-and-queues).
