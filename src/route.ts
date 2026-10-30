// Which page a URL hash names: "#2" is lesson 2, and anything else (no hash, or a lesson
// that isn't built yet) the contents.

export type Route = { page: "contents" } | { page: "lesson"; n: number };

// `built` holds the numbers of the lessons that exist, counted from 1.
export function parseRoute(hash: string, built: ReadonlySet<number>): Route {
  const name = hash.replace(/^#/, "");
  if (/^[1-9]\d*$/.test(name) && built.has(Number(name))) return { page: "lesson", n: Number(name) };
  return { page: "contents" };
}

// Where a lesson's last Next leads: the next built lesson, or "" (the contents).
export function nextHash(n: number, built: ReadonlySet<number>): string {
  const later = [...built].filter((k) => k > n).sort((a, b) => a - b);
  return later.length ? `#${later[0]}` : "";
}
