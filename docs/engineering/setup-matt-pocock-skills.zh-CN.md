[English](setup-matt-pocock-skills.md) · [简体中文](setup-matt-pocock-skills.zh-CN.md)

## What it does

`setup-matt-pocock-skills` 就一个仓库回答三个问题——issues 存放在哪、triage labels 叫什么、领域文档放在哪——并把答案记录成 `docs/agents/` 下的 markdown 文件。

这些文件是各个仓库之间唯一会变化的东西。这些 skills 本身在任何地方都是一样的;它们在运行时读取 `docs/agents/issue-tracker.md`,照它说的做。这正是这套集合不绑定 GitHub的原因,也是没有任何 skill 文件需要被编辑、才能指向别处的原因。用"link the skills to a custom issue tracker"来调用它,能对接任何你能以编程方式连接的东西,而不需要改动这些 skills 一个字。

它是一个 prompt 驱动的 skill,不是一个确定性脚本。它读取你的 `git remote`、你已有的 `CLAUDE.md`、你已有的 `CONTEXT.md`,把找到的东西提出来,在写入任何东西之前等你确认。

## When to reach for it

你需要输入 `/setup-matt-pocock-skills` 来调用它——[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自己主动使用它。它被刻意标记为不可被模型调用,所以其他任何 skill 都不能替你触发它。

在使用任何其他 engineering skill 之前,每个仓库用它一次。如果 [triage](https://aihero.dev/skills-triage)、[to-spec](https://aihero.dev/skills-to-spec)、[to-tickets](https://aihero.dev/skills-to-tickets) 或 [wayfinder](https://aihero.dev/skills-wayfinder) 开始瞎猜你的 issues 放在哪,或者套用你的 tracker 里根本没有的 labels,说明这里还没被设置过。一个项目已经进行到一半的仓库,也很适合运行它;这个 skill 会读取已经存在的东西,不会浪费之前的任何工作。

## Prerequisites

它会写入你运行它的这个仓库:

| 它写入的东西 | 位置 |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`,只在 `triage` skill 已安装时 |
| 一个 `## Agent skills` 代码块 | `CLAUDE.md` / `AGENTS.md` 中已存在的那一个 |

这一切都是被提交的 markdown。没有用户级或全局模式:配置就活在仓库里,所以每个仓库都有自己的一份拷贝。

## The three decisions

它在每个小节开头都给出推荐答案,跳过任何探索阶段已经确定的部分。大多数情况下,跑完只需要两次确认。

| 决策 | 它提议什么 | 什么时候真正会问 |
| --- | --- | --- |
| **Issue tracker** | 匹配你 `git remote` 的那一个 | 总是——这是唯一一个真正的选择 |
| **Triage labels** | 保留五个规范名称(`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`) | 只有 `triage` skill 已安装时 |
| **Domain docs** | 单一 context:根目录一份 `CONTEXT.md` 加 `docs/adr/` | 只有当它发现 monorepo 信号时,然后它会提供一个多 context 的 `CONTEXT-MAP.md` 选项 |

Tracker 的选项:

| 选项 | Issues 存放在哪 | 需要 |
| --- | --- | --- |
| **GitHub** | 这个仓库的 GitHub Issues | `gh` CLI |
| **GitLab** | 这个仓库的 GitLab Issues | `glab` CLI |
| **Local markdown** | 这个仓库 `.scratch/<feature>/` 下的文件 | 什么都不需要——完全不需要 remote |
| **Other** | 你说了算 | 你用一段话描述这个流程 |

前三个作为模板内置在这个 skill 里,开箱即用。Local markdown 是一个一等选项,不是一个退路:一个没有 remote 的单人项目能被完整支持。有一点值得重复:如果你在用 GitHub,就不要同时用 local markdown。它们是替代方案,不是叠加的两层。

"Other" 也不是一个占位符。这正是 Jira、Linear、Azure DevOps 和 Beads 都能用的原因:你描述这个流程,这个 skill 把你的文字记录进 `docs/agents/issue-tracker.md`,下游的 skills 照着这段文字行事。社区已经这么做过了——一个通过 [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) 接入 Jira 的变体、一个形似 `gh` 的 Gitea CLI、一个手搭的本地 dashboard。

## Common questions

**我必须用 GitHub 吗?**

不必。GitHub、GitLab 和 `.scratch/` 下的 local markdown 都作为现成模板内置,其他任何东西都能走 "other" 这条路。这是记录里被重复问得最多的问题,大致是这样的措辞:*"hard locked to github"*、*"can I use GitLab / Jira"*、*"what about Azure DevOps"*。每次的答案都是:tracker 是一个 setup 答案,不是这个 skill 的固有属性。

**更新这些 skills 之后,我需要重新跑它吗?**

在 v1.1 之后被直接问到这个问题时,Matt 说需要。这个 skill 自己的结束语措辞更温和——它告诉你只有想切换 tracker 或者想从头开始时才需要重新运行。两种说法都站得住脚,而这个落差是真实存在的:种子模板在版本之间会变化,所以一个旧版本写下的 `docs/agents/issue-tracker.md`,相对现在正在读它的这些 skills 可能已经过时了。如果一个下游 skill 开始做一些和文档描述不一样的事,重新运行是最便宜的修复方式。

**它写进了 `CLAUDE.md`,但我用的是 Codex。**

已知的缺口,还没修。文件选择规则是"如果 `CLAUDE.md` 存在就编辑它,否则编辑 `AGENTS.md`"——它检查的是哪个文件存在,而不是哪个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 正在运行。一个仓库如果留有 Claude Code 遗留下来的 `CLAUDE.md`,它的 `## Agent skills` 代码块就会被写进 Codex 从不读取的地方。目前流传着两种变通方法:把这个代码块手动挪到 `AGENTS.md` 里,或者让 `AGENTS.md` 成为权威、把 `CLAUDE.md` 变成指向它的一行指针。如果两个文件都不存在,这个 skill 会问你想创建哪一个,而不是替你决定,这让一些期待它直接决定的人感到困惑。

**它没有创建我的 triage labels。**

它确实不会。`docs/agents/triage-labels.md` 是一份*映射*——它告诉 `/triage`,你 tracker 里的哪些字符串对应那五个规范角色。它不会运行 `gh label create`。在一个全新的 GitHub 仓库上,这些 labels 确实还不存在,这个问题已经被多次报告为 bug。两点补充:

- 如果你的 tracker 已经在用这些规范名称,这份映射就是一张恒等表,没什么需要配置的。这是预期中的常见情况,不是缺失的一步。
- [wayfinder](https://aihero.dev/skills-wayfinder) 的 `wayfinder:map` 和 `wayfinder:<type>` labels 这里也不会被创建,`gh issue create --label <missing>` 会直接失败,而不是自动创建这个 label。在一个 GitHub 仓库上第一次运行 wayfinder 之前,手动创建它们。

**我能在这里配置其他 skills 的行为吗——[grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 的节奏、问题格式、语气?**

不能。它只配置三样东西:tracker、labels、文档布局。已经有人直接要求过把它变成用户偏好设置的归宿,一贯的回答是:skills 保持自己的主张。*"Config is death."* 偏好应该放进你的 `CLAUDE.md`,作为朴素的指令,这是每个 skill 都已经会读取的地方。

**我能把配置放在 `~/.claude` 里,而不是提交到每个仓库吗?**

目前不行。有人在多个仓库上运行这些 skills,提出过正是这个诉求的 open request,但目前不存在用户级模式。每个仓库都携带自己的 `docs/agents/`。

**用一个 skill 来配置其他 skills,这不奇怪吗?**

一条由来已久的抱怨认为是的,原话是:*"having a skill to set up the other skill does not feel right to me — that means the LLM is configuring its own skills."*。这个取舍是真实存在、也被承认的:setup 步骤的替代方案,是把 tracker 相关指令重复写进每一个涉及 issues 的 skill 里。产出是可检查、可编辑的 markdown,这就是缓解措施——你可以读它写的每一个文件,并手动改动它,日常的微调正是这样做的,不需要再跑一次。

## It's working if

- `docs/agents/issue-tracker.md` 和 `docs/agents/domain.md` 存在,如果 `triage` 已安装,`triage-labels.md` 也存在。
- 你的 harness 实际读取的那份指令文件里出现了一个 `## Agent skills` 小节,每个文件都配一行摘要指向它。
- 它提议的 tracker 和你实际使用的 remote 匹配,label 字符串和你 tracker 里真实存在的 labels 匹配。
- 之后,`/to-tickets` 发布时不会再问你 issues 放在哪,`/triage` 会应用已有的 labels,而不是凭空发明。
- Skill 文件本身没有任何改动。如果这次 setup 编辑了一份 `SKILL.md`,说明出了问题。

## Where it fits

`setup-matt-pocock-skills` 是 engineering flow 的**一次性 setup**,是其他一切都假定已经完成的前提条件,而不是链条里的一步。它的邻居就是它的读者:应用这里写下的 label 词汇的 [triage](https://aihero.dev/skills-triage);发布到这里点名的 tracker 里的 [to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets);以及读取同一份 tracker 文件里 "Wayfinding operations" 小节、以了解地图和子 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 该怎么存储的 [wayfinder](https://aihero.dev/skills-wayfinder)。它记录的领域文档布局,是之后由 [domain-modeling](https://aihero.dev/skills-domain-modeling) 填充的——它会在一个术语或决策真正被敲定时才按需创建 `CONTEXT.md` 和 ADR,所以 setup 之后一个空仓库正是预期状态。关于接下来该用哪个 skill,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你在整套集合里路由。
