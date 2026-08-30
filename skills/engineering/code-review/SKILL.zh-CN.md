---
name: code-review
description: 审查自某个固定起点（commit、branch、tag 或 merge-base）以来的改动，从两个维度进行——Standards（代码是否符合本仓库文档化的编码规范？）和 Spec（代码是否符合对应 issue/spec 的要求？）。用并行的 sub-agents 分别跑两次审查，并列展示结果。适用于用户想审查一个分支、一个 PR、进行中的改动，或要求"review since X"的场景。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

对 `HEAD` 与用户提供的固定起点之间的 diff 做双轴审查：

- **Standards** —— 代码是否符合本仓库文档化的编码规范？
- **Spec** —— 代码是否忠实实现了对应的 issue / spec？

两个维度都作为**并行的 sub-agents** 运行，避免互相污染上下文，然后这个 skill 汇总它们的发现。

Issue tracker 应该已经提供给你了——如果 `docs/agents/issue-tracker.md` 不存在，运行 `/setup-matt-pocock-skills`。

## Process

### 1. 钉住固定起点

用户说的就是固定起点——一个 commit SHA、branch 名、tag、`main`、`HEAD~5` 等等。如果他们没有指定，就问。

一次性记下 diff 命令：`git diff <fixed-point>...HEAD`（三个点，这样对比的是相对 merge-base 的差异）。同时通过 `git log <fixed-point>..HEAD --oneline` 记下 commit 列表。

在继续之前，先确认这个固定起点能被解析（`git rev-parse <fixed-point>`），并且 diff 非空。一个错误的 ref 或空 diff 应该在这里就失败——而不是在两个并行 sub-agents 内部才发现。

### 2. 确定 spec 来源

按以下顺序寻找对应的 spec：

1. Commit messages 里的 issue 引用（`#123`、`Closes #45`、GitLab 的 `!67` 等）——通过 `docs/agents/issue-tracker.md` 里的流程去获取。
2. 用户作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与 branch 名或 feature 匹配的 spec 文件。
4. 如果都没找到，问用户 spec 在哪。如果他们说没有，**Spec** sub-agent 就跳过，并报告"no spec available"。

### 3. 确定 standards 来源

仓库中任何记录代码该怎么写的文档，比如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

在仓库文档记录的内容之上，Standards 这个维度始终额外携带下面这份 **smell baseline**——一套固定的 Fowler code smells（出自《重构》第 3 章），即使仓库什么都没文档化，它也照样适用。两条规则约束它：

- **仓库优先。** 一条文档化的仓库规范永远优先；如果它明确认可了某个会被 baseline 标记出来的东西，就压制那条 smell。
- **永远是判断，不是铁律。** 每条 smell 都是一个带标签的启发式判断（"possible Feature Envy"），绝不是硬性违规——而且和这里的任何标准一样，跳过任何已经由工具强制执行的东西。

每条 smell 都按 *是什么* → *怎么修* 来读；拿它去对照 diff：

- **Mysterious Name** —— 一个函数、变量或类型的名字没能说明它做什么、装的是什么。→ 重命名；如果想不出一个诚实的名字，说明设计本身就是模糊的。
- **Duplicated Code** —— 同样的逻辑形状在改动里的多个 hunk 或文件中重复出现。→ 把共同的形状提取出来，两边都调用它。
- **Feature Envy** —— 一个方法伸手取用另一个对象的数据，比取用自己的数据还多。→ 把这个方法搬到它"惦记"的那份数据上去。
- **Data Clumps** —— 同样几个字段或参数总是结伴出现（一个渴望诞生的类型）。→ 把它们捆成一个类型，传这个类型。
- **Primitive Obsession** —— 一个原始类型或字符串代替了一个本该有自己类型的领域概念。→ 给这个概念一个属于它自己的小类型。
- **Repeated Switches** —— 针对同一个类型的同一套 `switch`/`if`-级联在改动里反复出现。→ 换成多态，或者一张两处共用的 map。
- **Shotgun Surgery** —— 一次逻辑上的改动迫使 diff 里散落在很多文件中的编辑。→ 把会一起变化的东西收拢进一个模块。
- **Divergent Change** —— 一个文件或模块因为好几个不相关的原因被编辑。→ 拆分，让每个模块只因一个原因而变化。
- **Speculative Generality** —— 为 spec 里没有的需求添加的抽象、参数或钩子。→ 删掉它；内联回去，直到出现真正的需求。
- **Message Chains** —— 调用方不该依赖的、很长的 `a.b().c().d()` 式导航链。→ 把这段遍历藏在第一个对象上的一个方法背后。
- **Middle Man** —— 一个基本上只是把调用转发出去的类或函数。→ 删掉它，直接调用真正的目标。
- **Refused Bequest** —— 一个子类或实现者忽略或覆盖了它继承来的大部分东西。→ 去掉继承关系，改用组合。

### 4. 并行启动两个 sub-agents

**Standards sub-agent 的 prompt** —— 包含：

- 完整的 diff 命令和 commit 列表。
- 第 3 步里找到的 standards 来源文件列表，**外加第 3 步里的 smell baseline 全文粘贴进去**——sub-agent 没有其他途径能拿到它。
- 简报内容："逐文件/逐 hunk 报告（在相关的地方）：(a) diff 中每一处违反已文档化标准的地方：引用具体标准（文件 + 规则）；(b) 你发现的任何 baseline smell：命名它，并引用对应的 hunk。区分硬性违规和判断性发现——文档化标准的违反可以是硬性的，但 baseline smells 永远是判断性的，而且一条文档化的仓库规范优先于 baseline。跳过任何已经由工具强制执行的东西。控制在 400 词以内。"

**Spec sub-agent 的 prompt** —— 包含：

- diff 命令和 commit 列表。
- spec 的路径或已获取的内容。
- 简报内容："报告：(a) spec 要求但缺失或只完成一部分的需求；(b) diff 中出现了但没被要求的行为（scope creep）；(c) 看起来已实现、但实现方式看起来不对的需求。每条发现都引用对应的 spec 原文。控制在 400 词以内。"

如果 spec 缺失，跳过 Spec sub-agent，并在最终报告里注明。

### 5. 汇总

在 `## Standards` 和 `## Spec` 两个标题下，原样或轻微整理后展示这两份报告。**不要**合并或重新排序这些发现——这两个维度是刻意分开的（见 _Why two axes_）。

最后以一行摘要收尾：每个维度的发现总数，以及*每个维度内部*最严重的问题（如果有的话）。不要跨维度挑出一个"最严重"——那正是这次拆分想要避免的重新排序。

## Why two axes

一次改动可能一个维度过、另一个维度不过：

- 代码严格遵循每一条规范，但实现了错误的东西 → **Standards 通过，Spec 不通过。**
- 代码完全按 issue 的要求做了，但破坏了项目的约定 → **Spec 通过，Standards 不通过。**

分开报告能防止一个维度掩盖另一个维度。
