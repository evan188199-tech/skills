---
name: loop-me
description: 在这个工作区里，就我想构建的那些 workflow 的 specs 反复追问我。
disable-model-invocation: true
argument-hint: "想设计的一个 workflow，不填就去找一个"
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

跑一次有状态的 `/grilling` session，它唯一的产出就是 **workflow** specs。使用 grilling 的纪律——连番追问，一次一轮问题，每个都附上一个推荐答案——瞄准下面的词汇表和目标。随着 grilling 推进结果，创建、编辑、删除 specs。

## The loop lens

一个 **loop** 是用户生活中反复出现的一种模式：他们的职业生涯、他们的一周、他们的早晨，或者单个重复的活动。把生活想象成一层层嵌套的 loops，能揭示出它的各项活动到底有多可预测——这正是让它们值得被**委托**出去的原因。用这个视角去找值得写成 spec 的 loops，并主动提议一些用户还没注意到的。

一个 **workflow** 是一个 loop 的 spec，被落到实处。你在一个 loop 上运行一个 workflow——这个 loop 就是它正在运行的那个实例。Workflows 存放在 `workflows/*.md` 里，是唯一权威来源。

## Vocabulary

一套共享语言，只有当一个 workflow 确实需要时才使用——绝不是一份清单。**不强制要求任何结构性的东西**：除非 grilling 显示出确实需要，否则一个 workflow 不需要 AI、不需要 checkpoint，也不需要 schedule。

- **Trigger** —— 触发每次运行的东西：一个**事件**（一封新邮件、一个新 issue）或一个**日程**（每天早上）。事件触发通常效率更高。
- **Checkpoint** —— 一个 human-in-the-loop 的点，用户被要求在此验证或做决定。有些 workflows 完全没有这个点、自主运行；有些则完全不用 AI。
- **Push right** —— 把 checkpoint 尽量往后推。在牵扯人类之前尽量把工作做完，这样他们只会被问一次，问得晚，而且一切都已经准备好了。
- **Brief** —— 一个 checkpoint 呈现的东西：一份精炼的、可以直接做决定的摘要——产出了什么、为什么，以及一个指向那份 asset 本身的链接——绝不是原始输出。用户读的是一份 brief，不是一份草稿。审阅速度是硬性要求。

## Definition of done

一份 workflow spec 完成的标志是：一个负责实现的 agent 不用问任何一个问题就能把它构建出来。持续 grilling 直到那一刻；只要还有一个问题悬而未决，就没有完成。

## The workspace

- `workflows/*.md` —— 一个 workflow 一份 spec。
- `NOTES.md` —— 关于用户的世界的原始笔记：他们用的工具、他们处理的渠道，以及他们自己对这两者的说法。当它是空的或内容很少时，先就他们的世界采访他们，再动手写任何 spec。随着模糊的术语浮现，把它们打磨成规范说法，并记在这里。
