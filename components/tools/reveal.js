// Plain helpers for the three stages a free tool result goes through:
// anticipation (what is being read), reveal (one item at a time) and
// celebration (a strong score, or the option the user copied, glows once).
// Kept out of tool-run.jsx so that file only exports components and hooks.

export const STRONG_SCORE = 75;

/** Words in a text box, for the anticipation line. */
export function wordCount(text) {
  return (text.trim().match(/\S+/g) || []).length;
}

/** The anticipation line for every tool that reads a CV and a posting. */
export function cvJobDetail(cvText, jobText) {
  return `Comparing ${wordCount(cvText)} words of your CV with ${wordCount(jobText)} words of the posting.`;
}

/**
 * Delay for the nth result item. Pair it with the `tool-reveal` class so items
 * land one after another instead of all at once. Use a longer `step` (150) for
 * the few main cards a generator returns, so each one gets its own beat.
 * ponytail: capped at 8 steps, so a 30 item list still settles in about 0.9s.
 */
export function revealDelay(i, step = 60) {
  return { animationDelay: `${Math.min(i, 8) * step}ms` };
}

/**
 * Classes for a generated option card. The one the user copied is marked as
 * picked and glows once: the afterglow is their choice, not ours.
 */
export function pickedCard(picked) {
  return picked
    ? "peak-glow border-[var(--landing-success)] bg-[var(--landing-success-soft)]"
    : "border-[var(--landing-line)] bg-[var(--landing-paper)]";
}
