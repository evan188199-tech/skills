---
name: setup-matt-pocock-skills
description: 为这套 engineering skills 配置本仓库——设置它的 issue tracker、triage label 词汇，以及领域文档布局。在第一次使用其他 engineering skills 之前运行一次。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Setup Matt Pocock's Skills

搭建 engineering skills 所假定的按仓库配置：

- **Issue tracker** —— issues 存放在哪里（默认 GitHub；开箱即用也支持 local markdown）
- **Triage labels** —— 五个规范 triage roles 各自使用的字符串
- **Domain docs** —— `CONTEXT.md` 和 ADR 存放在哪里，以及读取它们的消费规则

这是一个由 prompt 驱动的 skill，不是一个确定性脚本。先探索，展示你找到的东西，和用户确认，然后再写入。

## Process

### 1. Explore

查看当前仓库，了解它的起始状态。读取实际存在的东西；不要假设：

- `git remote -v` 和 `.git/config` —— 这是一个 GitHub 仓库吗？是哪一个？
- 仓库根目录的 `AGENTS.md` 和 `CLAUDE.md` —— 它们中有哪个存在吗？其中是否已经有一个 `## Agent skills` 小节？
- 仓库根目录的 `CONTEXT.md` 和 `CONTEXT-MAP.md`
- `docs/adr/` 以及任何 `src/*/docs/adr/` 目录
- `docs/agents/` —— 这个 skill 之前的输出是不是已经存在了？
- `.scratch/` —— 表明已经在使用一套 local-markdown issue tracker 约定的迹象
- `triage` skill 是否已安装？（这个目录旁边有没有一个 `triage` skill 文件夹，或者你可用的 skills 里有没有 `triage`。）这决定了 Section B 要不要运行。
- Monorepo 信号——一个 `pnpm-workspace.yaml`、`package.json` 里的 `workspaces` 字段，或者一个带有自己 `src/` 的、已填充的 `packages/*`。只在真正大型的多包仓库里才会出现；它们不存在就意味着单一 context，这也是绝大多数仓库的情况。

### 2. Present findings and ask

总结哪些已经存在、哪些还缺失。然后按顺序处理各个小节——一节问一个答案，再进入下一节。

每一节开头都给出推荐答案，这样用户一个字就能接受。只有当这个选择确实存在分支时，才给一句话的解释；如果探索阶段已经能确定答案（`triage` 未安装时的 Section B、没有 monorepo 时的 Section C），就整节跳过。

**Section A —— Issue tracker。**

> 解释：这个仓库的 "issue tracker" 是 issues 存放的地方。像 `to-tickets`、`triage`、`to-spec` 这样的 skills 会从它读取、也会写入它——它们需要知道该调用 `gh issue create`，还是在 `.scratch/` 下写一个 markdown 文件，还是遵循你描述的其他某种流程。选一个你实际用来追踪这个仓库工作的地方。

默认立场：这些 skills 是为 GitHub 设计的。如果某个 `git remote` 指向 GitHub，就建议用它。如果某个 `git remote` 指向 GitLab（`gitlab.com` 或自建的 host），就建议用 GitLab。否则（或者用户更想要别的），提供这些选项：

- **GitHub** —— issues 存放在这个仓库的 GitHub Issues 里（使用 `gh` CLI）
- **GitLab** —— issues 存放在这个仓库的 GitLab Issues 里（使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **Local markdown** —— issues 以文件形式存放在这个仓库的 `.scratch/<feature>/` 下（适合单人项目或没有 remote 的仓库）
- **Other**（Jira、Linear 等）—— 让用户用一段话描述这个流程；这个 skill 会把它记录成自由格式的文字

把这个选择记录进 `docs/agents/issue-tracker.md`。GitHub 和 GitLab 的模板都带有一个 "PRs as a request surface" 开关，默认**关闭**——保持关闭状态，不要主动提起它；想把外部 PR 纳入 triage 队列的用户可以之后自己在文件里把这个开关打开。

**Section B —— Triage label 词汇。** 如果探索阶段发现 `triage` skill 没有安装，就整节跳过——一个没安装的 skill 不需要 labels。

如果它已安装，只问这一个问题：

> 你想保留默认的 triage labels 吗？（推荐：**是**）

默认值是五个规范角色，每个 label 字符串都和它的名字相同：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。如果回答**是**，就原样写入。只有当用户回答否时——通常是因为他们的 tracker 已经在用别的名字（例如用 `bug:triage` 代替 `needs-triage`）——才收集这些覆盖值，这样 `triage` 才会应用已有的 labels，而不是创建重复的。

**Section C —— Domain docs。** 默认使用**单一 context**——仓库根目录一份 `CONTEXT.md` + `docs/adr/`。这适合几乎所有仓库；不用问，直接写。

只有当探索阶段发现了 monorepo 信号时，才提供**多 context** 选项——一份指向各个 context 各自 `CONTEXT.md` 文件的根目录 `CONTEXT-MAP.md`。然后确认他们想要哪种布局。

### 3. Confirm and edit

给用户展示以下内容的草稿：

- 要加进 `CLAUDE.md` / `AGENTS.md`（哪一个由第 4 步的规则决定）里的 `## Agent skills` 代码块
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md` 和 `docs/agents/triage-labels.md` 的内容（最后一个只在 `triage` 已安装时才有）

让他们在写入之前可以先编辑。

### 4. Write

**选择要编辑的文件：**

- 如果 `CLAUDE.md` 存在，编辑它。
- 否则如果 `AGENTS.md` 存在，编辑它。
- 如果两者都不存在，问用户想创建哪一个——不要替他们做这个决定。

当 `CLAUDE.md` 已经存在时绝不要创建 `AGENTS.md`（反之亦然）——始终编辑已经存在的那一个。

如果选中的文件里已经有一个 `## Agent skills` 代码块，就原地更新它的内容，而不是追加一份重复的。不要覆盖用户对周边章节做过的编辑。

这个代码块：

```markdown
## Agent skills

### Issue tracker

[一行摘要，说明 issues 追踪在哪里]。见 `docs/agents/issue-tracker.md`。

### Triage labels

[一行摘要，说明 label 词汇]。见 `docs/agents/triage-labels.md`。

### Domain docs

[一行摘要，说明布局——"single-context" 还是 "multi-context"]。见 `docs/agents/domain.md`。
```

只有当 `triage` 已安装、Section B 也运行过时，才包含 `### Triage labels` 这个子代码块，并写入 `docs/agents/triage-labels.md`。如果没有，两者都省略。

然后以这个 skill 文件夹里的种子模板为起点，写入各个 docs 文件：

- [issue-tracker-github.md](./issue-tracker-github.md) —— GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) —— GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) —— local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) —— label 映射（仅当 `triage` 已安装时）
- [domain.md](./domain.md) —— domain doc 的消费规则 + 布局

对于 "other" 类型的 issue tracker，根据用户的描述从零开始写 `docs/agents/issue-tracker.md`。

### 5. Done

告诉用户 setup 已经完成，以及现在有哪些 engineering skills 会读取这些文件。提醒他们之后可以直接编辑 `docs/agents/*.md`；只有当他们想切换 issue tracker，或者想从头重新开始时，才需要重新运行这个 skill。
