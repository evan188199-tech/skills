[English](LEARNING-RECORD-FORMAT.md) · [简体中文](LEARNING-RECORD-FORMAT.zh-CN.md)

# Learning Record Format

学习记录存放在 `./learning-records/` 下，使用连续编号：`0001-slug.md`、`0002-slug.md`，以此类推。按需创建这个目录——只在第一条记录被写下时创建。

它们是教学场景下的 ADR：记录那些不明显的经验教训、关键洞见，以及已声明的先验知识，用来指导未来的 session。它们被用来计算最近发展区。

## Template

```md
# {Short title of what was learned or established}

{1-3 sentences: what was learned (or what prior knowledge was established), and why it matters for future sessions.}
```

这就是全部格式。一条学习记录可以只有一段话。它的价值在于记录下*这件事现在已经被掌握了*，以及*为什么*它会改变接下来该教什么——而不在于填满各个小节。

## Optional sections

只在这些小节确实能带来价值时才加上。大多数记录都用不上它们。

- **Status** frontmatter（`active | superseded by LR-NNNN`）——当早先的理解后来被证明是错的、需要替换时有用。
- **Evidence** —— 用户是如何展示出这份理解的（回答了一个问题、完成了一次练习、提到了先前经验）。当这个论断以后可能被重新审视时有用。
- **Implications** —— 这为未来的 session 打开了什么、或排除了什么。当它不明显时值得记录。

## Numbering

扫描 `./learning-records/`，找到现有最大的编号，加一。

## When to write a learning record

以下任意一条成立时，就写一条：

1. **用户展示出对某个不平凡内容的真正理解**——不只是接触过，而是有证据表明他们能正确运用这个概念。这为接下来该教什么设定了一个新的底线。
2. **用户透露了先验知识**——"我已经知道 X 了。" 记下来，这样未来的 session 就不会重复教它。同时也要记录他们声称的*深度*。
3. **一个误解被纠正了**——用户之前相信某个错误的东西，现在明白了为什么错了。这些价值很高：它们能预测相关主题未来会遇到的绊脚石。
4. **Mission 因为学习而发生了转变**——用户发现自己真正在意的东西和原来想的不一样。交叉链接到 [[MISSION.md]] 并更新它。

### What does _not_ qualify

- 只是被覆盖过的内容。覆盖过不等于学会了。要等有证据。
- 任何已经作为术语定义、简明记录在 [[GLOSSARY.md]] 里的东西。不要重复。
- 逐个 session 的活动日志。学习记录不是日记——它们是决策级别的洞见。

## Supersession

当一条后来的记录和一条更早的记录相矛盾时（用户的理解加深了，或者被纠正了），把旧记录标记为 `Status: superseded by LR-NNNN`，而不是删掉它。理解是如何演变的这段历史本身就是有用的信号。
