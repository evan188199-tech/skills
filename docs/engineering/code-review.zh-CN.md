[English](code-review.md) · [简体中文](code-review.zh-CN.md)

## What it does

`code-review` 审查 `HEAD` 和你点名的一个固定起点——一个 commit、一个 branch、一个 tag、`main`、`HEAD~5`——之间的 diff,分两个维度进行。**Standards** 问的是:这段代码是否符合本仓库写代码的方式。**Spec** 问的是:这段代码是否做到了对应的 issue 或 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 要求的事。每个维度都跑在自己的 [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) 里,互相看不到对方的推理过程。

这两个维度从不合并、也从不重新排序。报告以*每个维度各自*最严重的问题收尾,拒绝在两者之间挑出一个总冠军,因为一次改动完全可能一个维度过、另一个维度不过:代码严格遵循每一条规范、却实现了错误的东西——Standards 通过,Spec 不通过;代码完全做到了 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 要求的事、却破坏了仓库的规范——正好相反。一份混合裁决会让过关的那个维度掩盖不过关的那个。

## When to reach for it

输入 `/code-review`,或者当你要求审查一个分支、一个 PR、进行中的工作,或任何"since X"时,agent 会自动使用它。

| 你的情况 | 该用什么 |
| --- | --- |
| 存在一份 diff,你想知道它写得对不对、*而且*是不是该做的事 | `code-review` |
| 你想在 diff 里揪 bug——空指针路径、竞态、差一错误 | Claude Code 自带的 review,不是这个(见下面的名字冲突) |
| 什么都还没写,你想先写测试再写代码 | [tdd](https://aihero.dev/skills-tdd) |
| 整份 spec 都要构建,包括 review | [implement](https://aihero.dev/skills-implement),它自己会调用这个 skill |
| 漂移的是整个代码库,不是某一份 diff | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |
| 有东西坏了,你不知道为什么 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

你必须提供这个固定起点。如果没提供,这个 skill 会问你,而不是瞎猜;然后它会先检查这个 ref 能不能解析、diff 是否非空,再启动任何东西,这样一个打错的 branch 名会当面报错,而不是在两个 sub-agents 内部悄悄失败。

## Prerequisites

Standards 这个维度不需要任何前提。它读仓库文档记录的任何内容(`CODING_STANDARDS.md`、`CONTRIBUTING.md` 之类),如果仓库什么都没记录,就退回到一套内置基线。

Spec 这个维度需要一份 spec 存在、且能被找到。它按这个顺序查找:

1. Commit messages 里的 issue 引用(`#123`、`Closes #45`、GitLab 的 `!67`),通过 `docs/agents/issue-tracker.md` 获取。
2. 你作为参数传入的一个路径。
3. `docs/`、`specs/` 或 `.scratch/` 下匹配 branch 或 feature 名字的一份 spec 文件。
4. 直接问你。

第 1 步依赖 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 写入的 `docs/agents/issue-tracker.md`。没有它,只要你手动给一个路径,这个维度依然能工作。如果完全没有 spec,Spec 这个 sub-agent 会被跳过,报告会说"no spec available",而不是凭空编造需求。

## The two axes

| | Standards | Spec |
| --- | --- | --- |
| 问题 | 写得对不对? | 是不是该做的事? |
| 读取 | 仓库文档记录的标准,外加 smell baseline | 对应的 issue 或 spec |
| 报告 | 文档化的违规(可以是硬性的),以及 smells(永远是判断性的) | 缺失或部分完成的需求、scope creep、实现方式有问题的需求 |
| 每条发现都引用 | 标准文件和对应规则,或者被命名的 smell 加上那段 hunk | Spec 里对应的那一行 |

一个不了解你的标准的通用 review skill,正是这套设计想要避免的东西——它会标记出你代码库里刻意为之的东西,又漏掉你代码库真正依赖的那些不变量。所以仓库自己的文档是 Standards 这个维度的 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source),而且**仓库永远优先**。

**smell baseline** 是它下面的一道底线:出自《重构》第 3 章的十二条 Fowler code smells——Mysterious Name、Duplicated Code、Feature Envy、Data Clumps、Primitive Obsession、Repeated Switches、Shotgun Surgery、Divergent Change、Speculative Generality、Message Chains、Middle Man、Refused Bequest。每一条都是一个带标签的启发式判断("possible Feature Envy"),绝不是硬性违规,每一条都按*是什么* → *怎么修*来表述,所以一条发现总是自带一个可以采取的动作,而不只是一句抱怨。任何你的 linter 已经强制执行的东西,两个维度都会跳过。

## Common questions

**它和 Claude Code 自带的 `/code-review` 冲突了。我该怎么办?**

这是这个 skill 被反映最多的问题,而且还没修。Claude Code 自带一个 `/code-review`,做的是不同的事——它在 diff 里揪 bug,而这个 skill 检查的是 spec 符合度和仓库标准。安装这套 skill 库意味着两者之一会赢,赢家取决于你怎么安装的。通过 plugin marketplace 安装时,所有东西都会被加上 `mattpocock-skills:` 前缀别名,内置的那个在不带前缀的名字下就变得很难触达;通过普通的 skills 安装时,本地文件会赢,这个 skill 会遮蔽掉内置的那个。一个干净的解法是把 Claude Code 自带的 skills 整个移除:能省下大量 [context](https://www.aihero.dev/ai-coding-dictionary/context),而且这个冲突也就不再重要了。这种遮蔽本身可以说是 Claude Code [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 的一个 bug——一个 skill 作者应该有自由给自己的 skill 起任何名字——所以另一个解法是重命名本地这份拷贝。编辑 frontmatter 或重命名目录,会被 `npx skills update` 撤销;用户报告的持久解法是把这个 skill fork 到一个新名字下,并把 `code-review` 从受管理的集合里去掉,同时记下你 fork 时的那个 commit,方便以后手动同步。

**它的 sub-agents 会不断重新调用 `/code-review`,派生出更多 agents。**

已知的 open bug,被多个人在不止一个 harness 上复现过。Standards 和 Spec 的 prompt 都没有禁止委托,所以一个 sub-agent 可能会重新发现这个 skill,再次扇出——有一份报告达到了 50 多个 agents。用户在 fork 里应用的修复是在两份 sub-agent 简报末尾都加一行:"Do not invoke `/code-review` or spawn additional agents — perform this review directly."。有些人更倾向于在 harness 层面处理,让每个 skill 都继承这道护栏。这两种做法目前都还没进入正式发布的 skill。如果你无人值守地运行它,盯着 agent 数量。

**我该在写代码的同一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 里跑它吗?**

优先用一个全新的。正如一位读者所说:"Same context reviewing itself isn't review, it's confirmation bias with a slash command."。在写代码的那个 session 里做 review 的 agent,持有塑造了那份代码的每一个假设,而这恰恰是一个独立审查者不该拥有的上下文。这也是为什么人们要求 [implement](https://aihero.dev/skills-implement) 不要带上它内置的 review 步骤——它是在刚写完那份 diff 的同一个 session 里跑 review 的。从一个干净的 session 里自己手动调用 `/code-review`,才是诚实的做法。

**是每个 ticket 之后都跑一次,还是最后统一跑一次?**

两种都行,这个 skill 不会替你决定。逐 ticket 能让每份 diff 保持足够小,让 Spec 这个维度有一份清晰的 spec 可以对照,这正是 `implement` 用的模式。攒到 branch 最后再批量跑,能抓住逐 ticket 各自检查时都会漏掉的 ticket 之间的相互影响。如果拿不准,就逐 ticket 审查,再对着 branch 起点跑一次最终检查。

**我能信任这些发现吗?**

不能,不检查就信。Sub-agent 的输出是一个假设,不是证据——有一个团队报告过一打被基于文字的 review "放行"的破坏性改动。这个 skill 是原样或轻微整理地汇总这两份报告,而不是逐条针对文件重新验证,所以一条发现可能引用了错误的位置,或者夸大了影响。在依据某条发现采取行动之前,先读它的引用。要求每条发现都必须带一个引用——一条标准规则、一个 smell 加上它的 hunk,或者 spec 的一行——正是让这一切能被核对的原因。

**为什么我每次跑它都会发现新问题?**

因为修复会创造新的表面,也因为 Standards 这个维度里判断性的那一半,在不同次运行之间不是确定性的。一位读者直白地描述了这个循环:"/code-review and /improve-code-architecture always find new stuff every time. I implement fixes, rerun these skills, and again and again."。没有收敛的保证。把一次通过当作一份线索清单,针对那些背后有引用规则支撑的去处理,然后停下——不要循环跑它直到它"干净"为止,因为它不会。

**它会审查我未提交的工作吗?**

不会。它 diff 的是 `<fixed-point>...HEAD`,三个点,这是从 merge-base 开始测量的,排除掉 staged 和工作区里的改动。如果 `implement` 没有做过中间提交,即将被提交的工作对这次 review 是不可见的。先提交,再审查,然后 amend 或加一个 fixup。

## It's working if

- 在启动任何 sub-agent 之前,它会拒绝在一个错误的 ref 或空 diff 上开始。
- 报告以 `## Standards` 和 `## Spec` 两个独立代码块的形式出现,而不是一份合并列表。
- 每条 Standards 发现都点名了你仓库某个文件里的一条规则、或十二条 smells 之一,并引用了对应 hunk;每条 Spec 发现都引用了 spec 里的一行。
- 结尾的摘要给出每个维度各自最严重的问题,并拒绝挑出一个总体冠军。
- 没有可用 spec 时,Spec 那部分会明确说明,而不是罗列它从代码里推断出的需求。

## Where it fits

`code-review` 是构建链条末尾的审查步骤——`grill-with-docs → to-spec → to-tickets → implement → code-review`——它也能独立使用,针对你指向的任何分支或 PR。

- [implement](https://aihero.dev/skills-implement) 是最近的邻居:它驱动构建过程,并在提交前把这个 skill 当作自己的收尾审查来调用。
- [to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets) 产出 Spec 这个维度对照的那份文档;一份模糊的 spec 会让这个维度也变得模糊。
- [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是整个代码库层面的对应物——这个 skill 永远只看一份 diff。

当你拿不准哪个 skill 适合当前情况时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你在整个集合里路由。
