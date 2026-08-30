[English](issue-tracker-github.md) · [简体中文](issue-tracker-github.zh-CN.md)

# Issue tracker: GitHub

这个仓库的 issues 和 specs 存放为 GitHub issues。所有操作都用 `gh` CLI。

## Conventions

- **创建一个 issue**：`gh issue create --title "..." --body "..."`。多行正文用 heredoc。
- **读取一个 issue**：`gh issue view <number> --comments`，用 `jq` 过滤评论，同时获取 labels。
- **列出 issues**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，配合合适的 `--label` 和 `--state` 过滤条件。
- **在一个 issue 上评论**：`gh issue comment <number> --body "..."`
- **添加 / 移除 labels**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：`gh issue close <number> --comment "..."`

从 `git remote -v` 推断仓库——在一个 clone 内部运行时，`gh` 会自动做这件事。

## Pull requests as a triage surface

**把 PR 作为一个 request surface：否。** _（如果这个仓库把外部 PR 当作 feature requests 来对待，就设成 `yes`；`/triage` 会读取这个开关。）_

设为 `yes` 时，PR 会走和 issues 一样的 labels 和状态，使用对应的 `gh pr` 命令：

- **读取一个 PR**：`gh pr view <number> --comments`，`gh pr diff <number>` 看 diff。
- **列出用于 triage 的外部 PR**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，然后只保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的（去掉 `OWNER`/`MEMBER`/`COLLABORATOR`）。
- **评论 / 打标签 / 关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 让 issues 和 PR 共用一个编号空间，所以一个裸的 `#42` 可能是任何一种——用 `gh pr view 42` 解析，解析不到再退回 `gh issue view 42`。

## When a skill says "publish to the issue tracker"

创建一个 GitHub issue。

## When a skill says "fetch the relevant ticket"

运行 `gh issue view <number> --comments`。

## Wayfinding operations

供 `/wayfinder` 使用。**map** 是一个 issue，它的 **child** issues 就是各个 tickets。

- **Map**：一个打了 `wayfinder:map` label 的 issue，正文是 Notes / Decisions-so-far / Fog。`gh issue create --label wayfinder:map`。
- **Child ticket**：一个作为 GitHub sub-issue 链接到 map 上的 issue（在 sub-issues 端点上用 `gh api`）。如果没启用 sub-issues，就把这个 child 加进 map 正文里的一个任务列表，并在 child 正文顶部写上 `Part of #<map>`。Labels：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。一旦被认领，这个 ticket 就会被分配给驱动这项工作的开发者。
- **Blocking**：GitHub 的**原生 issue dependencies**——规范的、在 UI 上可见的表示方式。用 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加一条依赖边，其中 `<blocker-db-id>` 是阻塞方的数字型**数据库 id**（用 `gh api repos/<owner>/<repo>/issues/<n> --jq .id` 获取，*不是* `#number` 也不是 `node_id`）。GitHub 会在 `issue_dependencies_summary.blocked_by` 里报告（只统计未关闭的阻塞项——这是实时的门槛）。如果 dependencies 功能不可用，退回到在 child 正文顶部写一行 `Blocked by: #<n>, #<n>`。当每一个阻塞方都被关闭时，这个 ticket 就解除阻塞了。
- **Frontier query**：列出 map 尚未关闭的 children（`gh issue list --state open`，限定在 map 的 sub-issues / 任务列表范围内），去掉任何有未关闭阻塞方的（`issue_dependencies_summary.blocked_by > 0`，或者 `Blocked by` 那一行里有未关闭的 issue）或者已经有 assignee 的；按 map 中的顺序，排在最前面的胜出。
- **Claim**：`gh issue edit <n> --add-assignee @me`——这个 session 的第一次写入。
- **Resolve**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再把一个上下文指针（gist + 链接）追加到 map 的 Decisions-so-far 里。
