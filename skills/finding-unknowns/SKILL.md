---
name: finding-unknowns
description: >-
  Builds a small interactive HTML page the user clicks through (option cards,
  steal/skip chips, sliders, a quiz) that assembles a precise reply for them
  to paste back, so hidden requirements surface before expensive work. Use
  when a request is underspecified AND a wrong guess is costly to redo: vague
  aesthetic or quality asks about a page, screen or design ("make it look
  professional", "it looks off"); a new feature with open architectural
  choices ("help me pin this down before we build"); porting or matching a
  reference implementation; a plan that needs sign-off; plan-vs-reality notes
  during a long build the user expects to diverge; a large diff the user
  admits they skimmed before merging. Also use when the user asks to be
  interviewed or quizzed, or asks "what am I missing?". Do not use for small,
  local or easily reversible work (speed up or refactor one function, fix a
  bug, rename), when 1-3 quick questions in chat would settle it, or when no
  human is there to click (headless or subagent runs).
---

# Finding Your Unknowns

Turn vague requests into precise prompts by surfacing what nobody has said out
loud yet. Instead of guessing and building, spend a few cheap minutes on a
small interactive HTML artifact that lets the user *recognize* their
requirements, then implement against a spec that matches what's in their head.
Adapted from Thariq Shihipar's essay "A Field Guide to Fable: Finding Your
Unknowns".

All paths below are relative to this skill's base directory (shown when the
skill loads). Your working directory is the user's project, so call scripts
by absolute path: `node <skill-dir>/scripts/verify_artifact.mjs <artifact>`.

## Why this works

The prompt is the map; the result the user wants is the territory. The gap
between them is made of unknowns:

|                       | You know it                          | You don't know it                                  |
|-----------------------|--------------------------------------|----------------------------------------------------|
| **User knows it**     | Known knowns — already in the prompt | **Unknown knowns** — the user's unstated taste, standards, house rules |
| **User doesn't know** | Known unknowns — open questions someone already noticed | **Unknown unknowns** — factors nobody has considered yet |

Quality is bottlenecked by the right-hand column. People are bad at *stating*
their standards and excellent at *recognizing* them: show four rendered
directions and they point instantly; ask "what style?" and they shrug.
Sometimes the unknown isn't a detail but a sign the problem should be solved
another way. Surface that; don't guess past it.

## First: defaults, chat, or artifact?

Use the cheapest channel that settles the blocking unknown.

1. **Proceed with stated defaults** when a wrong guess is cheap to redo (one
   function, a bug fix, a copy tweak), when the user said "just do it" or
   "your call", or when no human can answer (headless run, subagent, CI).
   List each assumption in one line, then build.
2. **Ask in chat** when 1–3 independent questions settle it and each option
   fits in a sentence. Use a question tool if the host has one. No artifact.
3. **Build an artifact** only when at least one of these holds:
   - the answer has to be seen to be chosen (visual, layout, aesthetic);
   - there are 4+ questions, or the questions depend on each other;
   - options need side-by-side comparison;
   - the user asked to be interviewed or quizzed.

If torn between 2 and 3, pick 2, and escalate to an artifact if the answers
come back "not sure".

## Choosing a technique

| Phase | Situation | Technique (blueprint in references/techniques.md) |
|-------|-----------|--------------------------------------------------|
| Pre   | Working in unfamiliar code/domain; "what am I missing?" | Blindspot pass |
| Pre   | Vague aesthetic ask ("make it nicer") in a domain with pro vocabulary | Teach me my unknowns |
| Pre   | Visual/UX task with many valid answers | Four design directions |
| Pre   | UI placement or interaction question | Mock before you wire |
| Pre   | Open-ended problem, many possible interventions | Brainstorm on an effort axis |
| Pre   | Ambiguous feature with architectural consequences | The interview |
| Pre   | Porting or matching a reference implementation | Point at a reference |
| Pre   | Plan needs sign-off before a big build | The tweakable plan |
| During| Long build where reality will diverge from plan | Implementation notes |
| Post  | Change needs reviewer/stakeholder buy-in | The buy-in doc |
| Post  | Large diff about to merge | Quiz me before I merge |

Diagnose which quadrant is blocking you, pick the row that matches, then read
its blueprint in `references/techniques.md` before building.

Two calibrations before you build:

- **Anchor on the user's starting point.** A blindspot pass for a newcomer
  and for the module's author contain entirely different cards. If you don't
  know where they stand, ask; one sentence from them changes what you build.
- **Showing options only works if the user can recognize good.** If they
  don't yet know what good looks like in this domain, teach the vocabulary
  first (Teach me my unknowns), then show directions.

## Rules for every artifact

HTML, because this information is spatial: options, diffs, timelines.
Markdown flattens them.

1. **One self-contained HTML file, in the user's language.** Inline all
   CSS/JS, no CDNs, no fetches: it must open from `file://` and still work
   next year. Put the `<script>` at the end of `<body>`. Name it
   `<topic>-<technique>.html` and save it to the session's scratch directory
   if the host gives one, else to `.unknowns/` in the project. If the host
   has an artifact or canvas tool, render it there and satisfy that tool's
   page contract (the skeleton's color tokens and dark-mode block are built
   for it). Otherwise open the file (`open`, `xdg-open` or `start`) and always
   print its absolute path, since nothing opens in a remote session.

2. **The artifact writes the user's next message.** Start from
   `assets/reply-skeleton.html`. Keep its reply block (`#out`, `#extra`,
   `#copyBtn`, `#copied`, `#sendBtn`) and its copy handler unchanged. Every
   control must update the reply through `rebuild()`. Reuse the chips, option
   cards and quiz where they fit; add a slider, checkbox, toggle or table
   only when the blueprint calls for one. The page explains itself: a lede
   naming the decision, a one-line hint on how to use it and that the reply
   gets pasted back, and the "What is this?" section.

3. **Order by decision impact, not execution order.** Biggest architectural
   blast radius first, the choices most likely to be tweaked at the top,
   mechanical work collapsed at the bottom.

4. **Show, don't interrogate.** A slider with a live before/after preview
   beats "how much contrast do you want?". Four rendered directions beat
   "what style?". Teach the professional vocabulary while you're at it, so
   the user's *next* prompt can be precise.

5. **Quiet chrome, faithful content.** Don't restyle the skeleton: no new
   fonts, sizes, colors, gradients or shadows outside `.preview`. Color in
   the chrome means only the user's decision state. Inside `.preview`, show
   the thing being decided in its real or proposed style, never a generic
   demo. Microcopy and the reply are plain sentences or bullets, with no
   arrows or symbol shorthand.

6. **Throwaway fidelity.** The mock only needs to be real enough to answer
   the question it was built for. Don't wire real data into a placement test.

7. **Verify before handing over.** Run
   `node <skill-dir>/scripts/verify_artifact.mjs <artifact>`, or check by
   hand if node is unavailable: inline JS parses, every id referenced from JS
   exists, no external URLs, script at the end of body, reply plumbing
   intact. If a browser tool is available, also open the artifact and click
   one control to confirm the reply changes; a static check can't catch a
   listener that never fires.

## The decisions ledger

A decision the user makes through an artifact outlives the turn. Once the
user accepts decisions, append them to `.unknowns/decisions.md` in the
project, one dated line each ("2026-07-10 — share links: expiring token,
7 days, revocable"), and say in one line that you did. When this skill
triggers, read the ledger first and don't re-ask anything already settled.
The ledger is worth committing; the HTML is throwaway. Never edit
`.gitignore`, create branches or commit without asking. Implementation notes
(technique 9) live next to the ledger as `.unknowns/notes-<topic>.md`.

## Workflow

1. Confirm the blocking problem is an unknown, not missing effort, and pass
   the gate above. Check `.unknowns/decisions.md` for what's already settled.
2. Pick the cheapest technique that answers the blocking question and read
   its blueprint. One artifact per round; blending techniques inside one
   artifact is fine when they serve the same decision.
3. Build the artifact, verify it, hand it over, and say in one sentence what
   decision it's meant to extract.
4. Receive the pasted reply with care. This is where the loop's value lands
   or leaks.
   - Anything left unanswered is a "you decide": name the defaults you're
     choosing in one line, so silence never turns into a silent guess.
   - If two selections contradict each other, or the free note contradicts a
     selection, ask about that one conflict in chat. Don't rebuild the
     artifact.
   - Play back the accepted decisions in one short paragraph and append them
     to the ledger.
5. Fold the answers into the implementation prompt, plan or PR, and proceed.
   - If the accepted design was composed from pieces of different options
     ("B, but A's header and D's density") and redoing is expensive, nobody
     has seen that combination yet. Render it once as a final mock for
     sign-off, one round of tweaks at most. For web UIs, where a mock costs
     about as much as the real thing, build it and show it live instead.
   - For a big build, suggest starting implementation in a fresh session
     whose prompt is the artifacts themselves: the spec, the prototype, the
     decisions, the notes from the last attempt.
   - During long builds keep implementation notes; before risky merges,
     offer the quiz.
