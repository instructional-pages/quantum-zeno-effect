# Quantum Zeno Effect

A browser course for complete beginners on the quantum Zeno effect: why measuring a
quantum system often enough keeps it from changing. A rotating state on a 3D Bloch sphere
is interrupted by measurements you set, beside a plot of survival probability vs.
measurement rate, with the math shown next to the pictures.

Status: 0.2.0. The lesson shell (text steps beside live views, predict-then-reveal checks) and lessons 2 and 3 of 10, "A state is an arrow" and "Chances", on a WebGL2 Bloch sphere; the physics module (`src/zeno.ts`) is ready for the rest. Not published yet. Spec in [docs/BRIEF.md](docs/BRIEF.md); lesson outline in [docs/LESSONS.md](docs/LESSONS.md).

License: [MIT](LICENSE).

## Develop

```sh
npm install
npm run dev      # local server
./.local-ci      # typecheck, tests, build, 50 KB gzipped budget
```
