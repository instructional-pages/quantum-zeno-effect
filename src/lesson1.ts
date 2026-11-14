// Lesson 1, "Watching stops it": the paradox, shown before anything is explained. The
// arrow turns from the top to the bottom over a 4-second run, played when the learner
// presses Run. Checks on the way make it jump to the top or the bottom at random, and
// with many checks it stays near the top. Each Run also makes 99 more runs out of sight,
// and the Plot view marks the share of them that stayed up as a ring (lesson 8's rings).
// Under reduced motion, Run doesn't play: a time slider scrubs the run instead.

import { twoPlaces } from "./chance.ts";
import type { Point } from "./graph.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createPlotView } from "./plot.ts";
import { addButtons, addSlider, span } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { arrowAt, run, soFar, type Answer } from "./zeno.ts";

// A run lasts 4 seconds and turns the arrow half a turn, from up to down, as in lesson 8.
const RUN = 4;
const TURN = 180;
const BATCH = 100;
// The check counts the learner runs before the question.
const TABLE = [1, 2, 5, 20];

const checksText = (n: number): string => `${n} ${n === 1 ? "check" : "checks"}`;
const seconds = (t: number): string => `${t.toFixed(1)} s`;

// Each step's check count (null keeps the last), the largest the checks slider allows
// (0 for no slider), whether it has Run and the plot, and what Next waits for: a finished
// run, rings at the table's counts, or nothing.
const STEPS: { checks: number | null; most: number; runs: boolean; plot: boolean; need: "run" | "table" | "none" }[] = [
  { checks: 0, most: 0, runs: true, plot: false, need: "run" },
  { checks: 2, most: 0, runs: true, plot: false, need: "run" },
  { checks: 1, most: 20, runs: true, plot: true, need: "table" },
  { checks: 100, most: 0, runs: false, plot: true, need: "none" },
  { checks: 100, most: 0, runs: true, plot: true, need: "run" },
  { checks: null, most: 100, runs: true, plot: true, need: "none" },
  { checks: null, most: 100, runs: true, plot: true, need: "none" },
];

// Runs made at one check count: how many, and how many stayed up at every check.
interface Counted {
  ran: number;
  survived: number;
}

// What the status line says a fraction `t` of the way through a run with these answers.
function status(answers: readonly Answer[], t: number, real: boolean): string {
  if (!real) return "Press Run.";
  const n = answers.length;
  if (!n) return t < 1 ? "turning…" : "no checks: it turned all the way down";
  const { done, down } = soFar(answers, t);
  if (down) return `check ${down} of ${n} said down: it didn't stay up`;
  if (done === n) return n === 1 ? "the check said up" : `all ${n} checks said up: it stayed up`;
  return done ? `${done === 1 ? "check 1" : `checks 1 to ${done}`} of ${n} said up` : "turning…";
}

export const lesson1: Lesson = {
  title: "Watching stops it",
  views: [
    { caption: "Sphere", label: "An arrow on a sphere, turning from the top towards the bottom" },
    { caption: "Plot" },
  ],
  steps: [
    {
      text: `<p>This arrow stands for a tiny thing that can be "up" or "down". Left alone,
        it turns steadily: in 4 seconds it goes from the top all the way to the
        bottom.</p>
        <p>Press Run to watch it.</p>`,
      hold: true,
    },
    {
      text: `<p>Now <em>check</em> it on the way. A check asks the arrow "up or down?" It
        answers one or the other, at random, and jumps to point at its answer; then it keeps
        turning from there.</p>
        <p>Here it is checked twice: halfway, and at the end. Press Run a few times. Is the
        halfway answer always the same?</p>`,
      hold: true,
    },
    {
      text: `<p>Count how often it <em>stays up</em>: every check finds it at the top. Each
        Run also makes 99 more runs like it, out of sight, and the plot marks the share of
        all of them that stayed up, as a ring. (Click the plot to make it large.)</p>
        <p>Run with 1, 2, 5 and 20 checks. One check, at the very end, finds the arrow at
        the bottom every time.</p>`,
      hold: true,
    },
    {
      text: `<p>The same 4 seconds, now with 100 checks.</p>
        <p>The arrow still turns at the same pace between checks. Where will it end: near
        the top, or near the bottom?</p>`,
      check: {
        prompts: [{ label: "100 checks", choices: ["near the top", "near the bottom"], answer: "near the top" }],
        after: `Near the top, nearly every time. Most people expect the checks to make no
          difference, and the arrow to end at the bottom as it does alone.`,
      },
    },
    {
      text: `<p>Run it with 100 checks and watch the arrow.</p>
        <p>It tries to turn, but every check comes after only a tiny turn and almost always
        finds it up, so it jumps back to the top. Checked often enough, it hardly turns at all. This is
        the <strong>quantum Zeno effect</strong>.</p>`,
      hold: true,
    },
    {
      text: `<p><strong>Analogy:</strong> "a watched pot never boils".</p>
        <p><strong>Where it breaks:</strong> the pot boils anyway; watching it changes
        nothing, it only feels slow. Here the checks really change what happens: the plot
        counts it, run after run.</p>`,
    },
    {
      text: `<p><strong>Sandbox.</strong> Run with any number of checks from 1 to 100.</p>
        <p>Nothing here is explained yet. The next lessons build it from the start: what the
        arrow is (lesson 2), why a check answers up or down when it does (lessons 3 and 4),
        and why many checks keep it up (lessons 5 to 8).</p>`,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, plotFigure] = figures as [HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;
    const marks = heightMarks(sphereFigure, view);
    const plot = createPlotView(
      plotFigure,
      { min: 1, max: 100, ticks: [1, 20, 40, 60, 80, 100], format: String, label: "checks" },
      { min: 0, max: 1, ticks: [0, 0.5, 1], format: String, label: "share that stayed up" },
    );
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let at = 0;
    let n = 0;
    // The run on the sphere, how far through it is (0 to 1), and whether it is a real run
    // or the waiting arrow at the top.
    let answers: Answer[] = [];
    let t = 0;
    let real = false;
    let counted = new Map<number, Counted>();
    let done = () => {};
    let line: HTMLElement | null = null;
    let timeSlider: HTMLInputElement | null = null;
    let playing = 0;

    const draw = () => {
      const angle = arrowAt(TURN, answers, t);
      view.draw({ angle, arc: false });
      marks(angle, false);
      // Read out only where a run ends, not at every check on the way.
      if (line) {
        line.ariaLive = playing ? "off" : "polite";
        const text = reduced && real && t === 0 ? "Drag the time through the run." : status(answers, t, real);
        if (line.textContent !== text) line.textContent = text;
      }
      if (timeSlider) {
        timeSlider.value = String(t * RUN);
        timeSlider.nextElementSibling!.textContent = seconds(t * RUN);
      }
      const shown = STEPS[at]!.plot;
      const rings: Point[] = [...counted].map(([k, { ran, survived }]) => [k, survived / ran]);
      plot.draw({
        label: shown
          ? `Share of runs that stayed up against the number of checks: ${
              [...counted]
                .sort(([a], [b]) => a - b)
                .map(([k, { ran, survived }]) => `${checksText(k)}, ${twoPlaces(survived / ran)}`)
                .join("; ") || "none yet"
            }`
          : "Share of runs that stayed up against the number of checks, not shown yet",
        curves: [],
        dots: [],
        rings: shown ? rings : [],
        marks: [],
      });
    };
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => ((pending = false), draw()));
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);
    resize.observe(plotFigure);

    const stopPlaying = () => {
      cancelAnimationFrame(playing);
      playing = 0;
    };
    // Back to the arrow waiting at the top.
    const wait = () => {
      stopPlaying();
      answers = [];
      t = 0;
      real = false;
    };

    // A run counts once it has been seen to the end (or, under reduced motion, at once).
    const count = (made: Answer[][]) => {
      const before = counted.get(n) ?? { ran: 0, survived: 0 };
      counted.set(n, { ran: before.ran + made.length, survived: before.survived + made.filter((a) => a.every((x) => x === "up")).length });
      const { need } = STEPS[at]!;
      if (need === "run" || (need === "table" && TABLE.every((k) => counted.has(k)))) done();
      schedule();
    };

    const go = () => {
      stopPlaying();
      const made = Array.from({ length: BATCH }, () => run(TURN, n, Math.random));
      answers = made[0]!;
      real = true;
      if (reduced) {
        t = 0;
        // With no checks there is nothing to count; the run itself is what Next waits for.
        if (n) count(made);
        else if (STEPS[at]!.need === "run") done();
        schedule();
        return;
      }
      const begin = performance.now();
      const frame = (now: number) => {
        t = Math.min((now - begin) / (RUN * 1000), 1);
        if (t < 1) {
          draw();
          playing = requestAnimationFrame(frame);
        } else {
          playing = 0;
          draw();
          if (n) count(made);
          else if (STEPS[at]!.need === "run") done();
        }
      };
      playing = requestAnimationFrame(frame);
    };

    return {
      show(step, finish) {
        at = step;
        done = finish;
        const setup = STEPS[step]!;
        if (setup.checks !== null) n = setup.checks;
        n = Math.min(n, setup.most || n);
        wait();
        timeSlider = null;
        line = null;
        if (setup.most)
          addSlider(controls, "checks", 1, setup.most, n, (k) => ((n = k), wait(), schedule()), String);
        if (setup.runs) {
          if (reduced) timeSlider = addSlider(controls, "time", 0, RUN, 0, (x) => ((t = real ? x / RUN : 0), schedule()), seconds, 0.02);
          addButtons(controls, [["Run", go]]);
          line = controls.appendChild(Object.assign(document.createElement("p"), { className: "status" }));
        } else if (n) controls.append(span(`${checksText(n)} in the run`, "status"));
        schedule();
      },
      stop: () => (stopPlaying(), resize.disconnect()),
    };
  },
};
