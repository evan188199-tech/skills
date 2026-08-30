---
name: domain-modeling
description: 构建并打磨一个项目的领域模型。当用户想敲定领域术语或一套统一语言、记录一个架构决策，或者当另一个 skill 需要维护领域模型时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Domain Modeling

在设计过程中主动构建并打磨项目的领域模型。这是一种*主动*的纪律——挑战术语、构造边界场景，并在词汇和决策刚刚成型的那一刻就把它们写下来。（仅仅为了获取词汇而*读取* `CONTEXT.md` 不算这个 skill——那只是任何 skill 都能做的一个一行习惯。这个 skill 是给你在*改动*模型、而不只是*使用*模型时用的。）

## File structure

大多数仓库只有一个 context：

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

如果根目录存在 `CONTEXT-MAP.md`，说明这个仓库有多个 context。这份地图会指出每一个都在哪里：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← 系统级决策
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context 专属决策
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

按需创建文件——只在你有东西要写的时候才创建。如果 `CONTEXT.md` 不存在，就在第一个术语被敲定时创建它。如果 `docs/adr/` 不存在，就在第一次需要 ADR 时创建它。

## During the session

### 用词汇表来挑战

当用户使用的术语和 `CONTEXT.md` 里已有的语言冲突时，立刻指出来。"你的词汇表把 'cancellation' 定义为 X，但你现在说的好像是 Y——到底是哪个？"

### 打磨模糊的语言

当用户使用模糊或身兼数职的术语时，提出一个精确的标准术语。"你说的是 'account'——你指的是 Customer 还是 User？这是两个不同的东西。"

### 讨论具体场景

当正在讨论领域关系时，用具体场景对它们做压力测试。构造能探测边界情况的场景，逼着用户把概念之间的边界说清楚。

### 和代码做交叉核对

当用户陈述某个东西是怎么运作的时，检查代码是否和这个说法一致。如果发现矛盾，把它摆出来："你的代码取消的是整个 Order，但你刚才说部分取消是可能的——到底哪个是对的？"

### 就地更新 CONTEXT.md

当一个术语被敲定时，就在当场更新 `CONTEXT.md`。不要攒起来一起做，要在它们发生的那一刻就记下来。使用 [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) 里的格式。

`CONTEXT.md` 应该完全不含任何实现细节。不要把 `CONTEXT.md` 当成一份 spec、一个草稿本，或者一个存放实现决策的地方。它只是一份词汇表，仅此而已。

### 谨慎地提议写 ADR

只有当以下三点同时成立时，才提议创建一份 ADR：

1. **难以撤销**——之后改变主意的代价是实实在在的
2. **没有上下文就会让人意外**——未来的读者会想"他们当初为什么要这么做？"
3. **是一次真实权衡的结果**——存在真正的备选方案，而你出于具体原因选了其中一个

只要三点里有一点不成立，就跳过这份 ADR。使用 [ADR-FORMAT.md](./ADR-FORMAT.md) 里的格式。
