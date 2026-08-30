[English](prototype.md) · [简体中文](prototype.zh-CN.md)

## What it does

`prototype` 写的是**回答一个问题的一次性代码**——这个 state 模型感觉对不对,或者这个界面该长什么样。问题排在第一位,决定后面一切的形状;一个回答了错误问题的 prototype,不管做得多好都是纯粹的浪费。

一次性约束的是代码*怎么写*,而不是承诺要销毁它。没有测试,除了能让它跑起来之外没有错误处理,没有抽象,没有持久化——因为这些都无助于你学到你真正想学的那一件事。留下来的是答案,被折叠进真正的代码,以及 prototype 本身——停放在一个从 main 分出去的分支上,作为这个答案的来源证据。

## When to reach for it

输入 `/prototype`,或者当一个任务合适时,[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会自动使用它。

在你碰到一个聊不出结论的问题时立刻用它——一个你没法在脑子里装下所有边界情况的 state machine、一个你不看到三个版本并排放在一起就想象不出来的界面。[Grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session 正是在这类问题上会膨胀:agent 换着法子问,你猜着答,范围会随着不确定性一起膨胀。停下 grilling,构建这个一次性版本,看着它,然后用一句话回答。如果反过来,是已经构建好的东西表现异常、你想知道为什么,用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)——prototyping 探索的是该构建什么,不是已构建的东西为什么坏了。

你也可能不是主动选择、而是被带到这里的。[wayfinder](https://aihero.dev/skills-wayfinder) 会在它的地图上归档 `prototype` 类型的 decision [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket),处理其中一个用的就是这个 skill。

## Two branches

问题决定分支,两个分支产出截然不同的 artifact:

- **"这个逻辑/state 模型感觉对不对?"** —— 一个**可分享的单一 HTML 文件**。一个自包含的页面,不需要构建、不需要服务器,双击就能打开。它带有一个每次点击后都重新渲染的、带标签的 state 面板,可以任意顺序摆弄这个模型的 free-play 按钮,以及分标签页的**引导式演练**——一个标签一个场景,下面是要按顺序点击的按钮。一切都用领域语言标注,所以你可以把它交给一个设计师、一位 PM 或一位领域专家,让他们亲自感受这个模型。页面背后的逻辑是一个干净、不碰 DOM 的小型纯模块——一个 reducer、一台 machine、一组函数——这样被验证过的版本就能直接搬进真正的代码。
- **"这该长什么样?"** —— 在同一个路由上放几个**截然不同**的 UI 变体,通过一个浮动底栏和一个 `?variant=` URL 参数切换。变体之间必须在结构上有分歧,而不只是颜色不同;三个微调过的卡片网格是壁纸,不是 prototype。它们尽量渲染在一个真实页面内部,针对真实数据、真实密度,因为一个在真空里被评判的变体总是看起来还不错。

两者都把 state 存在内存里,一开始就不需要动脑子,每一步之后都展示完整的 state。一旦你发现自己在给它"打硬"——加一个测试、接上真实数据库、为一个以后可能用得上的场景做泛化——你就已经不是在做 prototype 了。

## The prototype is a primary source

一个完成的 prototype 会留下两样东西,它们去往不同的地方。

**答案**——结论加上它解决的那个问题——会被持久地记录下来:一条 commit message、一份 ADR、这个 implementation issue。这才是 main 分支保留的东西,被折叠进真正的代码。

**Prototype** 本身是这个答案的可运行证据,不会被删除。它也不属于 main——那里没有什么需要维护,而且它会很快腐烂——所以它被提交到一个从 main 分出的一次性 `prototype/<name>` 分支上,永不合并,并在 implementation issue 上留一个指向那个分支的 [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer)。Main 保持干净;这次探索则对之后接手工作的任何人保持可查找、可重新运行。

## Common questions

**等等——prototype 不是应该被删掉吗?**
现在不是了。过去是:构建它,保留答案,把代码扔掉。对这种做法最尖锐的反对从来都不是关于速度的——而是*谁会在下一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 接手这份工作,他们手上有什么可以依据的东西?* 一段关于 prototype 的文字摘要,会丢掉当初让它有说服力的那个东西。所以现在 prototype 被当作一个 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source):它落到一个从 main 分出的 `prototype/<name>` 分支上,implementation issue 指向它。变的是代码存放在哪里,不是这套纪律本身——它依然从不合并进 main。

**它以前会构建一个终端应用。那个去哪了?**
Logic 分支现在改为产出一个可分享的单一 HTML 文件。一个终端应用只能被克隆了仓库、装了运行环境的人驱动,这恰恰排除了这个 prototype 最需要意见的那些人——设计师、PM、知道这个 state 模型该代表什么的领域专家。一个双击就能打开、转发邮件也不会坏的自包含文件,任何人都能驱动。底层的纯逻辑模块没有变化,依然是能搬进真正代码的那部分。

**一个 agent 让我用 `/prototype`,而当时我本该直接实现。**
已知问题,而且是一个命名问题。`prototype` 是一个通用、有吸引力的词,一旦 tickets 存在,对一个不了解 flow 的 agent 来说,它读起来就像"显而易见的下一步",所以即使设计在对话里已经完全敲定了,它也可能被凭名字推荐出来。如果你已经知道要构建什么,下一步是 `/implement`,按 ticket 来。只有当一个具体的设计问题确实还没解决、而且聊也聊不出结论时,才用 prototype。

**我该不该在构建任何生产 feature 之前,先把整个应用做成 prototype——比如说,为了给潜在客户演示?**
那是另一种 artifact,只是借用了这个 skill 的名字。这里的 prototype 被限定在一个问题的范围内,而"整个 app 是什么"不是一个问题。一个全应用的 prototype 没有自然的停止点,所以它会靠惯性变成生产应用:清理这一步永远不会发生,按 prototype 规则写的代码——没有测试、没有错误处理——最终会出现在用户面前。如果你需要一个销售演示,就刻意把它构建成一个演示,并明确说明其中没有任何东西是生产级的。如果你需要解决一个设计问题,就把范围收窄到那个问题上。

**我该怎么在它自己的 session 里运行它?**
一个 prototype 活在自己的目录里,会产生大量你不想留在提出这个问题的那个线程里的 [context](https://www.aihero.dev/ai-coding-dictionary/context),所以在别处运行它,只把答案带回来。[handoff](https://aihero.dev/skills-handoff) 是两个方向之间的桥梁。

**这不是最快烧掉 token 的方式吗?**
如果你拿本可以聊出结论的问题去做 prototype,或者让一个 prototype 蔓延到整个 feature,那确实是。真正重要的对比不是"花 token"对"不花",而是花 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 对比构建了错误的 state 模型、还是在它已经有了生产环境的调用方之后才发现。把问题收窄、把这次运行控制得短,花费就会保持成比例。

## It's working if

- 你能用一句话说清楚这个 prototype 存在是为了回答哪个问题——而且它被写在这份演示的顶部,不只是在你脑子里。
- 一个不读代码的人也能驱动这个逻辑演示。他们打开文件,在一个 walkthrough 标签页里按按钮,用自己的话描述看到了什么。
- 有人说"等等,这不该发生"或者"咦,我以为 X 会不一样"。那是*想法*里的 bug,这正是整件事的意义所在。
- UI 变体在布局和信息层级上有分歧,不只是颜色和文案不同——你收到的反馈是"B 的 header 配上 C 的侧边栏"。
- 它在一次坐下的时间里就得到了答案。如果一天之后你还在构建它,说明这个问题太大了;拆开它。
- 结束时,main 里包含的是这个决策,不含任何 prototype 代码,implementation issue 指向依然保留着它的那个分支。

## Where it fits

`prototype` 是一个**随时可用的独立工具**——你切进来解决一个设计问题,再切出去——它也是另一个 skill 会用到的机制。

它最大的使用方是 [wayfinder](https://aihero.dev/skills-wayfinder)。一张 wayfinder 地图由 **decision tickets** 组成,`prototype` 是一个 ticket 可能属于的四种类型之一:用在阻塞的问题是"这该长什么样"或"这该怎么表现"、再怎么讨论也解决不了的时候。Wayfinder 通过做出一个具体的东西来供人反应,提高一场模糊讨论的精细度,这个 skill 就是那个具体的东西被构建出来的方式。一个 prototype ticket 由这个答案来解决,这个 prototype 会作为一个资产从地图上链接过去。

其他邻居分别在它的上下游。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 回答能被 grill 出来的问题;那些没法被 grill 出来的问题会来到这里,一句话的答案再回到那场访谈里。在下游,一个被验证过的 state 模型或 UI 方向会成为 [to-spec](https://aihero.dev/skills-to-spec) 敲定的输入,它可以直接内联这个 prototype 产出的、蕴含决策的代码片段,而不是用文字描述它。对其他任何情况,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你在整套集合里路由。
