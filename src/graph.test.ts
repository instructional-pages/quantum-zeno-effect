import assert from "node:assert/strict";
import { test } from "node:test";
import { onCircle, path, place, sample, type Axis } from "./graph.ts";

const time: Axis = { min: 0, max: 12, ticks: [], format: String, label: "time" };
const chance: Axis = { min: 0, max: 1, ticks: [], format: String, label: "chance" };
const box = { left: 40, top: 20, width: 240, height: 100 };

test("values land in the box, y counted up from its bottom", () => {
  assert.deepEqual(place([0, 0], time, chance, box), [40, 120]);
  assert.deepEqual(place([12, 1], time, chance, box), [280, 20]);
  assert.deepEqual(place([3, 0.5], time, chance, box), [100, 70]);
});

test("a path moves to its first point and draws a line to each next one", () => {
  assert.equal(path([[0, 1], [6, 0.5], [12, 0]], time, chance, box), "M40.0 20.0L160.0 70.0L280.0 120.0");
  assert.equal(path([], time, chance, box), "");
});

test("sampling includes both ends", () => {
  assert.deepEqual(sample((x) => 2 * x, 0, 12, 4), [[0, 0], [3, 6], [6, 12], [9, 18], [12, 24]]);
});

test("a point on a circle is turned clockwise from its top", () => {
  const at = (turn: number) => onCircle(turn, [100, 100], 50).map((c) => Number(c.toFixed(9)));
  assert.deepEqual(at(0), [100, 50]);
  assert.deepEqual(at(90), [150, 100]);
  assert.deepEqual(at(180), [100, 150]);
});
