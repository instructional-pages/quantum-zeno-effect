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

// "0.50", "−0.71"; a value that rounds to zero is "0.00", never "−0.00".
export function twoPlaces(x: number): string {
  const text = x.toFixed(2);
  return Number(text) === 0 ? "0.00" : text.replace("-", "−");
}

// The chance of up worked out from a height `h`: "(1 + 0.50) / 2", or "(1 − 0.71) / 2"
// rather than "(1 + −0.71) / 2".
export const chanceSum = (h: number): string => `(1 ${twoPlaces(h).startsWith("−") ? "−" : "+"} ${twoPlaces(Math.abs(h))}) / 2`;
