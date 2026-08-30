[English](issue-tracker-gitlab.md) · [简体中文](issue-tracker-gitlab.zh-CN.md)

# Issue tracker: GitLab

这个仓库的 issues 和 specs 存放为 GitLab issues。所有操作都用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI。

## Conventions

- **创建一个 issue**：`glab issue create --title "..." --description "..."`。多行描述用 heredoc。传 `--description -` 会打开一个编辑器。
- **读取一个 issue**：`glab issue view <number> --comments`。要机器可读的输出用 `-F json`。
- **列出 issues**：`glab issue list -F json`，配合合适的 `--label` 过滤条件。
- **在一个 issue 上评论**：`glab issue note <number> --message "..."`。GitLab 把评论叫做 "notes"。
- **添加 / 移除 labels**：`glab issue update <number> --label "..."` / `--unlabel "..."`。多个 labels 可以用逗号分隔，或者重复这个 flag。
- **关闭**：`glab issue close <number>`。`glab issue close` 不接受关闭时的评论，所以要先用 `glab issue note <number> --message "..."` 发一条说明，再关闭。
- **Merge requests**：GitLab 把 PR 叫做 "merge requests"。用 `glab mr create`、`glab mr view`、`glab mr note` 等——形态和 `gh pr ...` 一样，只是把 `pr` 换成 `mr`，把 `comment`/`--body` 换成 `note`/`--message`。

从 `git remote -v` 推断仓库——在一个 clone 内部运行时，`glab` 会自动做这件事。

## Merge requests as a triage surface

**把 MR 作为一个 request surface：否。** _（如果这个仓库把外部 merge requests 当作 feature requests 来对待，就设成 `yes`；`/triage` 会读取这个开关。）_

设为 `yes` 时，MR 会走和 issues 一样的 labels 和状态，使用对应的 `glab mr` 命令：

- **读取一个 MR**：`glab mr view <number> --comments`，`glab mr diff <number>` 看 diff。
- **列出用于 triage 的外部 MR**：`glab mr list -F json`，然后只保留作者不是项目成员/owner 的那些（是贡献者的 MR，不是维护者进行中的工作）。
- **评论 / 打标签 / 关闭**：`glab mr note`、`glab mr update --label`/`--unlabel`、`glab mr close`。

和 GitHub 不同，GitLab 对 issues 和 MR 分开编号，所以一旦你知道维护者指的是哪个 surface，`#42` 就没有歧义。

## When a skill says "publish to the issue tracker"

创建一个 GitLab issue。

## When a skill says "fetch the relevant ticket"

运行 `glab issue view <number> --comments`。

## Wayfinding operations

供 `/wayfinder` 使用。**map** 是一个 issue，它的 **child** issues 就是各个 tickets。

- **Map**：一个打了 `wayfinder:map` label 的 issue，正文是 Notes / Decisions-so-far / Fog。`glab issue create --label wayfinder:map`。（在支持原生 epics 的 GitLab tier 上，也可以用一个 epic 来承载这个 map；一个打了 label 的 issue 在任何 tier 上都能用。）
- **Child ticket**：一个描述顶部写着 `Part of #<map>`、并打上 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）label 的 issue。一旦被认领，这个 ticket 就会被分配给驱动这项工作的开发者。
- **Blocking**：GitLab 的**原生阻塞链接**——规范的、在 UI 上可见的表示方式。用 `/blocked_by #<n>` quick action、以一条 note 的形式添加（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接是 Premium/Ultimate 的功能；在免费 tier（或者不可用时），退回到在描述顶部写一行 `Blocked by: #<n>, #<n>`。当每一个阻塞方都被关闭时，这个 ticket 就解除阻塞了。
- **Frontier query**：`glab issue list -F json`，限定在 map 的 children 范围内，去掉任何有未关闭阻塞方的——一个指向未关闭 issue 的原生 `blocked_by` 链接（`glab api projects/:id/issues/:iid/links`），或者 `Blocked by` 那一行里有未关闭的 issue——或者已经有 assignee 的；按 map 中的顺序，排在最前面的胜出。
- **Claim**：`glab issue update <n> --assignee @me`——这个 session 的第一次写入。
- **Resolve**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，再把一个上下文指针（gist + 链接）追加到 map 的 Decisions-so-far 里。
