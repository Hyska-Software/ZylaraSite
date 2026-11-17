---
title: Personalização
description: Tema, tamanho do texto, idioma, visibilidade dos layouts, temas instalados e opções de interface vindas de plugins.
---

As configurações de aparência se dividem entre **Geral** (comportamento e básicos), **Temas**
(pacotes de tema instalados), **Design** (interface contribuída por plugins) e **Terminal**.

## Aparência

| Configuração | Onde | Opções |
| --- | --- | --- |
| Tema | **Configurações → Geral → Tema** | **Claro**, **Escuro**, **Sistema** |
| Tamanho do texto | **Configurações → Geral → Tamanho do texto** | 90% a 115%, em passos de 5% |
| Idioma | **Configurações → Geral → Idioma** | Inglês (padrão), Português (Brasil), Espanhol |
| Reduzir movimento | **Configurações → Geral → Reduzir movimento** | Desativa transições e animações |
| Layouts | **Configurações → Geral → Layouts** | Mostra ou esconde Chat, Código e Agentes |

A pílula de layout na barra de título também tem um menu de botão direito com os mesmos
interruptores de visibilidade. Quando só um layout está ativo, a pílula fica escondida.

## Preferências de comportamento

| Configuração | Efeito |
| --- | --- |
| **Enviar com** | `Enter` ou `Ctrl/⌘ Enter`; `Shift+Enter` sempre insere uma nova linha |
| **Mostrar uso de tokens** | Tokens e duração abaixo de cada resposta |
| **Raciocínio recolhido por padrão** | Blocos de raciocínio começam fechados |
| **Limite de auto-compactação** | 50% a 90% da janela de contexto, padrão 85% |
| **Continuar rodando na bandeja do sistema** | Fechar a janela mantém o app e seus turnos vivos |

## Temas

**Configurações → Temas** lista os temas instalados e a paleta embutida **Zylara**. Os extras
incluídos são **aurora**, **ember**, **grove**, **nebula** e **nocturne**.

| Ação | Resultado |
| --- | --- |
| **Usar** | Aplica o tema na hora; o ativo ganha a marca **Ativo** |
| **Instalar tema…** | Abre um pacote `.zip` |
| **Recarregar temas** | Relê a pasta de temas depois de você copiar arquivos à mão |
| **Abrir pasta de temas** | Mostra `<app-data>/themes/` |
| **Remover** | Exclui a cópia instalada; o pacote no disco fica intacto |

### Pacotes de tema

Um tema é um ZIP (até 24 MB, no máximo 256 arquivos) com um `theme.json` na raiz ou dentro de uma
única pasta de topo:

```
my-theme/
  theme.json
  fonts/        (optional)
  images/       (optional)
```

Só os arquivos referenciados pelo manifesto (`fonts`, `wallpaper`) são extraídos, e os nomes de
arquivo precisam usar `/`, sem `..` nem caminhos absolutos. Reinstalar o mesmo id substitui a
pasta atomicamente. Temas definem cores, raios, tipografia e um wallpaper opcional por tokens de
design — o app nunca executa código de um tema.

## Design (interface de plugins)

Plugins podem contribuir com entradas de barra lateral, páginas, painéis, slots e variantes de
componente. A aba **Design** mostra o que cada layout usa no momento:

| Controle | Resultado |
| --- | --- |
| Abas de layout (**Chat**, **Código**, **Agentes**) | Escolhe qual layout inspecionar |
| **Presets** / **Variantes de componente** | Escolhe o preset ativo e a variante por componente |
| **Desativar interface de plugins** / **Ativar interface de plugins** | Esconde toda superfície contribuída por plugins em todos os layouts, sem desinstalar nada |
| **Redefinir este layout** / **Redefinir toda a interface de plugins** | Volta aos padrões do host |
| **Conflitos** e **Modificações ativas** | Mostra o que sobrescreve o quê |

Esse também é o caminho de recuperação quando a interface de um plugin dá problema: desative a
interface de plugins e depois remova o plugin em [Plugins](/docs/plugins).

## Terminal

**Configurações → Terminal** define a família da fonte (padrão JetBrains Mono Variable) e o tamanho
usados pelo terminal integrado e pelos blocos de código que seguem a fonte do terminal.

## O que não é personalizável

- Sem injeção de CSS arbitrário: cores e espaçamento vêm dos tokens do tema ativo.
- O layout do campo de mensagem, a ordem da transcrição e as posições dos painéis são fixos por
  layout.
- A interface de plugins pode ser desativada, não reorganizada além dos presets que um plugin
  declara.

Próximo: [Workspaces e sessões](/docs/code-workspaces).
