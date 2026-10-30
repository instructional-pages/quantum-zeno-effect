// The arithmetic behind the Plot view: values placed in a box on the screen, a line
// through points, and a function sampled along an axis.

export type Point = [number, number];

export interface Axis {
  min: number;
  max: number;
  // Values marked along the axis, and how each is written.
  ticks: number[];
  format: (value: number) => string;
  label: string;
}

// The plotting area in screen pixels, y down.
export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Where (x, y) lands in `box`: x from the left, y from the bottom.
export function place([x, y]: Point, xAxis: Axis, yAxis: Axis, box: Box): Point {
  const across = (x - xAxis.min) / (xAxis.max - xAxis.min);
  const up = (y - yAxis.min) / (yAxis.max - yAxis.min);
  return [box.left + across * box.width, box.top + (1 - up) * box.height];
}

// An SVG path through the points, in order, to a tenth of a pixel.
export const path = (points: readonly Point[], xAxis: Axis, yAxis: Axis, box: Box): string =>
  points
    .map((p, k) => {
      const [x, y] = place(p, xAxis, yAxis, box);
      return `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");

// `f` at n + 1 evenly spaced points from min to max, both ends included.
export const sample = (f: (x: number) => number, min: number, max: number, n: number): Point[] =>
  Array.from({ length: n + 1 }, (_, k) => {
    const x = min + ((max - min) * k) / n;
    return [x, f(x)];
  });
