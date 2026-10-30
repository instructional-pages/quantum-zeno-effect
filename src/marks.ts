// Labels over the sphere view for lessons that read the arrow's height: "up" and "down"
// just outside the top and bottom of the circle in use (with their heights once the height
// is taught), and the height's value beside the axis.

import { twoPlaces } from "./chance.ts";
import { arrowTip, heightFoot, type Vec3 } from "./sphere.ts";
import { span } from "./ui.ts";
import type { SphereView } from "./view.ts";
import { height } from "./zeno.ts";

const ENDS: { at: Vec3; text: string; withHeight: string }[] = [
  { at: arrowTip(0).map((c) => c * 1.14) as Vec3, text: "up", withHeight: "up · height 1" },
  { at: arrowTip(180).map((c) => c * 1.14) as Vec3, text: "down", withHeight: "down · height −1" },
];

// Adds the labels to `figure`; the returned function places them for an arrow at `angle`.
export function heightMarks(figure: HTMLElement, view: SphereView): (angle: number, shown: boolean) => void {
  const marks = figure.appendChild(Object.assign(document.createElement("div"), { className: "marks" }));
  const ends = ENDS.map(({ text }) => marks.appendChild(span(text, "label")));
  const level = marks.appendChild(span("", "label"));
  const place = (label: HTMLElement, at: Vec3) => {
    const [left, top] = view.screen(at);
    label.style.left = `${left}px`;
    label.style.top = `${top}px`;
  };
  return (angle, shown) => {
    ends.forEach((label, k) => {
      place(label, ENDS[k]!.at);
      label.textContent = shown ? ENDS[k]!.withHeight : ENDS[k]!.text;
    });
    // The height's value beside the axis, on the side away from the arrow, except at the
    // top and bottom, which their own labels give.
    const h = height(angle);
    level.hidden = !shown || Math.abs(h) > 0.97;
    place(level, [...heightFoot(angle)].map((c, k) => (k === 0 ? (arrowTip(angle)[0] >= 0 ? -0.2 : 0.2) : c)) as Vec3);
    level.textContent = twoPlaces(h);
  };
}
