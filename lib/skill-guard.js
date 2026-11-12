// Drops skills the tailoring model added that the user's own CV never claimed.
// The prompt already forbids this, but the tailoring study found 58% of tailored
// CVs naming a posting skill (Excel, TypeScript, CI/CD...) the original lacked.
//
// A skill stays when:
//   1. the phrase itself appears in the reference CV, or
//   2. it is a skill the alias table knows (lib/resume-job-match.js) and the
//      reference CV already has that same skill, or
//   3. it is two words or more, and every word in it matches a word in the
//      reference CV ("Stakeholder management" from "managed stakeholders").
//      One-word known skills never take this looser path, or "Excel" would
//      pass on "excellent".
// ponytail: skills section only. A bullet can still name a new tool; extend
// this to bullets if the study keeps finding them there.
import { extractSkills } from "./resume-job-match.js";
import { cvToText } from "./ats/rules.js";
import { isContent, stem, tokenize } from "./keywords.js";

const norm = (s) => ` ${String(s).toLowerCase().replace(/[^\p{L}\p{N}+#.]+/gu, " ").trim()} `;

// Soft skills pass: they are labels for how someone works, which the bullets
// already show, not a tool a recruiter can test. Replaying the guard on 375 real
// CVs, dropping these removed a third of every skills section for little gain.
const SOFT = new Set(
  [
    "communication", "communication skills", "collaboration", "team collaboration", "teamwork", "independent work", "team player", "leadership",
    "problem solving", "problem-solving", "attention to detail", "adaptability", "analytical thinking",
    "critical thinking", "time management", "organisation", "organization", "interpersonal skills",
    "mentoring", "coaching", "negotiation", "customer service", "work ethic", "creativity",
  ].map((s) => norm(s))
);

// Short words must match exactly. Longer ones match on a 5 letter stem prefix,
// so "management" meets "managed".
function wordMatches(word, refStems) {
  const w = stem(word);
  if (w.length <= 5) return refStems.has(w);
  const prefix = w.slice(0, 5);
  for (const r of refStems) if (r.length >= 5 && r.startsWith(prefix)) return true;
  return false;
}

export function claimedSkillChecker(referenceCV) {
  const refText = cvToText(referenceCV);
  const refNorm = norm(refText);
  const refCanon = new Set(extractSkills(refText));
  const refStems = new Set(tokenize(refText).map(stem));

  return (skill) => {
    if (!String(skill ?? "").trim()) return false;
    if (SOFT.has(norm(skill)) || refNorm.includes(norm(skill))) return true;
    const canon = extractSkills(skill);
    if (canon.length && canon.every((c) => refCanon.has(c))) return true;
    const words = tokenize(skill).filter(isContent);
    // A one-word known skill (Excel, TypeScript) is a tool name: the CV has it
    // or it does not. Longer phrases can be honest rewordings of a bullet.
    if (canon.length && words.length < 2) return false;
    return words.length > 0 && words.every((w) => wordMatches(w, refStems));
  };
}

/** Returns { skills, dropped }: the skills section with unclaimed skills removed. */
export function keepClaimedSkills(skills, referenceCV) {
  const claimed = claimedSkillChecker(referenceCV);
  const dropped = [];
  const kept = (skills || [])
    .map((group) => {
      const list = (group.skills || []).filter((s) => claimed(s) || (dropped.push(s), false));
      return { ...group, skills: list };
    })
    .filter((group) => group.skills.length);
  return { skills: kept, dropped };
}
