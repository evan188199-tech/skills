---
name: scaffold-exercises
description: 创建带有 sections、problems、solutions 和 explainers、且能通过 lint 的练习目录结构。当用户想搭建练习脚手架、创建练习 stub，或者设置一个新的课程 section 时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Scaffold Exercises

创建能通过 `pnpm ai-hero-cli internal lint` 的练习目录结构，然后用 `git commit` 提交。

## Directory naming

- **Sections**：`exercises/` 下的 `XX-section-name/`（例如 `01-retrieval-skill-building`）
- **Exercises**：一个 section 里的 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）
- Section 编号是 `XX`，exercise 编号是 `XX.YY`
- 名字用 dash-case（小写，连字符）

## Exercise variants

每个 exercise 至少需要以下子文件夹之一：

- `problem/` —— 带 TODO 的学生工作区
- `solution/` —— 参考实现
- `explainer/` —— 概念性材料，不带 TODO

做 stub 时，除非计划里另有说明，默认用 `explainer/`。

## Required files

每个子文件夹（`problem/`、`solution/`、`explainer/`）都需要一个 `readme.md`，要求：

- **不为空**（必须有实质内容，哪怕只有一行标题也行）
- 没有失效链接

做 stub 时，创建一个只带标题和描述的最小 readme：

```md
# Exercise Title

Description here
```

如果这个子文件夹有代码，它还需要一个 `main.ts`（超过 1 行）。但对于 stub 来说，一个只有 readme 的 exercise 也没问题。

## Workflow

1. **Parse the plan** —— 提取 section 名称、exercise 名称，以及 variant 类型
2. **Create directories** —— 为每个路径 `mkdir -p`
3. **Create stub readmes** —— 每个 variant 文件夹一个带标题的 `readme.md`
4. **Run lint** —— `pnpm ai-hero-cli internal lint` 来验证
5. **Fix any errors** —— 反复迭代，直到 lint 通过

## Lint rules summary

这个 linter（`pnpm ai-hero-cli internal lint`）会检查：

- 每个 exercise 都有子文件夹（`problem/`、`solution/`、`explainer/`）
- `problem/`、`explainer/` 或 `explainer.1/` 中至少存在一个
- 主子文件夹里存在非空的 `readme.md`
- 没有 `.gitkeep` 文件
- 没有 `speaker-notes.md` 文件
- readme 里没有失效链接
- readme 里没有 `pnpm run exercise` 命令
- 除非是只有 readme 的情况，否则每个子文件夹都要有 `main.ts`

## Moving/renaming exercises

重新编号或移动 exercises 时：

1. 用 `git mv`（不是 `mv`）来重命名目录——保留 git 历史
2. 更新数字前缀以维持顺序
3. 移动后重新跑一次 lint

示例：

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## Example: stubbing from a plan

给定一份像这样的计划：

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

创建：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme stubs：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
