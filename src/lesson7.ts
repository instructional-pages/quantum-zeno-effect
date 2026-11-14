// Lesson 7, "Small turns barely count": the key to the effect. The chance of down after a
// turn from the top is the amplitude of down squared, and squaring makes small numbers
// much smaller: halve the turn, and the amplitude of down roughly halves while the chance
// drops to about a quarter. A Table view fills in as the learner reaches 40°, 20° and 10°;
// a zoomed Plot of the chance of down shows it starting out flat. No approximation
// formula: the table and the plot carry it.

import { degrees } from "./angle.ts";
import { createAmplitudeView } from "./amplitude.ts";
import { smallChance, squaredSmall } from "./chance.ts";
import { sample, type Axis } from "./graph.ts";
import type { Lesson } from "./lesson.ts";
import { createPlotView } from "./plot.ts";
import { createTableView } from "./table.ts";
import { addSlider } from "./ui.ts";
import { amplitudeDown, chanceDown } from "./zeno.ts";

// The table's rows, each half the turn of the one above.
const TURNS = [40, 20, 10];
const WIDEST = 60;

const TURN: Axis = { min: 0, max: WIDEST, ticks: [0, 20, 40, 60], format: degrees, label: "turn from the top" };
const DOWN: Axis = { min: 0, max: 0.25, ticks: [0, 0.1, 0.2], format: String, label: "chance of down" };

// What the Math view shows: small squares, the chance of down as the amplitude of down
// squared (with the halving rule under it once it is taught), or the check's question.
type Shown = "squares" | "down" | "halving" | "check";

// Each step's starting turn (null keeps the last), the slider's smallest turn (null for no
// slider), whether the plot is drawn, what the Math view shows, and the table rows the
// learner must reach before Next.
const STEPS: { turn: number | null; min: number | null; plot: boolean; math: Shown; need: number[] }[] = [
  { turn: 40, min: null, plot: false, math: "squares", need: [] },
  { turn: 40, min: 20, plot: false, math: "down", need: [40, 20] },
  { turn: null, min: 20, plot: false, math: "halving", need: [] },
  { turn: 20, min: null, plot: false, math: "check", need: [] },
  { turn: 20, min: 0, plot: false, math: "halving", need: [10] },
  { turn: null, min: 0, plot: true, math: "down", need: [] },
  { turn: null, min: 0, plot: true, math: "down", need: [] },
  { turn: 30, min: 0, plot: true, math: "halving", need: [] },
];

// The Math view's lines, HTML.
function mathLines(turn: number, shown: Shown): string[] {
  if (shown === "squares") return ["0.5² = 0.25", "0.1² = 0.01", "0.05² = 0.0025"];
  if (shown === "check") return [`turn 20° · chance of down ${smallChance(chanceDown(20))}`, "turn 10° · chance of down = ?"];
  const down = amplitudeDown(turn);
  const lines = [`turn = ${degrees(turn)}`, `amplitude of down = ${down.toFixed(3)}`, `chance of down = ${squaredSmall(down)}`];
  if (shown === "halving") lines.push(`<span class="note">half the turn: about half the amplitude, ½² = ¼ of the chance</span>`);
  return lines;
}

// The table's note: the drop from each reached row to the next reached one below it.
function tableNote(seen: ReadonlySet<number>): string {
  const drops = TURNS.slice(1)
    .filter((t) => seen.has(t) && seen.has(2 * t))
    .map((t) => `${2 * t}° to ${t}°: chance × ${(chanceDown(t) / chanceDown(2 * t)).toFixed(2)}`);
  return drops.length ? drops.join("\n") : "fills in as the turn reaches each row";
}

export const lesson7: Lesson = {
  title: "Small turns barely count",
  views: [{ caption: "Amplitude circle" }, { caption: "Table" }, { caption: "Plot" }, { caption: "Math" }],
  steps: [
    {
      text: `<p>This lesson holds the key to the whole effect, and it is about squares.</p>
        <p>Squaring a small number makes it much smaller: 0.1² = 0.01, a tenth of it. And
        halve the number, 0.05, and its square is a quarter as big: 0.0025. The Math view
        has them.</p>`,
    },
    {
      text: `<p>Start with the arrow at the top, surely up, and give it a small turn. The
        chance a check now says down is the amplitude of down squared (lesson 6): the
        amplitude arrow's sideways reach, squared.</p>
        <p>Here the turn is 40°. Drag it down to 20°, and watch the Table view fill in.</p>`,
      hold: true,
    },
    {
      text: `<p>You halved the turn, 40° to 20°. The sideways reach nearly halved too, 0.342 to
        0.174.</p>
        <p>But the chance of down fell from 0.117 to 0.030: to about a quarter, because half
        squared is a quarter, ½ × ½ = ¼.</p>`,
    },
    {
      text: `<p>No dragging this time.</p><p>A 20° turn gives a chance of down of about 0.03.
        What will a 10° turn give?</p>`,
      check: {
        prompts: [{ label: "Chance of down", answer: 0.0076, within: 0.001 }],
        after: `About 0.0076, a quarter of 0.030 (0.0075 counts). Halving the turn halves the
          reach again, 0.174 to 0.087, and 0.087² = 0.0076.`,
      },
    },
    {
      text: `<p>Now drag the turn to 10° and fill in the last row.</p>
        <p>Every halving of the turn cuts the chance of leaving to about a quarter. A turn a
        quarter of 40° risks only about a sixteenth of its chance: small turns barely
        count.</p>`,
      hold: true,
    },
    {
      text: `<p>The Plot view draws it for every turn: like lesson 5's plot, but with the turn
        along the bottom and the chance of down up the side, zoomed into the corner near
        zero, up to 60° and a chance of 0.25. (Click it to make it large.)</p>
        <p>It starts out flat, lying along the bottom. Leaving the top, the arrow on the
        sphere moves sideways at first, not down; on the circle, the reach grows steadily but
        its square hardly grows at all.</p>`,
    },
    {
      text: `<p><strong>Analogy:</strong> a ball balanced on a hilltop. The first nudge
        sideways hardly lowers it at all; only further out does the slope get steep.</p>
        <p><strong>Where it breaks:</strong> the ball's height is a real height you could
        measure. Here the "height" is a chance, which only shows itself when a check gives
        an answer.</p>`,
    },
    {
      text: `<p><strong>Sandbox.</strong> Any turn from 0° to 60°, with the table, the
        zoomed plot and the math.</p>
        <p>Try 2°: a chance of down of 0.0003. That is what lesson 8 builds on.</p>`,
    },
  ],
  start(figures, controls) {
    const [circleFigure, tableFigure, plotFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
    const circle = createAmplitudeView(circleFigure);
    const table = createTableView(tableFigure, ["turn", "amplitude of down", "chance of down"]);
    const plot = createPlotView(plotFigure, TURN, DOWN);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));

    let at = 0;
    let turn = 40;
    // The table rows reached so far; kept across steps, cleared with the page.
    const seen = new Set<number>();
    let done = () => {};

    // Only a turn the learner set counts as reached.
    const reach = () => {
      if (STEPS[at]!.min !== null && TURNS.includes(turn)) seen.add(turn);
      const { need } = STEPS[at]!;
      // A step with nothing to reach is not held, and finishing it would skip a check.
      if (need.length && need.every((t) => seen.has(t))) done();
    };

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const setup = STEPS[at]!;
        const down = amplitudeDown(turn);
        circle.draw({
          label: `The amplitude arrow at ${degrees(turn / 2)}, half the turn: amplitude of down ${down.toFixed(3)}, so a chance of down of ${smallChance(down * down)}`,
          angle: turn,
          down: true,
        });
        table.draw(
          TURNS.map((t) => (seen.has(t) ? [degrees(t), amplitudeDown(t).toFixed(3), smallChance(chanceDown(t))] : [degrees(t), "", ""])),
          tableNote(seen),
        );
        plot.draw({
          label: setup.plot
            ? `Chance of down against the turn, zoomed in near zero: flat at first, 0.25 at 60°; now ${degrees(turn)}, chance ${smallChance(chanceDown(turn))}`
            : "Chance of down against the turn, not drawn yet",
          curves: setup.plot ? [sample(chanceDown, 0, WIDEST, 120)] : [],
          dots: setup.plot ? [[turn, chanceDown(turn)]] : [],
          marks: [],
        });
        math.innerHTML = mathLines(turn, setup.math)
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(circleFigure);
    resize.observe(plotFigure);

    return {
      show(step, finish) {
        at = step;
        done = finish;
        const setup = STEPS[step]!;
        if (setup.turn !== null) turn = setup.turn;
        // Back from a wider step, keep the turn within this step's slider.
        if (setup.min !== null) {
          turn = Math.max(turn, setup.min);
          // Even steps, so half the turn is always whole.
          addSlider(controls, "turn", setup.min, WIDEST, turn, (x) => ((turn = x), reach(), schedule()), degrees, 2);
        }
        reach();
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
