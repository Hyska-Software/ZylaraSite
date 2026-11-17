---
title: Interface generativa
description: O agente pode responder com cards, tabelas, gráficos, linhas do tempo e pequenos formulários em vez de texto puro.
---

Às vezes a melhor resposta não é um parágrafo. O Zylara deixa o modelo emitir um bloco
declarativo que o app desenha com componentes nativos: uma tabela de comparação, um gráfico, uma
lista de verificação, uma linha do tempo, um conjunto de cards — ou um pequeno formulário que
preenche o campo de mensagem para você.

## Como funciona

O modelo escreve um bloco cercado com a tag `ui` contendo JSON. O app valida esse JSON contra um
contrato fixo (`data/genui-contract.json`) e desenha apenas componentes da lista branca. Não há
HTML, CSS ou JavaScript no bloco, e nada é executado.

Se o JSON for inválido, o bloco aparece como código em vez de quebrar a mensagem. O mesmo
contrato é aplicado no backend e na interface, e os dois são testados com os mesmos fixtures,
então um bloco que renderiza em um lugar renderiza no outro.

## O que pode ser renderizado

| Família | Componentes |
| --- | --- |
| Layout | **card**, **stack**, **grid**, **tabs**, **reveal**, **section**, **divider** |
| Dados | **table**, **chart** (barras, linhas, pizza), **stat**, **progress**, **timeline**, **steps**, **checklist**, **keyvalue**, **list** |
| Conteúdo | **code**, **quote**, **text**, **badge**, **image**, **source**, **link** |
| Interação | **actions**, **choices** |

Resultados típicos: uma comparação de planos como tabela, uma série mensal como gráfico de
barras, uma migração como passos numerados, um incidente como linha do tempo, uma decisão como
cards com uma ação **Comparar cenários**.

## A interação é declarativa

Dois componentes reagem a cliques, e nenhum envia nada sozinho:

- **choices** — opções de rádio, caixa de seleção ou segmentadas, com um botão de envio. Enviar
  preenche o campo de mensagem com a sua seleção (prefixada por uma frase escolhida pelo agente);
  você revisa e envia.
- **actions** — até quatro próximos passos sugeridos. Uma ação `prompt` preenche o campo de
  mensagem; uma ação `copy` copia o texto para a área de transferência.

Não existem campos de texto livre dentro de um bloco renderizado: o campo de mensagem continua
sendo o único lugar onde você digita. Isso é de propósito — mantém a transcrição legível e evita
um segundo caminho de entrada, escondido.

## Limites

| Limite | Valor |
| --- | --- |
| Componentes por bloco | 120 |
| Profundidade de aninhamento | 8 níveis |
| Props por componente | 24 |
| Itens de array (linhas de tabela, itens de lista) | 200 |
| Tamanho de texto por prop | 4.000 caracteres |
| Tamanho da fonte por bloco | 200.000 caracteres |
| Blocos por resposta | 2 |

As regras de design também são aplicadas: no máximo quatro cards, gráficos precisam de título e
de ao menos dois pontos, tabelas têm no máximo dez colunas, e uma grade precisa ser preenchida
pelos filhos.

## Quando você vai ver isso

Quem decide é o agente. Ele tende a usar um bloco quando você pede uma comparação, um painel, um
plano, uma lista de verificação ou um conjunto de opções — ou quando uma tabela fica mais clara
que a prosa. Peça diretamente se quiser um:

> Compare os três planos em uma tabela, com uma coluna para o que muda em cada nível.

Os blocos aparecem no Chat, no Código e nas transcrições de agentes. Eles fazem parte da
mensagem, então são guardados e exportados junto com ela.

## Segurança

- Só os componentes e props documentados são renderizados; os desconhecidos são ignorados.
- Sem `eval`, sem script inline, sem URLs arbitrárias: imagens e links precisam ser `http(s)`.
- O bloco não pode chamar ferramentas, mudar configurações nem iniciar um turno.
- O conteúdo dentro de um bloco é saída do modelo, então trate como qualquer outra resposta.

Próximo: [Markdown e matemática](/docs/markdown-and-math).
