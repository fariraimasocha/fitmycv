// Checks a LinkedIn profile against a job posting, section by section.
//
// ponytail: STOP_WORDS, tokenize, stem and extractTerms are copied from the
// pure region of components/tools/HeadlineGenerator.jsx. That file is sliced
// by scripts/check-tools.mjs, so it cannot import from here without changing
// the check. Move the other copies here when one of them next changes.

import { companyWords } from "./keywords.js";

const STOP_WORDS = new Set(
  `a about above after again against all also am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves

   ability able across additional advantage apply applicant applicants bonus build built candidate candidates career company culture description desirable duties employment ensure ensuring environment essential etc excellent experience familiar familiarity fast focus following friendly get getting good great growing help including involved job join key like looking love make making must need needs new nice offer opportunity part passionate people plus position preferred proven provide ran range required requirement requirements responsibilities responsibility role roles run running skill skills strong take team teams understanding using want well work working world would years hiring hire seeking reports head senior junior write someone know every day location

   core daily day every write`
    .split(/\s+/)
    .filter(Boolean)
);

function tokenize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[-./]+|[-./]+$/g, ""))
    .filter((word) => word.length > 1);
}

function stem(word) {
  if (word.length <= 4) return word;
  for (const suffix of ["ing", "ies", "ed", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      const base = word.slice(0, -suffix.length);
      return suffix === "ies" ? `${base}y` : base;
    }
  }
  return word;
}

// A token with no letters ("4+", "2026") is never a keyword.
const isContent = (word) => word && /[a-z]/.test(word) && !STOP_WORDS.has(word);

export function extractTerms(text, limit) {
  const company = companyWords(text);
  const tokens = tokenize(text).map((token) => (company.has(token) ? "" : token));
  const unigrams = new Map();
  const bigrams = new Map();

  tokens.forEach((token, i) => {
    if (isContent(token)) unigrams.set(token, (unigrams.get(token) || 0) + 1);
    const next = tokens[i + 1];
    if (!isContent(token) || !isContent(next)) return;
    const phrase = `${token} ${next}`;
    bigrams.set(phrase, (bigrams.get(phrase) || 0) + 1);
  });

  const scored = [
    ...[...bigrams.entries()]
      .filter(([, count]) => count >= 2)
      .map(([term, count]) => ({ term, count, score: count * 1.8, words: term.split(" ") })),
    ...[...unigrams.entries()].map(([term, count]) => ({ term, count, score: count, words: [term] })),
  ].sort((a, b) => b.score - a.score);

  const kept = [];
  for (const item of scored) {
    const covered =
      item.words.length === 1 &&
      kept.some((other) => other.words.length > 1 && other.words.includes(item.term));
    if (!covered) kept.push(item);
    if (kept.length >= limit) break;
  }
  return kept;
}

const stems = (text) => new Set(tokenize(text).map(stem));
const has = (set, words) => words.every((w) => set.has(stem(w)));

export const SECTIONS = ["headline", "about", "skills"];

/**
 * For each term the posting leans on, which profile sections mention it.
 * `score` is the share of terms found anywhere on the profile.
 */
export function checkProfile(jobText, profile, limit = 15) {
  const sets = Object.fromEntries(SECTIONS.map((s) => [s, stems(profile[s])]));
  const terms = extractTerms(jobText, limit).map(({ term, words }) => {
    const found = Object.fromEntries(SECTIONS.map((s) => [s, has(sets[s], words)]));
    return { term, found, anywhere: SECTIONS.some((s) => found[s]) };
  });
  const hits = terms.filter((t) => t.anywhere).length;
  return {
    terms,
    score: terms.length ? Math.round((hits / terms.length) * 100) : 0,
    missing: terms.filter((t) => !t.anywhere).map((t) => t.term),
    // On the profile, but not in the one line recruiters see in search.
    forHeadline: terms.filter((t) => t.anywhere && !t.found.headline).slice(0, 3).map((t) => t.term),
  };
}
