import assert from "node:assert/strict";
import { test } from "node:test";
import { chanceSum, emptyTally, fraction, record, runs, twoPlaces } from "./chance.ts";
import { check, height, seeded } from "./zeno.ts";

test("a tally counts each answer and gives its share of the runs", () => {
  const tally = record(emptyTally(), ["up", "up", "down", "up"]);
  assert.deepEqual(tally, { up: 3, down: 1 });
  assert.equal(runs(tally), 4);
  assert.equal(fraction(tally, "up"), 0.75);
  assert.equal(fraction(tally, "down"), 0.25);
  assert.equal(fraction(emptyTally(), "up"), null);
});

test("recording adds to a tally without changing the old one", () => {
  const before = record(emptyTally(), ["up"]);
  const after = record(before, ["down"]);
  assert.deepEqual(before, { up: 1, down: 0 });
  assert.deepEqual(after, { up: 1, down: 1 });
});

test("over many runs at 60° the share of up settles near ¾", () => {
  const random = seeded(3);
  const answers = Array.from({ length: 10000 }, () => check(60, random));
  assert.ok(Math.abs(fraction(record(emptyTally(), answers), "up")! - 0.75) < 0.02);
});

test("numbers are written to two places, with a minus sign and no −0.00", () => {
  assert.equal(twoPlaces(0.5), "0.50");
  assert.equal(twoPlaces(height(60)), "0.50");
  assert.equal(twoPlaces(height(135)), "−0.71");
  assert.equal(twoPlaces(height(270)), "0.00");
  assert.equal(twoPlaces(-0.001), "0.00");
  assert.equal(twoPlaces(1), "1.00");
});

test("the chance of up is worked out with a plain minus below the middle", () => {
  assert.equal(chanceSum(0.5), "(1 + 0.50) / 2");
  assert.equal(chanceSum(-Math.SQRT1_2), "(1 − 0.71) / 2");
  assert.equal(chanceSum(-1e-17), "(1 + 0.00) / 2");
});
