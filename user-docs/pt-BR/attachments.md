---
title: Anexos
description: Envie arquivos PDF, Office, de texto, de código e imagens como contexto, e entenda o que o app extrai de cada um.
---

Anexos dão material ao modelo para trabalhar. O Zylara lê o arquivo no backend, extrai o conteúdo e
envia esse conteúdo como parte da requisição — o arquivo em si não é enviado para lugar nenhum, exceto
para o provedor que você está usando.

## Adicionar arquivos

- Pressione **+** no campo de mensagem e escolha **Documentos**, **Imagens** ou **Todos os arquivos**.
- Cole um arquivo ou uma imagem diretamente no campo de mensagem.
- Importe da área de transferência quando o app oferecer.

Cada anexo vira um chip com uma pré-visualização e uma ação **Remover**. Você pode misturar vários
arquivos em uma mensagem. A opção **Configurações → Ferramentas → Ferramentas do agente → Enviar
anexos para o modelo** controla se o conteúdo do anexo entra ou não na requisição.

## O que é extraído

| Tipo | Extração |
| --- | --- |
| **PDF** | Texto por página (PDFs de texto; páginas digitalizadas não têm OCR) |
| **DOCX** | Parágrafos, títulos e tabelas de `word/document.xml` |
| **PPTX** | Texto de cada slide, incluindo notas do apresentador |
| **XLSX / ODS** | Valores de célula por planilha |
| **CSV / TSV** | Linhas interpretadas, com delimitador detectado |
| **Texto, Markdown, código, JSON, HTML** | Lido como texto com detecção de codificação |
| **Imagens** | Metadados mais a imagem em si, enviada nativamente quando o modelo tem visão |

Limite: **400.000 caracteres por documento**. Documentos maiores são truncados, e o anexo é sinalizado
para você saber que o modelo não viu tudo. Divida um documento grande em partes se os detalhes
importarem.

## Imagens e visão

Imagens vão nativamente, então o modelo precisa suportar visão. Use o filtro **Visão** em **Selecionar
modelo** para achar um, senão o modelo não recebe a imagem. Os formatos suportados incluem PNG, JPEG,
GIF, WebP, AVIF, BMP e ICO; TIFF é convertido antes da pré-visualização.

## Quando anexar em vez de colar

Anexe quando o arquivo for longo, estruturado ou precisar ser preservado como documento; cole quando
você só precisa de um parágrafo. Arquivos anexados continuam referenciados pela conversa, então
perguntas posteriores podem contar com eles sem reenviar.

## Onde os arquivos ficam

Os anexos são copiados para `attachments/` na pasta de dados do app e referenciados por id no payload
da mensagem. Excluir a conversa exclui os anexos dela. Arquivos que você quer manter fora do Zylara
devem ser exportados — veja [Artefatos](/docs/artifacts) e [Biblioteca](/docs/library).

## Limites e ressalvas

- **Sem OCR**: um PDF digitalizado rende pouco ou nenhum texto. Converta para texto antes.
- **Sem transcrição de áudio ou vídeo**: arquivos de áudio e vídeo são tratados como artefatos, não
  como contexto de anexo.
- **Extração estrutural**: conteúdo DOCX/PPTX/XLSX é lido como texto e células; imagens, cores, células
  mescladas e layout não fazem parte do contexto.
- **Os limites do provedor valem**: uma extração muito grande pode ser truncada pela janela de contexto
  do modelo. O medidor de contexto no Código e as mensagens de erro no Chat avisam quando isso
  acontece.

Próximo: [Artefatos](/docs/artifacts) para transformar a análise em arquivos.
