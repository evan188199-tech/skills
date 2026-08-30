[English](wait-what.md) · [简体中文](wait-what.zh-CN.md)

## What it does

`wait-what` 是当一条消息没说明白时,你要输入的东西。[Agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会重新讲一遍它刚说过的话。它会补上你缺的那部分背景信息,用大白话写,并使用你项目 `CONTEXT.md` 里的词汇。

这个 skill 只有三行。这是设计如此,不是一份没写完的草稿。对抗啰嗦的 skills 往往靠"变长"来失败:一个四百行的简洁 skill 依然会让 [model](https://www.aihero.dev/ai-coding-dictionary/model) 啰嗦,因为模型读到的是篇幅,不是恳求。这一个只带着一个精确的主导词,别无其他。

## When to reach for it

你需要输入 `/wait-what` 来调用它。Agent 不会自己主动使用它,也不该。只有你自己知道自己是在哪一刻跟丢的。

在你发现自己开始一目十行的那一刻用它。Agent 已经漂进了它自己发明的行话、堆了五个缩写,或者解释了一个你从没见过前提的决策。它修复的是你正在进行的这段对话。要从源头上阻止行话出现,用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs),它会提前建立起共享语言。

## The name is the mechanism

这个主导词是 **wait**(等等)。"简洁一点"是一条关于 agent 输出的指令,模型服从它的方式是砍掉词语、让你更加跟不上。**Wait** 讲的是*你*的状态。它说的是,理解在这里失败了。一个听到"be brief"的 agent 会写电报。一个听到"wait, you lost me"的 agent 会退回去,重新解释。

这个差异就是整个 skill。每一个流行的对抗啰嗦的修法,针对的都是*输出*:`/tldr`、`/no-fluff`、`/talk-normal`。模型会矫枉过正,变成一种更短、却并不更清楚的"穴居人"语域。点名*听者*,则同时要求了两样东西:更少的词,**加上**你缺的那部分上下文。

这个 skill 说的是重新讲*那个*,不是"上一条消息"。让你跟丢的东西,通常比一段话要大,所以由 agent 自己决定该退回多远。

## It plugs into the language you already have

它的正文复用你全局 `CLAUDE.md` 和你项目 `CONTEXT.md` 里已经存在的那些主导词。ASD-STE100 Simplified Technical English 定下语域。统一语言提供名词。这个 skill、`CLAUDE.md` 和 `CONTEXT.md` 用的是同一套 [tokens](https://www.aihero.dev/ai-coding-dictionary/token),所以调用它不是一条新指令。它是在提醒 agent 一件它已经同意过的事。

如果你没有 `CONTEXT.md`,这个 skill 依然能用。你只是失去了领域词汇那一半的效果。

## It's working if

- 重新讲一遍的版本**更短、更清楚**,而不是更短、更生硬。
- 它补上了你缺的那个前提,而不只是删掉一些词。
- 项目的名词取代了凭空发明的名词。你 `CONTEXT.md` 里的术语回来了。
- 你能连续用它两次,它不会退化成一味的简短。

## Where it fits

你可以在任何时刻、任何对话里、在任何其他 skill 内部使用 `wait-what`。它是事后修复一条消息的手段。真正的根治方法是提前达成一套共享语言,那就是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs):一次会顺带运行 [domain-modeling](https://aihero.dev/skills-domain-modeling) 的 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session,让你们双方用的词落进你的 `CONTEXT.md` 里。如果你拿不准此刻该用哪个 skill,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
