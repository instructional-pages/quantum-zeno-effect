# Changelog

All notable changes are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.5.0] - 2026-10-30

### Added

- Lesson 6, "Amplitudes": squaring from scratch; the amplitude of each answer, whose
  square is its chance; the chance of up as cos²(angle / 2), shown to agree with lesson
  3's (1 + cos angle) / 2; why the angle is halved (up and down are 180° apart on the
  sphere but 90° apart as amplitudes), with the amplitude of down and the two chances
  adding up to 1; a check on the chance for an amplitude of 0.8; and a sandbox with the
  angle, both drawings and both formulas.
- The Amplitude circle view: a flat circle with up at the top and down to the right, its
  arrow turned half the sphere's angle, and dashed lines marking the amplitudes of up and
  down.

## [0.4.0] - 2026-10-30

### Added

- Lesson 5, "Turning": left alone, the arrow turns steadily from the top, with speed and
  time sliders (nothing moves by itself) and its angle as speed × time; the Plot view,
  first following the chance of up as a dot, then drawing the whole wave between 1 and 0;
  one half turn (180° / speed) marked on it; the spinning top analogy and where it breaks;
  a check on the chance of up after 4 seconds at 45° per second; and a sandbox with speed,
  time and the plot.

## [0.3.0] - 2026-10-30

### Added

- Lesson 4, "Checking": a Check button that answers up or down with the chances of
  lesson 3 and leaves the arrow pointing at its answer; checking again repeats it, and the
  tally counts the checks in a row; the spinning coin analogy and where it breaks; a side
  note on decoherence; a check on the chance of up right after a check; and a sandbox where
  each run checks a fresh arrow twice and counts how often the second check agrees.

### Changed

- Rows of buttons wrap rather than squeeze their labels onto two lines.

## [0.2.0] - 2026-10-30

### Added

- Lesson 3, "Chances": a chance as the share of many tries; the arrow's height, read off
  a dashed line across to the vertical axis; chance of up = (1 + height) / 2; the cosine
  as the name for that height; a check on the chance of up at 60°; and a sandbox with the
  angle, Run once and Run 100.
- The Tally view: two bars counting the up and down answers of many runs, with their
  shares and the chance marked as a dashed line across each.
- The Math view: the lesson's formula with the live numbers written in.

### Changed

- A typed prediction may be a fraction, such as 3/4.

## [0.1.0] - 2026-10-30

### Added

- The contents page, listing the ten lessons; the ones not built yet are greyed out.
- The lesson shell: short text steps beside live views, advanced with Back and Next, and
  predict-then-reveal checks (type a number or pick an answer, including picked
  drawings) that must be revealed before moving on. Everything works from the keyboard,
  and nothing is saved.
- The Bloch sphere: a quiet wireframe sphere seen from a fixed, slightly raised angle,
  with the circle through the top and bottom drawn bright and the state as an arrow on
  it.
- Lesson 2, "A state is an arrow": two answers, up and down; angles from scratch; the
  state as one angle (0° up, 180° down); why a sphere; a check on where 135° points; and
  a sandbox with the angle slider and its readout.
