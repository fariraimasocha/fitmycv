// Registry for the data-driven marketing pages rendered by app/[slug]/page.js.
// Adding a landing page means adding a content object and one entry here — the
// route, metadata, schema, and sitemap entry all follow from it.
import {
  atsResumeChecker,
  freeAtsKeywordChecker,
  resumeOptimizer,
} from "./tools";
import { aiCoverLetterGenerator, coverLetterBuilder } from "./cover-letters";
import { resumeTips, howToWriteAResume } from "./guides";
import { cvTemplates, resumeTemplates, googleDocsCvTemplate } from "./templates";

export const MARKETING_PAGES = [
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
];

const BY_SLUG = Object.fromEntries(
  MARKETING_PAGES.map((page) => [page.slug, page])
);

export function getMarketingPage(slug) {
  return BY_SLUG[slug] ?? null;
}
