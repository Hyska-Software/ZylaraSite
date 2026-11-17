---
title: Modelos e provedores
description: Conecte OpenCode, OpenAI, Anthropic, Gemini e outros 21 provedores, escolha um modelo, controle o raciocínio e leia o uso.
---

O Zylara não inclui acesso a modelos. Você conecta um provedor, e as requisições vão da sua máquina
direto para a API desse provedor com a sua credencial.

## Provedores suportados

O catálogo incluído tem **26 provedores e 464 modelos**. Cinco aparecem em destaque em
**Configurações → Provedores**:

| Provedor | Autenticação | Observações |
| --- | --- | --- |
| **OpenCode Go** | Chave do OpenCode Console | Acesso no estilo assinatura ao catálogo Go (45 modelos) |
| **OpenCode Zen** | Chave do OpenCode Console | Acesso por créditos ao catálogo Zen (92 modelos) |
| **OpenAI** | Chave de API `sk-…` **ou** **Continuar com ChatGPT** | O login do ChatGPT usa seu plano nos modelos elegíveis |
| **Anthropic** | Chave de API `sk-ant-…` | API oficial, pagamento por uso; sem login por assinatura |
| **Gemini** | Chave de API `AIza…` | Também aceita `GOOGLE_API_KEY` |

**Ver mais provedores** lista outros 21 serviços baseados em chave: DeepSeek, xAI (Grok), Mistral,
Moonshot (Kimi), Z.AI (GLM), MiniMax, Inception (Mercury), StepFun, OpenRouter, Vercel AI Gateway,
Groq, Together AI, Fireworks AI, Cerebras, NVIDIA NIM, DeepInfra, SiliconFlow, SambaNova, Scaleway,
Novita AI e Venice AI.

## Conectar um provedor

1. Abra **Configurações → Provedores**.
2. Pressione **Conectar** no provedor e cole a chave.
3. Pressione **Continuar**. Salvar uma chave também busca a lista de modelos daquela conta.

A linha do provedor mostra de onde veio a credencial:

| Selo | Significado |
| --- | --- |
| **Configurado** | Chave salva em `secrets.json` |
| **Variável de ambiente** | Detectada do ambiente (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`/`GOOGLE_API_KEY`, `OPENCODE_API_KEY`, …) |
| **OpenCode CLI** | Reaproveitada de um login existente do OpenCode CLI |
| **Conta ChatGPT** | Login com ChatGPT em vez de uma chave |
| **Ausente** | Sem credencial; os modelos desse provedor não podem ser usados |

A ordem de resolução é configurações → ambiente → OpenCode CLI, e as chaves nunca são enviadas para a
interface. Use **Testar conexão** para validar uma chave sem mudar nada.

### Continuar com ChatGPT

A OpenAI suporta o fluxo oficial *Entrar com ChatGPT*:

1. **Configurações → Provedores → OpenAI → Continuar com ChatGPT**.
2. O navegador do sistema abre a página de consentimento da OpenAI; o app recebe o callback em uma
   porta de loopback.
3. Quando ele retorna, o selo do provedor mostra **Conta ChatGPT** e um chip **Plano ChatGPT** aparece
   na barra de título.

Requisições elegíveis usam seu plano; o limite é compartilhado entre apps que usam a mesma conta. O
app nunca inventa uma porcentagem ou um horário de reset — **Gerenciar uso** abre a página do próprio
provedor. Você pode manter uma chave de API como alternativa (**Usar chave de API como alternativa**)
e **Sair** revoga a sessão.

### Provedores personalizados compatíveis com OpenAI

**Adicionar provedor** registra qualquer endpoint que fale o protocolo de chat da OpenAI — útil para
Ollama, LM Studio ou vLLM. `http://` só é aceito para localhost; endpoints remotos precisam usar
HTTPS. Provedores personalizados são guardados com um id começando com `custom__`.

## O catálogo de modelos

O catálogo vem dentro do app, então o seletor de modelos funciona offline. Ele é gerado a partir da
documentação oficial dos provedores e do models.dev, e cada entrada registra tamanho de contexto,
saída máxima, preço, protocolo e suporte a visão e raciocínio.

- Salvar uma chave mescla os modelos que aquela conta informa.
- **Atualizar modelos** (em **Configurações → Provedores**, ou **Recarregar catálogo de modelos** na
  paleta de comandos) relê cada provedor configurado.
- Modelos que existem só na conta e que o catálogo não descreve são marcados como **Estimado**.

## Escolher um modelo

Clique na pílula do modelo no campo de mensagem para abrir **Selecionar modelo**:

- **Buscar modelos…** casa com nome, família, identificador e capacidades.
- Filtros: **Favoritos**, **Visão**, **Raciocínio**, **Grátis**.
- Lista de provedores, com **Todos os provedores** por padrão.
- Selos por modelo: **Grátis**, **Visão**, **Raciocínio**, **Aberto**, **Prévia**, **Indisponível**
  e **Plano ChatGPT** para modelos incluídos no seu plano.
- Linhas de detalhe: **Contexto**, **Saída máxima**, **Custo (1M tok.)**, **Entrada**, **Protocolo**,
  **Conhecimento até**, **Lançamento**.
- **Usar este modelo** confirma; **Em uso** marca o atual.

O modelo fica fixo durante um turno ("Espere a resposta atual terminar" caso contrário) e pertence à
conversa ou à sessão de Código, não ao app. Marque favoritos para manter uma lista curta no topo.

## Modos de raciocínio

O botão ✦ ao lado da pílula do modelo define quanto o modelo deve raciocinar:

| Controle | Opções |
| --- | --- |
| **Desligado** | Responde direto, sem raciocínio estendido |
| Esforço | **Mínimo**, **Baixo**, **Médio**, **Alto**, **Muito alto**, **Máximo** |
| Orçamento | **Rápido (~4k)**, **Equilibrado (~8k)**, **Profundo (~16k)**, **Máximo (~32k)**, ou um controle deslizante entre os limites do modelo |
| Ativado | Modelos só com liga/desliga |

Nem todo modelo expõe o controle; quando não expõe, o app mostra *"Este modelo não expõe um controle
de raciocínio"*, e modelos só de raciocínio exigem escolher um nível de esforço. O raciocínio é
reenviado na próxima requisição para as famílias de modelos que o aceitam; escolher **Desligado**
desativa esse reenvio.

## Uso e custo

- **Configurações → Geral → Mostrar uso de tokens** adiciona tokens e duração sob cada resposta.
- Os detalhes do modelo mostram o preço por milhão de tokens informado pelo catálogo.
- **Cache de prompt**: com **Configurações → Ferramentas → Cache de prompt → Mostrar indicador**
  ativado, um chip de cache aparece no campo de mensagem do Chat e no medidor de contexto do Código,
  com a taxa de acerto e, quando o cache quebra, o motivo. Veja
  [Objetivos e tarefas](/docs/goals-and-tasks#contexto-e-cache).
- Agentes têm um orçamento diário por agente em **Configurações → Agentes → Orçamento**.

## Timeouts e novas tentativas

Por provedor, **Configurações → Provedores → Confiabilidade** controla **Timeout dos cabeçalhos de
resposta (s)** (120), **Timeout do primeiro token (s)** (180), **Timeout de inatividade do stream (s)**
(120) e **Timeout total do stream (s)** (1800) — `0` desativa um limite — além de **Novas tentativas
por etapa**, backoff e o teto de `Retry-After`. Os padrões funcionam na maioria das redes; aumente o
timeout do primeiro token se um modelo de raciocínio demorar a começar.

## Situações comuns

| Situação | O que significa |
| --- | --- |
| "Sem chave de API para *provedor*" | O modelo selecionado pertence a um provedor que você não conectou |
| O modelo aparece como **Indisponível** | O provedor não o serve mais, ou sua conta não tem acesso |
| A resposta para cedo | Limite do provedor, janela de contexto atingida ou a rede caiu; o texto parcial é mantido |
| Selo **Estimado** | O modelo veio da lista da conta, não do catálogo incluído |

Mais em [Solução de problemas](/docs/troubleshooting).
