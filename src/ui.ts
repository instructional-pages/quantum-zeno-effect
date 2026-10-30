// Small DOM helpers shared by the lessons: sliders, view figures, and the linked-view
// layout where one view is main and the others sit small beside it.

export const span = (text: string, className = "") => Object.assign(document.createElement("span"), { textContent: text, className });

// A labelled slider row, moving in steps of `step`; `onInput` receives each new value,
// `show` writes it out. Returns the input.
export function addSlider(
  parent: HTMLElement,
  name: string,
  min: number,
  max: number,
  value: number,
  onInput: (x: number) => void,
  show: (x: number) => string,
  step = 1,
) {
  const row = document.createElement("label");
  const input = document.createElement("input");
  const output = document.createElement("output");
  Object.assign(input, { type: "range", min: String(min), max: String(max), step: String(step), value: String(value) });
  output.textContent = show(value);
  row.append(name, input, output);
  parent.append(row);
  input.addEventListener("input", () => {
    const x = Number(input.value);
    output.textContent = show(x);
    onInput(x);
  });
  return input;
}

export interface ViewSpec {
  caption: string;
  // A WebGL canvas, labelled with what it shows for screen readers, or (no label) HTML
  // the lesson fills in itself, readable as it is.
  label?: string;
}

export function figure({ caption, label }: ViewSpec): HTMLElement {
  const fig = document.createElement("figure");
  if (label) fig.append(Object.assign(document.createElement("canvas"), { ariaLabel: label, role: "img" }));
  fig.append(Object.assign(document.createElement("figcaption"), { textContent: caption }));
  return fig;
}

// Lays out the figures in `views`: the first is main, filling the left; the others are
// buttons that swap themselves in. Only classes change, so each canvas keeps its WebGL
// context.
export function linkViews(views: HTMLElement) {
  const figures = [...views.querySelectorAll<HTMLElement>(":scope > figure")];
  views.style.gridTemplateRows = `repeat(${Math.max(1, figures.length - 1)}, 1fr)`;
  const makeMain = (main: HTMLElement) => {
    for (const figure of figures) {
      const small = figure !== main;
      figure.classList.toggle("main", !small);
      if (small) {
        figure.tabIndex = 0;
        figure.role = "button";
        figure.ariaLabel = `Make ${figure.querySelector("figcaption")!.textContent} the main view`;
      } else {
        figure.removeAttribute("tabindex");
        figure.removeAttribute("role");
        figure.removeAttribute("aria-label");
      }
    }
  };
  for (const figure of figures) {
    figure.addEventListener("click", () => makeMain(figure));
    figure.addEventListener("keydown", (e) => {
      if (figure.classList.contains("main") || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      makeMain(figure);
    });
  }
  makeMain(figures[0]!);
}
