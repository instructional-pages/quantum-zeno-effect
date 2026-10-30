# Lesson outline

Approved 2026-10-30. Ten lessons: the first shows the effect with no explanation
(paradox first), the next seven build the pieces that explain it from zero, the ninth is
the real experiment and the tenth is the full sandbox. Every lesson is a few short text
steps beside the live view (Next button), at least one predict-then-reveal check, and a
sandbox at the end.

Learner: a complete beginner with no physics or quantum background and school arithmetic
only. Angles, probability, cosine, squaring and multiplying chances are taught where they
are first needed. Angles are in degrees throughout; radians never appear.

Every analogy is marked **Analogy** in the text and followed by **Where it breaks**.

## At a glance

| # | Lesson | Main view | Small views | Controls available |
|---|--------|-----------|-------------|--------------------|
| 1 | Watching stops it | Sphere | Plot (survival vs. checks) | **run, check count** |
| 2 | A state is an arrow | Sphere | Angle readout | **angle** |
| 3 | Chances | Sphere | Tally, Math | angle, **run once, run 100** |
| 4 | Checking | Sphere | Tally, Math | angle, run, **check** |
| 5 | Turning | Sphere | Plot (chance vs. time), Math | **speed, time** |
| 6 | Amplitudes | Sphere | Amplitude circle, Math | angle |
| 7 | Small turns barely count | Amplitude circle | Table, Math | angle |
| 8 | Checking often | Sphere | Plot (survival vs. checks), Math | speed, time, **check count**, run |
| 9 | A real experiment | Plot (Itano data) | Sphere | check count |
| 10 | The sandbox | Learner's choice | all others | all |

New controls are in **bold**. Views:

- **Sphere:** the 3D Bloch sphere with the state arrow. Only one circle of it (through the
  top and bottom) is ever used; the rest is drawn faint. The top is "up", the bottom
  "down".
- **Plot:** a line plot. In lessons 1, 8 and 10 it is the survival chance against the
  number of checks; in lesson 5, the chance of "up" against time.
- **Tally:** two bars counting "up" and "down" answers over many runs, with their
  fractions.
- **Amplitude circle:** a flat circle where the amplitude angle is half the sphere angle
  (lesson 6).
- **Math:** the formula of the moment with the live numbers substituted in.

## 1. Watching stops it

**Idea:** the paradox, shown before anything is explained. A state turns steadily from
"up" to "down". Checking it once in a while barely matters; checking it very often stops
it from turning.

**Steps:** the arrow turns from the top of the sphere to the bottom over the run
(Run button, no autoplay). Then one check halfway through: the arrow jumps to the top or
the bottom at random. Then the check-count slider: 1, 2, 5, 20, 100 checks during the
same run. With many checks the arrow stays near the top: each check snaps it back before
it gets far. The plot fills in one point per run. The lesson ends by naming what needs
explaining: what a state is, what a check does, why the chance works out this way.

**Analogy:** "a watched pot never boils". **Where it breaks:** the pot boils anyway;
watching it changes nothing. Here, checking really changes what happens.

**Check:** "with 100 checks, will the arrow end near the top or the bottom?" (near the
top.) Asked before the 100-check run; most newcomers will guess "it makes no difference".

**Sandbox:** run and check count.

## 2. A state is an arrow

**Idea:** the thing we study has exactly two possible answers when checked, "up" and
"down" (in the experiment of lesson 9, an atom's two energy levels). Its *state* is an
arrow that can point anywhere between them, written as an angle from the top: 0° is up,
180° is down, 90° is halfway.

**Steps:** teach angles from scratch: a full turn is 360°, half a turn 180°, a quarter
90°. The angle slider moves the arrow around the circle through the top and bottom. Why a
sphere and not just a circle: the other directions describe something else (phase), which
this course doesn't need, so the arrow always stays on one circle.

**Analogy:** a coin, heads or tails. **Where it breaks:** a coin is always one or the other,
and we just don't know which. The arrow at 90° is not secretly up or down; it is a state
of its own that only becomes an answer when checked (lesson 4).

**Check:** "where does the arrow point at 135°?" (pick from three drawings: three quarters
of the way down.)

**Sandbox:** the angle slider with its readout.

## 3. Chances

**Idea:** the arrow's height sets the chance of each answer. Height runs from +1 at the
top to −1 at the bottom, and the chance of "up" is (1 + height) / 2.

**Steps:** first probability itself: a chance is a number from 0 (never) to 1 (always),
the fraction of many tries that give that answer; ½ means half the time. "Run once" draws
one random answer; "run 100" fills the tally, and its fraction settles near the chance.
Then height: read off the arrow (dashed line to the vertical axis). At the top height 1,
chance 1; at the bottom −1, chance 0; at 90° height 0, chance ½. Then cosine as a name
for this height: cos(angle) is the height of an arrow of length 1 at that angle, so the
chance of "up" is (1 + cos angle) / 2. Values come from the readout, never from a
calculator.

**Check:** "at 60° the height is ½. What is the chance of up?" (¾.) Then run 100 and
compare with the tally.

**Sandbox:** angle, run once, run 100.

## 4. Checking

**Idea:** a check gives "up" or "down" at random with the chances of lesson 3, and
afterwards the arrow points exactly at the answer it gave. A second check right away
always repeats the first.

**Steps:** set an angle, check: the arrow jumps to the top or the bottom. Check again: the
same answer, every time. The state before the check is gone; only the answer is left.

**Analogy:** catching a spinning coin. **Where it breaks:** the coin was going to land
somehow anyway; the check *sets* the arrow, and that is the whole trick of lesson 8.

**Side note (decoherence):** a "check" doesn't need a person or a screen. Any strong enough
contact with the surroundings (a laser, a stray particle) has the same effect. What
happens "really" during a check is a question of interpretation that this course leaves
out.

**Check:** "the arrow is at 120° and a check says up. Check again at once: what is the
chance of up?" (1.)

**Sandbox:** angle, check, run 100 (each run checks twice and counts how often the two
answers agree: always).

## 5. Turning

**Idea:** left alone, the arrow turns steadily round the circle at a fixed speed (a *Rabi
oscillation*, driven by something like a radio wave). Its angle is speed × time.

**Steps:** speed in degrees per second, time slider (no autoplay). The plot draws the
chance of "up" against time: a smooth wave between 1 and 0. Mark one *half turn*: the time
to go from up to down (180°), used in every later lesson.

**Analogy:** a spinning top slowly tipping over. **Where it breaks:** the top's tilt is
something you can see without disturbing it; the arrow can't be looked at without a
check, which resets it.

**Check:** "speed 45° per second. After 4 seconds, what is the chance of up?" (0: it has
turned 180°.)

**Sandbox:** speed and time, with the plot.

## 6. Amplitudes

**Idea:** the chance is a square. Quantum physics describes the state with an *amplitude*
for each answer, and the chance is the amplitude squared. On the sphere, the amplitude is
the cosine of *half* the arrow's angle: the chance of up is cos²(angle / 2).

**Steps:** teach squaring (a number times itself; ½² = ¼). The amplitude circle appears
next to the sphere, its arrow at half the angle. Show the two forms agree at a few angles
(0°, 90°, 180°, 60°): (1 + cos angle) / 2 = cos²(angle / 2). Why the sphere doubles the
angle: "up" and "down" are complete opposites, so the sphere draws them opposite each
other (180° apart), while their amplitudes are only 90° apart. This is the cos² survival
formula used for the rest of the course.

**Check:** "the amplitude of up is 0.8. What is the chance of up?" (0.64.)

**Sandbox:** angle, with both drawings and both formulas live.

## 7. Small turns barely count

**Idea:** the key to the effect. The chance of "down" after a small turn is the square of a
small number, and squaring makes small numbers much smaller. Halve the turn, and the chance
of having left drops to about a quarter.

**Steps:** a table fills in as the angle slider moves:

| turn | chance of down |
|------|----------------|
| 40° | 0.117 |
| 20° | 0.030 |
| 10° | 0.0076 |

At the start of a turn the arrow moves sideways, not down, so the chance of "down" starts
out flat (the plot from lesson 5, zoomed in near zero). No approximation formula; the
table and the zoomed plot carry it.

**Analogy:** a ball balanced on a hilltop: the first nudge hardly lowers it. **Where it
breaks:** the ball's height is a real height; here it is a chance.

**Check:** "a 20° turn gives about 0.03. What will a 10° turn give?" (about a quarter of
it, 0.0076.)

**Sandbox:** the angle slider, the zoomed plot and the table.

## 8. Checking often

**Idea:** the explanation. Split one half turn into N pieces with a check after each. Each
piece is a small turn, so each check almost surely says "up" and resets the arrow to the
top. The arrow has to survive N checks, but each loss is only about a quarter as big when
N doubles, so the total loss roughly halves: more checks, less change.

**Steps:** first multiplying chances: two independent things with chances ½ and ½ both
happen with chance ¼. Then the formula: each piece turns 180° / N, survives with chance
cos²(90° / N), and all N survive with chance cos²(90° / N) multiplied N times. Fill the
plot point by point:

| checks N | survives all |
|----------|--------------|
| 1 | 0 |
| 2 | 0.25 |
| 10 | 0.78 |
| 100 | 0.98 |

Then single runs: "run once" shows one random history (a check that says "down" sends the
arrow to the bottom, and it keeps turning from there; that run counts as not surviving).
"Run 100" builds the same curve from tallies.

**Check:** first predict, then explain (the course's success criterion). "With a half turn
and 2 checks, the chance is 0.25. With 10 checks, is it higher or lower?" (higher, 0.78.)
Then "why?", choosing from three explanations: (a) each check pushes the arrow back up,
(b) each short turn moves the chance only by its square, so many small losses add up to
less than one big one, (c) checks slow the turning down. ((b); the reveal explains why (a)
is only the picture and (c) is false: the turning speed never changes.)

**Sandbox:** speed, time, check count, run once and run 100, with the plot.

## 9. A real experiment

**Idea:** the effect has been measured. Itano, Heinzen, Bollinger and Wineland (1990)
held about 5,000 beryllium ions in a trap and used a radio wave to turn each one from
level 1 to level 2 in 256 milliseconds (a half turn). During that time they flashed a UV
laser N times: an ion in level 1 lights up under the laser and one in level 2 stays dark,
so each flash is a check.

**Steps:** what they counted is slightly different from lesson 8: not "survived every
check" but "found in level 2 at the end", because ions that a flash found in level 2 kept
turning (as in lesson 8's single runs). The prediction for that is ½ × (1 − cos^N(180° / N)).
The plot shows their measured points over the prediction for N = 1, 2, 4, 8, 16, 32, 64:
the chance of ending in level 2 falls from about 1 to about 0.04. The data points are
transcribed from the paper's table when the lesson is built, and checked against it.

**Analogy:** none needed; this is the real thing.

**Check:** "with 32 flashes the prediction is 0.072. What will 64 flashes give, roughly?"
(about half of it: 0.037.)

**Sandbox:** the check count (1–64, powers of two) with the matching sphere run.

## 10. The sandbox

**Idea:** everything together: speed, number of checks, total time, single random runs and
the averaged curve.

**Steps:** a recap screen per idea (arrow, chance, check, turning, amplitude, small turns),
each one sentence with its view. Then the sandbox opens.

**Check:** a final round with a new speed and time the learner hasn't seen: predict
whether doubling the checks raises or lowers survival, then say why (as in lesson 8).

**Sandbox:** all controls: rotation speed, number of checks, total time, run once,
run 100.

## Success criteria coverage

| Criterion | Where it is taught | Where it is checked |
|-----------|--------------------|---------------------|
| Predicts that measuring more often keeps the state from changing | 1 (shown), 8 (explained) | 1, 8, 10 |
| Says why: short-time change grows quadratically, so frequent resets keep it near zero | 6 (chance is a square), 7 (small turns), 8 (adding up) | 7, 8 (the "why" choice), 10 |
| Learns every idea used, from school arithmetic | angles 2, probability 3, cosine 3, squaring 6, multiplying chances 8 | each lesson's check |

## Settled in review

- **Chance read from the arrow's height first** ((1 + height) / 2, lesson 3), and the cos²
  amplitude form second (lesson 6). The height is visible on the sphere, so the first
  formula needs no new idea; the half angle is the hardest point on the sphere and gets a
  lesson of its own.
- **Degrees only, no radians, no approximation formulas.** The quadratic short-time
  behaviour is carried by a table and a zoomed plot (lesson 7), not by sin x ≈ x.
- **Survival means "every check said up"** (lessons 1, 8, 10). It gives the simplest
  formula, cos² multiplied N times. Itano's experiment counted "in level 2 at the end",
  which lesson 9 explains; both show the same effect.
- **A check that says "down" doesn't end the run**: the arrow keeps turning from the
  bottom, as it physically would, but the run is counted as not surviving.
- **The sphere uses only one circle**; phase is named once (lesson 2) and left for Later.
