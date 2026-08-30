---
name: resolving-merge-conflicts
description: "当你需要解决一次进行中的 git merge/rebase 冲突时使用。"
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

1. **查看当前状态**：这次 merge/rebase 的状态、git 历史，以及冲突的文件。

2. **为每个冲突找到主源头。** 深入理解每一处改动为什么会存在、原始意图是什么。读 commit messages，查看 PR，查看原始的 issues/tickets。

3. **逐个 hunk 解决。** 尽可能保留双方的意图。当两者不兼容时，选择符合这次 merge 既定目标的那一个，并记下这个取舍。**不要**凭空发明新行为。始终要解决冲突；绝不 `--abort`。

4. 找出项目的**自动化检查**并运行它们——通常是先跑类型检查，再跑测试，再跑格式化。修复 merge 过程中破坏的一切。

5. **完成这次 merge/rebase。** Stage 所有改动并提交。如果是 rebase，就继续这个 rebase 过程，直到所有 commit 都完成 rebase。
