---
title: Plugins
description: Instale extensões a partir de uma URL ou de um arquivo, revise as permissões e recupere com segurança quando uma delas falhar.
---

Um plugin é um pacote que estende o Zylara: páginas, painéis, entradas de barra lateral, abas de
configurações, comandos, atalhos, temas, ferramentas, trechos de prompt, habilidades, provedores,
modos e templates de agentes. Plugins são opcionais, e nenhum deles roda até você instalar e ativar.

## O que um pacote contém

Um arquivo `.zplugin` é um ZIP com um `manifest.json`, um `META-INF/signature.json` opcional e os
arquivos de que o plugin precisa — HTML de interface, JavaScript de backend, prompts, habilidades e
idiomas.

Existem três níveis:

| Nível | O que roda | Quando |
| --- | --- | --- |
| **Declarativo** | Nada: o manifesto só acrescenta entradas, comandos, configurações e temas | Sempre seguro de instalar |
| **Isolado** | HTML/JS da interface dentro de um iframe `zplugin` isolado com `allow-scripts` | Padrão para código de terceiros |
| **Confiável** | JavaScript na janela principal, com uma ponte estreita | Só com **Permitir plugins confiáveis** ligado, uma assinatura e seu consentimento explícito |

Uma assinatura prova **quem publicou** o pacote. Ela não torna o código seguro — leia as permissões
antes de instalar.

## Instalando

1. Abra **Plugins** na barra lateral.
2. Use **Instalar por URL** (somente HTTPS) ou escolha um arquivo `.zplugin`; arrastar e soltar
   também funciona.
3. Pressione **Inspecionar pacote**: o app baixa, confere o hash e a assinatura e mostra as permissões
   pedidas.
4. Revise a lista e pressione **Instalar**.

Links diretos como `zylara://plugin/install?url=…` abrem a mesma etapa de revisão. Um plugin
instalado por um agente chega **desativado** com o motivo `activation_required`: só você pode
ativá-lo.

## Permissões

| Escopo | Concede |
| --- | --- |
| `ui.*` | Páginas, painéis, slots, entradas de barra lateral, abas de configurações |
| `agent.*` | Trechos de prompt, ferramentas, templates de agente |
| `providers` | Registrar um provedor de modelos |
| `chat.read` / `chat.write` | Ler a conversa e acrescentar conteúdo |
| `commands`, `hotkeys` | Comandos da paleta e atalhos de teclado |
| `net:<host>` | Acesso de rede a um host específico |
| `fs.read:<glob>` / `fs.write:<glob>` | Acesso a arquivos dentro de um glob |

Qualquer coisa fora dos escopos concedidos falha com `PLUGIN_PERMISSION_DENIED`. `process.spawn` e
`dialog` são reservados e rejeitados: um plugin não consegue iniciar processos nem abrir diálogos
nativos.

## Configurações

**Configurações → Plugins**:

| Controle | Efeito |
| --- | --- |
| **Ativar plugins** | Interruptor mestre |
| **Atualizações automáticas** | Instala versões novas dos registros configurados |
| **Permitir plugins confiáveis** | Necessário para a faixa confiável |
| **Modo desenvolvedor** | Carrega pacotes locais e mostra diagnósticos extras |
| **Modo seguro** | Inicia com todos os plugins desativados, sem excluir nada |
| **URLs de registro** | Uma por linha; caminhos locais só no modo desenvolvedor |
| **Desativar todos os plugins** | Desliga tudo de uma vez |

Se um plugin deixar o app inutilizável, inicie em **Modo seguro** (ou rode o app com
`--disable-plugins`) e depois remova ou atualize o plugin. Seus dados ficam intactos.

## A loja

Os registros são documentos JSON assinados servidos por HTTPS. O app confere a chave do registro, o
hash do pacote e a assinatura do publicador **antes** de extrair qualquer coisa, e suporta:

- canais **stable** e **beta**;
- revogações, que bloqueiam uma atualização;
- rollback para a versão anterior quando uma atualização falha;
- vários registros, separados por vírgula ou quebra de linha.

A loja na v1 não tem telemetria nem pagamentos.

## Atualizando e removendo

- **Atualizações** na página de Plugins mostra as versões disponíveis; **Atualizações automáticas**
  instala conforme aparecem.
- **Desinstalar** remove o código. Dados chave-valor, configurações e segredos do plugin são mantidos
  a menos que você escolha apagá-los, então reinstalar restaura o estado anterior.
- Se uma atualização quebrar algo, volte à versão anterior pela página do plugin.

## Construindo um plugin

O SDK é um assunto separado, mas os pontos de entrada são:

- `packages/plugin-sdk` e `packages/create-zylara-plugin` para criar o esqueleto;
- `node scripts/plugin/cli.mjs init|build|pack|sign|verify|publish|registry` para o ciclo de vida;
- `pnpm plugin:review <file.zplugin>` como portão de revisão;
- o modo `/creator` dentro do app, que monta um plugin com as habilidades de autoria incluídas e o
  instala desativado.

Próximo: [Referência de configurações](/docs/settings-reference).
