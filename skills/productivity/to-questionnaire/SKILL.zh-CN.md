---
name: to-questionnaire
description: 把一个你没法完全独立回答的决策，变成一份让别人填写的问卷。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

把用户一个人回答不了的东西，变成一份**问卷（questionnaire）**——一份 Markdown 文档，交给某一个人异步填写，或者在会上一起填。收件人拥有用户所欠缺的知识；这份问卷就是要把它从他们那里挖出来。

**盘问"怎么发"，而不是"发什么"。** 只就*这次发送*本身采访用户——这是他们随时都能回答的：发给谁，以及他们需要拿回什么。文档里的问题则瞄准收件人知道的东西和用户需要的东西之间的**缺口**。

1. **发给谁？** 一次交流内问清楚：收件人的角色、专业领域，以及和用户的关系。这决定了这份问卷的语气，以及它需要携带多少背景信息。完成标志：你知道收件人是谁，以及他们知道哪些用户不知道的东西。

2. **你需要拿回什么？** 一次交流内问清楚：用户一个人解决不了、需要从这个人那里获得的具体决策或事实。完成标志：你有了一份具体的清单，列出用户离开这次交流后必须能做到或决定的事情。

3. **写这份问卷。** 针对第 1-2 步找出的缺口起草问题，遵循下面的 Document structure。写到当前目录下的 `to-questionnaire-<slug>.md`（slug 来自主题），并报告这个路径。完成标志：文件存在，且用户在第 2 步里点名的每一项都被某个问题覆盖到了。

## Document structure

把这份文档定位成一份**探索式问卷**：用户缺乏背景信息，收件人拥有它。问题按重要性从高到低排序——异步意味着你可能只有一次机会——一旦问题超过几个，就按主题分组到 `##` 标题下。用下面的模板来写。

<questionnaire-template>

# <Questionnaire title>

**Purpose：** 为什么会有这份问卷，以及它牵涉到的决策。

**From：** <the user> —— **To：** <the recipient> —— **How your answers will be used：** <where they go>

## Context

一段话，让一个不在用户脑子里的收件人也能进入状态。够回答好这个问题就行，不要写成一整页。

## How to answer

截止时间和大致所需精力。部分回答和"我不知道"也是有用的——对任何拿不准的地方标出来，而不是跳过它。

## <Theme heading>

一个主题一个 `##` 小节。每个小节下面是它的问题，按重要性从高到低排列。每个问题只表达一个想法——绝不复合提问——下面紧跟一个待填写的答案占位，只有在这个问题可能被误读、或者容易招来一个随便应付的答案时，才加一行 _why this matters_。

<question-example>
### What load is the system expected to handle at launch?

_Why this matters: it decides whether we provision for burst traffic now or defer it._

>
</question-example>

## Anything else?

结尾的兜底问题：还有什么我们没问到、但应该知道的？

</questionnaire-template>
