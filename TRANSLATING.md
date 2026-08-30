# Translating This Repo

This repository is English-primary. Every user-facing document has a Simplified
Chinese sibling file that appends `.zh-CN` before the extension, in the same
directory (for example `SKILL.md` and `SKILL.zh-CN.md`). English files are the
canonical source and are never rewritten; the only change made to them is a
language-switcher line at the top of the body (after YAML frontmatter where
present).

Chinese translations are adapted from
[yangshun2005/mattpocock-skills-cn](https://github.com/yangshun2005/mattpocock-skills-cn)
(which itself builds on the vinvcn localization) and
[devcxl/mattpocock-skills-zh](https://github.com/devcxl/mattpocock-skills-zh),
then reconciled against upstream `mattpocock/skills`.

## What gets translated

Natural-language prose only: explanations, instructions, `description`
frontmatter values in `*.zh-CN.md` copies, and user-facing prompts.

## What is preserved exactly

- Directory names, skill names, slash commands, CLI commands
- Code blocks, inline code, file paths, URLs
- Package names, tool and API identifiers, environment variable names
- Frontmatter keys; the `name` value stays the English ASCII slug
- Markdown structure: heading levels, list nesting, tables, link targets

Keep standard engineering terms in English where that is clearer
(`seam`, `deep module`, `tracer bullet`, `red-green-refactor`, `mock`), or give
the Chinese gloss next to the English term on first use.

## Install paths

Installation examples point at this fork: `evan188199-tech/skills`. Prose that
describes the upstream project itself keeps referring to `mattpocock/skills`.
Attribution to upstream and to the localization sources is never removed.

## Syncing from upstream

1. Fetch upstream `main` and diff the in-scope paths against the last synced
   upstream SHA recorded in `README.md`.
2. For changed files, update the English file, then update the `.zh-CN.md`
   sibling following the rules above.
3. Add or remove `.zh-CN.md` siblings together with their English files.
4. Run `node scripts/check-bilingual.mjs` and fix every failure.
5. Append one sync-record line to `README.md` and `README.zh-CN.md` with the
   date, the upstream short SHA, and a one-sentence change summary.
