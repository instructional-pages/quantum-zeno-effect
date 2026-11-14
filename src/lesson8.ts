// Lesson 8, "Checking often": the explanation. One half turn is split into N pieces with a
// check after each. Every piece is a small turn, so every check almost surely says up and
// puts the arrow back at the top; surviving means all N say up, and the chances multiply.
// Multiplying chances is taught first; the Plot view fills in point by point (1, 2, 10 and
// 100 checks), then as the whole curve; single runs are scrubbed through with the time
// slider, and 100 runs at a time land as rings on the curve.

import { degrees } from "./angle.ts";
import { perCheck, repeated, twoPlaces } from "./chance.ts";
import { sample, type Axis, type Point } from "./graph.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createPlotView } from "./plot.ts";
import { addButtons, addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { arrowAt, chanceUp, run, soFar, survival, turned, type Answer } from "./zeno.ts";

// Every run lasts 4 seconds; at the starting speed that is one half turn (lesson 5).
const RUN = 4;
const START_SPEED = 45;
const MOST = 100;
// The plot's points the learner fills in.
const TABLE = [1, 2, 10, 100];

const seconds = (time: number, places = 1): string => `${time.toFixed(places)} s`;
const perSecond = (speed: number): string => `${speed}°/s`;
const checksText = (n: number): string => `${n} ${n === 1 ? "check" : "checks"}`;

const CHECKS: Axis = { min: 1, max: MOST, ticks: [1, 20, 40, 60, 80, 100], format: String, label: "checks" };
const SURVIVES: Axis = { min: 0, max: 1, ticks: [0, 0.5, 1], format: String, label: "chance all say up" };

// What the Math view shows: the pieces of the run and the checks so far, the two chances
// multiplied, the formula for N checks, or a check's question. What the Plot view shows:
// nothing, the table's points the learner has reached, or the whole curve.
type Shown = "pieces" | "multiply" | "formula" | "ask";
type Drawn = "none" | "points" | "curve";

// Each step's check count (null keeps the last), whether the count, time and speed have
// sliders, which run buttons it has, what the views show, and the points the learner must
// reach, or the run to make, before Next.
const STEPS: {
  checks: number | null;
  count: boolean;
  time: boolean;
  speed: boolean;
  runs: "none" | "once" | "both";
  math: Shown;
  plot: Drawn;
  need: number[] | "run";
}[] = [
  { checks: 2, count: false, time: true, speed: false, runs: "none", math: "pieces", plot: "none", need: [] },
  { checks: 2, count: false, time: true, speed: false, runs: "none", math: "multiply", plot: "none", need: [] },
  { checks: 2, count: false, time: false, speed: false, runs: "none", math: "formula", plot: "points", need: [] },
  { checks: 2, count: false, time: false, speed: false, runs: "none", math: "ask", plot: "points", need: [] },
  { checks: 10, count: false, time: false, speed: false, runs: "none", math: "formula", plot: "points", need: [] },
  { checks: null, count: true, time: false, speed: false, runs: "none", math: "formula", plot: "points", need: TABLE },
  { checks: 10, count: true, time: false, speed: false, runs: "none", math: "formula", plot: "curve", need: [] },
  { checks: 10, count: true, time: true, speed: false, runs: "once", math: "pieces", plot: "curve", need: "run" },
  { checks: null, count: true, time: true, speed: false, runs: "both", math: "pieces", plot: "curve", need: [] },
  { checks: null, count: true, time: true, speed: true, runs: "both", math: "formula", plot: "curve", need: [] },
];

// One run's answers: from Run once, or (before any) a run in which every check said up.
interface History {
  answers: Answer[];
  real: boolean;
}

// The Math view's lines, HTML.
function mathLines(shown: Shown, turn: number, n: number, time: number, current: History, counted: Counted | undefined): string[] {
  const piece = turn / n;
  if (shown === "ask") return ["2 checks: every check says up with chance 0.25", "10 checks: higher or lower?"];
  if (shown === "multiply")
    return [
      `first check, after ${degrees(piece)}: chance of up ${perCheck(chanceUp(piece))}`,
      `second check, from the top again: ${perCheck(chanceUp(piece))}`,
      `both: ${repeated(chanceUp(piece), n)}`,
    ];
  if (shown === "formula") {
    const lines = [
      `${checksText(n)} · each piece turns ${degrees(turn)} / ${n} = ${pieceText(piece)}`,
      `each check: chance of up = cos²(${pieceText(piece / 2)}) = ${perCheck(chanceUp(piece))}`,
      `every check: ${repeated(chanceUp(piece), n)}`,
    ];
    if (survival(turn, n) < 1) lines.push(`<span class="note">lost: 1 − ${twoPlaces(survival(turn, n))} = ${twoPlaces(1 - survival(turn, n))}</span>`);
    if (counted) lines.push(...countLines(counted));
    return lines;
  }
  const { done, down } = soFar(current.answers, time / RUN);
  const lines = [`time ${seconds(time)} of ${seconds(RUN)} · ${checksText(n)}, one every ${seconds(RUN / n, 2)}`];
  if (!current.real) lines.push(`<span class="note">showing a run where every check says up</span>`);
  lines.push(
    !done
      ? "no check yet"
      : down
        ? `check ${down} said down: this run doesn't survive`
        : `${done === n ? "every check" : `checks so far: ${done} of ${n},`} said up`,
  );
  if (counted) lines.push(...countLines(counted));
  return lines;
}

// A piece of a turn: whole degrees, or one place below 10° (1.8°, 0.9°).
const pieceText = (angle: number): string => (Number.isInteger(angle) || angle >= 10 ? degrees(angle) : `${angle.toFixed(1)}°`);

// Runs counted at one check count: how many, and how many survived every check.
interface Counted {
  ran: number;
  survived: number;
}

const countLines = ({ ran, survived }: Counted): string[] => [`runs counted: ${ran} · every check said up in ${survived} (${twoPlaces(survived / ran)})`];

export const lesson8: Lesson = {
  title: "Checking often",
  views: [
    { caption: "Sphere", label: "The state arrow, with a dashed line from its tip across to the vertical axis marking its height" },
    { caption: "Plot" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>Now everything comes together. The arrow starts at the top and turns at 45° a
        second, so in 4 seconds it makes one half turn, from up to down (lesson 5).</p>
        <p>This time, check it twice on the way: at 2 seconds and at 4. Drag the time. Each
        check finds the arrow 90° from the top; here both said up, so each time it jumps
        back to the top (lesson 4) and starts turning again from there.</p>`,
    },
    {
      text: `<p>How likely is that? At 90°, a check says up with chance 0.5 (lesson 3). The
        second check sees the same thing again: the first put the arrow back at the top, so
        the second piece starts fresh.</p>
        <p>For two things that don't affect each other, the chance both happen is the two
        chances <em>multiplied</em>. Toss a coin twice: heads both times has chance ½ × ½ =
        ¼, because only half the tosses start with heads, and only half of those go on to a
        second head. So both checks say up with chance 0.5 × 0.5 = 0.25.</p>`,
    },
    {
      text: `<p>Any number of checks works the same way. Split the half turn into N pieces, a
        check after each: each piece turns 180° / N, and from lesson 6 a check after it says
        up with chance cos² of half that.</p>
        <p>Every check must say up, so that chance is multiplied by itself N times. The Math
        view works it out for 2 checks, and the Plot view marks the result: the number of
        checks along the bottom, the chance up the side. (Click it to make it large.)</p>`,
    },
    {
      text: `<p>The same half turn, now with 10 checks instead of 2.</p>
        <p>Will the chance that every check says up be higher or lower than 0.25?</p>`,
      check: {
        prompts: [{ label: "10 checks", choices: ["higher", "lower"], answer: "higher" }],
        after: `Higher: 0.78. That is more checks to pass, but each one is after a turn of only
          18°, which a check almost never notices: chance of up 0.976 each.`,
      },
    },
    {
      text: `<p>Now say why. Which explanation is right?</p>
        <p>(a) Each check pushes the arrow back up.</p>
        <p>(b) A short turn changes the chance only by its square, so many small losses add
        up to less than one big one.</p>
        <p>(c) The checks slow the turning down.</p>`,
      check: {
        prompts: [{ label: "Why", choices: ["a", "b", "c"], answer: "b" }],
        after: `(b). A turn of 18° loses only 0.024 (lesson 7: small turns barely count); all ten
          together lose only 0.22, far less than the whole half turn, which loses everything.
          <br>(a) is only the picture: a check can just as well say down and send the arrow to
          the bottom. It says up so often <em>because</em> of (b). (c) is false: between the
          checks the arrow turns at 45° a second, exactly as before.`,
      },
    },
    {
      text: `<p>Fill in the plot point by point: set 1, 2, 10 and 100 checks.</p>
        <p>One check at the end of the half turn finds the arrow at the bottom: it never
        survives. With 100, each piece is only 1.8°, and all 100 checks say up 98 times in
        100.</p>`,
      hold: true,
    },
    {
      text: `<p>The curve joins every count from 1 to 100. It climbs towards 1: the more often
        you check, the more surely the arrow stays up.</p>
        <p>Watch what is lost: with 10 checks 0.22, with 20 checks 0.12, with 40 checks 0.06.
        Doubling the checks halves each piece, so each loss drops to about a quarter
        (lesson 7); there are twice as many of them, so the total loss roughly halves.</p>`,
    },
    {
      text: `<p>So far, chances. Now single runs. Press Run once, then drag the time through
        it.</p>
        <p>Each check says up or down at random, with its chance. A down sends the arrow to
        the bottom, and it keeps turning from there; that run doesn't survive. Try it with 2
        checks and with 50.</p>`,
      hold: true,
    },
    {
      text: `<p>Run 100 makes 100 runs at once and counts how many survived. The share lands
        on the plot as a ring.</p>
        <p>Run 100 at a few check counts: the rings fall near the curve, but only near it,
        as lesson 3's tallies did. Press again at the same count: the runs add up, and the
        ring settles closer.</p>`,
    },
    {
      text: `<p><strong>Sandbox.</strong> Speed, time, checks and runs. Every run lasts 4
        seconds, so the speed sets how far the arrow turns in a run: 45° a second is a half
        turn, 90° a full turn.</p>
        <p>Try a slow speed and few checks, then a fast one: the faster it turns, the more
        checks it takes to hold it. (At 90° a second, a single check at the very end always
        says up: a full turn brings the arrow back to the top.)</p>`,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, plotFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;

    const marks = heightMarks(sphereFigure, view);
    const plot = createPlotView(plotFigure, CHECKS, SURVIVES);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));

    let at = 0;
    let n = 2;
    let speed = START_SPEED;
    let time = 0;
    const allUp = (): History => ({ answers: Array.from({ length: n }, () => "up"), real: false });
    let current = allUp();
    // Runs counted, by check count; they belong to one speed.
    let counted = new Map<number, Counted>();
    // The table's points reached so far; kept across steps, cleared with the page.
    const seen = new Set<number>();
    let done = () => {};

    const reach = () => {
      if (TABLE.includes(n)) seen.add(n);
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
        const turn = turned(speed, RUN);
        const angle = arrowAt(turn, current.answers, time / RUN);
        view.draw({ angle, arc: false, height: true });
        marks(angle, true);
        const chance = (k: number) => survival(turn, k);
        const rings: Point[] = [...counted].map(([k, { ran, survived }]) => [k, survived / ran]);
        const points: Point[] = TABLE.filter((k) => seen.has(k)).map((k) => [k, chance(k)]);
        plot.draw({
          label:
            setup.plot === "none"
              ? "Chance every check says up against the number of checks, not drawn yet"
              : setup.plot === "points"
                ? `Chance every check says up against the number of checks: ${TABLE.filter((k) => seen.has(k))
                    .map((k) => `${checksText(k)}, ${twoPlaces(chance(k))}`)
                    .join("; ")}`
                : `Chance every check says up against the number of checks, climbing towards 1; now ${checksText(n)}, ${twoPlaces(chance(n))}${rings.length ? `; ${rings.length} counted results as rings` : ""}`,
          curves: setup.plot === "curve" ? [sample(chance, 1, MOST, MOST - 1)] : [],
          dots: setup.plot === "points" ? points : setup.plot === "curve" ? [[n, chance(n)]] : [],
          rings: setup.plot === "curve" ? rings : [],
          marks: [],
        });
        math.innerHTML = mathLines(setup.math, turn, n, time, current, counted.get(n))
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);
    resize.observe(plotFigure);

    // A new check count or speed starts again from the run where every check says up.
    const setChecks = (k: number) => {
      n = k;
      current = allUp();
      reach();
      schedule();
    };

    let timeSlider: HTMLInputElement | null = null;
    const setTime = (t: number) => {
      time = t;
      if (timeSlider) {
        timeSlider.value = String(t);
        timeSlider.nextElementSibling!.textContent = seconds(t);
      }
    };

    // Run once starts at time 0, ready to be dragged through; Run 100 shows the last of
    // its runs, ended.
    const go = (count: number) => {
      const turn = turned(speed, RUN);
      const made = Array.from({ length: count }, () => run(turn, n, Math.random));
      const before = counted.get(n) ?? { ran: 0, survived: 0 };
      if (count > 1) counted.set(n, { ran: before.ran + count, survived: before.survived + made.filter((a) => a.every((x) => x === "up")).length });
      current = { answers: made.at(-1)!, real: true };
      setTime(count === 1 ? 0 : RUN);
      schedule();
      if (STEPS[at]!.need === "run") done();
    };

    return {
      show(step, finish) {
        at = step;
        done = finish;
        const setup = STEPS[step]!;
        if (!setup.speed && speed !== START_SPEED) {
          speed = START_SPEED;
          counted = new Map();
        }
        if (setup.checks !== null) n = setup.checks;
        current = allUp();
        time = 0;
        timeSlider = null;
        if (setup.speed)
          addSlider(controls, "speed", 15, 90, speed, (x) => ((speed = x), (counted = new Map()), setChecks(n)), perSecond, 5);
        if (setup.time) timeSlider = addSlider(controls, "time", 0, RUN, time, (x) => ((time = x), schedule()), seconds, 0.02);
        if (setup.count) addSlider(controls, "checks", 1, MOST, n, setChecks, String);
        const buttons: [string, () => void][] = [];
        if (setup.runs !== "none") buttons.push(["Run once", () => go(1)]);
        if (setup.runs === "both") buttons.push(["Run 100", () => go(100)]);
        if (buttons.length) addButtons(controls, buttons);
        reach();
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
