import assert from "node:assert/strict";
import { test } from "node:test";
import { nextHash, parseRoute } from "./route.ts";

const built = new Set([2, 3, 5]);

test("a number names a built lesson", () => {
  assert.deepEqual(parseRoute("#2", built), { page: "lesson", n: 2 });
  assert.deepEqual(parseRoute("#5", built), { page: "lesson", n: 5 });
});

test("anything else, an unbuilt lesson included, is the contents", () => {
  for (const hash of ["", "#", "#1", "#4", "#0", "#02", "#-2", "#2.5", "#abc"])
    assert.deepEqual(parseRoute(hash, built), { page: "contents" }, hash);
});

test("a lesson's last Next skips unbuilt lessons, and the last leads to the contents", () => {
  assert.equal(nextHash(2, built), "#3");
  assert.equal(nextHash(3, built), "#5");
  assert.equal(nextHash(5, built), "");
});
