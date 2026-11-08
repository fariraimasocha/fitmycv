// Interview questions from a job description and a CV, for
// /interview-questions-from-job-description.
//
// ponytail: templates, not a model call, the same as the summary generator.
// The posting decides what gets asked (its role title, the terms it repeats),
// and the CV decides the evidence: every "your proof" line is a line from the
// CV itself. Upgrade path for real answer writing is the signed-in tailor.
import {
  asSentence,
  findResultLines,
  generateSummaries,
  resumeLines,
  stem,
  tokenize,
} from "@/lib/summary-helpers";
import { notCompanyTerm } from "@/lib/keywords";

const MAX_SKILL_QUESTIONS = 4;
const MAX_GAP_QUESTIONS = 3;

/** The first CV line that uses every word of the term, preferring one with a number. */
export function evidenceFor(term, resumeText) {
  const words = term.split(" ").map(stem);
  const hits = resumeLines(resumeText)
    .filter((line) => line.length >= 20 && line.length <= 220)
    .filter((line) => !/@|https?:\/\/|www\./.test(line))
    .filter((line) => {
      const stems = new Set(tokenize(line).map(stem));
      return words.every((word) => stems.has(word));
    });
  const withNumber = hits.find((line) => /\d/.test(line));
  const line = withNumber ?? hits[0];
  return line ? asSentence(line) : null;
}

// A question built on "used" or "growth" reads as broken, so only terms that
// look like a skill get asked about: a repeated phrase ("A/B testing") or a
// word the posting capitalises mid-sentence ("SQL", "Tableau").
// ponytail: precision over recall; lowercase single-word skills ("triage") are
// skipped. Add a skills list if that shows up in feedback.
function looksLikeSkill(item, keep) {
  return keep(item.term) && (item.term.includes(" ") || /[A-Z]/.test(item.label));
}

/** Role title plus the posting's skills, split by whether the CV shows them. */
export function postingSkills(jobText, resumeText, currentYear) {
  const out = generateSummaries(jobText, resumeText, currentYear);
  const keep = notCompanyTerm(jobText);
  return {
    title: out.title,
    matched: out.matched.filter((item) => looksLikeSkill(item, keep)),
    missing: out.missing.filter((item) => looksLikeSkill(item, keep)),
  };
}

export function generateInterviewQuestions(jobText, resumeText, currentYear) {
  const { title, matched, missing } = postingSkills(jobText, resumeText, currentYear);
  const role = title ? `this ${title} role` : "this role";
  const result = findResultLines(resumeText, matched.map((item) => item.term))[0] ?? null;
  const questions = [];

  questions.push({
    id: "why",
    kind: "role",
    q: `Why do you want ${role}?`,
    evidence: result,
    tip: result
      ? "Name one thing from the posting that drew you in, then back it with this result."
      : "Name one thing from the posting that drew you in, then one result from your work. Your CV has no line with a number yet, so pick one before the interview.",
  });

  questions.push({
    id: "walk",
    kind: "role",
    q: "Walk me through your CV.",
    evidence: null,
    tip: matched.length
      ? `Keep it to two minutes and finish on the skills this job asks for: ${matched
          .slice(0, 3)
          .map((item) => item.label)
          .join(", ")}.`
      : "Keep it to two minutes and finish on why this job is the next step.",
  });

  for (const skill of matched.slice(0, MAX_SKILL_QUESTIONS)) {
    const evidence = evidenceFor(skill.term, resumeText);
    questions.push({
      id: `skill-${skill.term}`,
      kind: "skill",
      q: `Tell me about a time you used ${skill.label}.`,
      evidence,
      tip: evidence
        ? "Tell it as situation, task, action, result. Your CV line is the result, so build the story backwards from it."
        : "Your CV mentions this, but not in a line with any detail. Prepare one story with a clear result.",
    });
  }

  for (const gap of missing.slice(0, MAX_GAP_QUESTIONS)) {
    questions.push({
      id: `gap-${gap.term}`,
      kind: "gap",
      q: `This role asks for ${gap.label}. What experience do you have with it?`,
      evidence: null,
      tip: `Your CV never mentions ${gap.label}. If you have used it, add it to your CV before you apply. If you have not, prepare an honest answer about the closest thing you have done.`,
    });
  }

  return { title, matched, missing, questions };
}
