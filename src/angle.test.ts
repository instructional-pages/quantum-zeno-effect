import assert from "node:assert/strict";
import { test } from "node:test";
import { degrees, turnShare } from "./angle.ts";

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
