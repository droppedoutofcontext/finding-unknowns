# Running the evals

Four realistic tasks, four binary assertions each. [`evals.json`](evals.json)
holds the prompts and assertions; [`inputs/`](inputs/) holds the fixtures.
`files` paths in `evals.json` are relative to this directory.

## Protocol

For each eval, run **two sessions** and grade both:

1. **Skill session.** Fresh working directory, copy the eval's `files` into it,
   start a fresh Claude Code session with the finding-unknowns plugin installed,
   paste the `prompt` verbatim, let it run to completion. No steering.
2. **Baseline session.** Same, without the plugin.

Grade each of the 4 assertions **pass/fail** against the full transcript plus
any files the session produced. An LLM judge (give it the assertion, the
transcript, and the produced files) or a human — either works; use the same
judge for skill and baseline. A run's score is passed assertions out of 4.

Artifacts produced by the skill session should also pass the mechanical check:

```
node ../scripts/verify_artifact.mjs <artifact.html>
```

## What these evals do and don't show

**These are adherence evals, not outcome evals.** They test whether the agent
recognizes the situation and executes the technique correctly — most
assertions require an interactive HTML artifact, which the baseline never
produces because nothing tells it to. So the headline number (16/16 vs 3/16
on Fable 5 and Opus 4.8, single run each) measures "the loop happened", not
"the result was better". Baselines often *find* the same problems; they just
deliver them as a wall of text instead of decisions the user can click
through.

To measure outcome, extend eval 0 or 1 with a second stage:

1. Take the skill session's assembled reply (simulate a user clicking through
   the artifact — pick a consistent persona and answer honestly from it) and
   feed it back; let the agent implement against the extracted spec.
2. In the baseline session, let the agent implement directly from the vague
   prompt.
3. Show both results to a blind judge with the persona's actual preferences
   and ask which one matches them. Repeat with a few personas — the skill's
   claim is precisely that different heads contain different answers.

Nobody has run the outcome stage at scale yet; if you do, please open an
issue with the numbers, whichever way they point.

## Planted subtleties (grader crib sheet)

- **Eval 0** (`inputs/landing.html`): the page is amateur in many separable
  ways — clashing gradient palette, blinking CTA, marquee, Comic Sans
  testimonials, shouting copy. A good artifact separates these into
  recognizable choices rather than fixing everything one way.
- **Eval 2** (`inputs/notes-fixture/`): the plan says config is JSON, the
  project migrated to YAML (deviation → conservative call); the plan persists
  counters in a database table, the project has no database at all, only a
  file store (premise break → surface immediately).
- **Eval 3** (`inputs/quiz-fixture/`): the diff renames `orders.status` to
  `state` while deployed workers still query `status` (in-flight breakage),
  and quietly stops retrying 4xx responses while raising max attempts.
