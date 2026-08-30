---
name: ask-matt
description: 询问哪个 skill 或流程适合你当前的情况。本仓库中 skills 的 router。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Ask Matt

你不可能记住每一个 skill，所以就问吧。

一个 **flow** 是穿过这些 skills 的一条路径。大多数路径都沿着一条 **main flow** 走，另外有两条 **on-ramps** 会汇入它。其余的要么是独立的，要么是运行在底层的一层词汇表。

## The main flow: idea → ship

大多数工作走的路线。你有一个想法，想把它做出来。

1. **`/grill-with-docs`** —— 通过访谈打磨这个想法。只要你**在一个 working directory 里工作**，就从这里开始：它是有状态的，会把学到的东西保留在 `CONTEXT.md` 和 ADR 里。（没有 working directory？用 `/grill-me`——见 Standalone。两者跑的都是同一个 `/grilling` 原语；`grill-with-docs` 会留下文字记录，所以只要有仓库能承接它，它就是更好的那个选择。）
2. **分支——每个问题都能在对话里定下来吗？** 如果某个问题需要一个可运行的答案（state、业务逻辑、你必须亲眼看到的 UI），就绕道去做一个 prototype，用 **`/handoff`** 在两个方向之间搭桥（prototype 活在自己的目录里，这正是 `/handoff` 的用武之地——见 Phase boundaries）：
   - **`/handoff`** 出去，然后针对那个文件开一个新 session，
   - **`/prototype`** 用一次性代码回答这个问题，
   - **`/handoff`** 把学到的东西带回来，并从最初的 idea 线程里引用它。
3. **分支——这是一次多 session 的构建吗？**
   - **是** → **`/to-spec`**（把这个线程变成一份 spec），然后用 **`/to-tickets`** 把它拆成 tracer-bullet tickets，每个都声明自己的**阻塞关系**。在 local tracker 上，这是 `.scratch/<feature>/issues/` 下一个 ticket 一个文件，按阻塞关系手工优先处理；在真实 tracker 上，这些关系会变成原生阻塞链接，所以任何阻塞项都已完成的 ticket 就可以直接拿起来——针对每个 ticket 启动 **`/implement`**，**每完成一个就 `/clear` 一次上下文**。每个 ticket 都是自包含的，所以最后一个的上下文是可以丢弃的。
   - **否** → 直接在同一个上下文窗口里用 **`/implement`**。

   不管哪种情况，**`/implement`** 都是通过在内部驱动 **`/tdd`** 来构建每个 issue——一次一个 red-green 切片——然后在提交前跑一次 **`/code-review`**（一次针对 Standards + Spec 两个维度的审查）来收尾。当你只是想先写测试再实现某个具体行为、不需要完整 spec 时，单独用 **`/tdd`**；当你想针对一个固定起点审查某个分支或 PR 时，单独用 **`/code-review`**。

### Context hygiene

把步骤 1-3 保持在**同一个不中断的上下文窗口**里——在 `/to-tickets` 之前不要 compact 或 clear——这样 grilling、spec 和 tickets 才能建立在同一套思考之上。之后每个 `/implement` 都从头开始，基于那个 ticket 工作。

这里的限制是 **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**：模型依然能保持敏锐推理的窗口（在最先进的模型上大约 15 万 token）。如果一个 session 在到达 `/to-tickets` 之前就快逼近这个上限，不要在状态劣化的情况下硬撑——在最近的 phase boundary 处 `/compact`，然后继续（见 Phase boundaries）。

## On-ramps

一种会产生工作、随后汇入 main flow 的起始情形。

- **Bugs 和 requests 堆积如山** → **`/triage`**。它让 issues 在 triage roles 之间流转，产出 agent-ready 的 issues，之后由 **`/implement`** 接手。

  Triage 只针对**不是你自己创建**的 issues——bug 报告、新进来的 feature 请求，任何原始到达的东西。`/to-tickets` 产出的 tickets 已经是 agent-ready 的，所以**不要对它们做 triage**。

- **有东西坏了** → **`/diagnosing-bugs`**。用于那些棘手的情况：第一眼看不出所以然的 bug、间歇性抽风的问题、悄悄混进两个已知良好状态之间的 regression。它拒绝在拿到**紧凑的反馈循环**之前空谈理论——先找到一条已经能在*这个* bug 上变红的命令——然后用一个 regression test 来修复。当真正的发现是"这里根本没有一个好的 seam 能把这个 bug 锁住"时，它的事后复盘会交接给 **`/improve-codebase-architecture`**。

- **一大团、看不清方向的工作——一个 greenfield 项目，或一次大到单个 session 装不下的 feature 构建** → **`/wayfinder`**，这里认知负担最重的一条 flow。当从这里到目的地的路径还看不清时，它会在 issue tracker 上绘制一张 **decision tickets** 组成的**共享地图**，然后逐个解决——产出的是**决策，而不是交付物**——直到迷雾散去、道路清晰。**`/grill-with-docs`** 打磨的是一个 session 内能装下的想法，wayfinder 针对的是装不下的那种——而且它更慢、更密集，所以只在真正需要时才用，绝不要用在一个范围已经清楚的 feature 上。

  地图清晰之后，**它只负责交接，不负责构建**：在 **`/to-spec`** 处汇入 main flow，把地图上相互关联的决策收拢成一份可构建的 plan，然后照常走 `/to-tickets` 和 `/implement`。把地图直接丢进 `/implement` 会跳过这次收拢，丢掉那些关联细节——只有当这次工作最终证明确实很小时，才直接走 `/implement`。

## Codebase health

不是 feature 工作——是维护。

- **`/improve-codebase-architecture`** —— 只要有空闲时间，就跑一次，让代码库保持在 agent 好操作的状态。它会找出**可以做深的机会**；挑一个出来就*生成了一个想法*，你可以把它带进 main flow，从 `/grill-with-docs` 开始。它是找出候选项的那次巡检；**`/codebase-design`**（见下文）才是你设计所选方案的那张工作台。

## Vocabulary underneath

两个 model-invoked 的参考文档，运行在其他 skills*底下*——各自是自己那套词汇的唯一权威来源。当问题出在**用词**而不是流程本身时，直接找它们；否则就让上面那些 skills 顺带引入它们。

- **`/domain-modeling`** —— 打磨项目的*领域*语言：挑战一个模糊的术语，解决一个身兼数职的词（"account" 同时干了三份工作），把一个难以撤销的决策记录成 ADR。这是 `/grill-with-docs` 驱动的那套主动纪律，用来让 `CONTEXT.md` 保持是一份干净的词汇表。
- **`/codebase-design`** —— 用于设计一个模块*形状*的 deep-module 词汇（module、interface、depth、seam、adapter、leverage、locality）：把大量行为藏在一个干净 seam 上的一个小接口后面。`/tdd` 和 `/improve-codebase-architecture` 都在用这套语言。

## Phase boundaries

一个 **phase** 是一个 session 内的一块工作——grilling、implementation、QA。在两个 phase 之间的**边界**上，你有五个选项，在它们之间做选择是整张地图里最模糊的一个决策：

- **Continue** —— 留在原地。不花代价，也不丢东西。
- **`/clear`** —— 当这里的一切都跟接下来无关时，清空窗口。
- **`/handoff`** —— 写一份可携带的 markdown 文件。范围很窄：只用于**换一个 harness**、**换一个目录**、**交给一位同事**，或者在**phase 进行中**分叉出一个 side task。它买到的是**可携带性**。
- **Subagent** —— 把一个范围明确的任务发到它自己的窗口里，拿回一份报告。
- **`/compact`** —— 压缩当前上下文，用它作为新 session 的种子。**默认选项**，排在这棵树的最底部，而不是第一反应。

阅读 [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) 获取按顺序排列的决策树——五个问题、每个分支背后的理由，以及为什么 primary-source 的代价让 **Continue** 成为第一个要排除的选项。要**在**边界处做这个决定；phase 进行中，要么继续，要么把剩下的工作拆给 subagents。

## Standalone

完全在 main flow 之外。

- **`/grill-me`** —— 和 `/grill-with-docs` 一样的连番追问式访谈，但是**无状态**的：它不在本地保存任何东西，也不构建 `CONTEXT.md`。当你**不在一个 working directory 里**工作时用它——打磨一个 plan、一份设计、一段文字，任何底下没有仓库的东西。如果你确实在一个 working directory 里，改用 `/grill-with-docs`：它跑的是同一套访谈，还会留下文字记录，严格来说是更好的选择。
- **`/grilling`** —— 访谈本身这个原语：轮次、frontier，事实是 agent 的活，决策是你的活。`/grill-me` 和 `/grill-with-docs` 是进入它的两条命名路径，`/triage`、`/wayfinder` 和 `/improve-codebase-architecture` 都在内部运行它。只有当你想要一次不带任何包装的纯访谈时，才直接用它。
- **`/resolving-merge-conflicts`** —— 逐个 hunk 处理一次进行中的 merge 或 rebase 冲突，依据追溯到双方主源头的**意图**来解决，而不是靠挑行，然后完成这次操作。它绝不会跑 `--abort`。完全独立、不在任何 flow 上：当你已经处在冲突中时用它。
- **`/prototype`** —— 一个回答单个设计问题的小型一次性程序：这个 state 模型感觉对不对，或者这个 UI 应该长什么样。"一次性"约束的是代码怎么写，不是承诺要把它销毁：答案会被折叠进真正的代码，prototype 本身会作为**主源头（primary source）**保留在从 main 分出的 `prototype/<name>` 分支上，并从 implementation issue 指向它。它是 main flow 第 2 步里的那次绕道，但只要一个设计问题难以在纸面上定下来，随时都可以用它。
- **`/research`** —— 把查资料的体力活委托给一个**后台 agent**：它针对**主源头**调查一个问题，然后在仓库里留下一份带引用的 Markdown 文件。它读的时候你可以继续干活。它产出的文件是用来带*进* main flow、在 `/grill-with-docs` 里用的东西——research 是为思考提供养料，不是替代思考。
- **`/to-questionnaire`** —— 当卡住你的东西不在你自己脑子里、也不在代码库里，而在**别人**脑子里时，用它给对方写一份问卷去填。它是 `/grill-me` 的反面：它不是就主题采访你，而是就**这次发送**采访你——发给谁、你需要拿回什么——然后把问题对准这两者之间的缺口。拿回来的东西就是 `/grill-with-docs` 或 `/to-spec` 的素材。
- **`/wizard`** —— 用于只有**人类**才能完成的步骤：置备基础设施、配置凭证或 CI secrets、点击一个陌生的第三方 dashboard、执行一次一次性迁移或切换。它会生成一个交互式 bash 脚本，打开每个 URL、捕获每个值，并写进 `.env` 和 GitHub secrets——这样这套流程就不用每次都重新给 agent 讲一遍。它是 model-invoked 的，所以 agent 一碰到只有你才能跨过的坎，就会主动去找它。如果 agent 自己就能做，它就应该自己做；这个 skill 是给那些真正需要人类介入的场合用的。
- **`/wait-what`** —— 针对一条没说明白的消息的纠正手段。在对话中途、在任何其他 skill 内部使用它，agent 就会用你缺的那部分上下文，以大白话、并结合 `CONTEXT.md` 里的词汇，把刚才说的话重新讲一遍。它是事后补救；`/grill-with-docs` 才是事前的根治方案，因为提前定好一套共享语言，才能从源头上防止行话出现。
- **`/teach`** —— 用当前目录作为一个有状态的工作区，在多个 session 中学习一个概念。
- **`/writing-for-agents`** —— 编写给 agent 看的文档的参考：skills、AGENTS.md、被指针指向的文档。

## Precondition

**`/setup-matt-pocock-skills`** —— 在你第一次使用 engineering flow 之前先运行它，配置好其他 skills 所假定的 issue tracker、triage labels 和文档布局。自定义 issue tracker 也支持。
