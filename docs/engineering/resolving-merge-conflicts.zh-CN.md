[English](resolving-merge-conflicts.md) · [简体中文](resolving-merge-conflicts.zh-CN.md)

## What it does

`resolving-merge-conflicts` 逐个 hunk 处理一次进行中的 git merge 或 rebase,然后跑项目自己的检查,以一次 commit 完成这次操作。

它拒绝把一次冲突当作一个文本问题来处理。在碰任何一个 hunk 之前,它会先把双方追溯回各自的 **[primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)**——commit message、PR、原始 issue——这样它是在两个意图之间做选择,而不是在两段文本之间做选择,并在双方兼容的地方都保留下来。当它们确实不兼容时,它会选择符合这次 merge 既定目标的那一方,并把这个取舍说清楚。它不会为了糊弄过冲突而凭空发明新行为,`--abort` 也不是它会选的选项:这次 merge 总是会被带到一次完成的 commit。

## When to reach for it

输入 `/resolving-merge-conflicts`,或者当一个任务合适时,[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会自动使用它。

当 git 已经因为它自己解决不了的冲突而停下时用它。它的范围限定在你眼前的这次冲突上,不涉及它任何一侧的东西:

| 你的情况 | Skill |
| --- | --- |
| Merge 或 rebase 进行中,树里有冲突标记 | 就是这个 |
| Merge 完成了,现在有东西表现异常、原因看不出来 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |
| 规划怎么切分工作、让分支之间少一点冲突 | 都不是——见下面关于并行工作的问题 |

## Primary sources over `ours` and `theirs`

这个 skill 存在的意义就是消灭这种失败模式:靠一个 flag 来解决——`--ours`、`--theirs`,或者手动删掉看起来不那么重要的那个代码块,让冲突标记消失、让构建能编译过去。这种解决方式可以在语法上完美无瑕,却依然悄悄丢掉了某人刻意做出的一处改动。

你没法保留一个你没读过的意图。所以工作从历史记录开始——commits、PRs、[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)——然后才转向 diff。循环里还有另一步出于同样的理由存在:这个 skill 会找出仓库自己的 [automated checks](https://www.aihero.dev/ai-coding-dictionary/automated-check) 并在提交前运行它们,因为一次 merge 是 git 里最容易产出"两个分支都满足、却两边测试都不过"的代码的地方。

## Common questions

**Claude Code 自己解决冲突已经做得相当好了。为什么还需要一个 skill?**

它增加的价值在于"找到主源头"和"跑反馈循环"这两步,否则每次都得手动去提醒。一个没被提示的 agent 通常只会单凭 diff 产出一个看似合理的解决方案,然后就止步于此。这个 skill 的价值就在于它不允许 agent 跳过的这两步——读懂每一侧为什么存在,以及事后跑一遍检查。相对于一个好的 [model](https://www.aihero.dev/ai-coding-dictionary/model),这是一个很薄的加成,而这本来也是设计意图:至少有一位读者预测过,随着模型进步,这会是整个 skill 集合里最先变成 no-op 的一个。

**我该不该把并行的 agents 限制在不同文件上,从一开始就避免冲突?**

大多数情况下不该。在并行任务之间给文件划分区域,代价比它省下的更高,因为 agents 处理 merge conflicts 已经足够好了,这个取舍没有看起来那么严峻。真正值得坚持的一条纪律是:大型重构要先做。一次大的重命名,如果是在十个分支已经从它那里分出去之后才落地,那才是代价一直很高的情况。

来自一份用户报告、关于并行 worktrees 的一点提醒:当兄弟 [sessions](https://www.aihero.dev/ai-coding-dictionary/session) 各自在自己的 tree 里构建一个 ticket 时,合并回去最好由写下那次改动的那个 session 来做,因为它才是已经了解那个意图的那一个。把所有人的冲突最后一起批给一个 agent,恰恰丢掉了这个 skill 第 2 步不得不重新构建出来的那份 context。

**为什么绝不 `--abort`?**

Abort 会丢掉已经完成的解决工作,下次再试的时候你又回到同一个、原封不动的冲突。这个 skill 是为"这次 merge 一定会发生"这种情况写的。如果你已经决定它不该发生,那是一个该在调用它之前做出的决定,而不是这个循环内部的一个分支。

## It's working if

- Agent 在解决冲突的同时引用 commit messages、PRs 或 issues,而不只是引用 diff hunks。
- 每个 hunk 最终要么保留了双方的行为,要么带着一条明确的说明,点名丢掉了什么、为什么。
- 结果里不会出现任何一侧分支上都没有的东西。
- 类型检查、测试和格式化在提交*之前*就被找到并跑通过了,而不是等你发现有东西坏了之后。
- 你最终得到一棵干净的树、这次操作已经完成——包括一次多 commit rebase 里剩下的每一个 commit。

## Where it fits

一个不依赖任何其他 skill 的、随时可用的独立工具:git 卡住时它启动,树变干净、完成提交时它结束。它唯一真正的邻居是 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs),在一次 merge 干净地完成、但合并后的代码表现异常时接手——那是一个诊断问题,不是一个冲突问题。它完全在 main 的 idea-to-ship flow 之外,所以关于它前后运行什么,[ask-matt](https://aihero.dev/skills-ask-matt) 是那张地图。
