[English](wayfinder.md) · [简体中文](wayfinder.zh-CN.md)

## What it does

`wayfinder` 拿一次大到单个 agent [session](https://www.aihero.dev/ai-coding-dictionary/session) 装不下的工作——一个你能说出**目的地**、却还看不清路线的想法——把它绘制成你 issue tracker 上一张共享的 **decision tickets** 地图,然后逐个解决它们,直到路径清晰。

它做的是规划,不是执行。每个 ticket 都承载一个问题,它的解决方式是一个决策,而不是一段要执行的构建切片,当在有人真正动手构建这个东西之前没有什么需要再决定时,这张地图就完成了。正是这一条规则,把一个 wayfinder ticket 和一个普通的实现 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 区分开来,也是 agents 最常打破的规则。当地图清晰时,wayfinder 负责交接;它不会继续写代码。

## When to reach for it

你需要输入 `/wayfinder` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。

它是这套集合里最重、最密集的 flow,所以触发条件很窄:这次工作必须真的大到单个 agent session 装不下,通向目的地的路线也必须是模糊的。这个划分很清晰:`/grill-with-docs` 用于单 session 规划,`/wayfinder` 用于多 session 规划。

| 你眼前的情况 | 该跑什么 |
| --- | --- |
| 一个范围清楚、能一次坐下来搞定的 feature | [grill-me](https://aihero.dev/skills-grill-me),如果有代码库就用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一个 greenfield 项目,或一次跨越很多 session 的构建,路线还不清楚 | `/wayfinder` |
| 一段决策已经做完的线程 | [to-spec](https://aihero.dev/skills-to-spec)——直接跳过地图 |
| 一张已经清晰的 wayfinder 地图 | [to-spec](https://aihero.dev/skills-to-spec),然后 [to-tickets](https://aihero.dev/skills-to-tickets) 和 [implement](https://aihero.dev/skills-implement) |
| 一个已经变得太大的现有 session | 说"hand off to `/wayfinder`"——[handoff](https://aihero.dev/skills-handoff) 既能桥接进一张地图,也能从地图里桥接出去 |

Greenfield 不是必要条件。Wayfinder 也常规地用在遗留和半成品代码库上,而且在那里可以说更犀利,因为很多迷雾其实是"这里现在到底是什么样",而不是"我们该做什么"。

## Prerequisites

这张地图和它的 tickets 存放在仓库的 issue tracker 上,所以 wayfinder 需要 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 打好的 tracker 接线。那一步会写一份 "Wayfinding operations" 小节,描述地图、它的子 tickets、阻塞关系和 frontier 查询在 GitHub、GitLab 或本地 markdown 上分别是怎么表达的。Wayfinder 是通过你 `CLAUDE.md` / `AGENTS.md` 里的指针来解析这份文档的,而不是一个固定路径;如果完全没有配置 tracker,它会退回到本地 markdown 文件。

Tracker 不是装饰。阻塞关系正是能在 tracker 自己的 UI 里可视化渲染出 frontier 的东西,一个没有原生依赖链接的 tracker——比如一个自建的 Gitea——会让 wayfinder 退化成从地图文字里推断阻塞项,这依然能用,但需要更仔细的监督。

## The map, the fog, and the frontier

**地图**是一个打了 `wayfinder:map` label 的单一 issue;它的 tickets 是它的子 issues。它是一个**索引,不是一个存储库**——一个决策只活在一个地方,它的 ticket,地图只概述它、链接它。一个 session 会以低分辨率加载这张地图,按需放大到具体 tickets,这正是让一张地图能持续增长、而不需要每个 session 都为它的全部历史付出代价的原因。

它上面存放着四样东西:

- **Destination** —— 到达这张地图终点时是什么样子。给它命名是绘图的第一个动作,先于任何 ticket 存在,因为目的地划定了每个 ticket 都要据以衡量的范围。
- **Decisions so far** —— 每个已关闭 ticket 一行,各自链接到细节真正存放的地方。
- **Not yet specified** —— **战争迷雾(fog of war)**。你能感觉到即将出现、但还没法精确表述的决策。判断该记进迷雾还是该立 ticket 的标准是,你*现在*能不能精确地表述这个问题,而不是你能不能回答它。解决一个 ticket 会清除它前方的迷雾,把现在能被说清楚的东西提炼成新的 tickets。
- **Out of scope** —— 被判定超出目的地范围的工作。迷雾只会朝着目的地聚集,所以超出范围的工作会被关闭,永远不会"毕业"晋升。

**Frontier** 是那些未关闭、未阻塞、未被认领的 tickets——已知范围的边缘。一个 session 在做任何工作之前,会先把一个 ticket 分配给自己来认领它,所以那个 assignee 就是认领的凭证,并发的 sessions 会跳过它。Tickets 全程都用名字来指代,绝不用一个裸的 `#42`;一整墙的 issue 编号在叙述里难以辨认。

## The four decision-ticket types

每个 ticket 都带着一个 `wayfinder:<type>` label,要么是 **[HITL](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)**——和一个能替自己发言的真人一起完成——要么是 **[AFK](https://www.aihero.dev/ai-coding-dictionary/afk)**,完全由 agent 单独驱动。一个 HITL ticket 只能通过那次实时交流来解决;一个自问自答自己 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 问题的 agent 就已经破坏了这一点。

| 类型 | 模式 | 什么时候用 | 由谁解决 |
| --- | --- | --- | --- |
| `grilling` | HITL | 默认情况。这个问题能靠聊天解决。 | [grilling](https://aihero.dev/skills-grilling) 加上 [domain-modeling](https://aihero.dev/skills-domain-modeling),在一个全新 session 里 |
| `prototype` | HITL | "这该长什么样"或"这该怎么表现"——一个聊天解决不了的问题。 | [prototype](https://aihero.dev/skills-prototype),构建出的 artifact 会作为一个资产从这个 ticket 上链接过去 |
| `research` | AFK | 一个 working directory 之外的事实正在阻塞一个决策。 | 一个 [research](https://aihero.dev/skills-research) [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent),在绘图时启动,并行解决 |
| `task` | 两者皆可 | 没什么要决定的,但手动工作阻塞了一个决策——置备访问权限、注册一个服务、搬运数据以便看清它的形状。 | Agent 能自己做的就自己做,否则给人类一份精确的清单 |

`task` 是唯一*做事*而不是*做决策*的类型,它的价值在于解除某个决策的阻塞——绝不是直接交付目的地的一部分。这是实际使用中最常出问题的类型:agents 会把它理解成一个实现步骤,开始在地图内部写产品代码。

Research 是"每个 session 一个 ticket"这条规则唯一的例外。

## Common questions

**这个和 `/grill-with-docs` 有什么不同?我该从哪个开始?**

看 session 数量,不看项目规模。`/grill-with-docs` 是单 session 规划;wayfinder 是多 session 规划。如果你能把整件事装进一段对话,grilling 是更便宜、更好的工具,wayfinder 在那种情况下确实更慢、更密集。社区总结出的经验法则是:只有当工作装不进一个 session 时,wayfinder 才有意义。这是目前为止被问得最多的 wayfinder 问题,而且反复被问到,因为这些描述没告诉你,你自己的任务落在这条线的哪一边——你得自己判断 session 数量。

**它问"目的地"时,指的是这个 session 的终点,还是一切的终点?**

是整张地图——整张地图的目的地,不只是最初这个 session 的。这个问题读起来有歧义,因为 wayfinder 按定义就是一个多 session 工具,所以一个局限在单个 session 的答案永远说不通。典型的目的地是一份要交接出去的 spec、一个要在规划开始前锁定的决策、一个概念验证,或者一次原地进行的改动,比如一次数据迁移。

**地图清晰了。我为什么还需要 `/to-spec` 和 `/to-tickets`——wayfinder 不是已经写好 spec、做好 tickets 了吗?**

不是。Wayfinder 的 tickets 是 decision tickets,等到地图关闭时,它们也全部关闭了。剩下的是一张挂满相互关联决策的地图,那不是一份构建计划。[to-spec](https://aihero.dev/skills-to-spec) 把这些相互关联的决策收拢成一份 spec——`/to-spec #<map_issue>`——[to-tickets](https://aihero.dev/skills-to-tickets) 再把它切成 tracer-bullet 实现 tickets。把地图直接循环进 [implement](https://aihero.dev/skills-implement) 会跳过这次收拢,丢掉那些关联细节。只有当这次工作最终证明确实很小时,才直接走实现。确实有人在跑这个精简过的流程,而且反映能用;那多出来的两步换来的是一份明确的 spec artifact,一个 reviewer 或同事能读懂它,而这在你不是一个人单干时更重要。

**我的 agent 在一次 wayfinder session 中途开始写生产代码了。**

这是这个 skill 被反映最多的失败,背后有一个真实存在的漏洞。Wayfinder"只规划、不动手"的默认设定,可以在地图的 **Notes** 里被覆盖——但 Notes 是由 agent 自己写的,所以这条约束和它的豁免条款活在同一个文件里,而且这个文件的主人正是被这条约束限制的那一方。有用户亲眼看到一个 agent 在自己的 Notes 里写下"this map carries execution",然后在之后的 sessions 里把这句话读回来、当成自己的许可证,在一台正式运行的服务器上直接构建。这个 skill 内部没有针对"我说的是默认情况"的硬性拦截。在这一点被修复之前:阅读任何不是你自己绘制的地图上的 Notes,把实现工作留在它自己的 sessions 里,把任何看起来像一段构建切片的 `wayfinder:task` 当作类型标错了。

**我绘制了 27 个 tickets,处理到第十三个时,发现剩下的都说不通了。**

一个真实、反复被报告的结果,原话来自一份现场报告。Wayfinder 的默认本能是全面规划,而一张后面的 tickets 建立在被前面 tickets 推翻的假设之上的地图,正是这个 skill 被指控陷入的那种瀑布式陷阱。有两件事能对抗它。把地图的范围限定在一个有边界的目的地上,而不是整个产品——从业者反复报告说,限定在一个明确 epic 上的地图,表现明显好于一张铺开的"实现 V1"式地图,而且规划一件很大的事本来就不是目标——小批量交付才是。以及积极地做 [prototype](https://www.aihero.dev/ai-coding-dictionary/prototyping):这条路线之所以能保持鲜活,正是因为不确定性会被廉价的具体 artifacts 冲刷掉,而不是等实现依赖上它才发现。Wayfinder 是"prototypemaxxing",不是"planmaxxing"。

**我能并行处理几个 tickets 吗?**

Frontier 就是为了显示什么是可以拿的而设计的,阻塞关系的存在也是为了让并行工作在理论上是安全的。实际上,一次一个才是更安全的默认做法。同时处理两个 grilling tickets 的用户,会在一个 session 里被问到他们刚在另一个 session 里回答过的问题,因为这些 sessions 之间不共享任何 [context](https://www.aihero.dev/ai-coding-dictionary/context)。Prototype tickets 上也有一个已知缺口:有报告说一个 agent 构建了三个 UI 变体,自己选了一个,然后关闭了这个 ticket——选择权本该是你的,而这个 skill 目前说得不够响亮。如果你确实要并行运行,先自己审查一遍依赖图。

**我必须用 GitHub Issues 吗?**

不必——任何 issue tracker 都能用。GitHub 是支持得最好的路径,因为它的原生 sub-issues 和阻塞关系,正是不用打开地图就能让 frontier 可见的东西;GitLab、Linear、Jira 和本地 markdown 都有人在用。两点诚实的提醒。一个没有原生阻塞功能的 tracker,意味着依赖图是从文字推断出来的,需要手动纠正。而本地 markdown 会把这些 artifacts 放进你的仓库,这不是推荐做法:把这类材料存进仓库,往往会导致意外的持久化。开源维护者遇到的是相反的问题——公开的 tracker 被 agent 生成的规划 tickets 填满——所以他们往往还是会选择本地 markdown。

**Grilling 很累人。每个问题都有三段那么长。**

这是关于 wayfinder 目前最尖锐、也还没解决的抱怨。一位用户给出的拆解是:冗长本身就会导致决策疲劳,而且这种长度会把"为什么问这个问题"给剥离掉,于是随着地图变长,你会丢掉从一个决策到下一个决策的那条链。这种冗长看起来是当前这批 [models](https://www.aihero.dev/ai-coding-dictionary/model) 的属性,而不是这个 skill 本身的属性,目前没有随附的修复。流传中的从业者缓解方法:用一个更低的 [reasoning effort](https://www.aihero.dev/ai-coding-dictionary/effort),在你的全局 `CLAUDE.md` 里加一条大白话指令。不管怎样,预期在这里要花真实的脑力——wayfinder 向你要求的思考量不是一个缺陷,那正是它大部分的意义所在。

**一个我已经关闭的决策后来发现是错的。我该编辑旧 ticket,还是新建一个?**

没有官方指引,agent 的本能也帮不上什么忙:它倾向于绕着这个错误决策去设计,而不是挑战它,所以你得手动引导它。真正有效的是明确告诉 wayfinder 发生了什么变化——它会更新地图,修订受影响的 tickets,并在已经关闭的那些上留言。地图中途的范围变化是可以挽回的。一张你*设计*成会变化的地图,才是一种范围设定上的坏味道。

**`decision-mapping` 去哪了?**

就是这个 skill,在 v1.1 里改名成了 `wayfinder`,用 `/wayfinder` 调用。"Decision map" 这个说法既是行话、又不准确,因为四种 ticket 类型里只有一种本身真的是一个决策。这次重新框定给了这个 skill 一套连贯的词汇——destination、fog of war、frontier、the map——而不是叠加在上面的一个生造术语。不过这个单元保留了"decision"这个词:一个 wayfinder ticket 被称为 **decision ticket**,正是为了防止人们把它读成一个实现 ticket。

## It's working if

- 在任何一个 ticket 存在之前,目的地已经被写下、被认可。
- 每个未关闭的 ticket 读起来都像一个问题。任何读起来像"build the X"的 ticket,要么类型标错了,要么该属于地图的下游。
- 你能看一眼你的 tracker,不用打开地图就知道哪些 tickets 是可以拿的——那正是 frontier 通过原生阻塞关系自己渲染出来的效果。
- 一个 session 解决一个 ticket,把答案发成一条解决评论,关闭它,在地图的 *Decisions so far* 里留一行。然后就停下来。
- **Not yet specified** 会随时间收缩。一块提炼成 ticket 的迷雾会从那个小节里消失,而不是两处都留着。
- 当开局的广度优先 grilling 完全没有发现迷雾时,这个 skill 会停下来,告诉你这次工作小到可以跳过地图。
- 完成这张地图的那个 session,把你带向的是一份 spec,而不是一个 pull request。

## Where it fits

`wayfinder` 是一个**因情况而定的 on-ramp**,不是默认的前门。以 grilling 为起点的 idea → ship 这条链条依然是大多数工作开始的地方;当一个想法大到单个 session 装不下时,你才会爬上 wayfinder,它会在 [to-spec](https://aihero.dev/skills-to-spec) 处重新汇入那条链条,因为一张清晰的地图负责交接,不负责构建。

在底层,它大多是其他 skills 套上了 wayfinder 的调度:[grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 解决默认的 ticket 类型,[prototype](https://aihero.dev/skills-prototype) 解决那些聊天解决不了的 tickets,[research](https://aihero.dev/skills-research) 作为一个 subagent 运行,所以它的阅读过程从不会落进你的 session。[handoff](https://aihero.dev/skills-handoff) 是进出的桥梁——从一段已经超出自身容量的对话桥接进一张地图,当一个 side quest 在 session 中途出现时桥接出去。对其他任何情况,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你在整套集合里路由。
