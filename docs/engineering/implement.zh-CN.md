[English](implement.md) · [简体中文](implement.zh-CN.md)

## What it does

`implement` 构建已经决定好的工作。你把它指向一个 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec),或者你刚在对话里达成一致的计划,它就会写代码,在各个 seam 处驱动 [tdd](https://aihero.dev/skills-tdd),边写边做类型检查,最后跑一次 [code-review](https://aihero.dev/skills-code-review),然后提交到当前分支。

它绝不会重新打开这个计划来讨论。没有采访,没有澄清轮次,不会提议一个不同的方案。上游已经敲定的东西就是输入,这个 skill 的全部工作就是把它变成一次 commit。这正是它和对着一个全新 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 说"build this"的区别——后者在构建的同时会欣然重新设计这份工作。

## When to reach for it

你需要输入 `/implement` 来调用它——agent 不会自己主动使用它。它自带 `disable-model-invocation: true`,所以其他 skill 也没法调用它。当 [ask-matt](https://aihero.dev/skills-ask-matt) 或 [to-tickets](https://aihero.dev/skills-to-tickets) 说"then `/implement` per ticket"时,那是给你的指令,不是 agent 会自己主动做的事。

这份工作目前存在于哪里,决定了这是不是合适的 skill:

| 这份工作是… | 该用什么 |
| --- | --- |
| Tracker 上的一个 ticket | `/implement #42`,每个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 一个 ticket,ticket 之间 [清空](https://www.aihero.dev/ai-coding-dictionary/clearing) 上下文 |
| 一份还没拆分的 spec,构建会跨越多个 session | 先走 [to-tickets](https://aihero.dev/skills-to-tickets),然后每个 ticket 一次 `/implement` |
| 一份 spec,构建规模很小 | 直接针对这份 spec 用 `/implement` |
| 只存在于你刚才那段对话里,而且规模还很小 | 就在同一个窗口里直接 `/implement` |
| 还没被写下来 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs),如果没有代码库就用 [grill-me](https://aihero.dev/skills-grill-me) |
| 一个你想先写测试的具体行为,没有 spec | 直接用 [tdd](https://aihero.dev/skills-tdd) |
| 已经构建好了,你想让它被检查一遍 | 直接用 [code-review](https://aihero.dev/skills-code-review) |

同 session 这种情况值得单独说一下,因为这个 skill 自己的第一行没有覆盖它。`SKILL.md` 写的是"the spec or tickets",这会诱使 [model](https://www.aihero.dev/ai-coding-dictionary/model) 去找一个不存在的文件。如果这个计划只存在于当前这个线程里,在调用它时说清楚。

## Prerequisites

`implement` 会提交到你当前所在的分支。它不会创建分支,也不会问。开始之前先确认自己在你想要这份工作落地的那个分支上。

如果这些 tickets 来自 [to-tickets](https://aihero.dev/skills-to-tickets),它们所在的 tracker 是由 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 配置的。`code-review` 在收尾时会读取同一份配置,找到对应的 spec。

## What one run does

一次运行分五拍,按顺序:

1. 读这个 ticket 或 spec,推算出各个 seam。
2. 在预先约定的 seam 处驱动 [tdd](https://aihero.dev/skills-tdd),一次一个 red-green 切片。
3. 频繁做类型检查,边做边跑单个测试文件。
4. 最后跑一次完整的测试套件。
5. 跑一次 [code-review](https://aihero.dev/skills-code-review),然后提交到当前分支。

一次运行覆盖一个 ticket。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的 tickets 是大小刚好能装进单个全新 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 的 tracer-bullet 垂直切片,所以预期的节奏是:清空上下文、实现一个 ticket、提交、再清空。每个 ticket 都是自包含的,这正是让上一个 ticket 的上下文可以被丢弃的原因。

## Pre-agreed seams

这个 skill 运行的核心理念是 **seam**:你观察行为、又不伸手进内部的那个公开边界。测试活在 seam 上。在写任何代码之前先就 seam 达成一致,正是让测试保持持久有效的原因,因为下面的实现可以被重写,而测试不需要跟着挪动。

"pre-agreed"(预先约定)这个词是真的在起作用,但它也是这个 skill 最薄弱的一环。`implement` 内部没有任何东西真正去"约定" seam。`tdd` 才是那个会问的 skill,它拒绝在一个未经确认的 seam 上写测试。所以实际上,这个约定要么发生在上游的 spec 里,要么发生在这次运行的第一次交流里。如果两者都没发生,这个前提条件就不会被触发,这次运行会悄悄变成"直接写代码"。在 spec 里点名这些 seam,正是阻止这一点的方法。

## Common questions

**它跑完了,但我的 ticket 还是开着的,acceptance criteria 也还没被勾选。**

对,而且这是预期行为。`implement` 没有完成步骤。它在提交那一步就结束了,从不触碰这个工作项——在 GitHub Issues 和本地 markdown tracker 上都确认过这一点,所以这不是一个 tracker 集成问题。它也不会针对 `code-review` 产出的发现采取行动,也不会勾选对应 issue 上的 `- [ ]` 复选框。关闭这个 ticket、核对这些标准,都得你自己来。这在一条依赖链上伤害最大,因为 `to-tickets` 把 frontier 定义为阻塞项全部已关闭的那些 tickets。如果没有任何东西被关闭,就永远不会有东西变得明显可以解除阻塞。

**我能把它一次指向我所有的 tickets,或者并行跑几个吗?**

不能。一次调用,一个 ticket。跨一整个 ticket 队列的批量分发,以及 [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) 扇出,都被反复要求过,但都不存在。在同一个 checkout 里并排跑好几个 `/implement` session,比"不支持"还要糟糕:有一份现场报告描述了一个 session 里的 `git commit --amend` 落到了另一个 session 的 commit 上、一个 stash 从 `refs/stash` 里消失、commit 落到了错误的分支上——这一切都发生在同一个下午、跨三个 issue。这些 sessions 共享同一个工作目录、同一个 index、同一个 HEAD。Git worktrees 是社区里的变通方案,但要注意 `refs/stash` 在多个 worktree 之间也是共享的,所以光用 worktrees 并不能解决 stash 这个问题。如果你现在就想要并行,得自己动手拼装。

**它能开一个 pull request,而不是直接提交吗?**

没有内置这个功能。它直接提交到当前分支,不少人觉得这有点太急:代码在他们还没来得及验证是否能跑之前就落地了。没有配置开关,也没有 PR 模式。人们要么在调用时覆盖它("commit to a branch and open a PR"),要么编辑自己本地那份 skill 拷贝。

**`code-review` 说它看不到我的改动。**

`code-review` 审查的是 `git diff <fixed-point>...HEAD`,这不包括 staged 和工作区里的改动。`implement` 是在提交之前跑它的,所以除非已经存在一次中间 commit,否则那份 diff 里没有东西可审查。多个人报告过这个问题,双方目前都没修。先提交,再针对你分支出去的那个起点做审查。

另外,有些人是刻意不想让 review 出现在这次运行内部,因为一个 agent 审查它自己刚写的代码,会偏向自己的方案。在一个全新 session 里针对一个固定起点单独跑 [code-review](https://aihero.dev/skills-code-review) 是一个合理的替代方案,这也正是那个 skill 把两个维度拆到独立 sub-agents 里运行的同一个原因。

**一个 ticket 烧掉了 15 万 token。是我用错了吗?**

大概率是这个 ticket 太大了,而不是这个 skill 被用错了。一次运行要做代码库探索、每个 seam 一次 red-green 循环、一次完整套件、一次审查,所以一个不算简单的 ticket 超过 10 万 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 是正常的,不是出问题的信号。杠杆在上游:在 [to-tickets](https://aihero.dev/skills-to-tickets) 里把 tickets 的大小定得合适,让每一个都能装进一个全新窗口。如果一个 ticket 反复爆掉,拆分它,而不是调高 [effort](https://www.aihero.dev/ai-coding-dictionary/effort) 级别。

**在一个全新 session 里,`/implement #2` 跑去处理了完全不相关的东西。**

`#2` 是相对 agent 当前能看到的某份编号列表来解析的,在一个全新 session 里,这份列表可能是一个 todo 文件、一份清单,或者另一份工作列表,而不是你配置的那个 tracker。这个解析过程是自信地进行的,而不是失败时保守处理的,所以这个错误在开始之前并不明显。传入完整的引用——issue URL 或者 `owner/repo#2`——并要求它在开始之前先把标题确认回给你。

## It's working if

- Session 一开始就读这个 ticket 或 spec、复述它将要构建什么,而不是反过来问你要构建什么。
- 你能在 trace 里看到一次真实的 `/tdd` 调用,而不只是 diff 里凭空出现了测试。
- 这次运行期间反复跑类型检查和单个测试文件,并在接近结尾时跑一次完整套件。
- 这次运行会自己走到在你当前分支上的一次 commit,不需要你提示它继续。
- 这份 diff 就是一个 ticket 的量:贯穿每一层的一条垂直切片,而不是好几个 tickets 被扫到一起。

## Where it fits

`implement` 是主链条里的构建步骤,倒数第二个:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)(产出它要消费的 tickets,并声明决定它们顺序的阻塞关系)、[tdd](https://aihero.dev/skills-tdd)(它在每个 seam 处内部驱动的东西),以及 [code-review](https://aihero.dev/skills-code-review)(它在提交前运行的东西)。它位于规划类 skills 的下游,并信任它们。它不会重新验证交给它的东西的结构是否合理,所以一张结构糟糕的地图,或者一个水平分层的 ticket,会被照原样构建出来。

正是这份信任,让 [wayfinder](https://aihero.dev/skills-wayfinder) 在 [to-spec](https://aihero.dev/skills-to-spec) 处汇入这条链条,而不是把它的地图直接循环进 `implement`。只有当一次工作最终证明确实很小时,才从一张地图直接走到 `implement`。

当你不确定自己处在哪条 flow 里时,[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖整套集合的 router。
