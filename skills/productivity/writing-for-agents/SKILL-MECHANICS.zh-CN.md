[English](SKILL-MECHANICS.md) · [简体中文](SKILL-MECHANICS.zh-CN.md)

# Skill mechanics

[`writing-for-agents`](SKILL.md) 里针对 skill 的专属分支：当文档是一个 skill 时会有什么不同——frontmatter、调用方式的选择，以及 router skills。写作本身的其余部分，都是 `SKILL.md` 里的通用参考。

## Invocation

两种选择，权衡的是那两种负担：

- 一个 **model-invoked** skill 保留一个 `description`，让 agent 能自主触发它——其他 skill 也能触达它。你依然可以直接输入它的名字：model-invocation 始终*包含*用户可触达性；一个 description 只会增加 agent 的可发现性，从不会拿走人类的可触达性。这个 description 是这个 skill 顶层的 context pointer，被迫始终加载——用永久的 context load 换取可发现性。一个内容全是 reference 的 model-invoked skill，同时也是共享参考的一个归宿：其他 skill 可以调用它，这样多个 skill 都需要的参考内容就能只活在一个地方。做法：省略 `disable-model-invocation`，写一份面向模型、带着触发分支的 description（`SKILL.md` 里那些写指针的规则完全适用）。
- 一个 **user-invoked** skill 把 description 从 agent 的触达范围里剥离：只有人类主动输入它的名字才能调用它，其他任何 skill 都不能。零 context load，但要花费 cognitive load——你就是那个必须记得它存在的索引。做法：设置 `disable-model-invocation: true`；这个 `description` 就变成面向人类的——一行摘要，去掉触发词列表。

只有当 agent 必须自己触达这个 skill、或者另一个 skill 必须触达它时，才选 model-invocation。如果它只会被手动触发，就做成 user-invoked，不花任何 context load。

两个 user-invoked skill 都需要的共享参考，放在它们中的任何一个里都不合适——因为都没有 description，谁也没法触发另一个。把它推到 skill 系统之外的一个普通文件里：任何 skill 都能指向的外部参考。

## Splitting by invocation

拆分里"按调用方式"这个切法（"按顺序"的切法在 `SKILL.md` 里）：当你有一个独立的主导词、它应该能单独触发某个 skill时——一个你在 prompts 里确实会用到的触发词——或者另一个 skill 必须触达它时，就把一个 model-invoked skill 拆出来。你要为这个新的、始终加载的 description 支付 context load，所以这份独立的可触达性必须值这个价。

## Router skills

当 user-invoked skills 的数量多到超出你能记住的范围时，那份堆积起来的 cognitive load 可以靠一个 **router skill** 来治：一个 user-invoked skill，点名其他所有 skill，以及什么时候该用哪一个，这样人类只需要记住一个 skill，而不是一大堆。它只能提示，不能触发它们：user-invoked skills 没有 description，除了人类之外没有什么能触达它们。
