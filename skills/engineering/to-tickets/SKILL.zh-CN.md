---
name: to-tickets
description: 把一份 plan、spec 或当前对话拆成一组 tracer-bullet tickets，每个都声明自己的阻塞关系，发布到已配置的 tracker——本地是每个 ticket 一个文件、以文本形式写阻塞关系，真实 tracker 上则是原生阻塞链接。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# To Tickets

把一份 plan、spec 或对话拆成一组 **tickets**——tracer-bullet 垂直切片，每个都声明**阻塞**它的那些 tickets。

Issue tracker 和 triage label 词汇应该已经提供给你了——如果没有，运行 `/setup-matt-pocock-skills`。

## Process

### 1. Gather context

基于对话上下文里已有的一切来工作。如果用户传入了一个引用作为参数（一个 spec 路径、一个 issue 编号或 URL），把它取回来，读它完整的正文和评论。

### 2. Explore the codebase（可选）

如果还没探索过代码库，先探索一遍，了解代码当前的状态。Ticket 的标题和描述应该使用项目的领域词汇表，并尊重你所触碰区域里的 ADR。

寻找能对代码做 prefactor 的机会，让后续实现更容易。"先让改动变容易，再做那个容易的改动。"

### 3. Draft vertical slices

把工作拆成 **tracer bullet** tickets。

<vertical-slice-rules>

- 每个切片都要切出一条窄但完整的、贯穿每一层（schema、API、UI、测试）的路径——是垂直的，**不是**某一层的水平切片
- 一个完成的切片应该能独立演示或验证
- 每个切片的大小要能装进单个全新的上下文窗口
- 任何 prefactoring 都应该先做完

</vertical-slice-rules>

给每个 ticket 标上它的**阻塞关系**——那些必须先完成、这个 ticket 才能开始的其他 tickets。一个没有阻塞项的 ticket 可以立刻开始。

**宽幅重构是垂直切片的例外。** 一次**宽幅重构（wide refactor）**是一次机械性的改动——重命名一个字段、给一个共享符号改类型——它的**波及范围（blast radius）**会扩散到整个代码库，所以一次编辑就会同时打破成千上万个调用点，没有哪个垂直切片能顺利落地。不要硬把它塞进一颗 tracer bullet 里；改用 **expand–contract** 的顺序来编排。先 expand：在旧形式旁边加上新形式，这样什么都不会坏。然后按波及范围分批（按 package、按目录）把调用点迁移过去，每一批都是自己的一个 ticket，被那次 expand 阻塞，因为旧形式还在，所以每批之间 CI 始终保持绿色。最后 contract：等没有调用方还在用旧形式了，就删掉它，这个 ticket 被每一批迁移阻塞。当即使是单独一批也没法保持绿色时，保留这个顺序，但让它们共享一个 integration 分支，这些分支都阻塞一个最终的 integrate-and-verify ticket——只有在那里才承诺是绿色的。

### 4. Quiz the user

把提议的拆分方案以一个编号列表的形式展示出来。对每个 ticket，展示：

- **Title**：简短的描述性名称
- **Blocked by**：（如果有的话）哪些其他 tickets 必须先完成
- **What it delivers**：这个 ticket 让什么端到端行为跑起来了

问用户：

- 这个粒度感觉对吗？（太粗/太细）
- 阻塞关系对吗——每个 ticket 是不是只依赖真正卡住它的那些 tickets？
- 有没有 tickets 该合并或者进一步拆分？

反复迭代，直到用户认可这份拆分方案。

### 5. Publish the tickets to the configured tracker

发布这些已获批准的 tickets。**具体怎么发**取决于 `/setup-matt-pocock-skills` 配置的是哪种 tracker——tickets 本身是一样的，只有阻塞关系的表现形式不同：

- **本地文件** → 在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下为每个 ticket 写一个文件，按依赖顺序（阻塞项在前）从 `01` 开始编号。每个文件的 "Blocked by" 列出它依赖的编号/标题。用下面的单 ticket 文件模板——一个 ticket 一个文件，绝不用单个合并文件。
- **一个真实的 issue tracker（GitHub、Linear……）** → 按依赖顺序（阻塞项在前）为每个 ticket 各发布一个 issue，这样每个 ticket 的阻塞关系就能引用真实的标识符。如果平台有原生的阻塞/子 issue 关系，就用它；否则把每个 ticket 的 "Blocked by" 设为那些阻塞它的 issues。除非另有指示，否则打上 `ready-for-agent` 这个 triage label——这些 tickets 从设计上就是可以直接被 agent 拿走的。

处理 **frontier**：任何阻塞项已全部完成的 ticket。对于一条纯线性的链，这就意味着从上到下依次处理。

**不要**关闭或修改任何 parent issue。

<local-ticket-template>

# <NN> — <Ticket title>

**What to build：** 这个 ticket 让什么端到端行为跑起来了，从用户视角描述——不是逐层的实现清单。

**Blocked by：** 卡住这个 ticket 的那些 tickets 的编号/标题，或者 "None — can start immediately"。

**Status：** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

指向 tracker 上 parent issue 的引用（如果来源是一个已有 issue；否则省略这一节）。

## What to build

这个 ticket 让什么端到端行为跑起来了，从用户视角描述——不是逐层的实现清单。

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- 每个阻塞 ticket 的引用，或者 "None — can start immediately"。

</issue-template>

不管用哪种形式，都要避免具体的文件路径或代码片段——它们很快就会过时。例外：如果一个 prototype 产出了一段代码片段，它比文字更精确地承载了某个决策（state machine、reducer、schema、类型形状），就把它内联进去，并简要注明它来自一个 prototype。只保留决策相关的部分——不是一个能跑的 demo，只要关键的那几点。
