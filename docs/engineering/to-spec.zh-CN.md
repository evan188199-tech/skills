[English](to-spec.md) · [简体中文](to-spec.zh-CN.md)

## What it does

`to-spec` 把你刚进行的那段对话变成一份 **[spec](https://www.aihero.dev/ai-coding-dictionary/spec)**,并把它作为单个 issue 发布到你的 issue tracker。

它不会采访你。等你用上它的时候,决策已经做完了,所以它综合的是已知的东西——来自这段线程、来自代码库、来自你的 `CONTEXT.md` 和 ADR——而不是开启新一轮提问。这份 spec 记录的是已经做出的决策,不是产生新决策的地方。

## When to reach for it

你需要输入 `/to-spec` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。

当这次构建大到单个 agent [session](https://www.aihero.dev/ai-coding-dictionary/session) 装不下、必须能被拆到好几个 session 里进行时用它。这就是全部的触发条件:

| 你在哪一步 | 该跑什么 |
| --- | --- |
| 你还什么都没决定 | 先走 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 已经决定了,工作量装得进一个 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) | [implement](https://aihero.dev/skills-implement)——跳过 spec |
| 已经决定了,工作跨越好几个 session | `/to-spec`,然后 [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一张 [wayfinder](https://aihero.dev/skills-wayfinder) 地图已经清晰了 | `/to-spec #<map_issue>` |

## Prerequisites

`to-spec` 把这份 spec 作为一个 issue 发布,所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须已经为这个仓库配置好了一个 tracker 和 triage-label 词汇。两种都行:一个像 GitHub 这样的真实 tracker,或者 `.scratch/` 下的本地 markdown 文件——这个是开箱即用支持的。

## The spec is a decision record

这份 spec 之所以存在,是因为 context windows 是会结束的。你在 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 过程中敲定的一切——方案的形状、你反复争论过的选择、你刻意拒绝的东西——都在一段即将被清空的对话里。Spec 就是能在这之后存活下来的东西。

所以它不验证任何东西,也不决定任何东西。它用你项目自己的词汇,记录下已经被决定的东西,这样一个全新的 session 就能接手这份工作,不需要你重新解释一遍。任何 spec 里断言的、你其实从没说过的东西,都是一个缺陷。

## Seams before prose

在写下第一个字之前,`to-spec` 会先勾画出这个 feature 将要被测试的 **seams**,并和你核对。它优先选用已经存在的 seams,而不是新的,尽量用最高层次的那一个——一次改动里理想的数量是一个。

这些达成一致的 seams 之后会被沿用。[tdd](https://aihero.dev/skills-tdd) 只在预先约定的 seams 上工作,[code-review](https://aihero.dev/skills-code-review) 会对照这份 spec 审查 diff,所以一个没人同意过的 seam 会作为一条 review 发现浮现出来。这种约束是间接的——它通过这份文档发挥作用——这正是为什么这里的 seam 讨论值得认真对待,而不是拖到实现阶段才处理。

## Common questions

**`/to-prd` 去哪了?**
就是这个 skill,在 v1.1 里改了名字。"Spec" 现在是唯一贯穿始终的术语,旧的 `to-prd` slug 已经失效——用新名字重新安装。取代旧词汇的这一对是*spec*和*tickets*:spec 是目的地和敲定它的那些决策,[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 是抵达那里的执行步骤。如果你转向了,删掉未完成的 tickets,保留 spec。

**为什么这份 spec 会被打上 `ready-for-agent` 这个 label?我不想让一个 agent 直接照它实现。**
这个 label 的意思是"不需要再做 triage 了"——这份文档已经完整到 agent 可以据此工作。这是一个输入层面的标记,不是一份工作指令。但如果你运行的 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agents 是靠轮询 `ready-for-agent` 来找活干的,这个区别对它们来说是不可见的,它们会欣然尝试一次性构建整份 spec,而不是逐个拿起 ticket 切片。这是这个 skill 被反映最多的粗糙边缘。在这一点改变之前,要么在你 AFK agent 的 prompt 里明确排除这个父级 spec,要么在 `/to-tickets` 跑完之后把这个 label 摘掉。

**为什么不直接从 grilling 走到 `/to-tickets`、跳过 spec?**
很多时候你确实该这样做——spec 这一步只有在跨 session 的工作上才值得。它的回报在于:tickets 是可丢弃的,spec 不是:每个 ticket 都是按装进单个全新 context window 来定大小的,用完就被删除或关闭,而 spec 一直留着,是它们背后推理过程唯一的归宿。在一次单 session 的改动上,这带不来任何好处,你反而多付出了一步额外的综合过程,[model](https://www.aihero.dev/ai-coding-dictionary/model) 可能在这一步里漂移。直接走 grilling → `/implement`。

**我刚完成了一张 wayfinder 地图。该把什么喂给它?**
主地图 issue——`/to-spec #<map_issue>`,不是各个单独的 decision tickets。[wayfinder](https://aihero.dev/skills-wayfinder) 产出的是决策而不是交付物,散落在一张地图上;`to-spec` 这一步把它们收拢成一份可构建的文档。把地图直接循环进 `/implement`,会把这次收拢丢掉。

**这份 spec 是给我审阅的,还是只给 agent看的?**
主要是给 agent 看的,读起来也是那样——完整、密集、大量引用。值得你亲自过目的部分是 seams 和 out-of-scope 这两节,因为这是最容易低成本发现一个错误决策、也是事后发现代价最高的两个地方。完整从头读到尾是一个人们真实存在的抱怨,也没有摘要模式:诚实的答案是,如果这份 spec 让你感到意外,说明 grilling 做得不够深,而不是 spec 写得太长。

**Tickets 开始之后,我该让这份 spec 保持不变,还是让 agent 重写它?**
没有什么机制让它保持同步,所以实际上它是你当时所知信息的一份快照,一旦实现过程教给你新东西,它就立刻过时了。工作发布之后,把它当作一次性的东西对待。真正该长期保留的 artifacts 是你的 `CONTEXT.md` 和你的 ADR——如果实现过程中学到的东西值得留存,它该去那里,而不是去一份被修改过的 spec 里。

**我的工作是一次重构或一条模块边界,不是一个 feature。这份模板合适吗?**
不太合适,这是一个已知的局限。这份模板重度依赖 user stories,这对架构类工作是错误的形状——你最终会围绕真正关于接口和不变量的决策,写出一堆没人要求过的 stories。改为依赖 implementation-decisions 和 testing-decisions 这两节,让那些真正持久的架构决策通过 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 落成 ADR,而不是硬让这份 spec 去承载它们。

**它会检查 tracker 上的相关工作吗,或者引用它所遵循的那些 ADR吗?**
两者都不会。它会读取并遵循涉及它所触碰区域的 ADR,但不会链接它们,起草之前也不会搜索 tracker 里有没有重叠的 issues——所以一份 spec 可能会悄悄重复某人已经提交过的工作。如果这个区域比较活跃,先自己搜一遍 tracker。

**`/to-tickets` 读不了我的 spec——它一直在截断。**
非常大的 spec 可能会超出一个 tracker issue 能干净返回的量,而且没有本地拷贝可以退回去用。修法是保持上下文卫生:在 `/to-spec` 和 `/to-tickets` 之间不要 [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) 或 [compact](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个窗口里跑完它们,这份 spec 就完全不需要被重新获取。

## It's working if

- 它开始直接写,而不是问你新一轮问题。
- 它在写之前先把 seams 摆给你看,提出的数量尽量少。
- 它写回来用的是你项目自己的名词,不是通用的产品管理套话。
- 里面的每一个决策你都记得自己做过。没有什么是为了填满一节而凭空发明的。
- Out-of-scope 那一节里有真实的内容——你拒绝过的那些东西,通常是这页上最有用的几行。

## Where it fits

`to-spec` 是主构建链条里的一步,而且只在它的多 session 分支上才会用到:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它上游的邻居是负责做决策的 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)(这个 skill 只负责记录),以及 [wayfinder](https://aihero.dev/skills-wayfinder)(它完成的地图正是在这里汇入这条链条)。在下游,[to-tickets](https://aihero.dev/skills-to-tickets) 把这份 spec 切成 tracer-bullet tickets,供 [implement](https://aihero.dev/skills-implement) 构建。当你拿不准哪个 skill 或 flow 合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
