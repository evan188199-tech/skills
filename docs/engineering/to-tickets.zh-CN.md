[English](to-tickets.md) · [简体中文](to-tickets.zh-CN.md)

## What it does

`to-tickets` 拿一份 plan、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec),或者你正在进行的这段对话,把它拆成一组你 issue tracker 上的 **[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)**。每个 ticket 都声明自己的**阻塞关系**——那些必须先完成、它才能开始的其他 tickets。

每个 ticket 都是一颗 **tracer bullet**:一条窄但完整的、贯穿这次改动每一层——schema、API、UI、测试——的路径,一落地就能独立演示。这正是让它和拆分工作的显而易见做法(一次切一层、最后再集成)行为不同的约束。它也会把每个 ticket 的大小控制在能装进单个全新 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 的范围内,因为拿起这个 ticket 的东西,是一个从没见过你那份 spec 的 [session](https://www.aihero.dev/ai-coding-dictionary/session)。

## When to reach for it

你需要输入 `/to-tickets` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。

| 你在哪一步 | 该跑什么 |
| --- | --- |
| 你有一个 spec issue,构建跨越好几个 session | `/to-tickets`,或者 `/to-tickets #<spec_issue>` |
| 这个计划只存在于对话里,从没被写下来 | `/to-tickets` 会直接读这段线程——不需要 spec |
| 整个改动装得进一个 context window | [implement](https://aihero.dev/skills-implement)——跳过 tickets |
| 什么都还没决定 | 先 [grill-with-docs](https://aihero.dev/skills-grill-with-docs),再 [to-spec](https://aihero.dev/skills-to-spec) |
| 一张 [wayfinder](https://aihero.dev/skills-wayfinder) 地图已经清晰了 | 先走 [to-spec](https://aihero.dev/skills-to-spec) 收拢这张地图,再 `/to-tickets` |

`to-tickets` 产出的 tickets 从设计上就是 agent-ready 的。不要对它们跑 [triage](https://aihero.dev/skills-triage)——triage 是给从别人那里到来的工作用的。

## Prerequisites

`to-tickets` 会发布到一个 tracker,所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须已经为这个仓库配置好了一个,以及 triage-label 词汇。两种都行:一个像 GitHub 或 Linear 这样的真实 tracker,或者 `.scratch/` 下的本地 markdown 文件——这个是开箱即用支持的。

## Tracer bullets, not layers

一个**水平**切片交付这次改动的一层。在每一层都落地之前什么都不能用,而且每个 ticket 的 acceptance criteria 都得伸手够到另一个 ticket 拥有的工作。一个**垂直**切片——tracer bullet——一次性交付贯穿所有层的一条窄路径,所以它能独立被验证,拥有它评判的一切。

这是人们最常打破的规则,后果也有据可查。有一个团队跑过一叠按层切分的 26 个 tickets——语料库、生产者、聚合器、选择器——结果平均每关闭一个 ticket 要跑大约二十次 agent 运行,其中大约四分之三是返工。他们自己的事后复盘把每一类失败都追溯回了水平切分,而不是具体的实现。

在任何东西被发布之前,会先发生两件事。`to-tickets` 会寻找可以 prefactor 的机会——"先让改动变容易,再做那个容易的改动"——并把这部分工作排在最前面。然后它会把拆分方案以一份编号列表展示出来,就此盘问你:粒度对不对、阻塞关系是不是真实的、有没有什么该合并或拆分。在你批准之前,什么都不会进 tracker,那次盘问正是你该提出异议的地方。

## Blocking edges

这些阻塞关系正是这份 artifact 的意义所在。它们根据 tracker 的不同,有两种呈现方式:

| Tracker | 阻塞关系存放在哪 | 你怎么处理它们 |
| --- | --- | --- |
| 本地 markdown | `.scratch/<feature>/issues/<NN>-<slug>.md` 下每个 ticket 一个文件里的文本,阻塞项在前编号 | 从上到下,手动处理 |
| 一个真实 tracker(GitHub、Linear) | 原生阻塞链接,或者 tracker 支持的情况下用 sub-issues | 任何阻塞项已完成的 ticket 都在 **frontier** 上,可以直接拿走 |

不管哪种情况,这些阻塞关系都活在 ticket 里。介质只决定了能不能有东西并行处理它们。`to-tickets` 产出这份 artifact;运行它——一次一个 session,还是一整支队伍——是你的工作,不是这个 skill 的。

## The wide-refactor exception

有一种情况会打破 tracer-bullet 规则。一次**宽幅重构(wide refactor)**是一次单一的机械性改动——重命名一个字段、给一个共享符号改类型——它的**波及范围(blast radius)**会扇形扩散到整个代码库,所以一次编辑就会打破成千上万个调用点,没有哪个垂直切片能顺利落地。

`to-tickets` 会改用 **expand–contract** 来编排它:

- **Expand**——在旧形式旁边加上新形式,这样什么都不会坏。
- **Migrate**——按波及范围分批(按 package、按目录)把调用点迁移过去,一批一个 ticket,每一批都被那次 expand 阻塞。因为旧形式还在,CI 保持绿色。
- **Contract**——等没有调用方还在用旧形式了,就删掉它,这个 ticket 被每一批迁移阻塞。

当即使是单独一批也没法保持绿色时,它们会共享一个 integration 分支,全部阻塞一个最终的 integrate-and-verify ticket。只有在那里才承诺是绿色的。

## Common questions

**它给一次三行的改动产出了十二个 tickets。**
过度拆分是这个 skill 被反映最多的摩擦点,而且在不同使用者之间高度一致:[model](https://www.aihero.dev/ai-coding-dictionary/model) 默认倾向于原子化的单元,丢掉了本该让它们有意义的分组。那次盘问步骤正是为此存在的——让它合并,它就会合并。更深层的答案是,tickets 有一道下限:如果整个改动装得进一个 context window,你根本不需要这个 skill。直接走 [implement](https://aihero.dev/skills-implement)。

**产出的 tickets 是按层来的——所有 schema 在一个里,所有 API 在另一个里。**
这正是垂直切片规则想要防止的失败模式,而这个 skill 有时候依然会产出它。在盘问阶段抓住它,方法是每个 ticket 都问一个问题:这个完成之后我能演示什么?一个答不出来的 ticket 就是一个水平切片。有些人为此在每个 ticket 上加一行"demo path",据报告这能把模型推向垂直拆分。

**在 GitHub 上,这些 tickets 没有被创建成 spec issue 的 sub-issues。**
已知问题,还没修。已经在十几次运行、多个模型上被报告过,[最完整的记录在 issue #554](https://github.com/mattpocock/skills/issues/554),而且在 Codex 上比在 Claude 上更严重。`gh` 从 v2.94 开始原生支持这个:`gh issue create --parent <n>`,以及事后用 `gh issue edit <parent> --add-sub-issue <n>`。在这份 tracker 模板改用它们之前,运行完之后自己手动接上父级链接是更可靠的做法。

**"Blocked by" 被写进了 issue 正文,而不是一个真正的阻塞链接。**
同一类问题,[记录在 issue #513](https://github.com/mattpocock/skills/issues/513),那次 agent 甚至断言 GitHub 根本没有原生阻塞关系。它有——`gh issue create --blocked-by 12,15`。因为阻塞项总是先被发布,它们的编号在创建时总是可用的。正文文本本该是给没有原生边关系的 tracker 用的退路,而不是默认做法。

**本地 tickets 存到哪了?V1.1 的笔记说是根目录的一份 `tickets.md`。**
以前是这样,那是一个 bug——一个共享的单一文件,在并行 agents 写入时也会产生竞态。本地模式现在会在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下按依赖顺序为每个 ticket 写一个文件,和本地 tracker 模板已经描述过的布局一致。这个 `NN` 前缀是一个真实的 ticket ID,所以 `/implement 03` 能直接用,不用重新打一遍长长的标题。

**它读我的 spec 时一直在截断。**
一份非常大的 spec 可能会超出一个 tracker issue 能干净返回的量,而且没有本地拷贝可以退回去用——agent 于是会耗费大量 [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) 重新获取分片,却始终读不到结尾。在 `/to-spec` 和 `/to-tickets` 之间不要 [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) 或 [compact](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个 context window 里跑完它们,这份 spec 就完全不需要被重新获取。

**Acceptance criteria 没有真正评判任何东西——有些在任何工作开始之前就已经"通过"了。**
这份模板只要求写 criteria,却没说它们能不能失败,所以这种情况会发生。三种情况反复出现:一条在基准 commit 上就已经成立的标准、一条只能靠另一个 ticket 拥有的工作才能满足的标准,以及一条只是复述了请求本身、而不是从 artifact 推导出来的标准。垂直切片能防止大部分这类问题——一个交付此前不存在的行为的切片,在基准 commit 上天生就是红色的——但这项检查依然值得手动做一遍。对每条标准,说出能证明它为假的那个观察,并确认它在实现者开始的那个 commit 上确实是失败的。

**Tickets 都发布好了。我该怎么真正运行它们?**
这个 skill 到产出这份 artifact 就停了,没有自动分发模式。分发是手动的:看一眼看板,数一下没有未关闭阻塞项的 tickets 有多少,开对应数量的 agent sessions。一个全新 context 一个 ticket,session 之间清空。要注意的是,不管在 GitHub 还是本地 markdown 上,[implement](https://aihero.dev/skills-implement) 都不会可靠地在完成时关闭或勾选这个 ticket,所以更新它的状态得靠你自己。

## It's working if

- 每个 ticket 都能回答"这个完成之后我能演示什么?"——而且答案是一个行为,不是一层。
- 在任何东西被发布之前,这份列表会带着编号、每个都配一行 "Blocked by" 回来给你看。
- 排在最前面的 ticket 没有任何阻塞项,可以立刻开始。
- Ticket 正文里没有任何文件路径或行号,除了一个 prototype 产出的代码片段。
- 每个 ticket 读起来都像是一个全新 session 不需要你在场就能完成的东西。
- 如果找到了可以 prefactor 的地方,它排在最前面,而不是和 feature tickets 混在一起。

## Where it fits

`to-tickets` 是主构建链条里的一步:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

上游是 [to-spec](https://aihero.dev/skills-to-spec),它交给这个 skill 一份已经敲定、可供切分的 spec——把两者放在同一个不中断的 context window 里。下游是 [implement](https://aihero.dev/skills-implement),它在每个全新 session 里构建一个 ticket,为测试驱动 [tdd](https://aihero.dev/skills-tdd),并以 [code-review](https://aihero.dev/skills-code-review) 收尾。当你拿不准哪个 skill 或 flow 合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
