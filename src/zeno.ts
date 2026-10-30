// The physics of the course: a state is an arrow on one circle of the sphere, written as
// its angle from the top in degrees (0° up, 180° down). Turning adds to the angle; a check
// answers "up" or "down" at random and leaves the arrow pointing at its answer.

export type Answer = "up" | "down";

const cosDeg = (degrees: number): number => Math.cos((degrees * Math.PI) / 180);

// The arrow's height: +1 at the top, −1 at the bottom (lesson 3).
export const height = (angle: number): number => cosDeg(angle);

// The chance a check says "up", read from the height (lesson 3). Written this way rather
// than as cos²(angle / 2) so it is exactly 1 at 0°, ½ at 90° and 0 at 180°.
export const chanceUp = (angle: number): number => (1 + height(angle)) / 2;

export const chanceDown = (angle: number): number => 1 - chanceUp(angle);

// The amplitude of "up": the cosine of half the angle; its square is chanceUp (lesson 6).
export const amplitudeUp = (angle: number): number => cosDeg(angle / 2);

// The chance that every one of `checks` equally spaced checks says "up" while the arrow
// turns `turn` degrees in all: each piece turns turn / checks and survives with
// chanceUp(turn / checks), and all of them must (lesson 8).
export const survival = (turn: number, checks: number): number => chanceUp(turn / checks) ** checks;

// The chance of finding "down" at the last check when a "down" doesn't end the run, as
// Itano et al. counted it (lesson 9). Each piece shrinks the arrow's average height by
// cos(turn / checks), from 1 at the start: ½ × (1 − cos^N(turn / N)).
export const endsDown = (turn: number, checks: number): number => (1 - height(turn / checks) ** checks) / 2;

// A repeatable source of random numbers in [0, 1) (mulberry32), so a test or a replayed
// run gets the same answers from the same seed.
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
}

// One check of an arrow at `angle` (lesson 4).
export const check = (angle: number, random: () => number): Answer => (random() < chanceUp(angle) ? "up" : "down");

// Where a check leaves the arrow: pointing at its answer.
export const reset = (answer: Answer | undefined): number => (answer === "down" ? 180 : 0);

// An arrow at `angle` checked twice in a row: the second check finds the arrow where the
// first left it (lesson 4).
export function checkTwice(angle: number, random: () => number): [Answer, Answer] {
  const first = check(angle, random);
  return [first, check(reset(first), random)];
}

// One random run from the top: the arrow turns `turn` degrees in all, checked `checks`
// times at equal spacing, the last at the end. A "down" sends it to the bottom, and it
// keeps turning from there (lesson 8). The run survives if every answer is "up".
export function run(turn: number, checks: number, random: () => number): Answer[] {
  const answers: Answer[] = [];
  for (let k = 0; k < checks; k++) answers.push(check(reset(answers[k - 1]) + turn / checks, random));
  return answers;
}

// The arrow's angle a fraction `t` (0 to 1) of the way through a run with these answers:
// it has turned from where the last check left it. At a check's moment, it has happened.
export function arrowAt(turn: number, answers: readonly Answer[], t: number): number {
  const n = answers.length;
  // The small allowance keeps t = k / n from landing just before check k in floating point.
  const done = Math.min(Math.floor(t * n + 1e-9), n);
  const lastCheck = n ? done / n : 0;
  return reset(answers[done - 1]) + turn * (t - lastCheck);
}

// Left alone, the arrow turns steadily from the top: after `time` seconds at `speed`
// degrees per second it has turned speed × time (lesson 5).
export const turned = (speed: number, time: number): number => speed * time;

// The time one half turn takes, from up to down: 180° at `speed` degrees per second
// (lesson 5).
export const halfTurn = (speed: number): number => 180 / speed;
