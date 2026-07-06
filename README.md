<div align="center">

# finding-unknowns

**The map is not the territory — the gap between them is your unknowns.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-7c6cf0)](#install)
[![Evals: 16/16 vs 3/16](https://img.shields.io/badge/evals-16%2F16_vs_3%2F16_baseline-177245)](#does-it-work)
[![Ideas by @trq212](https://img.shields.io/badge/ideas_by-%40trq212-1c9bf0)](https://x.com/trq212/article/2073100352921215386)

**English** · [Русский](README.ru.md)

A [Claude Code](https://claude.com/claude-code) skill that turns vague prompts into precise specs.
Instead of guessing and building, Claude spends a few cheap minutes on a small **interactive HTML
artifact** that helps you *recognize* what you couldn't state — then **writes your next prompt for you.**

<img src="docs/four-directions.gif" width="820" alt="Animated schematic: four wireframe dashboard directions, one element highlighted in each, assembling into a single dashboard">

<sub>The *four design directions* technique: four honest takes on one dashboard — you point at the pieces
you like, the artifact assembles them into one and writes your next prompt.</sub>

</div>

## Techniques

People are bad at *stating* their standards but great at *recognizing* them — show four rendered
designs and they point instantly; ask "what style?" and they shrug. Claude picks the technique that
fits and builds an artifact for it. Blueprints in [`SKILL.md`](skills/finding-unknowns/SKILL.md).

| Phase | Technique | What it pulls out of your head |
|-------|-----------|--------------------------------|
| Pre | Blindspot pass | unknown unknowns → prompt fixes |
| Pre | Teach me my unknowns | vocabulary for taste you can't name |
| Pre | Four design directions | point at a look; steal/skip per element |
| Pre | Mock before you wire | placement & interaction, before code |
| Pre | Brainstorm on an effort axis | what lands: afternoon → quarter |
| Pre | The interview | decisions by architectural blast radius |
| Pre | Point at a reference | prove the reference is understood first |
| Pre | The tweakable plan | plan sign-off, ranked by tweak-likelihood |
| During | Implementation notes | plan-vs-reality gaps, saved for attempt #2 |
| Post | The buy-in doc | reviewer objections, pre-answered |
| Post | Quiz me before I merge | do *you* understand your own diff? |

## Install

```
/plugin marketplace add droppedoutofcontext/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

Or copy the skill folder directly — `cp -r skills/finding-unknowns ~/.claude/skills/`. It's a
standard `SKILL.md` skill, so other agents that read the Agent Skills layout can load it too.

## Usage

Mostly you don't invoke it — it triggers on vague, aesthetic, or risky requests ("make it nicer",
"add sharing, you decide the details", "am I ready to merge this?"). To call it directly, name the
technique or the skill:

> *"interview me about this feature"* · *"do a blindspot pass on this module"* ·
> *"quiz me before I merge"* · `/finding-unknowns`

## Does it work?

Four realistic tasks, four binary checks each — **16/16** with the skill vs **3/16** baseline.
Baselines often *find* the same problems; the skill's edge is the loop, not raw insight — it turns
findings into your decisions and your next prompt instead of a wall of text. Small sample; rerun via
[`evals/`](skills/finding-unknowns/evals/evals.json). Tested on Fable 5 and Opus 4.8.

## Credits

Ideas by [Thariq Shihipar](https://x.com/trq212) — the
[field guide](https://x.com/trq212/article/2073100352921215386) and its
[demo artifacts](https://thariqs.github.io/html-effectiveness/unknowns/index.html). This repo is an
independent packaging of that workflow as a skill; the text is an original synthesis, not a copy.
Not affiliated with Thariq or Anthropic. MIT.
