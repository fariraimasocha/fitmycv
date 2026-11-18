// Pure helpers for lib/matches.js, kept import-free so they run under plain node.

// Words that say how senior a role is, not what it is. Matching on them would
// pull every "Senior" title in the pool.
const NOISE = new Set([
  "senior", "junior", "lead", "principal", "staff", "head", "chief", "intern",
  "associate", "assistant", "sr", "jr", "ii", "iii", "the", "and", "for", "of",
]);

export function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function titleTerms(queries) {
  const terms = new Set();
  for (const q of queries) {
    for (const word of String(q).toLowerCase().split(/[^a-z0-9+#]+/)) {
      if (word.length >= 3 && !NOISE.has(word)) terms.add(word);
    }
  }
  return [...terms].slice(0, 8);
}

// Monday 00:00 UTC of the current week.
export function startOfWeek(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}


// Self-check: copy to a .mjs file and run it with node
if (process.argv[1]?.endsWith("match-terms.mjs")) {
  const assert = (c, m) => {
    if (!c) {
      console.error("FAIL:", m);
      process.exit(1);
    }
  };
  assert(titleTerms(["Senior Backend Engineer"]).join() === "backend,engineer", "drops seniority words");
  assert(titleTerms(["C++ Developer"]).includes("c++"), "keeps c++");
  assert(titleTerms(["QA"]).length === 0, "drops short words");
  const wed = new Date(Date.UTC(2026, 10, 18, 15));
  assert(startOfWeek(wed).toISOString() === "2026-11-16T00:00:00.000Z", "Wednesday maps to Monday");
  const sun = new Date(Date.UTC(2026, 10, 22, 23));
  assert(startOfWeek(sun).toISOString() === "2026-11-16T00:00:00.000Z", "Sunday stays in the same week");
  const mon = new Date(Date.UTC(2026, 10, 16, 0));
  assert(startOfWeek(mon).toISOString() === "2026-11-16T00:00:00.000Z", "Monday is its own start");
  console.log("match-terms self-check OK");
}
