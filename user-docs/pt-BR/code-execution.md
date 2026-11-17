---
title: Execução de código
description: Deixe o agente rodar Python ou Node para produzir PDF, Office, imagens, áudio, vídeo e arquivos ZIP, dentro de limites que você controla.
---

Alguns formatos não podem ser escritos como texto. Para produzir um PDF, um DOCX, um XLSX, uma
apresentação ou uma imagem, o agente escreve um script curto, executa, e devolve o arquivo gerado
como artefato. Esse é o recurso de **execução de código**, e ele fica desligado até você ativá-lo.

## Como ativar

1. Abra **Configurações → Ferramentas → Execução de código**.
2. Ative **Permitir execução de código**.
3. Defina **Timeout de execução** (10 a 600 segundos; padrão 120).
4. Confira o bloco **Ambiente de código**: ele lista Python e Node com a versão e se o caminho foi
   configurado por você ou detectado no `PATH`. **Verificar de novo** refaz a detecção depois de
   você instalar um interpretador.

Enquanto o botão está desligado, a ferramenta nem é oferecida ao modelo. Quando está ligado, o app
mostra o aviso de que o código roda nesta máquina com as suas permissões e o seu acesso à rede —
veja [Segurança](#seguranca).

## Interpretadores

- **Python**: um caminho configurado, ou `python`, `python3` ou `py` do `PATH`.
- **Node**: um caminho configurado, ou `node` do `PATH`.

Nada é baixado automaticamente. Se os dois estiverem faltando, o agente ainda consegue escrever
formatos de texto; só não consegue construir os binários.

Pacotes opcionais melhoram o resultado: `python-docx`, `openpyxl`, `python-pptx`, `reportlab` e
`Pillow`. A tela de configurações lista quais estão disponíveis e oferece **Copiar comando de
instalação**; instalar é decisão sua.

## Limites

| Limite | Valor |
| --- | --- |
| Tamanho do código | 100 KB |
| Arquivos de entrada | 10 arquivos, 1 MB cada |
| Arquivos de saída | 20 arquivos, 25 MB cada, 64 MB no total |
| Tamanho do workspace | 128 MB |
| stdout / stderr | 64 KB cada |
| Timeout | 120 s padrão, 10 s mínimo, 600 s máximo; uma chamada pode pedir de 5 s a 10 min |
| Cancelamento | A árvore de processos inteira é encerrada |

Saída acima do limite é truncada com um aviso; uma execução com código de saída diferente de zero
ainda preserva os arquivos que foram produzidos.

## Ciclo de vida do workspace

Cada execução ganha uma pasta nova em `<app-data>/code-runs/<id>/`, com apenas os arquivos que você
permitiu como entrada. Quando a execução termina:

1. Os arquivos novos são coletados e registrados como artefatos.
2. O workspace é removido.
3. A ferramenta devolve um resumo com o código de saída, a saída do console e os ids dos artefatos.

Nada é escrito no seu projeto ou na sua pasta pessoal por esta ferramenta.

## Segurança

A execução de código **não é um sandbox de sistema operacional**. Um script roda como o seu
usuário, com as suas permissões e a sua rede. As proteções são:

- opt-in explícito, por instalação;
- um workspace descartável, timeout, limites de saída e cancelamento da árvore de processos;
- um ambiente saneado: variáveis que casam com `*API_KEY*`, `*TOKEN*`, `*SECRET*`, `LD_*`,
  `DYLD_*` e os caminhos do próprio app são removidos, então as credenciais do app não ficam
  disponíveis ao script;
- o agente é instruído a rodar apenas o código necessário para o arquivo pedido.

Se você precisa de isolamento mais forte para comandos, use o **Sandbox de comandos** do Docker em
**Configurações → Ferramentas**, que vale para comandos de shell e jobs em segundo plano — não para
esta ferramenta. Veja
[Permissões e aprovações](/docs/permissions-and-approvals#sandbox-de-comandos-do-docker).

## Como se encaixa com habilidades

O agente não precisa inventar o script. As habilidades incluídas (`pdf`, `office-docx`,
`office-xlsx`, `office-pptx`, `imagens`) trazem instruções e pequenos auxiliares de biblioteca
padrão que produzem arquivos válidos. Um fluxo típico é: ler a habilidade, escrever uma
especificação, rodar o auxiliar, registrar o artefato. Veja [Habilidades](/docs/skills).

## Quando falha

| Mensagem | Causa |
| --- | --- |
| "A execução de código está desativada" | O botão em **Configurações → Ferramentas** está desligado |
| "Python não encontrado" / "Node não encontrado" | Nenhum interpretador no `PATH` e nenhum caminho configurado |
| "Tempo esgotado" | O script passou do timeout; simplifique ou aumente o limite |
| "Limite de saída excedido" | Saída de console demais; grave os resultados em um arquivo |
| Saída com erro | O script falhou; a saída do console está no resultado da ferramenta |

Mais: [Solução de problemas](/docs/troubleshooting).
