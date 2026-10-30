// The Plot view (lessons 1, 5, 8 and 10): a line plot drawn as SVG to the figure's size,
// with its axes and their ticks, curves, dots on them, and dashed upright marks, each
// with a label above the plot.

import { path, place, type Axis, type Box, type Point } from "./graph.ts";

export interface PlotScene {
  // What the plot shows, for screen readers.
  label: string;
  curves: Point[][];
  dots: Point[];
  marks: { x: number; label: string }[];
}

export interface PlotView {
  draw(scene: PlotScene): void;
}

// Room round the plotting area for the caption, ticks and axis labels, in the main view
// and in a small one (which leaves out the axis labels).
const MAIN = { left: 64, right: 56, top: 104, bottom: 64 };
const SMALL = { left: 30, right: 14, top: 64, bottom: 24 };

export function createPlotView(figure: HTMLElement, xAxis: Axis, yAxis: Axis): PlotView {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("plot");
  svg.role = "img";
  figure.append(svg);

  return {
    draw({ label, curves, dots, marks }) {
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      const main = figure.classList.contains("main");
      const room = main ? MAIN : SMALL;
      const box: Box = { left: room.left, top: room.top, width: Math.max(1, width - room.left - room.right), height: Math.max(1, height - room.top - room.bottom) };
      const at = (p: Point) => place(p, xAxis, yAxis, box).map((c) => c.toFixed(1));
      const bottom = box.top + box.height;

      const parts: string[] = [];
      for (const x of xAxis.ticks) {
        const [left] = at([x, yAxis.min]);
        parts.push(`<line class="tick" x1="${left}" y1="${bottom}" x2="${left}" y2="${bottom + 4}"/>`, `<text x="${left}" y="${bottom + 16}" text-anchor="middle">${xAxis.format(x)}</text>`);
      }
      for (const y of yAxis.ticks) {
        const [, top] = at([xAxis.min, y]);
        parts.push(`<line class="tick" x1="${box.left - 4}" y1="${top}" x2="${box.left}" y2="${top}"/>`, `<text x="${box.left - 8}" y="${top}" text-anchor="end" dominant-baseline="middle">${yAxis.format(y)}</text>`);
      }
      parts.push(`<path class="axis" d="M${box.left} ${box.top}V${bottom}H${box.left + box.width}"/>`);
      if (main)
        parts.push(
          `<text x="${box.left + box.width / 2}" y="${bottom + 40}" text-anchor="middle">${xAxis.label}</text>`,
          `<text x="${box.left}" y="${box.top - 36}" text-anchor="middle">${yAxis.label}</text>`,
        );
      for (const mark of marks) {
        if (mark.x < xAxis.min || mark.x > xAxis.max) continue;
        const [left] = at([mark.x, yAxis.min]);
        parts.push(`<line class="mark" x1="${left}" y1="${box.top}" x2="${left}" y2="${bottom}"/>`, `<text x="${left}" y="${box.top - 10}" text-anchor="middle">${mark.label}</text>`);
      }
      for (const curve of curves) parts.push(`<path class="curve" d="${path(curve, xAxis, yAxis, box)}"/>`);
      for (const dot of dots) {
        const [x, y] = at(dot);
        parts.push(`<circle class="dot" cx="${x}" cy="${y}" r="${main ? 6 : 4}"/>`);
      }
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.innerHTML = parts.join("");
      svg.ariaLabel = label;
    },
  };
}
