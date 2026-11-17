---
title: Busca na web e fontes
description: Deixe o agente buscar na web, ler páginas e citar cada fonte que usou.
---

Com a busca na web ativada, o agente pode consultar coisas novas em vez de depender dos dados de
treinamento, e cada página que ele usa entra na lista de fontes.

## Como ativar

- O botão do globo no campo de mensagem liga a **Busca na web** para a conversa.
- **Configurações → Ferramentas → Ferramentas do agente → Busca na web** define o padrão.
- A paleta de comandos tem **Ativar busca na web** / **Desativar busca na web**.

Com o botão desligado, a ferramenta nem é oferecida ao modelo, então ele não pesquisa por engano.

## O que acontece em um turno

1. O modelo decide que precisa de uma consulta e chama `web_search` com a consulta e uma
   contagem opcional de resultados (1–8, padrão 8).
2. O app consulta um mecanismo de busca e devolve títulos, URLs e trechos.
3. Se um resultado parecer relevante, o modelo chama `fetch_url` para ler a página, que é
   baixada, reduzida a texto legível e truncada para caber no contexto.
4. A resposta cita as URLs que usou.

As buscas vão para o Bing (endpoint RSS, com Bing HTML e DuckDuckGo como alternativas) — não vão
para o provedor do modelo. Isso significa que a consulta sai da sua máquina rumo a um mecanismo
de busca mesmo quando o modelo em si roda em outro lugar. Deixe a busca na web desligada nas
consultas que você não quer enviar a um mecanismo de busca.

## Citações

- Chips de citação aparecem abaixo da resposta, com uma contagem ("N fontes") e uma ação para
  abrir a lista completa no painel lateral.
- O painel **Fontes** lista cada página com título, domínio e link; os links abrem no seu
  navegador padrão.
- Uma citação é anexada só às páginas que o agente realmente leu, não a todo resultado de busca.

## Para que serve bem

- Notícias recentes, releases, preços, versões de documentação e qualquer coisa posterior ao
  corte de conhecimento do modelo.
- Conferir uma afirmação contra uma fonte primária.
- Ler uma URL específica que você fornece.

## Limites e comportamento

- Os resultados são limitados a oito por chamada; os trechos são curtos, então o modelo precisa
  buscar a página para lê-la inteira.
- Algumas páginas bloqueiam requisições automáticas ou só devolvem conteúdo em JavaScript; o
  agente relata a falha em vez de inventar conteúdo.
- O conteúdo da página é tratado como **dado não confiável**: o agente é instruído a não seguir
  instruções encontradas em uma página e a tratá-las como conteúdo a resumir.
- A qualidade da busca depende do idioma da consulta; a ferramenta pede ao modelo que pesquise
  no idioma da sua pergunta.

## Privacidade

As consultas de busca e as URLs abertas saem da sua máquina. Se você precisa de um turno
totalmente local, desative a busca na web no campo de mensagem e em
**Configurações → Ferramentas**. O que mais sai da máquina está em
[Dados e privacidade](/docs/data-and-privacy#o-que-sai-da-maquina).

Próximo: [Interface generativa](/docs/generative-ui).
