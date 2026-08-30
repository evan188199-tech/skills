[English](PHASE-BOUNDARIES.md) · [简体中文](PHASE-BOUNDARIES.zh-CN.md)

# Phase boundaries

一个 **phase** 是一个 session 内的一块工作——grilling、implementation、QA。这个定义故意留得模糊：一个 phase 在你觉得*"好了，这块搞定了"*的时候结束。

**phase boundary** 是两个 phase 之间的间隙，也是唯一该在此处做这个决定的地方。Phase 进行中没有什么可决定的——要么继续，要么把剩下的工作拆给 subagents。在 phase 进行中做 compact 会让 agent 跟丢思路。

## The five options

| Option         | 它做什么                                            |
| -------------- | ------------------------------------------------- |
| **Continue**   | 留在这个 session 里。完全没有上下文切换。                    |
| **`/clear`**   | 清空上下文窗口，从零开始。                                  |
| **`/handoff`** | 写一份可携带的 markdown 文件，用它在任何地方启动一个 session。 |
| **Subagent**   | 把任务发到它自己的上下文窗口里，拿回一份报告。                  |
| **`/compact`** | 压缩当前上下文，用这份摘要作为新 session 的种子。            |

## The tree

在边界处从上到下依次检查。第一个 **yes** 胜出。

**1. 你能在这个 session 里继续吗？** 两种情况会让答案是 yes：下一个 phase 需要把这个 phase 当作**主源头（primary source）**，或者你还剩足够的 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)（大约 15 万 token）能装下下一个 phase。Grilling → implementation 就是标准的 yes 案例：implementation 想要的是逐字的推理过程，而不是它的摘要。Continue 不花代价、也不丢东西，所以先排除它，再考虑别的。

**2. 这段上下文和接下来要做的事无关吗？** 这个 session 里的一切——探索过程、决策、走过的死胡同——是不是都可以丢弃？如果是，用 **`/clear`**。这是这张棋盘上最便宜的一步：不花时间，还能拿回整个窗口。`/clear` 也不是终结性的——旧 session 依然可以恢复。

判断错了代价是单向的。清空一段*相关*的上下文，你就丢掉了你构建这些东西背后的**为什么**，事后再怎么读 diff 也找不回来。

**3. 你需要交接吗？** `/handoff` 的适用范围很窄。只有在你遇到以下情况时才需要它：

- 换一个**新 harness**（Claude → Codex），
- 迁移到一个**新目录**或仓库，
- 把工作发给一位**同事**，
- 或者在 **phase 进行中**分叉出一个 side task，又不想打断手头正在做的事。

这份清单就是全部适用场景。`/handoff` 买到的是**可携带性**——一份能带着走的文件。如果没有什么需要"带走"，你就不需要它。

**4. 这个任务能在你不在电脑前时完成吗？** 它的范围是不是足够明确，可以在没有你操心的情况下自己跑完？那就把它发给一个 **subagent**，让这个 session 保持原样。自动化 review 就是典型场景：agent 读 diff 然后汇报，这个过程不需要你。

**5. 都不是的话，用 `/compact`。** 相关的上下文、同一个 harness、同一个目录，而且你需要留在这个循环里——这棵决策树经常走到这里。给它一个指令（`/compact we're going to QA this area`），让摘要保留下一个 phase 需要的东西。

`/compact` 是**默认选项，而不是第一反应**。它排在最底部，因为它上面那四个问题都更便宜或更精准。人们一上来就用它时最常见的失败模式，是新 session 对摘要抹平掉的某个决策，自信满满地给出错误答案。

## Primary and secondary sources

除了 **Continue** 之外的每一步操作，都是把一个**主源头（primary source）**变成一个**次级源头（secondary source）**——把 session 发生时的真实样子，换成一份它的摘要。这笔交易的形状永远一样：

| Source                                | 信息量 | 噪音 | 回旋余地 |
| -------------------------------------- | ---- | ---- | -------- |
| Primary（Continue）                    | 完整 | 很多 | 很小     |
| Secondary（`/compact`、`/handoff`）    | 有损 | 较少 | 很大     |

这就是为什么问题 1 要放在最前面。只有当留下来的代价比它省下的更高时，你才该付出这份损耗。

## These are judgement calls

这些问题不是客观的——每一个都带着主观判断，同一个边界在不同的日子可能走向不同的选择。它们的价值在于**按顺序**在边界处提出，而不是在工作进行到一半时才想起来。
