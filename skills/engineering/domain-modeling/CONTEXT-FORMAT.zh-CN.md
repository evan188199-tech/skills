[English](CONTEXT-FORMAT.md) · [简体中文](CONTEXT-FORMAT.zh-CN.md)

# CONTEXT.md Format

## Structure

```md
# {Context Name}

{一两句话描述这个 context 是什么、为什么存在。}

## Language

**Order**:
{对这个术语的一两句话描述}
_Avoid_: Purchase, transaction

**Invoice**:
交货后发给客户、要求付款的请求。
_Avoid_: Bill, payment request

**Customer**:
下订单的个人或组织。
_Avoid_: Client, buyer, account
```

## Rules

- **要有明确立场。** 当同一个概念存在多个词时，挑一个最好的，把其他的列在 `_Avoid_` 下面。
- **定义要精炼。** 最多一两句话。定义它*是*什么，而不是它*做*什么。
- **只收录这个项目 context 特有的术语。** 通用编程概念（超时、错误类型、工具型模式）不属于这里，即使项目大量使用它们也一样。加一个术语之前先问：这是这个 context 独有的概念，还是一个通用编程概念？只有前者才该收录。
- **自然形成分组时，用小标题把术语归类。** 如果所有术语都属于同一个内聚的领域，用一个扁平列表就够了。

## Single vs multi-context repos

**单一 context（大多数仓库）：** 仓库根目录一份 `CONTEXT.md`。

**多个 context：** 仓库根目录的 `CONTEXT-MAP.md` 列出各个 context、它们分别在哪里，以及彼此之间的关系：

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) —— 接收并追踪客户订单
- [Billing](./src/billing/CONTEXT.md) —— 生成 invoice、处理付款
- [Fulfillment](./src/fulfillment/CONTEXT.md) —— 管理仓库拣货和发货

## Relationships

- **Ordering → Fulfillment**：Ordering 发出 `OrderPlaced` 事件；Fulfillment 消费它们、开始拣货
- **Fulfillment → Billing**：Fulfillment 发出 `ShipmentDispatched` 事件；Billing 消费它们、生成 invoice
- **Ordering ↔ Billing**：共享 `CustomerId` 和 `Money` 类型
```

这个 skill 会自行推断适用哪种结构：

- 如果 `CONTEXT-MAP.md` 存在，读取它来找到各个 context
- 如果只有根目录的 `CONTEXT.md`，就是单一 context
- 如果两者都不存在，就在第一个术语被敲定时，按需创建根目录的 `CONTEXT.md`

当存在多个 context 时，推断当前话题和哪一个相关。如果不清楚，就问。
