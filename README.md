# Quantum Zeno Effect

A browser course for complete beginners on the quantum Zeno effect: why measuring a
quantum system often enough keeps it from changing. A rotating state on a 3D Bloch sphere
is interrupted by measurements you set, beside a plot of survival probability vs.
measurement rate, with the math shown next to the pictures.

Status: 1.0.0, the complete course. The lesson shell (text steps beside live views, predict-then-reveal checks) and all 10 lessons, "Watching stops it", "A state is an arrow", "Chances", "Checking", "Turning", "Amplitudes", "Small turns barely count", "Checking often", "A real experiment" (with the 1990 measurements of Itano et al.) and "The sandbox", on a WebGL2 Bloch sphere with an SVG plot, amplitude circle and table. Live at <https://instructional-pages.github.io/quantum-zeno-effect/>. Spec in [docs/BRIEF.md](docs/BRIEF.md); lesson outline in [docs/LESSONS.md](docs/LESSONS.md).

License: [MIT](LICENSE).

## Develop

```sh
npm install
npm run dev      # local server
./.local-ci      # typecheck, tests, build, 50 KB gzipped budget
```

## Deploy

GitHub Pages, from this machine (no Actions). On an up-to-date, clean `main`, run
`npm run deploy`: it builds, checks the bundle budget, and force-pushes `dist/` as a single
commit to the `gh-pages` branch, which Pages serves. `npm run deploy -- --dry-run` does
everything but the push.
