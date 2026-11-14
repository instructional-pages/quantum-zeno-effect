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

## 2026-10-30: Lesson outline

- **Question:** What lessons does the course have, and in what order?
- **Choice:** The ten lessons in `docs/LESSONS.md`, including its "Settled in review" choices: chance read from the arrow's height before the cos² form, degrees only, survival as "every check said up", and a "down" result doesn't end a run.
- **Why:** Approved by the user in PR #1.

## 2026-10-30: Where checks fall in a run (decided by Claude, pending review)

- **Question:** At what moments do the N checks of a run happen?
- **Choice:** Equally spaced, the last at the end of the run: check k at k/N of the way through. Lesson 1's "one check halfway through" is shown as a run of 2 checks (halfway and at the end), or by stopping the run halfway.
- **Why:** It is the placement behind lesson 8's table (1 check → 0, 2 → 0.25) and Itano's prediction (lesson 9), and the arrow's final position always matches the last answer.

## 2026-10-30: The first view

- **Question:** Should the first lesson PR build the real WebGL2 Bloch sphere, or a 2D placeholder?
- **Choice:** The real sphere, as a quiet wireframe: faint latitude lines and outline, the circle in use drawn bright, and the arrow as a solid shape on it.
- **Why:** The user's choice: it is final work, so nothing is thrown away.

## 2026-10-30: The sphere's viewpoint

- **Question:** Can the learner turn the sphere?
- **Choice:** No. A fixed view, turned 22° about the vertical and tipped 16° towards the viewer, so the circle in use reads as nearly round and the sphere still reads as 3D.
- **Why:** The user's choice: nothing extra to teach or operate, and the useful view can't be lost.

## 2026-10-30: Picture choices in checks (decided by Claude, pending review)

- **Question:** Lesson 2's check picks "from three drawings". How does a check show them?
- **Choice:** A choice prompt may carry one small SVG drawing per choice, shown on its button above the choice's letter (a, b, c); the reveal names the right letter. The sphere hides its arrow during that check.
- **Why:** It extends the shared choice prompt without a new component, the letter keeps the reveal readable, and hiding the arrow keeps the learner from reading off the answer.


## 2026-10-30: What a run does in lesson 3 (decided by Claude, pending review)

- **Question:** Lesson 3's runs check the arrow before lesson 4 explains checking. What does the learner see?
- **Choice:** Each run is a fresh arrow at the set angle, checked once; the arrow on the sphere stays where it is, and only the tally (and its last answer) changes. Moving the angle clears the tally.
- **Why:** It shows chances without teaching the jump to the answer a lesson early, and a tally only means something for one angle.

## 2026-10-30: Fractions as typed answers (decided by Claude, pending review)

- **Question:** Lesson 3's answer is ¾. Must the learner type 0.75?
- **Choice:** A typed prediction may also be a fraction ("3/4"), read as its value.
- **Why:** Chances in the lessons are worked out as fractions, so marking "3/4" wrong would be unfair.

## 2026-10-30: What lesson 4's Tally view counts (decided by Claude, pending review)

- **Question:** Lesson 4 has a Check button on the sphere's arrow and runs that check twice. What does the Tally view count?
- **Choice:** Before the sandbox, the checks of the arrow on the sphere: a check that moves the arrow starts the count afresh with its answer, so pressing Check again shows "3 checks in a row" all with one answer. In the sandbox, runs are fresh arrows at the set angle, as in lesson 3, checked twice: the bars count the first answers (with the chance marked) and the status line counts how often the second agreed. Moving the arrow by hand clears the tally.
- **Why:** The repeated answer is the lesson's point, so the view that counts answers should show it, rather than sit empty until the sandbox. The second answer always matches, so a second pair of bars would only repeat the first.

## 2026-10-30: How the Plot view is drawn (decided by Claude, pending review)

- **Question:** Lessons 1, 5, 8 and 10 share a line plot. WebGL like the sphere, Canvas, or SVG?
- **Choice:** SVG, rebuilt to the figure's size on each draw (`src/plot.ts`), with its arithmetic in a pure module (`src/graph.ts`). Linear axes with ticks, curves, dots and dashed upright marks labelled above the plot; the small view leaves out the axis names.
- **Why:** A few hundred points drawn on demand need no GPU; SVG text is crisp at any size and the plot gets a readable label for screen readers, with no new dependency.

## 2026-10-30: Lesson 5's sliders (decided by Claude, pending review)

- **Question:** What ranges do lesson 5's speed and time take, and what does the plot show before the wave is taught?
- **Choice:** Speed 15–90° per second in steps of 5, time 0–12 seconds in tenths, on a fixed 0–12 second plot, so the half turn (2 to 12 seconds) is always on it. Before the wave step the plot shows only a dot at the current time and chance; during the check it shows only its axes, and the arrow waits at the top.
- **Why:** The dot lets the learner build the wave by dragging before seeing it whole; a fixed time axis keeps "faster speed, tighter wave" visible; hiding the plot and arrow keeps the check from answering itself.

## 2026-10-30: How the Amplitude circle is drawn (decided by Claude, pending review)

- **Question:** Lesson 6's Amplitude circle: what does it show, and how is it drawn?
- **Choice:** SVG like the Plot view (`src/amplitude.ts`): a faint circle with up at the top and down to the right, the quarter between them bright, the arrow turned half the sphere's angle (marked with an arc and its degrees), and dashed lines to the upright axis (amplitude of up) and, once taught, to the flat axis (amplitude of down), each with its value to three places. The amplitude of down is never called a sine; it is the arrow's sideways reach.
- **Why:** Up and down at right angles is the picture behind "why half"; the dashed line repeats the sphere's height line, so reading an amplitude feels like reading a height. Three places make the Math view's "0.866² = 0.75" check out by hand.

## 2026-10-30: Lesson 6's angle slider (decided by Claude, pending review)

- **Question:** What range does lesson 6's angle take?
- **Choice:** 0° to 180° in steps of 2°, so half the angle is always a whole number of degrees. The sandbox starts at 74°, the check's arrow (amplitude of up about 0.8).
- **Why:** Past 180° the amplitude of up turns negative, and negative squares are not taught; up to down is all lesson 7 needs.

## 2026-11-14: What lesson 7's table shows (decided by Claude, pending review)

- **Question:** The outline's table has two columns, turn and chance of down. Anything else?
- **Choice:** A third column between them, the amplitude of down (to three places), so each halving reads across: the turn halves, the amplitude nearly halves, the chance drops to about a quarter. A row fills in only when the learner drags the turn to it (40°, 20°, 10°); a note under the table gives each drop as "chance × 0.26". The chance of down keeps two figures below 0.01 ("0.0076", not "0.008").
- **Why:** "Half squared is a quarter" needs the halved number in view; without it the table shows the quarter but not where it comes from.

## 2026-11-14: "About" answers in checks (decided by Claude, pending review)

- **Question:** Lesson 7's check answer is 0.0076, but the reasoning it teaches (a quarter of 0.03) gives 0.0075. Must the learner type 0.0076 exactly?
- **Choice:** A typed prompt may carry an allowance (`within`); lesson 7 accepts 0.0066 to 0.0086. The reveal still names 0.0076 and says that 0.0075 counts.
- **Why:** The check asks for the pattern, not the fourth decimal; marking 0.0075 wrong would punish the right idea. Lesson 9's "roughly half" check can use it too.

## 2026-11-14: Lesson 7's slider and steps (decided by Claude, pending review)

- **Question:** What range does lesson 7's turn take, and how does the check stay unspoiled?
- **Choice:** Turns in steps of 2° (half the turn stays whole on the Amplitude circle) up to 60°. Before the check the slider starts at 20°, so the 10° row can't be filled in early; after it, the learner drags to 10° to fill the last row (Next waits for it), and from then on the slider goes down to 0°. The zoomed plot (0–60°, chance 0–0.25) shows only its axes until the step after that.
- **Why:** The check asks for the 10° value, so the table and plot must not show it first; filling it in by hand straight after the reveal is the confirmation.

## 2026-11-14: How lesson 8's runs are timed (decided by Claude, pending review)

- **Question:** Lesson 8 has speed, time, check count and run. What does the time slider do, and how long is a run?
- **Choice:** Every run lasts 4 seconds, with the checks evenly spaced and the last at the end; the time slider (0 to 4 s) scrubs through the run on the sphere. Before Run once, the sphere shows the run in which every check said up (labelled as such); a new check count or speed goes back to it. The speed (sandbox only, 15–90°/s) sets how far a run turns: 45°/s is the half turn of the guided steps, 90°/s a full turn.
- **Why:** The learner drives the motion (no autoplay), and dragging through one random history shows a "down" sending the arrow to the bottom. A fixed run length keeps the plot's question the same throughout: how much survives one run.

## 2026-11-14: Lesson 8's plot, checks and runs (decided by Claude, pending review)

- **Question:** How do lesson 8's plot and checks work without giving the answer away?
- **Choice:** The plot (1 to 100 checks, linear) shows only the 2-check point before the check. The check comes in two steps: "higher or lower with 10 checks?" (reveal 0.78), then "why?", with the three explanations written out in the text and picked as a, b or c. After that the learner sets 1, 2, 10 and 100 checks to fill in the points (Next waits for all four), and the next step draws the curve. Run 100 adds 100 runs at the current check count and puts their share on the plot as a hollow ring; runs at the same count add up. The Math view writes the product out up to three times and in words beyond ("0.976 multiplied 10 times"), since powers are not taught; a chance per check that would round to 1.000 keeps five places (0.99975).
- **Why:** Predict first, then confirm by hand, as in lesson 7. Rings read apart from the dots by shape, not hue. Long explanations didn't fit as buttons in the 18rem sidebar.

## 2026-11-14: How lesson 1's runs play (decided by Claude, pending review)

- **Question:** Lesson 1 has only Run and the check count, with no time slider. How does the learner see a run, and what does the plot count?
- **Choice:** Run plays one 4-second half turn on the sphere (lesson 8's run: checks evenly spaced, the last at the end), started only by the button, with a status line ("check 12 of 100 said down: it didn't stay up"). "One check halfway" is shown as 2 checks, halfway and at the end. Each Run also makes 99 more runs out of sight; when the played run ends, the share of them that stayed up (every check said up) is added to the plot as a ring at that check count, adding up with earlier runs there, as in lesson 8. The checks slider goes up to 20 before the 100-check question, Next waits for rings at 1, 2, 5 and 20, and the question's step has no Run. With `prefers-reduced-motion`, Run doesn't play: a time slider appears and steps through the run, as in lesson 8.
- **Why:** In the first lesson, watching the arrow turn and jump back is the point, and a learner who doesn't know the sphere yet won't think to drag a time slider. Pressing a button is still the learner driving the motion. One run alone says nothing about "how often", so the plot needs many; rings and "stayed up" match lesson 8, where the same curve comes back explained.

## 2026-11-14: Lesson 9's data and its source

- **Question:** Where do lesson 9's numbers come from, and are the outline's facts right?
- **Choice:** W. M. Itano, D. J. Heinzen, J. J. Bollinger and D. J. Wineland, "Quantum Zeno effect", Phys. Rev. A 41, 2295 (1990), doi:10.1103/PhysRevA.41.2295 (a U.S. Government work, not subject to copyright). Transcribed from a scan of the paper, checked on a full-resolution crop of Table I, into `src/itano.ts`: the 1 → 2 transition (ions start in level 1), columns ½[1 − cosⁿ(π/n)], predicted (full calculation) and observed, for n = 1 to 64. Confirmed from the text: about 5000 ⁹Be⁺ ions in a Penning trap, a 320.7 MHz rf π pulse of T = 256 ms, n = 1, 2, 4, …, 64 laser pulses of 313 nm and τp = 2.4 ms, about 72 photons scattered per ion per pulse, observed values uncertain by about 0.02. A test checks the simplified column against the course's `endsDown` to four places.
- **Why:** The handoff asked for the data from the paper, not from memory. The 2 → 1 transition is left out: it shows the same effect, and one data set keeps the plot readable.

## 2026-11-14: Lesson 9 shows that the data sits under the simple formula (decided by Claude, pending review)

- **Question:** The outline expected the measurements to follow ½ × (1 − cos^N(180° / N)) down to about 0.04. The paper's observed values sit 0.03 to 0.06 below it from 4 flashes on (0.013 and −0.006 at 32 and 64, against 0.072 and 0.037), because the 2.4 ms pulses aren't instant and the laser causes some optical pumping. Hide it, or show it?
- **Choice:** Show it. The measurements are rings with ±0.02 error bars over the formula's curve (rings are counted results, as in lessons 1 and 8). A step of its own says why they sit lower, in one idea a beginner can follow (while the light is on it checks without pause, so the ions hardly turn; 64 flashes fill 154 of the 256 ms), and adds the authors' full calculation as dots, which match every measurement to about 0.021. Optical pumping is named only as "a small side effect of the light". The −0.006 is explained as counting noise around 0, as the paper does. The check still asks for the formula's 64-flash value (0.037, accepting 0.031 to 0.043).
- **Why:** The course's first principle is understanding; hiding a visible gap, or plotting it without a word, would teach that data matches theory exactly. The gap even points the right way: more checking time, less turning.

## 2026-11-14: Lesson 9's plot and steps (decided by Claude, pending review)

- **Question:** How is a count from 1 to 64 laid out, and what do the views show?
- **Choice:** The flashes axis doubles at each step (1, 2, 4, …, 64, evenly spaced, as in the paper's Fig. 3), called "each step doubles them"; logarithms aren't named. The curve joins the formula at every whole number of flashes (1.5 flashes doesn't exist, and below 2 a fractional power of a negative cos has no value). Views: Plot (main), Sphere (one ion, level 1 at the top and level 2 at the bottom), Table (the paper's Table I, filled in as the lesson goes: formula, measured, full calculation) and Math. The flashes slider moves in powers of two; Next waits for one run of an ion and for the formula at 1, 2, 4, 8 and 16 flashes; the question's step shows 32 but not 64. The Plot view gains optional error bars through its rings (`spread`), stopping at the bottom axis.
- **Why:** On a plain 1 to 64 axis, 1, 2, 4 and 8 crowd together at the left. Filling in before the question, and drawing the measured points only after it, keeps the check from answering itself.


## 2026-11-14: Lesson 10's recaps and final round (decided by Claude, pending review)

- **Question:** How do the six recap screens show "each one sentence with its view", and what is the unseen speed and time?
- **Choice:** Each recap step brings its view to the front (a step may now name its main view): Sphere for the arrow, chance, check and turning, the Amplitude circle for amplitude, the Math view for small turns; each keeps a live slider (and Check for the check recap). The final round is 80° a second for 3 seconds, a 240° turn: 4 checks survive with chance 0.32, 8 with 0.57. The "why" round reuses lesson 8's three ideas, reworded and reordered so the answer is (c), not (b) again.
- **Why:** A recap that only describes a view doesn't show it. 240° is past the half turn every guided lesson used, so the learner applies the reasoning rather than recalling lesson 8's numbers; the per-check loss still drops to about a quarter (0.25 to 0.067).

## 2026-11-14: Lesson 10's sandbox controls (decided by Claude, pending review)

- **Question:** Lesson 8's time slider scrubbed a fixed 4-second run; lesson 10 adds the total time. How does the learner see a single run?
- **Choice:** The total time (1 to 6 s, in half seconds) sets the run's length, and Run once plays it on the sphere in that time, as lesson 1 does (under reduced motion, a time slider steps through it instead). The plot's curve joins whole numbers of checks only. The Amplitude circle shows one piece of the run (none when a single piece passes a half turn). A new speed or total time clears the rings.
- **Why:** Two time sliders (one for length, one for scrubbing) would read as the same thing. Past a half turn, the formula at a fraction of a check gives values no run can have, so joining only whole counts keeps the curve honest; at short turns it looks the same as lesson 8's.
