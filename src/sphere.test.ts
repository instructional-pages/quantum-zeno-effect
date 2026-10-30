import assert from "node:assert/strict";
import { test } from "node:test";
import { DISTANCE, TO_CAMERA, arc, arrow, arrowTip, camera, depthFade, outline, toScreen, type Vec3 } from "./sphere.ts";

const close = (a: number[], b: number[]) => a.every((x, k) => Math.abs(x - b[k]!) < 1e-9);
const length = (p: Vec3) => Math.hypot(...p);

test("the arrow points up at 0°, sideways at 90° and down at 180°", () => {
  assert.ok(close(arrowTip(0), [0, 1, 0]));
  assert.ok(close(arrowTip(90), [1, 0, 0]));
  assert.ok(close(arrowTip(180), [0, -1, 0]));
  assert.ok(close(arrowTip(360), [0, 1, 0]));
});

test("on screen the top is above the centre, the bottom below, and 90° to the right", () => {
  const m = camera(1);
  const [cx, cy] = toScreen(m, [0, 0, 0], 400, 400);
  assert.ok(close([cx, cy], [200, 200]));
  assert.ok(toScreen(m, arrowTip(0), 400, 400)[1] < cy - 100);
  assert.ok(toScreen(m, arrowTip(180), 400, 400)[1] > cy + 100);
  assert.ok(toScreen(m, arrowTip(90), 400, 400)[0] > cx + 100);
});

test("the sphere fits a wide canvas and a tall one", () => {
  for (const [w, h] of [[800, 400], [300, 600]] as const) {
    const m = camera(w / h);
    for (const [from] of outline()) {
      const [x, y] = toScreen(m, from, w, h);
      assert.ok(x > 0 && x < w && y > 0 && y < h);
    }
  }
});

test("an arc's pieces join up, all at its radius", () => {
  const pieces = arc([0, 0, 0], [0, 1, 0], [1, 0, 0], 0.5, 0, 90);
  assert.equal(pieces.length, 45);
  assert.ok(close(pieces[0]![0], [0, 0.5, 0]));
  assert.ok(close(pieces.at(-1)![1], [0.5, 0, 0]));
  for (let k = 1; k < pieces.length; k++) assert.ok(close(pieces[k]![0], pieces[k - 1]![1]));
});

test("the outline is where sight lines from the camera just touch the sphere", () => {
  const eye: Vec3 = [TO_CAMERA[0] * DISTANCE, TO_CAMERA[1] * DISTANCE, TO_CAMERA[2] * DISTANCE];
  for (const [p] of outline()) {
    assert.ok(Math.abs(length(p) - 1) < 1e-9);
    const sight: Vec3 = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
    assert.ok(Math.abs(sight[0] * p[0] + sight[1] * p[1] + sight[2] * p[2]) < 1e-9);
  }
});

test("the arrow runs from the centre to its tip, in the plane of its circle", () => {
  const triangles = arrow(135);
  assert.equal(triangles.length, 9);
  assert.ok(close(triangles.at(-1)!, arrowTip(135)));
  assert.ok(triangles.every((p) => p[2] === 0 && length(p) <= 1 + 1e-9));
});

test("the near side is drawn brightest and the far side dimmest", () => {
  assert.ok(Math.abs(depthFade(TO_CAMERA) - 1) < 1e-9);
  assert.ok(Math.abs(depthFade([-TO_CAMERA[0], -TO_CAMERA[1], -TO_CAMERA[2]]) - 0.3) < 1e-9);
});
