// Lesson 9, "A real experiment": Itano, Heinzen, Bollinger and Wineland (1990). About
// 5,000 ions turned from level 1 to level 2 in a 256 ms half turn while a laser checked
// them N times; they counted the share in level 2 at the end. The learner runs one ion,
// fills in the prediction for 1 to 16 flashes, predicts 64, then sees the measurements as
// rings with their error bars, and why they sit a little under the simple formula: the
// flashes took time. The data is in itano.ts, transcribed from the paper.

import { smallChance, toPlaces, twoPlaces } from "./chance.ts";
import type { Axis, Point } from "./graph.ts";
import { ERROR, FLASH_MS, HALF_TURN_MS, IONS, TABLE } from "./itano.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createPlotView } from "./plot.ts";
import { createTableView } from "./table.ts";
import { addButtons, addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { arrowAt, endsDown, run, soFar, survival, type Answer } from "./zeno.ts";

const TURN = 180;
const MOST = 64;
// The flash counts the learner fills in before the question.
const FILL = [1, 2, 4, 8, 16];

const ms = (t: number): string => `${Math.round(t)} ms`;
const flashesText = (n: number): string => `${n} ${n === 1 ? "flash" : "flashes"}`;
// A piece of the half turn: 180°, 22.5°, 5.63°.
const pieceText = (angle: number): string => `${Number(angle.toFixed(2))}°`;
const log2 = (n: number): number => Math.log2(n);

// Along the bottom, each step doubles the flashes: x is how many doublings from 1.
const FLASHES: Axis = { min: 0, max: log2(MOST), ticks: [0, 1, 2, 3, 4, 5, 6], format: (x) => String(2 ** x), label: "flashes (each step doubles them)" };
const LEVEL2: Axis = { min: 0, max: 1, ticks: [0, 0.5, 1], format: String, label: "share in level 2" };

// The formula at every whole number of flashes from 1 to 64; there is no such thing as 1.5
// flashes (and below 2, a fractional power of a negative cos has no value).
const CURVE: Point[] = Array.from({ length: MOST }, (_, k) => [log2(k + 1), endsDown(TURN, k + 1)]);

// What the Math view shows: the experiment's facts, one ion's run, the formula, or the
// check's question. What the Plot view shows: nothing, the formula's points the learner
// has reached, the curve with the measurements, or that with the full calculation too.
type Shown = "facts" | "run" | "formula" | "ask";
type Drawn = "none" | "points" | "data" | "full";

// Each step's flash count (null keeps the last), the most the flashes slider allows (0
// for no slider), whether it has the time slider and Run, what the views show, how many of
// the table's columns are filled in, and what Next waits for.
const STEPS: {
  flashes: number | null;
  most: number;
  time: boolean;
  runs: boolean;
  math: Shown;
  plot: Drawn;
  columns: 0 | 2 | 3 | 4;
  need: number[] | "run";
}[] = [
  { flashes: 0, most: 0, time: true, runs: false, math: "facts", plot: "none", columns: 0, need: [] },
  { flashes: 4, most: 0, time: true, runs: true, math: "run", plot: "none", columns: 0, need: "run" },
  { flashes: 1, most: 16, time: false, runs: false, math: "formula", plot: "points", columns: 2, need: FILL },
  { flashes: 32, most: 0, time: false, runs: false, math: "ask", plot: "points", columns: 2, need: [] },
  { flashes: null, most: MOST, time: false, runs: false, math: "formula", plot: "data", columns: 3, need: [] },
  { flashes: null, most: MOST, time: false, runs: false, math: "formula", plot: "full", columns: 4, need: [] },
  { flashes: null, most: MOST, time: true, runs: true, math: "run", plot: "data", columns: 4, need: [] },
];

// One ion's answers: from Run, or (before any) an ion that glowed at every flash.
interface History {
  answers: Answer[];
  real: boolean;
}

// "cos 90° × cos 90° = 0.000", or "cos 22.5° multiplied 8 times = 0.531".
function product(n: number): string {
  const each = `cos ${pieceText(TURN / n)}`;
  const value = toPlaces(Math.cos((TURN / n) * (Math.PI / 180)) ** n, 3);
  return `${n <= 3 ? Array.from({ length: n }, () => each).join(" × ") : `${each} multiplied ${n} times`} = ${value}`;
}

// The Math view's lines, HTML.
function mathLines(shown: Shown, n: number, time: number, ion: History): string[] {
  if (shown === "ask") return ["32 flashes: 0.072 end in level 2", "64 flashes: roughly?"];
  if (shown === "facts")
    return [
      `about ${IONS.toLocaleString("en")} ions · level 1 up, level 2 down`,
      `level 1 to level 2 in ${HALF_TURN_MS} ms: a half turn`,
      `time ${ms(time)} · turned ${pieceText((TURN * time) / HALF_TURN_MS)}`,
    ];
  if (shown === "formula") {
    const height = Math.cos((TURN / n) * (Math.PI / 180)) ** n;
    return [
      `${flashesText(n)} · each piece turns 180° / ${n} = ${pieceText(TURN / n)}`,
      `average height: ${product(n)}`,
      `in level 2: ½ × (1 ${height < 0 ? "+" : "−"} ${toPlaces(Math.abs(height), 3)}) = ${smallChance(endsDown(TURN, n))}`,
      `<span class="note">glowed at every flash (lesson 8's question): ${twoPlaces(survival(TURN, n))}</span>`,
    ];
  }
  const lines = [`time ${ms(time)} of ${HALF_TURN_MS} ms · ${flashesText(n)}, one every ${ms(HALF_TURN_MS / n)}`];
  if (!ion.real) lines.push(`<span class="note">showing an ion that glowed at every flash</span>`);
  const { done } = soFar(ion.answers, time / HALF_TURN_MS);
  const last = ion.answers[done - 1];
  lines.push(!done ? "no flash yet" : `flash ${done}: ${last === "up" ? "it glowed, so level 1" : "it stayed dark, so level 2"}`);
  if (done === n) lines.push(`it ended in level ${last === "up" ? 1 : 2}`);
  return lines;
}

export const lesson9: Lesson = {
  title: "A real experiment",
  views: [
    { caption: "Plot" },
    { caption: "Sphere", label: "One ion's state arrow, level 1 at the top and level 2 at the bottom" },
    { caption: "Table" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>So far, all of this has been on paper. In 1990 Wayne Itano, Daniel Heinzen,
        John Bollinger and David Wineland, at the US National Institute of Standards and
        Technology, tried it for real.</p>
        <p>They held about 5,000 beryllium ions (atoms missing one electron) in a trap. Each
        ion can be found in one of two levels: call them level 1 (up) and level 2 (down). A
        radio wave turned every ion from level 1 to level 2 in 256 milliseconds (thousandths
        of a second): one half turn (lesson 5). Drag the time.</p>`,
    },
    {
      text: `<p>Their check was a flash of ultraviolet laser light. An ion in level 1 glows
        under it, giving off about 72 specks of light; an ion in level 2 stays dark. Either
        way the flash has asked "level 1 or 2?", and the ion is left in its answer (lesson
        4). Staying dark is an answer too.</p>
        <p>Here the half turn gets 4 flashes, evenly spaced, the last at the end. Press Run
        one ion, then drag the time through it.</p>`,
      hold: true,
    },
    {
      text: `<p>They didn't count the ions that glowed at every flash, lesson 8's question.
        They counted the ions in level 2 at the end. An ion that a flash found dark keeps
        turning from level 2, as in lesson 8's single runs, and may come back.</p>
        <p>That needs a different formula. Over many ions, the average height of the arrow
        starts at 1, and each piece of turning followed by a flash multiplies it by cos of
        the piece (the paper shows why). From lesson 3, the share found down is then
        (1 − height) / 2. Set 1, 2, 4, 8 and 16 flashes to fill in the plot.</p>`,
      hold: true,
    },
    {
      text: `<p>With 32 flashes, the formula says 0.072 of the ions end in level 2.</p>
        <p>What will 64 flashes give, roughly?</p>`,
      check: {
        prompts: [{ label: "64 flashes", answer: 0.037, within: 0.006 }],
        after: `About 0.037, close to half of 0.072. Doubling the flashes halves each piece, so
          each piece loses about a quarter as much, and with twice as many pieces the total
          roughly halves, as in lesson 8. Anything from 0.031 to 0.043 counts.`,
      },
    },
    {
      text: `<p>Now what they measured. The rings are the share of the ions they found in level
        2 at the end; each bar shows the paper's measuring error, about 0.02 either way.</p>
        <p>With 1 flash, 0.995 of the ions reached level 2. With 64, none did (the −0.006 is
        counting noise around 0). Checking more often stopped the turning: the quantum Zeno
        effect, measured.</p>`,
    },
    {
      text: `<p>Look closer: from 4 flashes on, every ring sits a little under the curve, by
        0.03 to 0.06. The formula takes a flash to be instant. Theirs lasted 2.4 ms each, and
        while the light is on it checks without pause, so the ions hardly turn. 64 flashes
        fill 154 of the 256 ms: the ions turned less, and fewer reached level 2.</p>
        <p>The dots are the authors' full calculation, which includes the length of the
        flashes (and a small side effect of the light). They agree with every measurement to
        about 0.02, the measuring error.</p>`,
    },
    {
      text: `<p><strong>Sandbox.</strong> Pick a number of flashes and run one ion through the
        half turn. With 1 flash it always ends dark, in level 2; with 64 it nearly always
        glows at every flash.</p>
        <p>Next, the last lesson: everything together.</p>`,
    },
  ],
  start(figures, controls) {
    const [plotFigure, sphereFigure, tableFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;

    const marks = heightMarks(sphereFigure, view, ["level 1 (up)", "level 2 (down)"]);
    const plot = createPlotView(plotFigure, FLASHES, LEVEL2);
    const table = createTableView(tableFigure, ["flashes", "formula", "measured", "full calculation"]);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));

    let at = 0;
    let n = 0;
    let time = 0;
    const glowed = (): History => ({ answers: Array.from({ length: n }, () => "up"), real: false });
    let ion = glowed();
    // The flash counts reached so far; kept across steps, cleared with the page.
    const seen = new Set<number>();
    let done = () => {};

    const reach = () => {
      if (TABLE.some((r) => r.flashes === n)) seen.add(n);
      const { need } = STEPS[at]!;
      if (Array.isArray(need) && need.length && need.every((k) => seen.has(k))) done();
    };

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const setup = STEPS[at]!;
        const angle = arrowAt(TURN, ion.answers, time / HALF_TURN_MS);
        view.draw({ angle, arc: false, height: false });
        marks(angle, false);

        const reached = TABLE.filter((r) => seen.has(r.flashes));
        const data = setup.plot === "data" || setup.plot === "full";
        const rings: Point[] = data ? TABLE.map((r) => [log2(r.flashes), r.measured]) : [];
        plot.draw({
          label:
            setup.plot === "none"
              ? "Share of ions in level 2 at the end against the number of flashes, not drawn yet"
              : setup.plot === "points"
                ? `Share in level 2 at the end against the number of flashes, from the formula: ${reached.map((r) => `${flashesText(r.flashes)}, ${smallChance(r.simple)}`).join("; ")}`
                : `Share in level 2 at the end against the number of flashes: the formula's curve falls from 1 to 0.037, and the measurements, as rings with error bars, from 0.995 to about 0, a little under the curve${setup.plot === "full" ? "; dots for the full calculation, on the rings" : ""}`,
          curves: data ? [CURVE] : [],
          dots:
            setup.plot === "points"
              ? reached.map((r) => [log2(r.flashes), r.simple])
              : setup.plot === "full"
                ? TABLE.map((r) => [log2(r.flashes), r.full])
                : data && n
                  ? [[log2(n), endsDown(TURN, n)]]
                  : [],
          rings,
          spread: ERROR,
          marks: [],
        });

        const columns = setup.columns;
        table.draw(
          (columns > 2 ? TABLE : reached).map((r) =>
            [String(r.flashes), smallChance(r.simple), toPlaces(r.measured, 3), toPlaces(r.full, 3)].map((cell, k) => (k < columns ? cell : "")),
          ),
          columns === 0 ? "Fills in as you go." : columns === 4 ? `Full calculation: ${FLASH_MS} ms flashes, as in the experiment.` : columns === 3 ? `Measured: share of about ${IONS.toLocaleString("en")} ions, ± ${ERROR}.` : "",
        );

        math.innerHTML = mathLines(setup.math, n, time, ion)
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);
    resize.observe(plotFigure);

    let timeSlider: HTMLInputElement | null = null;
    const setTime = (t: number) => {
      time = t;
      if (timeSlider) {
        timeSlider.value = String(t);
        timeSlider.nextElementSibling!.textContent = ms(t);
      }
    };

    // A new flash count starts again from the ion that glowed at every flash, ended.
    const setFlashes = (k: number) => {
      n = k;
      ion = glowed();
      setTime(STEPS[at]!.time ? 0 : HALF_TURN_MS);
      reach();
      schedule();
    };

    // One ion, from time 0, ready to be dragged through.
    const go = () => {
      ion = { answers: run(TURN, n, Math.random), real: true };
      setTime(0);
      schedule();
      if (STEPS[at]!.need === "run") done();
    };

    return {
      show(step, finish) {
        at = step;
        done = finish;
        const setup = STEPS[step]!;
        if (setup.flashes !== null) n = setup.flashes;
        timeSlider = null;
        if (setup.most) addSlider(controls, "flashes", 0, log2(setup.most), log2(n), (x) => setFlashes(2 ** x), (x) => String(2 ** x));
        if (setup.time) timeSlider = addSlider(controls, "time", 0, HALF_TURN_MS, 0, (x) => ((time = x), schedule()), ms);
        if (setup.runs) addButtons(controls, [["Run one ion", go]]);
        setFlashes(n);
      },
      stop: () => resize.disconnect(),
    };
  },
};
