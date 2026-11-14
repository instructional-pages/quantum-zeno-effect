// The Table view (lesson 7): a plain table with a header row, its cells filled in by the
// lesson as the learner reaches each row, and a note under it.

export interface TableView {
  // One array of cell texts per row; "" leaves a cell blank.
  draw(rows: string[][], note: string): void;
}

export function createTableView(figure: HTMLElement, headers: string[]): TableView {
  const box = figure.appendChild(Object.assign(document.createElement("div"), { className: "table" }));
  const table = box.appendChild(document.createElement("table"));
  const head = table.createTHead().insertRow();
  for (const text of headers) head.appendChild(Object.assign(document.createElement("th"), { textContent: text, scope: "col" }));
  const body = table.createTBody();
  const note = box.appendChild(Object.assign(document.createElement("p"), { className: "note", ariaLive: "polite" }));

  return {
    draw(rows, text) {
      body.replaceChildren();
      for (const cells of rows) {
        const row = body.insertRow();
        for (const cell of cells) row.insertCell().textContent = cell;
      }
      note.textContent = text;
    },
  };
}
