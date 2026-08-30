[English](MISSION-FORMAT.md) · [简体中文](MISSION-FORMAT.zh-CN.md)

# MISSION.md Format

`MISSION.md` 位于工作区根目录。它记录用户学习这个主题的*原因*。每一个教学决策——接下来教什么、展示哪些资源、设计什么练习——都应该能追溯回这份文档。

## Template

```md
# Mission: {Topic}

## Why
{1-3 sentences. The concrete real-world goal the user is chasing. What changes in their life or work when they have this skill? Avoid abstract framings like "to understand X" — push for the underlying outcome.}

## Success looks like
- {A specific, observable thing the user will be able to do}
- {Another specific thing}
- {…}

## Constraints
- {Time, budget, prior commitments, learning preferences, anything that bounds the approach}

## Out of scope
- {Adjacent topics the user explicitly does not want to chase right now — protects the zone of proximal development}
```

## Rules

- **一个工作区一个 mission。** 如果用户想学两件不相关的事，那就是两个工作区。
- **具体胜过抽象。** "十月前跑完一次半马"胜过"变得更健康"。"给团队交付一个 Rust CLI"胜过"学 Rust"。
- **对模糊表述要追问。** 如果用户说不清楚为什么，先采访他们，再动笔写任何东西。一个糟糕的 mission 比没有 mission 更糟。
- **随着现实变化而修订。** Mission 是会变的。当用户的目标变了，更新这份文件——不要让一个过时的 mission 继续指导未来的 session。
- **保持简短。** 如果 `MISSION.md` 超过一屏，它就已经不再是一个指南针，而变成了一份计划。
