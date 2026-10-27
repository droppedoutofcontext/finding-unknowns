<div align="center">

# finding-unknowns

**People can’t describe what they want. They recognize it instantly.**

A Claude Code skill for prompts that aren’t specs yet. Instead of guessing, Claude builds a small
interactive page. You point at what you like, and the page writes your next prompt.

[![verify](https://github.com/droppedoutofcontext/finding-unknowns/actions/workflows/verify.yml/badge.svg)](https://github.com/droppedoutofcontext/finding-unknowns/actions/workflows/verify.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-17181c)](#install)
[![Ideas by @trq212](https://img.shields.io/badge/ideas_by-%40trq212-1c9bf0)](https://x.com/trq212/article/2073100352921215386)

**English** · [Русский](README.ru.md)

<a href="https://droppedoutofcontext.github.io/finding-unknowns/"><img src="docs/hero.gif" width="100%" alt="A vague prompt becomes four design directions. The user takes and skips pieces, each click flies into an assembled reply, the reply is pasted back into the chat, and four more techniques play the same loop."></a>

**[Live examples](https://droppedoutofcontext.github.io/finding-unknowns/)** · [Install](#install) · [How it decides](#when-it-fires)

</div>

## Why

Agents rarely fail at writing code. They fail earlier, on a prompt that is missing requirements,
taste, edge cases or review criteria. The agent fills the gaps with defaults and returns something
that works but isn’t what you meant.

> “Make it look more professional.”  
> “Add sharing, you decide the details.”  
> “Port it from this reference.”  
> “Am I ready to merge this?”

Asking “what style do you want?” gets a shrug. Showing four rendered directions gets an instant
answer. This skill spends a few cheap minutes on that kind of showing before the expensive build.

## How it works

1. **Render.** Claude notices the blocking unknown and builds one self-contained HTML page:
   options, mocks, questions, or a quiz.
2. **Point.** You click what you recognize. Take a piece, skip a piece, pick an answer, move a slider.
3. **Paste.** The page assembles your reply as you click. Copy it back into the chat, or send it
   directly where the host allows.
4. **Build.** Claude builds against the decisions you made, and records them in
   `.unknowns/decisions.md` so nothing settled gets asked twice.

## Try it

Each example is exactly what the skill hands you in a session. Click through; the reply at the
bottom writes itself.

| | |
|---|---|
| [**Four design directions**](https://droppedoutofcontext.github.io/finding-unknowns/examples/design-directions.html) | “Make the dashboard look more professional.” Four honest answers; take and skip pieces until a fifth assembles itself. |
| [**The interview**](https://droppedoutofcontext.github.io/finding-unknowns/examples/share-link-interview.html) | “Add share-via-link, you decide the details.” Five questions ordered by architectural blast radius. |
| [**Quiz me before I merge**](https://droppedoutofcontext.github.io/finding-unknowns/examples/merge-quiz.html) | “I only skimmed the diff.” A risk-grouped report, then six questions; wrong answers point at what you skimmed. |

## Install

As a Claude Code plugin:

```text
/plugin marketplace add droppedoutofcontext/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

Or as a plain skill, for any runtime that reads `~/.claude/skills/`:

```bash
git clone https://github.com/droppedoutofcontext/finding-unknowns
cp -r finding-unknowns/skills/finding-unknowns ~/.claude/skills/
```

Then just work. The skill triggers on vague or high-stakes requests, or when you ask “what am I
missing?”, “interview me”, or “quiz me before I merge”.

## When it fires

An artifact costs a few minutes, so the skill first picks the cheapest channel that settles the
unknown:

| Situation | What Claude does |
|---|---|
| A wrong guess is cheap to redo, or nobody is there to answer (headless, subagent, CI) | Lists its assumptions in one line and builds |
| One to three independent questions settle it | Asks them in chat. No page |
| The answer has to be seen to be chosen, there are many interdependent questions, or you asked to be interviewed or quizzed | Builds an artifact |

“Fix this typo” never gets a page. “Make the landing page look professional” does.

## Techniques

| Phase | Technique | What you get |
|---|---|---|
| Before | **Blindspot pass** | What you couldn’t know to ask about unfamiliar code, with a prompt fix for each |
| Before | **Teach me my unknowns** | Vocabulary and live sliders for taste you can’t name yet |
| Before | **Four design directions** | Four rendered answers; compose a fifth from parts |
| Before | **Mock before you wire** | Placement and interaction tested on a throwaway mock |
| Before | **Brainstorm on an effort axis** | Interventions from this-afternoon to quarter-long bets |
| Before | **The interview** | Decisions ordered by blast radius, with a live decisions table |
| Before | **Point at a reference** | Proof you understood the reference before porting it |
| Before | **The tweakable plan** | The plan sorted by what you’re most likely to change |
| During | **Implementation notes** | Plan versus reality, logged as you build |
| After | **The buy-in doc** | Reviewer objections answered before review |
| After | **Quiz me before I merge** | Do you actually know your own diff? |

The rules and blueprints live in [`SKILL.md`](skills/finding-unknowns/SKILL.md) and
[`references/techniques.md`](skills/finding-unknowns/references/techniques.md).

## The artifact contract

- One HTML file, in your language, with no CDN, fetch or external dependency. It opens from `file://`.
- Quiet chrome: color only marks your decisions. Styling lives inside the previews, which show the thing
  being decided in its real or proposed look.
- Every control feeds the assembled reply. The copy button tells the truth: when a sandboxed viewer
  blocks the clipboard, it leaves the text selected and says so instead of claiming success.
- Before handing it over, the skill runs a dependency-free verifier:

```bash
node skills/finding-unknowns/scripts/verify_artifact.mjs path/to/artifact.html
```

## Does it work?

A small eval set: seven tasks, four binary checks each.

- **Positive evals (0–3)**, where the skill should run its loop: **16/16** with the skill, **3/16**
  without. These measure adherence (did the loop happen), not whether the final result was better.
  The baseline can’t pass the artifact checks by construction.
- **Negative evals (4–6)**, new in 0.3.0: a small local change, a cheap UI tweak, and a feature with
  two independent questions. The skill should stay out of the way. No numbers published yet.

The protocol, fixtures and an outcome-eval design nobody has run at scale yet are in
[`evals/`](skills/finding-unknowns/evals/). If you run them, please open an issue with the numbers,
whichever way they point.

## Contributing

New technique blueprints, verifier checks and eval results are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the repo map and the checks CI runs.

## Credits

Adapted from [Thariq Shihipar](https://x.com/trq212)’s
[“A Field Guide to Fable: Finding Your Unknowns”](https://x.com/trq212/article/2073100352921215386) and
his [demo artifacts](https://thariqs.github.io/html-effectiveness/unknowns/index.html). This repo is an
independent packaging of the workflow as a Claude Code skill, not affiliated with Thariq or Anthropic.
MIT.
