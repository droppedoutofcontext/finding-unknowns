---
name: finding-unknowns
description: >-
  Surface hidden requirements before building by generating small interactive
  HTML artifacts — blindspot passes, interviews, design-direction pickers,
  clickable mocks, tweakable plans, merge quizzes (from
  Thariq Shihipar's "A Field Guide to Fable: Finding Your Unknowns"). Use
  whenever a request is vague, aesthetic, or underspecified ("make it nicer",
  "improve this", "add notifications", "you decide the details"), when planning
  an ambiguous or architecturally risky feature, when porting a reference
  implementation, when presenting a plan or brainstorm options, or before
  merging/shipping a large change — even if the user never says "unknowns" or
  "HTML". Also use when the user asks to be interviewed or quizzed about a
  feature, or asks "what am I missing?".
---

# Finding Your Unknowns

Turn vague requests into precise prompts by surfacing what nobody has said out
loud yet. Instead of guessing and building, spend a few cheap minutes on a
small interactive HTML artifact that lets the user *recognize* their
requirements — then implement against a spec that actually matches what's in
their head.

## Why this works

The map is not the territory: the prompt you received is the map; the result
the user actually wants is the territory. The gap between them is made of
unknowns, and they come in four kinds:

|                       | You know it                          | You don't know it                                  |
|-----------------------|--------------------------------------|----------------------------------------------------|
| **User knows it**     | Known knowns — already in the prompt | **Unknown knowns** — the user's unstated taste, standards, house rules |
| **User doesn't know** | Known unknowns — open questions someone already noticed | **Unknown unknowns** — factors nobody has considered yet, including how good the result could even be |

Result quality is bottlenecked by the right-hand column. People are bad at
*stating* their standards but excellent at *recognizing* them: show four
rendered design directions and they will point instantly; ask "what style do
you want?" and they will shrug. So the job is to build cheap interactive
artifacts that move unknowns leftward into the prompt **before** expensive
implementation — every explainer, brainstorm, interview, and prototype is a
cheap way to find out what you didn't know.

Unaccounted unknowns make a prompt fail in both directions at once: too
specific, and you follow the instructions into a wall when a pivot was the
right move; too vague, and you fill the gaps with industry-default choices
that don't fit this task. And an unknown isn't always a detail — sometimes
it's the discovery that the problem should be solved a different way
altogether. Surface that; don't guess past it.

## When NOT to use this

If the request is already crisp and small (known knowns all the way down),
just do the work. An artifact for "fix this typo" is theater. Reach for this
skill when ambiguity × cost-of-redoing is high.

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
its blueprint in [references/techniques.md](references/techniques.md) before
building.

Two calibrations before you build:

- **Anchor on the user's starting point.** Where are they in their thinking,
  and how well do they know this domain and this codebase? A blindspot pass
  for a newcomer and for the module's author contain entirely different
  cards. If you don't know their starting point, ask — one sentence from
  them changes what you build.
- **Showing options only works if the user can recognize good.** If they
  don't yet know what good looks like in this domain, four variations just
  produce a shrug — teach the vocabulary first (Teach me my unknowns), then
  show directions.

## Rules for every artifact

HTML, because this information is spatial — options, diffs, timelines;
markdown flattens them. Trade a document the user would skim for one they'll
actually read.

1. **One self-contained HTML file, in the user's language.** Inline all
   CSS/JS, no CDNs, no fetches — it must open from `file://` and still work
   next year; put the `<script>` at the end of `<body>`. Save it out of git's
   way (a scratch directory, or a git-ignored `.unknowns/` in the project),
   named `<topic>-<technique>.html`. Render with the environment's
   artifact/canvas tool if one exists; otherwise write the file and open it
   (`open` on macOS, `xdg-open` on Linux, `start` on Windows).

2. **The artifact writes the user's next message for them.** Every selection
   control (checkbox, steal/skip chip, toggle, slider, radio) feeds a live
   "assembled reply" textarea with a copy button — the user clicks through,
   copies, pastes back, and you receive a precise prompt instead of a shrug.
   An artifact that doesn't produce the next prompt is a dead end. Copy must
   work everywhere: try the clipboard API, fall back to
   `select()` + `execCommand('copy')`, and leave the textarea selectable for
   a manual copy — sandboxed viewers block the clipboard API silently. Start
   from [assets/reply-skeleton.html](assets/reply-skeleton.html): it has this
   plumbing (selection state, chip cycling, reply rebuild, resilient copy)
   ready to adapt.

3. **Order by decision impact, not execution order.** Biggest architectural
   blast radius first; the choices most likely to be tweaked at the top;
   mechanical/obvious work collapsed at the bottom. The user's attention is
   the scarce resource — spend it where their answer changes the outcome.

4. **Show, don't interrogate.** A slider with a live before/after preview
   beats "how much contrast do you want?". Four rendered directions beat
   "what style?". Teach the professional vocabulary while you're at it, so
   the user's *next* prompt can be precise.

5. **Throwaway fidelity.** The mock only needs to be real enough to answer
   the question it was built for. Don't wire real data into a placement test.

6. **Verify before handing over.** Run
   `node scripts/verify_artifact.mjs <file>`
   ([source](scripts/verify_artifact.mjs)) — or equivalent checks if node is
   unavailable: inline JS parses, every id referenced from JS exists in the
   markup, no external URLs, script sits at the end of body. A broken copy
   button kills the whole loop silently.

## Workflow

1. Detect that the blocking problem is an unknown, not missing effort.
2. Pick from the table the cheapest technique that answers the blocking
   question; read its blueprint. One artifact per round — blending techniques
   inside a single artifact is fine when they serve the same decision.
3. Build the artifact and hand it to the user; say in one sentence what
   decision it's meant to extract.
4. The user interacts and pastes back the assembled reply.
5. Fold the answers into the implementation prompt (or the plan, or the PR)
   and proceed. For a big build, suggest starting implementation in a fresh
   session whose prompt is the artifacts themselves — the spec, the
   prototype, the decisions table, the notes from the previous attempt;
   planning context is noise once building starts. During long builds, keep
   implementation notes; before risky merges, offer the quiz.
