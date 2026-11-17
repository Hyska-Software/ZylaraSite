---
title: Habilidades
description: Instruções e scripts que ensinam o agente a montar cada formato, mais como adicionar os seus.
---

Uma habilidade é uma pasta com um arquivo `SKILL.md`: frontmatter com nome e descrição, e então
instruções que o agente lê quando precisa. Habilidades podem incluir scripts auxiliares, então o
agente não precisa improvisar como escrever um DOCX ou um PDF.

As habilidades são carregadas sob demanda. O agente vê um catálogo curto no prompt e lê a
habilidade inteira só quando uma tarefa casa.

## Habilidades incluídas

| Habilidade | Ensina |
| --- | --- |
| `office-docx` | Documentos do Word: títulos, parágrafos, tabelas, estilos |
| `office-xlsx` | Planilhas do Excel: abas, fórmulas, formatos numéricos |
| `office-pptx` | Apresentações do PowerPoint: slides, títulos, marcadores, notas |
| `pdf` | Arquivos PDF com texto e layout básico |
| `imagens` | Imagens raster e SVG, tamanhos e formatos |

Habilidades de autoria de plugins (`plugin-authoring`, `plugin-manifest`, `plugin-ui`,
`plugin-genui`, `plugin-agent`, `plugin-trusted`, `plugin-package`) também vêm incluídas e movem o
criador de plugins do app — veja [Plugins](/docs/plugins).

As habilidades incluídas não podem ser excluídas, só desativadas.

## Suas próprias habilidades

Coloque uma pasta no diretório `skills/` da pasta de dados do app:

```
<app-data>/skills/my-skill/
  SKILL.md
  scripts/helper.py      (optional)
```

`SKILL.md`:

```markdown
---
name: my-skill
description: One line the agent sees in the catalog, before it decides to open the skill.
---

# My skill

Explain the steps, the file format and any limits. Reference scripts by relative path.
```

Abra a pasta com **Configurações → Ferramentas → Habilidades → Abrir pasta de habilidades** ou pela
página de Habilidades. Use **Recarregar** na página depois de adicionar arquivos à mão.

### Regras

| Regra | Valor |
| --- | --- |
| Nome | `[a-z0-9][a-z0-9-]{0,63}`, igual ao da pasta |
| Descrição | Até 1.024 caracteres; escalares de bloco YAML (`>` / `|`) são suportados |
| Corpo | Até 512 KB |
| Profundidade da varredura | Um nível dentro da pasta de habilidades; pastas ocultas são ignoradas |
| Trecho no prompt | Cerca de 200 caracteres da descrição |

Habilidades são Markdown puro mais scripts opcionais. Os auxiliares devem usar só a biblioteca
padrão, para que a pessoa não precise instalar pacotes para usá-los.

## Habilidades de outras ferramentas

O Zylara lê, **somente para leitura**, as pastas de habilidades que outros agentes usam:

- `~/.agents/skills`
- `$CODEX_HOME/skills` ou `~/.codex/skills`
- `$CLAUDE_CONFIG_DIR/skills` ou `~/.claude/skills`
- `$XDG_CONFIG_HOME/opencode/skills`, `~/.config/opencode/skills` ou
  `%APPDATA%\opencode\skills`

Elas nunca são modificadas nem excluídas pelo Zylara. Quando duas habilidades têm o mesmo nome, a
precedência é **Zylara → agents → Codex → Claude → OpenCode → incluídas**.

## Gerenciando habilidades

A página **Habilidades** (barra lateral, abaixo de **Nova conversa**) agrupa as habilidades por
origem: **Do Zylara**, **Agents**, **Codex**, **Claude**, **OpenCode** e **Incluídas**.

| Ação | Observações |
| --- | --- |
| Ativar / desativar | Uma habilidade desativada não aparece ao agente e os scripts dela não são usados |
| Pré-visualizar | Visões **Documento** e **Código**, mais **Histórico de versões** quando disponível |
| Excluir | Só para habilidades que você criou; as incluídas e externas mostram **Somente leitura** |

**Configurações → Ferramentas → Habilidades** tem as contagens, o botão **Painel de habilidades na
barra lateral**, **Gerenciar habilidades** e **Abrir pasta de habilidades**.

## Quando o agente usa uma habilidade

O prompt lista o catálogo; o agente chama `read_skill` para a que casa, recebe as instruções e os
caminhos dos scripts, e então usa a [execução de código](/docs/code-execution) para rodá-los. O
bloco de raciocínio mostra a leitura e a execução, então você vê qual habilidade produziu cada
arquivo.

## Escrevendo uma boa habilidade

1. Diga o objetivo em uma frase e o formato de saída com precisão.
2. Liste os campos obrigatórios da especificação que o agente precisa montar.
3. Forneça um auxiliar que valide a entrada e saia com código diferente de zero e uma mensagem
   clara.
4. Mantenha o corpo curto; tabelas de referência longas vão em um arquivo separado que o agente
   pode ler.
5. Teste pedindo o formato com a habilidade ativada e nenhuma outra instrução.

Próximo: [Personalização](/docs/customization).
