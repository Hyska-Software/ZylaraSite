---
title: 概览
description: Zylara 是本地优先的桌面应用，用于在你自己的机器上与 AI 模型对话、创建文件并运行编程智能体。
---

Zylara 是用于在你自己的电脑上使用 AI 模型的桌面应用。对话、附件、生成的文件和智能体记忆都保存在本地的数据文件夹中；请求直接发送到你连接的提供商。

它内置三种共用同一套引擎的布局：

| 布局 | 用途 | 从这里开始 |
| --- | --- | --- |
| **聊天** | 提问、分析文档、创建文件、搜索网页 | [界面](/docs/interface) |
| **代码** | 在文件夹里工作：读取、编辑、运行命令、审阅差异、提交 | [工作区与会话](/docs/code-workspaces) |
| **智能体** | 具有记忆、例行任务、频道和可选电脑操作的长期角色 | [智能体](/docs/agents) |

## 三种开始方式

1. **刚安装好？** 按照[快速上手](/docs/first-steps)操作：连接提供商、选择模型，然后发送第一条消息。
2. **想要文件？** 请求一份报告、表格或图片，并阅读[产物](/docs/artifacts)，了解结果如何预览和保存。
3. **有代码库？** 在代码布局中打开该文件夹，并在让智能体编辑任何内容之前阅读[权限与批准](/docs/permissions-and-approvals)。

## 你可以做什么

- 与来自 26 个提供商的 464 个模型对话，包括 OpenCode Go 和 Zen、OpenAI（API 密钥或你的 ChatGPT 套餐）、Anthropic 和 Gemini。参见[模型与提供商](/docs/models-and-providers)。
- 将 PDF、DOCX、XLSX、PPTX、文本、代码和图片作为上下文发送 — 参见[附件](/docs/attachments)。
- 拿回真实文件（Markdown、HTML、CSV、JSON、代码、PDF、Office、图片、音频、视频、ZIP），每种格式都有预览 — 参见[产物](/docs/artifacts)。
- 让智能体运行 Python 或 Node 来构建这些文件，需要手动开启且范围有限 — 参见[代码执行](/docs/code-execution)。
- 在真实文件夹上工作，带有差异、批准、提交和终端 — 参见[工作台](/docs/code-workbench)。
- 按轮次推进长期目标，而不是一次只处理一条消息 — 参见[目标与任务](/docs/goals-and-tasks)。
- 保留具有记忆、定时和共享频道的智能体 — 参见[智能体](/docs/agents)。
- 用签名的插件扩展应用 — 参见[插件](/docs/plugins)。

## 本文档的组织方式

| 部分 | 页面 |
| --- | --- |
| **从这里开始** | 概览、[Zylara 是什么](/docs/introduction)、[安装](/docs/installation)、[快速上手](/docs/first-steps) |
| **聊天** | [界面](/docs/interface)、[对话](/docs/conversations)、[模型与提供商](/docs/models-and-providers)、[附件](/docs/attachments)、[产物](/docs/artifacts)、[资料库](/docs/library)、[网页搜索与来源](/docs/web-search)、[生成式界面](/docs/generative-ui)、[Markdown 与数学](/docs/markdown-and-math) |
| **工具** | [代码执行](/docs/code-execution)、[技能](/docs/skills)、[自定义](/docs/customization) |
| **代码** | [工作区与会话](/docs/code-workspaces)、[工作台](/docs/code-workbench)、[权限与批准](/docs/permissions-and-approvals)、[目标与任务](/docs/goals-and-tasks) |
| **智能体** | [智能体](/docs/agents)、[例行任务与队列](/docs/routines-and-queues)、[频道与团队](/docs/channels-and-teams)、[电脑操作](/docs/computer-use) |
| **参考** | [插件](/docs/plugins)、[设置参考](/docs/settings-reference)、[键盘快捷键](/docs/keyboard-shortcuts)、[数据与隐私](/docs/data-and-privacy)、[疑难解答](/docs/troubleshooting) |

## 环境要求一览

- Windows 10/11、macOS 11+（arm64），或能够运行 `.deb`、`.rpm` 或 `.AppImage` 包的 Linux 发行版。
- 一份提供商凭据：OpenCode Console 密钥、OpenAI 密钥或 ChatGPT 账户、Anthropic 密钥、Gemini 密钥，或其他受支持的提供商之一。
- 可选：用于[代码执行](/docs/code-execution)的 Python 3.9+ 和/或 Node，用于[命令沙箱](/docs/permissions-and-approvals#docker-命令沙箱)和[电脑操作](/docs/computer-use)的 Docker。

本文档描述 Zylara **0.13.1**。任何依赖版本的内容（安装程序、更新、模型目录）都在页面中标明。
