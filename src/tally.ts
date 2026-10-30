// The Tally view (lessons 3 and 4): two bars counting the up and down answers of many
// runs, each with its count above, its share filled in, the chance as a dashed mark
// across it, and its name and share below, over a status line.

import { fraction, runs, twoPlaces, type Tally } from "./chance.ts";
import { span } from "./ui.ts";
import type { Answer } from "./zeno.ts";

const ANSWERS: Answer[] = ["up", "down"];

export interface TallyView {
  // `chanceUp` is null when the chance isn't marked.
  draw(tally: Tally, chanceUp: number | null, status: string): void;
}

export function createTallyView(figure: HTMLElement): TallyView {
  const box = figure.appendChild(Object.assign(document.createElement("div"), { className: "tally" }));
  const bars = box.appendChild(Object.assign(document.createElement("div"), { className: "bars" }));
  const parts = ANSWERS.map((answer) => {
    const bar = bars.appendChild(Object.assign(document.createElement("div"), { className: "bar" }));
    const count = bar.appendChild(span("", "count"));
    const column = bar.appendChild(Object.assign(document.createElement("div"), { className: "column" }));
    const fill = column.appendChild(Object.assign(document.createElement("div"), { className: "fill" }));
    const expect = column.appendChild(Object.assign(document.createElement("div"), { className: "expect" }));
    bar.append(span(answer, "name"));
    const share = bar.appendChild(span("", "share"));
    return { count, fill, expect, share };
  });
  const note = box.appendChild(Object.assign(span("", "note"), { ariaLive: "polite" }));

  return {
    draw(tally, chanceUp, status) {
      parts.forEach(({ count, fill, expect, share }, k) => {
        const answer = ANSWERS[k]!;
        const part = fraction(tally, answer);
        count.textContent = String(tally[answer]);
        fill.style.height = `${100 * (part ?? 0)}%`;
        expect.hidden = chanceUp === null;
        if (chanceUp !== null) expect.style.bottom = `${100 * (answer === "up" ? chanceUp : 1 - chanceUp)}%`;
        share.textContent = part === null ? "" : twoPlaces(part);
      });
      note.textContent = status || (chanceUp !== null && !runs(tally) ? "dashed: the chance" : "");
    },
  };
}
