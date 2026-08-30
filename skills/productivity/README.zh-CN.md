[English](README.md) · [简体中文](README.zh-CN.md)

# Productivity

通用的工作流工具，不局限于代码场景。

## User-invoked

只能在你主动输入时被触发（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 里的 `policy.allow_implicit_invocation: false`）。

- **[grill-me](./grill-me/SKILL.md)** —— 就一个计划或设计被反复追问，直到设计树上的每个分支都有了结论。
- **[handoff](./handoff/SKILL.md)** —— 把当前对话压缩成一份交接文档，让另一个 agent 能接着做下去。
- **[teach](./teach/SKILL.md)** —— 用当前目录作为一个有状态的教学工作区，在多个 session 中教用户一个新技能或概念。
- **[to-questionnaire](./to-questionnaire/SKILL.md)** —— 把一个你一个人回答不了的决策，变成一份 Markdown 问卷，发给唯一能回答它的那个人——可以异步填写，也可以在会上一起过。
- **[wait-what](./wait-what/SKILL.md)** —— 在一条消息没说明白的那一刻立刻触发。Agent 会用你缺的那部分上下文，以大白话、并结合你 `CONTEXT.md` 里的词汇，重新讲一遍。

## Model-invoked

模型和用户都能触发（带有丰富的触发短语，方便模型主动使用）。

- **[grilling](./grilling/SKILL.md)** —— 就一个计划、决策或想法反复追问用户，直到设计树上的每个分支都有结论。
- **[writing-for-agents](./writing-for-agents/SKILL.md)** —— 编写给 agent 看的文档：skills、AGENTS.md/CLAUDE.md，以及任何 agent 通过指针访问到的文档。
