[English](issue-tracker-local.md) · [简体中文](issue-tracker-local.zh-CN.md)

# Issue tracker: Local Markdown

这个仓库的 issues 和 specs 存放为 `.scratch/` 下的 markdown 文件。

## Conventions

- 一个 feature 一个目录：`.scratch/<feature-slug>/`
- Spec 是 `.scratch/<feature-slug>/spec.md`
- Implementation issues 是一个 ticket 一个文件，放在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 开始编号——绝不用单个合并的 tickets 文件
- Triage 状态记录在每个 issue 文件顶部附近的一行 `Status:` 里（各个角色对应的字符串见 `triage-labels.md`）
- 评论和对话历史追加在文件底部的 `## Comments` 标题下

## When a skill says "publish to the issue tracker"

在 `.scratch/<feature-slug>/` 下创建一个新文件（如果目录不存在就创建它）。

## When a skill says "fetch the relevant ticket"

读取对应路径的文件。用户通常会直接给出路径或 issue 编号。

## Wayfinding operations

供 `/wayfinder` 使用。**map** 是一个文件，每个 ticket 对应一个 **child** 文件。

- **Map**：`.scratch/<effort>/map.md`——正文是 Notes / Decisions-so-far / Fog。
- **Child ticket**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，问题写在正文里。一行 `Type:` 记录 ticket 类型（`research`/`prototype`/`grilling`/`task`）；一行 `Status:` 记录 `claimed`/`resolved`。
- **Blocking**：顶部附近一行 `Blocked by: NN, NN`。当它列出的每个文件都是 `resolved` 时，这个 ticket 就解除阻塞了。
- **Frontier**：扫描 `.scratch/<effort>/issues/`，找出未关闭、未被阻塞、且未被认领的文件；编号最小的胜出。
- **Claim**：在做任何工作之前，先把 `Status` 设为 `claimed` 并保存。
- **Resolve**：在一个 `## Answer` 标题下追加答案，把 `Status` 设为 `resolved`，然后把一个上下文指针（gist + 链接）追加到 `map.md` 里 map 的 Decisions-so-far 中。
