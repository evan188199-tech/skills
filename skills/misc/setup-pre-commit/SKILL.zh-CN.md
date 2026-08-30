---
name: setup-pre-commit
description: 在当前仓库里设置带 lint-staged（Prettier）、类型检查和测试的 Husky pre-commit hooks。当用户想添加 pre-commit hooks、设置 Husky、配置 lint-staged，或添加提交时的格式化/类型检查/测试时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Setup Pre-Commit Hooks

## What This Sets Up

- **Husky** pre-commit hook
- 在所有 staged 文件上跑 Prettier 的 **lint-staged**
- **Prettier** 配置（如果缺失的话）
- pre-commit hook 里的 **typecheck** 和 **test** 脚本

## Steps

### 1. Detect package manager

检查 `package-lock.json`（npm）、`pnpm-lock.yaml`（pnpm）、`yarn.lock`（yarn）、`bun.lockb`（bun）。用存在的那一个。不确定时默认用 npm。

### 2. Install dependencies

作为 devDependencies 安装：

```
husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

这会创建 `.husky/` 目录，并把 `prepare: "husky"` 加进 package.json。

### 4. Create `.husky/pre-commit`

写入这个文件（Husky v9+ 不需要 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**适配**：把 `npm` 换成检测到的那个包管理器。如果仓库的 package.json 里没有 `typecheck` 或 `test` 脚本，就省略对应的行，并告诉用户。

### 5. Create `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc`（如果缺失）

只有当没有任何 Prettier 配置存在时才创建。用这些默认值：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Verify

- [ ] `.husky/pre-commit` 存在且可执行
- [ ] `.lintstagedrc` 存在
- [ ] package.json 里的 `prepare` 脚本是 `"husky"`
- [ ] prettier 配置存在
- [ ] 跑 `npx lint-staged` 确认它能正常工作

### 8. Commit

Stage 所有改动/新建的文件，用这条信息提交：`Add pre-commit hooks (husky + lint-staged + prettier)`

这会触发刚设置好的 pre-commit hooks——是验证一切正常工作的一次很好的冒烟测试。

## Notes

- Husky v9+ 的 hook 文件不需要 shebang
- `prettier --ignore-unknown` 会跳过 Prettier 解析不了的文件（图片等）
- Pre-commit 会先跑 lint-staged（快，只处理 staged 文件），再跑完整的类型检查和测试
