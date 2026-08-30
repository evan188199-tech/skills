---
name: handoff
description: 把当前对话压缩成一份交接文档，供另一个 agent 接手。
argument-hint: "下一个 session 会用来做什么？"
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

写一份交接文档，总结当前对话，这样一个全新的 agent 就能接着做下去。保存到用户操作系统的临时目录——不是当前工作区。

在文档里包含一个"建议 skills"小节，建议 agent 应该调用哪些 skills。

不要重复其他 artifacts（specs、plans、ADRs、issues、commits、diffs）里已经记录过的内容。改为通过路径或 URL 引用它们。

脱敏任何敏感信息，比如 API keys、密码，或个人身份信息。

如果用户传入了参数，把它们当作对下一个 session 关注点的描述，并据此调整这份文档。
