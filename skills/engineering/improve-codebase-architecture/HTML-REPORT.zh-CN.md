[English](HTML-REPORT.md) · [简体中文](HTML-REPORT.zh-CN.md)

# HTML Report Format

这份架构复盘报告被渲染成操作系统临时目录里的一个自包含 HTML 文件。Tailwind 和 Mermaid 都从 CDN 引入。Mermaid 能可靠地处理图状的图表；手写的 divs 和内联 SVG 用来处理更偏"编辑设计"的视觉效果（体量对比图、剖面图）。两者混用——不要什么都靠 Mermaid，那样看起来会很通用、缺乏个性。

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## Header

仓库名、日期，加一份简洁的图例：实线方框 = module，虚线 = seam，红色箭头 = leakage，粗黑方框 = deep module。不要写引言段落——直接进入各个候选项。

## Candidate card

图表承担主要信息量。文字要少、要朴素，用（来自 `/codebase-design` skill 的）词汇表术语，不要绕弯子。

每个候选项是一个 `<article>`：

- **Title** —— 简短，点出这次做深的内容（例如 "Collapse the Order intake pipeline"）。
- **Badge row** —— 推荐强度（`Strong` = emerald，`Worth exploring` = amber，`Speculative` = slate），外加一个标注依赖类别的标签（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）。
- **Files** —— 等宽字体列表，`font-mono text-sm`。
- **Before / After diagram** —— 核心部分。两栏并排。见下面的图表模式。
- **Problem** —— 一句话。哪里疼。
- **Solution** —— 一句话。会改变什么。
- **Wins** —— 项目符号，每条不超过 6 个词。例如 "Tests hit one interface"、"Pricing logic stops leaking"、"Delete 4 shallow wrappers"。
- **ADR callout**（如果适用）—— 一个琥珀色底的提示框里写一行。

不要写大段说明文字。如果一张图需要一段话才能看懂，就重新画这张图。

## Diagram patterns

挑选适合这个候选项的模式。混着用。不要让每张图看起来都一样——多样性本身就是要点之一。

### Mermaid graph（依赖关系/调用流程的主力工具）

当要点是"X 调用 Y 调用 Z，看看这有多乱"时，用 Mermaid 的 `flowchart` 或 `graph`。把它包在一个 Tailwind 样式的卡片里，避免显得很突兀。用 classDef 给渗漏的边染成红色，把 deep module 染成深色。时序图很适合表达"改前：6 次往返；改后：1 次"。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### Hand-built boxes-and-arrows（当 Mermaid 的布局跟你对着干时）

把模块画成带边框和标签的 `<div>`。箭头用内联 SVG 的 `<line>` 或 `<path>` 元素，绝对定位在一个 relative 容器上。当你想让"改后"那张图看起来像一个粗边框的 deep module、内部细节变灰时，用这种方式——Mermaid 画不出那种分量感。

### Cross-section（适合表现分层的 shallowness）

用水平色带（`h-12 border-l-4`）堆叠出一次调用经过的各层。改前：6 层薄薄的、什么都没做的层。改后：1 条粗色带，标注着被整合后的职责。

### Mass diagram（适合表现"接口和实现一样宽"）

每个模块画两个矩形——一个代表接口表面积，一个代表实现。改前：接口矩形几乎和实现矩形一样高（shallow）。改后：接口矩形很矮，实现矩形很高（deep）。

### Call-graph collapse

改前：一棵函数调用树，渲染成嵌套的方框。改后：同一棵树被折叠进一个方框，那些现在变成内部调用的部分以淡化的样式显示在里面。

## Style guidance

- 走编辑设计风格，不要走企业仪表盘风格。留足够的留白。标题可以选用衬线字体（`font-serif` 和 stone/slate 配色很搭）。
- 颜色要克制：一个强调色（emerald 或 indigo），外加渗漏用红色、警告用琥珀色。
- 图表高度保持在约 320px，让前后对比能舒服地并排显示、不需要滚动。
- 图表内的模块标签用 `text-xs uppercase tracking-wider`——它们读起来应该像示意图标注，而不是 UI 文案。
- 唯一的脚本是 Tailwind CDN 和 Mermaid 的 ESM 引入。报告其余部分是静态的——没有应用代码，除了 Mermaid 自己的渲染之外没有其他交互。

## Top recommendation section

一张更大的卡片。候选项名称、一句话说明为什么，加一个指向对应卡片的锚点链接。仅此而已。

## Tone

以下这套写作规范约束的是**报告本身**要用的英文措辞——报告的目标读者包括需要精确架构词汇的人，所以这些词汇和示例短语按上游约定保持英文：大白话、简洁——但架构相关的名词和动词要直接取自 `/codebase-design` skill。简洁不是漂移用词的借口。

**必须严格使用：** module、interface、implementation、depth、deep、shallow、seam、adapter、leverage、locality。

**绝不能替换成：** component、service、unit（代替 module）· API、signature（代替 interface）· boundary（代替 seam）· layer、wrapper（代替 module，当你指的确实是 module 时）。

**符合这种风格的措辞：**

- "Order intake module is shallow — interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins 项目符号**要用词汇表里的术语来命名收益：*"locality: bugs concentrate in one module"*、*"leverage: one interface, N call sites"*、*"interface shrinks; implementation absorbs the wrappers"*。不要写 *"easier to maintain"* 或 *"cleaner code"*——这些词不在词汇表里，没有资格出现。

不要有任何铺垫、客套或"it's worth noting that…"这类话。如果一句话能写成一个项目符号，就写成项目符号。如果一个项目符号可以删，就删掉它。如果某个术语不在 `/codebase-design` 的词汇表里，先找一个在词汇表里的，而不是自己发明一个新的。
