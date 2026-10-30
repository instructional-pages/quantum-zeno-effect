// The Amplitude circle (lesson 6): a flat circle drawn as SVG to the figure's size, where
// up points to the top and down to the right, a quarter turn apart. Its arrow is turned
// half the sphere's angle; a dashed line across to the upright axis marks the amplitude
// of up, and one down to the flat axis the amplitude of down.

import { toPlaces } from "./chance.ts";
import { onCircle, type Point } from "./graph.ts";
import { amplitudeDown, amplitudeUp } from "./zeno.ts";

export interface AmplitudeScene {
  // What the circle shows, for screen readers.
  label: string;
  // The sphere's angle, or null for no arrow.
  angle: number | null;
  // Mark the amplitude of down too.
  down: boolean;
}

export interface AmplitudeView {
  draw(scene: AmplitudeScene): void;
}

const f = (p: Point) => p.map((c) => c.toFixed(1)).join(" ");

export function createAmplitudeView(figure: HTMLElement): AmplitudeView {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("dial");
  svg.role = "img";
  figure.append(svg);

  return {
    draw({ label, angle, down }) {
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      const main = figure.classList.contains("main");
      // Room above for the caption, and round the circle for its labels.
      const r = Math.max(1, Math.min(width * (main ? 0.3 : 0.32), (height - (main ? 120 : 64)) * 0.36));
      const c: Point = [width / 2, height / 2 + (main ? 24 : 12)];
      const [cx, cy] = c;
      const reach = r * 1.12;

      const parts = [
        `<circle class="shape" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`,
        `<path class="axis" d="M${f([cx, cy + reach])}V${(cy - reach).toFixed(1)}M${f([cx - reach, cy])}H${(cx + reach).toFixed(1)}"/>`,
        // The quarter the arrow uses, from up to down.
        `<path class="track" d="M${f(onCircle(0, c, r))}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${f(onCircle(90, c, r))}"/>`,
        `<text x="${cx.toFixed(1)}" y="${(cy - reach - 8).toFixed(1)}" text-anchor="middle">up</text>`,
        `<text x="${(cx + reach + 8).toFixed(1)}" y="${cy.toFixed(1)}" dominant-baseline="middle">down</text>`,
      ];
      if (angle !== null) {
        const half = angle / 2;
        const tip = onCircle(half, c, r);
        const [tx, ty] = tip;
        const arc = r * 0.28;
        if (half > 0) {
          // Inside the arc while it is wide enough, else just past the arrow.
          const [lx, ly] = onCircle(half < 20 ? half + 12 : half / 2, c, arc + 16);
          parts.push(
            `<path class="arc" d="M${f(onCircle(0, c, arc))}A${arc.toFixed(1)} ${arc.toFixed(1)} 0 0 1 ${f(onCircle(half, c, arc))}"/>`,
            `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${half}°</text>`,
          );
        }
        // The amplitude of up is the tip's height, read off the upright axis, labelled
        // on the side away from the arrow.
        parts.push(`<path class="mark" d="M${f(tip)}H${cx.toFixed(1)}"/>`, `<text class="value" x="${(cx - 8).toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="end" dominant-baseline="middle">${toPlaces(amplitudeUp(angle), 3)}</text>`);
        if (down)
          parts.push(`<path class="mark" d="M${f(tip)}V${cy.toFixed(1)}"/>`, `<text class="value" x="${tx.toFixed(1)}" y="${(cy + 18).toFixed(1)}" text-anchor="middle">${toPlaces(amplitudeDown(angle), 3)}</text>`);
        // The arrow: a line from the centre and a head at the tip.
        const t = (half * Math.PI) / 180;
        const [dx, dy] = [Math.sin(t), -Math.cos(t)];
        const head = main ? 14 : 9;
        const base: Point = [tx - dx * head, ty - dy * head];
        parts.push(
          `<path class="arrow" d="M${f(c)}L${f(base)}"/>`,
          `<path class="head" d="M${f(tip)}L${f([base[0] - dy * head * 0.45, base[1] + dx * head * 0.45])}L${f([base[0] + dy * head * 0.45, base[1] - dx * head * 0.45])}Z"/>`,
        );
      }
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.innerHTML = parts.join("");
      svg.ariaLabel = label;
    },
  };
}
