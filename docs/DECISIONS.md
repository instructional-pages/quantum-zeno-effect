# Decisions

Each entry: the question, the choice, and why. Newest at the bottom.
Entries dated 2026-10-30 were settled while writing the brief (`docs/BRIEF.md`) or when
starting the repo.

## 2026-10-30: Topic and form

- **Question:** What is this project?
- **Choice:** A GitHub Pages site for learning the quantum Zeno effect, like `higher-dimensions`, and nothing more.
- **Why:** Personal curiosity: the user wants to understand the effect properly, and a course is the way to learn it.

## 2026-10-30: Name and owner

- **Question:** What is the repo called, and where does it live?
- **Choice:** `quantum-zeno-effect`, under the `instructional-pages` organization.
- **Why:** Full descriptive name per the workspace naming rule; the org holds the user's courses and its shared rules apply.

## 2026-10-30: Learner level

- **Question:** Who is the course pitched at?
- **Choice:** A complete beginner, with no physics or quantum background. The course teaches every idea it uses (state, probability, measurement, evolution).
- **Why:** The user's own words: a beginner "even in physics. Even in quantum."

## 2026-10-30: Math assumed

- **Question:** What math can the course assume?
- **Choice:** School arithmetic only. The course teaches angles, squaring, probability and cosine itself.
- **Why:** Follows from the complete-beginner learner.

## 2026-10-30: Math or picture-only

- **Question:** Show the math, or keep it picture-only?
- **Choice:** Math beside the pictures: amplitudes and the cos² survival formula.
- **Why:** Org rule: intuition first, with the precise version beside it.

## 2026-10-30: Success criterion

- **Question:** How do we know the course works?
- **Choice:** The learner correctly predicts that measuring more often keeps the state from changing, and can say why (at short times the change grows quadratically, so frequent resets keep it near zero).
- **Why:** The goal is understanding *why*, not trivia.

## 2026-10-30: Main simulation

- **Question:** What does the interactive view simulate?
- **Choice:** A two-level state rotating (Rabi oscillation), interrupted by measurements the learner sets, beside a plot of survival probability vs. measurement rate.
- **Why:** It shows the effect directly and links one run to the averaged curve.

## 2026-10-30: State view

- **Question:** How is the state drawn?
- **Choice:** A 3D Bloch sphere (WebGL2), which the course teaches.
- **Why:** User's choice over a 2D circle. Risk noted: more to teach, and it must fit the bundle budget.

## 2026-10-30: Phases and complex numbers

- **Question:** Does the course use complex numbers?
- **Choice:** No. The rotation stays in one plane, so amplitudes are real. Complex numbers and phase are Later.
- **Why:** Keeps the math within school arithmetic.

## 2026-10-30: Sandbox controls

- **Question:** What can the learner change in the sandbox?
- **Choice:** Rotation speed, number of measurements and total time. A "run once" button gives a random outcome; many runs build up the probability curve.
- **Why:** Single runs show the randomness; the averaged curve shows the law.

## 2026-10-30: Measurements

- **Question:** Ideal or imperfect measurements?
- **Choice:** Ideal, instantaneous measurements only. Weak measurements (a strength slider) are Later.
- **Why:** Keeps the MVP focused.

## 2026-10-30: Measurement vs. decoherence

- **Question:** How much about decoherence?
- **Choice:** A short side note that "measurement" can be any strong interaction with the environment. No density matrices.
- **Why:** Enough to avoid a misconception without a new topic.

## 2026-10-30: Real experiment

- **Question:** Include a real experiment, and which?
- **Choice:** One lesson on Itano et al. 1990 (trapped beryllium ions, laser pulses as measurements) and its data.
- **Why:** Shows the effect is real, not only theory.

## 2026-10-30: Course length and opening

- **Question:** How long is the course, and how does it open?
- **Choice:** Up to about 10 lessons (raised from 5–7 for a complete beginner). Lesson 1 shows the effect in the simulation before explaining it (paradox first).
- **Why:** The basics are built from zero without rushing; the paradox motivates them.

## 2026-10-30: Analogies

- **Question:** Use everyday analogies?
- **Choice:** Yes (coin, spinning top, watched pot), before each idea, each flagged as an analogy and followed by where it breaks down.
- **Why:** Intuition first, without leaving a wrong picture behind.

## 2026-10-30: Scope cuts

- **Question:** What stays out of the MVP?
- **Choice:** Anti-Zeno effect, quantum computing uses, weak measurements and complex numbers are Later. Quantum interpretations are Not doing.
- **Why:** User's choices while refining the brief.

## 2026-10-30: Bundle budget

- **Question:** How big may the built site be?
- **Choice:** 50 KB gzipped, enforced by `.local-ci`.
- **Why:** Org rule: every course sets a budget; performance and minimalism get huge emphasis.

## 2026-10-30: Visibility

- **Question:** Public or private repo?
- **Choice:** Public from the first commit.
- **Why:** Org rule; confirmed by the user when the repo was created.
