[English](grilling.md) · [简体中文](grilling.zh-CN.md)

## What it does

`grilling` 是在任何人据此行动之前,对一份计划、一个决策或一个想法做压力测试的访谈循环。它把这个主题绘制成一棵**设计树**——每个决策都分叉出挂在它下面的那些决策——一个分支一个分支地采访你,直到没有什么被默默地假设掉。

它不会一次问一个问题,也不会一次全问完。每一**轮**都问整个 **frontier**:每一个前提条件已经确定的决策,别的都不问。如果一个问题依赖另一个,两者绝不会出现在同一轮——一个悬而未决的答案所依赖的问题,属于*之后*的某一轮。你的答案会敲定一些决策,frontier 随之向外推进,下一轮问的正是那些被解开的问题。十三个问题通常会落在大约三轮里,而不是十三轮。

## When to reach for it

输入 `/grilling`,或者当一个任务合适时,[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会自己主动使用它。它是 grilling 家族里唯一一个 model-invoked 的 [skill](https://www.aihero.dev/ai-coding-dictionary/skill),这正是你很少直接输入它的原因:通常是你*确实*输入过的另一个 skill 在替你运行它。

直接输入 `/grilling`,你会得到纯粹的访谈,别无其他。如果你想要更多:

| 你手上有什么 | 该用什么 |
| --- | --- |
| 你不在一个 working directory 里工作 | [grill-me](https://aihero.dev/skills-grill-me)——同样的 [session](https://www.aihero.dev/ai-coding-dictionary/session),只是换了个 agent 永远不会自己触发的名字 |
| 你在一个 working directory 里 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)——同样的 session,而且边做边写 `CONTEXT.md` 和 ADR |
| 一次大到单个 session 装不下的工作 | [wayfinder](https://aihero.dev/skills-wayfinder)——它绘制一张地图,在 decision tickets 内部运行 grilling |
| 一个聊天解决不了的问题——某个东西该长什么样或什么感觉 | [prototype](https://aihero.dev/skills-prototype)——构建一次性版本,再回来 |
| 你自己的一个 skill 需要一次访谈 | 从它里面调用 `/grilling`,而不是再写一套访谈 |

## The round, the frontier, and who decides

三个理念承载着这整个 skill。

**设计树**是这个主题的模型:决策之下挂着决策。**Frontier** 是所有前提条件都已确定的决策的集合——是目前唯一能诚实地被问出来的那些问题。**一轮**就是一个完整的 frontier,被完整地提出、完整地回答。

在一轮内部,每个问题都以一个固定形态出现:在一个 `❓` 后面编号并给出标题,然后是正文,然后是 agent 单独在一行 `➡️` 上给出的推荐答案。这正是让一轮能按编号回答的原因——"1 yes, 2 the second option, 3 no, here's why"——而不是要把问题引述回去。这个格式有一个已知的粗糙边缘:这条推荐有时候论证的方向是*反对*问题本身的措辞,所以同意这条推荐意味着要对这个问题回答"不"。遇到这种情况,回答这条推荐,并说明这一点。

设计的另一半,是事实和决策之间的划分。事实是这个 skill 自己的活:当一个 frontier 问题需要 [environment](https://www.aihero.dev/ai-coding-dictionary/environment) 能解决的东西时,它会派一个 [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) 去查清楚,而不是问你。它不会为此阻塞——只有依赖这次探索的问题才会等。决策是你的,它必须为此等待。一个跑着 `grilling` 却自问自答自己决策的 agent,是破坏了这个 skill,不是宽松地理解了它。当 frontier 为空时,这次 session 就结束了,而它不会在你确认已经达成共同理解之前,对你们同意的东西采取行动。

诚实的局限在于:frontier 是 agent 自己的判断,不是一张计算出来的图。它可能把两个问题放进同一轮,事后才发现其中一个答案本该改变另一个。除了告诉它、在下一轮重新打开受影响的分支之外,没有别的防护措施。

## What lives here and what lives in the wrappers

这一页覆盖的是机制本身。人们最常想知道的东西,记录在高一层的地方。

| 问题 | 在哪里被回答 |
| --- | --- |
| 树、frontier、轮次、问题格式、事实与决策的划分 | 这里 |
| 一次 session 该跑多久、碰到一个聊天解决不了的问题该怎么办、怎么避免一味点头 | [grill-me](https://aihero.dev/skills-grill-me) |
| 什么会被写进 `CONTEXT.md`、什么会变成一份 ADR | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |

## Common questions

**我能回到一次一个问题的模式吗?**
可以,而且相当一部分用户确实这么做。把这个加进你的全局 `CLAUDE.md`:

```
When grilling, ask one question at a time.
```

按轮次提问这个默认设定,确实存在真实的争议。那些阅读速度较慢、使用第二语言,或者把顺序格式当作专注支架的从业者,都反映一次一个的节奏对他们更好,这个退出选项是被支持的,不是被容忍的。

**`/batch-grill-me` 去哪了?**
进了这个 skill。按轮次提问曾短暂地作为一个独立 skill 发布,之后被并进了 `grilling` 本身,所以每一个建立在这个原语上的 skill——`grill-me`、`grill-with-docs`、`triage`、`wayfinder`——都一次性获得了它。没有一个独立的 `batch-grill-me` 可以安装,也没有一个独立的顺序版 skill;上面那行 `CLAUDE.md` 配置就是回到一次一个模式的方法。

**一次问完一整轮,肯定会丢掉我更早的答案本该引出的那些问题吧?不是吗?**
这是对按轮设计最常见的反对意见,而 frontier 正是对它的回答:一轮里只会包含彼此不依赖的问题,所以这一轮里的任何一个答案都不可能让同一轮里的另一个问题失效。答案依然会重塑下游的一切——下一轮是重新计算出来的,不是预先写好的。你失去的东西,比"一次问完所有问题"暗示的要少,又比"什么都不失去"要多:见上面 frontier 的局限。

**它把问题问完就开始动手构建了。**
一道确认关卡的存在正是为了这个:这个 skill 不是在 frontier 清空时完成的,而是在你说共同理解已经达成时才完成。较弱、较快的 [models](https://www.aihero.dev/ai-coding-dictionary/model) 依然会打破这一点——这在较低 effort 或非前沿模型上被反映得最多,它们会把"采访到达成共同理解为止"压缩成几个问题加一份大纲。如果你的模型这样做了,可靠的修法是在你自己的 `AGENTS.md` 或 `CLAUDE.md` 里加一行,告诉 agent 未经许可不要动手实现。

**它自问自答了,没有问我。**
那是这次运行里的一个 bug,不是预期行为,这也正是为什么这个 skill 的文字里要把事实和决策分开。这在另一个 skill 在一个"解决这个 ticket"的框架内部运行 `grilling` 时最容易出现,因为周围的任务读起来像是继续前进的许可证。同样的约束也是为什么没有异步模式:有人要求过一个能读一个 GitHub issue、发一份汇总决策备忘录的变体,那是一个不同的 skill,因为一次没人回答的 grilling session,产出的是 agent 自己的意见,不是你的。

**我能限制问题数量吗?**
不能,而且不设上限是刻意的设计。有些计划需要三个问题,有些需要五十个;一个固定上限要么会在困难的情况下被截断,要么在简单的情况下显得莫名其妙。用大白话引导它才是设计好的控制方式——告诉它收尾,或者停下来、接受计划目前的状态。如果一次 session 跑得特别长,原因通常是范围定得太大了;把工作拆开,分别对各部分做 grilling。

**我单独安装了 `grill-me`,什么都没发生。**
`grill-me` 是一个一行的 skill,它整个的正文就是"跑一次 `/grilling` session",所以它也需要装这个 skill。`grill-with-docs` 同理,它还额外需要 [domain-modeling](https://aihero.dev/skills-domain-modeling)。装整套集合能避开这个问题;选择性安装意味着连同这些原语也要一起装。

**`grill-with-docs` 跑了,但它从没加载过 `grilling`。**
一个真实存在、还没修的粗糙边缘,在多个 [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) 和模型上都有报告:一个点名了另一个 skill 的 skill,不能可靠地让那个 skill 被加载,而 `grill-with-docs` 点了两个。识别标志是一次一口气问完所有问题、没有附带任何推荐的 session——那是模型在自己即兴发挥一场访谈,而不是在运行这一个。直接问 agent 它有没有加载 `grilling` 和 `domain-modeling`,通常能把它拉回正轨。

## It's working if

- 一轮以一份编号列表的形式到达,每个问题的推荐都单独在一行 `➡️` 上,你能按编号回答整轮问题。
- 一轮里没有任何问题需要同一轮里另一个问题先被回答。
- 后面的轮次问的是第一轮问不出来的东西。
- 它会主动去查事实——读文件、派一个 sub-agent——而不是问你一件它本可以自己查到的事。
- 在后台运行的调研不会拖慢这一轮;只有依赖它的那些问题会等待。
- 它在结尾停下来,要求你确认已经达成共同理解,而不是直接开始动手。
- 问题数量保持高,轮次数量保持低。

## Where it fits

`grilling` 是一个**原语**,不是一个你会主动安排的步骤:它是访谈技巧唯一的权威来源,集中在一个地方,这样每一个需要访谈的 skill 都直接用它,而不是自己发明一套。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 是它两个 user-invoked 的前门,`grill-with-docs` 正是主构建链条的起点,在 [to-spec](https://aihero.dev/skills-to-spec) 之前。[wayfinder](https://aihero.dev/skills-wayfinder) 用它来解决 decision tickets,[triage](https://aihero.dev/skills-triage) 用它把一份模糊的报告梳理成可执行的,[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在你选定一个要做深的候选项后用它走一遍决策树。当你拿不准哪个入口合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
