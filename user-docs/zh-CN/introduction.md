---
title: Zylara 是什么
description: 基于 Tauri 和 React 构建的本地优先 AI 桌面应用，提供三种布局，没有自己的服务器。
---

Zylara 是大型语言模型的桌面客户端。它是一个原生窗口（Tauri 2 搭配 React 界面），直接与你选择的提供商通信。没有 Zylara 账户，没有中转服务器，也不会上传你的对话。

## 设计上本地优先

| 内容 | 存放位置 |
| --- | --- |
| 对话和消息 | 应用数据文件夹中的 `zylara.db`（SQLite） |
| 你发送的附件 | 同一文件夹中的 `attachments/` |
| 智能体创建的文件 | 同一文件夹中的 `artifacts/` |
| API 密钥和 ChatGPT 会话 | 同一文件夹中的 `secrets.json`，仅由后端读取 |
| 你编写的技能 | 同一文件夹中的 `skills/` |

渲染进程永远不会收到密钥或 token：它只拿到脱敏的标识符和元数据。唯一的网络目的地是你选择的提供商、更新源，以及你配置的插件注册表 — 参见[数据与隐私](/docs/data-and-privacy)。

## 三种布局，一套引擎

标题栏中的布局切换控件在 **聊天**、**代码** 和 **智能体** 之间切换。三者共用同一套对话引擎（流式输出、工具、思考、产物），但暴露的工具和上下文不同。

- **聊天** 是默认布局：对话列表、输入框、附件、网页搜索、生成的文件和资料库。
- **代码** 把对话绑定到磁盘上的一个文件夹。智能体可以读取和编辑文件、运行命令、维护计划和任务列表，应用会显示差异供审阅。未经你确认，不会暂存或提交任何内容。
- **智能体** 为角色提供独立的模型、指令、记忆、工作区、权限模式、例行任务和频道，因此它可以跨对话持续工作。

会话按布局隔离：聊天中的对话不会出现在代码或智能体中，除非你明确把它添加到代码。参见[对话](/docs/conversations#会话与布局)。

## 自带提供商

Zylara 不转售模型访问权。你连接提供商并直接向其付费：

- **OpenCode Go** 和 **OpenCode Zen**（OpenCode Console 密钥）
- **OpenAI** — API 密钥，或通过 **使用 ChatGPT 继续** 使用符合条件的 ChatGPT 套餐
- **Anthropic** — 官方 API，按使用量付费
- **Gemini**
- 另有 21 个基于密钥的提供商（DeepSeek、xAI、Mistral、Moonshot、Z.AI、MiniMax、OpenRouter、Groq、Together、Fireworks、Cerebras、NVIDIA NIM、DeepInfra、SiliconFlow、SambaNova、Scaleway、Novita、Venice AI、Inception、StepFun、Vercel AI Gateway）

内置目录列出 26 个提供商和 464 个模型，并附上下文大小、输出上限、价格、视觉和思考支持。参见[模型与提供商](/docs/models-and-providers)。

## 你可以做什么

| 能力 | 页面 |
| --- | --- |
| 分析文档和图片 | [附件](/docs/attachments) |
| 创建并预览文件 | [产物](/docs/artifacts) |
| 运行代码生成真实格式 | [代码执行](/docs/code-execution) |
| 搜索网页并附上引用 | [网页搜索与来源](/docs/web-search) |
| 获得交互式回答（表格、图表、表单） | [生成式界面](/docs/generative-ui) |
| 在仓库中工作 | [工作台](/docs/code-workbench) |
| 运行长期目标 | [目标与任务](/docs/goals-and-tasks) |
| 保留具有记忆和定时的助手 | [智能体](/docs/agents) |
| 添加第三方功能 | [插件](/docs/plugins) |

## Zylara 不是什么

- **不是云服务。** 没有托管版本；关闭应用会停止一切，包括已安排的例行任务和正在等待轮次的目标。
- **默认不是沙箱。** 代码执行以你的用户权限运行。Docker 命令沙箱需要手动开启，只覆盖 `run_command` 一类工具，不包括 `run_code`。参见[代码执行](/docs/code-execution#安全)。
- **不是 IDE。** 工作台可以读取、比较差异、提交并运行终端，但它不能替代编辑器完成大规模重构。
- **不是模型。** 模型行为、限制和价格来自提供商；应用只显示提供商报告的内容。

## 平台与项目

Zylara 运行在 Windows 10/11（WebView2）、macOS 11+（arm64）和 Linux（`.deb`、`.rpm`、`.AppImage`）上。它是采用 MIT 许可证的开源项目，在没有商业计划的情况下维护；这一说明描述项目的宗旨，不限制许可证授予的权利。

下一步：[安装](/docs/installation)。
