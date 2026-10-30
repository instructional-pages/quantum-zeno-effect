// Lesson 5, "Turning": left alone, the arrow turns steadily from the top, so its angle is
// speed × time. The Plot view draws the chance of up against time, first as a dot for
// now, then as the whole wave between 1 and 0, with one half turn (up to down) marked.

import { degrees, pastTurns } from "./angle.ts";
import { chanceSum, twoPlaces } from "./chance.ts";
import { sample, type Axis } from "./graph.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createPlotView } from "./plot.ts";
import { addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { chanceUp, halfTurn, height, turned } from "./zeno.ts";

const START_SPEED = 45;
const LONGEST = 12;

const seconds = (time: number): string => `${time.toFixed(1)} s`;
const perSecond = (speed: number): string => `${speed}°/s`;

const TIME: Axis = { min: 0, max: LONGEST, ticks: [0, 2, 4, 6, 8, 10, 12], format: String, label: "time (seconds)" };
const CHANCE: Axis = { min: 0, max: 1, ticks: [0, 0.5, 1], format: String, label: "chance of up" };

// What the Plot view shows: only the dot for now, the whole wave with it, or nothing
// (the check). Each step's start (null keeps the last step's speed and time), its
// sliders, and whether the half turn is marked and the Math view asks for the chance.
type Shown = "dot" | "wave" | "none";
const STEPS: { start: [number, number] | null; speed: boolean; time: boolean; plot: Shown; half: boolean; ask?: boolean }[] = [
  { start: [START_SPEED, 0], speed: false, time: true, plot: "dot", half: false },
  { start: null, speed: true, time: true, plot: "dot", half: false },
  { start: null, speed: true, time: true, plot: "wave", half: false },
  { start: null, speed: true, time: true, plot: "wave", half: true },
  { start: null, speed: true, time: true, plot: "wave", half: true },
  { start: [START_SPEED, 0], speed: false, time: false, plot: "none", half: false, ask: true },
  { start: [START_SPEED, 0], speed: true, time: true, plot: "wave", half: true },
];

// The Math view's lines, HTML.
function mathLines(speed: number, time: number, half: boolean, ask: boolean): string[] {
  if (ask) return [`speed = ${perSecond(speed)} · time = 4.0 s`, "chance of up = ?"];
  const angle = turned(speed, time);
  const lines = ["angle = speed × time", `= ${perSecond(speed)} × ${seconds(time)} = ${degrees(angle)}`];
  if (pastTurns(angle)) lines.push(`<span class="note">${pastTurns(angle)}</span>`);
  lines.push(`height = cos ${degrees(angle)} = ${twoPlaces(height(angle))}`, `chance of up = ${chanceSum(height(angle))} = ${twoPlaces(chanceUp(angle))}`);
  if (half) lines.push(`half turn = 180° / ${perSecond(speed)} = ${seconds(halfTurn(speed))}`);
  return lines;
}

export const lesson5: Lesson = {
  title: "Turning",
  views: [
    { caption: "Sphere", label: "The state arrow, with a dashed line from its tip across to the vertical axis marking its height" },
    { caption: "Plot" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>So far the arrow stayed wherever it was put. Left alone, it doesn't: it turns
        steadily round the circle, at a fixed speed, starting from the top.</p>
        <p>What turns it is a steady push from outside: in the real experiment of lesson 9, a
        radio wave. Physicists call this turning a <em>Rabi oscillation</em>.</p>
        <p>Drag the time. Here the speed is 45° per second.</p>`,
    },
    {
      text: `<p>The <em>speed</em> says how many degrees the arrow turns each second, so after
        a while it has turned speed × time. At 45° per second, 2 seconds give 90°, a quarter
        turn.</p><p>Change the speed too. Past 360° the arrow just goes round again: 450°
        points the same way as 90°.</p>`,
    },
    {
      text: `<p>The Plot view, beside the sphere, has followed the chance of up as a dot: time
        along the bottom, chance up the side. (Click it to make it large.)</p>
        <p>Here is every moment at once. It is a smooth wave: 1 at the start, falling to 0
        as the arrow reaches the bottom, and back to 1 as it comes round to the top.</p>`,
    },
    {
      text: `<p>The time to go from up to down, 180°, is one <em>half turn</em>: 180° divided
        by the speed. At 45° per second that is 4 seconds; the dashed line marks it.</p>
        <p>The later lessons all use it: in one half turn, the arrow left alone goes from
        surely up to surely down.</p>`,
    },
    {
      text: `<p><strong>Analogy:</strong> a spinning top, slowly tipping over: its tilt grows
        steadily with time, as the arrow's angle does.</p>
        <p><strong>Where it breaks:</strong> you can watch the top tip without disturbing
        it. The arrow can't be looked at without a check, and a check resets it (lesson 4).
        The sphere draws what the arrow would do if nobody checked.</p>`,
    },
    {
      text: `<p>The speed is 45° per second, and the arrow starts at the top.</p>
        <p>After 4 seconds, what is the chance of up?</p>`,
      check: {
        prompts: [{ label: "Chance of up", answer: 0 }],
        after: `0. The arrow has turned 45° × 4 = 180°, one half turn: it points at the
          bottom, and a check would surely say down.`,
      },
    },
    {
      text: `<p><strong>Sandbox.</strong> Speed and time, with the plot.</p>
        <p>Try a fast speed and a slow one: the faster the arrow turns, the more tightly
        the wave is squeezed, and the half turn moves with it.</p>`,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, plotFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;

    const marks = heightMarks(sphereFigure, view);
    const plot = createPlotView(plotFigure, TIME, CHANCE);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));

    let at = 0;
    let speed = START_SPEED;
    let time = 0;

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const setup = STEPS[at]!;
        const angle = turned(speed, time);
        view.draw({ angle, arc: false, height: true });
        marks(angle, true);
        const now = `now ${seconds(time)}, chance of up ${twoPlaces(chanceUp(angle))}`;
        const half = halfTurn(speed);
        plot.draw({
          label:
            setup.plot === "none"
              ? "Chance of up against time, not drawn yet"
              : setup.plot === "dot"
                ? `Chance of up against time: ${now}`
                : `Chance of up against time: a wave from 1 down to 0 at ${seconds(half)} and back up${setup.half ? ", the half turn marked" : ""}; ${now}`,
          curves: setup.plot === "wave" ? [sample((t) => chanceUp(turned(speed, t)), 0, LONGEST, 240)] : [],
          dots: setup.plot === "none" ? [] : [[time, chanceUp(angle)]],
          marks: setup.half ? [{ x: half, label: `half turn · ${seconds(half)}` }] : [],
        });
        math.innerHTML = mathLines(speed, time, setup.half, !!setup.ask)
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);
    resize.observe(plotFigure);

    return {
      show(step) {
        at = step;
        const setup = STEPS[step]!;
        if (setup.start) [speed, time] = setup.start;
        if (setup.speed) addSlider(controls, "speed", 15, 90, speed, (x) => ((speed = x), schedule()), perSecond, 5);
        if (setup.time) addSlider(controls, "time", 0, LONGEST, time, (x) => ((time = x), schedule()), seconds, 0.1);
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
