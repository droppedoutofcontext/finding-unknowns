# Contributing

Thanks for looking under the hood. This repo is small on purpose — one skill, its blueprints,
a verifier, evals, and live examples. Here is how the pieces fit and how to check your changes.

## Repo map

| Path | What it is |
|------|------------|
| `skills/finding-unknowns/SKILL.md` | The skill itself: when it triggers, the rules every artifact obeys, the workflow. |
| `skills/finding-unknowns/references/techniques.md` | Eleven technique blueprints (when / what to build / what reply to assemble). |
| `skills/finding-unknowns/assets/reply-skeleton.html` | The starting skeleton every artifact adapts: reply plumbing, chips, quiz mechanics. |
| `skills/finding-unknowns/scripts/verify_artifact.mjs` | Mechanical checks an artifact must pass before it reaches the user. |
| `skills/finding-unknowns/evals/` | Adherence evals: prompts, fixtures, assertions, and the run/grade protocol. |
| `docs/` | GitHub Pages site: landing page, [live examples](https://droppedoutofcontext.github.io/finding-unknowns/), hero GIF/MP4 and social preview. |

## Running the checks

The only dependency is Node 20+. CI ([`verify.yml`](.github/workflows/verify.yml)) runs exactly this:

```bash
# the skeleton (placeholders allowed) and every shipped example must pass the verifier
node skills/finding-unknowns/scripts/verify_artifact.mjs skills/finding-unknowns/assets/reply-skeleton.html --template
for f in docs/examples/*.html; do
  node skills/finding-unknowns/scripts/verify_artifact.mjs "$f"
done

# every eval fixture path must exist
node -e '
  const fs = require("fs"), path = require("path");
  const dir = "skills/finding-unknowns/evals";
  const evals = JSON.parse(fs.readFileSync(path.join(dir, "evals.json"), "utf8")).evals;
  const missing = evals.flatMap(e => e.files || []).filter(f => !fs.existsSync(path.join(dir, f)));
  if (missing.length) { console.error("Missing: " + missing.join(", ")); process.exit(1); }
  console.log("All eval fixture paths exist.");'
```

Run both before opening a PR.

## What contributions are welcome

**A new technique.** A technique is three things, and a PR should bring all of them:

1. A row in the "Choosing a technique" table in `SKILL.md` — phase, situation, name.
2. A blueprint in `references/techniques.md` following the existing shape: **When** (which
   unknown quadrant it targets), **Build**, **Reply assembled**. If it doesn't end in an
   assembled reply the user pastes back, it isn't a technique for this skill — see rule 2
   in `SKILL.md`.
3. Ideally a live example in `docs/examples/` that passes the verifier and follows the
   quiet-chrome contract (rule 5): the artifact's own UI stays monochrome and plain; style
   lives only inside `.preview` regions.

**Verifier improvements.** `verify_artifact.mjs` is deliberately dependency-free (no DOM
library, no npm install). New checks should stay that way and should catch a failure mode
that actually kills the loop — a broken copy button, a dead listener, an external fetch.

**Eval results.** The evals README describes a two-stage outcome methodology that nobody has
run at scale. If you run it — with any model — open an issue with the numbers, positive or
negative. Negative results are just as welcome; the README's claims stay only as strong as
the evidence.

**Translations.** README translations follow the `README.<lang>.md` pattern and should track
the English one's structure. The skill itself stays in English (it's read by models), but
artifacts it produces are always in the user's language — that's rule 1.

**Evals.** Negative evals matter as much as positive ones: a technique that fires on
"rename this variable" is a bug. If you add a trigger, add a case where it must not fire.

## Style

- Artifacts: one self-contained HTML file, no CDNs or fetches, script at the end of body,
  must open from `file://`. The verifier enforces most of this.
- Prose (skill text, blueprints, READMEs): short sentences, no arrow chains or glyph
  shorthand — the same plain-prose rule the artifacts follow.
- Keep the changelog: user-visible changes get a line in `CHANGELOG.md`.

## Releasing (maintainers)

Bump `version` in `.claude-plugin/plugin.json`, add a `CHANGELOG.md` section, tag `vX.Y.Z`.
