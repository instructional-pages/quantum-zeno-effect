// Lesson 6, "Amplitudes": the chance is a square. Squaring is taught first; then the
// Amplitude circle, a flat circle whose arrow turns half the sphere's angle, gives the
// amplitude of up as its height, and the chance of up is that squared: cos²(angle / 2),
// the same number as lesson 3's (1 + cos angle) / 2. Up and down are 180° apart on the
// sphere but only 90° apart as amplitudes, which is why the angle is halved.

import { degrees } from "./angle.ts";
import { createAmplitudeView } from "./amplitude.ts";
import { chanceSum, squared, twoPlaces } from "./chance.ts";
import type { Lesson } from "./lesson.ts";
import { heightMarks } from "./marks.ts";
import { addSlider } from "./ui.ts";
import { createSphereView } from "./view.ts";
import { amplitudeDown, amplitudeUp, chanceUp, height } from "./zeno.ts";

// How much the Math view shows: squaring alone, the amplitude of up squared, that with
// the amplitude named as a cosine and lesson 3's form beside it, the same with the
// amplitude of down, or the check's question.
type Shown = "square" | "amplitude" | "cosine" | "down" | "check";

// Each step's starting angle, or null for no arrows (the check is answered without the
// pictures), whether the angle slider is there, and what the Math view shows. The
// Amplitude circle's arrow is drawn once the circle is introduced, and the amplitude of
// down once it is taught.
const STEPS: { angle: number | null; slider: boolean; math: Shown }[] = [
  { angle: 60, slider: false, math: "square" },
  { angle: 60, slider: true, math: "amplitude" },
  { angle: 60, slider: true, math: "cosine" },
  { angle: 60, slider: true, math: "down" },
  { angle: 60, slider: true, math: "down" },
  { angle: null, slider: false, math: "check" },
  { angle: 74, slider: true, math: "down" },
];

// The Math view's lines, HTML.
function mathLines(angle: number | null, shown: Shown): string[] {
  if (shown === "square") return ["3² = 3 × 3 = 9", "½² = ½ × ½ = ¼", "0.5² = 0.5 × 0.5 = 0.25"];
  if (shown === "check" || angle === null) return ["amplitude of up = 0.8", "chance of up = 0.8² = ?"];
  const up = amplitudeUp(angle);
  const lines =
    shown === "amplitude"
      ? [`amplitude of up = ${up.toFixed(3)}`]
      : [`amplitude of up = cos(${degrees(angle)} / 2)`, `= cos ${degrees(angle / 2)} = ${up.toFixed(3)}`];
  lines.push(`chance of up = ${squared(up)}`);
  if (shown !== "amplitude") lines.push(`<span class="note">lesson 3: ${chanceSum(height(angle))} = ${twoPlaces(chanceUp(angle))}</span>`);
  if (shown === "down") {
    const down = amplitudeDown(angle);
    lines.push(`amplitude of down = ${down.toFixed(3)}`, `chance of down = ${squared(down)}`, `${twoPlaces(up * up)} + ${twoPlaces(down * down)} = 1`);
  }
  return lines;
}

export const lesson6: Lesson = {
  title: "Amplitudes",
  views: [
    { caption: "Sphere", label: "The state arrow, its angle marked with an arc, and a dashed line from its tip across to the vertical axis marking its height" },
    { caption: "Amplitude circle" },
    { caption: "Math" },
  ],
  steps: [
    {
      text: `<p>One new tool first. To <em>square</em> a number is to multiply it by itself,
        written with a small 2: 3² = 3 × 3 = 9.</p>
        <p>For a number between 0 and 1, squaring makes it smaller: ½² = ½ × ½ = ¼, and
        0.5² = 0.25. The Math view has them.</p>`,
    },
    {
      text: `<p>Quantum physics describes a state with a number for each answer, its
        <em>amplitude</em>. The chance of an answer is its amplitude squared.</p>
        <p>The Amplitude circle, beside the sphere, draws it: a flat circle with its own
        arrow, turned only half as far as the sphere's. The amplitude of up is that arrow's
        height, read off the dashed line. (Click it to make it large.)</p>
        <p>Drag the angle, and watch both arrows.</p>`,
    },
    {
      text: `<p>As on the sphere, a height on a circle is a cosine, here of half the angle:
        amplitude of up = cos(angle / 2).</p>
        <p>So the chance of up is cos(angle / 2) squared, written cos²(angle / 2). It is the
        same chance as lesson 3's, worked out another way.</p>
        <p>Try 0°, 90°, 180° and 60°: the Math view's two answers always agree.</p>`,
    },
    {
      text: `<p>Why half? Up and down are complete opposites: an arrow that is surely up is
        never down. The sphere draws opposites pointing opposite ways, 180° apart.</p>
        <p>Amplitudes draw them at right angles instead: up along the circle's upright line,
        down along its flat one, 90° apart. So while the sphere's arrow goes from up to down,
        the amplitude arrow turns a quarter turn.</p>
        <p>Its sideways reach is the amplitude of down, and its square the chance of down.
        The two chances still add up to 1.</p>`,
    },
    {
      text: `<p>The rest of the course uses this form:</p>
        <p class="formula">chance of up = cos²(angle / 2)</p>
        <p>It says plainly what lesson 7 needs: a chance is a square, and squaring a small
        number makes it much smaller.</p>`,
    },
    {
      text: `<p>No pictures this time.</p><p>The amplitude of up is 0.8. What is the chance
        of up?</p>`,
      check: {
        prompts: [{ label: "Chance of up", answer: 0.64 }],
        after: `0.64: the amplitude squared, 0.8 × 0.8. The sphere's arrow is then at about
          74°, and the amplitude arrow at half that, 37°.`,
      },
    },
    {
      text: `<p><strong>Sandbox.</strong> Here is the check's arrow, at 74°. Move it anywhere
        from up to down.</p>
        <p>Both drawings and both formulas follow it: the sphere's height gives the chance
        one way, the amplitude squared the other.</p>`,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, amplitudeFigure, mathFigure] = figures as [HTMLElement, HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;

    const marks = heightMarks(sphereFigure, view);
    const circle = createAmplitudeView(amplitudeFigure);
    const math = mathFigure.appendChild(Object.assign(document.createElement("div"), { className: "math" }));

    let at = 0;
    let angle: number | null = 60;

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const setup = STEPS[at]!;
        const down = setup.math === "down";
        view.draw({ angle, arc: true, height: angle !== null });
        marks(angle ?? 0, angle !== null);
        // The circle stays empty until the step that introduces it.
        const drawn = setup.math === "square" ? null : angle;
        circle.draw({
          label:
            drawn === null
              ? "The amplitude circle, with no arrow"
              : `The amplitude arrow at ${degrees(drawn / 2)}, half the sphere's angle: amplitude of up ${amplitudeUp(drawn).toFixed(3)}${down ? `, amplitude of down ${amplitudeDown(drawn).toFixed(3)}` : ""}`,
          angle: drawn,
          down,
        });
        math.innerHTML = mathLines(angle, setup.math)
          .map((line) => `<p>${line}</p>`)
          .join("");
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);
    resize.observe(amplitudeFigure);

    return {
      show(step) {
        at = step;
        const setup = STEPS[step]!;
        angle = setup.angle;
        // Even steps, so half the angle is always whole.
        if (setup.slider) addSlider(controls, "angle", 0, 180, angle ?? 0, (x) => ((angle = x), schedule()), degrees, 2);
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
