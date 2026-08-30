[English](improve-codebase-architecture.md) · [简体中文](improve-codebase-architecture.zh-CN.md)

## What it does

`improve-codebase-architecture` 巡检一个代码库,寻找**可以做深的机会**——那些一个 shallow module(接口几乎和它藏起来的东西一样复杂)可以变成 deep module 的地方——把它们写成一份自包含的 HTML 报告,然后就你挑选的那一项对你做一次 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)。

它从不改动代码。整次运行只产出你操作系统临时目录里的一个 HTML 文件,和一段对话;真正的重构发生在之后,在一个独立的 [session](https://www.aihero.dev/ai-coding-dictionary/session) 里,走正常的构建流程。这正是它是一次巡检、而不是一个重构工具的原因,也是这个 skill 值得在一个你还没准备好动手的代码库上运行的原因。

有两道过滤器让这份报告不至于变成泛泛的清理建议。每个候选项都必须通过**删除测试法**——删掉这个模块会让复杂性集中到一个更小的接口背后,还是只是把它散布到各个调用方那里?只有"会集中"的情况才有资格上卡片。而且,除非你指定了一个具体区域,否则它会先读最近的 commit 历史,把扫描的重点偏向那些正在被积极改动的路径,理由是:在没人碰的代码上做深,是一次你永远兑现不了的重构。

## When to reach for it

你需要输入 `/improve-codebase-architecture` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。

它在构建循环之外——它不是 main loop 里的一步,而是你定期运行、用来排一份改进代码库的工作队列的东西。它被使用的四种情形:

| 情形 | 怎么用 |
| --- | --- |
| 日常维护 | 每隔几天,或者随便什么有空闲的时候跑一次,防止结构在各个 feature 之间腐化。 |
| 大型构建之前 | 把它指向 [spec](https://www.aihero.dev/ai-coding-dictionary/spec):"how can we make this change easy?" 这是对它最有效的 prompt。 |
| Brownfield 审计 | 在一个庞大、无结构或 [vibe-coded](https://www.aihero.dev/ai-coding-dictionary/vibe-coding) 的仓库上跑一遍,搞清楚它实际是什么状态。 |
| 遗留测试工作 | 在给测不了的代码写测试之前,先用它找出缺失的 seams。 |

容易和它混淆的邻居:

- 针对你已经选定的一个模块做设计,用 [codebase-design](https://aihero.dev/skills-codebase-design)——那是工作台,这个是找出该放上工作台的东西的巡检。
- 针对一整块大到单个 session 装不下的工作,用 [wayfinder](https://aihero.dev/skills-wayfinder)。
- 针对"这个具体的东西坏了",用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。当真正的发现是没有一个好的 seam 能把这个 bug 锁定下来时,它会交接回这里。

## Prerequisites

运行它不需要任何前提。如果 `CONTEXT.md` 和 `docs/adr/` 里的 ADR 存在,它会读取它们,并在它们存在时用你领域自己的名词说话——一个候选项读起来会是"deepen the Order intake module",而不是"refactor the FooBarHandler"。

它会写入两个地方。报告写到仓库之外的 `<tmpdir>/architecture-review-<timestamp>.html`。在 grilling 循环中,它会在 `CONTEXT.md` 里添加或打磨术语(如果文件不存在就创建它),并提议把一个被否决的候选项记录成一份 ADR,这样以后的运行就不会重复建议它。

## Depth, and the report that hunts for it

这个 skill 围绕一个理念运转:**depth**。一个 deep module 把大量行为放在一个小而稳定的接口后面。一个 shallow module 会通过一个几乎和它下面代码一样宽的接口泄漏出它的实现。这份报告就是在猎寻 shallowness——为了可测试性而抽取出来的纯函数、而真正的 bug 却藏在它们是怎么被调用的这件事上(没有 **locality**)、跨越自己 **seams** 渗漏的模块、一个不打开五个文件就理解不了的概念——并针对每一处提出能修复它的做深方案。

每个候选项都是一张卡片:涉及的文件、摩擦点、大白话的解决方案、用 **locality** 和 **leverage** 表述的收益、一张前后对比图,以及一个强度徽章。

| 徽章 | 对你意味着什么 |
| --- | --- |
| `Strong` | 删除测试法清楚地通过了,摩擦点也是真实的。认真对待这些。 |
| `Worth exploring` | 看似合理的做深方案,但回报取决于这段代码接下来会往哪个方向发展。 |
| `Speculative` | 为了完整性而列出来的。这些大多可以放心忽略。 |

报告以一个 **Top recommendation** 收尾——它会最优先处理的那一个——然后这个 skill 停下来,问你想探索哪个候选项。到那个时候,什么都还没决定,也没有任何代码被改动过。

## What happens after you pick one

挑选一个候选项会启动一次针对它的 [grilling](https://aihero.dev/skills-grilling) session:约束条件、seam 背后放什么、哪些测试能存活、做深后的接口应该长什么样。那次 session 的产出是一个决策,不是一份 diff。从那里开始就走正常的 flow:把这个决策带进 [to-spec](https://aihero.dev/skills-to-spec),然后 [to-tickets](https://aihero.dev/skills-to-tickets),然后 [implement](https://aihero.dev/skills-implement)。

## Common questions

**它就一个想法追问了我一个小时,而不是给我看选项。我能关掉这个吗?**

可以——在调用时说清楚("don't grill me, just show the report")。这是这个 skill 收到最多的抱怨。一位用户直言不讳:他们喜欢它作为"a convenient way to get a thorough analysis of improvements",而在 grilling 循环被加进来之后,发现它"borderline unusable",报告说有些 session 里它只提出一个方案、然后问了"10's or 100's of questions"。设计意图是报告先出来,grilling 只针对你选中的那个候选项开始,但较弱的 [models](https://www.aihero.dev/ai-coding-dictionary/model) 会直接跳过报告、就它想到的第一个想法开始采访你。同一个讨论串里的反馈因模型而异,这是一个 open issue——这个 skill 目前还没有一个文档化的免 grilling 模式。

**报告打开时是没有样式的原始 HTML,也没有图表。发生了什么?**

这份报告从 CDN 加载 Tailwind 和 Mermaid,所以打开它需要网络访问,当有东西阻挡了这些脚本时,它会悄悄地坏掉。有记录的案例是一个安全 hook 要求 SRI hashes:agent 加上了它们,而 CDN 给浏览器提供的字节和给用来计算 hash 的 `curl` 提供的不一样,浏览器于是拦截了这个脚本。离线和受限的环境会撞上同样的墙。Agent 看不到这一点,因为它从不渲染这个页面。变通方法是要求用内联 CSS 和手写的 SVG 图表,取代 CDN 的骨架。这是一个 open issue,也是一个真实存在的粗糙边缘。

**它给了我十二个候选项。我该在同一个 session 里逐个处理,还是每次开新的?**

一个 session 一个候选项。在一段对话里处理好几个,会让 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 同时塞满报告、grilling、领域模型的修改和代码改动。这份报告只存在于一个临时文件里,所以要携带的是候选项本身,而不是这个文件:选一个,对它做 grilling,把这个决策带进 `/to-spec`,把剩下的变成你以后可以独立处理的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)。把选中的改进写进一份 spec,而不是直接跳去实现。这是一个反复被问到、但这个 skill 本身没有文档化工作流的问题。

**我该怎么给它写 prompt?**

带着你接下来要构建的东西去想。当一次大型构建即将到来时,把它指向那份 spec,问"how can we make this change easy?"。一次没有指定方向的运行会自己扫描热点,这对日常维护来说没问题,但指定一个方向才是让这份报告真正可执行的关键。

**它在一个庞大的遗留代码库上有用吗?**

部分有用。它在缺乏一致结构的庞大既有代码库上表现不错,也是任何一次性结构 setup 之后推荐的维护机制。诚实的另一面是:真正失控的项目的用户报告说它"helped a little but still doesn't seem to cut it",一位维护着八年遗留代码库的开发者报告说,同一个 skill 在一个整洁的仓库上能产出一张清晰的图,而在他的代码库上模型却在原地打转。目前还没有针对这种情况的专门 `/refactor` skill。如果这个代码库完全没有共享词汇,先用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 建立一套,往往能让这个 skill 的输出好得多。

**这个和 `/codebase-design` 有什么不同?**

`/codebase-design` 是一份参考资料,不是一个 session 驱动器。它提供词汇——module、interface、depth、seam、adapter、leverage、locality——这个 skill 借用它。让一个全新的 agent 把 `/codebase-design` 当作要"执行"的东西,是一个已知的失败模式:因为它自己没有流程可循,agent 会自己发明一个,重新探索代码,跑很久才会问你任何问题。用这个 skill 来驱动;把那个当参考来用。

**它会告诉我代码库没问题吗?**

很少,这一点你该提前知道。这个 skill 就是被设计成要输出发现的,所以它的框架会把它推向产出候选项,而不是得出"没什么问题"的结论。强度徽章就是这里的防线——一份所有条目都是 `Speculative` 的报告,就是这个 skill 用它唯一知道的方式告诉你:它什么都没找到。

**它在 Codex 或其他 harness 上能用吗?**

部分能用。探索这一步直接点名了 Claude Code 的 `Agent` 工具、用 `subagent_type=Explore`,所以一个没有那个工具的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 可能会跳过并行探索,而不是换成自己的替代方案。这个 skill 依然能跑;只是扫描没那么彻底。已经有人提议做一次 harness 中立的重写,但还没合并。

**我该怎么在 TypeScript 里真正实现 deep modules?**

这个 skill 目前没有给出好答案。反复被提出的诉求是要一份 `TYPESCRIPT.md`,给这些原则配上具体的文件和模块布局,但它不存在。这个 skill 会告诉你一次做深该落在哪里、seam 背后该放什么;把它翻译成一个 package 或目录结构,目前得靠你自己。

## It's working if

- 候选项点名的是你领域里的概念,而不是凭空发明的类名——"the Order intake module",而不是"the FooBarHandler"。
- 候选项聚集在你最近编辑过的文件里,而不是仓库里沉寂的角落。
- 这次运行期间没有任何代码被改动。唯一的新文件是你临时目录里的 HTML 报告。
- 它在报告之后就停下来,问你想要哪个候选项,而不是自顾自地继续。
- 每张卡片都用 locality 或 leverage 来解释收益,并说明哪些测试会变简单——而不只是说"这样更干净"。
- 出于一个持久理由否决一个候选项,会换来一次记录成 ADR 的提议,这样下次运行就不会再建议它。

## Where it fits

`improve-codebase-architecture` 是**周期性维护**——每隔几天运行一次,在任何链条之外,用来排一份工作队列,而不是直接执行它。它的邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)(拥有每个候选项所用的那套 depth-and-seam 词汇)、[grilling](https://aihero.dev/skills-grilling)(在你选定候选项后走一遍决策树),以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)(在决策落定时保持 `CONTEXT.md` 和 ADR 的更新)。它产出的是一个想法,这个想法会在 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 或 [to-spec](https://aihero.dev/skills-to-spec) 处重新汇入主构建 flow。对于哪个 skill 适合当前情况,[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖整套集合的 router。
