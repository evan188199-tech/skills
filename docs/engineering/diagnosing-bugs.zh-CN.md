[English](diagnosing-bugs.md) · [简体中文](diagnosing-bugs.zh-CN.md)

## What it does

`diagnosing-bugs` 对一个疑难 bug 或性能回退跑一次六阶段诊断:搭建复现、最小化、给假设排序、埋点、用一个 regression test 修复、清理。

在一个**紧凑**的反馈循环存在之前——一条已经运行过一次、且能在*这个* bug 上变红、修复后变绿的、被命名的命令——它不会让 agent 形成理论。一个 coding agent 拿到一份 bug 报告后的默认行为是读代码、猜;这个 skill 阻止了这一点。如果不存在一条能变红的命令,就没有 Phase 2。这一道关卡就是这个 skill 存在的意义。它之后的一切——二分查找、假设验证、埋点——一旦有了这个信号,就都是机械性的了。

## When to reach for it

输入 `/diagnosing-bugs`,或者当一个任务合适时,agent 会自己主动使用它——它是 model-invoked 的,在 "diagnose" / "debug this",或者一份关于某个东西坏了、报错、失败或变慢的报告上触发。

用在疑难的那些上:一个第一眼看不出所以然的 bug、一个间歇性抽风的问题、一个悄悄混进两个已知良好状态之间的 regression。它按设计就是重量级的,不适合用在一条消息就想要答案的问题上。

| 你的情况 | 该去哪 |
| --- | --- |
| 一个能用症状描述出来的具体缺陷 | 这个 skill |
| 一个慢接口,或者一次有明确前后对比的时序回退 | 这个 skill——它有一条性能分支(先测一个基线,再二分查找) |
| "这个代码库的瓶颈在哪?"——没有具体症状 | 不是这个 skill。它诊断一个已知的失败,不做审计 |
| 别人给的一份原始 bug 报告,还没确认或整理过 | 先走 [triage](https://aihero.dev/skills-triage) |
| 一次性代码,用来回答一个设计问题,不是追一个缺陷 | [prototype](https://aihero.dev/skills-prototype) |
| 先写测试再构建一个计划好的行为 | [tdd](https://aihero.dev/skills-tdd) |
| 没有好的 seam 能把这个 bug 锁定下来 | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)——这个 skill 自己会交接到那里 |

## The tight loop is the skill

Phase 1 花的力气不成比例,因为它是唯一困难的阶段。这个 skill 给出了一套搭建这个循环的方式,大致按优先级排序:

1. 在能触及这个 bug 的 seam 上写一个失败测试。
2. 针对一个跑着的开发服务器写一个 curl 或 HTTP 脚本。
3. 用一个 fixture 输入做一次 CLI 调用,和一份已知良好的 snapshot 做 diff。
4. 一个针对 DOM、console 或网络做断言的无头浏览器脚本。
5. 回放一份抓取到的内容——一个保存下来的请求、payload 或事件日志,在隔离环境下跑一遍这段代码路径。
6. 一个一次性 harness:系统的一个最小子集,一次函数调用。
7. 一个 property 或 fuzz 循环,针对"偶尔输出错误"的情况。
8. 一个可以交给 `git bisect run` 的二分查找 harness。
9. 一个差异对比循环——同样的输入,旧版本对比新版本。
10. 最后手段是一个 [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) bash 脚本。这个 skill 为此提供了 `scripts/hitl-loop.template.sh`:agent 运行这个脚本,你在终端里跟着提示走,你的回答会以可解析的形式返回。

目标不是*有*一个循环,而是**紧凑**:快(秒级)、确定性(每次运行结果一致)、清晰(断言你的确切症状,而不是"没崩溃"),而且能无人值守地被 agent 运行。一个 30 秒还会抽风的循环,几乎和没有循环没什么两样。对于一个只是偶尔出现的 bug,目标不是一个干净的复现,而是一个**更高的复现率**——把触发条件循环跑起来、并行化、加压力测试、注入 sleep,直到抽风率高到足以用来调试。

当它确实搭不出一个循环时,它被要求停下来明确说出来,列出尝试过的东西,向你请求 [environment](https://www.aihero.dev/ai-coding-dictionary/environment) 访问权限、一份抓取到的 artifact,或者添加临时埋点的许可。它不应该径自继续去做假设。

## The gates between phases

这些阶段是关卡,不是一份清单。每一个都要等某个具体的条件成立才会打开。

| Gate | 必须成立的条件 |
| --- | --- |
| 进入 Phase 2 | 一条被命名的命令,已经运行过并连同输出一起贴出来,能在这个 bug 上变红 |
| 进入 Phase 3 | 复现已完成*且*已最小化——剩下的每一个元素都是有支撑作用的 |
| 进入 Phase 4 | 存在 3-5 个排好序的、可证伪的假设,每个都陈述了自己的预测,并在测试任何一个之前展示给你 |
| 进入 Phase 5 | 探针对应一个具体预测,一次只改一个变量,每条调试日志都打上 `[DEBUG-a4f2]` 风格的标签,方便清理时一次 grep 搞定 |
| Done | 原始复现不再复现,埋点已清除,最终被证实正确的假设已写进 commit message |

Phase 5 有一个值得了解的退路。Regression test 是在修复之前写的,但前提是存在一个**正确的 seam**——一个测试能在调用点真正复现这个 bug 真实模式的地方。如果唯一可用的 seam 太浅,这个 skill 被要求明说,而不是写一个会给出错误信心的测试。这个缺失本身就是一项发现,它正是把事后复盘导向 `improve-codebase-architecture` 的原因。

## Common questions

**它在我只想要一个直接答案的快速问题上被触发了。**
这是这个 skill 被反映最多的问题,而且是真实存在的。尤其是在 GPT-5.6-Sol 上,用户报告它在一段对问题的朴素描述上就被触发了:"the model triggers the rather formal diagnosing-bugs skill instead. It then goes on to construct a reproduction scenario — often building a mock scenario with limited value — before giving me a response or suggestion. This results in considerable reply delays."。有四个不同的人在 [issue #578](https://github.com/mattpocock/skills/issues/578) 上报告了同样的情况。被接受的修复方案是先用一种更轻量的方式开始,只有当问题真的需要时才升级到这个重量级流程,但这个改动还没落地。这个 skill 是针对 Claude Code 的调用行为校准的;一个激活阈值更低的 [model](https://www.aihero.dev/ai-coding-dictionary/model) 会过度触发它。在它被升级之前,实际可行的修复是明确说出你想要什么("just answer this, don't diagnose"),或者在你的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 里为它关闭 model invocation。

**我能对着一个代码库问性能问题出在哪吗?**
不能。它诊断的是一个你已经能点名的失败。它的性能分支是针对一个有症状的回退——先建立一个基线测量,再二分查找,先测量后修复——不是用来做主动扫描的。一个面向主动版本的 skill 曾经被[提议、又被关闭](https://github.com/mattpocock/skills/issues/431);目前没有对应的 skill。

**它会在写修复之前停下来问我吗?**
不会。只有 Phase 3 有一个人类检查点——排好序的假设列表会在测试任何一个之前展示给你,如果你不在,它会按自己的排序继续。埋点和修复之间没有关卡,所以 agent 可能在你还没认可它的根因之前就开始写代码了。[Issue #124](https://github.com/mattpocock/skills/issues/124) 要求加上这道关卡,目前还开着。如果你想要它,在调用这个 skill 时说出来。

**我已经对这份 bug 报告跑过 `/triage` 了。这是重复劳动吗?**
部分是,而且两个 skill 都没承认这一点。正如一位读者所说:"Triage's step 3 is essentially a shallow, bounded instance of diagnosing-bugs Phase 1–2, but neither file mentions the other."。Triage 做的是一次有边界的"这真的是个 bug 吗、表面现象是什么"的检查;这个 skill 做的是彻底版本。先跑 triage 不算白费——它的验证过程往往能给你 Phase 1 大部分的原始素材——但预期在这里还要重做一遍,而且不会有任何交叉引用提醒你这一点。

**它贴出来的复现输出会泄露 secrets 吗?**
有可能。这个 skill 要求 agent 贴出调用命令及其输出,并请求 HAR 文件、日志转储、core dump 之类的 artifacts。这些都没有被指令要求做脱敏。[Issue #674](https://github.com/mattpocock/skills/issues/674) 正是提出了这一点——凭证、tokens、cookies 和个人数据被一并带进一次聊天、一个 issue 或一个 PR——并提议了一道脱敏护栏。它还开着、没有实现。目前先把脱敏当作你自己的责任,尤其是在这份输出要发到任何公开地方之前。

**我的安全扫描工具把这个 skill 标记为高风险。**
Snyk 会标记它,这是一个误报。它是这套集合里唯一一个自带可执行 shell 脚本(`hitl-loop.template.sh`)、并附带运行它以及 curl 一个开发服务器的指令的 skill。自带 `.sh`,加上运行它的指令,再加上出站 HTTP,足以触发一个静态扫描工具。这个脚本本身大约是 30 行 `read -r -p` 的提示,暂停等待人类输入。这个扫描工具评判的是能力表面,不是一个已证实的漏洞。

**`/diagnose` 去哪了?**
在 v1.0.0 里被重命名成了 `/diagnosing-bugs`。旧名字不再存在。任何你自己链接 `/diagnose` 的东西——一个包装 skill、一个保存的 prompt——都需要更新。

## It's working if

- 它在提出任何一个理论之前,先给你看一条命令和它变红的输出。如果理论先来,说明这个 skill 没有在正常运行。
- 它复现的失败,是你报告的那一个,而不是它顺路发现的一个相近的失败。
- 它在开始猜测之前先收缩复现场景,并能告诉你剩下的每一部分为什么是有支撑作用的。
- 在测试任何一个假设之前,你会看到一份 3-5 个排好序的假设列表,每一个都带有一个你可以证伪的预测。
- 它添加的每一条调试日志都带着像 `[DEBUG-a4f2]` 这样的标签,而当它宣布完成时,对这个标签做 grep 应该一无所获。
- Commit 或 PR message 里点名了哪个假设是对的。
- 当它没法用一个测试把这个 bug 锁定下来时,它会明确说出来,而不是写一个敷衍的测试。

## Where it fits

`diagnosing-bugs` 是一个随时可用的独立工具。当有东西坏了,你切进来;修复和它的 regression test 落地后,你切出去;它不持有状态,也不需要任何前置 setup。[ask-matt](https://aihero.dev/skills-ask-matt) 会把 "Something's broken" 路由到这里。

有两个邻居值得注意。当真正的发现是代码没有 seam 能把这个 bug 锁定下来时,[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 会接过这次 [handoff](https://www.aihero.dev/ai-coding-dictionary/handoff)——这个建议是在修复落地之后才给出的,那时信息更充分。[triage](https://aihero.dev/skills-triage) 位于它的上游,处理那些以原始报告形式从别人那里到来的 bug,并对前两个阶段做一个更浅的版本。
