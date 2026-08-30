---
name: to-spec
description: 把当前对话变成一份 spec 并发布到项目的 issue tracker——不做访谈，只是把你们已经讨论过的内容综合起来。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

这个 skill 拿当前对话的上下文和对代码库的理解，产出一份 spec。**不要**采访用户——只综合你已经知道的东西。

Issue tracker 和 triage label 词汇应该已经提供给你了——如果没有，运行 `/setup-matt-pocock-skills`。

## Process

1. 如果还没探索过仓库，先探索一遍，了解代码库当前的状态。整份 spec 全程使用项目的领域词汇表，并尊重你所触碰区域里的任何 ADR。

2. 勾画出你打算用来测试这个功能的 seams。优先用已有的 seams，而不是新建的。尽量用最高层次的 seam。如果确实需要新的 seams，尽量在你能达到的最高点提出它们。整个代码库里 seams 越少越好——理想数量是一个。

和用户确认这些 seams 是否符合他们的预期。

3. 用下面的模板写这份 spec，然后发布到项目的 issue tracker。打上 `ready-for-agent` 这个 triage label——不需要额外的 triage。

<spec-template>

## Problem Statement

从用户的视角描述他们正面临的问题。

## Solution

从用户的视角描述这个问题的解决方案。

## User Stories

一份很长的、编了号的 user stories 列表。每条 user story 都应该是这个格式：

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

这份 user stories 列表应该极其详尽，覆盖这个功能的所有方面。

## Implementation Decisions

已经做出的实现决策列表。可以包括：

- 将会被构建/修改的模块
- 那些将被修改的模块的接口
- 来自开发者的技术澄清
- 架构决策
- Schema 变更
- API 合约
- 具体的交互方式

**不要**包含具体的文件路径或代码片段。它们很快就会过时。

例外：如果一个 prototype 产出了一段代码片段，它比文字更精确地承载了某个决策（state machine、reducer、schema、类型形状），就把它内联在对应的决策里，并简要注明它来自一个 prototype。只保留决策相关的部分——不是一个能跑的 demo，只要关键的那几点。

## Testing Decisions

已经做出的测试决策列表。包括：

- 什么样才算好测试的说明（只测试外部行为，不测试实现细节）
- 哪些模块会被测试
- 测试的既有范例（也就是代码库里类似类型的测试）

## Out of Scope

描述这份 spec 不涉及的内容。

## Further Notes

关于这个功能的其他任何补充说明。

</spec-template>
