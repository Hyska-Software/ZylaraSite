---
title: Artefatos
description: Arquivos que o agente cria, como cada formato é pré-visualizado no painel e como salvar ou abrir cada um.
---

Um artefato é um arquivo que o agente produziu: um relatório em Markdown, uma página HTML, uma
tabela CSV, um arquivo de código, um PDF, um DOCX, uma planilha, uma apresentação, uma imagem, um
arquivo de áudio ou vídeo, ou um ZIP. Os artefatos ficam guardados dentro do Zylara e podem ser
pré-visualizados, salvos ou abertos sem sair do app.

## Como os artefatos são criados

| Ferramenta | Formatos |
| --- | --- |
| **Criar arquivos** (`create_file`) | Markdown, TXT/log, HTML, CSV/TSV, JSON, SVG e código-fonte — texto escrito direto |
| **Execução de código** (`run_code`) | Todo o resto: PDF, DOCX, XLSX, PPTX, PNG/JPEG/WebP/GIF/TIFF, áudio, vídeo, ZIP e outros binários |

Formatos de texto funcionam só com o botão de ferramentas do campo de mensagem. Formatos
binários exigem [execução de código](/docs/code-execution) ativada e Python ou Node disponíveis.

Cada artefato é gravado em `artifacts/<id>/<name>` com os metadados no banco de dados, então ele
sobrevive a reinícios e aparece na Biblioteca.

## Na conversa

Os artefatos aparecem como cards compactos abaixo da mensagem que os criou, até dois por linha.
Quando uma única mensagem gera mais de quatro, a conversa mostra os primeiros e um botão
**Ver todos (N)** que abre o painel no modo lista.

Cards e painel são reconciliados a cada turno, então nenhum card fica para trás quando um evento
se perde.

## O painel de artefatos

Abra por um card, por **Ver todos**, ou com **Abrir painel de artefatos** na paleta de comandos.

| Controle | Para que serve |
| --- | --- |
| **Ver lista** | Mostra todos os artefatos da conversa como cards |
| **Artefato anterior / próximo** | Percorre a lista, com um contador `1 of 3 artifacts` |
| **Salvar como…** | Grava uma cópia em qualquer lugar do disco pelo diálogo nativo |
| **Abrir no app padrão** | Entrega o arquivo ao aplicativo do sistema |
| **Excluir** | Remove o artefato depois da confirmação |
| **Fechar** | Esconde o painel |
| Flutuar / acoplar | O painel pode flutuar sobre a conversa ou ficar acoplado ao lado; acoplar exige uma janela larga o bastante |

## Pré-visualização por formato

| Formato | Pré-visualização |
| --- | --- |
| Markdown | Documento renderizado com alternância **Documento / Código** |
| TXT / log | Linhas numeradas, com quebra de linha configurável |
| HTML | Renderizado em um iframe isolado |
| CSV / TSV | Tabela com detecção de delimitador (`,` `;` tab `|`) |
| JSON | Árvore recolhível, mais o código destacado; JSON inválido cai no modo código |
| Código (30+ linguagens) | Destaque de sintaxe com quebra de linha ou rolagem horizontal |
| SVG | Renderização saneada, com zoom e ajuste |
| PDF | Navegação por páginas e zoom (pdf.js) |
| DOCX | HTML renderizado em um iframe isolado |
| XLSX | Grade com uma aba por planilha |
| PPTX | Cards de slide com título, texto e notas do apresentador |
| Imagens | Zoom, arraste e fundo xadrez de transparência; TIFF convertido para PNG |
| Áudio / vídeo | Player nativo com metadados (arquivos até 24 MiB inline) |
| ZIP | Lista de entradas (até 400) com um resumo |
| Outros binários | Formato detectado e um hexdump de 4 KB |
| Qualquer coisa não suportada | Um card com **Salvar como…** e **Abrir** |

As prévias de Office são estruturais: texto, tabelas e ordem dos slides aparecem, mas cores,
imagens, células mescladas e o layout exato não são reproduzidos. PDFs digitalizados não passam
por OCR.

## Trabalhando com artefatos

- **Salvar como…** é a única ação que grava fora da pasta de dados do app; nada é sobrescrito sem
  o diálogo nativo.
- **Abrir no app padrão** serve para formatos que a prévia embutida não renderiza, como
  contêineres de áudio ou vídeo.
- Os arquivos ficam até você excluir o artefato, a conversa dele, ou limpar os dados do app.
- Os artefatos de todas as conversas aparecem na [Biblioteca](/docs/library), onde dá para
  pesquisar, favoritar e renomear.

## O que o agente pode fazer com eles

O agente pode pesquisar e ler a biblioteca de artefatos de **todas as suas conversas** por duas
ferramentas: `list_artifacts` (busca por nome, título da conversa e conteúdo textual) e
`read_artifact` (traz o conteúdo para o contexto, com extração de texto para PDF/DOCX/XLSX/PPTX,
metadados de imagem, listagem de ZIP e paginação).

A biblioteca expõe os artefatos e os metadados apenas — nunca mensagens de outras conversas — e o
conteúdo é tratado como dado não confiável, não como instrução.

Próximo: [Biblioteca](/docs/library).
