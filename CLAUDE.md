# Quantum Zeno Effect

A GitHub Pages course where a complete beginner (no physics or quantum background, school
arithmetic only) learns the quantum Zeno effect: a rotating two-level state on a 3D Bloch
sphere, interrupted by measurements the learner sets, beside a plot of survival
probability vs. measurement rate. Like `higher-dimensions`, it is just a page for learning
the topic, nothing more.

Part of the `instructional-pages` organization: its shared rules (`../CLAUDE.md`, from
`claude-toolkit`) apply, and this file overrides them.

The spec is `docs/BRIEF.md`; decisions are in `docs/DECISIONS.md`. Check both before
asking the user anything.

- Repo is public: never commit personal paths, emails or secrets.
- Self-merge once `local-ci` passes (workspace default). Deploys go to GitHub Pages, run
  locally, no Actions.

## Not doing

- Anything beyond a learning page ("That's it").
- Quantum interpretations (Copenhagen, many-worlds, what "collapse" really is).
- Everything in the org's Not doing list (`~/projects/instructional-pages/CLAUDE.md`).

## Constraints

- Development costs $0 (workspace rule). Free static hosting only.
- Bundle budget: 50 KB gzipped, enforced by `.local-ci`.
