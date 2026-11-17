---
title: Permissões e aprovações
description: Modos Leitura, Revisão, Edição e Autônomo, o card de aprovação, caminhos protegidos e o sandbox de comandos do Docker.
---

No layout Código o agente pode alterar arquivos e rodar programas. O Zylara deixa a fronteira
explícita: você escolhe um modo de permissão por sessão, e tudo o que ficar fora dele vira um card
de aprovação na transcrição.

## Modos de permissão

O chip de permissão no campo de mensagem troca de modo a qualquer momento:

| Modo | O que o agente pode fazer |
| --- | --- |
| **Leitura** | Ler arquivos e consultar o workspace. Sem escrita, sem comandos. |
| **Revisão** | Propor edições; toda escrita precisa da sua aprovação. |
| **Edição** | Editar arquivos livremente; comandos precisam de aprovação. |
| **Autônomo** | Rodar comandos, editar, ler segredos e controlar o computador sem perguntar. Um toast avisa **Modo autônomo ativado**. |

O padrão das novas sessões de Código é definido em **Configurações → Ferramentas → Sessões de
código → Modo de permissão padrão**. Escolha **Somente leitura** ou **Revisão** para um repositório
desconhecido, e reserve **Autônomo** para pastas que você deixaria um script modificar.

`/permissions` no campo de mensagem aponta para o chip; ele não troca o modo sozinho.

O modo de planejamento é um interruptor separado: o chip **Planejar** no campo de mensagem ou
`/plan` pede ao agente que proponha um plano antes de agir — veja
[Objetivos e tarefas](/docs/goals-and-tasks#modo-de-planejamento).

## Cards de aprovação

Quando uma ação fica fora do modo atual, o turno pausa e um card aparece na transcrição:

| Título do card | Quando aparece |
| --- | --- |
| **Rodar comando?** | Um comando de shell que não é classificado como somente leitura |
| **Escrever alteração?** | Criar ou editar um arquivo |
| **Ler arquivo?** | Ler fora do workspace |
| **Ler arquivo fora do projeto?** | Um caminho que sai do workspace |
| **Ler arquivo de segredos?** | Um arquivo que casa com padrões de segredo (`.env`, `*.pem`, `*.key`, credenciais) |
| **Rodar ação destrutiva?** | Excluir ou sobrescrever de forma destrutiva |
| **Acessar a rede?** | Uma requisição a um host fora da lista permitida |
| **Controlar o computador?** | Ações de uso do computador |

Cada card oferece **Permitir**, **Negar** e **Permitir sempre**, e a concessão tem escopo:

- **Esta sessão** — até a sessão terminar.
- **Este workspace** — para toda sessão naquela pasta.
- **Sempre** — para a instalação.

Você pode adicionar um **Motivo da recusa (opcional)**; o agente vê o motivo e consegue se ajustar.
`Esc` nega o card pendente. Enquanto uma aprovação está pendente, o campo de mensagem só oferece
**Parar**.

## O que roda sem perguntar

Comandos de inspeção somente leitura são reconhecidos em todos os modos: `git status`, `git diff`,
`git log`, `ls`, `cat`, `head`, `tail`, `rg`/`grep`, sondagens de versão e similares. Qualquer coisa
composta (pipes, `;`, redirecionamentos), qualquer coisa que escreva e qualquer coisa destrutiva
nunca é classificada como segura e sempre pergunta fora do modo **Autônomo**.

O agente também não consegue preparar, commitar, enviar, buscar nem puxar — essas são ações da
workbench que só você executa. Veja [Workbench](/docs/code-workbench#commit).

## Caminhos e segredos

- As ferramentas ficam confinadas ao workspace. Alcançar fora dele exige aprovação, e o caminho
  aparece no card antes de você decidir.
- Arquivos com cara de segredo são protegidos mesmo dentro do workspace: `.env`, `*.pem`, `*.key`,
  arquivos de credenciais. O agente pergunta antes de lê-los.
- Escritas de arquivo têm teto de 2 MB por chamada, e uma escrita precisa ser precedida da leitura
  do mesmo arquivo, então o agente não sobrescreve no escuro algo que nunca viu.

## Workspaces não confiáveis

Abrir uma pasta com **Abrir somente leitura** remove as ferramentas de shell e de edição para
aquele workspace. O cabeçalho mantém o selo **Somente leitura**, e as instruções do projeto não são
carregadas. Revogue a confiança no menu do workspace para voltar a esse estado.

## Sandbox de comandos do Docker

Para isolar melhor os comandos de shell, troque o ambiente de comandos para Docker em
**Configurações → Ferramentas → Sandbox de comandos**:

| Configuração | Significado |
| --- | --- |
| **Ambiente** | **Este computador** (padrão) ou **Docker** |
| **Imagem do Docker** | Imagem usada para os comandos; padrão `node:22-bookworm` |
| **Rede no contêiner** | Desligada por padrão; desligada, os comandos não alcançam a rede |
| **Memória (MB)**, **CPUs**, **PIDs** | Limites de recursos |
| **Rootfs somente leitura** | Monta o sistema de arquivos do contêiner como somente leitura |
| **Validar imagem** / **Baixar imagem** | Confere ou baixa a imagem antes do uso |

Só o workspace é montado, em `/workspace` — nunca a sua pasta pessoal, o socket do Docker ou
credenciais. Os contêineres rodam com `--cap-drop ALL`, `no-new-privileges`, um usuário não root,
um `/tmp` em tmpfs e os limites acima. Eles são removidos ao sair, no timeout, no cancelamento e ao
fechar a aba, e **Limpar contêineres** na mesma tela remove sobras.

O sandbox cobre as ferramentas de `run_command` e os jobs em segundo plano. Ele **não** cobre a
[execução de código](/docs/code-execution), que roda `run_code` direto na máquina.

## Agentes e uso do computador

As threads de agente usam os mesmos modos e cards de aprovação. O modo de permissão de um agente é
definido no editor dele, e o **Uso do computador** acrescenta cards de aprovação por ação
(captura de tela, clique, digitação, tecla), a menos que o agente rode em **Autônomo** — veja
[Uso do computador](/docs/computer-use).

Próximo: [Objetivos e tarefas](/docs/goals-and-tasks).
