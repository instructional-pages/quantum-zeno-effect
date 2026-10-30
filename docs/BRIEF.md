> Copied from the project backlog on 2026-10-30; now maintained here.

---
title: Quantum Zeno Effect
status: ready
created: 2026-10-28
updated: 2026-10-30
owner: instructional-pages
repo:
tags: [education, physics, quantum, web]
stack: [typescript, vite, webgl2]
effort:
priority:
---

# Quantum Zeno Effect

## Summary *

A GitHub Pages site where you learn about the quantum Zeno effect. Like
`higher-dimensions`, it is just a page for learning the topic, nothing more.
It goes under the user's instructional pages organization (`instructional-pages`).

## Problem *

Personal curiosity: the user wants to understand the quantum Zeno effect properly, and a
course is the way to learn it.

## Users and context

- A complete beginner: no physics background at all, let alone quantum ("even in
  physics. Even in quantum."), in a desktop web browser (GitHub Pages). The course teaches
  every physics and quantum idea it uses (state, probability, measurement, evolution).

## Success criteria *

- [ ] After the course, a complete beginner (no physics or quantum background) correctly predicts that
      measuring more often keeps the state from changing, and can say why (at short
      times the change grows quadratically, so frequent resets keep it near zero).

## Scope *

### Must (MVP)

- A GitHub Pages site that teaches the quantum Zeno effect.
- Main interactive view: a two-level state rotating (Rabi oscillation), interrupted by
  measurements the learner sets, beside a plot of survival probability vs. measurement rate.
- A short side note that "measurement" can be any strong interaction with the
  environment (decoherence); no density matrices.
- Math beside the pictures (amplitudes, the cos² survival formula). Assumes school
  arithmetic only: the course teaches angles, squaring, probability and cosine itself.
- Everyday analogies (coin, spinning top, watched pot) give the intuition before each idea,
  each flagged as an analogy and followed by where it breaks down.
- One lesson walks through a real experiment, Itano et al. 1990 (trapped beryllium ions,
  laser pulses as measurements), and its data.
- Up to about 10 lessons, so the basics are built from zero without rushing. Lesson 1 shows the effect in the simulation before explaining
  it (paradox first); later lessons build the basics that explain it.
- Ideal, instantaneous measurements only.
- The state is drawn on a 3D Bloch sphere (WebGL2); the course teaches what the sphere means.
  The rotation stays in one plane, so amplitudes are real and no complex numbers are needed.
- Sandbox controls: rotation speed, number of measurements, total time. A "run once"
  button gives a random outcome; many runs build up the probability curve.

### Later

- The anti-Zeno effect (frequent measurement speeding up decay).
- Quantum computing uses (Zeno-based error suppression, dynamical decoupling).
- Imperfect (weak) measurements, e.g. a measurement-strength slider.
- Complex numbers and phase (the rest of the Bloch sphere).

### Not doing

- Anything beyond a learning page ("That's it").
- Quantum interpretations (Copenhagen, many-worlds, what "collapse" really is).
- Everything in the org's Not doing list (`~/projects/instructional-pages/CLAUDE.md`).

## Constraints

- Development costs $0 (workspace rule). Free static hosting only.
- Bundle budget: 50 KB gzipped, enforced by `.local-ci`.

## Decided

- Topic: the quantum Zeno effect.
- Form: a GitHub Pages site for learning about it, like `higher-dimensions`.
- GitHub owner: the `instructional-pages` organization. Its shared rules
  (`~/projects/instructional-pages/CLAUDE.md`) apply: guided lessons then a sandbox,
  predict-then-reveal, dark minimal look, TypeScript + Vite, MIT, no analytics, English.
- Learner: a complete beginner, with no physics or quantum background; the course teaches
  every idea it needs.
- Simulation: rotating two-level state with learner-set measurements, plus a survival
  probability vs. measurement rate plot.
- Anti-Zeno effect: Later, not MVP.
- Experiments: one lesson on a real experiment.
- Repo name: `quantum-zeno-effect`.
- Success: the learner predicts the effect and can say why.
- Decoherence: a short side note only.
- Math: shown beside the pictures (org rule), not picture-only.
- Problem: personal curiosity.
- MVP is complete as listed; interpretations Not doing; QC applications Later.
- Length: up to about 10 lessons (was 5–7, raised for a complete beginner). Opening: paradox first.
- Math: school arithmetic only; the course teaches the rest.
- Phases: avoided; rotation in one plane with real amplitudes. Complex numbers Later.
- Analogies: yes, flagged as analogies, with where each breaks down.
- Experiment: Itano et al. 1990.
- Weak measurements: Later; MVP uses ideal measurements.
- State view: 3D Bloch sphere (WebGL2), not a 2D circle.
- Sandbox: rotation speed, measurement count, total time; single random runs plus the
  averaged curve.
- Bundle budget: 50 KB gzipped.

## Open questions *

- [x] Repo name? → `quantum-zeno-effect`.
- [x] Learner level? → Complete beginner, even in physics and quantum.
- [x] Interactive simulation of what? → Rotating two-level state interrupted by
      measurements, beside a survival probability vs. measurement rate plot.
- [x] Anti-Zeno effect in MVP? → Later.
- [x] Real experiments? → Yes, one lesson.
- [x] Measurement vs. decoherence? → A short side note, no density matrices.
- [x] Math or picture-only? → Math beside the pictures.
- [x] Success criteria? → Learner predicts the effect and can say why.
- [x] MVP complete as listed? → Yes.
- [x] Interpretations? → Not doing.
- [x] Quantum computing applications? → Later.
- [x] Course length? → Up to about 10 lessons.
- [x] Math assumed? → School arithmetic only.
- [x] Complex numbers / phases? → Avoided; Later.
- [x] Analogies? → Yes, flagged, with where they break down.
- [x] Opening? → Paradox first.
- [x] Which experiment? → Itano et al. 1990.
- [x] Weak measurements? → Later.
- [x] State view? → 3D Bloch sphere.
- [x] Sandbox controls? → Rate, count and time; random single runs and the averaged curve.
- [x] Bundle budget? → 50 KB gzipped.

## Risks and unknowns

- A 3D Bloch sphere is more to teach a complete beginner, and must fit
  the 50 KB budget.
- 2026-10-30: learner clarified: a complete beginner, even in physics.
- 2026-10-30: round 6: arithmetic-only math, no phases, up to ~10 lessons, flagged analogies.

## First session

- 

## References

- `instructional-pages/higher-dimensions`: the model this project follows (a learning page
  on GitHub Pages).

## Log

- 2026-10-28: created. Captured roughly; user will answer the open questions later.
- 2026-10-30: round 1: learner level, simulation, anti-Zeno (Later), one experiment lesson.
- 2026-10-30: round 2: repo name, success criterion, decoherence note, math shown.
- 2026-10-30: round 3: problem (curiosity), MVP confirmed, interpretations out, QC uses Later.
- 2026-10-30: round 4: length, paradox-first opening, Itano 1990, weak measurements Later.
- 2026-10-30: round 5: Bloch sphere, sandbox controls, random runs, 50 KB budget.
- 2026-10-30: learner clarified: a complete beginner, even in physics.
- 2026-10-30: round 6: arithmetic-only math, no phases, up to ~10 lessons, flagged analogies.
- 2026-10-30: idea → ready
