// Predict-then-reveal checks: the learner types a number for each prompt, or picks one of
// its choices, and can reveal the answers only once every prompt has one.

// A prompt answered with a typed number, or by picking one of `choices`. A typed number
// may be allowed to miss the answer by up to `within`, for an "about" answer. A choice may
// be shown as a picture (SVG markup, one per choice), its name then read out instead.
export type Prompt =
  | { label: string; answer: number; within?: number }
  | { label: string; choices: string[]; answer: string; pictures?: string[] };

// A typed prediction as a number, or null when it isn't one ("", "abc"). A fraction such
// as "3/4" counts as its value, since chances are often worked out as fractions.
export function parseAnswer(text: string): number | null {
  const parts = text.split("/").map((part) => part.trim());
  if (parts.length > 2 || parts.includes("")) return null;
  const [top, bottom = 1] = parts.map(Number) as [number, number?];
  const x = top / bottom;
  return Number.isFinite(x) ? x : null;
}

// `value` is the typed text, or the picked choice ("" before one is picked).
const answered = (prompt: Prompt, value: string): boolean =>
  "choices" in prompt ? prompt.choices.includes(value) : parseAnswer(value) !== null;

export const canReveal = (prompts: Prompt[], values: string[]): boolean => prompts.every((p, k) => answered(p, values[k] ?? ""));

export function isRight(prompt: Prompt, value: string): boolean {
  if ("choices" in prompt) return value === prompt.answer;
  const x = parseAnswer(value);
  // The small allowance keeps 0.0076 + 0.001 from falling just short in floating point.
  return x !== null && Math.abs(x - prompt.answer) <= (prompt.within ?? 0) + 1e-12;
}
