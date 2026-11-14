// Lesson 10, "The sandbox": everything together. One recap screen per idea (arrow, chance,
// check, turning, amplitude, small turns), each one sentence with its view made main; then
// a final predict-then-why round at a speed and time the learner hasn't seen (80° a second
// for 3 seconds, two thirds of a turn: 4 checks, then 8); then the sandbox with every
// control: speed, total time, checks, Run once (played on the sphere, as in lesson 1) and
// Run 100 (rings on the curve, as in lesson 8).

import { degrees, pastTurns } from "./angle.ts";
import { createAmplitudeView } from "./amplitude.ts";
import { chanceSum, perCheck, repeated, smallChance, squared, squaredSmall, twoPlaces } from "./chance.ts";
import type { Axis, Point } from "./graph.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { createPlotView } from "./plot.ts";
import { addButtons, addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { amplitudeDown, amplitudeUp, arrowAt, chanceDown, chanceUp, check, height, reset, run, soFar, survival, turned, type Answer } from "./zeno.ts";

const MOST = 100;
// The final round: a speed and a total time the guided lessons never used.
const ASK_SPEED = 80;
const ASK_TIME = 3;
const ASK_CHECKS = 4;
// The turn rate of the turning recap (lesson 5's half turn in 4 seconds).
const RECAP_SPEED = 45;
const RECAP_TIME = 4;
// The small turns lesson 7's table filled in.
const SMALL = [40, 20, 10];

// An angle to one place when it isn't whole (37.5°, 17.1°).
const angleText = (angle: number): string => `${Number(angle.toFixed(1))}°`;
const seconds = (t: number, places = 1): string => `${t.toFixed(places)} s`;
const perSecond = (speed: number): string => `${speed}°/s`;
const checksText = (n: number): string => `${n} ${n === 1 ? "check" : "checks"}`;

const CHECKS: Axis = { min: 1, max: MOST, ticks: [1, 20, 40, 60, 80, 100], format: String, label: "checks" };
const SURVIVES: Axis = { min: 0, max: 1, ticks: [0, 0.5, 1], format: String, label: "chance all say up" };

// Views, by their place in `views` below.
const SPHERE = 0;
const AMPLITUDE = 1;
const PLOT = 2;
const MATH = 3;

// What a step is about: one of the recaps, the final round's two questions, or the
// sandbox.
type Topic = "arrow" | "chance" | "check" | "turning" | "amplitude" | "small" | "ask" | "why" | "sandbox";

const TOPICS: Topic[] = ["arrow", "chance", "check", "turning", "amplitude", "small", "ask", "why", "sandbox"];
const RECAP: Topic[] = ["arrow", "chance", "check", "turning", "amplitude", "small"];
// Where each recap's arrow starts, and the most its angle slider allows.
const START: Partial<Record<Topic, { angle: number; most: number }>> = {
  arrow: { angle: 60, most: 180 },
  chance: { angle: 60, most: 180 },
  check: { angle: 60, most: 180 },
  amplitude: { angle: 60, most: 180 },
  small: { angle: 20, most: 60 },
};

// One run's answers: from Run once, or (before any) none, the arrow waiting at the top.
interface History {
  answers: Answer[];
  real: boolean;
}

// Runs counted at one check count: how many, and how many had every check say up.
interface Counted {
  ran: number;
  survived: number;
}

// The run's numbers in the Math view: the turn, the pieces, one check, all of them.
function runLines(speed: number, time: number, n: number): string[] {
  const turn = turned(speed, time);
  const past = pastTurns(turn);
  const piece = turn / n;
  return [
    `${perSecond(speed)} for ${seconds(time)}: the arrow turns ${angleText(turn)}${past ? ` (${past})` : ""}`,
    `${checksText(n)} · each piece turns ${angleText(turn)} / ${n} = ${angleText(piece)}`,
    `each check: chance of up = cos²(${angleText(piece / 2)}) = ${perCheck(chanceUp(piece))}`,
    `every check: ${repeated(chanceUp(piece), n)}`,
  ];
}

// The Math view's lines for a recap, HTML.
function recapLines(topic: Topic, angle: number, time: number, said: Answer | null): string[] {
  const h = height(angle);
  if (topic === "arrow") return [`angle from the top: ${degrees(angle)}`, `<span class="note">0° is up, 180° is down</span>`];
  if (topic === "chance") return [`height = ${twoPlaces(h)}`, `chance of up = ${chanceSum(h)} = ${twoPlaces(chanceUp(angle))}`];
  if (topic === "check")
    return [
      `chance of up = ${chanceSum(h)} = ${twoPlaces(chanceUp(angle))}`,
      said ? `the check said ${said}: the arrow now points ${said}` : `<span class="note">no check yet</span>`,
    ];
  if (topic === "turning") return [`turned = ${perSecond(RECAP_SPEED)} × ${seconds(time)} = ${angleText(turned(RECAP_SPEED, time))}`];
  if (topic === "amplitude")
    return [`amplitude of up = cos(${degrees(angle)} / 2) = ${amplitudeUp(angle).toFixed(3)}`, `chance of up = ${squared(amplitudeUp(angle))}`, `<span class="note">lesson 3: ${chanceSum(h)} = ${twoPlaces(chanceUp(angle))}</span>`];
  return [
    `turn ${degrees(angle)}: chance of down = ${squaredSmall(amplitudeDown(angle))}`,
    ...SMALL.map((a) => `<span class="note">turn ${degrees(a)}: chance of down ${smallChance(chanceDown(a))}</span>`),
    `<span class="note">each halving: about a quarter</span>`,
  ];
}

const countLine = ({ ran, survived }: Counted): string => `runs counted: ${ran} · every check said up in ${survived} (${twoPlaces(survived / ran)})`;

// What the status line under Run once says a fraction `t` of the way through a run.
function status(answers: readonly Answer[], t: number, real: boolean): string {
  if (!real) return "Press Run once to watch a run.";
  const n = answers.length;
  const { done, down } = soFar(answers, t);
  if (down) return `check ${down} of ${n} said down: this run doesn't survive`;
  if (done === n) return n === 1 ? "the check said up: it survives" : `all ${n} checks said up: it survives`;
  return done ? `${done === 1 ? "check 1" : `checks 1 to ${done}`} of ${n} said up` : "turning…";
}

export const lesson10: Lesson = {
  title: "The sandbox",
  views: [
    { caption: "Sphere", label: "The state arrow on its circle of the sphere" },
    { caption: "Amplitude circle" },
    { caption: "Plot" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>The last lesson puts everything together. First, one screen per idea, each
        with its view.</p>
        <p><strong>The arrow</strong> (lesson 2). A state is an arrow on the sphere: at the
        top it is up, at the bottom down, and its angle from the top says how far between.</p>`,
      view: SPHERE,
    },
    {
      text: `<p><strong>Chance</strong> (lesson 3). A check says up with chance (1 + height)
        / 2, read from the arrow's height.</p>`,
      view: SPHERE,
    },
    {
      text: `<p><strong>A check</strong> (lesson 4). A check answers up or down at random,
        with that chance, and leaves the arrow pointing at its answer.</p>
        <p>Press Check a few times, moving the angle in between.</p>`,
      view: SPHERE,
    },
    {
      text: `<p><strong>Turning</strong> (lesson 5). Left alone, the arrow turns steadily:
        the angle is the speed times the time.</p>`,
      view: SPHERE,
    },
    {
      text: `<p><strong>Amplitude</strong> (lesson 6). The chance of up is a square: the
        amplitude of up, cos of half the angle, multiplied by itself.</p>`,
      view: AMPLITUDE,
    },
    {
      text: `<p><strong>Small turns</strong> (lesson 7). Halve a small turn and its chance
        of down drops to about a quarter, because that chance is a square.</p>`,
      view: MATH,
    },
    {
      text: `<p>Now a run you haven't seen: the arrow turns at 80° a second for 3 seconds,
        240° in all, two thirds of a full turn.</p>
        <p>With 4 checks, every check says up with chance 0.32 (the Math view works it
        out). Double them to 8: will that chance be higher or lower?</p>`,
      view: PLOT,
      check: {
        prompts: [{ label: "8 checks", choices: ["higher", "lower"], answer: "higher" }],
        after: `Higher: 0.57. Each piece is now 30° instead of 60°, and a check after 30° says
          up with chance 0.933 instead of 0.750.`,
      },
    },
    {
      text: `<p>Why? Which explanation is right?</p>
        <p>(a) The checks slow the turning down.</p>
        <p>(b) Each check pushes the arrow back up.</p>
        <p>(c) Halving a piece cuts its loss to about a quarter, so twice as many pieces lose
        less in all.</p>`,
      view: MATH,
      check: {
        prompts: [{ label: "Why", choices: ["a", "b", "c"], answer: "c" }],
        after: `(c). Each check's loss drops from 0.25 to 0.067, close to a quarter (lesson
          7); there are twice as many checks, but together they lose 0.43 instead of 0.68.
          <br>(a) is false: between the checks the arrow turns at 80° a second, as before.
          (b) is only the picture: a check can just as well say down. It says up so often
          <em>because</em> of (c).`,
      },
    },
    {
      text: `<p><strong>Sandbox.</strong> Every control: the speed, the total time of a run,
        the checks, Run once to watch a run, and Run 100 to count them on the plot.</p>
        <p>Try a long, fast run with few checks, then add checks until the arrow holds. (A
        run of exactly a full turn, with one check at the end, always survives: the arrow is
        back at the top.)</p>`,
      view: PLOT,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, amplitudeFigure, plotFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;
    const marks = heightMarks(sphereFigure, view);
    const dial = createAmplitudeView(amplitudeFigure);
    const plot = createPlotView(plotFigure, CHECKS, SURVIVES);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let at = 0;
    // The recaps' arrow, the turning recap's time, and the last answer of the check recap.
    let angle = 60;
    let recapTime = 0;
    let said: Answer | null = null;
    let angleSlider: HTMLInputElement | null = null;
    // The run: speed, total time, checks, the run on the sphere and how far through it is
    // (0 to 1), and the runs counted by check count, which belong to one speed and time.
    let speed = ASK_SPEED;
    let total = ASK_TIME;
    let n = ASK_CHECKS;
    let current: History = { answers: [], real: false };
    let t = 0;
    let counted = new Map<number, Counted>();
    let line: HTMLElement | null = null;
    let timeSlider: HTMLInputElement | null = null;
    let playing = 0;

    const draw = () => {
      const topic = TOPICS[at]!;
      const recap = RECAP.includes(topic);
      const turn = turned(speed, total);
      const piece = turn / n;
      const shown = recap ? (topic === "turning" ? turned(RECAP_SPEED, recapTime) : angle) : current.real ? arrowAt(turn, current.answers, t) : 0;
      const heights = topic !== "arrow" && topic !== "small";
      view.draw({ angle: shown, arc: topic === "arrow" || topic === "amplitude" || topic === "small", height: heights });
      marks(shown, heights);
      // In the recaps the circle shows the arrow's own amplitude; in the run, one piece's,
      // since each check's chance is cos² of half a piece.
      const dialAngle = recap ? (shown <= 180 ? shown : null) : piece <= 180 ? piece : null;
      dial.draw({
        label:
          dialAngle === null
            ? "The amplitude circle, with no arrow"
            : `${recap ? "The arrow" : "One piece of the run"} on the amplitude circle, turned ${angleText(dialAngle / 2)}: amplitude of up ${amplitudeUp(dialAngle).toFixed(3)}, of down ${amplitudeDown(dialAngle).toFixed(3)}`,
        angle: dialAngle,
        down: true,
      });

      const chance = (k: number) => survival(turn, k);
      const sandbox = topic === "sandbox";
      // Whole numbers of checks only: between them, at turns past a half turn, a
      // fraction of a check would give values no run can have.
      const curve: Point[] = Array.from({ length: MOST }, (_, k) => [k + 1, chance(k + 1)]);
      const rings: Point[] = [...counted].map(([k, { ran, survived }]) => [k, survived / ran]);
      plot.draw({
        label: recap
          ? "Chance every check says up against the number of checks, not drawn yet"
          : sandbox
            ? `Chance every check says up against the number of checks, for a turn of ${angleText(turn)}; now ${checksText(n)}, ${twoPlaces(chance(n))}${rings.length ? `; ${rings.length} counted results as rings` : ""}`
            : `Chance every check says up against the number of checks: ${checksText(ASK_CHECKS)}, ${twoPlaces(chance(ASK_CHECKS))}`,
        curves: sandbox ? [curve] : [],
        dots: recap ? [] : [[n, chance(n)]],
        rings: sandbox ? rings : [],
        marks: [],
      });

      let lines: string[];
      if (recap) lines = recapLines(topic, angle, recapTime, said);
      else if (sandbox) {
        lines = runLines(speed, total, n);
        const c = counted.get(n);
        if (c) lines.push(countLine(c));
      } else lines = [...runLines(ASK_SPEED, ASK_TIME, ASK_CHECKS), `${checksText(2 * ASK_CHECKS)}: higher or lower?`];
      math.innerHTML = lines.map((l) => `<p>${l}</p>`).join("");

      if (line) {
        line.ariaLive = playing ? "off" : "polite";
        const text = reduced && current.real && t === 0 ? "Drag the time through the run." : status(current.answers, t, current.real);
        if (line.textContent !== text) line.textContent = text;
      }
      if (timeSlider) {
        timeSlider.value = String(t * total);
        timeSlider.nextElementSibling!.textContent = seconds(t * total, 2);
      }
    };
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => ((pending = false), draw()));
    };
    const resize = new ResizeObserver(schedule);
    for (const figure of figures) resize.observe(figure);

    const stopPlaying = () => {
      cancelAnimationFrame(playing);
      playing = 0;
    };
    // Back to the arrow waiting at the top; a new speed or time also clears the count.
    const wait = () => {
      stopPlaying();
      current = { answers: [], real: false };
      t = 0;
      schedule();
    };
    const restart = () => {
      counted = new Map();
      if (timeSlider) timeSlider.max = String(total);
      wait();
    };

    // Run once plays the run over its total time (under reduced motion, the time slider
    // steps through it); Run 100 counts 100 runs and shows the last one, ended.
    const go = (count: number) => {
      stopPlaying();
      const turn = turned(speed, total);
      const made = Array.from({ length: count }, () => run(turn, n, Math.random));
      current = { answers: made.at(-1)!, real: true };
      if (count > 1) {
        const before = counted.get(n) ?? { ran: 0, survived: 0 };
        counted.set(n, { ran: before.ran + count, survived: before.survived + made.filter((a) => a.every((x) => x === "up")).length });
        t = 1;
      } else if (reduced) t = 0;
      else {
        const begin = performance.now();
        const frame = (now: number) => {
          t = Math.min((now - begin) / (total * 1000), 1);
          playing = t < 1 ? requestAnimationFrame(frame) : 0;
          draw();
        };
        t = 0;
        playing = requestAnimationFrame(frame);
      }
      schedule();
    };

    const checkNow = () => {
      said = check(angle, Math.random);
      angle = reset(said);
      if (angleSlider) {
        angleSlider.value = String(angle);
        angleSlider.nextElementSibling!.textContent = degrees(angle);
      }
      schedule();
    };

    return {
      show(step) {
        at = step;
        const topic = TOPICS[step]!;
        stopPlaying();
        angleSlider = null;
        timeSlider = null;
        line = null;
        said = null;
        const start = START[topic];
        if (start) {
          angle = start.angle;
          angleSlider = addSlider(controls, "angle", 0, start.most, angle, (x) => ((angle = x), schedule()), degrees, 2);
          if (topic === "check") addButtons(controls, [["Check", checkNow]]);
        }
        if (topic === "turning") {
          recapTime = 2;
          addSlider(controls, "time", 0, RECAP_TIME, recapTime, (x) => ((recapTime = x), schedule()), seconds, 0.1);
        }
        if (topic === "ask" || topic === "why") {
          speed = ASK_SPEED;
          total = ASK_TIME;
          n = ASK_CHECKS;
          counted = new Map();
        }
        if (topic === "sandbox") {
          n = 2 * ASK_CHECKS;
          addSlider(controls, "speed", 15, 90, speed, (x) => ((speed = x), restart()), perSecond, 5);
          addSlider(controls, "total", 1, 6, total, (x) => ((total = x), restart()), (x) => seconds(x), 0.5);
          addSlider(controls, "checks", 1, MOST, n, (k) => ((n = k), wait()), String);
          if (reduced) timeSlider = addSlider(controls, "time", 0, total, 0, (x) => ((t = current.real ? x / total : 0), schedule()), (x) => seconds(x, 2), 0.02);
          addButtons(controls, [
            ["Run once", () => go(1)],
            ["Run 100", () => go(100)],
          ]);
          line = controls.appendChild(Object.assign(document.createElement("p"), { className: "status" }));
        }
        current = { answers: [], real: false };
        t = 0;
        schedule();
      },
      stop: () => (stopPlaying(), resize.disconnect()),
    };
  },
};
