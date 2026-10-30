// The course as one page: the URL hash picks the contents or a lesson (#2), and each
// change rebuilds the page from scratch. Nothing is saved.

import { mountLesson, type Lesson } from "./lesson.ts";
import { lesson2 } from "./lesson2.ts";
import { lesson3 } from "./lesson3.ts";
import { nextHash, parseRoute } from "./route.ts";

const TITLES = [
  "Watching stops it",
  "A state is an arrow",
  "Chances",
  "Checking",
  "Turning",
  "Amplitudes",
  "Small turns barely count",
  "Checking often",
  "A real experiment",
  "The sandbox",
];
// The lessons built so far, by number.
const LESSONS = new Map<number, Lesson>([
  [2, lesson2],
  [3, lesson3],
]);
const BUILT = new Set(LESSONS.keys());
const COURSE = "The Quantum Zeno Effect";

const root = document.querySelector("main")!;
let stop = () => {};

function mountContents(root: HTMLElement) {
  root.innerHTML = `
    <div class="contents">
      <h1>${COURSE}</h1>
      <p class="note">Why checking a quantum state often enough stops it from changing,
        built up from school arithmetic. Each lesson adds one idea and ends in a sandbox.</p>
      <ol>${TITLES.map((title, i) => (BUILT.has(i + 1) ? `<li><a href="#${i + 1}">${title}</a></li>` : `<li class="later">${title}</li>`)).join("")}</ol>
    </div>`;
  return () => {};
}

function render() {
  stop();
  // Free the old page's WebGL contexts now rather than whenever they're collected.
  for (const canvas of root.querySelectorAll("canvas")) canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
  root.replaceChildren();
  root.className = "";
  const route = parseRoute(location.hash, BUILT);
  if (route.page === "lesson") {
    const lesson = LESSONS.get(route.n)!;
    document.title = `${lesson.title} · ${COURSE}`;
    stop = mountLesson(root, route.n, lesson, nextHash(route.n, BUILT));
  } else {
    document.title = COURSE;
    root.className = "page";
    stop = mountContents(root);
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
