[English](grill-with-docs.md) · [简体中文](grill-with-docs.zh-CN.md)

## What it does

`grill-with-docs` 就一个 plan 或设计采访你,直到你和 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 对它有了同一份理解,并在这个过程中把词汇和重大决策写进你的仓库。它跑的是和 [grill-me](https://aihero.dev/skills-grill-me) 一样的访谈——一轮问题,然后等待,然后下一轮——只是这次是针对一个代码库进行的。

它是 **[stateful](https://www.aihero.dev/ai-coding-dictionary/stateful)**(有状态)的。其他每一个 grilling skill 都把这个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 留在你的脑子里;这一个把文件留在磁盘上。一个术语被敲定,它就在敲定的那一刻落进 `CONTEXT.md`,而不是攒到最后。一个决策过了三道关卡,它就落成一份 ADR。这就是全部的区别,也是人们在使用这个 skill 时遇到大多数麻烦的根源:这些 artifacts 是真实仓库里的真实文件,所以它们可能在你期待时却不存在,也可能在不止一个人写入时发生漂移。

## When to reach for it

你需要输入 `/grill-with-docs` 来调用它——agent 不会自己主动使用它。

在一次改动的开始、在一个仓库里、当计划还很模糊、事物的说法还没定下来时用它。它是单 session 工具。你想要哪个 grilling skill,取决于你眼前是什么情况:

| 你手上有什么 | 该用什么 |
| --- | --- |
| 你根本不在一个 working directory 里工作 | [grill-me](https://aihero.dev/skills-grill-me) |
| 一个仓库,以及一次能在一个 session 里搞定的改动 | `grill-with-docs` |
| 一次大到单个 session 装不下的工作——一个 greenfield 构建、一个大 feature | [wayfinder](https://aihero.dev/skills-wayfinder) |
| 一个完全没有领域文档的仓库,也没有特定的 feature 在心里 | `grill-with-docs`,针对整个仓库而不是某次改动 |
| 一个卡在别人脑子里那份知识上的决策 | [to-questionnaire](https://aihero.dev/skills-to-questionnaire) |

和 wayfinder 之间的分野归结为 session 数量:`/grill-with-docs` 用于单 session 规划,`/wayfinder` 用于多 session 规划。

## Prerequisites

这个 skill 会写入你的仓库,所以你需要待在一个可以安全写入的地方。敲定的术语会写进根目录的 `CONTEXT.md` 词汇表——如果根目录的 `CONTEXT-MAP.md` 标记这个仓库是多 context 的,就写进对应 context 的 `CONTEXT.md`。决策写进 `docs/adr/`。两者都是按需创建的;在第一个术语或决策成型之前什么都不存在,所以不需要提前搭任何脚手架。

它还需要另外两个 skills 存在,因为它自己的 `SKILL.md` 只有一行、委托给它们:[grilling](https://aihero.dev/skills-grilling) 提供访谈本身,[domain-modeling](https://aihero.dev/skills-domain-modeling) 提供写入的能力。只装 `grill-with-docs` 一个,你会得到一个不能正常工作的 skill。

## The paper trail

一次 session 会产出三种东西,它们并不对等。

| 敲定了什么 | 落在哪里 |
| --- | --- |
| 一个术语——项目自己对某个东西的说法 | `CONTEXT.md`,就地写入,在它敲定的那一刻 |
| 一个难以撤销、没有上下文会让人意外、且是一次真实权衡的决策 | `docs/adr/` 下的一份 ADR |
| 你决定的其他一切 | 只留在对话里,别无他处 |

第三行正是让人栽跟头的地方。`CONTEXT.md` 是一份词汇表,并且被刻意保持成这样——没有实现细节,没有 [spec](https://www.aihero.dev/ai-coding-dictionary/spec),没有草稿笔记。ADR 同时受三个条件约束,所以大多数决策都不够格,大多数 session 一份都产不出来。一次产出了更精炼词汇表、却零份 ADR 的 session,正是设计的预期效果,但这意味着你达成一致的大部分内容,只存在于你们达成一致时所在的那个 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 里。把这同一段对话直接交给 [to-spec](https://aihero.dev/skills-to-spec),而不是把它 [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) 掉。

词汇表才是重点。领域语言才是这个 skill 真正在构建的东西——项目自己的说法,达成一次共识,这样你、agent 和你的同事就不用再花力气重新推导它们。值得一提的是,不是所有人都认同这真的能提升 agent 的表现:最尖锐的公开反对意见是,一个术语和它大白话的展开对 [model](https://www.aihero.dev/ai-coding-dictionary/model) 来说得到的是同样的结果,真正被这套词汇压缩的是共享它的人类之间的沟通。这种理解依然承认词汇表是有价值的;只是把价值挪到了别处。

## It assumes one writer

这些有状态的产出假定由一个人来维护。一个两人小团队在一个仓库里跑了四个月,报告称抽样合并的 PR 里大约 20% 出现了状态漂移,ADR 引用和 README 里的断言是漂移最严重的部分——刻意维护、由人整理的文档,漂移得比 agent 的记忆还严重。清理过时文档没能保住效果;同一轮清理几天后又变得过时了。真正有效的是彻底删除影子状态,并在 CI 里加一个确定性的引用和链接检查工具。

相关的是:在一个仓库里对不相关的改动反复运行这个 skill,往往会积累出话题混杂的文档,因为没有什么东西能把一次 session 的产出和另一次分开。这两个问题目前在这个 skill 里都还没有解决。

## Common questions

**我该用这个,还是 `/wayfinder`?**
范围决定一切。任何能在一个 session 里搞定的用这个;当这次工作大到单个 session 装不下时用 [wayfinder](https://aihero.dev/skills-wayfinder),它会先把这次工作绘制成一张由 decision [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 组成的地图。Wayfinder 更慢、更密集,对一个范围已经很清楚的 feature 用它是常见的错误。它不会取代这个 skill——对地图里适合用一次 grilling session 处理的那部分,它会直接落进一次 grilling session。

**它跑完了,但没有出现 `CONTEXT.md`,也没有 ADR。**
两个已知原因。平凡的那个:没有什么真正够格。ADR 需要三道关卡都过,一次关于一个没有新词汇的改动的 session 确实没什么可写的。真正的 bug:当这个 skill 在另一层编排之下运行时——一个 spec-driven-development 的包装层、一个多 agent 框架、某个把它当作别人 pipeline 里一步来调用的规则——据报告,写文件的那一半会悄悄地不发生,而访谈依然照常进行。这个问题已经记录、还没修。如果你处在这种设置里,在信任这次 session 的产出之前先检查工作目录。

**它一次性问了所有问题,没有任何推荐,也从没提过 `CONTEXT.md`。**
那是这个 skill 没能加载它的两个依赖。因为 `SKILL.md` 只是一行委托,一个没有加载 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 的 agent 会自己猜测 grilling 是什么意思,于是你得到的是一堆没有区分度的问题。部分加载是更让人困惑的情况——`grilling` 加载了,`domain-modeling` 没有,你会得到一次不错的访谈,却没有任何文字记录。这和模型以及 [effort](https://www.aihero.dev/ai-coding-dictionary/effort) 级别相关,也是这个 skill 被反映最多的问题。如果你怀疑发生了这种情况,直接问 agent 它加载了哪些 skills。

**我其他的决定都去哪了?**
只留在对话里。这是关于这个 skill 最实质性的一条 open complaint:词汇表不是一份 spec,大多数答案都不够格写成 ADR,也没有一份台账把每个已敲定的答案串联到一份 spec、一个 ticket 和一个测试上。精确的答案——顺序保证、否定性需求、数字默认值——在下游会被软化成更弱的行文,结果可能看起来很完整,实际上却漏掉了你真正决定的东西。目前可用的缓解方法是保留这个 session,直接把它喂给 [to-spec](https://aihero.dev/skills-to-spec),并对照你自己的答案重新读一遍这份 spec,而不是假设它已经把一切都捕获到了。

**我能拿它去处理一个完全没有文档的现有仓库吗?**
可以。对于一个没有 ADR、没有领域语言、没有设计原则的代码库,这正是适合的 skill——调用它,说"help me document my repo"。社区常见的做法是把它和 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 搭配,用来构建或修补一份 `CONTEXT.md`。预期你需要引导它:它会读代码,就它发现的东西问你,而由你来判断代码库里已有的哪些词才是正确的。

**Session 结束时我该做什么?**
这个 skill 的结束语往往是开放式的,这是一个已知的粗糙边缘。在 main flow 里,答案是在同一段对话里接上 [to-spec](https://aihero.dev/skills-to-spec)。如果这次改动小到可以立刻构建,就直接走 [implement](https://aihero.dev/skills-implement)。

**为什么叫这个名字?**
没有人对这个名字满意。有一个 open 的提议要把它改名成 `grill-domain-model`,那样能更诚实地描述它的行为。目前没有任何进展。如果哪天真的改名了,这个 docs 页面会跟着一起搬,URL 也会变。

## It's working if

- `CONTEXT.md` 是在 session *进行中*一个术语一个术语地变化,而不是在结尾一次性冒出来。
- 词汇表读起来是纯粹的词汇——你项目自己的说法,配着精炼的定义——不含任何实现细节或类 spec 的行文。
- 代码库能回答的问题,是通过读代码库来回答的,而不是拿来问你。
- 你得到的 ADR 很少甚至没有,而你得到的那些,都是你会懒得再重新争论一遍的决策。
- 当你用的一个词和你现有词汇表的定义不一样时,它会挑战你。

## Where it fits

`grill-with-docs` 是主构建链条的起点:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它先于任何被写成 spec 的东西——它产出的是共同理解和已敲定的词汇,之后 [to-spec](https://aihero.dev/skills-to-spec) 会直接综合它们,不再重新采访你一次。它最近的邻居是 [grill-me](https://aihero.dev/skills-grill-me)(同样的访谈,但没有仓库、没有文件)和 [domain-modeling](https://aihero.dev/skills-domain-modeling)(它驱动的那套词汇表加 ADR 纪律);两者都建立在 [grilling](https://aihero.dev/skills-grilling) 这个原语之上。在它上游,[wayfinder](https://aihero.dev/skills-wayfinder) 为大到单个 session 装不下的工作绘制地图,并能把地图的一部分交回给它。当你拿不准哪个 skill 或 flow 合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
