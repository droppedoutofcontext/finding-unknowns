# Changelog

## 0.3.0 — 2026-10-27

### Skill
- **A gate before every artifact.** The skill now picks the cheapest channel
  first: stated defaults when a wrong guess is cheap or nobody can answer,
  one to three questions in chat when that settles it, an artifact only when
  the answer has to be seen or the questions depend on each other.
- **Narrower trigger.** The description names when to fire and, for the first
  time, when not to: small local changes, cheap tweaks, headless runs. The
  essay credit moved from the description into the body.
- **Executable as written.** Script paths are absolute from the skill's base
  directory; artifacts go to the host's scratch directory when it has one;
  the ledger is created only after decisions are accepted, and the skill
  never edits `.gitignore`, branches or commits without asking.
- **Rules 2 and 5 rewritten** shorter, and the blueprint/skeleton conflict
  resolved: blueprints may add a slider, checkbox or toggle as long as it
  feeds `rebuild()`. Arrow shorthand removed from the blueprints.

### Skeleton and verifier
- **Honest copy button.** It only says "Copied" when a copy actually
  happened; otherwise it leaves the text selected and says how to copy. The
  three live examples got the same fix.
- **Send to chat.** When the host exposes a way for a page to post into the
  chat, the skeleton shows a Send button next to Copy.
- **Skeleton bugs fixed:** a quote in a question no longer breaks the
  reply; the same chip label under two directions keeps two states; quiz
  answers lock after the first pick and say "Correct" or "Not quite" in text,
  not only color; unanswered questions are listed as "you decide"; the reply
  names the artifact it came from.
- **Dark mode and tokens.** Every skeleton color is a token, with a dark set.
- **Verifier:** catches CSS `url()`, `@import`, protocol-relative and
  unquoted external URLs, XHR and WebSocket; parse-checks each script on its
  own and skips JSON data blocks; requires a real `#out` textarea, a
  `#copyBtn` button and the `execCommand` fallback; flags leftover skeleton
  placeholders (`--template` skips that for the skeleton itself).
- **Negative evals 4–6** catch over-triggering: a small local change, a cheap
  UI tweak, and a feature with two independent questions.

### Repo
- **New hero.** A 22-second motion piece built in Remotion replaces the old
  wireframe GIF: the real four-directions artifact, chips flying into the
  assembled reply, the reply landing in the chat and the ledger, then four
  more techniques. GIF for the README, MP4 for the site.
- **Landing page.** `docs/index.html` is now a real landing: the loop, the
  three live examples with previews, the eleven techniques, the gate,
  install. Light and dark, phone-width safe. Social preview image included.
- **READMEs rewritten** in English and Russian around the new framing.
- **Keyboard-accessible chips** in the skeleton and the design-directions
  example, and CONTRIBUTING.md with the repo map and the CI checks.
- The Russian post kit and the old GIF/WebP moved out of the public repo.

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
