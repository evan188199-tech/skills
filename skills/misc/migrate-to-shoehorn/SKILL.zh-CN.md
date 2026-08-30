---
name: migrate-to-shoehorn
description: 把测试文件里的 `as` 类型断言迁移到 @total-typescript/shoehorn。当用户提到 shoehorn、想替换测试里的 `as`，或需要部分测试数据时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Migrate to Shoehorn

## Why shoehorn?

`shoehorn` 让你能在测试里传入部分数据，同时不惹恼 TypeScript。它用类型安全的替代方案取代 `as` 断言。

**只用在测试代码里。** 绝不要在生产代码里用 shoehorn。

测试里用 `as` 的问题：

- 训练出不用它的习惯很难
- 必须手动指定目标类型
- 对于故意错误的数据要双重 as（`as unknown as Type`）

## Install

```bash
npm i @total-typescript/shoehorn
```

## Migration patterns

### Large objects with few needed properties

改前：

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...20 more properties
};

it("gets user by id", () => {
  // Only care about body.id but must fake entire Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...fake all 20 properties
  });
});
```

改后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

改前：

```ts
getUser({ body: { id: "123" } } as Request);
```

改后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

改前：

```ts
getUser({ body: { id: 123 } } as unknown as Request); // wrong type on purpose
```

改后：

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## When to use each

| Function        | 使用场景                                    |
| --------------- | -------------------------------------------- |
| `fromPartial()` | 传入依然能通过类型检查的部分数据               |
| `fromAny()`     | 传入故意错误的数据（保留自动补全）              |
| `fromExact()`   | 强制要求完整对象（以后可以换成 fromPartial）    |

## Workflow

1. **Gather requirements** —— 问用户：
   - 哪些测试文件里有引发问题的 `as` 断言？
   - 他们是不是在处理只有部分属性重要的大对象？
   - 他们是否需要为错误测试传入故意错误的数据？

2. **Install and migrate**：
   - [ ] 安装：`npm i @total-typescript/shoehorn`
   - [ ] 找出带 `as` 断言的测试文件：`grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] 把 `as Type` 替换成 `fromPartial()`
   - [ ] 把 `as unknown as Type` 替换成 `fromAny()`
   - [ ] 添加来自 `@total-typescript/shoehorn` 的 imports
   - [ ] 跑类型检查确认无误
