---
name: setup-ts-deep-modules
description: 把 dependency-cruiser 接入一个 TypeScript 仓库，让每个 package 都成为一个 deep module——实现细节藏在子文件夹里，只能通过它的入口文件访问。User-invoked。
disable-model-invocation: true
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Setup TS Deep Modules

让这个仓库里的每个 package 都成为一个 **deep module**：把大量行为藏在一个小接口后面。一个 package 的公开表面就是它的**入口点（entry points）**——package 根目录下的那些文件——它子文件夹里的一切都是隐藏的。这个 skill 会安装 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 和让入口点成为唯一入口的规则，然后证明这些规则真的有约束力。

关于词汇（deep module、interface、seam、depth），运行 `/codebase-design` skill——全程使用它的语言。

## The shape this enforces

```
src/packages/
  <name>/
    index.ts        ← an entry point (public). Import this from outside.
    client.ts       ← another entry point. Packages may expose SEVERAL.
    lib/            ← implementation: hidden from outside, free to import each other.
    tests/          ← co-located tests + fixtures (a subfolder, so private).
```

公开表面是这个 package 的**根目录文件**——不是某一个指定的 `index.ts`。按约定，实现放在 `lib/` 里，测试放在 `tests/` 里，让每个 package 都有同样的两文件夹形状。但这条规则本身是通用的：*任何*子文件夹里的*任何*东西都是私有的，所以你永远不需要为了新增一个文件夹而扩展这份配置。

四条规则，全部是 `error` 级别：

1. **Entry-point boundary** —— package 外部的代码（应用代码或另一个 package）只能导入这个 package 的入口点（它的根目录文件），绝不能导入它子文件夹里的任何东西。
2. **Intra-package freedom** —— 一个 package 自己的文件之间可以自由地互相导入。
3. **Tests through the entry points** —— `<pkg>/tests/` 下的文件可以导入任何 package 的入口点，以及它们自己 `tests/` 下的 fixtures，但绝不能导入任何 package 子文件夹内部的东西（哪怕是自己的）。跨 package 的集成测试没问题；深层导入不行。
4. **No cycles** —— 不允许存在依赖环。

**是入口点，不是一个 barrel 文件。** 因为公开表面是*每一个*根目录文件，一个 package 可以暴露好几个小的入口点（`index.ts`、`client.ts`、`server.ts`），而不是把所有东西都塞进一个巨大的 `index.ts` 里转发。不鼓励使用重新导出整棵子树的 barrel 文件——保持入口点小巧，把实现藏在子文件夹里。

分层（哪些 packages 可以依赖哪些）是一个*不同*的问题，配置里留了一个带注释的 stub，留给这个仓库自己去填。

## Steps

### 1. Detect the environment

- **Package manager** —— `pnpm-lock.yaml` → pnpm，`yarn.lock` → yarn，`bun.lockb` → bun，否则用 npm。下面每条命令都用它（`pnpm`/`yarn`/`npm run`/`bunx`）。
- **Packages root** —— 如果 `src/` 存在就用 `src/packages`，否则用 `packages`。如果这个仓库已经有一个明显不同的约定，就和用户确认这个选择。
- **Existing config** —— 检查是否有一个 `.dependency-cruiser.*` 文件。如果存在，**不要**覆盖它：把这四条规则和这些选项合并进去，并告诉用户你加了什么。

**完成标准：** package manager、packages root，以及是否已有配置的情况都已经明确。

### 2. Install dependency-cruiser

用检测到的包管理器把 `dependency-cruiser` 安装为 devDependency。

**完成标准：** `dependency-cruiser` 出现在 `devDependencies` 里。

### 3. Write the config

把 [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) 复制到仓库根目录，命名为 `.dependency-cruiser.cjs`。把 `PACKAGES_ROOT` 设成第 1 步检测到的根目录。这些规则是基于路径深度的、和扩展名无关，所以不需要再适配别的东西。

**完成标准：** `.dependency-cruiser.cjs` 存在，`PACKAGES_ROOT` 正确，且这四条禁止规则都在。

### 4. Wire it into the checks

- 添加一个 `lint:boundaries` 脚本：`depcruise <packages-root>`（或 `depcruise src`）。
- 把它折进这个仓库已经在跑类型检查的那个总控检查命令里（例如一个 `check` / `ci` / `validate` 脚本）。**不要**碰 `tsconfig`，也不要添加路径别名。
- 如果没有总控脚本，就添加 `lint:boundaries`，并告诉用户要把它加进 CI。

**完成标准：** `lint:boundaries` 存在，并且和类型检查跑在同一个命令里。

### 5. Scaffold the example package

创建一个提交进仓库的 `<packages-root>/example/`，作为一个可复制的模板：

- `index.ts` —— 一个入口点。导出一个委托给内部文件的函数（这样这个 package 明显是*deep*的，而不是一个单纯的转发层）。
- `lib/impl.ts` —— 一个位于**子文件夹**里的内部文件，被 `index.ts` 导入，外部无法访问。
- `tests/example.test.ts` —— **只**导入 `../index`（一个入口点），并针对这个公开函数做断言。

告诉用户这是一个可以复制或删除的起始模板。

**完成标准：** 这个示例 package 存在，通过一个根目录入口点暴露它的行为，并把 `impl` 藏在一个子文件夹里。

### 6. Prove the rules bite

这是整个 skill 的完成标准——一份在违规时不会报错的配置毫无价值。

1. 跑 `lint:boundaries`。它在这个干净的示例上必须**通过**。
2. 临时给 `tests/example.test.ts` 加一个深层导入（例如 `import { thing } from "../lib/impl"`）。再跑一次 `lint:boundaries`——它必须以 `tests-through-entrypoints` **失败**。
3. 撤销这个深层导入。再跑一次——它必须**通过**。

**完成标准：** 你观察到了一次通过，接着在深层导入上一次失败，然后再一次通过。如果第 2 步没有失败，说明这些规则没有正确接入——修好之后再收尾。

### 7. Document the convention

在 **packages 文件夹里**（`<packages-root>/README.md`）写一份 `README.md`——就在它管辖的那些 packages 旁边——涵盖：`src/packages/<name>/` 的布局（根目录是入口点，`lib/` 放实现，`tests/` 放测试）、"只通过一个 package 的入口点（它的根目录文件）导入"，以及怎么跑 `lint:boundaries`。**明确劝阻使用 barrel 文件**——用几个小的入口点，而不是通过一个 index 重新导出整棵子树。内容保持在一段可复制的代码片段，加上这四条规则各一段就够了。

然后从这个仓库的 agent 指令文件里给它加一个 **context pointer**——如果存在就是 `CLAUDE.md`，否则是 `AGENTS.md`（两者都不存在就创建 `AGENTS.md`）。一行就够了，例如 `Packages are deep modules — see [src/packages/README.md](./src/packages/README.md) before adding or importing one.` 这正是让一个 agent 主动发现这条边界规则、而不是一头撞上去的原因。

**完成标准：** `<packages-root>/README.md` 存在，并劝阻了 barrel 文件的使用，且这个仓库的 `CLAUDE.md`/`AGENTS.md` 链接到了它。

## Notes

- 这份配置里的 `$1` 反向引用（dependency-cruiser 的分组匹配）正是让一个 package 能访问自己内部、而外部访问不了的关键——不要把它们拆平成每个 package 各自独立的规则。
- 公开还是私有由**深度**决定：一个 package 的根目录文件是入口点；子文件夹里的任何东西都是私有的。约定俗成的子文件夹是 `lib/`（实现）和 `tests/`，但这条规则并没有把它们写死——任何子文件夹都是私有的，所以新增一个文件夹永远不需要改配置。新增一个入口点只是新增一个根目录文件——不需要 barrel。
- Packages 是**扁平的**：根目录下只有一层直接子项。一个 package 的内部可以嵌套多深都行；但一个 package 不能包含另一个 package。
- 用 `.cjs`（不是 `.js`），这样即使在 `"type": "module"` 的仓库里，这份配置的 `module.exports` 也能正常工作。
