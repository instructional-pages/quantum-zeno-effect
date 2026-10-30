// The Bloch sphere's geometry, in the sphere's own coordinates: radius 1, centre at the
// origin, "up" at +y. The circle in use lies in the xy plane, nearly facing the camera,
// and an arrow at `angle` degrees from the top turns towards +x (clockwise on screen).
// Everything here is pure, so the WebGL view only uploads what it returns.

export type Vec3 = [number, number, number];
// Row-major 4 × 4.
export type Mat4 = number[];

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export const UP: Vec3 = [0, 1, 0];
export const RIGHT: Vec3 = [1, 0, 0];
const TOWARDS: Vec3 = [0, 0, 1];

// The point at `angle` degrees round the circle of radius `r` about `centre`, measured
// from `u` towards `v`.
const around = (centre: Vec3, u: Vec3, v: Vec3, r: number, angle: number): Vec3 =>
  add(centre, add(scale(u, r * Math.cos(rad(angle))), scale(v, r * Math.sin(rad(angle)))));

// Where the arrow at `angle` points: its tip on the circle in use.
export const arrowTip = (angle: number): Vec3 => around([0, 0, 0], UP, RIGHT, 1, angle);

// An arc as line segments, from `from` to `to` degrees, about two degrees a piece.
export function arc(centre: Vec3, u: Vec3, v: Vec3, r: number, from = 0, to = 360): [Vec3, Vec3][] {
  const pieces = Math.max(1, Math.ceil(Math.abs(to - from) / 2));
  const points = Array.from({ length: pieces + 1 }, (_, k) => around(centre, u, v, r, from + ((to - from) * k) / pieces));
  return points.slice(1).map((p, k) => [points[k]!, p]);
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array<number>(16).fill(0);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) out[r * 4 + c]! += a[r * 4 + k]! * b[k * 4 + c]!;
  return out;
}

export const apply = (m: Mat4, v: number[]): number[] =>
  [0, 1, 2, 3].map((r) => m[r * 4]! * v[0]! + m[r * 4 + 1]! * v[1]! + m[r * 4 + 2]! * v[2]! + m[r * 4 + 3]! * v[3]!);

// The fixed view: the sphere turned a little about its vertical axis, so the circle in
// use is seen slightly from the side, then tipped towards the camera, so it is seen
// slightly from above. Both small enough that the circle reads as nearly round.
const SWING = rad(-22);
const TILT = rad(16);
const turnY = (a: number): Mat4 => [Math.cos(a), 0, Math.sin(a), 0, 0, 1, 0, 0, -Math.sin(a), 0, Math.cos(a), 0, 0, 0, 0, 1];
const turnX = (a: number): Mat4 => [1, 0, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, 0, Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1];
const TURN = multiply(turnX(TILT), turnY(SWING));

// The turn's rows: the screen's right, up and towards the camera, in sphere coordinates.
const row = (r: number): Vec3 => [TURN[r * 4]!, TURN[r * 4 + 1]!, TURN[r * 4 + 2]!];
export const SCREEN_RIGHT = row(0);
export const SCREEN_UP = row(1);
export const TO_CAMERA = row(2);

// How far the camera stands from the centre, in sphere radii.
export const DISTANCE = 6;

// From sphere coordinates to clip space, for a canvas `aspect` wide per unit tall.
export function camera(aspect: number): Mat4 {
  const fov = rad(30);
  const near = 1;
  const far = 3 * DISTANCE;
  const f = 1 / Math.tan(fov / 2);
  // Keep the whole sphere in view on tall, narrow canvases too.
  const fx = Math.min(f / aspect, f);
  const fy = fx * aspect;
  const projection = [fx, 0, 0, 0, 0, fy, 0, 0, 0, 0, (near + far) / (near - far), (2 * near * far) / (near - far), 0, 0, -1, 0];
  const view = [...TURN];
  view[11] = -DISTANCE;
  return multiply(projection, view);
}

// Where `camera` puts `p` on a width × height canvas, from its top left.
export function toScreen(m: Mat4, p: Vec3, width: number, height: number): [number, number] {
  const [x, y, , w] = apply(m, [...p, 1]) as [number, number, number, number];
  return [((1 + x / w) / 2) * width, ((1 - y / w) / 2) * height];
}

// The sphere's outline as the camera sees it: the circle where its sight lines just
// touch the sphere, a little nearer the camera than the centre and a little smaller.
export const outline = (): [Vec3, Vec3][] =>
  arc(scale(TO_CAMERA, 1 / DISTANCE), SCREEN_UP, SCREEN_RIGHT, Math.sqrt(1 - 1 / DISTANCE ** 2));

// The faint lines that give the sphere its shape: the equator, a circle above and below
// it, and the circle through the top and bottom at right angles to the one in use.
export const shape = (): [Vec3, Vec3][] => [
  ...arc([0, 0, 0], RIGHT, TOWARDS, 1),
  ...[-0.5, 0.5].flatMap((y) => arc([0, y, 0], RIGHT, TOWARDS, Math.sqrt(1 - y * y))),
  ...arc([0, 0, 0], UP, TOWARDS, 1),
];

// The circle in use, through the top and bottom.
export const track = (): [Vec3, Vec3][] => arc([0, 0, 0], UP, RIGHT, 1);

// The arrow at `angle` as flat triangles in the plane of its circle: a shaft `width`
// wide and a head at the tip.
export function arrow(angle: number, width = 0.035, head = 0.16): Vec3[] {
  const along = arrowTip(angle);
  const side: Vec3 = [along[1], -along[0], 0];
  const neck = scale(along, 1 - head);
  const corner = (base: Vec3, w: number, sign: number) => add(base, scale(side, (sign * w) / 2));
  const [a, b, c, d] = [corner([0, 0, 0], width, -1), corner([0, 0, 0], width, 1), corner(neck, width, 1), corner(neck, width, -1)];
  return [a, b, c, a, c, d, corner(neck, 2.6 * width, -1), corner(neck, 2.6 * width, 1), along];
}

// Lines behind the sphere's centre are drawn dimmer, down to `back` of their brightness
// at the far side, so the shape reads as round without hiding anything.
export const depthFade = (p: Vec3, back = 0.3): number => back + ((1 - back) * (1 + dot(p, TO_CAMERA))) / 2;
