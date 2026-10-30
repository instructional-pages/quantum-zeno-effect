// Lesson 3, "Chances": a chance is the share of many tries that give an answer, and the
// arrow's height sets it, chance of up = (1 + height) / 2. The height is read off the
// sphere (a dashed line across to the axis) and then named: it is the cosine of the
// angle. Runs check a fresh arrow at the angle once each; the Tally view counts them, and
// the Math view writes the formula out with the live numbers.

import { degrees } from "./angle.ts";
import { chanceSum, emptyTally, fraction, record, runs, twoPlaces, type Tally } from "./chance.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createTallyView } from "./tally.ts";
import { addButtons, addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { chanceUp, check, height, type Answer } from "./zeno.ts";

// How much the Math view shows: the chance alone (before the height is taught), the
// height alone, the height and the formula, the same with the height named as a cosine,
// or that with the chance left as "?" (during the check).
type Shown = "chance" | "height" | "formula" | "cosine" | "check";

// Each step's starting angle, whether the angle slider and the run buttons are there,
// and what the Math view shows. The height is drawn from the second step on.
const STEPS: { angle: number; slider: boolean; runs: boolean; math: Shown }[] = [
  { angle: 90, slider: false, runs: true, math: "chance" },
  { angle: 0, slider: true, runs: false, math: "height" },
  { angle: 0, slider: true, runs: true, math: "formula" },
  { angle: 60, slider: true, runs: true, math: "cosine" },
  { angle: 60, slider: false, runs: false, math: "check" },
  { angle: 60, slider: true, runs: true, math: "cosine" },
];

// The Math view's lines for the arrow at `angle`, HTML.
function mathLines(angle: number, shown: Shown, tally: Tally): string[] {
  const h = height(angle);
  const up = twoPlaces(chanceUp(angle));
  const lines: string[] = [];
  if (shown === "chance") lines.push(`chance of up = ${up}`, `chance of down = ${twoPlaces(1 - chanceUp(angle))}`);
  else {
    lines.push(shown === "height" || shown === "formula" ? `height = ${twoPlaces(h)}` : `height = cos ${degrees(angle)} = ${twoPlaces(h)}`);
    const sum = chanceSum(h);
    if (shown === "check") lines.push(`chance of up = ${sum} = ?`);
    else if (shown !== "height") lines.push(`chance of up = ${sum} = ${up}`, `chance of down = 1 − ${up} = ${twoPlaces(1 - chanceUp(angle))}`);
  }
  if (runs(tally)) lines.push(`<span class="note">up in ${tally.up} of ${runs(tally)} runs = ${twoPlaces(fraction(tally, "up")!)}</span>`);
  return lines;
}

export const lesson3: Lesson = {
  title: "Chances",
  views: [
    { caption: "Sphere", label: "The state arrow, with a dashed line from its tip across to the vertical axis marking its height" },
    { caption: "Tally" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>When the arrow is checked, which answer comes out is a matter of
        <em>chance</em>. A chance is a number from 0 (never) to 1 (always): the share of many
        tries that give that answer. A chance of ½ means half the time.</p>
        <p>At 90° the arrow points sideways, halfway between up and down, and each answer
        has a chance of ½.</p>
        <p>A run makes a fresh arrow at this angle and checks it once. (What a check does to
        the arrow is lesson 4.) Run once a few times, then run 100 and watch the tally.</p>`,
      hold: true,
    },
    {
      text: `<p>One run is unpredictable, but over many runs the share of ups settles near
        the chance. So where does the chance come from? From how high the arrow points.</p>
        <p>The <em>height</em> is read on the vertical axis: the dashed line runs straight
        across from the arrow's tip to it. At the top the height is 1, in the middle 0, at
        the bottom −1, and below the middle it is negative.</p><p>Drag the angle and watch
        the height.</p>`,
    },
    {
      text: `<p>The chance of up comes straight from the height:</p>
        <p class="formula">chance of up = (1 + height) / 2</p>
        <p>At the top, (1 + 1) / 2 = 1: always up. At the bottom, (1 − 1) / 2 = 0: never. At
        90°, (1 + 0) / 2 = ½. Down gets the rest: 1 − the chance of up.</p>
        <p>Try a few angles, and run 100 at each to see the tally follow.</p>`,
    },
    {
      text: `<p>The height of an arrow of length 1 has a name: the <em>cosine</em> of its
        angle, written cos. So cos 0° = 1, cos 90° = 0, cos 180° = −1, and</p>
        <p class="formula">chance of up = (1 + cos angle) / 2</p>
        <p>There is nothing to work out: the cosine is just the height you can see, and the
        Math view reads it off for you.</p>`,
    },
    {
      text: `<p>At 60° the height is ½ (cos 60° = 0.50).</p><p>What is the chance of
        up?</p>`,
      check: {
        prompts: [{ label: "Chance of up", answer: 0.75 }],
        after: `¾, or 0.75: (1 + ½) / 2 = 1½ / 2 = ¾. Three runs in four say up. Next, run
          100 and compare with the tally.`,
      },
    },
    {
      text: `<p><strong>Sandbox.</strong> Here is 60°: run 100 and compare the tally with ¾.
        It is rarely exactly 75, but near it, and nearer still over more runs.</p>
        <p>Then try any angle. Moving the arrow clears the tally.</p>`,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, tallyFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;

    const marks = heightMarks(sphereFigure, view);
    const tallyView = createTallyView(tallyFigure);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));

    let at = 0;
    let angle = 0;
    let tally = emptyTally();
    let last: Answer | null = null;

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const setup = STEPS[at]!;
        const shown = setup.math !== "chance";
        view.draw({ angle, arc: false, height: shown });
        marks(angle, shown);
        // The chance is marked only where runs can be compared with it, so not before it
        // is taught, nor during the check.
        tallyView.draw(tally, setup.runs ? chanceUp(angle) : null, runs(tally) ? `${runs(tally)} runs · last: ${last}` : "");
        math.innerHTML = mathLines(angle, setup.math, tally)
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);

    const go = (n: number) => {
      const answers = Array.from({ length: n }, () => check(angle, Math.random));
      tally = record(tally, answers);
      last = answers.at(-1)!;
      schedule();
    };

    return {
      show(step, done) {
        at = step;
        const setup = STEPS[step]!;
        angle = setup.angle;
        tally = emptyTally();
        if (setup.slider) addSlider(controls, "angle", 0, 360, angle, (x) => ((angle = x), (tally = emptyTally()), schedule()), degrees);
        if (setup.runs)
          addButtons(controls, [
            ["Run once", () => go(1)],
            ["Run 100", () => (go(100), done())],
          ]);
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
