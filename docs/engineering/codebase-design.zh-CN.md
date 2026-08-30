[English](codebase-design.md) · [简体中文](codebase-design.zh-CN.md)

## What it does

`codebase-design` 固定了你用来设计一个模块的那套词汇:**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**。它精确地定义了每一个,禁止使用那些松散的替代词("component"、"service"、"API"、"boundary"),并陈述由它们推导出的几条原则。

它是一份参考资料,不是一个流程。没有循环要跑,没有 artifact 要产出,没有会问你问题的检查点。其他每一个涉及设计的 skill 都借用它的词汇;它自己被单独调用时,只给你语言,然后停下。这是在调用它之前该知道的事,因为一个没有流程、没有停止规则的 skill,如果你对着一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 说"去吧",它会自己即兴发挥出一个流程——见下面的问题。

## When to reach for it

输入 `/codebase-design`,或者当一个设计任务合适时,agent 会自动使用它。

当你已经知道要重新设计哪段代码、需要思考它的形状时用它:seam 放在哪、接口能小到什么程度、一次抽取是否值得。当你想为一个词的含义争出个结论时,也用它。

有几个 skills 和它很接近。你想要哪一个取决于真正的问题是什么:

|问题|该用的 skill|
|---|---|
|一个模块的形状——它的接口、它的 seam、它的 depth|`codebase-design`|
|*领域的词汇*——"account" 身兼三职、两个人对 "cancellation" 的理解不一样|[domain-modeling](https://aihero.dev/skills-domain-modeling)|
|你还不知道该重新设计*哪个*模块|[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)——找出候选项的那次巡检|
|你想让这个设计被人辩论,而不只是被命名|[grilling](https://aihero.dev/skills-grilling)|
|有一个具体行为要构建,你想要能挺过重构的测试|[tdd](https://aihero.dev/skills-tdd)|

## The vocabulary

这份词汇表就是这个 skill 本身。每个术语都是相对其他术语来定义的,每一个都带着它要取代的那个词。

|Term|含义|不要说|
|---|---|---|
|**Module**|任何拥有接口和实现的东西。刻意做到与规模无关——一个函数、一个类、一个包、一个横跨多层的切片。|unit、component、service|
|**Interface**|调用方要正确使用它必须知道的一切:类型签名,外加不变量、顺序约束、错误模式、必需的配置、性能特征。|API、signature|
|**Depth**|接口处的杠杆效应——调用方或测试每学习一单位接口,能驱动多少行为。**Deep**:大量行为藏在一个小接口后面。**Shallow**:接口几乎和实现一样复杂。|—|
|**Seam**|Michael Feathers 提出的术语:一个可以在不编辑该处的情况下改变行为的地方。它是一个接口的*位置*,放在哪里是一个独立的决策,和背后放什么是两回事。|boundary|
|**Adapter**|在一个 seam 处满足某个接口的具体实现。命名的是一个角色,不是内容——一个 in-memory fake 和一个 Postgres repo 都是 adapters。|—|
|**Leverage**|depth 带给调用方的东西:每学习一单位接口,能获得更多能力。|—|
|**Locality**|depth 带给维护者的东西:改动、bug 和验证都集中在一个地方。修一次,处处都修好了。|—|

Depth 被刻意地*没有*定义为实现行数与接口行数之比,那是 Ousterhout 自己的定义。那个指标会鼓励给实现"注水"。这里改用 depth-as-leverage。

## The four principles

- **Depth 是接口的属性,不是实现的属性。** 一个 deep module 内部完全可以由许多小的、可替换的部件构成。它们只是不会暴露给调用方。一个模块可以有它自己测试用的内部 seams,以及位于接口处的一个外部 seam。
- **删除测试法。** 想象把这个模块删掉。如果复杂性随之消失,说明它只是个转发层。如果它在 N 个调用方那里重新冒出来,说明它是有价值的。
- **接口就是测试面。** 调用方和测试穿过的是同一个 seam。如果你想测试到接口*之后*,说明这个模块的形状不对。
- **一个 adapter 意味着一个假想的 seam。两个 adapter 才意味着一个真实的 seam。** 除非确实有东西会跨它变化,否则不要切出一个 seam。只有一个 adapter 的 seam 只是多了一层间接。

有两份支撑文件走得更深,这个 skill 是按需读取它们,而不是一开始就全读。[DEEPENING.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md) 对一个候选对象的依赖做分类——in-process、local-substitutable、remote-but-owned、true-external——因为这个类别决定了做深后的模块要怎么跨 seam 测试。[DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DESIGN-IT-TWICE.md) 启动并行的 [sub-agents](https://www.aihero.dev/ai-coding-dictionary/subagent),为同一个模块产出三个或更多截然不同的接口,然后在 depth、locality 和 seam 位置上做对比。

## Common questions

**我该怎么在 TypeScript 里真正构建出一个 deep module?**

这是关于这个 skill 被问得最多的问题,而这个 skill 并没有回答它。它定义了一个 deep module *是什么*;它没说怎么阻止一次乱入的 import 越过接口。[Issue #458](https://github.com/mattpocock/skills/issues/458) 说得很直白:"let's say we're happy with the interface, it hides the details, etc. But how do we enforce it? I think without linting or clear guardrails, humans and LLMs alike will start making it messy over time."。Matt 在那个讨论串里给出了三个选项:把它包在一个 class 或 IIFE 里,接受这个 class 会变得很庞大;把它做成 monorepo 里的一个 package,接受 monorepo 的工具链;或者用一个像 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 这样的 linter 来禁止绕过接口的 import。他在别处还说过 Effect 是最好的机制,dependency-cruiser 是次好的。仓库的 `in-progress/` bucket 里有一个 `setup-ts-deep-modules` skill,定下了一套 `src/packages/<name>/index.ts` 的约定,但它是一个没有 docs 页面的 beta 阶段 skill,也没有随附任何 lint 规则。

**我对着它开了一个 session,结果它烧掉了 10 万 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 去重新设计我从没问过的东西。**

已知问题,记录在 [issue #449](https://github.com/mattpocock/skills/issues/449)。这个 skill 是 model-invoked 的,自称是词汇表,但里面没有任何东西能硬性阻止一个 agent 把它当成一个可运行的流程。被告知"resume in /codebase-design and drive the open decisions"后,一个 agent 抓住了它能找到的、最像"可执行动作"的内容——`DESIGN-IT-TWICE.md` 里的并行 sub-agents——重新探索了一遍之前某个 session 已经画过图的代码,跑了很远才问第一个问题。一个驱动型 skill该有的护栏(检查点、一次一个问题、不自动推进)在这里一个都没有,因为一份参考资料本来就不该有这些。变通方法是点名一个驱动型 skill,让这个 skill 待在它底下:`/grill-with-docs`、`/improve-codebase-architecture` 或 `/tdd`,把 `codebase-design` 当作词汇表来用。这个 issue 还开着。

**`design-an-interface` 去哪了?有没有一个 `/interface-design` skill?**

`design-an-interface` 被移除了,并入了这个 skill。没有任何东西丢失:它的 "design it twice" 技巧——源自 Ousterhout 的、用并行 sub-agents 生成截然不同设计的做法——作为 `DESIGN-IT-TWICE.md` 在这里继续存在。另外,有几个人要求过一个专门的 `/interface-design` skill 来承载 deep-module/thin-interface 的理念;那套理念已经在这里了,目前没有计划做一个独立的 skill。不管你找的是哪个名字,这个页面就是你要找的地方。

**这不就是一套文件结构约定吗——文件夹、barrel 文件、feature slices?**

不是,而且面对反复的质疑,这个 skill 一直坚持这个立场。[Issue #95](https://github.com/mattpocock/skills/issues/95) 提议把一套形式化的分形树文件结构作为 deep modules 的具体实现;回复是这两者是正交的——"deep modules are about the design of the interface and accessing through a strict interface, no matter what the file system looks like. It seems perfectly possible that you could have shallow modules with this approach."。同样的问题在 #458 里也出现过:"I think you might be tying the concept of modules too closely to the file system. The file system can certainly be a useful hint to the shape of modules, but there's no need to use the file system in the construction of deep modules."。这份词汇表把 **module** 刻意定义为与规模无关。

**`tdd` 真的在用这套词汇吗?**

现在是的。有很长一段时间不是。过去内置在 `tdd` 里的 deep-module 笔记,在 v1.0 里被移除、换成了这个共享 skill,但取而代之的指针从来没被加上——所以 `tdd` 自己定义了一遍 "seam",却没有引用任何东西。这个缺口现在补上了:这个指针已经在这个 skill 里,当接口的形状(而不是测试本身)是待解决的问题时会被触达。`tdd` 依然拥有 "seam" 作为你*测试*所在边界的定义;这个 skill 拥有它背后模块形状的定义。

**Design-it-twice 这个模式在 Claude Code 之外也能用吗?**

不太干净。`DESIGN-IT-TWICE.md` 写的是 "spawn 3+ sub-agents in parallel using the Agent tool",这是 Claude Code 按它自己的命名方式提供的 [tool](https://www.aihero.dev/ai-coding-dictionary/tool)。这个仓库为其他 [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness)(包括 Codex)提供了元数据,而那些 harness 在这个名字下可能什么都没暴露——所以这个并行设计阶段的可移植性,不如这个 skill 的元数据暗示的那么好。追踪于 [issue #564](https://github.com/mattpocock/skills/issues/564),还开着。

**我能往这份词汇表里加自己的概念吗——connascence、module secrets、[progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)?**

已经有人提议过正是这些。[Issue #180](https://github.com/mattpocock/skills/issues/180) 添加了 Parnas 的 module secrets 和 Page-Jones 的 connascence,作为命名"什么东西正在跨 seam 渗漏"的一层词汇,并附带了一份可用的 diff;[issue #303](https://github.com/mattpocock/skills/issues/303) 提议在实现内部引入 progressive disclosure,这样一个在公开接口层面是 deep 的模块,内部就不会是一整块没有区分的整体。两者都还开着、没有合并。目前发布的这份词汇表刻意保持精简,保持精简的理由这个 skill 自己就说了:语言的一致性就是全部的重点,一个没人一致使用的术语,比没有这个术语更糟。

## It's working if

- 设计讨论里不再出现 "component"、"service" 和 "boundary" 这些词,开始出现 "module"、"interface" 和 "seam"。
- 有人能指着一个提议中的抽取,毫不含糊地说出它是否通过了删除测试法。
- 一个被提议的 seam 附带了第二个 adapter 的名字,不只是第一个。
- 关于一个接口的讨论涵盖了不变量、顺序和错误模式,不只是类型签名。
- 调用它不会启动一个 session。如果 agent 单凭一句 `/codebase-design` 就开始读文件、提议重构,说明它把这份参考资料错当成了一个驱动器。

## Where it fits

`codebase-design` 是一个**随时可用的独立参考**,是 engineering skills 底下的词汇层,而不是任何链条里的一步。它最近的邻居是 [domain-modeling](https://aihero.dev/skills-domain-modeling)——针对*问题领域*用词、而不是模块形状的那份对应参考——两者通常需要一起用,因为给一个 deep module 起好名字,两边都得用到。另一个邻居是 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture):它巡检代码库找出可以做深的候选对象,并用这份词汇表把每一个都写下来,所以它负责找到模块,这个 skill 是你在上面设计它的那张工作台。当你拿不准该用哪个 skill 或 flow 时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
