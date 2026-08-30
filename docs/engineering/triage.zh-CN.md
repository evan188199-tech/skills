[English](triage.md) · [简体中文](triage.zh-CN.md)

## What it does

`triage` 处理你项目 tracker 上的 issues,让每一个都在一套小型的 **triage roles** 状态机里流转——一个 category role 和一个 state role——最终留下一份 agent-ready 的 brief、一个给报告者的具体问题,或者一个带着记录理由的已关闭 issue。

它只针对**不是你自己创建**的 issues。原始 bug 报告、新进来的 feature 请求、一个不请自来的外部 pull request——从外部落进 tracker 的工作,不管报告者留下的是什么形态。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 从设计上就已经是 agent-ready 的,对它们跑 `triage` 顶多是白费功夫。这条规则很直白:`/triage` 只针对进来的 issues,不针对你自己创建的 issues。

第二点让它和手动打标签不同的地方:它推荐,然后等待。它把自己的 category 和 state 判断连同理由一起告诉你,外加它在代码库里发现的东西,在你给出指示之前什么都不应用。

## When to reach for it

你需要输入 `/triage`,然后用大白话描述你想要什么——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。"Show me anything that needs my attention"、"let's look at #42"、"move #42 to ready-for-agent"。

| 你手上有什么 | 该去哪 |
| --- | --- |
| 一个 tracker 里塞满了别人的原始报告 | `/triage` |
| 你自己一个粗略的想法,什么都还没写下来 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一段已经敲定的对话,要变成一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) | [to-spec](https://aihero.dev/skills-to-spec) |
| 一份 spec,要拆成 agent-ready 的 tickets | [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一个已确认的 bug,需要的是根因,不是一个标签 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

## Prerequisites

`triage` 会读写你的 issue tracker,所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须已经先配置好那个 tracker 和它的 label 词汇。下面这些角色名是**规范名称**;你 tracker 里的 label 字符串可能不同,这份映射正是 setup 提供的东西。如果你的 tracker 已经在精确使用这些规范名称,就没什么要映射、也没什么要配置的。

Tracker 配置还决定了外部 pull requests 算不算一个 request surface、谁算外部。这个开关默认关闭,不再是一个 setup 问题——如果你想让 PR 也在范围内,在 `docs/agents/issue-tracker.md` 里把它打开。

## The state machine

每个经过 triage 的条目,最终都恰好带有一个 category role 和一个 state role。两个 categories:`bug`(有东西坏了)和 `enhancement`(新功能或改进)。五个 states:

| State | 含义 |
| --- | --- |
| `needs-triage` | 你需要评估它。一个没打标签的 issue 通常最先落到这里。 |
| `needs-info` | 正在等报告者。他们回复后回到 `needs-triage`。 |
| `ready-for-agent` | 已完全说明清楚,附有一份 agent brief。一个 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agent 可以接手它。 |
| `ready-for-human` | 同样的 brief,外加为什么这个不能被委托——判断性决策、外部访问权限、手动测试。 |
| `wontfix` | 已关闭,理由已记录。 |

这就是全部词汇,"恰好一个 state role"这条不变量,正是让查询保持简单的原因。这也是这个 [skill](https://www.aihero.dev/ai-coding-dictionary/skill) 被要求最多的地方:用户要求过给"已说明清楚、但被另一个 issue 阻塞"的工作加一个第六个状态,要求过给受未来某个触发条件限制的 `deferred` 工作加一个状态,也要求过一个终态 `implemented`。这些都还没实现。见下面的问题。

`wontfix` 分三种情况,区别很重要,因为只有一种会写入知识库:

| 为什么关闭它 | 会发生什么 |
| --- | --- |
| 已经实现了 | 一条指向它已经在哪实现的评论。不写入 `.out-of-scope/`——这是一个已经建成的功能,不是一个被否决的功能,把它记进去会用错误的否决记录污染去重检查。 |
| 被否决的 bug | 礼貌地解释,然后关闭。 |
| 被否决的 enhancement | 在 `.out-of-scope/` 下建一个文件,从关闭评论里链接过去,然后关闭。 |

`.out-of-scope/` 是一个被否决**概念**一个文件,不是一个 issue 一个文件,写成一份简短的设计文档,而不是一条数据库记录:被否决的是什么、为什么,以及每一个提出过这个请求的 issue。`triage` 在评估任何东西之前会先读完整个目录,按概念而不是关键词匹配——"night theme" 能匹配上 `dark-mode.md`。命中匹配时,它会把旧决策亮出来,问你是否还是同样的想法,而不是从头重新吵一遍这个请求。

## Verify before you brief

在做任何 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 之前,`triage` 会先检查这个说法是否真的站得住脚。对于一个 bug,它按报告者的步骤复现它。对于一个 PR,它 checkout 这个分支,跑相关测试。然后它报告发生了三件事中的哪一件:已确认(附代码路径)、复现失败,或者细节不足以尝试——这本身就是最强的 `needs-info` 信号。

在同一轮里,它还会对代码库做另外两项检查——**redundancy**(这是不是已经实现了,按领域概念而不是按报告者的措辞搜索?)和 **prior rejection**(`.out-of-scope/` 里是不是已经说过不了?)。两者都很便宜,一旦命中都会产出一个 `wontfix`。

这一切都是为了让一个 artifact 做好:**agent brief**,一个 issue 转为 `ready-for-agent` 时发布的结构化评论。一旦发布,这份 brief 就是合约,原始报告只是上下文。Brief 是为**持久性**而不是精确性而写的,因为一个 issue 可能在 `ready-for-agent` 状态下停留数周,而代码在它下面持续变化。所以它们点名类型、签名和行为契约,绝不写文件路径或行号。一次已确认的复现,能让 brief 比一个猜测强得多。

## A PR is an issue with attached code

当 tracker 把外部 pull requests 当作一个 request surface 时,它们会走同一套状态机——同样的 categories,同样的 states,同样的转换。这些 states 只是针对 diff 来解读:`ready-for-agent` 意味着已经附上了一份 brief,agent 应该在这份代码上迈出下一步;`ready-for-human` 意味着可以由人来合并了。一份针对 PR 的 brief 描述的是这份现有 diff 还剩什么要做,而不是怎么从零构建。

发现阶段只展示*外部* PR,因为协作者进行中的分支不算 triage 工作。这个过滤只在发现阶段生效——明确点名一个 PR,不管是谁写的都会被 triage。有一个粗糙边缘:GitHub 模板里列出外部 PR 的那条命令,向 `gh pr list` 请求了一个 `gh` 并不暴露的 `authorAssociation` 字段,所以这条命令原样运行会直接失败([#468](https://github.com/mattpocock/skills/issues/468))。

## Common questions

**我跑了 `/to-spec` 和 `/to-tickets`,现在那些 tickets 停在那没做 triage。我该对它们跑 `/triage` 吗?**
不需要。它们已经是 agent-ready 的了——`to-tickets` 在发布时就打上了 `ready-for-agent` 这个 label,正是为了让一个 AFK runner 不用再走一遍就能拿起它们。遇到这个情况的用户跑了 spec flow,在产出上看到 `needs-triage`,发现自己的 AFK runner 把一切都忽略了。`triage` 是给从外部到来的工作用的 on-ramp;spec flow 是给你自己发起的工作用的车道。它们在 `ready-for-agent` 汇合,不是更早。

**既然已经有了 `to-spec` → `to-tickets` → `implement` 这条 flow,`triage` 还有意义吗?**
只有当你有进来的工作时才有意义。`triage` 比这条主线更早出现,做的是不同的工作:它是给别人提交的报告用的车道。如果你 tracker 里的一切都出自你自己的规划,你会很少打开它。如果你维护任何公开的东西,或者你的团队会向你提交 bug,它就是前门。主要用途是接收外部贡献者 issues 的开源仓库。

**Agent 尝试应用 `ready-for-agent`,`gh` 说这个 label 不存在。**
已知的 open bug([#616](https://github.com/mattpocock/skills/issues/616))。`setup-matt-pocock-skills` 把 label 词汇写进了 `docs/agents/triage-labels.md`,但不会在你的 tracker 里创建这些 labels。用 `gh label create` 或 tracker 的 UI,自己创建一次那五个 state labels 和两个 category labels,问题就消失了。这个 issue 下面链接着一个社区修复分支,还没被合并。

**五个状态不够用——阻塞中、推迟中,或者已实现的呢?**
这是这个 skill 被提出最多次的缺口,有三种形态。一个已经完全说明清楚、但在等另一个 issue 关闭的 issue([#139](https://github.com/mattpocock/skills/issues/139))——报告者的抱怨是,`ready-for-agent` 在那种情况下"技术上是对的"、但会误导人,于是一个 agent 拿起它、撞上一堵墙。被触发条件限制、意图明确但目前还不可执行的未来工作([#297](https://github.com/mattpocock/skills/issues/297))。以及一个"已实现、等待验证"的终态,没有它,一个 AFK runner 可能会把已完成的 tickets 重新排进队列。Matt 已经认同"阻塞中"这个情况是真实存在的,但还没定下名字(`blocked` 还是 `paused`)。这些都还没实现。人们用的变通方法是在 category 旁边加一个仓库本地的额外 label,这样规范状态槽位依然被一个诚实的东西占着,代价是这个 skill 不知道它的存在。有一个社区衍生版本走得更远,加了 `needs-slicing`、`tracking` 和工作量 labels——那能用,但那是他们自己的,不是这个 skill 自带的。

**这个和 `/diagnosing-bugs` 有什么不同?**
这里的验证步骤是刻意做得很浅的——足够回答"这是真的吗,大概在哪"就够了,不是为了找根因。当一个 bug 按报告者的步骤在几分钟内复现不出来时,诚实的做法是 `needs-info`,或者如果你想现在就追下去,就用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。目前两个 skill 的文字都没有提到对方;有用户发现了这道缝隙,目前还开着。

**我能把它指向我整个 backlog、让它自己跑吗?**
你可以这么问,但要留意它读了什么。"show what needs attention" 那一遍,是一次便宜的列表,是为*选择*而设计的——你挑一个,然后它才会针对你选中的那个收集完整的 [context](https://www.aihero.dev/ai-coding-dictionary/context)。一次性对二十个 issues 跑它,一个 agent 可能会悄悄退回到用那份便宜的列表作为证据基础,而那份列表只返回 issue 正文、不含评论。有用户正好撞上了这个:三个 issues 已经各自有一条评论说"already fixed, recommend closing",结果全部三个都拿到了全新的 agent briefs。如果你想做一次批量处理,明确说明每个 issue 的评论都必须被读取。

**它能用于 Linear,或者除了 GitHub Issues 之外的东西吗?**
可以——tracker 是配置,不是硬编码的假设,有人拿它对接 Linear(通过 `linear` CLI)、GitLab,以及 `.scratch/` 下的纯 markdown 文件。一种常见的拆分方式是 Linear 管 issues 和规划,GitHub 管代码和 PR:说 "issue tracker" 的 skills 对应 Linear,说 "PR" 的 skills 对应 GitHub。在 local-markdown tracker 上有一个 open 的模板 bug,生成的文件可能会把 acceptance criteria 重复写两遍,一次在顶层,一次在 agent brief 内部([#200](https://github.com/mattpocock/skills/issues/200))。

## It's working if

- 它处理过的每一项最终都恰好带有一个 category role 和一个 state role——从不是零个,也从不是两个相互冲突的 states。
- 它给你一份带理由的建议,然后停下来,而不是直接改标签、继续往下走。
- 在任何东西到达 `ready-for-agent` 之前,这个 bug 已经被复现过,或者这个 PR 已经被 checkout 并运行过。
- 它写的 briefs 点名类型和行为,不包含任何文件路径或行号。
- 一个六个月前被否决过的请求又回来了,它会说明这一点,引用旧的理由,而不是重新走一遍 triage。
- 它发布的每条评论都以 `> *This was generated by AI during triage.*` 开头。

## Where it fits

`triage` 是一个 **on-ramp**,不是主链条里的一步。主 flow 从你自己的一个想法开始运转——grill、spec、tickets、implement、review——`triage` 是给从外部到来的工作准备的并行车道。它们在同一个地方汇合:一个打了 `ready-for-agent`、附有 brief 的 issue,[implement](https://aihero.dev/skills-implement) 会像处理 [to-tickets](https://aihero.dev/skills-to-tickets) 产出的 ticket 一样接手它。当一个请求需要在写 brief 之前先被打磨清楚时,`triage` 会一起运行 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling),一次一轮问题,让决策在做出的同时落进 `CONTEXT.md` 和 ADR。当你不确定自己在哪条车道上时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
