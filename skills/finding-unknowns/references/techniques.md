# Technique blueprints

Eleven artifact blueprints, grouped by phase. Each entry: when to use it, what
to build, and what reply the artifact must assemble for the user. All of them
obey the global rules in SKILL.md (self-contained HTML, assembled-reply box,
impact-first ordering, quiet chrome).

---

## Pre-implementation

### 1. Blindspot pass

**When:** The user is about to prompt you into unfamiliar territory (a module
they didn't write, a domain they don't know) and can't know what they're not
asking. Targets *unknown unknowns*.

**Build:** Scan the relevant code/context yourself first; calibrate the cards
to the user's starting point. Produce a set of blindspot cards (5–8 is the
sweet spot), each
card containing: the thing the user almost certainly doesn't know ("this auth
module also gates the webhook endpoints"), why it changes their request, and
a **copyable prompt fix** — one sentence they can splice into their prompt to
cover it. A "select all that apply" control assembles the chosen fixes into
one improved implementation prompt at the bottom.

**Reply assembled:** the user's original prompt, rewritten with every accepted
blindspot fix folded in.

### 2. Teach me my unknowns

**When:** A vague aesthetic/quality ask in a domain that has professional
vocabulary the user lacks — color grading, typography, audio mixing, data-viz.
"Make the video nicer" can't be executed; the user has taste (*unknown
knowns*) but no words for it. Choose this over Four design directions when
the user wouldn't yet *recognize* good in this domain.

**Build:** An interactive explainer: a vocabulary ladder (term → plain-English
meaning → what changing it looks like), a live preview region with sliders
and/or presets so the user can *feel* each parameter, and preset chips
("filmic", "punchy", "flat"). Every slider/preset the user touches is recorded.

**Reply assembled:** a precise professional request built from their
interactions — "lift shadows +10, warm midtones, slight teal in highlights" —
instead of "nicer".

### 3. Four design directions

**When:** A visual or UX task with many defensible answers. Asking "what style
do you want?" fails; showing works. Targets *unknown knowns*.

**Build:** Render the same screen/component four genuinely different ways
(e.g. ops console / editorial / kanban / terminal — pick contrasts that
actually span the space, not four shades of the same idea). Under each
direction: **steal / skip chips** for its individual elements (its header, its
density, its palette), so the user can compose a fifth direction out of
pieces.

**Reply assembled:** "Direction B overall, but steal A's header and D's
density" — written for them from the chips.

### 4. Mock before you wire

**When:** The open question is placement or interaction ("where does this
toolbar go?", "click or drag?"). Code-first means re-implementing per option.

**Build:** A clickable throwaway mock with the real screen roughed in and the
new element **toggleable between 2–3 placements**. Add A/B questions beside it
("does it need to survive scroll?"). No real data, no real handlers — just
enough to feel the interaction.

**Reply assembled:** chosen placement + answers to each A/B question, as a
self-filling reply template.

### 5. Brainstorm on an effort axis

**When:** Open-ended problem ("churn is up", "onboarding feels bad") with many
possible interventions and no shared sense of cost.

**Build:** 8–12 interventions **grounded in the actual codebase/product** (read
it first — generic ideas are worthless here), plotted along an effort axis
from ship-this-afternoon to quarter-long bet. Each has a one-line mechanism
("why this would work") and a **resonate checkbox**.

**Reply assembled:** the checked interventions, ordered, as "explore these
first: …".

### 6. The interview

**When:** An ambiguous feature where wrong guesses have architectural cost.
Targets *known unknowns* — yours, not the user's: the questions you'd
otherwise silently answer with assumptions.

**Build:** One question at a time, **ordered by architectural blast radius**
(storage model before button color; auth model before empty-state copy). Each
question: the options as radio/cards, the consequence of each option in one
line, and a "you decide" escape hatch. A **decisions table** fills in live as
they answer. For a handful of independent questions, skip the artifact and
interview directly in chat (question tools if available, else plain
messages) — the artifact earns its cost when questions are many,
interdependent, or the user needs the decisions table to keep track.

**Reply assembled:** the completed decisions table plus a ready-to-paste
implementation prompt built from it.

### 7. Point at a reference

**When:** The task is "port this" or "make it work like X". The unknown is
whether you actually understood the reference — prove it *before* porting.
Source code is the best reference there is — better than screenshots, docs,
or descriptions, even when it's in another language; a folder to read (or a
live site's underlying markup) beats a picture of the result.

**Build:** A semantics map: for each meaningful behavior of the reference,
a matched excerpt (reference code ↔ your planned equivalent), gotcha notes
("their retry is jittered; naive port loses that"), and an edge-case table
with confirm/override controls per row.

**Reply assembled:** confirmed mappings + user overrides, as the porting spec.

### 8. The tweakable plan

**When:** A plan needs sign-off before a big build. A linear plan buries the
decisions the user actually cares about under mechanical steps.

**Build:** The plan **sorted by likelihood-of-tweaking**, not execution order.
Uncertain choices (schema shapes, API contracts, naming) at the top, each
flagged with **toggleable alternatives** ("store as JSONB ⇄ separate table")
and annotated type interfaces. The mechanical work — migrations, wiring,
boilerplate — collapsed at the bottom.

**Reply assembled:** "approved with these toggles: …" — the plan diff, not a
re-explanation.

---

## During implementation

### 9. Implementation notes

**When:** Any build long enough that reality will diverge from the plan.
Silent deviations are unknowns being created in real time.

**Build:** A running log kept *while you work*, one entry per deviation:
what the plan said, what was actually true, the **conservative call you made**
and why. Edge cases get the conservative call and you keep going; a discovery
that undermines the plan's premise gets **surfaced immediately** — that
unknown means the problem may need a different solution, not a workaround.
End with **a few bullets (≈3) to fold into attempt #2** (or into the user's
mental model). Render as a timeline with plan-vs-reality columns.

**Reply assembled:** the three bullets, pre-formatted as the next prompt's
addendum.

---

## Post-implementation

### 10. The buy-in doc

**When:** The change needs a human to approve, merge, or champion it.
The unknown is their objections — pre-answer them.

**Build:** Lead with the thing itself: an animated/clickable demo of the new
flow at the top. Then a pre-emptive objections section — each likely reviewer
objection stated *in its strongest form* with the evidence answer beneath.
End with a sign-off table: **who needs to approve exactly what**.

**Reply assembled:** an approval checklist the user can forward, with open
objections marked.

### 11. Quiz me before I merge

**When:** A large diff is about to merge and the user has probably skimmed it.
The unknown is what *they* don't know about their own change.

**Build:** A merge-readiness report over the diff (grouped by risk, not by
file), ending in a **short quiz the user must pass** (≈6 questions): "what
happens to in-flight jobs during the migration?" Wrong answers don't just say
"wrong" — they **link back to the exact section** the user skimmed.

**Reply assembled:** quiz result + the sections flagged for re-reading, or
"passed — merging".
