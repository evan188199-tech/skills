[English](README.md) · [简体中文](README.zh-CN.md)

# In Progress

Beta 阶段。这些 skills 是故意公开的——试试看，告诉我哪里坏了。它们被排除在 plugin 和顶层 README 之外，直到它们毕业进入一个稳定 bucket；它们没有 docs 页面，而且可能在没有预警的情况下变化或消失。

Plugin 不会给你这些。直接安装单个 skill：

```bash
npx skills@latest add evan188199-tech/skills --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)** —— 在多个 session 中反复追问你自己，把它打磨成可实现的 workflow specs，用当前目录作为一个有状态的工作区。User-invoked。
- **[writing-beats](./writing-beats/SKILL.md)** —— 把一篇文章塑造成一段由 beats 组成的旅程，选择你自己的冒险风格。挑一个起始 beat，只写那个 beat，然后转向下一个，直到文章自然收尾。
- **[writing-fragments](./writing-fragments/SKILL.md)** —— 一次 grilling session，从你身上挖出各种碎片——形态各异的文字素材——并把它们追加到单个文档里，作为未来文章的原始素材。
- **[writing-shape](./writing-shape/SKILL.md)** —— 拿一份 markdown 原始素材文件，逐段把它塑造成一篇文章，每一步都为格式选择做出论证。
- **[claude-handoff](./claude-handoff/SKILL.md)** —— 把当前对话交接给一个全新的后台 agent，让它立刻接手，通过 `claude --bg` 用一份交接摘要作为种子。User-invoked。
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)** —— 把 dependency-cruiser 接入一个 TypeScript 仓库，让每个 package 都成为一个 deep module——实现细节藏在子文件夹里，只能通过它的入口文件访问，测试也只通过这些入口文件来验证。User-invoked。
