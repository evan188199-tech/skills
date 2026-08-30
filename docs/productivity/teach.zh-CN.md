[English](teach.md) · [简体中文](teach.zh-CN.md)

## What it does

`teach` 把你运行它的那个目录变成一个常设的教学工作区,在很多 [sessions](https://www.aihero.dev/ai-coding-dictionary/session) 里,用简短、自包含的 HTML 课程教你一个主题。

它不会靠 [model](https://www.aihero.dev/ai-coding-dictionary/model) 已经知道的东西来教。[Parametric knowledge](https://www.aihero.dev/ai-coding-dictionary/parametric-knowledge)(参数化知识)被当作不可信的:在教之前,它会先去找高可信的资源,把它们记进 `RESOURCES.md`,并在每节课里引用它们。另一个结构性事实是它是 [stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) 的——mission、resources、lessons,以及你已经学到的东西的记录,全部作为文件活在这个目录里,所以下一个 session 是从这些文件接着来的,而不是从上一段对话剩下的东西接着来。

## When to reach for it

你需要输入 `/teach` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。

当学习本身就是这个项目时用它:一门语言、一个框架、一个你刚加入的代码库、瑜伽、shaders、一项认证。它不是用来顺带解释一件事的工具。

| 你想要什么 | 该用什么 |
| --- | --- |
| 用几周时间学一个主题,sessions 会持续累积 | `teach` |
| 在你已经在进行的 session 里解释一个概念 | 直接在那个 session 里问就行 |
| Agent 上一条消息没说明白,想重新讲一遍 | [wait-what](https://aihero.dev/skills-wait-what) |
| 打磨你已经有的想法,而不是获取新材料 | [grill-me](https://aihero.dev/skills-grill-me) |
| 一个后台 agent 去读 [primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source),留给你一份带引用的文档 | [research](https://aihero.dev/skills-research) |
| 想学一件在 grilling 中途冒出来的东西,又不想打断那次 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) | 先 [handoff](https://aihero.dev/skills-handoff) 到一个教学工作区,再在那里用 `teach` |

## Prerequisites

`teach` 构建的是一个目录,而不是产出一份文件,而且这个 skill 假定一个工作区对应一个 mission——所以在一个你乐意整个交给单一主题的地方运行它。把它放在你正在工作的项目之外:推荐的做法是一个独立的仓库,而不是一个全局的 `~/.learnings/` 文件夹,也不是工作项目本身。一个专门的仓库还能让这些课程可以被提交,这也是团队分享它们的方式。

在那个目录里会积累下来的东西:

| Path | 承载什么 |
| --- | --- |
| `MISSION.md` | 你为什么要学这个。其他一切都挂在它上面;如果它缺失,`teach` 做的第一件事就是采访你,直到它不再缺失 |
| `RESOURCES.md` | 它据以教学的、经过筛选的来源,分成 Knowledge 和 Wisdom(communities)两类 |
| `lessons/*.html` | 编号的课程——教学的主要单元 |
| `reference/*.html` | 压缩后的速查表、算法、词汇表:你真正会回头查阅的文档 |
| `learning-records/*.md` | ADR 风格的笔记,记录你已经切实证明学会的东西,用来决定接下来该教什么 |
| `assets/*` | 可复用的组件——最先出现的通常是一份共享样式表——让这些课程看起来像一门课 |
| `NOTES.md` | 你说明过的教学偏好 |

关于这份清单,有两点要诚实说明。一份词汇表适合大多数主题,但这个 skill 自带的 `GLOSSARY-FORMAT.md`,`SKILL.md` 已经不再链接它了,所以你得主动要求才会拿到一份([issue #559](https://github.com/mattpocock/skills/issues/559))。而且这个工作区不总是被创建在你期待的地方——在你基于它构建一门长课程之前,先看下面第一个问题。

## Storage strength, not fluency

值得用来思考的词是 **storage strength**(存储强度):长期留存,相对于 **fluency**(流畅度)——那种阅读时感觉像是掌握了、一周后就消失的当下回忆能力。`teach` 通过"合意难度"来构建前者——检索练习、间隔、交替。知识排在前面,那里难度是敌人,因为它会吃掉你理解所需要的工作记忆;然后技能通过一个紧凑的反馈循环被操练出来,那里难度是工具。

有两样东西引导着你被教什么。**Mission**——你想要这个的具体现实理由——是每节课的依据;没有它,课程会漂向抽象,也没有什么能决定接下来该讲什么。基于 mission 和学习记录,`teach` 会在你的**最近发展区**内挑选下一节课:有足够的挑战性、需要花力气,但又不会远到学不会。

这也是为什么这个 skill 会反驳你,而不是一味顺从。一个需要**智慧**——真实世界判断力——的问题,会先得到一次尝试性的回答,然后被指向一个你可以在那里检验它的社区。一次测验是一道关卡,不是走个形式:有用户报告说自己说了句"谢谢",却被告知这次练习还没结束。

## Lessons, references and components

一节**课**是一个自包含的 HTML 文件,短到能一口气读完,紧扣 mission,给出一个实实在在的收获。它引用自己的来源,推荐一个值得你亲自去读的一手来源,并链接到相邻的课程和参考文档。

值得了解的一个划分:课程很少被重新翻阅,参考文档会。所以一节课压缩后的精华——语法表、算法、姿势序列、词汇表——该放进 `reference/`,而不是埋在引入它的那节课里。

课程是用 `assets/` 里的**组件**搭建的:样式表、测验小组件、模拟器、图表辅助工具。复用是默认做法。Agent 在写一节课之前会先读 `assets/`,基于已有的东西来搭建,任何第二节课也能用到的新东西,都会被写成一个组件,而不是内联进去。共享样式表是每个工作区最先获得的组件;正是它让产出的东西不至于变成一堆各自为政的东西。

## Common questions

**它把文件放在哪?我的最后跑到了 `~/.claude/skills` 里。**
一个真实的、still open 的 bug([#377](https://github.com/mattpocock/skills/issues/377))。`SKILL.md` 同时用 `./` 指代两个不同的根目录:`./MISSION-FORMAT.md` 和它的同类文件,确实就挨着已安装 skill 里的 `SKILL.md`;而 `./lessons/`、`./reference/`、`./learning-records/` 和 `./assets/` 本该在你的目录里。一个把第一种路径相对 skill 安装目录来解析的 agent,会接着把第二种也这样解析,于是把你的课程写进了 skill 文件夹里。在你基于它继续构建之前,先检查第一节课落在了哪里,并在开始时明确点名这个目录,而不是依赖"当前目录"被正确理解。

**我该留在同一个 session 里,还是每节课开一个新的?**
三种方式都行——留在同一个 session、在一个新 session 里重新调用 `/teach`,或者在同一个文件夹里开一个新 session。每节课都是它自己的一次调用。连续性在于这个文件夹,不在于这段对话。常见的做法是在这个工作区里开一个全新 session,说 `/teach next lesson for <topic>`。

**我怎么知道它没有在教我一些它编出来的东西?**
光凭这个 skill 自己的话,你没法知道。你得去读那些一手来源。`teach` 没有可靠到能被不加核实地信任,任何建立在 LLM 上的 skill 都做不到。那套打基础的机制——`RESOURCES.md`、每节课里的引用、每节课一个推荐的一手来源——存在的意义是让验证变得便宜,而不是取消验证的必要性。这种失败不是假设性的:有一位在学三阶魔方的用户,被教了一套编造出来的、根本解不开魔方的转法。遇到这种情况的诊断清单是:模型、harness、effort——以及来源是什么。风险在有精确记法的程序性领域里最高,在产出能被立刻验证的地方最低,比如你能直接运行的代码。

**测验的正确答案总是第一个选项。**
被好几个人在 Sonnet、Opus 和 GLM 上确认过,而且依然没修。`SKILL.md` 现在要求每个答案的字数一致,这消灭了另一个识别标志——以前正确答案通常是唯一被完整论证过的那个——但完全没提到位置。有一位贡献者测试过一个针对位置的指令层面修复,报告说在九节课里,正确答案依然 33 次里有 33 次落在 A 位([#335](https://github.com/mattpocock/skills/issues/335)),这指向真正的修法应该是 `assets/` 里一个会打乱顺序的测验组件,而不是更好的措辞。在它发布之前,把答案位置当作没有意义的信息。你的 `assets/` 目录是你自己的,可以改,所以要求一个在渲染时打乱顺序的组件,是一个合理的本地修复。

**它假设我已经知道一些东西,用了它从没定义过的术语。**
这是最常见的实质性抱怨。这里没有一个评估步骤:`teach` 从 mission 和学习记录里推断你的水平,而在第一个 session 里,还没有任何学习记录。有一位在 wayfinder pipeline 里运行它的用户说得很直白——"It never did grilling to establish my starting point so it made lots of assumptions of what I already knew."。另一位报告说课程依赖未定义的行话,还有一节针对他们硬件定制的课,讲了这个硬件能做什么,却从没说它不能做什么。两件事有帮助:在第一条消息里说明你已有的知识和你的缺口,当一节课判断错了水平时大声纠正它,因为这次纠正会变成一条学习记录,并引导下一节课。一个明确的知识评估步骤是一个长期存在的功能请求([#725](https://github.com/mattpocock/skills/issues/725)),不是已发布的行为。

**它会做间隔重复吗?它知道什么时候该停止教学吗?**
第一个不会,第二个也不可靠。间隔和交替是这些课程被设计要遵循的原则,但没有什么会安排一次复习,也没有 Anki 或日历集成——两者都是反复被提出的请求。相关的缺口是退出标准:正如一位用户所说,`teach`"is good at making the next lesson, but not as good at knowing when to stop and switch to review or real practice."。如果你想要复习或操练,而不是新材料,主动提出来;这个 skill 不会自己提议切换。

**它只对代码有用吗?**
不是,非编程类用法在记录里占了更大一部分:韩语、日语敬语、钢琴、吉他、桌游设计、OpenSCAD、电影剧情、Azure 和 CCNA 认证、大学考试,还有八岁和十岁的孩子拿到了关于密室逃脱和火蝾螈的可打印读物。这个 skill 里没有任何东西是编程专属的——mission、resources、最近发展区和练习,在任何领域里运作方式都一样。在代码领域内,反映最强烈的用法不是从零学一门语言,而是在一个陌生代码库或一个新团队的技术栈里快速定位。

**我该用哪个模型运行它?**
没有一个规范答案,报告出来的差异很大。据报告,更高的 [reasoning effort](https://www.aihero.dev/ai-coding-dictionary/effort) 产出的课程明显好于中等档位。有用户通过 Copilot CLI 配 Codex 跑同一个 skill,只得到一张 30 行的 HTML 卡片,而 Claude Code 产出了一节完整的课。它在 Claude Cowork 里能原样运行,取决于你的组织是否允许在那里添加 skills。如果课程内容显得单薄,先换模型、harness 或 effort,再重写你的 prompt。

## It's working if

- 在一个空目录里,它做的第一件事是采访你为什么想学这个,而不是直接产出一节课。
- `RESOURCES.md` 比课程更早被填满,每节课都点名一个值得你亲自去读的一手来源。
- 课程里的论断都带着外部链接。一节没有任何引用的课,就是这个 skill 在凭记忆教学。
- 一节课能一口气学完,让你能做一件之前做不到的事。
- 在这个文件夹里开一个全新 session、说"next lesson",能接着上课,而不是从头开始。
- `learning-records/` 在增长,课程不再重复教你已经证明学会的东西。
- 这些课程看起来像一门课——它们链接 `assets/` 里的样式表,而不是各自携带自己的一份。
- 一个需要判断力的问题,会把你指向一个论坛、subreddit 或课程,而不只是给一个答案。

## Where it fits

`teach` 是一个**随时可用的独立工具**。它不是构建链条里的一步,和 engineering flow 不共享任何 artifacts;它拥有自己的目录,只要这个主题还在学,它就一直活在那里。

它唯一真正的邻居是 [handoff](https://aihero.dev/skills-handoff),通过 Matt 点名的那个组合来回答"如果我被追问一件我不懂的事,该怎么办?":不要停下正在进行的 grilling 去学习——`/handoff` 到一个教学工作区,在那里用 `/teach` 学会它,然后回去接着刚才的地方。相近的替代品是 [research](https://aihero.dev/skills-research),当你想要的是一份带引用的文档、而不是课程和记忆留存时用它。当你拿不准哪个 skill 或 flow 合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你在整套集合里路由。
