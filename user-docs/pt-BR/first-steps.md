---
title: Primeiros passos
description: Conecte um provedor, escolha um modelo, envie sua primeira mensagem, anexe um documento e receba um arquivo de volta.
---

Este passo a passo leva cerca de cinco minutos e termina com um arquivo gerado na sua Biblioteca.
Ele assume que o Zylara já está instalado — veja [Instalação](/docs/installation).

## 1. Conectar um provedor

Abra **Configurações → Provedores** (`Ctrl/⌘ ,`). A lista mostra os provedores recomendados primeiro.

- **OpenCode Go / OpenCode Zen** — cole uma chave do [OpenCode Console](https://opencode.ai/console).
  Um login existente do OpenCode CLI é detectado automaticamente.
- **OpenAI** — **Continuar com ChatGPT** (sem chave de API, usa um plano elegível) ou uma chave de
  API começando com `sk-`.
- **Anthropic** — uma chave começando com `sk-ant-`. A API oficial é por uso.
- **Gemini** — uma chave começando com `AIza`.
- **Outros provedores** — **Ver mais provedores** lista mais 21 serviços baseados em chave.

Clique em **Continuar** e, se o provedor oferecer, em **Testar conexão**. O selo ao lado do provedor
diz de onde veio a credencial: **Configurada**, **Variável de ambiente**, **OpenCode CLI**, **Conta
ChatGPT** ou **Ausente**.

As chaves ficam no `secrets.json` do app e nunca chegam à interface. Detalhes e alternativas:
[Modelos e provedores](/docs/models-and-providers#conectar-um-provedor).

## 2. Escolher um modelo

Clique na pílula do modelo no campo de mensagem. O diálogo **Selecionar modelo** permite:

- buscar por nome, família, identificador ou capacidade;
- filtrar por **Favoritos**, **Visão**, **Raciocínio** e **Grátis**;
- restringir a um provedor;
- ler tamanho de contexto, saída máxima, preço por milhão de tokens, protocolo, data de corte de
  conhecimento e data de lançamento.

Escolha um modelo e confirme com **Usar este modelo**. Para uma primeira execução, um modelo de uso
geral com suporte a **Raciocínio** é um bom padrão; um modelo com **Visão** é obrigatório se você
pretende anexar imagens.

O botão ✦ ao lado da pílula define o modo de raciocínio: **Desligado**, um nível de esforço de
**Mínimo** a **Máximo**, ou um orçamento de tokens entre **Rápido (~4k)** e **Máximo (~32k)**. Nem
todo modelo expõe o mesmo controle; quando não expõe, o app avisa. Veja
[Modelos e provedores](/docs/models-and-providers#modos-de-raciocinio).

## 3. Enviar sua primeira mensagem

Digite no campo de mensagem e pressione `Enter` (ou `Ctrl/⌘ Enter` se você mudou **Enviar com** em
**Configurações → Geral**). Enquanto a resposta chega em streaming, você pode:

- ler o bloco de raciocínio recolhível, que lista o raciocínio e cada chamada de ferramenta;
- pressionar o botão de parar (ou `Esc`) para interromper;
- pressionar ⚡ **Enviar agora** para interromper e mandar uma nova mensagem, ou o botão de fila para
  enfileirar uma — veja [Conversas](/docs/conversations#enfileirar-mensagens).

## 4. Anexar um documento

Use o botão **+** no campo de mensagem, cole um arquivo ou importe da área de transferência. PDF,
DOCX, PPTX, XLSX/ODS/CSV, texto, código, JSON, HTML e imagens são suportados. O texto é extraído no
backend e enviado como contexto; imagens vão nativamente para modelos com visão.

Pergunte algo específico sobre o arquivo ("resuma a seção 3", "quais linhas cresceram mais rápido").
Os chips de anexo mostram uma pré-visualização e uma ação de remover. Limites e regras de extração:
[Anexos](/docs/attachments).

## 5. Pedir um arquivo

Confirme que **Criar arquivos** está ativo no campo de mensagem (o botão de ferramentas) e peça algo
concreto:

> Crie um relatório em Markdown com uma tabela dos três maiores riscos no PDF anexado.

A resposta inclui um card de artefato. Abra-o para ver a pré-visualização e use **Salvar como…** para
gravar uma cópia em qualquer lugar do disco. Os arquivos também aparecem na
[Biblioteca](/docs/library).

Se o arquivo for um formato binário de verdade (PDF, DOCX, XLSX, PPTX, imagem, áudio, vídeo, ZIP), o
agente precisa da [execução de código](/docs/code-execution) ativada e de Python ou Node instalado.

## 6. Opcional: experimentar o layout Código

Mude a pílula de layout para **Código**, clique em **Abrir pasta…** e escolha um projeto. Leia o
diálogo de confiança: **Confiar** deixa o agente ler, editar e rodar comandos nessa pasta; **Abrir
somente leitura** deixa apenas ler. Comece com o modo de permissão **Revisão**, peça uma mudança
pequena e inspecione o diff antes de commitar.

Continue com [Workspaces e sessões](/docs/code-workspaces) e
[Permissões e aprovações](/docs/permissions-and-approvals).

## Checklist

| Feito | Etapa | Onde |
| --- | --- | --- |
| ☐ | Provedor conectado | **Configurações → Provedores** |
| ☐ | Modelo selecionado | Pílula do campo de mensagem → **Usar este modelo** |
| ☐ | Modo de raciocínio escolhido | Botão ✦ |
| ☐ | Primeira resposta recebida | Campo de mensagem |
| ☐ | Documento analisado | **+** no campo de mensagem |
| ☐ | Artefato criado e salvo | Card do artefato → **Salvar como…** |
| ☐ | Pasta aberta no Código (opcional) | Pílula de layout → **Código** |

## Se algo parecer errado

| Sintoma | Correção |
| --- | --- |
| Banner pedindo um provedor | Clique em **Abrir provedores** e adicione uma chave. |
| "Sem chave de API para *provedor*" | Conecte esse provedor ou escolha um modelo de um provedor que você configurou. |
| Pílula de modelo desativada durante o streaming | Espere a resposta atual ou interrompa-a; o modelo fica fixo durante um turno. |
| Nenhum artefato aparece | Confira se **Criar arquivos** está ativo e se o modelo suporta chamadas de ferramentas. |
| Formato binário não gerado | Ative **Execução de código** e instale Python ou Node. |

Mais: [Solução de problemas](/docs/troubleshooting).
