[English](DESIGN-IT-TWICE.md) · [简体中文](DESIGN-IT-TWICE.zh-CN.md)

# Design It Twice

当用户想为一个已选定的做深候选对象探索多种备选接口时，使用这个并行 sub-agent 模式。基于 "Design It Twice"（Ousterhout）——你的第一个想法不太可能是最好的那个。

使用 [SKILL.md](SKILL.md) 里的词汇——**module**、**interface**、**seam**、**adapter**、**leverage**。

## Process

### 1. 界定问题空间

在启动 sub-agents 之前，为选定的候选对象写一段面向用户的问题空间说明：

- 任何新接口都需要满足的约束
- 它会依赖的东西，以及它们属于哪个类别（见 [DEEPENING.md](DEEPENING.md)）
- 一段粗略的示意代码，用来让这些约束具体化——这不是一份提案，只是让约束变得可感知的一种方式

把这个展示给用户，然后立刻进入第 2 步。用户阅读和思考的同时，sub-agents 在并行工作。

### 2. 启动 sub-agents

并行启动 3 个以上的 sub-agents。每一个都必须为做深后的模块产出一个**截然不同**的接口。

给每个 sub-agent 一份独立的技术简报（文件路径、耦合细节、来自 [DEEPENING.md](DEEPENING.md) 的依赖类别、seam 背后是什么）。这份简报和第 1 步里面向用户的问题空间说明是相互独立的。给每个 agent 一个不同的设计约束：

- Agent 1："把接口最小化——目标是最多 1-3 个入口点。让每个入口点的 leverage 最大化。"
- Agent 2："让灵活性最大化——支持多种用例和扩展。"
- Agent 3："为最常见的调用方优化——让默认场景变得简单到不能再简单。"
- Agent 4（如果适用）："围绕 ports & adapters 为跨 seam 依赖做设计。"

在简报中同时包含 [SKILL.md](SKILL.md) 的词汇和 CONTEXT.md 的词汇，这样每个 sub-agent 命名东西时才能既符合架构语言、又符合项目的领域语言。

每个 sub-agent 输出：

1. 接口（类型、方法、参数——外加不变量、顺序、错误模式）
2. 展示调用方如何使用它的用法示例
3. 实现在 seam 背后藏了什么
4. 依赖策略和 adapters（见 [DEEPENING.md](DEEPENING.md)）
5. 权衡取舍——哪里 leverage 高，哪里比较薄弱

### 3. 展示与比较

依次展示各个设计，让用户能逐一消化，然后用文字对它们做比较。从 **depth**（接口处的 leverage）、**locality**（改动集中在哪里）和 **seam 位置**这三个角度做对比。

比较完之后，给出你自己的推荐：你认为哪个设计最强、为什么。如果不同设计里的元素可以很好地结合，就提出一个混合方案。要有明确立场——用户想要的是一个有力的判断，不是一份菜单。
