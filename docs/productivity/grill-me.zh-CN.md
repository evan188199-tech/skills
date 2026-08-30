[English](grill-me.md) · [简体中文](grill-me.zh-CN.md)

## What it does

`grill-me`拿一个**松散的想法**采访你,直到你能对它做出承诺。你不需要一份已经想清楚的计划才能开始——产出一份正是这次 [session](https://www.aihero.dev/ai-coding-dictionary/session) 的目的。它按**轮次**提问:每一轮都是整个 **frontier**——每一个前提条件已经确定的问题——所以你从不会被问到一个依赖尚未听到答案的问题。

它是 **[stateless](https://www.aihero.dev/ai-coding-dictionary/stateless)** 的。它不写任何文件,也不留下任何工作区。它留下的唯一东西,是你脑子里那个变得更清晰的想法。

## When to reach for it

你需要输入 `/grill-me` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。在一段**全新对话**里启动它,而不是叠加在一份 agent 已经写好的计划之上。

一旦你有一个值得认真对待的想法——一个 feature、一个产品方向、一次业务决策、一段文字——就用它,而且要在你想清楚它涉及什么之前就用。模糊不是等待的理由;它正是这次 session 要消化的东西。如果你已经能精确地说清楚这件事,就不需要对它做 grilling。

三个 grilling skills 里你想要哪一个,取决于你眼前是什么:

- **任何东西,任何地方**——`grill-me`。不需要仓库,不写任何文件,主题也不必是代码。
- **有一个代码库要对齐**——[grill-with-docs](https://aihero.dev/skills-grill-with-docs)。同样的访谈,但是 [stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) 的:它会读你的代码,把学到的东西保留在 `CONTEXT.md` 和 ADR 里。
- **大到单个 session 装不下**——[wayfinder](https://aihero.dev/skills-wayfinder)。它把这次工作绘制成一张地图,在里面运行 grilling sessions。

关掉 [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode)。Plan mode 会促使 agent 急着产出一份计划,这和停留在探询状态正好相反。

## It's a conversation, not an interview

这个 skill 负责提问,但**你**掌控范围。这正是人们最容易忽略的一点,也是让一次 session 把一个想法变成一系列决策、还是产出一堆自信满满的胡话的分野。

失败模式是**被动**——对四十个问题都回答"同意、同意、同意",最后拿到一份 agent 写的、你点头认可的计划。它感觉很有成效,因为它很长。实际上什么都没被真正决定,产出的东西带着它并不配拥有的确定性。

主动意味着掌舵。当一个问题问得没有你需要的精细度时,反驳它。当范围开始漂移时,说出来。真心实意地回答"我不知道"。这个 skill 是用来辅助一位工程师的,不是用来取代一位工程师的:产出的东西追踪的是你答案的质量,不是被问了多少个问题。

反过来的错误也是真实存在的,但更少见——在这场访谈里待得太久,始终没能走到代码那一步。

## Grillable and ungrillable

有些问题能靠聊天回答。有些不能,再怎么 grilling 也到不了答案。

"一个长表单,还是三个页面?"和"这个交互该是什么感觉?"是**没法被 grill 出来的**——它们需要一个可以反应的东西。碰到这种问题时,停止 grilling。用 [prototype](https://aihero.dev/skills-prototype) 构建一个一次性版本,看着它,然后回来用一句话回答。

试图靠聊天解决一个没法被 grill 出来的问题,正是 session 膨胀的地方。Agent 不停地换说法,你不停地猜,范围随着不确定性一起膨胀。

## It's working if

- 你对某件事有异议。一次你完全没提出反驳的 session,是一次你本不需要的 session。
- 问题以几轮的形式到来,而不是一长串滴水式的提问,后面的轮次明显建立在你之前说过的话上。
- 你最终到达了一个你没预料到的地方,因为某个问题揭示出一个你一直在隐式做出的决定。
- 结束时,你能向一个不在场的人为每一个选择辩护。

## Common questions

**我该预期多少个问题?我怎么知道它什么时候结束?**
数轮次,不要数问题。四轮里问了四十六个问题是一次正常的 session。当 frontier 为空时它就结束了——每个分支都走过了,没有什么被默默地假设掉。

**它问了我两百个问题。哪里出问题了?**
通常是范围定得太大了。先让 agent 把这份工作拆成更小的部分,再对每一部分分别做 grilling。非常长的 session 也会漂进 **[dumb zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**,那时 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 已经够满了,问题的质量会变差。

**我能回到一次一个问题的模式吗?**
可以。把这个加进你的全局 `CLAUDE.md`:

```
When grilling, ask one question at a time.
```

**如果我真的不知道答案怎么办?**
说出来。"我不知道"是一个真实的答案,一个你答不上来的问题,通常是该去做 prototype、而不是去猜的信号。

**写 spec 之前我该开一个全新 session 吗?**
不该。这次 session 的价值正是你刚建立起来的那份 [context](https://www.aihero.dev/ai-coding-dictionary/context)。把同一段对话直接交给 [to-spec](https://aihero.dev/skills-to-spec)。

**模型重要吗?**
比大多数 skills 都重要。Grilling 依赖的是 [model](https://www.aihero.dev/ai-coding-dictionary/model) 自己对系统会怎么崩溃的判断力,所以给它用你最好的那个。实现工作大多跟着 context 走,能容忍一个更便宜的模型。

## Where it fits

`grill-me` 是一个**能在任何地方、针对任何事运行的独立工具**。正是它的无状态让它可移植:不需要仓库,不需要工作区,不需要 setup,也不假设这个想法一定和软件有关。人们用它来对付业务决策、写作、接下来该做什么——任何在他们脑子里安静不下来的东西。

这份可移植性,正是它和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 的全部区别——后者跑的是同一套访谈,但会读一个代码库来对齐,并把学到的东西记录成 `CONTEXT.md` 和 ADR。两者都建立在 [grilling](https://aihero.dev/skills-grilling) 这个原语之上;`grill-me` 是那个不携带任何东西、user-invoked 的前门。

如果你 grill 出来的东西最终证明确实是软件,你可以把同一段对话交给 [to-spec](https://aihero.dev/skills-to-spec),继续走进构建 flow——这是一个可选项,不是这个 skill 的重点。当你拿不准哪条 flow 合适时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
