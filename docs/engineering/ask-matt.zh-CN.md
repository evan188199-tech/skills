[English](ask-matt.md) · [简体中文](ask-matt.zh-CN.md)

## What it does

`ask-matt` 是覆盖本仓库所有 skills 的 router。你描述自己所处的情况——一个无从下手的想法、一堆涌进来的 bug 报告、一个已经跑得很长的 [session](https://www.aihero.dev/ai-coding-dictionary/session)——它会点名适合的 skill 或者一串 skills，以及这串 skills 里人类决策点分别落在哪里。

它只负责推荐,然后停下。它不会做 grilling、写 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、打开一个文件,或者触发它刚点名的那个 skill;你拿到的是接下来该输入什么,由你自己输入。它同时也是一份手写的、针对本仓库这套 skills 的地图,而不是对你已安装内容的一次扫描,所以它不会帮你在自己写的 skills、或别的作者的 skills 之间做路由。

## When to reach for it

你需要输入 `/ask-matt` 来调用它——agent 不会自己主动使用它。

| 你的情况 | Router 给出的东西 |
| --- | --- |
| 有个想法,不知道从哪开始 | Main flow 的起点,以及这次构建够不够小、可以跳过 spec |
| Bug 和请求从别人那里源源不断地涌进来 | [triage](https://aihero.dev/skills-triage) 这个 on-ramp,以及为什么你自己生成的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 不该走这条路 |
| 两个看起来能互换的 skills | 它们之间的界限,通常是一个具体的检验点,而不是品味问题。[grill-me](https://aihero.dev/skills-grill-me) 还是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs),取决于你是否在一个 working directory 里;[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 还是 [wayfinder](https://aihero.dev/skills-wayfinder),取决于这次工作是否一个 session 就能装下 |
| 一个很长的 session,以及关于 [context](https://www.aihero.dev/ai-coding-dictionary/context) 该怎么处理的决定 | 在一个 phase boundary 上,针对五个选项排好序的决策树 |
| 一个你已经选好的 skill | 没什么用。直接调用那个 skill。 |

## Prerequisites

这个 router 只负责点名 skills,不负责安装它们。它指向的一切都必须先安装好,这条建议才是可执行的,而且它只认识本仓库里被 promote 的 skills。

依赖 tracker 的那些路线——triage、`to-spec`、`to-tickets`、`implement`——都假定 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 已经在这个仓库里配好了一个 issue tracker。在这件事发生之前,router 依然会欣然推荐它们。

## Flows, not skills

这个 skill 给你的思考工具是 **flow**:一条*穿过*这些 skills 的路径,而不是单独的一个。给你的情况命个名,会把你放在某条 flow 的某一步上,这和"这是匹配你关键词的 skill"是不同的答案。存在四种路线,skill 本身完整地承载着它们:

- **Main flow**,从想法到发布。Grill、spec、tickets、implement、review,内部有两个分支:当一个问题需要可运行的代码才能定下来时的一次 prototype 绕道,以及 spec-and-tickets 的拆分——只有当这次构建跨越不止一个 session 时,这次拆分才值得它的成本。
- **On-ramps**,针对会产生工作、随后汇入 main flow 的情形:进来的 bug 报告、坏掉的东西,或者一次太模糊、太大、单个 session 装不下的工作。
- **Standalones**,在所有 flow 之外,按自己的条件被使用——prototype、questionnaire、你已经身处其中的 merge conflict。
- **底层的一层词汇表**,当问题出在用词而不是流程本身时,其他 skills 会引入的这两份参考资料。

## The phase boundary

它交给你的另一个概念是 **phase boundary**。一个 phase 是一个 session 内的一块工作——[grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)、实现、QA——两个 phase 之间的边界,是"我该怎么处理这段 context"这个问题唯一该被提出的地方。Phase 进行中没有什么可决定的:继续,或者把剩下的工作拆给 [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent)。

| Option | 什么时候选它 |
| --- | --- |
| **Continue** | 下一个 phase 需要这个 phase 的逐字内容,或者你还剩足够的 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)。这是唯一能让这个 session 继续作为 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source) 的选择,所以先排除它 |
| **`/clear`** | 你身后的一切都可以丢弃。棋盘上最便宜的一步,但如果判断错了就没法回头 |
| **[handoff](https://aihero.dev/skills-handoff)** | 有东西必须"带着走":一个新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、一个新目录、一位同事、一个在 phase 进行中分叉出的 side task |
| **Subagent** | 这个任务的范围足够明确,能在你 [离开键盘](https://www.aihero.dev/ai-coding-dictionary/afk) 时运行 |
| **`/compact`** | 以上都不是。默认选项,而且经常落在这里 |

其中两个经常被选错,这正是 router 携带这份*顺序*而不只是一份列表的原因。`/handoff` 读起来像是窗口之间通用的桥梁,其实不是:可携带性才是它买到的全部东西。`/compact` 排在决策树的最底部,而不是第一反应,因为它上面那四个问题各自都更便宜或更精准。

## Common questions

**难道不能就给一份按正确顺序排好的 skills 列表吗?**

人们一直在 README 里要求这个。这个 skill 就是那份列表——这正是它存在的意义。一份静态表格会写成 `wayfinder → to-spec → to-tickets → implement → code-review`,而这对大多数情况来说是错的,因为真正有意思的部分是那些分支——有没有代码库、这次构建是否跨 session、这个问题能不能靠聊天解决。诚实的代价是,这个 router 是手工维护的,会落后于仓库本身。`/grilling` 和 `/resolving-merge-conflicts` 都是发布很久之后,router 才把它们点名进来的。

**它告诉我一半的 skills 都没装。**

一个已知的 bug,还没修。Router 会路由你去用的大多数 skills 都设置了 `disable-model-invocation: true`,这意味着 harness 会把它们排除在注入到 agent 上下文里的 skill 列表之外。Agent 会把那份列表当成完整的清单,于是报告它们缺失。有一次报告的 session 里,它宣称整条 spec-and-tickets flow 都不存在,转而改用裸的 `/grilling` 和 `/tdd`。这个 plugin 的 22 个 skills 里有 13 个带着这个 flag,所以这是常见情况,不是边缘案例。它们其实都装着。不管怎样,直接输入那个 slash command 试试,或者查一下 `.claude-plugin/plugin.json`——它才是"什么东西实际存在"的权威来源。

**它描述了某个 skill 的行为,但那个 skill 根本不是那样做的。**

这也是真实存在、还没修的问题。这个 router 是根据它自己对每个 skill 的一行摘要来回答的,而不是根据那个 skill 本身。一份详细的报告在同一个 session 里追踪到了三次这样的情况,包括一次建议跳过 [to-spec](https://aihero.dev/skills-to-spec),理由是那句"把这个线程变成一份 spec"的概括——`to-spec/SKILL.md` 根本没被打开过。每一次都是用户反驳之后它才去核实,从来不是它自己主动做的。那次跳过 `to-spec` 付出的代价是一次真实的 seam 检查,最后产出的 tickets 低估了工作量。当 router 就另一个 skill 的行为断言了一些举足轻重的东西时,让它先打开那份 `SKILL.md`。这同样适用于这张地图完全没覆盖到的问题,比如要不要用 [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode):那是 [model](https://www.aihero.dev/ai-coding-dictionary/model) 自己的推断,不是这里写下来的东西。

**为什么是大段文字,而不是一份编号清单?**

一个合理的抱怨,已经作为一个 open issue 提出,认为大部分路由逻辑其实是确定性的,叙述性文字反而难以扫读。没有什么能阻止你要求压缩版——"直接给我顺序"就能拿到顺序。这些大段文字承载的是条件性的那一半:分支在哪里、哪里该由人类做决定、步骤之间该在哪里清空或压缩上下文。一份扁平的清单恰恰会丢掉这些。

**它能路由我自己写的 skills,或者别的作者的 skills 吗?**

不能。已经有三个不同的提案要求做一个能读取你本地 `skills/` 目录、根据已安装内容给建议的 router。`ask-matt` 不是那种东西。它是对一整套固定集合的地图,手工维护,对你自己写的、或从别处装的 skills一无所知。

**它让我去改一份 SKILL.md。**

这个建议通常是对的,但很少能持久。有人问它怎么让 [implement](https://aihero.dev/skills-implement) 去关闭 tickets,得到的答案是给这个 skill 加一行,然后立刻发现了问题:`npx skills update` 会覆盖这个文件,而 plugin 安装是只读的。把持久性的行为放进你自己的 `CLAUDE.md` 或 `AGENTS.md`,或者在调用时直接说出来。Prompt 层面的调整能挺过更新——把这条 flow 指向 Linear 而不是 GitHub,或者问它哪些开放的 tickets 可以并行跑,都是人们用这种方式做到的。

**它点名了一个我没有的 skill,或者漏掉了一个我有的。**

在认定它消失之前,先查一下 changelog 里有没有重命名。`writing-great-skills` 变成了 [writing-for-agents](https://aihero.dev/skills-writing-for-agents),没有留别名;`to-prd` 变成了 [to-spec](https://aihero.dev/skills-to-spec);`pathfinder` 变成了 [wayfinder](https://aihero.dev/skills-wayfinder)。四个 skills 被彻底淘汰,并入了吸收它们的那些 skills:`ubiquitous-language`、`design-an-interface`、`qa` 和 `request-refactor-plan`。反过来的情况,就是上面说的 router 自身的滞后。

## It's working if

- 它以点名"接下来该输入什么"结束,然后停在那里,而不是自己动手开始干活。
- 它给出的路线里提到了该在哪里清空或压缩上下文、该在哪里由你来审查,而不只是一份 skill 名字列表。
- 当两个 skills 很接近时,它会说清楚是哪一个、以及为什么另一个不适合你。
- 它对另一个 skill 行为做出的任何断言,都能在 trace 里看到它确实打开了那个 skill 的 `SKILL.md`。
- 它给回你的东西,你能在里面认出自己真实的情况,而不是最接近的一个泛化场景。

## Where it fits

`ask-matt` 是一个覆盖整套集合的**独立 router**。它从来不是任何链条里的一步;它指向每一条链条,也是其他 docs 页面回链的那个节点,这样它们就都不用重新画一遍这张图。从这里出发,你最常落到的地方是 main flow 的起点 [grill-with-docs](https://aihero.dev/skills-grill-with-docs),或者是为那些自己找上门、而不是你主动开始的工作准备的 on-ramp——[triage](https://aihero.dev/skills-triage)。

它相对于自己描述的那些 skills 而言,是一个 [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)。当这个 router 和某份 `SKILL.md` 有分歧时,以 `SKILL.md` 为准。
