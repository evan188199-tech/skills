[English](research.md) · [简体中文](research.zh-CN.md)

## What it does

`research` 通过阅读拥有答案的来源来回答一个问题,然后在仓库里留下一份带引用的 Markdown 文件。它只依据 **[primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source)** 工作——官方文档、源代码、规范、第一方 API——把每一条论断都追溯回拥有它的那个来源,所以当 API 自己的文档触手可及时,它不会转述一篇博客对这个 API 的转述。

它不会在对话里直接回答你。产出是一份文件,写在仓库已经用来存放这类笔记的地方,每条论断都带一个链接。这正是重点所在:一份你可以对它做出反应、交给另一个 agent,或者直接丢弃的文档,而不是一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 结束就消失的答案。

## When to reach for it

输入 `/research`,或者当一个任务变成查资料的体力活时,[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会自动使用它。

当下一步是从 working directory 之外*查清楚一件事*时用它——一个第三方 API 的行为是什么、一份规范到底怎么说、一个版本声明是否属实——而你不想为了读这些东西卡住自己手头的线程。你需要什么,决定了该用哪个 skill:

| 你需要什么 | 该用什么 |
| --- | --- |
| 一个决策正在等待的外部事实 | `research` |
| 一个*和你一起*、通过访谈做出的决策 | [grilling](https://aihero.dev/skills-grilling) |
| 一个持久的架构决策,写进 `CONTEXT.md` 和 ADR | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 查清楚一种方案在你的代码库里能不能行得通 | [prototype](https://aihero.dev/skills-prototype) |
| 一个大到单个 session 装不下的计划 | [wayfinder](https://aihero.dev/skills-wayfinder) |

`research` 和 `grill-with-docs` 之间的界限是**拿回来的东西的保鲜期**。Research 产出的是短命的资产——这个库的鉴权机制截至本周是什么样的。一份 ADR 记录的是你会一直保留的决策。如果你在产出的是一个决策而不是一个事实,你是在 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling),不是在 research。

## Delegated legwork

这个 skill 的核心动作是,读资料这件事作为一个**后台 agent** 运行。你继续干活;它自己去读,把每条论断追到它的主源头,写一份 Markdown 文件,然后汇报。Research 是你委托出去的体力活,不是你外包出去的思考——你拿到的是一份可以用来做 grilling、规划或设计的文档,做决定的依然是你。

这个委托是没有防护的,那个后台 agent 可能会自己再派生出一个后台 agent。这是这个 skill 被记录得最清楚的一个粗糙边缘。

文件落在哪里,由仓库决定,不是这个 skill:它匹配任何已有的笔记约定,如果没有,它会挑一个合理的位置,并告诉你放在哪了。每次运行写一份文件。

## Common questions

**它派生出了第二个 research agent——这是预期行为吗?**

不是。这是一个 open bug,[issue #530](https://github.com/mattpocock/skills/issues/530)。这个 skill 让调用方启动一个后台 agent,但没有限制这个 agent 的类型,所以它派生出来的是一个 `general-purpose` agent,持有 `Agent` 工具和同样的指令——然后再次触发它们。有一份报告测算出,一个 research 任务在三次重叠的运行中大约花掉了 45 万 [tokens](https://www.aihero.dev/ai-coding-dictionary/token),重复的那次半小时后才完成、完全不在视野内。这个问题在 Claude Code 之外也能复现;同样的嵌套在 Codex 配 GPT-5.6-sol 上也得到了确认。目前没有随附的修复。用户已经给自己安装的那份拷贝打了补丁,加了一行告诉一个已经是 [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) 的 agent 自己完成这份工作,这有帮助,但只是指令层面的,不是结构性的。调用之后盯着你的后台任务列表,把重复的那个停掉。

反过来的失败模式也存在:如果你自己的全局指令禁止一个 agent 重新委托工作,那个后台 agent 会礼貌地拒绝这个任务,这个 skill 就悄悄地什么都不做了。

**这份文件该放在哪——我该提交它吗?**

这个 skill 把文件放在仓库已经用来存放笔记的地方,除此之外没有自己的主张。社区的做法相当一致:ADR 会保留,research 文件不会。来自一个 Discord 讨论串、就针对这个问题最尖锐的一个版本:"ADRs yes. Everything else archive or delete after done. It otherwise becomes cruft of work and can poison future repo reads if you've drifted away from the spec/research."。一份 research 文件记录的是它被写下那天为真的东西,所以一份过时的文件比没有还糟。总体而言,这些 artifacts 其实不太该进 git,它们也没有一个规范的归宿——人们改用 Obsidian、一个独立的知识库仓库,或者 issue tracker。

**什么算"高可信"的主源头,谁来决定?**

由 [model](https://www.aihero.dev/ai-coding-dictionary/model) 决定。这个 skill 点名了合格的*来源类型*——官方文档、源代码、规范、第一方 API——没有白名单,没有领域门槛,也没有验证环节。这是这个 skill 最初被提议时最响亮的反对意见,而且从未被公开回应过:"Five research subagents pointed at junk just gives you five confident wrong answers faster. How are you gating what counts as high-trust sources?"。你真正拥有的缓解手段是每条论断上的引用。跟着两三条走一遍。如果它们指向的是对那个东西的一份摘要、而不是那个东西本身,这次运行就在它唯一的职责上失败了。

**之后的 session 会复用早前一次运行找到的东西吗?**

不会。没有什么会自动加载一份过去的 research 文件;它就是一份坐在仓库里的文档,直到一个人或一个 skill 指向它。这是早期就被提出的、对这个设计最有力的质疑——"the value's the markdown becoming context the agent re-reads later, not the fetch itself. A write-once dead file is just a fancy search"——目前发布的这个 skill 并没有解决它。实际上,这份文件的价值来自被刻意地喂进下一步:把它附到一份 spec 上,在一次 grilling session 里引用它,让一个 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 指向它。

**为什么不直接让 agent 去读文档就好了?**

你当然可以,而一句写清楚这个意思的两行 prompt,正是这个 skill 取代的做法。这个 skill 相对于那句 prompt 多买到两样东西:它在后台运行,让你的 session 保持 [context](https://www.aihero.dev/ai-coding-dictionary/context) 干净;主源头约束和带引用的文件输出,每次都以同样的方式出现,而不是取决于你当时怎么措辞。相对于一个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 自带的深度研究模式,区别在于产出的 artifact 和来源纪律,而不是搜索本身。如果一句两行的 prompt 就能在一个小问题上满足你的需要,就用那句 prompt。

**它什么时候停止阅读?**

这个 skill 里没有停止标准,这体现为两种看似相反、实则同一个缺口的抱怨:钻得太深的 agent,以及广泛覆盖一个话题、却漏掉那个真正重要的具体细节的 agent。一位从业者的说法是:"deep-research skills are a bit too deep sometimes. And telling an agent to research usually results in missing crucial details."。划定范围得靠你自己。一个窄的、能被回答的问题——一个 API、一个行为、一个版本声明——效果远好于"research X"。

**`/wayfinder` 创建了 research tickets——我需要自己解决它们吗?**

不需要,它现在会替你触发它们。在 v1.1 之后尚未发布的改动里,一次绘图 session 会为每个 research ticket 启动一个 `/research` subagent、并行地把它们解决掉,并把调查结果记录在一个从这个 ticket 指向的、带 [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) 的一次性 `research/<name>` 分支上。Research tickets 是 wayfinder"每个 session 一个 ticket"这条规则唯一的例外,因为它们是 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 的——没有什么在等你。这些分支已知有两个小问题:这个 subagent 被发现过从一个永远不该被合并的分支上开了一个 draft PR([issue #576](https://github.com/mattpocock/skills/issues/576)),而且事后删除这个分支会破坏这些 tickets 持有的 context pointers。

## It's working if

- 你自己的 session 继续进行。如果你正坐在那里看着它读资料,说明这次委托没有真正发生。
- 恰好出现一个新的后台任务。如果出现了第二个名字几乎一样的,那是嵌套 bug。
- 出现一份新的 Markdown 文件,在仓库已经用来存放笔记的那个文件夹里,agent 会告诉你路径。
- 里面的每条论断都带一个链接,随机跟两条走一遍,会落在一份官方文档、一份规范,或者真正的源文件上——而不是某人对它的一份转述。
- 你能单凭这份文件就做出原本卡住你的那个决定,不需要自己再回去查一遍来源。

## Where it fits

一个随时可用的独立工具,给思考类 skills 提供养料,而不是坐在构建链条里的某一步。它产出的文件是要被带*进*那些 flow 的:[grilling](https://aihero.dev/skills-grilling) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 在事实已经摆在桌面上时能问出更犀利的问题,[to-spec](https://aihero.dev/skills-to-spec) 可以据此做综合。[wayfinder](https://aihero.dev/skills-wayfinder) 是唯一直接调用它的 skill,用一个 `/research` subagent 解决它地图上的每个 research ticket。关于整张地图,见 [ask-matt](https://aihero.dev/skills-ask-matt)。
