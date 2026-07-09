# Changelog

## 0.2.0 — 2026-07-10

### Skill
- **Decisions ledger.** Decisions extracted through artifacts now persist in
  `.unknowns/decisions.md` — read on every trigger, appended after every
  round, worth committing. One-shot extraction becomes a growing spec.
- **Reception rules.** The workflow now covers the return leg of the loop:
  unanswered items become explicit "you decide" defaults, contradictions get
  one chat question instead of a rebuilt artifact, and accepted decisions are
  played back before building.
- **Richer skeleton.** `reply-skeleton.html` gains pick-one option groups
  (the `.opt` CSS existed but was never wired) and self-grading quiz
  questions with score and re-read list in the assembled reply — the two
  mechanics every interview and merge-quiz artifact was rewriting from
  scratch.
- **Live verification.** Rule 7 now asks for a click-through check in a
  browser when one is available; the static verifier can't catch a listener
  that never fires.
- **Implementation notes rescoped** as a markdown practice in
  `.unknowns/notes-<topic>.md` — an HTML timeline nobody interacts with was
  theater by the skill's own standards.

### Repo
- **Evals fixed.** Eval 0's `landing.html` fixture was missing entirely and
  all fixture paths pointed at a nonexistent `inputs/` directory; both
  repaired. `evals/README.md` documents the run/grade protocol, states
  plainly that the 16/16-vs-3/16 number is an adherence score (the baseline
  cannot pass artifact assertions by construction), and specifies a
  two-stage outcome methodology.
- **Live examples.** `docs/` gains three real artifacts — four design
  directions, the share-link interview, the merge quiz — click-through demos
  of exactly what the skill hands you in a session, ready to serve from
  GitHub Pages.
- **CI.** A workflow verifies the skeleton and every example artifact with
  `verify_artifact.mjs` and checks that all eval fixture paths exist.

## 0.1.1 — 2026-07-06

Initial public release: the eleven-technique skill, technique blueprints,
reply skeleton, artifact verifier, adherence evals, bilingual README.
