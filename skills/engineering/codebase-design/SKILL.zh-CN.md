---
name: codebase-design
description: 设计 deep modules 的共享词汇。当用户想设计或改进一个模块的接口、寻找可以做深的机会、决定 seam 放在哪里、让代码更易测试或更适合 AI 导航，或者当另一个 skill 需要 deep-module 词汇时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Codebase Design

设计 **deep modules**：把大量行为藏在一个小接口后面，放在一个干净的 seam 上，能通过这个接口被测试。无论代码正在被设计还是重构，都用这套语言和这些原则。目标是给调用方提供 leverage，给维护者提供 locality，让每个人都能测试。

## Glossary

严格使用这些术语——不要替换成 "component"、"service"、"API" 或 "boundary"。语言的一致性就是重点所在。

**Module** —— 任何拥有接口和实现的东西。刻意做到与规模无关：可以是一个函数、一个类、一个包，或者横跨多层的一个切片。_避免使用_：unit、component、service。

**Interface** —— 调用方要正确使用这个模块必须知道的一切：类型签名，但也包括不变量、顺序约束、错误模式、必需的配置，以及性能特征。_避免使用_：API、signature（太窄——它们只指类型层面的表面）。

**Implementation** —— 一个模块内部是什么，它的代码本体。和 **Adapter** 不同：一个东西可以是一个小 adapter 配一个大 implementation（一个 Postgres repo），也可以是一个大 adapter 配一个小 implementation（一个 in-memory fake）。当话题是 seam 时用 "adapter"；否则用 "implementation"。

**Depth** —— 接口处的杠杆效应：调用方（或测试）每学习一单位接口，能驱动多少行为。当大量行为藏在一个小接口后面时，一个模块是 **deep** 的；当接口几乎和实现一样复杂时，它是 **shallow** 的。

**Seam**（Michael Feathers 提出）—— 一个可以在不编辑该处的情况下改变行为的地方；也就是一个模块接口所在的*位置*。Seam 放在哪里本身就是一个独立的设计决策，和背后放什么是两回事。_避免使用_：boundary（和 DDD 的 bounded context 撞义）。

**Adapter** —— 在某个 seam 处满足某个接口的具体实现。描述的是*角色*（它填补哪个槽位），而不是*内容*（里面是什么）。

**Leverage** —— depth 带给调用方的东西：每学习一单位接口能获得更多能力。一份实现能在 N 个调用点和 M 个测试里持续回本。

**Locality** —— depth 带给维护者的东西：改动、bug、知识和验证都集中在一个地方，而不是散落在各个调用方那里。修一次，处处都修好了。

## Deep vs shallow

**Deep module** = 小接口 + 大量实现：

```
┌─────────────────────┐
│   Small Interface   │  ← 方法少，参数简单
├─────────────────────┤
│                     │
│  Deep Implementation│  ← 复杂逻辑被藏起来
│                     │
└─────────────────────┘
```

**Shallow module** = 大接口 + 少量实现（要避免）：

```
┌─────────────────────────────────┐
│       Large Interface           │  ← 方法多，参数复杂
├─────────────────────────────────┤
│  Thin Implementation            │  ← 只是简单转发
└─────────────────────────────────┘
```

设计接口时，问自己：

- 我能减少方法数量吗？
- 我能简化参数吗？
- 我能把更多复杂性藏在里面吗？

## Principles

- **Depth 是接口的属性，不是实现的属性。** 一个 deep module 内部完全可以由许多小的、可 mock、可替换的部件组成——它们只是不属于接口的一部分。一个模块既可以有**内部 seams**（对它自己的实现私有，只被自己的测试使用），也可以有位于接口处的**外部 seam**。
- **删除测试法。** 想象把这个模块删掉。如果复杂性随之消失，说明它只是个转发层。如果复杂性在 N 个调用方那里重新冒出来，说明它是有价值的。
- **接口就是测试面。** 调用方和测试穿过的是同一个 seam。如果你想测试到接口*之后*的东西，说明这个模块的形状大概率不对。
- **一个 adapter 意味着一个假想的 seam。两个 adapter 才意味着一个真实的 seam。** 除非确实有东西会跨它变化，否则不要引入一个 seam。

## Designing for testability

好的接口让测试变得自然：

1. **接受依赖，而不是自己创建依赖。**

   ```typescript
   // 可测试
   function processOrder(order, paymentGateway) {}

   // 难以测试
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **返回结果，而不是产生副作用。**

   ```typescript
   // 可测试
   function calculateDiscount(cart): Discount {}

   // 难以测试
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **小的表面积。** 方法越少 = 需要的测试越少。参数越少 = 测试搭建越简单。

## Relationships

- 一个 **Module** 恰好拥有一个 **Interface**（它呈现给调用方和测试的表面）。
- **Depth** 是一个 **Module** 的属性，相对于它的 **Interface** 来衡量。
- 一个 **Seam** 是一个 **Module** 的 **Interface** 所在的地方。
- 一个 **Adapter** 位于某个 **Seam** 上，满足该 **Interface**。
- **Depth** 为调用方产生 **Leverage**，为维护者产生 **Locality**。

## Rejected framings

- **把 Depth 定义为实现行数与接口行数之比**（Ousterhout 的定义）：这会鼓励给实现"注水"。我们改用 depth-as-leverage 这个定义。
- **把 "Interface" 等同于 TypeScript 的 `interface` 关键字或一个类的公开方法**：太窄——这里的 interface 包括调用方必须知道的每一个事实。
- **"Boundary"**：和 DDD 的 bounded context 撞义。请说 **seam** 或 **interface**。

## Going deeper

- **在已知依赖关系的情况下，如何把一个集群做深**——见 [DEEPENING.md](DEEPENING.md)：依赖分类、seam 纪律，以及"替换而非叠加"的测试方式。
- **探索多种备选接口**——见 [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md)：启动并行的 sub-agents，用几种截然不同的方式设计接口，然后在 depth、locality 和 seam 位置上做对比。
