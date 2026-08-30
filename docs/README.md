# Documentation guide

This folder contains the human-facing guides for each skill. The `SKILL.md` files under `skills/` are the operational instructions your agent loads; these guides explain when to use each skill, how the workflows fit together, and what good output looks like.

## Start here

1. Install the skills from the [root README](../README.md#installation-30-second-setup).
2. Run `/setup-matt-pocock-skills` once in your repository; see [setup-matt-pocock-skills](engineering/setup-matt-pocock-skills.md).
3. If you do not know which skill to choose, read [ask-matt](engineering/ask-matt.md). It routes the common entry points.
4. To understand the writing principles behind these skills, read [writing-for-agents](productivity/writing-for-agents.md).

## Choose a path by goal

| You want to... | Read these guides |
| --- | --- |
| Clarify a loose idea before building | [grill-me](productivity/grill-me.md), [grilling](productivity/grilling.md), and [grill-with-docs](engineering/grill-with-docs.md) |
| Plan work that spans multiple sessions | [wayfinder](engineering/wayfinder.md), [to-spec](engineering/to-spec.md), and [to-tickets](engineering/to-tickets.md) |
| Implement and verify a change | [implement](engineering/implement.md), [tdd](engineering/tdd.md), and [code-review](engineering/code-review.md) |
| Investigate a bug or open question | [diagnosing-bugs](engineering/diagnosing-bugs.md) and [research](engineering/research.md) |
| Improve codebase structure over time | [codebase-design](engineering/codebase-design.md) and [improve-codebase-architecture](engineering/improve-codebase-architecture.md) |
| Keep shared language and decisions current | [domain-modeling](engineering/domain-modeling.md), then [grill-with-docs](engineering/grill-with-docs.md) |
| Move knowledge between people and sessions | [handoff](productivity/handoff.md), [to-questionnaire](productivity/to-questionnaire.md), and [teach](productivity/teach.md) |

## How the main workflow fits together

The main build chain is:

```txt
grill-with-docs -> to-spec -> to-tickets -> implement -> code-review
```

Not every change needs every step:

- If the work fits in one session, grill first, then go directly to `implement`.
- If the work spans sessions, write a durable [spec](engineering/to-spec.md), then split it into [tickets](engineering/to-tickets.md).
- If the work is too large to plan linearly, chart it with [wayfinder](engineering/wayfinder.md) first, then return to the spec-and-tickets chain.
- If a design question cannot be answered by talking, stop and build a [prototype](engineering/prototype.md).
- If you are unsure at any boundary, use [ask-matt](engineering/ask-matt.md) to route to the next skill.

## Guide index

### Foundation and routing

| Guide | Use it when... |
| --- | --- |
| [ask-matt](engineering/ask-matt.md) | You need help choosing a skill or workflow. |
| [setup-matt-pocock-skills](engineering/setup-matt-pocock-skills.md) | You are preparing a repository for the engineering skills. |
| [writing-for-agents](productivity/writing-for-agents.md) | You are writing or editing instructions that an agent will read. |

### Deciding and planning

| Guide | Use it when... |
| --- | --- |
| [grill-me](productivity/grill-me.md) | You have a loose idea and need a stateless interview, code or no code. |
| [grilling](productivity/grilling.md) | You want the reusable interview primitive used by the grilling workflows. |
| [grill-with-docs](engineering/grill-with-docs.md) | You need to align an idea with a codebase and record the result. |
| [domain-modeling](engineering/domain-modeling.md) | You are building or sharpening the project's shared vocabulary and ADRs. |
| [wayfinder](engineering/wayfinder.md) | The effort is too large for one session and needs a decision map. |
| [to-spec](engineering/to-spec.md) | Decisions are settled and need to survive across sessions. |
| [to-tickets](engineering/to-tickets.md) | A spec or plan needs tracer-bullet tickets with blocking edges. |
| [triage](engineering/triage.md) | Incoming issues need to become well-defined, ready work. |

### Building and reviewing

| Guide | Use it when... |
| --- | --- |
| [implement](engineering/implement.md) | A spec or ticket set is ready to build. |
| [tdd](engineering/tdd.md) | You want implementation driven by a red-green-refactor feedback loop. |
| [prototype](engineering/prototype.md) | A design question needs something you can react to. |
| [code-review](engineering/code-review.md) | A diff needs review against both repo standards and its spec. |

### Investigating and maintaining

| Guide | Use it when... |
| --- | --- |
| [diagnosing-bugs](engineering/diagnosing-bugs.md) | A bug or performance regression needs a disciplined diagnosis loop. |
| [research](engineering/research.md) | A question needs high-trust primary sources and a cited result. |
| [resolving-merge-conflicts](engineering/resolving-merge-conflicts.md) | A merge or rebase needs conflicts resolved by intent. |
| [codebase-design](engineering/codebase-design.md) | You need shared vocabulary for deep modules and clean seams. |
| [improve-codebase-architecture](engineering/improve-codebase-architecture.md) | You want a regular survey of architecture-deepening opportunities. |

### Collaborating and teaching

| Guide | Use it when... |
| --- | --- |
| [handoff](productivity/handoff.md) | Work must travel to another harness, directory, person, or session. |
| [to-questionnaire](productivity/to-questionnaire.md) | Someone else holds the answer and needs an async questionnaire. |
| [teach](productivity/teach.md) | You want a stateful teaching workspace with cited lessons. |
| [wait-what](productivity/wait-what.md) | An agent message did not land and needs a plain-language re-pitch. |
| [wizard](engineering/wizard.md) | A human must complete manual steps and needs an interactive guide. |

## Reading order for new users

If you are new to the project, this sequence gives you the core model in four guides:

1. [setup-matt-pocock-skills](engineering/setup-matt-pocock-skills.md)
2. [grill-me](productivity/grill-me.md)
3. [grill-with-docs](engineering/grill-with-docs.md)
4. [implement](engineering/implement.md)
