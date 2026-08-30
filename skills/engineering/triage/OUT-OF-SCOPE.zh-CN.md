[English](OUT-OF-SCOPE.md) · [简体中文](OUT-OF-SCOPE.zh-CN.md)

# Out-of-Scope Knowledge Base

仓库里的 `.out-of-scope/` 目录存放着被否决的 feature 请求的持久化记录。它有两个作用：

1. **机构记忆（Institutional memory）** —— 记录一个功能为什么被否决，这样当这个 issue 被关闭之后，这份推理过程也不会丢失
2. **去重（Deduplication）** —— 当一个新 issue 进来、匹配上一个之前被否决过的请求时，这个 skill 能把之前的决定亮出来，而不是重新吵一遍

## Directory structure

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

一个**概念**一个文件，而不是一个 issue 一个文件。多个请求同一件事的 issues 会被归到同一个文件下。

## File format

这个文件应该用一种轻松、易读的风格来写——更像一份简短的设计文档，而不是一条数据库记录。用段落、代码示例和例子，让推理过程对第一次看到它的人来说也清晰、有用。

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
- #134 — "Dark theme option"
```

### Naming the file

给这个概念起一个简短、描述性的 kebab-case 名字：`dark-mode.md`、`plugin-system.md`、`graphql-api.md`。这个名字要有辨识度，让浏览这个目录的人不用打开文件就能明白什么被否决了。

### Writing the reason

理由应该是实质性的——不是"我们不想要这个"，而是说明为什么。好的理由会引用：

- 项目范围或理念（"This project focuses on X; theming is a downstream concern"）
- 技术约束（"Supporting this would require Y, which conflicts with our Z architecture"）
- 战略决策（"We chose to use A instead of B because..."）

这个理由应该是持久有效的。避免引用临时性的情况（"we're too busy right now"）——那些不是真正的否决，只是推迟。

## When to check `.out-of-scope/`

在 triage 过程中（第 1 步：Gather context），读 `.out-of-scope/` 里的所有文件。评估一个新 issue 时：

- 检查这个请求是否匹配一个已有的 out-of-scope 概念
- 匹配靠的是概念相似度，不是关键词——"night theme" 能匹配上 `dark-mode.md`
- 如果匹配上了，把它亮给维护者看："This is similar to `.out-of-scope/dark-mode.md` — we rejected this before because [reason]. Do you still feel the same way?"

维护者可能会：

- **确认** —— 这个新 issue 被加进已有文件的 "Prior requests" 列表，然后关闭
- **重新考虑** —— 这个 out-of-scope 文件被删除或更新，这个 issue 走正常的 triage 流程
- **不同意** —— 这些 issues 相关但不是一回事，走正常的 triage 流程

## When to write to `.out-of-scope/`

只有当一个 **enhancement**（不是 bug）被*否决*为 `wontfix` 时才写。这条规则对 enhancement 类型的 PR 和对 issue 一视同仁——一个被否决的 PR 也会被记录在这里，这样同样的请求就不会又以新代码的形式回来。

当某个东西因为**已经实现了**而被关闭为 `wontfix` 时，**不要**写在这里。那是一个已经建成的功能，不是一个被否决的功能；把它记录进去会用错误的否决记录污染去重检查。取而代之，关闭时的评论应该指向这个功能已经在哪里实现了。

流程：

1. 维护者决定一个 feature 请求超出范围
2. 检查是否已经存在一个匹配的 `.out-of-scope/` 文件
3. 如果有：把这个新 issue 追加到 "Prior requests" 列表
4. 如果没有：创建一个新文件，写上概念名、决定、理由，以及第一个请求
5. 在这个 issue 上发一条评论，解释这个决定，并提到 `.out-of-scope/` 文件
6. 用 `wontfix` label 关闭这个 issue

## Updating or removing out-of-scope files

如果维护者对一个之前被否决的概念改变了主意：

- 删除这个 `.out-of-scope/` 文件
- 这个 skill 不需要重新打开旧的 issues——它们是历史记录
- 触发这次重新考虑的那个新 issue，走正常的 triage 流程
