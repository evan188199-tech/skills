---
name: tdd
description: 测试驱动开发。当用户想用先写测试的方式构建功能或修复 bug、提到 "red-green-refactor"，或者需要 integration tests 时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Test-Driven Development

TDD 就是 red → green 循环。这个 skill 是让那个循环产出值得保留的测试的参考资料：什么是好测试、测试放在哪里、有哪些反模式，以及这个循环的规则。每一节都适用于每一轮循环——在循环之前和过程中都要参考它们，而不是事后才看。

在探索代码库时，读取 `CONTEXT.md`（如果存在），让测试名称和接口词汇与项目的领域语言保持一致，并尊重你所触碰区域里的 ADR。

## What a good test is

测试应该通过公开接口验证行为，而不是验证实现细节。代码可以整个改掉；测试不应该跟着变。一个好测试读起来像一份规格说明——"user can checkout with valid cart" 精确地告诉你存在什么能力——而且因为它不关心内部结构，所以能挺过重构。

示例见 [tests.md](tests.md)，mocking 相关指引见 [mocking.md](mocking.md)。

## Seams — where tests go

**Seam** 是你测试所在的公开边界：一个能观察到行为、又不用伸手进内部的接口。测试应该活在 seam 上，绝不针对内部实现。

**只在预先约定好的 seam 上测试。** 在写任何测试之前，先写下要测试的 seam 有哪些，并和用户确认。任何未经确认的 seam 上都不写测试。你没办法测试所有东西——提前就 seam 达成一致，才能让测试的精力落在关键路径和复杂逻辑上，而不是每一个边界情况。

问："公开接口是什么，我们应该测试哪些 seam？"

当这个接口本身的形状还有疑问时——这个模块该有多 deep、seam 该放在哪里、接口该暴露什么——用 `/codebase-design` skill 获取相关词汇。它是 module、interface、depth、seam、adapter、leverage 和 locality 这些术语的共同来源，是一份用来查阅的参考资料，而不是一次要运行的 session。

## Anti-patterns

- **Implementation-coupled** —— mock 内部协作对象、测试私有方法，或者通过一个旁路来验证（直接查数据库而不是走接口）。识别标志：重构时测试挂了，但行为其实没变。
- **Tautological** —— 断言用代码计算它的同一种方式重新计算了一遍期望值（`expect(add(a, b)).toBe(a + b)`、手工按同样逻辑推导出的 snapshot、断言一个常量等于它自己），所以它天生就会通过，永远不可能和代码产生分歧。期望值必须来自一个独立的、真实可信的来源——一个已知正确的字面量、一个具体算出来的例子，或者 spec。
- **Horizontal slicing** —— 先写完所有测试，再写所有实现。批量写出来的测试验证的是*想象中*的行为：你测的是事物的*形状*，而不是面向用户的行为，这些测试对真实的变化不敏感，而且你在理解实现之前就已经把测试结构定死了。改用**垂直切片**——一个测试 → 一份实现 → 重复，每个测试都是回应上一轮循环学到的东西的一颗**tracer bullet**。

## Rules of the loop

- **先红后绿。** 先写失败的测试，再写刚好能让它通过的代码。不要预判未来的测试，也不要添加投机性的功能。
- **一次一片。** 每轮循环只处理一个 seam、一个测试、一份最小实现。
- **重构不属于这个循环。** 它属于 review 阶段（见 `code-review` skill），不属于 red → green 的实现循环。
