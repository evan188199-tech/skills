[English](README.md) · [简体中文](README.zh-CN.md)

# 文档阅读指南

这个目录存放面向人的技能说明。`skills/` 下的 `SKILL.md` 是智能体加载的操作指令；这里的说明则解释每个技能适合什么时候用、各条工作流如何衔接，以及好的结果长什么样。

## 从这里开始

1. 按[根 README](../README.zh-CN.md#安装30-秒配置)安装这些技能。
2. 在你的仓库里运行一次 `/setup-matt-pocock-skills`，说明见 [setup-matt-pocock-skills](engineering/setup-matt-pocock-skills.zh-CN.md)。
3. 如果你不知道该选哪个技能，先读 [ask-matt](engineering/ask-matt.zh-CN.md)。它会帮你在常用入口之间路由。
4. 想理解这些技能背后的写作原则，读 [writing-for-agents](productivity/writing-for-agents.zh-CN.md)。

## 按目标选择路径

| 你想做什么 | 阅读这些指南 |
| --- | --- |
| 在构建前理清一个模糊想法 | [grill-me](productivity/grill-me.zh-CN.md)、[grilling](productivity/grilling.zh-CN.md)、[grill-with-docs](engineering/grill-with-docs.zh-CN.md) |
| 规划跨多个会话的工作 | [wayfinder](engineering/wayfinder.zh-CN.md)、[to-spec](engineering/to-spec.zh-CN.md)、[to-tickets](engineering/to-tickets.zh-CN.md) |
| 实现并验证一次修改 | [implement](engineering/implement.zh-CN.md)、[tdd](engineering/tdd.zh-CN.md)、[code-review](engineering/code-review.zh-CN.md) |
| 调查 bug 或开放问题 | [diagnosing-bugs](engineering/diagnosing-bugs.zh-CN.md) 和 [research](engineering/research.zh-CN.md) |
| 长期改善代码库结构 | [codebase-design](engineering/codebase-design.zh-CN.md) 和 [improve-codebase-architecture](engineering/improve-codebase-architecture.zh-CN.md) |
| 维护共享语言和决策记录 | [domain-modeling](engineering/domain-modeling.zh-CN.md)，再看 [grill-with-docs](engineering/grill-with-docs.zh-CN.md) |
| 在人和会话之间传递知识 | [handoff](productivity/handoff.zh-CN.md)、[to-questionnaire](productivity/to-questionnaire.zh-CN.md)、[teach](productivity/teach.zh-CN.md) |

## 主工作流如何衔接

主构建链是：

```txt
grill-with-docs -> to-spec -> to-tickets -> implement -> code-review
```

不是每次修改都需要每一步：

- 如果工作能装进一个会话，先 grilling，然后直接进入 `implement`。
- 如果工作跨多个会话，先写一份能留存的 [spec](engineering/to-spec.zh-CN.md)，再拆成 [tickets](engineering/to-tickets.zh-CN.md)。
- 如果工作大到无法线性规划，先用 [wayfinder](engineering/wayfinder.zh-CN.md) 绘制决策地图，再回到 spec 和 tickets 链条。
- 如果一个设计问题无法靠讨论回答，停下来构建 [prototype](engineering/prototype.zh-CN.md)。
- 如果你在任何边界上拿不准，用 [ask-matt](engineering/ask-matt.zh-CN.md) 选择下一个技能。

## 指南索引

### 基础和路由

| 指南 | 什么时候读 |
| --- | --- |
| [ask-matt](engineering/ask-matt.zh-CN.md) | 需要帮忙选择技能或工作流。 |
| [setup-matt-pocock-skills](engineering/setup-matt-pocock-skills.zh-CN.md) | 正在为一个仓库准备工程类技能。 |
| [writing-for-agents](productivity/writing-for-agents.zh-CN.md) | 正在写或改智能体会读取的指令。 |

### 决策和规划

| 指南 | 什么时候读 |
| --- | --- |
| [grill-me](productivity/grill-me.zh-CN.md) | 有一个模糊想法，需要无状态访谈；不一定和代码有关。 |
| [grilling](productivity/grilling.zh-CN.md) | 想理解各个 grilling 工作流复用的访谈原语。 |
| [grill-with-docs](engineering/grill-with-docs.zh-CN.md) | 需要把想法和代码库对齐，并记录结果。 |
| [domain-modeling](engineering/domain-modeling.zh-CN.md) | 正在建立或打磨项目共享词汇和 ADR。 |
| [wayfinder](engineering/wayfinder.zh-CN.md) | 工作量超过一个会话，需要决策地图。 |
| [to-spec](engineering/to-spec.zh-CN.md) | 决策已经定下，需要跨会话留存。 |
| [to-tickets](engineering/to-tickets.zh-CN.md) | 需要把 spec 或计划拆成带阻塞边的 tracer-bullet 工单。 |
| [triage](engineering/triage.zh-CN.md) | 需要把新进入的 issue 变成定义清楚、可开工的工作。 |

### 构建和评审

| 指南 | 什么时候读 |
| --- | --- |
| [implement](engineering/implement.zh-CN.md) | spec 或工单集已经可以构建。 |
| [tdd](engineering/tdd.zh-CN.md) | 希望实现由红绿重构反馈循环驱动。 |
| [prototype](engineering/prototype.zh-CN.md) | 一个设计问题需要能实际反应的东西。 |
| [code-review](engineering/code-review.zh-CN.md) | diff 需要同时按仓库标准和 spec 评审。 |

### 调查和维护

| 指南 | 什么时候读 |
| --- | --- |
| [diagnosing-bugs](engineering/diagnosing-bugs.zh-CN.md) | bug 或性能回归需要有纪律的诊断循环。 |
| [research](engineering/research.zh-CN.md) | 问题需要高可信原始来源和带引用的结论。 |
| [resolving-merge-conflicts](engineering/resolving-merge-conflicts.zh-CN.md) | merge 或 rebase 需要按意图解决冲突。 |
| [codebase-design](engineering/codebase-design.zh-CN.md) | 需要 deep module 和干净 seam 的共享词汇。 |
| [improve-codebase-architecture](engineering/improve-codebase-architecture.zh-CN.md) | 想定期扫描架构深化机会。 |

### 协作和教学

| 指南 | 什么时候读 |
| --- | --- |
| [handoff](productivity/handoff.zh-CN.md) | 工作必须迁移到另一个 harness、目录、人或会话。 |
| [to-questionnaire](productivity/to-questionnaire.zh-CN.md) | 答案在别人手里，需要异步问卷。 |
| [teach](productivity/teach.zh-CN.md) | 想要一个带引用课程的状态化教学工作区。 |
| [wait-what](productivity/wait-what.zh-CN.md) | 智能体一条消息没讲明白，需要平实重讲。 |
| [wizard](engineering/wizard.zh-CN.md) | 人类需要完成手工步骤，需要交互式向导。 |

## 新用户阅读顺序

如果你刚接触这个项目，下面四篇能给你核心模型：

1. [setup-matt-pocock-skills](engineering/setup-matt-pocock-skills.zh-CN.md)
2. [grill-me](productivity/grill-me.zh-CN.md)
3. [grill-with-docs](engineering/grill-with-docs.zh-CN.md)
4. [implement](engineering/implement.zh-CN.md)
