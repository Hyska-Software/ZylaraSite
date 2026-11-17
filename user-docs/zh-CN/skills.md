---
title: 技能
description: 教智能体如何构建每种格式的说明与脚本，以及如何添加你自己的技能。
---

技能是一个包含 `SKILL.md` 的文件夹：前面是带名称和描述的元数据，后面是智能体在需要时阅读的
说明。技能可以附带辅助脚本，这样智能体就不必临时琢磨怎么写 DOCX 或 PDF。

技能按需加载。智能体在提示词里只看到一份简短目录，只有当任务匹配时才读取完整技能。

## 内置技能

| 技能 | 教什么 |
| --- | --- |
| `office-docx` | Word 文档：标题、段落、表格、样式 |
| `office-xlsx` | Excel 工作簿：工作表、公式、数字格式 |
| `office-pptx` | PowerPoint 演示文稿：幻灯片、标题、项目符号、备注 |
| `pdf` | 含文本和基础版式的 PDF 文件 |
| `imagens` | 位图与 SVG 图片、尺寸和格式 |

插件编写技能（`plugin-authoring`、`plugin-manifest`、`plugin-ui`、`plugin-genui`、
`plugin-agent`、`plugin-trusted`、`plugin-package`）同样内置，驱动应用内的插件创建器——参见
[插件](/docs/plugins)。

内置技能不能删除，只能停用。

## 你自己的技能

在应用数据目录的 `skills/` 下放一个文件夹：

```
<app-data>/skills/my-skill/
  SKILL.md
  scripts/helper.py      (optional)
```

`SKILL.md`：

```markdown
---
name: my-skill
description: One line the agent sees in the catalog, before it decides to open the skill.
---

# My skill

Explain the steps, the file format and any limits. Reference scripts by relative path.
```

用 **设置 → 工具 → 技能 → 打开技能文件夹** 打开该目录，也可以从技能页面进入。手动添加文件
后，在页面上点 **重新加载**。

### 规则

| 规则 | 取值 |
| --- | --- |
| 名称 | `[a-z0-9][a-z0-9-]{0,63}`，与文件夹名一致 |
| 描述 | 最多 1,024 字符；支持 YAML 块标量（`>` / `|`） |
| 正文 | 最多 512 KB |
| 扫描深度 | 技能文件夹内一层；隐藏文件夹会被忽略 |
| 提示词摘要 | 描述中约 200 个字符 |

技能就是纯 Markdown 加可选脚本。辅助脚本应只使用标准库，这样使用者不必安装依赖包。

## 来自其他工具的技能

Zylara 会以 **只读** 方式读取其他智能体使用的技能文件夹：

- `~/.agents/skills`
- `$CODEX_HOME/skills` 或 `~/.codex/skills`
- `$CLAUDE_CONFIG_DIR/skills` 或 `~/.claude/skills`
- `$XDG_CONFIG_HOME/opencode/skills`、`~/.config/opencode/skills` 或
  `%APPDATA%\opencode\skills`

Zylara 绝不会修改或删除它们。两个技能同名时，优先级为
**Zylara → agents → Codex → Claude → OpenCode → 内置**。

## 管理技能

**技能** 页面（侧边栏，在 **新建对话** 下方）按来源分组：**来自 Zylara**、**Agents**、
**Codex**、**Claude**、**OpenCode** 和 **内置**。

| 操作 | 说明 |
| --- | --- |
| 启用 / 停用 | 停用的技能不会出现在智能体的列表中，其脚本也不会被使用 |
| 预览 | **文档** 与 **代码** 视图，可用时还有 **版本历史** |
| 删除 | 只适用于你创建的技能；内置和外部技能显示 **只读** |

**设置 → 工具 → 技能** 里有数量统计、**侧边栏技能面板** 开关、**管理技能** 和
**打开技能文件夹**。

## 智能体何时使用技能

提示词里列出目录；智能体对匹配的技能调用 `read_skill`，拿到说明和脚本路径，然后用
[代码执行](/docs/code-execution) 运行它们。思考区块会显示读取和执行过程，因此你能看到是哪个
技能产出了文件。

## 写一个好技能

1. 用一句话说明目标，并精确说明输出格式。
2. 列出智能体需要构建的规格中的必填字段。
3. 提供一个校验输入、失败时以非零码退出并给出清晰信息的辅助脚本。
4. 保持正文简短；长的参考表格放到智能体可读取的单独文件里。
5. 在只启用该技能、不给其他指令的情况下索要该格式，以此测试。

下一步：[自定义](/docs/customization)。
