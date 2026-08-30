[English](tdd.md) · [简体中文](tdd.zh-CN.md)

## What it does

`tdd` 先写测试再构建一个 feature 或修复一个 bug:一个失败测试,然后刚好足够让它通过的代码,再进入下一个行为。它承载的是让这个循环产出值得保留的测试的那些标准——什么是好测试、测试放在哪、mock 是干什么用的,以及那三个会悄悄毁掉一个测试套件的反模式。

它不会在一个你还没同意的 seam 上写测试。在任何测试存在之前,它会先点名它打算测试的公开边界,停下来等你确认,因为测试精力是有限的,这正是你该把它花在关键路径上、而不是每一个边界情况上的地方。另一件值得了解的事是,`tdd` 是一份**参考资料**,不是一个驱动器。它承载着这个循环的规则,由别的什么(你,或者 [implement](https://aihero.dev/skills-implement))来运行应用这些规则的那个 [session](https://www.aihero.dev/ai-coding-dictionary/session)。

## When to reach for it

输入 `/tdd`,或者当一个任务合适时,[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会自动使用它——先写测试再构建一个 feature 或修复一个 bug,或者当你说"red-green-refactor"时。

当有一个具体行为要构建、有一个输入和一个可观察的输出、而你想要能挺过重构的测试时用它。

| 你的情况 | 该去哪 |
| --- | --- |
| 一个有明确输入输出的行为——业务逻辑、一份请求/响应合约、一次转换、校验 | `tdd` |
| 这个行为还没敲定 | [to-spec](https://aihero.dev/skills-to-spec),它也会在任何代码写出来之前先敲定测试 seams |
| 真正的问题是接口的形状,不是测试 | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你有一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 或 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket),想让整个构建过程被自动跑完 | [implement](https://aihero.dev/skills-implement),它会按 ticket 驱动 `tdd` |
| 配置、接线、胶水代码、类型注解、纯粹的 CRUD 转发 | 这里都不太合适——见下面这个未解决的缺口 |

最后一行是一个真实存在的空白,不是一个风格偏好。这个 skill 决定的是 seam *放在哪*;它内部没有任何东西决定一次改动*是否*值得走这个循环。在一次没有独立真值来源可供断言的改动上运行它,你会得到一个只是把实现复述了一遍的测试——这个 skill 自己警告过的 tautological 反模式,只是从另一个方向撞上了它。这是 [issue #746](https://github.com/mattpocock/skills/issues/746),还开着。在它关闭之前,这个判断得靠你自己,或者你的 `CLAUDE.md`。

## Prerequisites

需要安装 [codebase-design](https://aihero.dev/skills-codebase-design)。`tdd` 以前自带过它自己的 deep-module 和接口设计笔记;在 v1.0 里,这些被删除、改用这个共享 skill,`tdd` 现在依赖它获取接口设计的词汇。除此之外没有别的——这个 skill 是 [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless) 的,不写任何自己的文件。

## The loop, and the seam it runs at

三个词承载着这个 skill。

**Red-green。** 先写失败测试,再写刚好够让它通过的代码。不预判下下一个测试。没有重构阶段:它在 2026 年 6 月被去掉了,因为 agents 基本上从不真正执行它,而且 review 和实现分开在不同 session 里做效果更好。重构属于 [code-review](https://aihero.dev/skills-code-review)。

**Vertical slice。** 一个 seam,一个测试,一份最小实现,然后重复——第一轮循环是一颗证明单条路径能端到端跑通的 **tracer bullet**。反面是水平切片:先写完所有测试,再写所有代码。批量测试验证的是*想象中*的行为,它们检查的是事物的形状,而不是用户真正做的事,而且会让你在理解实现之前就把测试结构定死。

**Pre-agreed seam。** 一个 seam 是你观察行为、又不伸手进内部的那个公开边界。这条规则是绝对的:不在一个未经确认的 seam 上写测试。在完整链条里,seams 更早在 [to-spec](https://aihero.dev/skills-to-spec) 期间就被敲定了——"`/tdd` is told to only work at pre-agreed test seams, `/code-review` checks that only agreed-upon test seams were used."。单独调用时,`tdd` 会直接问你。

它被设计用来阻止的三个反模式:

| 反模式 | 识别标志 |
| --- | --- |
| Implementation-coupled | 你重命名一个内部函数,行为没变,测试却挂了。Mock 了内部协作对象、断言了调用次数、用数据库查询而不是接口来验证。 |
| Tautological | 期望值是用代码计算它的同一种方式算出来的,所以测试天生就会通过。期望值必须来自别的地方——一个已知正确的字面量、一个具体算出来的例子、spec。 |
| Horizontal slicing | 一批测试在任何实现之前就落地了。 |

Mock 只用于系统边界——外部 API、时间、随机性,有时候是文件系统或数据库。不是你自己的模块。

## Common questions

**它为什么不做重构?描述里写的是 "red-green-refactor"。**

因为重构这一步被移除了,描述却没跟着改。这次移除是刻意的:agents 基本上从不真正执行它,把实现和 review 分开在不同 session 里做效果更好。产出的结果按书本定义算不算 TDD,不如这个循环有没有产出更好的代码来得重要。触发短语和实际内容之间的这个不匹配被记录为 [issue #589](https://github.com/mattpocock/skills/issues/589),还开着,所以 "red-green-refactor" 依然能作为触发这个 skill 的短语继续用。你拿到的是 red → green,重构在 [code-review](https://aihero.dev/skills-code-review) 里。

**它让我选一个测试 seam,我完全不知道该选哪个。**

这是关于这个 skill 被反映最多的摩擦点([issue #607](https://github.com/mattpocock/skills/issues/607))。这个 prompt 只按名字列出候选 seams,没说每一个能抓住什么、会漏掉什么,所以你其实是在几个标签之间做选择。目前还没有随附的修复。实际可行的变通方法是在回答之前先问 agent 权衡取舍——component 层面的 seam 会漏掉什么、integration 层面的 seam 能抓住,以及慢多少。这也是为什么这条链条会在 `to-spec` 里提前敲定 seams——那时你能看到整个 feature,而不只是一个 prompt。

**它在写测试之前就先写了实现,虽然这个 skill 说要先红。**

这种情况会发生。有一位用户就此追问 [model](https://www.aihero.dev/ai-coding-dictionary/model),得到了一个出奇诚实的回答:"I knew the skill said 'one test at a time, watch it fail for the right reason' — I read it. I just defaulted to my normal habit."。这个 skill 是带着能容忍这一点的心态写的。没有任何指令能让一个 agent 百分之百遵守,而更用力地强调这一点,只会限制 agent 的创造力、收效甚微——即使没有被严格遵循,这个循环依然值得跑,因为整体结果依然更好。如果严格遵守对某个具体切片很重要,就盯着这次运行看,而不是指望这个 skill 会强制执行它。

**它该先写浏览器测试或端到端测试吗?**

通常不该,而这个 skill 也不会阻止它这么做。有用户报告 agent 先写了一个 Playwright 测试,然后在一个漫长的循环里反复重跑它,得出结论说是*测试*坏了,而那个 feature 根本还不存在。在你的 `CLAUDE.md` 里配置这一点。浏览器测试足够慢,慢到 red-green 反馈循环不再划算;在你仓库的 `CLAUDE.md` 里声明它们要在行为跑通之后才写。

**`/tdd` 会取代 `/implement`,或者课程里的 `/do-work` 吗?**

不会。`/tdd` 记录的是方法论;`/implement` 是一个非常简单的工作→反馈→提交循环,是 `/do-work` 直接的替代品。课程里原本单一的 `/do-work` 步骤,现在被拆分到了 `/implement`、`/tdd` 和 `/code-review` 之间。如果你在纠结该针对一个 ticket 跑哪一个,答案几乎总是 `/implement`。

**Deep-modules 和接口设计的指引去哪了?**

在 v1.0 里进了 [codebase-design](https://aihero.dev/skills-codebase-design),被泛化成了几个 skills 共享的一套词汇。`refactoring.md` 也在同时离开了;重构现在是 [code-review](https://aihero.dev/skills-code-review) 的职责,那个 skill 带着 Fowler smell 基线。

**它知道我其他的 tickets 吗?**

不知道。针对一个 ticket 运行它,它会欣然提议属于兄弟 ticket 的工作,因为它对 issue 图谱的其余部分毫无了解([issue #129](https://github.com/mattpocock/skills/issues/129))。Matt 的立场是,这不是 `tdd` 的职责。把 spec 和 ticket 一起传给它有帮助;一开始就把 tickets 的大小定合适,帮助更大。

## It's working if

- 在任何测试文件存在之前,它会停下来,点名它打算测试的 seams,并等待。
- 一个测试出现,变红,拿到刚好够让它通过的代码,然后才出现下一个测试——不是一批测试接一批代码。
- 测试名读起来像能力("user can checkout with valid cart"),不像内部实现("checkout calls paymentService.process")。
- 断言里的期望值是你能追溯到 spec 的字面量,而不是用代码计算它的同一种方式重新算出来的值。
- 重命名一个内部函数不会让这个套件里的任何东西挂掉。
- Mock 只出现在外部边界——支付 API、时钟——绝不出现在你自己的模块周围。

## Where it fits

`tdd` 是主链条构建步骤内部的引擎,而不是它自己的一步:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

[to-spec](https://aihero.dev/skills-to-spec) 提前敲定测试 seams,[implement](https://aihero.dev/skills-implement) 按 ticket 驱动 `tdd`,[code-review](https://aihero.dev/skills-code-review) 事后检查只用了已敲定的 seams——并承担 `tdd` 不再做的重构工作。它另一个邻居是 [codebase-design](https://aihero.dev/skills-codebase-design),`tdd` 所说的 seam 和 deep-module 词汇的共同来源。只要有一个具体行为要构建、又没有完整 spec 时,你也可以单独用它。当你拿不准哪个 skill 适合你的情况时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
