// Lesson 4, "Checking": a check answers up or down with the chances of lesson 3, and
// leaves the arrow pointing exactly at its answer, so a second check at once repeats the
// first. The Check button moves the arrow on the sphere, and the Tally view counts checks
// in a row; a run is a fresh arrow at the set angle checked twice, and the Tally view
// counts the first answers and how often the second agreed.

import { degrees } from "./angle.ts";
import { chanceSum, emptyTally, record, runs, twoPlaces } from "./chance.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createTallyView } from "./tally.ts";
import { addButtons, addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { chanceUp, check, checkTwice, height, reset, type Answer } from "./zeno.ts";

// Each step's starting angle (null keeps the arrow where the last step left it), its
// controls, and whether the Math view leaves the chance after a check as "?" (the check).
const STEPS: { angle: number | null; slider: boolean; check: boolean; runs: boolean; ask?: boolean }[] = [
  { angle: 120, slider: true, check: true, runs: false },
  { angle: null, slider: false, check: true, runs: false },
  { angle: null, slider: true, check: true, runs: false },
  { angle: null, slider: true, check: true, runs: false },
  { angle: 120, slider: false, check: false, runs: false, ask: true },
  { angle: 120, slider: true, check: true, runs: true },
];

// The last check of the arrow on the sphere: where it was and what it said.
interface Checked {
  from: number;
  answer: Answer;
}

// The Math view's lines, HTML: the chance for the arrow as it is, and after a check, where
// it was and what the check said.
function mathLines(angle: number, checked: Checked | null, ask: boolean): string[] {
  const lines: string[] = [];
  if (checked) lines.push(`<span class="note">was at ${degrees(checked.from)} · chance of up ${twoPlaces(chanceUp(checked.from))}</span>`, `the check said ${checked.answer}: now at ${degrees(angle)}`);
  lines.push(`height = cos ${degrees(angle)} = ${twoPlaces(height(angle))}`, `chance of up = ${chanceSum(height(angle))} = ${twoPlaces(chanceUp(angle))}`);
  if (ask) lines.push("a check says up. Check again at once:", "chance of up = ?");
  return lines;
}

export const lesson4: Lesson = {
  title: "Checking",
  views: [
    { caption: "Sphere", label: "The state arrow, with a dashed line from its tip across to the vertical axis marking its height" },
    { caption: "Tally" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>So far a check only gave an answer. Now look at what it does to the arrow.</p>
        <p>Set any angle and press Check. The answer comes out with the chance of lesson 3,
        and then the arrow <em>jumps</em>: to the top if the answer was up, to the bottom if
        it was down.</p>`,
      hold: true,
    },
    {
      text: `<p>Now press Check again, as often as you like. The answer is the same every
        time: the tally counts them.</p>
        <p>The arrow points straight at its answer, at height 1 or −1, where the chance of
        that answer is 1: (1 + 1) / 2 for up, 1 − (1 − 1) / 2 for down. The angle it had before the first check
        is gone: only the answer is left.</p>`,
      hold: true,
    },
    {
      text: `<p><strong>Analogy:</strong> catching a spinning coin. While it spins it is
        neither heads nor tails; once caught, it is one of them, and looking again shows the
        same side.</p>
        <p><strong>Where it breaks:</strong> the coin was going to land somehow anyway, and
        catching it only shows how. A check <em>sets</em> the arrow: before it, the arrow
        pointed somewhere else entirely. That is the whole trick of lesson 8.</p>`,
    },
    {
      text: `<p><strong>Side note.</strong> A check doesn't need a person or a screen. Any
        strong enough contact with the surroundings, a laser or a stray particle, does the
        same thing to the arrow. (Physicists call this <em>decoherence</em>.)</p>
        <p>What happens "really" during a check is a question of interpretation that this
        course leaves out. All we need is what it does: an answer, and an arrow pointing at
        it.</p>`,
    },
    {
      text: `<p>The arrow is at 120°, where the chance of up is only 0.25. A check says
        up.</p><p>Check again at once: what is the chance of up?</p>`,
      check: {
        prompts: [{ label: "Chance of up", answer: 1 }],
        after: `1. After the first check the arrow points at the top, so the second check
          says up for certain. The 120° it had is gone.`,
      },
    },
    {
      text: `<p><strong>Sandbox.</strong> Each run makes a fresh arrow at the set angle and
        checks it twice in a row. The tally counts the first answers, and how often the
        second agreed.</p>
        <p>Run 100 at a few angles: the first answers follow the chance, and the second
        always agrees. Check moves the arrow on the sphere, as before.</p>`,
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
    let checked: Checked | null = null;
    // The answers since the arrow was last moved: of the checks on the sphere, or the
    // first answers of runs (`ran` of them, the second check agreeing `agreed` times).
    let tally = emptyTally();
    let ran = 0;
    let agreed = 0;
    let last: Answer | null = null;

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const setup = STEPS[at]!;
        view.draw({ angle, arc: false, height: true });
        marks(angle, true);
        const status = ran
          ? `${ran} runs · the second check agreed in ${agreed}`
          : runs(tally)
            ? `${runs(tally)} ${runs(tally) === 1 ? "check" : "checks in a row"} · last: ${last}`
            : "";
        tallyView.draw(tally, setup.runs ? chanceUp(angle) : null, status);
        math.innerHTML = mathLines(angle, checked, !!setup.ask)
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);

    // Moving the arrow clears the last check and the tally, which belong to one angle.
    const clear = () => ((tally = emptyTally()), (ran = 0), (agreed = 0));
    const moveTo = (x: number) => {
      angle = x;
      checked = null;
      clear();
      schedule();
    };

    const go = (n: number) => {
      const pairs = Array.from({ length: n }, () => checkTwice(angle, Math.random));
      if (!ran) tally = emptyTally();
      tally = record(tally, pairs.map(([first]) => first));
      ran += n;
      agreed += pairs.filter(([first, second]) => first === second).length;
      last = pairs.at(-1)![0];
      schedule();
    };

    return {
      show(step, done) {
        at = step;
        const setup = STEPS[step]!;
        if (setup.angle !== null) moveTo(setup.angle);
        else clear();
        const slider = setup.slider ? addSlider(controls, "angle", 0, 360, angle, moveTo, degrees) : null;
        const buttons: [string, () => void][] = [];
        if (setup.check)
          buttons.push([
            "Check",
            () => {
              const from = angle;
              const answer = check(angle, Math.random);
              // A check that leaves the arrow where it was adds to the checks in a row.
              if (reset(answer) !== from || ran) moveTo(reset(answer));
              tally = record(tally, [answer]);
              last = answer;
              checked = { from, answer };
              schedule();
              if (slider) {
                slider.value = String(angle);
                slider.nextElementSibling!.textContent = degrees(angle);
              }
              done();
            },
          ]);
        if (setup.runs) buttons.push(["Run once", () => go(1)], ["Run 100", () => go(100)]);
        if (buttons.length) addButtons(controls, buttons);
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
