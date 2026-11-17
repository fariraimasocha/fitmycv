import { bulletsOf } from "./ats/rules.js";

// Pairs tailored bullets with the original they were rewritten from, so the
// result screen can show real before and after lines. No model call: the
// tailor keeps work roles in order, so bullets are matched within each role
// by word overlap.
// ponytail: greedy matching by Jaccard similarity. Good enough for "show 3
// examples"; a real alignment (Hungarian) only if pairs come out wrong.

const MIN_SIMILARITY = 0.25; // below this the bullet is new, not a rewrite

const words = (s) => new Set(String(s).toLowerCase().match(/[\p{L}\p{N}+#]{3,}/gu) || []);
const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function similarity(a, b) {
  const x = words(a);
  const y = words(b);
  if (!x.size || !y.size) return 0;
  let shared = 0;
  for (const w of x) if (y.has(w)) shared++;
  return shared / (x.size + y.size - shared);
}

export function hasTerm(text, term) {
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escape(term.toLowerCase())}($|[^\\p{L}\\p{N}])`, "u").test(
    String(text).toLowerCase(),
  );
}

/** Up to `limit` { role, before, after, added } pairs, the most telling first. */
export function changedBullets(before, after, keywords = [], limit = 3) {
  const pairs = [];
  (after?.work || []).forEach((job, i) => {
    const old = bulletsOf(before?.work?.[i]?.description);
    const used = new Set();
    for (const line of bulletsOf(job.description)) {
      let best = -1;
      let bestSim = 0;
      old.forEach((o, j) => {
        const sim = used.has(j) ? 0 : similarity(o, line);
        if (sim > bestSim) [best, bestSim] = [j, sim];
      });
      if (best < 0 || bestSim < MIN_SIMILARITY) continue;
      used.add(best);
      if (norm(old[best]) === norm(line)) continue; // untouched
      const added = keywords.filter((k) => hasTerm(line, k) && !hasTerm(old[best], k));
      pairs.push({ role: job.position || job.company || "", before: old[best], after: line, added, rank: added.length * 2 + (1 - bestSim) });
    }
  });
  return pairs
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ rank: _rank, ...pair }) => pair);
}
