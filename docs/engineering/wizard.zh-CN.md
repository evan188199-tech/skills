[English](wizard.md) · [简体中文](wizard.zh-CN.md)

## What it does

`wizard` 生成一个交互式 bash 脚本,一步步带领人类完成一套手动流程——接入第三方服务、执行一次一次性迁移、把一个项目从状态 A 搬到状态 B。它会打开每个 URL,说明该点哪里、复制什么,捕获返回的结果,把它写进 `.env` 文件和 GitHub Actions secrets。

[Agent](https://www.aihero.dev/ai-coding-dictionary/agent) 负责写这个脚本;它自己从不运行它。是你在自己的机器上运行。所以一个 wizard 不是一份你要照着做的操作说明——它是一个驱动这套流程、持有状态的程序,你的部分是点击、粘贴,以及按回车。

## When to reach for it

你可以输入 `/wizard`,agent 也会自己主动使用它。当它碰到一个你必须亲自完成的步骤——一个它没法自己生成的密钥、一个它没法自己点击的 dashboard——它会给你构建一个 wizard,而不是把操作说明直接倒进聊天里、任由它们被滚动没顶。

当卡住你的下一件事是一趟穿过某个 dashboard 的旅程时用它:

| 情形 | Wizard 做什么 |
| --- | --- |
| 一个新开发者需要在应用启动前配置六个服务 | 按顺序打开每个 dashboard,捕获密钥,写进 `.env` 和 CI |
| 一次一次性迁移需要按特定顺序切换一些开关 | 把这些不可逆的步骤排在确认关卡之后依次执行 |
| 一个项目要从状态 A 一次性搬到状态 B | 走一遍这次转换,报告哪些做不到 |
| 你正要把这些步骤写进一份 README | 改为写一个可执行版本,它不会像文档那样悄悄腐烂 |

不要用它来*决定*要构建什么;那件事该用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 和 [to-spec](https://aihero.dev/skills-to-spec)。

## Prerequisites

生成一个不需要任何前提。它写出的这个 wizard 跑在 bash 上,当某个阶段需要设置一个 GitHub secret 或 variable 时会用到 `gh`。如果 `gh` 缺失或没有认证,那个阶段会变成一条警告,结尾的总结会告诉你该手动设置什么,而不是让整次运行失败。

## Stages

一个 **stage** 是一个屏幕上的一件专注的任务。这个脚本会在各个 stages 之间清屏,所以一个溢出屏幕的 stage 会丢掉滚动出去的那部分。你按依赖顺序编写各个 stages,并设置 `TOTAL_STAGES`,它驱动进度显示。

界定范围发生在写下第一行之前。这个 [skill](https://www.aihero.dev/ai-coding-dictionary/skill) 会读仓库,而不是冷启动就问:`.env*`、`docker-compose*`、框架配置,以及 `.github/workflows/` 里每一处 `secrets.*` / `vars.*` 引用——这些都是 wizard 必须产出的值。然后它会把排好序的 stage 列表展示给你确认,只有在那之后,才把每个 stage 映射到人类要走的确切路径("Dashboard → Developers → API keys → Reveal test key → copy")。当它不知道当前的 UI 是什么样时,它会问你或者查文档,而不是编造点击步骤。

对每个被捕获的值,界定范围这一步会确定它落在哪里:

| 去处 | 什么时候 |
| --- | --- |
| 只进 `.env` | 本地开发需要它,CI 不需要 |
| GitHub secret | CI 会读它,而且它是敏感的 |
| GitHub variable | CI 会读它,而且它是公开的 |
| 既进 `.env` 又是一个 secret | 本地开发和 CI 都需要它 |
| 哪里都不进 | 这个 stage 是一个纯操作——切换一个开关、升级一个套餐 |

## The template already solves the UX

这份[模板](https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/template.sh)自带了整套体验:带剩余时间的进度显示、确认关卡、跨平台打开 URL(包括 WSL)、隐藏输入的 secrets、幂等的 `.env` upsert、`gh secret` / `gh variable` 写入,以及一份结尾的、列出所有被跳过内容的总结。`STAGES` 标记以上的一切都是一个固定的库,在每个 wizard 里都一样,从不手动编辑。这种一致性正是重点所在。你的工作只是界定这套流程的范围,并编写它的各个 stages。

写出一个 wizard 的 agent 从不端到端地运行它,因为它会打开浏览器、等待人类输入。它改用静态方式验证:`bash -n`、有条件就用 `shellcheck`,再加一次追踪,确认每个值都落在了界定范围时说的地方,每个 `set_secret` 的名字都匹配 CI 里一个真实的 `secrets.*` 引用。据此调整你的预期——第一次运行是你的,而那次运行就是测试。

## Ephemeral by default

| 你手上有什么 | 该怎么处理这个脚本 |
| --- | --- |
| 一次一次性迁移、一次个人 setup、一次你不会再重复的转换 | 保存到一个 scratch 或 `scripts/` 路径,运行它,删掉它 |
| 一条这个仓库下一个人也会需要的 setup 路径 | 提交它,并从 README 链接过去,这样他们会运行这个脚本,而不是重新问一次 agent |

## Common questions

**我的 API keys 会进入模型的 context 吗?**

不会。Agent 写的是一个脚本;它不运行它。你自己运行这个脚本,它用隐藏的终端输入捕获密钥,直接写进 `.env` 或 `gh secret`。这个 wizard 是一个 CLI,模型没有接入它。有一点要注意:这只适用于 wizard 在运行时捕获的值。如果你在界定流程范围时把一个密钥粘进了聊天里,它就和任何其他粘贴的文本一样进了 [context](https://www.aihero.dev/ai-coding-dictionary/context)。

**我能返回去修正一个打错的值吗?**

运行中途不行。没有后退按钮——这些 stages 向前推进,stage 3 上的一个错误答案意味着 Ctrl-C、重新运行。重新运行的设计成本很低:任何已经写进 `.env` 的值都会作为默认值重新提供,所以你可以在做对的那些 stages 上直接按回车,只重新输入错的那个。这个问题在发布那周就被提出来了,一直没有关闭:"loved it! One thing though — is there a way to go back and correct what you've entered?"。

还有一个相关的 open bug。在一个 `ask` 提示里,方向键会插入 `^[[D` / `^[[C`,而不是移动光标,因为这个提示用的是 `read -r` 而不是 Readline([issue #741](https://github.com/mattpocock/skills/issues/741))。退格键能用;方向键不行。用删除键删回到错误的地方,而不是把光标移过去。

**它知道我已经配置过什么了吗?**

部分知道,比发布时那些反应假设的要少。它在问之前会先读仓库——你的 `.env` 文件、`docker-compose`、框架配置、CI 里的 `secrets.*` 引用——所以它界定范围时针对的是真正缺失的值,而不是像一份 README 那样从零开始。它不会做的是检查第三方服务本身。如果一个密钥已经存在于你的 `.env` 里,wizard 会把它作为默认值提供,按回车就会保留它;但如果你已经创建了 Stripe 账户、却从没保存过密钥,wizard 依然会把你送去那个 dashboard 拿它。

**它在整个工作流里处于什么位置——在 grilling 和 spec 之后吗?**

没有固定位置。它是一个独立工具,不是链条里的一步。常见的猜测是 `/grill-with-docs → /to-spec → /wizard`,这个顺序没问题,但真正的触发条件是一套手动流程出现了,这可以发生在任何时间点:开始之前、构建过程中,或者发布很久之后。它也能当作一个发现工具用:界定范围这一步会在你投入这份工作之前,把一个任务隐藏的前提条件摆出来,比如你没想到的那三个 API keys。

**它在 Claude Code 之外能用吗?**

产出的 artifact 无条件能用:它是一个纯 bash 脚本,不在乎是哪个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 生成了它。这个 skill 本身是 model-invoked 的,所以它到处都被列出来——在 Claude Code 里输入 `/wizard`,或者在 Codex 里输入 `$wizard`,或者干脆描述一下你卡在哪个 setup 上。是 model-invoked 也让它躲开了 [#693](https://github.com/mattpocock/skills/issues/693) 这个问题——Claude 的桌面端和网页端会把*user-invoked* 的 skills 从 [model](https://www.aihero.dev/ai-coding-dictionary/model) 的列表里去掉,报告说它们没有安装。

**这个以前不是 user-invoked 的吗?**

是的。它现在是 model-invoked 的,所以当它碰到一个你必须亲自完成的步骤时,agent 会不需要提示就主动使用它。以前能做的事一样都没失效——model-invocation 只会*增加* agent 的可触达性,从不会拿走你的,所以 `/wizard` 的行为和以前完全一样。变化的是它退役掉的那种失败模式:agent 在构建中途撞上一堵凭证之墙,把六个编号步骤倒进聊天里让你手动照做。

**它以前在 `in-progress/` 里——现在在哪?**

从 v1.2 起在 `engineering/` 里。它从 beta bucket 毕业了,现在随 plugin 一起发布,所以它和其余被推广的集合一起到达,不需要单独安装。毕业过程没有改变它的行为。

## It's working if

- 在任何脚本存在之前,你会看到一份排好序的 stage 列表,以及每一个会产出的值,并被要求确认。
- 每个 URL 都在向你要那个页面上的值之前先被打开。你从不会被要求粘贴一个你还没被送去获取的东西。
- Secrets 是盲打输入的。没有任何敏感信息回显到你的终端历史里。
- 每个 stage 都装得进一屏。你还需要的东西不会被滚动没顶。
- Ctrl-C 之后重新运行,会从你离开的地方继续,并把已经保存的值作为默认值提供。
- 最后一屏列出了它写了什么,并单独列出了它做不到、需要你手动完成的东西。

## Where it fits

`wizard` 是一个随时可用的独立工具,坐在自动化止步、人类必须动手点击的那条线上。它最近的邻居是 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills),因为两者存在的目的都是让一个仓库进入可工作的状态——那一个配置的是这套 skills 本身,而 `wizard` 为其他一切生成一条 setup 路径。它也和 [implement](https://aihero.dev/skills-implement) 搭配:当一次构建落地了一个需要凭证或手动切换的 feature 时,wizard 就是人类那一半工作被完成的方式。当你拿不准此刻该用哪个 skill 时,[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你路由。
