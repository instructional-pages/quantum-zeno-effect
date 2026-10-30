import assert from "node:assert/strict";
import { test } from "node:test";
import { amplitudeUp, arrowAt, chanceDown, chanceUp, check, checkTwice, endsDown, height, run, seeded, survival } from "./zeno.ts";

const round = (x: number, places: number) => Number(x.toFixed(places));

test("the chance of up is exact at the top, the side and the bottom", () => {
  assert.deepEqual([0, 90, 180].map(chanceUp), [1, 0.5, 0]);
  assert.deepEqual([0, 180].map(height), [1, -1]);
});

test("at 60° the height is ½ and the chance of up ¾ (lesson 3's check)", () => {
  assert.equal(round(height(60), 12), 0.5);
  assert.equal(round(chanceUp(60), 12), 0.75);
});

test("45° per second for 4 seconds is a half turn: chance of up 0 (lesson 5's check)", () => {
  assert.equal(chanceUp(45 * 4), 0);
});

test("the amplitude squared is the chance, at every angle (lesson 6)", () => {
  for (let angle = 0; angle <= 360; angle += 15) assert.ok(Math.abs(amplitudeUp(angle) ** 2 - chanceUp(angle)) < 1e-12);
  assert.equal(round(amplitudeUp(60) ** 2, 12), 0.75);
});

test("lesson 7's table: halving a small turn quarters the chance of down", () => {
  assert.deepEqual([40, 20, 10].map((a) => round(chanceDown(a), 4)), [0.117, 0.0302, 0.0076]);
  assert.ok(Math.abs(chanceDown(10) / chanceDown(20) - 0.25) < 0.005);
});

test("lesson 8's table: surviving every check of a half turn", () => {
  assert.deepEqual([1, 2, 10, 100].map((n) => round(survival(180, n), 2)), [0, 0.25, 0.78, 0.98]);
});

test("more checks always means a better chance of surviving a half turn", () => {
  for (let n = 1; n < 200; n++) assert.ok(survival(180, n + 1) > survival(180, n));
});

test("lesson 9's prediction: ending down falls from 1 towards 0 as the flashes double", () => {
  const predictions = [1, 2, 4, 8, 16, 32, 64].map((n) => round(endsDown(180, n), 3));
  assert.deepEqual(predictions, [1, 0.5, 0.375, 0.235, 0.133, 0.072, 0.037]);
});

test("the same seed gives the same numbers, all in [0, 1)", () => {
  const a = seeded(7);
  const b = seeded(7);
  const xs = Array.from({ length: 1000 }, a);
  assert.deepEqual(xs, Array.from({ length: 1000 }, b));
  assert.ok(xs.every((x) => x >= 0 && x < 1));
  assert.notDeepEqual(xs.slice(0, 5), Array.from({ length: 5 }, seeded(8)));
});

test("a second check at once always repeats the first (lesson 4)", () => {
  const random = seeded(1);
  const pairs = Array.from({ length: 2000 }, () => checkTwice(120, random));
  for (const [first, second] of pairs) assert.equal(second, first);
  // The first check still has its chance: up a quarter of the time at 120°.
  const ups = pairs.filter(([first]) => first === "up").length;
  assert.ok(Math.abs(ups / 2000 - 0.25) < 0.03);
});

test("many checks of one angle settle near its chance (lesson 3's tally)", () => {
  const random = seeded(2);
  const ups = Array.from({ length: 20000 }, () => check(60, random)).filter((a) => a === "up").length;
  assert.ok(Math.abs(ups / 20000 - 0.75) < 0.015);
});

test("many random runs reproduce both formulas", () => {
  const random = seeded(3);
  const runs = Array.from({ length: 20000 }, () => run(180, 10, random));
  const survived = runs.filter((answers) => answers.every((a) => a === "up")).length / runs.length;
  const endedDown = runs.filter((answers) => answers.at(-1) === "down").length / runs.length;
  assert.ok(Math.abs(survived - survival(180, 10)) < 0.015);
  assert.ok(Math.abs(endedDown - endsDown(180, 10)) < 0.015);
});

test("a run without checks, or with one at the end of a half turn, always ends down", () => {
  assert.deepEqual(run(180, 0, seeded(4)), []);
  assert.deepEqual(run(180, 1, seeded(4)), ["down"]);
});

test("the arrow turns freely between checks and starts again from each answer", () => {
  const answers = ["up", "down", "up", "up"] as const;
  assert.deepEqual([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1].map((t) => arrowAt(180, answers, t)), [
    0, 22.5, 0, 22.5, 180, 202.5, 0, 0,
  ]);
  assert.equal(arrowAt(90, [], 0.5), 45);
  assert.equal(arrowAt(180, ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up"], 0.3), 0);
});
