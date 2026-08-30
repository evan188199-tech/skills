---
name: wizard
description: 生成一个交互式 bash 向导，带领人类走完只有他们才能完成的步骤。当需要置备基础设施、配置凭证或 CI secrets、走一遍陌生的第三方 dashboard，或执行一次一次性迁移或切换时使用。不要在 agent 自己就能完成的步骤上调用它。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Wizard

一个 **wizard** 是一个 bash 脚本，一步步带领人类完成一套手动操作起来很繁琐、每次重新讲给 AI 听也很繁琐的流程。它会打开每个 URL，明确说该点哪里、复制什么，捕获这些值，把它们写到该去的地方（`.env`、GitHub secrets），每个阶段都做确认，并显示还剩多少个阶段。它可能是配置第三方服务、执行一次一次性迁移，或者把项目从一个状态搬到另一个状态。

那种令人愉悦的体验已经由 [template.sh](template.sh) 解决了——按阶段显示进度、确认关卡、跨平台打开 URL（包括 WSL）、隐藏输入 secret、幂等的 `.env` upsert、`gh secret`/`gh variable` 写入，以及结尾的总结。**你的工作只是界定这套流程的范围，并编写它的各个阶段。** `STAGES` 标记以上的库代码在每个 wizard 里都是一样的；这种一致性正是重点所在——永远不要手动编辑它。

一个 wizard 默认是一次性的：为一次运行而构建，保存在一个 scratch 路径或 `scripts/` 路径下，任务完成后就删除。只有当用户想要一条应该留在仓库里、可重复使用的 setup 路径时，才提交它。

## Process

### 1. Scope the procedure

弄清楚人类必须完成的每一个手动步骤，以及沿途会捕获的每一个值。先读仓库——不要冷启动就问：

- 对于 setup 场景：`.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置，以及 `.github/workflows/*`（每一处 `secrets.*` / `vars.*` 引用都是这个 wizard 必须产出的一个值）。
- 对于一次迁移或转换：当前状态、目标状态，以及两者之间不可逆的操作。

然后把有序的阶段列表和每个阶段产出的值展示给用户，并确认——他们可能会添加、删除或重新排序。

**完成标准：** 每个阶段都按顺序命名了，对每个被捕获的值你都知道 (a) 人类从哪里拿到它，(b) 它被写到哪里（`.env`、一个 GitHub secret、两者都写，还是哪里都不写——有些阶段是纯操作），以及 (c) 它是不是 secret（需要隐藏输入）还是公开的。

### 2. Map each stage's journey

为每个阶段写下人类要走的精确路径：打开哪个 URL、在那里做什么、值显示在哪里、它填的是哪个变量——例如"Dashboard → Developers → API keys → Reveal test key → copy"。如果你其实不知道当前的 UI 或确切命令是什么，就说出来，问用户，或者去查文档——绝不要编造可能并不存在的步骤。

**完成标准：** 每个阶段都能对应到一个陌生人也能照做的具体指引。

### 3. Author the wizard

把 `template.sh` 复制到目标路径。把示例阶段替换成每个步骤各自的一个 `stage`，按依赖顺序排列。使用库里提供的辅助函数——`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`——并把 `TOTAL_STAGES` 设成你写的阶段数。

坚持模板设定的标准：先打开 URL 再询问它的值，任何 secret 都用 `ask_secret`，每个要持久化的值都用 `write_env`，只对 CI 真正需要的值用 `set_secret`，任何不可逆操作之前都要 `confirm`。每个 `stage` 都会清屏，只让当前这一步可见——保持一个阶段只做一件事，这样人类需要的东西就不会被滚动出视野。不要碰标记线以上的库代码。

### 4. Verify and hand off

- `bash -n <script>`；如果有 `shellcheck` 就跑一下。
- `chmod +x <script>`。
- 不要自己端到端地跑它——它会打开浏览器，还会卡在等待人类输入的地方。改用静态方式过一遍：确认第 1 步里的每个值都被捕获了，落到了第 1 步说的地方，并且每个 `set_secret` 的名字都和 CI 里某个 `secrets.*` 引用精确匹配。
- 告诉用户怎么运行它。如果这是一条可重复使用的 setup 路径，就提交它，并从 README 链接过去，这样下一个人就会运行这个脚本，而不是去问一个 AI。
