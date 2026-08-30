[English](UI.md) · [简体中文](UI.zh-CN.md)

# UI Prototype

在同一个路由上生成**几种截然不同的 UI 变体**，通过一个浮动底栏切换。用户在浏览器里来回切换这些变体，挑一个（或者从每个里各偷一点），然后把剩下的扔掉。

如果问题关乎逻辑/state 而不是长什么样——选错分支了。用 [LOGIC.md](LOGIC.md)。

## When this is the right shape

- "这个页面应该长什么样？"
- "在定下来之前，我想看看这个 dashboard 的几个选项。"
- "给设置页面试试不同的布局。"
- 任何用户原本要花一整天在脑子里对比三个模糊 mockup 的场景。

## Two sub-shapes — strongly prefer sub-shape A

当一个 UI prototype 能**紧贴着应用的其余部分**——真实的 header、真实的侧边栏、真实的数据、真实的信息密度——时，它会更容易被评判。一个孤零零的一次性路由是一片真空：每个变体单独看都显得还行。只要存在一个说得过去的现有页面能承载这些变体，就默认选 sub-shape A。只有当这个 prototype 确实没有邻近的容身之处时，才用 sub-shape B。

### Sub-shape A — adjustment to an existing page（首选）

这个路由已经存在。各个变体渲染在**同一个路由上**，通过一个 `?variant=` URL search param 来控制。现有的数据获取、参数和鉴权全都保留——只切换渲染部分。这是默认选项，除非有具体理由不这么做。

如果这个 prototype 是为了某个还没有页面、但*理应自然地存在于某个页面内*的东西（dashboard 的一个新板块、设置页面上的一张新卡片、一个已有流程里的一个新步骤）——这仍然算 sub-shape A。把各个变体挂载在宿主页面内部。

### Sub-shape B — a new page（最后手段）

只有当被做 prototype 的东西确实没有任何现有页面可以容身时才用它——例如一个全新的顶层界面，或者一个没法合理嵌入任何地方的流程。

按照项目已有的路由约定创建一个**一次性路由**——不要发明一套新的顶层结构。给它起一个能一眼看出是 prototype 的名字（例如在路径或文件名里包含 `prototype` 这个词）。用同样的 `?variant=` 模式。

在决定用 sub-shape B 之前，先做个理智检查：真的没有任何现有页面能嵌入这个东西吗？一个空路由会掩盖一个已填充页面本会暴露出来的设计问题。

两种 sub-shape 下，浮动底栏都是一样的。

## Process

### 1. State the question and pick N

默认 **3 个变体**。超过 5 个就不再是"截然不同"，而是变成噪音——上限就定在这里。

用一行字写下计划，放在 prototype 的位置，或者文件顶部的注释里：

> "设置页面的三个变体，通过 `?variant=` 切换，挂在现有的 `/settings` 路由上。"

不管用户在不在场想不想提意见，这样写都是有意义的。

### 2. Generate radically different variants

起草每个变体。每个都要满足：

- 符合这个页面的目的，以及它能拿到的数据。
- 符合项目的组件库/样式系统（TailwindCSS、shadcn、MUI、纯 CSS，随便什么）。
- 有一个清晰的导出组件名，例如 `VariantA`、`VariantB`、`VariantC`。

各个变体必须**在结构上不同**——不同的布局、不同的信息层次、不同的主要交互方式，而不只是颜色不同。三个略微调整过的卡片网格算不上 UI prototype，那是壁纸。如果两份草稿看起来太像，就用明确的"不要用卡片网格"这样的指引重做一份。

### 3. Wire them together

在这个路由上创建一个单一的切换组件：

```tsx
// pseudo-code — adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

对于 sub-shape A（现有页面）：把所有现有的数据获取都保留在切换器之上；只有渲染出来的子树会随变体改变。

对于 sub-shape B（新页面）：`/prototype/<name>` 下的一次性路由挂载同一个切换器。

### 4. Build the floating switcher

一个固定定位、位于屏幕底部居中的小型条状组件，包含三部分：

- **左箭头** —— 切到上一个变体（循环）。
- **变体标签** —— 显示当前变体的 key，如果这个变体导出了名字，也一并显示。例如 `B — Sidebar layout`。
- **右箭头** —— 切到下一个变体（循环）。

行为：

- 点击箭头会更新 URL search param（用框架自带的 router——Next 上用 `router.replace`，React Router 上用 `navigate` 等），这样这个变体既可以分享，刷新后也能保持。
- 键盘：`←` 和 `→` 方向键也能切换。当 `<input>`、`<textarea>` 或 `[contenteditable]` 处于聚焦状态时，不要拦截方向键。
- 在视觉上要和页面明显区分开（例如高对比度的胶囊形状、淡淡的阴影），让人一眼就看出它不是正在被评估的设计的一部分。
- 在生产构建里隐藏——用 `process.env.NODE_ENV !== 'production'` 或等效检查来控制，这样一次误合并的 prototype 才不会把这个条带给用户。

把这个切换器做成一个共享组件，让两种 sub-shape 都能复用它。放在项目里共享 UI 组件通常存放的位置。

### 5. Hand it over

把这个 URL（以及各个 `?variant=` 的 key）亮出来。用户会在有空时来回切换。真正有意思的反馈通常是**"我想要 B 的 header 配上 C 的侧边栏"**——那才是他们真正想要的设计。

### 6. Capture the answer and clean up

一旦某个变体胜出，先记录这个答案——哪个变体、为什么——然后按照 [SKILL](SKILL.md) 描述的方式保存这个 prototype。把胜出的方案折叠进真正的代码，把其余的挪到一次性分支上，而不是留在 main 里：

- **Sub-shape A** —— 把胜出的方案折叠进现有页面；把落选的变体和切换器从 main 里删掉。
- **Sub-shape B** —— 把胜出的变体提升为一个真正的路由；把一次性路由和切换器从 main 里删掉。

完整的一套变体是主源头，所以它要落到一次性分支上，而不是垃圾桶里——留在 main 分支里的变体组件和切换器会很快腐烂，让下一个读到它的人感到困惑。

## Anti-patterns

- **只在颜色或文案上不同的变体。** 那是微调，不是 prototype。真正的变体在结构上就应该不一致。
- **变体之间共享太多代码。** 共享一个 `<Header>` 没问题；共享一个 `<Layout>` 就毁了整件事的意义。每个变体都应该能自由地抛弃这个布局。
- **把变体接到真实的写操作上。** 只读的 prototype 没问题。如果某个变体需要写操作，让它指向一个 stub——问题是"这应该长什么样"，不是"后端能不能跑通"。
- **把 prototype 直接提升为生产代码。** 变体代码是在 prototype 的约束下写的（没有测试、最少的错误处理）。折叠进来的时候要好好重写一遍。
