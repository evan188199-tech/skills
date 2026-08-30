---
name: git-guardrails-claude-code
description: 设置 Claude Code hooks，在危险的 git 命令（push、reset --hard、clean、branch -D 等）执行之前拦截并阻止它们。当用户想阻止破坏性的 git 操作、添加 git 安全 hooks，或在 Claude Code 里阻止 git push/reset 时使用。
---

[English](SKILL.md) · [简体中文](SKILL.zh-CN.md)

# Setup Git Guardrails

设置一个 PreToolUse hook，在 Claude 执行危险的 git 命令之前拦截并阻止它们。

## What Gets Blocked

- `git push`（包括 `--force` 在内的所有变体）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被阻止时，Claude 会看到一条消息，告诉它没有权限执行这些命令。

## Steps

### 1. Ask scope

问用户：只为**这个项目**安装（`.claude/settings.json`），还是为**所有项目**安装（`~/.claude/settings.json`）？

### 2. Copy the hook script

内置脚本的位置在：[scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

根据范围把它复制到目标位置：

- **Project**：`.claude/hooks/block-dangerous-git.sh`
- **Global**：`~/.claude/hooks/block-dangerous-git.sh`

用 `chmod +x` 让它可执行。

### 3. Add hook to settings

添加到对应的 settings 文件：

**Project**（`.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**Global**（`~/.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

如果这个 settings 文件已经存在，把这个 hook 合并进已有的 `hooks.PreToolUse` 数组——不要覆盖其他设置。

### 4. Ask about customization

问用户是否想在被阻止列表里添加或删除某些模式。相应地编辑复制过来的脚本。

### 5. Verify

跑一个快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

应该以退出码 2 结束，并向 stderr 打印一条 BLOCKED 消息。
