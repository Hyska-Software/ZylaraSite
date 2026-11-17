---
title: Rotinas e filas
description: Enfileire mensagens enquanto um agente trabalha e agende instruções recorrentes que rodam com o app aberto.
---

Dois mecanismos mantêm um agente trabalhando sem você redigitar prompts: uma fila de mensagens para
a conversa atual e rotinas que rodam em um horário.

## A fila de mensagens

Enquanto um turno está chegando em streaming, o campo de mensagem pode segurar sua próxima
mensagem em vez de interromper:

- **Enfileirar mensagem** (↑) adiciona à fila; **Enviar agora** (⚡) interrompe a resposta atual e
  envia na hora.
- A barra da fila mostra **Na fila · N** com **Retomar fila**, **Pausar fila**, **Enviar agora**,
  **Limpar fila** e **Remover da fila** por item.
- As filas são FIFO e persistidas: fechar o app não as perde.
- Só um turno roda por conversa de cada vez. **Configurações → Agentes → Execução e fila** define o
  limite global de turnos, o limite por agente (padrão 1) e quantas mensagens uma thread pode
  enfileirar.

O diálogo **Atividade** lista os turnos em andamento e oferece **Parar tudo**; a barra lateral
mostra a contagem da fila e uma ação de parada para o agente.

## Rotinas

Uma rotina é uma instrução guardada que roda em um horário ou em um evento, e publica o resultado
na conversa principal do agente.

Abra **Rotinas** no rodapé da barra lateral de Agentes. A página tem as visões **Dia**, **Semana** e
**Mês**, **Hoje**, um filtro de agente (**Todos os agentes**), **Todas as rotinas** e **Nova
rotina**.

### Criando uma rotina

| Campo | Opções |
| --- | --- |
| **Agente** | Qual agente a executa |
| **Título** | Nome mostrado no calendário |
| **Instrução** | O prompt; até 8 KiB |
| **Gatilho** | **Agendada** ou **Por evento** |
| **Frequência** | **A cada intervalo** ou **Todo dia** |
| **Intervalo (min)** | 5 a 10.080 minutos (uma semana) |
| **Horário** | Hora e minuto para rotinas diárias |
| **Dias da semana** | Em quais dias ela pode rodar |
| **Ativa** | Liga ou desliga a rotina |

Cada agente pode ter até **50 rotinas**.

### Execuções

| Ação | Resultado |
| --- | --- |
| **Rodar agora** | Inicia uma execução imediatamente, sem esperar o horário |
| **Execuções** | Abre *"Execuções de *título*"* com as últimas 30 execuções e o estado de cada uma |
| **Pausar / ativar** | Para ou retoma o agendamento |
| **Editar** | Muda a instrução ou o agendamento |
| **Excluir** | Remove a rotina; a conversa principal é preservada |

A aba **Rotinas** no painel do agente mostra o **Histórico de execuções** e as últimas execuções.

### O que uma rotina pode e não pode fazer

- Rotinas rodam **apenas com o app aberto**: um agendador bate a cada 30 segundos e pula execuções
  perdidas em vez de repeti-las. Nada roda na nuvem.
- O resultado é publicado na **conversa principal** do agente, então você lê depois como qualquer
  outra resposta.
- Execuções sem supervisão **falham fechado** em aprovações: se a instrução precisa de uma permissão
  que o agente não tem, a execução para em vez de esperar por alguém que não está ali.
- As notificações seguem **Configurações → Agentes → Notificações**, incluindo **Não perturbe** e os
  interruptores por evento.

## Escolhendo entre eles

| Necessidade | Use |
| --- | --- |
| Enviar um complemento sem perder a resposta atual | Fila |
| Repetir a mesma instrução por dia ou por hora | Rotina |
| Trabalho que precisa continuar até um objetivo ser cumprido | [Objetivo](/docs/goals-and-tasks#objetivos) |
| Trabalho pontual em paralelo | Uma conversa nova ou um [subagente](/docs/goals-and-tasks#subagentes) |

Próximo: [Canais e equipes](/docs/channels-and-teams).
