[English](README.md) · [简体中文](README.zh-CN.md)

# Engineering

我日常做代码工作时用的 skills。

## User-invoked

只能在你主动输入时被触发（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 里的 `policy.allow_implicit_invocation: false`）。

- **[ask-matt](./ask-matt/SKILL.md)** —— 询问哪个 skill 或流程适合你当前的情况。本仓库中 user-invoked skills 的 router。
- **[grill-with-docs](./grill-with-docs/SKILL.md)** —— 一次 grilling session，同时会构建你项目的领域模型，打磨术语，并就地更新 `CONTEXT.md` 和 ADR。
- **[triage](./triage/SKILL.md)** —— 让 issues 在一套 triage roles 的状态机中流转。
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)** —— 扫描代码库找出可以做深的机会，以可视化 HTML 报告呈现，然后针对你挑选的那一项做一次 grilling。
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md)** —— 为这套 engineering skills 配置本仓库（issue tracker、triage labels、领域文档布局）。每个仓库运行一次。
- **[to-spec](./to-spec/SKILL.md)** —— 把当前对话变成一份 spec 并发布到 issue tracker。
- **[to-tickets](./to-tickets/SKILL.md)** —— 把任意 plan、spec 或对话拆成一组 tracer-bullet tickets，每个都声明自己的阻塞关系——本地文件里是文本，真实 tracker 上是原生阻塞链接。
- **[implement](./implement/SKILL.md)** —— 构建 spec 或一组 tickets 描述的工作，在预先约定的 seam 处驱动 `/tdd`，并在提交前用 `/code-review` 收尾。
- **[wayfinder](./wayfinder/SKILL.md)** —— 规划一大块超出单次 agent session 容量的工作，把它变成 issue tracker 上一张共享的 decision ticket 地图，逐个解决，直到通往目的地的路径清晰。

## Model-invoked

模型和用户都能触发（带有丰富的触发短语，方便模型主动使用）。

- **[prototype](./prototype/SKILL.md)** —— 构建一个一次性 prototype 来回答一个设计问题：针对 state/logic 用单个可分享的 HTML 文件，针对 UI 探索用几种可切换的变体。

- **[diagnosing-bugs](./diagnosing-bugs/SKILL.md)** —— 面向疑难 bug 和性能回退的有纪律诊断循环：搭建一个针对这个 bug 会变红的反馈循环 → 最小化 → 提出假设 → 埋点 → 修复 → 回归测试。
- **[research](./research/SKILL.md)** —— 针对高可信一手来源调查一个问题，并把调查结果以带引用的 Markdown 文件形式保存进仓库，作为后台 agent 运行。
- **[tdd](./tdd/SKILL.md)** —— 采用 red-green-refactor 循环的测试驱动开发。每次只构建一个功能或修复一个 bug 的一条垂直切片。
- **[domain-modeling](./domain-modeling/SKILL.md)** —— 主动构建并打磨一个项目的领域模型——挑战术语，用场景做压力测试，就地更新 `CONTEXT.md` 和 ADR。
- **[codebase-design](./codebase-design/SKILL.md)** —— 设计 deep modules 的共享纪律与词汇：小接口、干净的 seam，能通过接口被测试。
- **[code-review](./code-review/SKILL.md)** —— 对固定起点以来的 diff 做双轴审查：**Standards**（是否符合仓库的编码规范，外加一套 Fowler smell 基线？）和 **Spec**（是否忠实实现了对应的 issue/spec？），以并行 sub-agents 运行。
- **[resolving-merge-conflicts](./resolving-merge-conflicts/SKILL.md)** —— 逐个 hunk 处理一次进行中的 git merge 或 rebase 冲突，依据追溯到双方主源头的意图来解决，然后完成这次操作——绝不 `--abort`。
- **[wizard](./wizard/SKILL.md)** —— 生成一个交互式 bash 向导，带领人类完成只有他们才能执行的步骤：置备基础设施、配置凭证或 CI secrets、走一遍陌生的第三方 dashboard，或执行一次一次性迁移或切换。
