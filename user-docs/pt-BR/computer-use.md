---
title: Uso do computador
description: Dê a um agente um desktop privado dentro do Docker, acompanhe pela aba Tela e aprove cada ação.
---

O uso do computador permite que um agente opere um ambiente gráfico: tirar capturas de tela,
clicar, digitar, rolar e ler o conteúdo das janelas. No Zylara o ambiente é um **desktop privado**
rodando em um contêiner Docker, mostrado ao vivo na aba **Tela**.

## Requisitos

- Docker Desktop ou Docker Engine instalado e em execução.
- A imagem de uso do computador baixada uma vez (ela é grande e não é baixada automaticamente).
- Um agente com a capacidade **Uso do computador** e um **Ambiente de computador** que não seja
  **Desligado**.

O controle local do seu desktop real existe apenas no Windows. No macOS e no Linux o caminho
suportado é o contêiner de desktop privado; "Desktop na nuvem" ainda não está disponível.

## Configuração

Abra **Configurações → Agentes → Desktop privado (uso do computador)**:

| Controle | Para que serve |
| --- | --- |
| **Imagem de uso do computador** | Imagem usada no contêiner |
| **Baixar imagem** | Baixa antes da primeira sessão |
| **Iniciar Docker** | Inicia o daemon e espera até 120 segundos |
| **Contêiner de uso do computador** | Mostra o estado do contêiner |
| **Ações por turno** | Padrão 20 |
| **Ações por hora** | Padrão 120 |
| **Limpar contêineres** | Remove contêineres parados e sobras |
| **Diagnóstico** | Confere Docker, a imagem e o contêiner |

A aba **Tela** mostra um card de ajuda quando falta algo, com **Instalar/abrir Docker Desktop…**,
**Baixar imagem**, **Configurar Docker** e, para desenvolvimento, **Build local**.

Por agente, o seletor **Trabalha em** define o ambiente: **Automático**, **Desktop privado
(Docker)**, **Este computador**, **Navegador** ou **Desligado**.

## O que o agente pode fazer

| Ação | Observações |
| --- | --- |
| Captura de tela, lista de janelas, árvore de acessibilidade | Leitura do estado do desktop |
| Clique, duplo clique, clique direito, mover, arrastar, rolar | Controle do ponteiro |
| Digitar texto, pressionar teclas, focar uma janela | Controle do teclado |
| Esperar | Pausa para a interface estabilizar |
| Ler/gravar a área de transferência | Ações explícitas |
| Navegador (CDP) | Um navegador isolado, controlado pela capacidade de navegador controlado |

Cada passo é uma chamada de ferramenta, então o bloco de raciocínio mostra exatamente o que o agente
fez e em que ordem.

## Aprovações e limites

- Fora do modo **Autônomo**, toda ação gera um card de aprovação (**Permitir** / **Negar**) sem
  concessão persistente: você aprova a ação, não a sessão.
- **Ações por turno** e **Ações por hora** limitam o laço; os padrões são 20 e 120.
- Janelas sensíveis são negadas por uma lista embutida, e **Configurações → Agentes** acrescenta
  listas de permitidos e negados para apps de desktop e hosts de navegador.
- Uma trilha de auditoria registra as ações; o texto digitado não é guardado.
- O acesso à rede segue a política de hosts do navegador controlado.

## Assumindo o controle

A aba Tela é interativa quando você precisa:

| Controle | Efeito |
| --- | --- |
| **Assumir o controle** | Seu teclado e mouse dirigem o desktop |
| **Devolver ao agente** | Devolve o controle |
| `Ctrl+Alt+Shift+Q` | Libera o teclado imediatamente |
| **Parar** (barra superior) | Para o turno atual |
| **Parar tudo** (Atividade) | Para todos os turnos em execução |

## Limitações

- O desktop privado é um contêiner: tem o próprio sistema de arquivos e nenhum acesso aos seus
  arquivos, a menos que você os copie para dentro.
- Capturas de tela são imagens; a extração de texto depende da árvore de acessibilidade, que muitos
  apps de Linux expõem apenas em parte.
- A imagem é grande; o primeiro download pode demorar, e o contêiner sobe sob demanda.
- O uso do computador não substitui as ferramentas de Código: para trabalho com arquivos, um
  workspace é mais rápido e mais confiável.

Próximo: [Plugins](/docs/plugins).
