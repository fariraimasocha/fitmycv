// Registry for the data-driven marketing pages rendered by app/[slug]/page.js.
// Adding a landing page means adding a content object and one entry here: the
// route, metadata, schema, and sitemap entry all follow from it.
import {
  atsResumeChecker,
  freeAtsKeywordChecker,
  resumeOptimizer,
  resumeJobMatchChecker,
} from "./tools";
import { aiCoverLetterGenerator, coverLetterBuilder } from "./cover-letters";
import { resumeTips, howToWriteAResume } from "./guides";
import { cvTemplates, resumeTemplates, googleDocsCvTemplate } from "./templates";
import {
  jobscanAlternative,
  tealAlternative,
  kickresumeAlternative,
  huntrAlternative,
  enhancvAlternative,
  reziAlternative,
  resumeWordedAlternative,
  tailoredcvAlternative,
  seekarioAlternative,
  visualcvAlternative,
} from "./alternatives";
import { RESUME_KEYWORD_PAGES } from "@/content/resume-keywords";
import { missingResumeKeywords } from "./missing-resume-keywords";
import { resumeBulletRewriter } from "./resume-bullet-rewriter";
import { resumeHeadlineGenerator } from "./resume-headline-generator";
import { resumeFileNameGenerator } from "./resume-file-name-generator";
import { professionalSummaryGenerator } from "./professional-summary-generator";
import { linkedinUrlForResume } from "./linkedin-url-for-resume";
import { jobDescriptionToResumeBullets } from "./job-description-to-resume-bullets";
import { resumeKeywordsHub } from "./resume-keywords-hub";
import {
  cvFormatChecker,
  resumeWeakWordsChecker,
  employmentGapExplanationGenerator,
} from "./free-cv-tools";
import {
  workdayResumeFormat,
  greenhouseAtsResume,
  leverAtsResume,
  taleoResumeFormat,
  icimsResumeFormat,
} from "./ats";

export const MARKETING_PAGES = [
  resumeJobMatchChecker,
  missingResumeKeywords,
  resumeBulletRewriter,
  resumeHeadlineGenerator,
  resumeFileNameGenerator,
  professionalSummaryGenerator,
  linkedinUrlForResume,
  jobDescriptionToResumeBullets,
  cvFormatChecker,
  resumeWeakWordsChecker,
  employmentGapExplanationGenerator,
  resumeKeywordsHub,
  ...RESUME_KEYWORD_PAGES,
  atsResumeChecker,
  freeAtsKeywordChecker,
  resumeOptimizer,
  aiCoverLetterGenerator,
  coverLetterBuilder,
  resumeTips,
  howToWriteAResume,
  cvTemplates,
  resumeTemplates,
  googleDocsCvTemplate,
  jobscanAlternative,
  tealAlternative,
  kickresumeAlternative,
  huntrAlternative,
  enhancvAlternative,
  reziAlternative,
  resumeWordedAlternative,
  tailoredcvAlternative,
  seekarioAlternative,
  visualcvAlternative,
  workdayResumeFormat,
  greenhouseAtsResume,
  leverAtsResume,
  taleoResumeFormat,
  icimsResumeFormat,
];

const BY_SLUG = Object.fromEntries(
  MARKETING_PAGES.map((page) => [page.slug, page])
);

export function getMarketingPage(slug) {
  return BY_SLUG[slug] ?? null;
}
