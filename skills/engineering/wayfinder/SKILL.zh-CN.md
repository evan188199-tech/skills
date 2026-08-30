---
name: wayfinder
description: 把一大块超出单次 agent session 容量的工作，规划成 issue tracker 上一张由 decision tickets 组成的共享地图，逐个解决它们，直到通往目的地的路径清晰。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

一个松散的想法到来了——大到单次 agent session 装不下，还被一团迷雾裹着：从这里到**目的地（destination）**的路径还看不清。Wayfinding 是关于找到那条路，而不是直冲目的地。这个 skill 把这条路绘制成仓库 issue tracker 上的一张**共享地图（shared map）**，然后逐个处理它的 **decision tickets**——这些 tickets 里的问题，其解决方式是一个决策，而不是一段要执行的构建切片——直到路线清晰。

目的地因每次工作而异，给它命名是绘图的第一个动作——它塑造了每一个 ticket。它可能是一份要交接和迭代的 spec、一个要在规划开始前锁定的决策，或者一次原地进行的改动，比如一次数据结构迁移。这张地图是领域无关的——工程工作、课程内容，什么都能套用这个形状。

## Plan, don't do

Wayfinder 默认是在**规划**：每个 ticket 解决一个决策，当路径清晰——在有人真正动手做之前没有什么需要再决定的——地图就完成了。想直接动手做的冲动，通常就是你已经到达地图边缘、该交接出去的信号。一次工作可以在它的 **Notes** 里覆盖这条规则——把执行本身也带进地图——但如果没有这么写，就只产出决策，不产出交付物。

## Refer by name

每张地图和每个 ticket 都是一个 issue，所以它有一个**名字**——它的标题。在任何人类要读的地方——叙述、地图的 Decisions-so-far——都用这个名字来指代它，绝不要用一个裸的 id、编号或 slug。一整墙的 `#42, #43, #44` 难以辨认；名字一眼就能读懂。Id 和 URL 并没有消失——一个名字会包裹着它的链接——但它们藏在名字*内部*，绝不会替代名字本身。

## The Map

地图是这个仓库 issue tracker 上的单个 issue，打上 `wayfinder:map` 这个 label——这是那份权威 artifact。它的 tickets 是这个地图的子 issues。

地图是一个**索引**，不是一个存储库。它列出已经做出的决策，并指向承载细节的那些 tickets；一个决策只活在一个地方——它的 ticket——所以地图从不重述它，只概述它、链接它。

**地图、它的子 tickets、阻塞关系和 frontier 查询具体存放在哪里，是和 tracker 相关的。** Issue tracker 应该已经提供给你了——如果没有，运行 `/setup-matt-pocock-skills`。查阅 tracker 文档里的 "Wayfinding operations" 小节，了解*这个*仓库具体是怎么表达它们的。如果没有提供任何 tracker，默认使用 local-markdown tracker。

### The map body

整张地图的低分辨率视图，每个 session 加载一次。未关闭的 tickets **不会**被列出来——它们是未关闭的子 issues，通过查询来找。

```markdown
## Destination

<what reaching the end of this map looks like — the spec, decision, or change this effort is finding its way to. One or two lines; every session orients to it before choosing a ticket.>

## Notes

<domain; skills every session should consult; standing preferences for this effort>

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [<closed ticket title>](link) — <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

### Tickets

每个 ticket 都是地图的一个**子 issue**；tracker 的 issue id 就是它的身份标识。它的正文就是那个问题，大小控制在单次 100K token 的 agent session 能处理的范围内：

```markdown
## Question

<the decision or investigation this ticket resolves>
```

每个 ticket 都带有一个 `wayfinder:<type>` label——`research`、`prototype`、`grilling`、`task` 之一（见 [Ticket Types](#ticket-types)）。

一个 session 通过把 ticket 分配给驱动这张地图的开发者来**认领**它，而且是在做任何工作**之前**，这样并发的 sessions 就会跳过它。那个 assignee 就是这次认领的凭证：一个未关闭、未分配的 ticket 就是未被认领的。

阻塞关系使用 tracker 的**原生**依赖关系——这一点至关重要，因为它能在 tracker 自己的 UI 里*可视化地*渲染出 frontier，这样人类不用打开地图就能看到哪些是可以拿的。只有当一个 tracker 缺少原生阻塞功能时，才退回到一种正文约定。当阻塞一个 ticket 的每个 ticket 都已关闭时，它就是**未阻塞**的；**frontier** 就是那些未关闭、未阻塞、未被认领的子 tickets——已知范围的边缘。

答案不是正文的一部分——它在解决时才被记录下来（见 [Work through the map](#work-through-the-map)）。解决一个 ticket 过程中创建的资产，从这个 issue 上链接过去，而不是粘贴进去。

## Ticket Types

每个 ticket 要么是 **HITL**——human in the loop，和一个能替自己发言的真人一起完成——要么是 **AFK**，完全由 agent 单独驱动。一个 HITL ticket 只能通过那次实时交流来解决；agent 绝不会替人类那一方发言（一个自问自答的 grilling agent 就已经破坏了这一点）。

- **Research**（AFK）：阅读文档、第三方 API，或者知识库之类的本地资源，找出一个决策正在等待的事实。由一个 `/research` **subagent** 来解决。当需要当前工作目录之外的知识时使用。
- **Prototype**（HITL）：通过做一个廉价、粗糙、具体的 artifact 供人反应，来提高讨论的精细度——一份大纲、一个粗略的方案、一个 stub，或者通过 /prototype skill 做出的 UI/逻辑代码。把这个 prototype 作为一个资产链接过去。当关键问题是"它应该长什么样"或"它应该怎么表现"时使用。
- **Grilling**（HITL）：对话。默认情况。始终调用 /grilling 和 /domain-modeling skills。
- **Task**（HITL 或 AFK）：在一个*决策*能被做出之前必须完成的手动工作——没有什么要决定、做原型或研究的，但讨论会一直卡着，直到它完成。比如注册一个服务，好评估它的 API；置备访问权限；搬运数据，好看清它的形状。这是唯一一种*做事*而不是*做决策*的 ticket 类型——它的价值在于解除某个决策的阻塞，而不是直接交付目的地。Agent 能自己做的就自己驱动（AFK）；否则就把一份精确的清单交给人类（HITL）。工作完成时它就算解决了；答案记录做了什么，以及后续 tickets 会依赖的任何结果性事实（凭证存放位置、新 URL、行数）。

## Fog of war

这张地图是*刻意*不完整的：不要绘制你还看不见的东西。在这些活跃的 tickets 之外，是**战争迷雾（fog of war）**——那些你能感觉到即将出现、但还没法钉死的决策和调查，因为它们悬而未决地依赖着还没打开的问题。解决一个 ticket 会清除它前方的迷雾，把现在能被说清楚的东西提炼成新的 tickets——一次一个，直到通往目的地的路径清晰、不再有 tickets 剩下。

地图的 **Not yet specified** 小节，就是写下那份模糊视图的地方：怀疑存在的问题、以后要重新审视的区域。它是通往目的地*方向上*那片尚未被发现的 frontier——这里的一切都在范围之内，只是还不够清晰、没法立 ticket。想写多松散或多详尽都可以，只要视野允许；它同时也能给读到这里的协作者当路标，告诉他们这次工作正朝哪个方向去。

**该记进 Fog 还是立 ticket？** 判断标准是你现在能不能把这个问题精确地表述出来——*而不是*你现在能不能回答它。

- **该立 ticket，当**这个问题已经足够清晰——即使它被阻塞了、你现在还动不了它。
- **该记进 Not yet specified，当**你还没法把它说得那么清晰。不要提前把迷雾切成 ticket 大小的碎片：它比一个 ticket 更粗粒度，一块迷雾一旦被 frontier 触及，可能会分化成好几个 tickets，也可能一个都没有。

**Not yet specified** 不包括已经决定的东西（Decisions so far）、已经是活跃 ticket 的东西，以及超出范围的东西（下一节）。

## Out of scope

迷雾只会朝着目的地的方向聚集。目的地划定了范围，所以超出它的工作就是**超出范围（out of scope）**——它不是迷雾，也不属于 **Not yet specified**。它在地图上有自己的 **Out of scope** 小节：那些你已经有意识地排除在*这次*工作之外的东西。决定它去哪里的是范围，而不是清晰度。

超出范围的工作永远不会"毕业"晋升——frontier 止步于目的地——所以它只有在目的地被重新划定时才会回来，而且那时是作为一次全新的工作，而不是恢复原来的工作。

把某样东西划为超出范围，是一个界定范围的动作，不是路线上的一步。当一个已经存在的 ticket 后来发现其实落在目的地之外——可能是绘图时范围划错了，也可能是某次解决过程中暴露出来的——**关闭它**（一个已关闭的 ticket 无可争议地已经不在 frontier 上了），并在 **Out of scope** 小节里留一行：概述加上为什么超出范围，链接这个已关闭的 ticket。它不进入 **Decisions so far**，那里记录的是实际走过的路线——一条范围边界不是路线上的一步。

## Invocation

两种模式。不管哪种，**每个 session 都绝不解决超过一个 ticket**——research tickets 除外。

### Chart the map

用户带着一个松散的想法调用它。

1. **给目的地命名。** 跑一次 `/grilling` 和 `/domain-modeling` session，钉死这张地图要找的路通向哪里——是一份 spec、一个决策，还是一次改动。目的地划定了范围，所以要先把它定下来。
2. **绘制 frontier。** 再做一次 grilling，这次是**广度优先**的：在整个空间里铺开，而不是在某一条线索上深挖，把当前已知的开放决策和现在就能迈出的第一步都摆出来。**如果这一步没有发现任何迷雾**——说明通往目的地的路已经清晰了，整段旅程小到一个 session 就能装下——你不需要一张地图。停下来，问用户接下来想怎么做。
3. **创建这张地图**（打上 `wayfinder:map` label）：填好 Destination 和 Notes，Decisions-so-far 留空，把迷雾勾勒进 **Not yet specified**。
4. **把现在就能说清楚的内容创建成 tickets**，作为地图的子 issues——然后在**第二遍**里接上阻塞边（issues 需要先有 id 才能互相引用）。接线会把它们分进 frontier 和被阻塞的两堆；任何现在还说不清楚的都留在迷雾里——也就是 **Not yet specified** 小节。
5. **启动 research subagents。** 对你刚创建的每个 `research` ticket，启动一个 `/research` subagent 并行解决它，把调查结果记录在一个从这个 ticket 指向的、带上下文指针的一次性 `research/<name>` 分支上。
6. 到此为止——绘图是一个 session 的工作；它不会亲自解决任何 ticket。

### Work through the map

用户带着一张地图（URL 或编号）调用它。一个 ticket 是**可选的**——没有指定的话，是你来挑下一个决策，而不是用户来挑。

1. 加载**地图**——低分辨率视图，不是每个 ticket 的正文。
2. 选定这个 ticket。如果用户点名了一个，就用它。否则按顺序取 frontier 上的第一个 ticket。**认领它**：在做任何工作之前把它分配给自己。
3. 解决它——**按需缩放**：按需取回任何相关或已关闭 ticket 的完整正文；调用 `## Notes` 代码块里点名的那些 skills。如果拿不准，就用 `/grilling` 和 `/domain-modeling`。
4. 记录这次解决：把答案发成一条**解决评论**，**关闭**这个 issue，并把一个上下文指针**追加**到地图的 Decisions-so-far 里。
5. 添加新浮现出来的 tickets（先创建再接线）；把这次答案让内容变得可以说清楚的迷雾"毕业"提炼出来，把每一块被提炼过的部分从 **Not yet specified** 里清除，让它只作为自己的新 ticket 存在。如果这次答案揭示出某个 ticket——不管是这一个还是另一个——其实落在目的地之外，就**把它划为超出范围**，而不是把它当作路线的一部分来解决。如果这个决策让地图的其他部分失效了，就更新或删除那些 tickets。

用户可能会并行跑多个未阻塞的 tickets，所以要预期其他 sessions 正在同时编辑这个 tracker。
