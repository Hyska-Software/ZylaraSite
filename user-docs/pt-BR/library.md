---
title: Biblioteca
description: Todos os arquivos de todas as conversas, mais os seus próprios envios, em uma página pesquisável.
---

A Biblioteca reúne todos os artefatos que o agente criou, em qualquer conversa, junto com os
arquivos que você mesmo envia ali. É o lugar para achar um relatório gerado no mês passado sem
lembrar qual conversa o produziu.

Abra pela barra lateral (**Biblioteca**) ou com **Abrir biblioteca** na paleta de comandos. A
página toma o lugar da coluna de conversa; **Voltar para a conversa** ou `Esc` retorna.

## Layout

| Controle | Opções |
| --- | --- |
| Busca | **Buscar na biblioteca** — casa nome do arquivo, tipo de arquivo e a conversa de origem |
| Ordenação | **Recentes**, **Mais antigos**, **Nome (A–Z)**, **Tamanho** |
| Visualização | **Grade** ou **Lista** |
| Filtros | **Todos**, **Favoritos**, **Imagens**, **Documentos**, **Código**, **Mídia**, **Outros**, cada um com uma contagem |
| Envio | **Enviar arquivos**, ou arraste arquivos para a página ("Solte para enviar à biblioteca") |

Os estados vazios são explícitos: **Sua biblioteca está vazia** quando não há nada,
**Nenhum artefato encontrado** quando os filtros escondem tudo, com uma ação **Limpar filtros**.

## Trabalhando com um arquivo

Cada card (ou linha da lista) oferece:

| Ação | Resultado |
| --- | --- |
| **Abrir** | Abre o diálogo de pré-visualização, com navegação **Anterior** / **Próximo** e a posição na lista |
| **Renomear** | Muda o nome exibido do arquivo |
| **Adicionar aos favoritos** / **Remover dos favoritos** | Marca o arquivo para o filtro **Favoritos** |
| **Salvar como…** | Grava uma cópia em qualquer lugar do disco |
| **Excluir** | Remove o arquivo depois da confirmação |

O diálogo de pré-visualização usa o mesmo renderizador do painel de artefatos: páginas de PDF,
HTML de DOCX, planilhas XLSX, slides PPTX, imagens com zoom, players de áudio e vídeo, Markdown,
árvores JSON, tabelas CSV, código com destaque e hexdump para binários desconhecidos — veja
[Artefatos](/docs/artifacts#pre-visualizacao-por-formato).

## Arquivos que você envia

Enviar coloca um arquivo na Biblioteca e o deixa disponível ao agente como contexto nos turnos
seguintes. É o caminho para manter um documento de referência por perto sem anexá-lo a cada
mensagem.

## Como o agente usa a Biblioteca

O agente pesquisa seus artefatos com `list_artifacts` — casando nome, título da conversa e texto
extraído, ignorando acentos — e lê qualquer resultado com `read_artifact`. Os resultados mostram
qual conversa gerou cada arquivo. Ler um arquivo traz o conteúdo para o contexto atual, com
extração de texto para PDF, DOCX, XLSX e PPTX, metadados e estrutura para imagens, listagem de
ZIP e paginação para textos longos.

Dois limites importam para a privacidade: a biblioteca expõe **apenas artefatos e metadados**,
nunca mensagens de outras conversas, e o conteúdo entra como dado não confiável — o agente é
instruído a não seguir instruções encontradas dentro de arquivos.

## Armazenamento

Os arquivos da Biblioteca ficam em `artifacts/` dentro da sua pasta de dados do app. Excluir uma
conversa remove os artefatos criados nela; excluir um arquivo da Biblioteca o remove de todos os
lugares. Os envios ficam até você excluí-los ou limpar os dados do app.

Próximo: [Busca na web e fontes](/docs/web-search).
