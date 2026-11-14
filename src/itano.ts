// The real experiment of lesson 9: W. M. Itano, D. J. Heinzen, J. J. Bollinger and
// D. J. Wineland, "Quantum Zeno effect", Phys. Rev. A 41, 2295 (1990). About 5000 ⁹Be⁺ ions
// in a Penning trap; a 256 ms radio-frequency pulse turned each from level 1 to level 2 (a
// half turn), while n laser pulses of 313 nm, 2.4 ms long, checked them. Transcribed from
// the paper's Table I, 1 → 2 transition (the ions start in level 1), on 2026-11-14.

export interface Row {
  // The number of laser flashes (checks) during the half turn.
  flashes: number;
  // ½[1 − cosⁿ(π/n)]: instant checks, the paper's simplified calculation and the course's
  // `endsDown(180, n)`.
  simple: number;
  // The paper's full calculation: 2.4 ms flashes, and the laser's optical pumping.
  full: number;
  // The share of ions found in level 2 at the end, measured to about ±0.02. Negative at
  // 64 flashes: slightly more light than expected for none at all, i.e. noise around 0.
  measured: number;
}

export const TABLE: readonly Row[] = [
  { flashes: 1, simple: 1.0, full: 0.995, measured: 0.995 },
  { flashes: 2, simple: 0.5, full: 0.497, measured: 0.5 },
  { flashes: 4, simple: 0.375, full: 0.351, measured: 0.335 },
  { flashes: 8, simple: 0.2346, full: 0.201, measured: 0.194 },
  { flashes: 16, simple: 0.1334, full: 0.095, measured: 0.103 },
  { flashes: 32, simple: 0.0716, full: 0.034, measured: 0.013 },
  { flashes: 64, simple: 0.0371, full: 0.006, measured: -0.006 },
];

// The paper's stated uncertainty of each measured value.
export const ERROR = 0.02;
export const IONS = 5000;
// The half turn and the length of one flash, in milliseconds.
export const HALF_TURN_MS = 256;
export const FLASH_MS = 2.4;
