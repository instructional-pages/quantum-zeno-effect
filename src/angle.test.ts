import assert from "node:assert/strict";
import { test } from "node:test";
import { degrees, pastTurns, turnShare } from "./angle.ts";

test("degrees are whole, with the degree sign", () => {
  assert.equal(degrees(135), "135°");
  assert.equal(degrees(89.6), "90°");
});

test("the turns lesson 2 teaches have names", () => {
  assert.deepEqual([0, 90, 180, 270, 360].map(turnShare), [
    "no turn",
    "a quarter turn",
    "half a turn",
    "three quarters of a turn",
    "a full turn",
  ]);
});

test("other simple shares are written as fractions, and the rest left out", () => {
  assert.equal(turnShare(135), "3/8 of a turn");
  assert.equal(turnShare(45), "1/8 of a turn");
  assert.equal(turnShare(120), "1/3 of a turn");
  assert.equal(turnShare(40), "");
  assert.equal(turnShare(137), "");
});

test("angles past a full turn are told as turns and the rest", () => {
  assert.deepEqual([90, 359.6, 360, 450, 720, 1000].map(pastTurns), [
    "",
    "a full turn",
    "a full turn",
    "a full turn and 90° more",
    "2 full turns",
    "2 full turns and 280° more",
  ]);
});
