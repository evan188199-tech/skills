[English](domain.md) · [简体中文](domain.zh-CN.md)

# Domain Docs

在探索代码库时，engineering skills 应该如何消费这个仓库的领域文档。

## Before exploring, read these

- 仓库根目录的 **`CONTEXT.md`**，或者
- 如果存在，仓库根目录的 **`CONTEXT-MAP.md`**——它会指向每个 context 各自的 `CONTEXT.md`。读取每一份和当前主题相关的文件。
- **`docs/adr/`** —— 阅读涉及你即将工作区域的 ADR。在多 context 仓库里，还要检查 `src/<context>/docs/adr/` 里 context 范围内的决策。

如果这些文件都不存在，**默默继续即可**。不要指出它们不存在，也不要主动建议先创建它们。`/domain-modeling` skill（通过 `/grill-with-docs` 和 `/improve-codebase-architecture` 到达）会在术语或决策真正被敲定时,按需惰性创建它们。

## File structure

单一 context 仓库（大多数仓库）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多 context 仓库（根目录存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 系统级决策
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context 专属决策
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

当你的输出提到一个领域概念时（在一个 issue 标题、一份重构提案、一个假设、一个测试名字里），使用 `CONTEXT.md` 里定义的术语。不要漂移到词汇表明确要求避免的同义词上。

如果你需要的概念还不在词汇表里，这是一个信号——要么你在发明这个项目不用的语言（重新考虑一下），要么确实存在一个空缺（把它记下来，留给 `/domain-modeling`）。

## Flag ADR conflicts

如果你的输出和一份现有 ADR 冲突，明确把它摆出来，而不是悄悄地覆盖过去：

> _与 ADR-0007（event-sourced orders）冲突——但值得重新讨论，因为……_
