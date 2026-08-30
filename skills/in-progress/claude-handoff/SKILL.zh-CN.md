---
name: claude-handoff
description: 把当前对话交接给一个全新的后台 agent，让它立刻接手工作。
argument-hint: "下一个 session 会用来做什么？"
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

写一份当前对话的交接摘要，这样一个全新的 agent 就能接着做下去。不要保存它，而是启动一个后台 agent，以这份摘要作为它的 prompt：`claude --bg --name "<descriptive name>" "<handoff summary>"`。它会在当前工作目录启动，并立即返回；用户用 `claude agents` 来管理它。

始终传入 `-n`/`--name` 并给一个描述性的名字（例如 `--name "Fix login bug"`）——它会设置在任务列表、session 选择器和终端标题里显示的名称。

在这份摘要里包含一个"建议 skills"小节，建议 agent 应该调用哪些 skills。

不要重复其他 artifacts（specs、plans、ADRs、issues、commits、diffs）里已经记录过的内容。改为通过路径或 URL 引用它们。

脱敏任何敏感信息，比如 API keys、密码，或个人身份信息——这份摘要会变成这个 agent 的 prompt。

如果用户传入了参数，把它们当作对下一个 session 关注点的描述，并据此调整这份摘要。
