// Lesson 2, "A state is an arrow": the thing studied gives one of two answers when
// checked, and its state is an arrow on one circle of the sphere, written as its angle
// from the top. Angles are taught from scratch; an arc marks how far the arrow has
// turned, and the Angle view writes it out as degrees and a share of a turn.

import { degrees, turnShare } from "./angle.ts";
import type { Lesson } from "./lesson.ts";
import { arrowTip, type Vec3 } from "./sphere.ts";
import { addSlider, span } from "./ui.ts";
import { createSphereView } from "./view.ts";

// Each step's arrow: where it starts, or null for none (the check is answered without
// the picture), and whether the angle slider is there.
const STEPS: { angle: number | null; slider: boolean }[] = [
  { angle: 0, slider: false },
  { angle: 0, slider: true },
  { angle: 90, slider: true },
  { angle: 90, slider: true },
  { angle: null, slider: false },
  { angle: 135, slider: true },
];

// The check's three drawings, in the circle's flat picture: the arrow from the top,
// turned clockwise by its angle, with a tick marking the top.
function dial(angle: number): string {
  const [x, y] = arrowTip(angle);
  return `<svg viewBox="-24 -24 48 48" width="40" height="40" aria-hidden="true">
    <circle r="18" fill="none" stroke="currentColor" stroke-opacity="0.35" />
    <line x1="0" y1="-21" x2="0" y2="-15" stroke="currentColor" stroke-opacity="0.6" />
    <line x1="0" y1="0" x2="${(16 * x).toFixed(1)}" y2="${(-16 * y).toFixed(1)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
  </svg>`;
}

// Labels round the circle in use, just outside it.
const LABELS: { at: Vec3; text: string }[] = [
  { at: arrowTip(0).map((c) => c * 1.14) as Vec3, text: "up · 0°" },
  { at: arrowTip(90).map((c) => c * 1.14) as Vec3, text: "90°" },
  { at: arrowTip(180).map((c) => c * 1.14) as Vec3, text: "down · 180°" },
];

export const lesson2: Lesson = {
  title: "A state is an arrow",
  views: [{ caption: "Sphere", label: "The state arrow on a circle through the top and bottom of a sphere" }, { caption: "Angle" }],
  steps: [
    {
      text: `<p>This course is about something tiny that, when it is checked, gives one of only
        two answers: <em>up</em> or <em>down</em>. In the real experiment of lesson 9 it is an
        atom, and the answers are two of its energy levels.</p>
        <p>Between checks it has a <em>state</em>, drawn as an arrow inside a sphere. Pointing
        at the top, it is up; pointing at the bottom, down.</p>`,
    },
    {
      text: `<p>To say where the arrow points, we give an <em>angle</em>: how far it has turned
        from the top, in degrees, written °.</p>
        <p>A full turn, all the way round and back to the top, is 360°. Half a turn is 180°,
        and a quarter turn 90°.</p><p>Drag the angle. The small arc shows how far the arrow
        has turned.</p>`,
    },
    {
      text: `<p>So a state is just one angle: 0° is up, 180° is down, and 90° is halfway,
        pointing sideways.</p>
        <p><strong>Analogy:</strong> a coin, heads or tails.</p>
        <p><strong>Where it breaks:</strong> a coin is always one or the other; we just
        don't know which. The arrow at 90° is not secretly up or down. It is a state of its
        own, and only becomes an answer when it is checked (lesson 4).</p>`,
    },
    {
      text: `<p>Why a sphere, and not just a circle? The arrow could also point out of the
        bright circle, towards the front or the back. Those directions describe something
        else, called <em>phase</em>, that this course doesn't need.</p>
        <p>So the arrow always stays on the bright circle through the top and the bottom.
        The faint lines only show the sphere's shape.</p>`,
    },
    {
      text: `<p>No slider this time: picture it first.</p><p>Where does the arrow point at
        135°?</p>`,
      check: {
        prompts: [{ label: "135°", choices: ["a", "b", "c"], answer: "b", pictures: [90, 135, 45].map(dial) }],
        after: `b. 135° is a quarter turn (90°) and then half as much again (45°): three
          quarters of the way from the top to the bottom.`,
      },
    },
    {
      text: `<p><strong>Sandbox.</strong> Here is 135°. Move the arrow anywhere.</p>
        <p>Past 180° it comes back up the other side: 270° is sideways again, and at 360° it
        is back at the top, where it started.</p>`,
    },
  ],
  start(figures, controls) {
    const [sphereFigure, angleFigure] = figures as [HTMLElement, HTMLElement];
    const canvas = sphereFigure.querySelector("canvas")!;
    const view = createSphereView(canvas);
    if (!view) return null;

    const marks = sphereFigure.appendChild(Object.assign(document.createElement("div"), { className: "marks" }));
    const labels = LABELS.map(({ text }) => marks.appendChild(span(text, "label")));
    const readout = angleFigure.appendChild(Object.assign(document.createElement("div"), { className: "readout" }));
    const value = readout.appendChild(span("", "value"));
    const share = readout.appendChild(span("", "note"));

    let angle: number | null = 0;

    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        view.draw({ angle, arc: true });
        labels.forEach((label, k) => {
          const [left, top] = view.screen(LABELS[k]!.at);
          label.style.left = `${left}px`;
          label.style.top = `${top}px`;
        });
        value.textContent = angle === null ? "?" : degrees(angle);
        share.textContent = angle === null ? "" : turnShare(angle);
      });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);

    return {
      show(step) {
        const setup = STEPS[step]!;
        angle = setup.angle;
        if (setup.slider) addSlider(controls, "angle", 0, 360, angle ?? 0, (x) => ((angle = x), schedule()), degrees);
        schedule();
      },
      stop: () => resize.disconnect(),
    };
  },
};
