---
name: writing-fragments
description: 写作，explore 模式——挖掘原始碎片，还不涉及结构。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

<what-to-do>

这是纯粹的 **explore**（探索）模式：拓宽可以写的东西的空间，不去承诺任何结构——承诺结构是 _exploit_ 的事，那是另一个独立的 skill。跑一次会产出碎片的 grilling session，就用户想写的任何东西反复追问他们。在这里，强加阶段、大纲，或文章结构都不在范围内。

随着碎片从对话的任何一方浮现出来，把它们追加进一个单独的 markdown 文件。

如果用户没传路径，问一次要存到哪里，然后在这个 session 剩下的时间里记住它。

从用户说的第一句话开始就捕获碎片，包括最初的 prompt。

第一次写入时，在顶部放一个单独的 H1，写一个可以之后再改的暂定标题，别的什么都不要——没有 metadata，没有目录，没有日期。

</what-to-do>

<supporting-info>

## What is a fragment

一个碎片是任何可能存活进最终文章的一段文字。它必须是*作者能读懂的*——作者能看出它的意思——但它不需要定义自己的术语，也不需要对一个冷读者来说是自洽的。判断标准是"这是一段好文字吗？"，不是"这是一个自成一体的论证吗？"

碎片刻意是形态各异的。可能成为一个碎片的例子：

- 一句你想在某处用上、但还不知道用在哪的犀利句子。
- 一个带一行理由的论断。
- 一段小品文：发生过的一件事、一段代码片段、一个场景、一个类比。
- 一个半成型的想法："关于 X 感觉像 Y 这件事，以后再想清楚。"
- 一句引言、一段对话、一句无意中听到的话。
- 一份凭感觉挂在一起的相关观察列表。
- 一句抱怨、一次坦白、一个包袱。
- 一个**主导词（leading word）**——一个整篇文章都能挂靠的紧凑隐喻或造词（一个能给这个想法命名的术语，就像 _tracer bullets_ 或 _fog of war_ 能给一整套模式命名一样）。

在这些当中，主导词是最值得落地的碎片。它是承重的：在 explore 阶段起对了这个名字，会在之后塑造结构、过渡和标题——在整个 exploit 阶段持续带来回报。当对话反复围绕一个想法打转时，就推一把，为它造一个词。

小说家的日记就是这个模式的原型：多年不成结构的随手记录，之后被挖出来当原始素材用。碎片就是这些"随手记录"。

## File format

```markdown
# Working title

A first fragment lives here.

It can be multiple paragraphs. It can include lists, code, quotes — whatever
shape the fragment naturally takes.

---

A second fragment.

---

> A quoted line that the user wants to keep around.

A reaction to it.

---

- A cluster of related observations
- That hang together by feel
- And want to be near each other
```

碎片之间用一条水平分割线（`\n---\n`）隔开。正文内不用标题。不用标签。除了添加的先后顺序外，没有其他排序。

## Writing rhythm

默默地追加。不要为每个碎片都请求许可。可以顺带提一句你加了什么（"加上这个"），但不要用保存对话框打断谈话。

每次写入之前：先从磁盘重新读取这个文件。用户可能在两轮对话之间编辑、重排或删除过碎片——保留他们的改动。绝不要覆盖这个文件；只追加（或者，如果用户要求，原地编辑某个具体的碎片）。

用户随时可以说"删掉最后一个"、"把那个改得更犀利一点"、"把那两个合并"。把这些当作第一优先级的指令来对待。

</supporting-info>
