---
name: improve-codebase-architecture
description: 扫描代码库，找出可以做深的机会，用一份可视化 HTML 报告呈现出来，然后针对你挑选的那一项做一次 grilling。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Improve Codebase Architecture

找出架构上的摩擦点，提出**可以做深的机会**——把 shallow modules 变成 deep modules 的重构。目标是可测试性和 AI 可导航性。

这个命令会*参考*项目的领域模型，并建立在一套共享设计词汇之上：

- 运行 `/codebase-design` skill 获取架构词汇（**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**）及其原则（删除测试法、"接口就是测试面"、"一个 adapter = 假想的 seam，两个 = 真实的 seam"）。在每条建议里都严格使用这些术语——不要漂移成 "component"、"service"、"API" 或 "boundary"。
- `CONTEXT.md` 里的领域语言为好的 seam 命名；`docs/adr/` 里的 ADR 记录了这个命令不该重新翻案的决策。

## Process

### 1. Explore

**先划定范围再扫描——YAGNI。** 把一个模块做深，回报体现在让它未来的改动变得更容易，所以要格外重视代码库里最近改动过的部分。在开始查看之前先决定*该看哪里*：

- 如果用户指定了一个方向——一个模块、一个子系统、一个痛点——就用它，跳过下面的推断步骤。
- 否则，往回翻一段足够长的 commit 历史（`git log --oneline`），找出代码库的热点——那些反复出现的文件和区域——让这些路径优先吸引你的注意力。如果改动很分散、没有明显热点，就把范围放宽。

先读一遍项目的领域词汇表（`CONTEXT.md`）和你要触碰区域里的任何 ADR。

然后启动一个 sub-agent 去走查代码库。不要遵循僵化的启发式规则——有机地探索，记下你感受到摩擦的地方：

- 哪里理解一个概念需要在很多小模块之间来回跳转？
- 哪些模块是**shallow**的——接口几乎和实现一样复杂？
- 哪里为了可测试性而把纯函数抽了出来，但真正的 bug 却藏在这些函数是怎么被调用的这件事上（没有 **locality**）？
- 哪里紧耦合的模块跨越了它们的 seam 互相渗漏？
- 代码库的哪些部分没有测试，或者透过它们现有的接口很难测试？

对任何你怀疑是 shallow 的东西套用**删除测试法**：删掉它会让复杂性集中，还是只是把它挪了个地方？"是的，会集中"就是你要找的信号。

### 2. Present candidates as an HTML report

把一个自包含的 HTML 文件写到操作系统的临时目录里，这样它就不会留在仓库中。从 `$TMPDIR` 解析临时目录，取不到就退回 `/tmp`（Windows 上是 `%TEMP%`），写到 `<tmpdir>/architecture-review-<timestamp>.html`，这样每次运行都会得到一个全新的文件。为用户打开它——Linux 上用 `xdg-open <path>`，macOS 上用 `open <path>`，Windows 上用 `start <path>`——并告诉他们绝对路径。

这份报告用 **CDN 引入的 Tailwind** 做布局和样式，在图/流程/时序能可靠传达结构的地方用 **CDN 引入的 Mermaid** 画图。把 Mermaid 和手写的 CSS/SVG 视觉效果混着用——当关系呈图状（调用图、依赖关系、时序）时用 Mermaid，当你想要更偏"编辑设计"的效果时（体量对比图、剖面图、折叠动画）用手写的 divs/SVG。每个候选项都配一张**前后对比可视化图**。要有视觉冲击力。

对每个候选项，渲染一张卡片，包含：

- **Files** —— 涉及哪些文件/模块
- **Problem** —— 为什么现在的架构会造成摩擦
- **Solution** —— 用大白话描述会改变什么
- **Benefits** —— 用 locality 和 leverage 来解释，以及测试会如何变好
- **Before / After diagram** —— 并排展示、手工绘制，说明 shallowness 和做深之后的效果
- **Recommendation strength** —— `Strong`、`Worth exploring`、`Speculative` 三选一，渲染成一个徽章

在报告末尾加一个 **Top recommendation** 小节：你会优先处理哪个候选项，以及为什么。

**领域相关内容用 CONTEXT.md 的词汇，架构相关内容用 `/codebase-design` 的词汇。** 如果 `CONTEXT.md` 定义了 "Order"，就说 "the Order intake module"——不要说 "the FooBarHandler"，也不要说 "the Order service"。

**ADR 冲突**：如果某个候选项和一份现有 ADR 冲突，只有在这个摩擦真的严重到值得重新审视那份 ADR 时才把它展示出来。在卡片里明确标出（例如一个警告提示："_contradicts ADR-0007 — but worth reopening because…_"）。不要把 ADR 禁止的每一个理论上可行的重构都列出来。

完整的 HTML 骨架、图表模式和样式指南见 [HTML-REPORT.md](HTML-REPORT.md)。

**先不要**提议具体接口。文件写好后，问用户："这些里面你想深入探索哪一个？"

### 3. Grilling loop

用户选定一个候选项后，运行 `/grilling` skill，和他们一起走一遍决策树——约束条件、依赖关系、做深后模块的形状、seam 背后放什么、哪些测试能存活下来。

副作用会在决策成型的当下就地发生——边做边运行 `/domain-modeling` skill，保持领域模型的更新：

- **给做深后的模块起了一个 `CONTEXT.md` 里没有的概念名？** 把这个术语加进 `CONTEXT.md`。如果文件不存在就按需创建。
- **在对话中打磨了一个模糊的术语？** 就在当场更新 `CONTEXT.md`。
- **用户以一个有分量的理由否决了这个候选项？** 提议写一份 ADR，措辞类似："_要不要我把这个记录成一份 ADR，这样以后的架构复盘就不会再重复建议这一条了？_" 只有当这个理由确实是未来的探索者需要用来避免重复建议同一件事时才提议——跳过那些临时性的理由（"现在还不值得"）和不言自明的理由。
- **想为做深后的模块探索多种备选接口？** 运行 `/codebase-design` skill，用它的 design-it-twice 并行 sub-agent 模式。
