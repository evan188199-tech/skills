[English](GLOSSARY-FORMAT.md) · [简体中文](GLOSSARY-FORMAT.zh-CN.md)

# GLOSSARY.md Format

`GLOSSARY.md` 是这个教学工作区的规范语言。所有讲解、练习和学习记录都应该遵循它的术语。构建它本身也是学习的一部分：把一个概念压缩成一条精炼的定义，正是用户理解它的证据。

## Structure

```md
# {Topic} Glossary

{One or two sentence description of the topic this glossary covers.}

## Terms

**Hypertrophy**:
Muscle growth driven by mechanical tension and metabolic stress over repeated training sessions.
_Avoid_: Bulking, getting big

**Progressive overload**:
Systematically increasing the demand on a muscle over time — via load, volume, or intensity.
_Avoid_: Pushing harder, levelling up

**RPE (Rate of Perceived Exertion)**:
A 1–10 self-rating of how hard a set felt, where 10 is failure and 8 means two reps left in the tank.
_Avoid_: Effort score, intensity rating
```

## Rules

- **只有当用户理解了一个术语时才加进来。** 这份词汇表记录的是压缩后的知识，不是给用户学习用的字典。如果用户刚接触一个概念，等他们能正确使用它之后，再把它收录进来。
- **要有明确立场。** 当同一个概念存在多个词时，挑一个最好的，把其余的列成要避免使用的别名。这正是语言得以压缩的方式。
- **定义要精炼。** 一两句话。定义这个术语*是*什么，而不是它做什么或怎么做。
- **在定义里使用词汇表自己的术语。** 一旦一个术语进了词汇表，之后到处都优先用它——包括在其他定义里面。这正是让复杂术语以后更容易理解的原因。
- **在自然形成分组时，用小标题归类**（例如 `## Anatomy`、`## Programming`）。当术语本来就内聚时，用扁平列表也可以。
- **明确标出歧义。** 如果一个术语在更广泛的领域里用法比较松散，就把这里的定论写清楚："在这个工作区里，'set' 永远指一个 working set——热身组是单独记录的。"
- **随着理解加深而修订。** 用户第一周写下的定义，到第六周可能就不对了。原地更新它；不要留下过时的条目。
