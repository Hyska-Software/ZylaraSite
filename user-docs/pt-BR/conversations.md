---
title: Conversas
description: Gerencie o histórico do chat, busque, fixe, exporte, edite mensagens, enfileire respostas e vincule um chat ao layout Código.
---

Todo chat é uma conversa guardada localmente. O título é gerado a partir da primeira mensagem e
atualizado conforme a conversa evolui; você pode renomeá-la a qualquer momento.

## Histórico

A barra lateral agrupa as conversas por recência: **Fixadas**, **Hoje**, **Ontem**, **Últimos 7
dias**, **Últimos 30 dias**, **Mais antigas**. Fixe as que você reabre com frequência — conversas
fixadas ignoram os grupos de data e ficam no topo. Arraste as linhas (ou pressione `Alt+↑` /
`Alt+↓`) para ordená-las dentro de um grupo.

## Encontrar uma conversa

- `Ctrl/⌘ K`, depois `#` para buscar conversas por título e conteúdo.
- A linha **Buscar conversas** na barra lateral abre a mesma paleta.
- Buscar pela paleta também casa com comandos, então você pode pular de um chat para
  **Abrir painel de artefatos** ou **Trocar de modelo** em uma tecla.

## Renomear, exportar, excluir

Abra o menu `⋯` de uma linha de conversa:

| Ação | Resultado |
| --- | --- |
| **Fixar / Desfixar** | Mantém a conversa no topo da barra lateral |
| **Renomear** | Define um título próprio |
| **Exportar** | Grava a conversa como Markdown em um arquivo que você escolher |
| **Usar no Código / Remover do Código** | Vincula o chat ao layout Código, ou desfaz o vínculo |
| **Excluir** | Remove a conversa depois da confirmação |

Excluir uma conversa remove as mensagens e os artefatos que pertencem a ela. Arquivos que você já
salvou em outro lugar do disco não são afetados. Para apagar tudo de uma vez, use
**Configurações → Dados → Limpar dados…** — veja [Dados e privacidade](/docs/data-and-privacy).

## Ações de mensagem

| Onde | Ação |
| --- | --- |
| Mensagem do assistente | **Copiar resposta**, **Regenerar resposta**, **Resposta útil**, **Não foi útil** |
| Sua mensagem | **Copiar mensagem**, **Editar mensagem** → **Salvar e reenviar** (`Ctrl/⌘ Enter`) ou Cancelar (`Esc`) |
| Bloco de raciocínio | Expanda uma chamada de ferramenta para ler a **Saída** e **Copiar saída** |
| Card de artefato | Abra a pré-visualização, **Salvar como…**, **Abrir no app padrão** |

Editar uma mensagem corta tudo o que vem depois dela e envia a versão editada de novo. No Chat não
existe branching; o branching existe no layout Código, onde uma sessão pode voltar a um ponto
anterior.

## Enfileirar mensagens

Enquanto uma resposta chega em streaming, o botão de enviar se divide:

- **Enviar agora** (⚡) interrompe a resposta atual e envia sua mensagem na hora.
- **Enfileirar mensagem** (↑) guarda a mensagem para rodar logo depois do turno atual.

A barra de fila acima do campo de mensagem mostra **Na fila · N** com **Retomar fila**, **Pausar
fila**, **Enviar agora**, **Limpar fila** e **Remover da fila** por item. A fila é por conversa e
sobrevive a reinícios; só um turno roda por conversa por vez.

## Sessões e layouts

As conversas pertencem ao layout que as criou:

- Uma conversa de **Chat** aparece só na barra lateral do Chat.
- Uma sessão de **Código** aparece só na barra lateral do Código e está vinculada a um workspace.
- Uma thread de **agente** pertence ao seu agente.

**Usar no Código** vincula uma conversa de Chat existente ao layout Código para que o agente de
código possa continuá-la com ferramentas de arquivo; ela continua disponível nos dois layouts e é
marcada como **Do Chat** na barra lateral do Código. **Remover do Código** desfaz o vínculo sem
excluir nada.

## Trocas de modelo dentro de uma conversa

No Chat o modelo pertence à conversa e, no Código, à sessão. Trocar de modelo insere um divisor
**Modelo alterado para …** na transcrição, para você saber qual modelo produziu cada resposta.
Respostas escritas por outro modelo são reenviadas na próxima requisição em uma forma neutra, não
como estado bruto do provedor.

## Armazenamento e retenção

As conversas ficam em `zylara.db` dentro da sua pasta de dados do app; anexos e artefatos ficam em
subpastas ao lado dela. Nada é enviado para fora. Exporte uma conversa se precisar de uma cópia
portátil, ou copie a pasta inteira com o app fechado para fazer backup de tudo — veja
[Dados e privacidade](/docs/data-and-privacy#backup-e-restauracao).

Próximo: [Modelos e provedores](/docs/models-and-providers).
