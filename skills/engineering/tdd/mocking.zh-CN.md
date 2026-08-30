[English](mocking.md) · [简体中文](mocking.zh-CN.md)

# When to Mock

只在**系统边界**处 mock：

- 外部 API（支付、邮件等）
- 数据库（有时候——优先用测试数据库）
- 时间/随机性
- 文件系统（有时候）

不要 mock：

- 你自己的 classes/modules
- 内部协作对象
- 任何你能掌控的东西

## Designing for Mockability

在系统边界处，设计易于 mock 的接口：

**1. 使用依赖注入**

把外部依赖作为参数传进来，而不是在内部创建它们：

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 优先用 SDK 风格的接口，而不是通用的 fetcher**

为每个外部操作创建专门的函数，而不是用一个带条件逻辑的通用函数：

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 风格的做法意味着：

- 每个 mock 只返回一种具体的形状
- 测试搭建过程里没有条件逻辑
- 更容易看出一个测试实际用到了哪些 endpoints
- 每个 endpoint 都有各自的类型安全
