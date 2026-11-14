// Chances as lesson 3 counts and writes them: a tally of the answers from many runs, and
// numbers to two places with a real minus sign.

import type { Answer } from "./zeno.ts";

export type Tally = Record<Answer, number>;

export const emptyTally = (): Tally => ({ up: 0, down: 0 });

export const record = (tally: Tally, answers: readonly Answer[]): Tally =>
  answers.reduce((t, answer) => ({ ...t, [answer]: t[answer] + 1 }), tally);

export const runs = (tally: Tally): number => tally.up + tally.down;

// The share of the runs that gave `answer`, or null before any run.
export const fraction = (tally: Tally, answer: Answer): number | null => (runs(tally) ? tally[answer] / runs(tally) : null);

// "0.50", "−0.71" (or "0.866" to three places); a value that rounds to zero is "0.00",
// never "−0.00".
export function toPlaces(x: number, places: number): string {
  const text = x.toFixed(places);
  return Number(text) === 0 ? (0).toFixed(places) : text.replace("-", "−");
}

export const twoPlaces = (x: number): string => toPlaces(x, 2);

// An amplitude squared into its chance (lesson 6): "0.866² = 0.75". The amplitude keeps
// three places, so squaring what is written gives the chance to two.
export const squared = (a: number): string => `${toPlaces(a, 3)}² = ${twoPlaces(a * a)}`;

// The chance of up worked out from a height `h`: "(1 + 0.50) / 2", or "(1 − 0.71) / 2"
// rather than "(1 + −0.71) / 2".
export const chanceSum = (h: number): string => `(1 ${twoPlaces(h).startsWith("−") ? "−" : "+"} ${twoPlaces(Math.abs(h))}) / 2`;

// A small chance as lesson 7 writes it: to three places, or four below 0.01, so that 0.0076
// keeps two figures rather than rounding to 0.008.
export const smallChance = (x: number): string => toPlaces(x, x < 0.01 ? 4 : 3);

// An amplitude squared into a small chance (lesson 7): "0.174² = 0.030".
export const squaredSmall = (a: number): string => `${toPlaces(a, 3)}² = ${smallChance(a * a)}`;

// A chance per check to three places, or five once it rounds to 1.000, so that 0.99975
// (a 1.8° piece) doesn't read as certain.
export const perCheck = (x: number): string => toPlaces(x, toPlaces(x, 3) === "1.000" && x < 1 ? 5 : 3);

// One check's chance of up multiplied over `n` checks (lesson 8): written out up to three
// times ("0.500 × 0.500 = 0.25"), and in words beyond ("0.976 multiplied 10 times = 0.78").
export function repeated(x: number, n: number): string {
  const each = perCheck(x);
  const product = n <= 3 ? Array.from({ length: n }, () => each).join(" × ") : `${each} multiplied ${n} times`;
  return `${product} = ${twoPlaces(x ** n)}`;
}
