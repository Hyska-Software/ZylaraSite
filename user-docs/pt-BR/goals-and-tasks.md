---
title: Objetivos e tarefas
description: Planeje antes de agir, acompanhe tarefas, rode objetivos longos rodada por rodada e observe o contexto, os jobs e os subagentes.
---

Uma única mensagem muitas vezes não basta para uma tarefa de verdade. O Zylara acrescenta quatro
mecanismos ao turno normal: modo de planejamento, uma lista de tarefas, objetivos que continuam
entre rodadas e jobs em segundo plano.

## Modo de planejamento

Ative o chip **Planejar** no campo de mensagem, ou digite `/plan` (e `/plan off` para sair). O
agente investiga e propõe um plano em vez de editar arquivos.

O card do plano aparece na transcrição em um de três estados: **Preparando**, **Aguardando
aprovação**, **Aprovado**. Quando ele está pronto, você escolhe:

| Ação | Resultado |
| --- | --- |
| **Aprovar e executar** | O agente executa o plano |
| **Aprovar e revisar cada edição** | Executa com aprovação de escrita para cada arquivo |
| **Continuar planejando** | Devolve o plano para revisão |
| **Rodar como objetivo** | Transforma o plano em um objetivo com rodadas |

O modo de planejamento é independente do modo de permissão: ele muda o que o agente faz primeiro,
não o que ele tem permissão de fazer. Veja [Permissões e aprovações](/docs/permissions-and-approvals).

## Tarefas

Para um trabalho com várias etapas, o agente mantém uma lista de tarefas mostrada no card
**Tarefas**:

- cabeçalho **Tarefas** com *"N de M concluídas"* e *"N em andamento"*;
- estados **Pendente**, **Em andamento** e **Concluída**;
- a lista se atualiza conforme as etapas terminam, então você distingue uma tarefa travada de uma
  concluída.

O chip de plano do campo de mensagem mostra o progresso `N/M` e abre um popover com o estado do
plano, a lista de tarefas e quaisquer jobs em execução.

## Objetivos

Um objetivo é uma tarefa que roda ao longo de vários turnos, cada um uma rodada completa com as
próprias ferramentas, aprovações e artefatos.

### Iniciando um objetivo

Digite `/goal` no campo de mensagem. Ele vira um chip removível, e a próxima mensagem carrega o
pedido. O agente cria o objetivo (pela ferramenta `goal`) e o descreve na transcrição.

### Rodadas

- Um objetivo roda de **1 a 100 rodadas**; o padrão é pequeno e pode ser ampliado.
- **Continuar automaticamente** segue iniciando rodadas até o objetivo terminar, o limite ser
  atingido ou o progresso parar.
- Cada rodada é um turno normal: aprovações continuam valendo, e uma sessão em segundo plano pode
  pausar para uma delas.

### Estados

| Estado | Significado |
| --- | --- |
| **Trabalhando** | Uma rodada está rodando |
| **Automático** | Vai continuar sozinho |
| **Manual** | Espera você iniciar a próxima rodada |
| **Pausado** | Parou por um dos motivos abaixo |
| **Concluído** | Terminado e aceito |
| **Bloqueado** | Travado no mesmo impedimento |

Os motivos de pausa são explícitos: **Pausado por você**, **Pausado após um erro**, **Limite de
rodadas atingido**, **Sem progresso em 3 rodadas**, **Rodada anterior interrompida**.

### Controles

A pílula do objetivo no campo de mensagem abre um popover com **Pausar após esta rodada**,
**Retomar objetivo**, **Ampliar limite**, **Concluir objetivo** (com confirmação), **Abrir
objetivo** e **Desativar objetivo**. A aba **Objetivo** mostra a tarefa, **Rodadas**, **Tempo
total**, **Tokens**, **Custo**, **Última atividade**, **Copiar objetivo** e o **Histórico de
rodadas** com o estado de cada uma.

### Card de atenção

Quando um objetivo precisa de você, um card aparece na transcrição: **Objetivo ativo**,
**Objetivo pausado**, **Objetivo bloqueado** ou **Objetivo concluído**, com o motivo e as ações
relevantes — **Retomar objetivo**, **Ampliar limite**, **Concluir objetivo**, **Reabrir
objetivo**, **Abrir objetivo** ou **Dispensar**.

Um objetivo só é marcado como **Bloqueado** depois que o mesmo motivo se repete três vezes; o card
mostra **Bloqueio registrado (N de 3)** para você intervir antes disso.

Os objetivos rodam no processo do app. Fechar o Zylara interrompe as rodadas; nada continua na
nuvem.

## Contexto e cache

Sessões longas acabam enchendo a janela de contexto. O medidor de contexto no cabeçalho de Código
mostra **N% do contexto usado** e o detalha em **Prompt do sistema**, **Definições de ferramentas**
e **Mensagens**, junto do limite de saída.

- Perto do limite o app compacta: mensagens antigas são resumidas e a transcrição anota **Contexto
  compactado · N mensagens resumidas**.
- O limite é configurável em **Configurações → Geral → Limite de auto-compactação** (50%–90%,
  padrão 85%).
- `/compact` compacta na hora.

Ao lado, o chip de cache informa **N% de acerto** com os estados **Frio**, **Aquecendo**,
**Estável**, **Cache descartado**, **Não informado** e **Política do provedor**, além do motivo
quando um cache quebra (prompt do sistema mudou, definições de ferramentas mudaram, histórico
reescrito, contexto compactado, troca de modelo, TTL expirado). **Diagnóstico de cache** mostra os
detalhes.

## Jobs em segundo plano

Comandos demorados podem rodar como jobs. O popover **Jobs em segundo plano** os lista com o estado
**Rodando**, **Concluído**, **Falhou** ou **Interrompido**, e oferece **Ver job** e **Encerrar
job**. Os jobs sobrevivem ao turno que os iniciou e são encerrados quando o app fecha.

## Subagentes

Para pesquisa em paralelo, o agente pode delegar a subagentes. Cada um aparece como uma linha ao
vivo dentro do bloco de raciocínio, com estado, passos, modelo e texto recente, e **Abrir chat**
abre uma aba de transcrição somente leitura.

- Subagentes de investigação (explore, review, general) são somente leitura: sem edições, sem
  shell, sem perguntas, sem delegação; **24 passos / 15 minutos**.
- Subagentes worker podem editar e rodar comandos; **48 passos / 30 minutos**, e exigem que a
  sessão mãe esteja em **Autônomo** com o modo de planejamento desligado.
- A profundidade de delegação é um nível, com no máximo quatro delegações por turno.

Próximo: [Agentes](/docs/agents).
