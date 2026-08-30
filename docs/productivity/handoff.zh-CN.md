[English](handoff.md) · [简体中文](handoff.zh-CN.md)

## What it does

`handoff` 把你当前的对话压缩成一份**交接文档**——一份 markdown 文件,写到你操作系统的临时目录里,而不是工作区中,让一个全新的 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 能读它、接手这份工作。

它买到的是**可携带性**,不是压缩率。这让这个 skill 比听起来的要窄。只有当工作必须*带着走*时,你才需要一份文件——去一个新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、一个新目录、一位同事,或者一个你想分叉出去的 side task。如果没有什么需要"带走",你不需要一次 handoff:留在 [session](https://www.aihero.dev/ai-coding-dictionary/session) 里、`/clear`、一个 [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent),以及 `/compact`,已经覆盖了普通的阶段结束场景,而且 `/compact` 覆盖到的场景比这个 skill 更多。

## When to reach for it

你需要输入 `/handoff` 来调用它——agent 不会自己主动使用它。传入一句关于下一个 session 是做什么的说明,这份文档会照着它来写。

四种情形构成了全部的触发条件:

| 情形 | 为什么需要一份文件 |
| --- | --- |
| 换 harness——Claude → Codex | 新的 harness 看不到旧的 [context](https://www.aihero.dev/ai-coding-dictionary/context) |
| 迁移到一个不同的目录或仓库 | 一个 prototype 目录是常见情况 |
| 把这份工作发给一位同事 | 他们需要一个能读的东西 |
| 分叉出一个 phase 进行中发现的 side task | 你继续工作;第二个 agent 接手这个分叉 |

对其他任何情况——同一个 harness、同一个目录、你刚做完 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)、要转去实现——`/compact` 才是该走的一步。[ask-matt](https://aihero.dev/skills-ask-matt) 携带着在一个 phase boundary 上五个选项的完整决策树。

## Branching is the use people skip

这个 skill 的描述读起来像 session 续接:写一份摘要,在这里结束,在那里恢复。这样读,它看起来像一个更差的 `/compact`,于是常被匆匆略过。真正值得了解的是分叉这个用法。你**留在自己的 session 里**,把积累起来的 context 拷贝一份,交给一个并行工作的第二个 agent。

这正是通往 [prototype](https://aihero.dev/skills-prototype) 那次绕道所用的机制。你正深陷一场设计对话,碰到一个只有跑代码才能解决的问题,而你不想为了查清楚这件事就搭上你已经建立起来的这段线程。交接给一个 prototype session,拿到答案,把答案交接回来,再从最初的线程里引用它。两次跨越,一段活着的对话,不需要重新解释任何东西。

在一个 phase boundary 上五个选项里,有三个各自保留着不同的东西:`/compact` 保留你的意图,`/clear` 什么都不保留,`/handoff` 保留这份工作移动的能力。

## What travels, and what doesn't

这份文档携带的是那段活着的线程——正在进行什么、为什么,以及接下来是什么——外加一个**建议 skills** 小节,点名下一个 agent 该用什么。写入之前会先脱敏 secrets。

它刻意不携带的,是任何已经被写下来的东西。Specs、plans、ADRs、issues、commits 和 diffs 都通过路径或 URL 引用,绝不复制。这让这份文件保持小巧,也让敲定的细节只活在一个地方,而不是两个会彼此漂移的地方。

## Common questions

**该用 handoff 还是 compact?**
除非有东西要"带走",否则用 `/compact`。留在同一个任务上是一次 compact,不是一次 handoff——同一个 harness、同一个目录、你需要留在循环里,这正是 phase-boundary 决策树在大多数日子里落地的地方。`/handoff` 的优势不在于它总结得更好;而在于它的结果是一份你能带到 `/compact` 到不了的地方的文件。

**那 compact、clear 和 handoff 之间到底有什么区别?**
保留的是三种不同的东西。`/compact` 压缩当前上下文,让你在一个全新窗口里继续——意图存活了下来。`/clear` 清空窗口,从零开始——当你身后的一切都可以丢弃时是正确的,如果判断错了就没法回头。`/handoff` 写一份可携带的文件——工作在搬到别处之后存活了下来。注意这三者都是把一个 **[primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)**(真实发生过的那段对话)变成一个 **[secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)**(它的一份摘要)。只有继续这个动作不会这样做,这正是它该被第一个排除的原因。

**我的 handoff 文件去哪了?**
临时目录,这是这个 skill 被反映最多的摩擦点:路径很长,不同操作系统还不一样,在 Windows 上 agent 有时要试好几次才能找到正确的那个。要回路径,在继续之前先保管好它。放在临时目录是刻意的:一次 handoff 是一份过渡文档,不是一个你要维护的 artifact。它也不是持久的——见下一个问题。

**我的 handoff 在两次 session 之间消失了。**
有些环境会在 sessions 之间清空临时目录——据报告 Codex 是这种情况——而且 `/private/tmp` 在重启后也会清空。如果下一个 session 不会在一小时内开始,或者会在一个不同的 harness 下开始,写好之后就立刻自己把这份文件复制到一个持久的地方。这同样适用于这份文档*指向*的任何东西:一份引用了临时目录里其他文件的交接文档,下一个 agent 是没法跟着走的。

**我该怎么真正把它交给下一个 agent?**
打开全新 session,把路径指给它:读这份文件,然后继续。指向文件,而不是把摘要粘进一条 shell 命令——一份含有反引号或 `$(...)` 的摘要,在被插值进 `claude "<summary>"` 时会被弄乱,常见的失败方式是悄悄截断,而不是报错,于是新的 agent 会从一份悄悄不完整的简报开始。

**这和 `/branch`、`--fork-session`,或者内置的 `/handoff` 是同一回事吗?**
类似,但不完全一样,而且这里没有一个叫 `/branch` 的发布 skill——`/handoff` 是规范名称。一次 fork 继承的是 context 的一份精确拷贝;这个 skill 产出的是一份*有针对性*的压缩,瞄准一个明确说出来的下一个任务,存在一份文件里。如果一次 fork 就够用——同一台机器、同一个 harness、同一个目录——fork 的工作量更小。一旦目的地是 fork 到不了的地方,文件就赢了。

**什么时候该把东西放进 `CLAUDE.md`,而不是这里?**
问自己一个问题:下个月它还成立吗?`CLAUDE.md` 是关于这个项目的常设背景,不管相不相关,每个 session 都会加载它。一次 handoff 关乎一件正在进行的具体工作,一旦那份工作落地,它就死了。反复被重新解释的事实是一个 `CLAUDE.md` 的问题;一个做到一半的任务才是一次 handoff。

**它只捕捉了"是什么",没捕捉"为什么"。**
一条公正、也反复被提出的批评。两件事有帮助。传入这个参数——告诉它下一个 session 是为了什么——这样和*那件事*相关的推理才会被保留,而不是被压平。同时留意这次 session 从没真正验证过的自信断言:"X isn't built"、"Y is done"。下一个 agent 会把这份文档当作一份合约来对待,不会重新核对它,所以一个被写成事实的信念,会变成之后一切的一个错误前提。在交接之前读一遍这份文档,把任何你只是假设过的东西降级。

**为什么它是一个 skill,而不是一个 slash command?**
两种都行;它们适合不同的情况。作为一个 skill,它通过和这里其他一切一样的安装路径发布和更新,这正是让它可分享的原因——"agent 不会自己触发它"这条约束,是由它的 frontmatter 设定的,而不是由机制本身设定的。

## It's working if

- 这份文档只是这段对话的一小部分,里面的 specs、issues 和 diffs 是以路径和 URL 的形式出现,而不是被复制的文字。
- 你能在原始 session 没打开的情况下冷读它,并知道接下来该做什么。
- 全新的 agent 直接开始工作,而不是要求你重新解释一遍这套 setup。
- 在分叉的情况下,当你回到原始 session 时,它依然原封不动地待在那里。
- "建议 skills" 那一节点名的,正是你自己会去用的那个 skill。
- 里面没有任何密钥、token 或密码。

## Where it fits

`handoff` 是一个**随时可用的独立工具**,活在 sessions 之间的接缝上,而不是在某条构建链条内部——但它的适用范围很窄,诚实地说,你用它的次数会比 phase boundary 上其他四个选项都少。它最近的邻居是 [prototype](https://aihero.dev/skills-prototype),因为一个 prototype 活在自己的目录里,那趟出去再回来的往返,正是这个 skill 存在的意义所在的那次跨越。当你处在一个边界上、拿不准该继续、清空、交接、委托,还是压缩时,[ask-matt](https://aihero.dev/skills-ask-matt) 携带着给这五者排序的那棵决策树——并帮你在整套集合里路由。
