[English](domain-modeling.md) · [简体中文](domain-modeling.zh-CN.md)

## What it does

`domain-modeling` 在你设计的同时构建并打磨一个项目的**统一语言(ubiquitous language)**——挑战一个和词汇表冲突的术语,在你用了一个模糊的词时逼出一个精确的说法,用一个具体场景对一段关系做压力测试,直到边界变得精确。

它是**主动**的纪律,不是被动的。为了借用其中的词汇而读一遍 `CONTEXT.md`,是任何 skill 都能做的一个一行习惯;这个 skill 是给你在*改动*模型时用的。这正是它会打断你的原因。它会在一个术语被敲定的那一刻——对话进行中——就把它写进 `CONTEXT.md`,而不是在结尾产出一份整理好的词汇表——因为攒到最后的版本是一次 [session](https://www.aihero.dev/ai-coding-dictionary/session) 的摘要,而就地写入的版本才是这次 session 真正的产出。

## When to reach for it

输入 `/domain-modeling`,或者当一个任务合适时,agent 会自动使用它。实际上,自动调用是这个 skill 最薄弱的一环:当 `grill-with-docs` 或 `wayfinder` 说要加载它时,[models](https://www.aihero.dev/ai-coding-dictionary/model) 经常只加载 `grilling`、跳过这一个。如果一次 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session 跑完,`CONTEXT.md` 结尾还是原样没动,说明就是发生了这种情况——直接点名它,和另一个 skill 一起调用。

当问题出在*用词*上时用它:

| 情况 | 该做的事 |
| --- | --- |
| 两个人对 "cancellation" 的理解不一样 | `domain-modeling`——挑一个规范术语,把另一个列在 `_Avoid_` 下面 |
| "Account" 在三个文件里身兼三职 | `domain-modeling`——把它拆成 Customer 和 User |
| 你刚做了一个难以撤销的架构选择 | `domain-modeling`——如果这个选择过了那道门槛,它会提议写一份 ADR |
| 问题出在模块的*形状*上——seam 放哪、接口有多深 | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你想在构建之前把整个计划盘问一遍 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs),它在底层驱动这个 skill |
| 你只是想查一个术语,不想改它 | 什么都不用做。直接读 `CONTEXT.md`。它就是一个文件。 |

## Prerequisites

一开始不需要任何东西。这个 skill 会写入两个地方,而且都是按需创建的:

- 仓库根目录的 **`CONTEXT.md`**,由第一个被敲定的术语创建。在一个根目录有 `CONTEXT-MAP.md` 的仓库里,术语会改写进这份地图指向的那个 context 对应的 `CONTEXT.md` 里。
- **`docs/adr/`**,由第一份过了门槛的 ADR 创建。

开始之前不需要任何东西已经存在,也不会有任何东西被投机性地提前创建。

## Two artifacts, two bars

词汇表和 ADR 遵循不同的标准,把两者混为一谈正是这个 skill 大多数麻烦的根源。

| | `CONTEXT.md` | `docs/adr/NNNN-slug.md` |
| --- | --- | --- |
| 承载 | 术语。一个东西**是**什么,一两句话,被否决的同义词列在 `_Avoid_` 下面 | 一个决策,一到三句话:背景、选择、理由 |
| 写入门槛 | 一个模糊的术语变成了规范说法 | **三条都要满足**:难以撤销、没有上下文会让人意外、是一次真实权衡的结果 |
| 写入方式 | 就地写入,术语敲定的那一刻 | 提议,而不是默认要写 |
| 绝不承载 | 实现细节、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、草稿笔记、通用编程概念 | 这次 session 里做过的每一个决定的流水账 |

三条 ADR 检验只要漏掉一条,就不该有这份 ADR。一个容易撤销的决策反正会被撤销;一个不令人意外的决策没人会去问为什么;一个没有真正备选方案的决策,记下来的只是"我们做了显而易见的事"。

`CONTEXT.md` 那条规则才是真正要牢记的,因为它是在实际使用中最容易被打破的一条。**它只是一份词汇表,仅此而已。** 一旦不加约束,模型会把"写进 `CONTEXT.md`"理解成可以把你给的每个答案都持久化下来的许可,于是这个文件会变成一份不断膨胀的 spec——这是这个 skill 在多个模型上被反映最多的问题。

## Cross-referencing, and where it stops

让这个 skill 真正有用的那个动作是:当你陈述某个东西是怎么运作的时,它会检查代码,并把矛盾之处摆出来。*"你的代码取消的是整个 Order,但你刚才说部分取消是可能的——到底哪个是对的?"* 语言和代码在被改动之前,会先被大声地对齐一致。

它的边界值得了解。它只交叉核对**代码**以及已提交的 `CONTEXT.md`/ADR,除此之外什么都不查。它不会搜索你的 issue tracker,所以一个几个月前在一个已关闭 issue 里被讨论过、也刻意敲定下来的命名冲突,会被当成新问题重新提出来。这里有[一个 open request](https://github.com/mattpocock/skills/issues/717) 要求修复这一点;在那之前,变通方法是把这条指令写进你自己的 `docs/agents/domain.md`,这些 skills 已经会读取它。

## Common questions

**我的 `CONTEXT.md` 有 500 行、1000 行、3000 行了。我该怎么办?**
体积是症状,不是病因——这个文件吸收了本不该属于词汇表的实现细节和决策。修法是一条直接的指令:`/grill-with-docs make my CONTEXT.md more concise and remove any implementation details from it`。对着一个膨胀的文件跑一遍,大部分内容都会被清掉。只有当这个文件已经真正精简、却依然涵盖了两个读者不会想一起放进脑子里的领域时,才考虑拆成 `CONTEXT-MAP.md`;拆分一个膨胀的文件只会得到好几个膨胀的文件。这个 skill 目前在这方面的引导还不足以从一开始就阻止这种膨胀,对应的 issue 也还开着。

**为什么是 `CONTEXT.md` 而不是 `GLOSSARY.md`?**
这是整套 skills 里争论最多的命名问题,而且没有定论。反对当前名字的理由很充分:如果它"只是一份词汇表,仅此而已",那 `GLOSSARY.md` 会更直白地说明这一点,而且正如一位读者所说——"with ai agents everything is [context](https://www.aihero.dev/ai-coding-dictionary/context)"。支持它的理由是那张地图:一个 `CONTEXT-MAP.md` 指向多份 `CONTEXT.md` 文件,读起来比 `GLOSSARY-MAP.md` 更自然,而且 `context` 本来就是 DDD 里指代模型某个有边界区域的常用词。至少有一个人专门维护一份本地 fork,就是为了重命名这个文件。你也可以这么做,但这套集合里其他每个 skill 都在找 `CONTEXT.md`,所以重命名意味着要把它们全部改一遍。

**`/ubiquitous-language` 去哪了?**
它被移除了,而且不是被弃用——它的职责搬进了 `domain-modeling`,后者持续维护整个模型,而不是从一次对话里倒出一份词汇表。词汇的强制执行变得更举足轻重了,而不是更少了——它现在运行在 grilling、triage 和 mapping 底层,而不是一个你需要记得单独去做的独立步骤。

**我怎么给一个完全没有词汇表的代码库补一份?**
明确地要求它,而不是等它自己慢慢积累。`/grill-with-docs help me scaffold my existing repo with a CONTEXT.md` 是文档记录的路径;预期会经历一次很长的盘问——有用户报告在文件成形之前被问了 50 多个问题。在一个 brownfield 仓库上靠日常顺带使用来积累词汇表,速度太慢了。

**我能保留领域模型,但用自己的 ADR 格式吗?**
目前没法干净地做到。词汇表那一半和 ADR 那一半打包在同一个 skill 里,所以一个已经有一套既定 ADR 惯例——不同的模板、不同的位置、不同的命名——的团队,会拿到和自己既有风格冲突的指令。目前的选择是把这个 skill 复制到本地自己改,或者在你仓库自己的 agent 文档里覆盖 ADR 的惯例。把两者拆开是[一个 open request](https://github.com/mattpocock/skills/issues/557)。

**一份词汇表真的值得吗?它是又一份要审查的 artifact,而且可能过时。**
有时候确实不值得,值得诚实面对这一点。DDD 越靠近实现层就越没用——它的回报在上游,在命名和概念对齐上,而不是在聚合和分层的繁文缛节上。同义词的管控在命名边界上很重要:模块名、表名、状态枚举、issue 标题、CLI 命令。在普通的行文里就没那么重要了。还有一种现实的反对意见是:领域术语压缩的是*人类之间*已经共享这些术语的沟通,而一个 agent 对术语和它的大白话展开会给出同样的响应——照这个理解,词汇表的价值在于让你和你的审阅者与 agent 正在做的事保持一致,而不是让 agent 变得更好。在一天就能完成的构建上,跳过它。而一份没人审查、由 agent 撰写的词汇表,比没有还糟:它会变成一套听起来很自信、被后续 sessions 当成真理来对待的传说。

**它能替我把模糊的 prompt 变成领域语言吗?**
不能,也没有计划做一个能这样做的 skill。一套你自己都不理解的领域语言,一旦被写下来就会变成毫无意义的空话。这个 skill 在你已经有了理解之后强制执行精确性——它不会替你凭空制造你原本没有的词汇。相关的陷阱是:在没有做建模的情况下使用领域词汇——用对了名词、却套在错误的概念结构上,产出的东西读起来正确、实际上并不正确。

## It's working if

- 它会在你说到一半时打断你,问你两者中到底指的是哪一个,而不是自己挑一个就继续。
- `CONTEXT.md` 在对话**进行中**变化,而不是在结尾一次性大改。
- 对一个你明天就能撤销的东西,它拒绝写 ADR——并说出三条检验里哪一条没通过。
- 新条目用一两句话定义一个东西*是*什么,并在 `_Avoid_` 下点名你放弃使用的那些词。
- 当你说的话和你的代码不一致时,它会把你的代码原样引给你看。
- `CONTEXT.md` 变短的次数,和它变长的次数差不多一样多。

## Where it fits

`domain-modeling` 是一个**model-invoked 的参考资料**,比起独立运行,它更多是运行在其他 skills*底层*。[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 通过一次 grilling session 驱动它,[wayfinder](https://aihero.dev/skills-wayfinder) 在绘制地图时加载它,[triage](https://aihero.dev/skills-triage) 用它让 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 保持项目自己的用词,[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在决策成型时调用它。它最近的同类是 [codebase-design](https://aihero.dev/skills-codebase-design):两者是其他一切底下的词汇层,这一个负责*领域*,那一个负责模块的*形状*。当你想要这份纪律、又不想承诺通常会引入它的那个 skill 的全部步骤时,也可以直接使用它。当你拿不准哪个 skill 合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
