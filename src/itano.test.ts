import assert from "node:assert/strict";
import { test } from "node:test";
import { FLASH_MS, HALF_TURN_MS, TABLE } from "./itano.ts";
import { endsDown } from "./zeno.ts";

test("the paper's simplified column is the course's formula, to its four places", () => {
  for (const { flashes, simple } of TABLE) assert.equal(Number(endsDown(180, flashes).toFixed(4)), simple);
});

test("the flashes double from 1 to 64", () => {
  assert.deepEqual(
    TABLE.map((r) => r.flashes),
    [1, 2, 4, 8, 16, 32, 64],
  );
});

test("from 4 flashes on, every measurement sits 0.03 to 0.06 below the simple formula", () => {
  for (const { flashes, simple, measured } of TABLE.filter((r) => r.flashes >= 4)) {
    const gap = simple - measured;
    assert.ok(gap >= 0.03 && gap <= 0.06, `${flashes} flashes: ${gap}`);
  }
});

test("the full calculation matches every measurement to about the stated 0.02", () => {
  for (const { full, measured } of TABLE) assert.ok(Math.abs(full - measured) <= 0.021 + 1e-12);
});

test("64 flashes of 2.4 ms fill 154 ms of the 256 ms half turn", () => {
  assert.equal(Math.round(64 * FLASH_MS), 154);
  assert.ok(64 * FLASH_MS < HALF_TURN_MS);
});
