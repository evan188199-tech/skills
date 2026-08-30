[English](writing-for-agents.md) · [简体中文](writing-for-agents.zh-CN.md)

## What it does

`writing-for-agents` 是你写任何面向 agent 的文档时要对照的参考资料——一个 skill、一份 `AGENTS.md` / `CLAUDE.md`、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、一段运行时 prompt、一份 README,任何 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会读的文档。它们的封装方式不同;写作的道理不变:让每一份都可预测的杠杆是同一套,所以 agent 每次都走同一个*流程*,而不是产出同一份输出。

它默认的动作是删除,不是解释。让一个 agent 给另一个 agent 写指令,它会把大部分文字花在解释模型已经知道的东西上——每一行都是一个 **no-op**,占用 [context](https://www.aihero.dev/ai-coding-dictionary/context),却不改变任何行为。这份参考资料就是找出它们的透镜,这正是为什么它在一份你已经有的文档上,和在一张白纸上一样值得使用。

在 v1.1 之前,它叫 `writing-great-skills`。这次改名追踪的是它一直以来的本质:它几乎没有任何内容是 skill 专属的。只针对 skill 的那部分机制——frontmatter、model- 还是 user-invoked 的选择、router skills——被移到了一份链接的 `SKILL-MECHANICS.md` 里,只有当你面前的文档确实是一个 skill 时才需要读它。

## When to reach for it

输入 `/writing-for-agents`,或者当你在创建或编辑一个 skill、或者修改 `AGENTS.md` 或 `CLAUDE.md` 时,agent 会自己主动使用它。

对于 agent 会读的其他一切——你的 docs、specs 和 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)、系统和 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) prompts——手动使用它。判断标准只有一个问题:一个 agent 会读这份文档吗?——不管它是怎么出现在 agent 面前的,不管是一个指针点名了它、一个人粘贴了它,还是它就单纯地存在仓库里。至于要先搞清楚一个代码库里到底有什么,用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)——这份参考资料管的是一份文档该怎么读,不是它知道什么。

## The two loads

支撑整份参考资料的理念,是每份文档和每个指针都要花的一对预算:

- **Context load(上下文负担)**——始终加载的材料对 agent 窗口造成的成本:一行 `AGENTS.md`、一个 skill 的 description,任何每个 [turn](https://www.aihero.dev/ai-coding-dictionary/turn) 都占在上下文里的东西,不管它有没有被触发。
- **Cognitive load(认知负担)**——加在你身上的成本:有哪些文档存在,什么时候该去找哪一份。你就是那个索引。这不是一个要去最小化的成本——它是人类主导权的代价。

一旦你开始用这两种负担来思考,大多数写作决策——拆还是不拆、内联还是外置、指向还是推送——就都变成了在不同地方做出的同一种取舍。

## The levers

- **[Context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer)**——保留在上下文里、点名不在上下文中的材料、并编码何时该去获取它的那个引用。一个 skill 的 description 和一行点名某份文档的 `AGENTS.md`,是同一种东西;决定 agent 能多可靠地通过它触达目标的,是这个指针的*措辞*,而不是它的目标。
- **Information hierarchy(信息层级)**——从文件内步骤,到文件内参考,到指针背后的外置参考,这样一个阶梯。**[Progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)(渐进式展开)**就是在这个阶梯上往下移,好让顶层保持清晰易读。
- **Completion criteria(完成标准)**——每个 step 的完成条件的清晰度和要求强度,以及那份要求驱动的 **legwork(体力活)**;这是对抗**过早完成**的防线。
- **Leading words(主导词)**——一个已经存在于模型预训练中的紧凑概念(*tight*、*red*、*tracer bullet*),agent 在跑这份文档时会用它来思考。它会锚定两次:在正文里是执行,在指针里是调用。
- **Pruning(精简)**——单一权威来源、相关性,以及逐句应用的 no-op 检验,对抗**重复**、**沉积**和**蔓延**。

## Common questions

**`/writing-great-skills` 去哪了?**
就是这个 skill,在 v1.1 里改了名字。早在这个名字跟上之前,从业者们就已经在把它用于 `AGENTS.md`、docs、specs、tickets 和运行时 prompts 了;结构、主导词和精简,原来是任何 agent 会读的文本共通的手艺。没有别名——用新名字重新安装。

**"Writing for agents"——所以是 agent 在写吗?**
正好相反。你是作者;agent 是读者。这正是这个文体全部的难点所在:你是在为一个已经读过一切的读者而写,所以解释是浪费,精确才是全部的工作。

**我不能直接让 agent 帮我写吗?**
可以,而且它会产出啰嗦的东西。放任不管,模型会解释它已经知道的东西,它不会自己应用 no-op 检验,也不会自己去找一个主导词。把这份参考资料用在草稿上——一次审阅是它大部分价值落地的地方。

**我让一个 agent 精简一份文档,它把功能都删掉了。**
被要求"streamline"的 agents 会针对长度做优化,因为长度是它们能看见的东西。No-op 检验是行为层面的,不是审美层面的:删掉这一行,问 agent 的行为有没有变化。当一句话没通过检验时,把整句话删掉,而不是删几个词——判断有没有分歧时,靠实际跑一遍这份文档来裁定,而不是靠争论。

**我怎么知道它完成了?**
当它能正常工作、你再也找不到重复、沉积或 no-ops 时。这里没有自动化评测;检验方式是一次手动运行,加上那套失败模式词汇作为诊断工具。当一份文档表现异常时,那套词汇同时也是维修工具箱——先给这个失败模式命名,再去修它。

**这该放进 `CLAUDE.md`,还是别的地方?**
问自己想付哪种负担。`CLAUDE.md` 无条件加载进每个 [session](https://www.aihero.dev/ai-coding-dictionary/session);指针背后的材料,在它被触发之前只花掉指针自己那一行的成本。任何十次里只有一次适用的东西,剩下九次都在白白付出上下文负担。

**每换一个新模型,我都得重写我的文档吗?**
大多数情况下不用,过度拟合某一个模型本身就是一个陷阱。为一个新模型做更新,通常是又一轮 no-op 排查,而不是一次重写。

**我的 skill 只在我用来构建它的那个具体任务上有效。**
常见的路径是——先做一遍工作,再让 agent 把它写成一个 skill——这会对那一次运行过度拟合,产出的范例会太具体。把那次运行留作证据,然后刻意地做抽象:剥离掉只属于那个仓库、那些文件的部分,为这一*类*任务而写。

**英语不是我的母语。我会失去主导词带来的优势吗?**
不会——找到那个用最少 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 承载最多行为的词,正是这份参考资料替你做的工作。这正是它存在的意义之一。

## It's working if

- 文档随着质量提升而变短,你会惊讶剩下的东西这么少。
- 你能指着一个主导词,看着它在不止一个地方发挥作用。
- 没有任何东西以任何形式被说了两遍。重复是一份文档从未被真正测试过的最可靠信号。
- 只有某一个分支才需要的参考内容,待在一个指针背后,而不是主文件里。

## Where it fits

这是一份随时可用的独立参考资料。它在这条链条里没有邻居,因为它位于整套集合的底层,而不是挨着某一个 skill:这里的每一个 skill 都是对照它写的,其他 skills 留下的文档——一份 `CONTEXT.md` 和它的 ADR、一份 spec、一个 ticket——正是它所规范的那类文本,一旦一个 agent 必须读它们。当你拿不准一个任务该用哪个 skill 或 flow 时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你在整套集合里路由。
