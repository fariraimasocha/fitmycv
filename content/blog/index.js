// Blog registry. Each post is a module exporting `meta`, `faqs` and `blocks`.
// The registry is the single source of truth for the hub, the sitemap, and the
// related-posts rails, so adding a post means adding one import and one entry.
import atsResumeGuide from "./ats-resume-guide";
import bestAiResumeBuilders from "./best-ai-resume-builders-2026";
import howToTailorCv from "./how-to-tailor-cv-to-job-description";
import chatgptPrompts from "./chatgpt-prompts-to-tailor-resume";
import bestFreeAtsCheckers from "./best-free-ats-resume-checkers-2026";
import coverLetterFromJd from "./cover-letter-from-job-description";
import fitmycvVsChatgpt from "./fitmycv-vs-chatgpt-resume-tailoring";
import bestAiTailoringTools from "./best-ai-resume-tailoring-tools-2026";
import verbsTech from "./cv-action-verbs-tech";
import verbsMarketing from "./cv-action-verbs-marketing";
import verbsFinance from "./cv-action-verbs-finance";
import verbsHealthcare from "./cv-action-verbs-healthcare";
import verbsSales from "./cv-action-verbs-sales";
import whyNotGettingInterviews from "./why-am-i-not-getting-interviews";
import howManyJobsToApply from "./how-many-jobs-should-i-apply-to";
import cvNoExperience from "./cv-with-no-experience";
import employmentGap from "./how-to-explain-employment-gap-on-cv";
import howLongShouldCvBe from "./how-long-should-a-cv-be";
import howToGetRemoteJob from "./how-to-get-a-remote-job";
import cvProfessionalSummary from "./cv-professional-summary-examples";
import atsResumeFormat from "./ats-resume-format";
import howToMatchResume from "./how-to-match-resume-to-job-description";
import howToCheckResume from "./how-to-check-resume-against-job-description";
import howToFindKeywordGaps from "./how-to-find-resume-keyword-gaps";
import whatIsMatchScore from "./what-is-a-resume-match-score";
import doesTailoringWork from "./does-tailoring-your-resume-actually-work";
import howMuchToTailor from "./how-much-should-you-tailor-your-resume";
import cvVsResume from "./cv-vs-resume-difference";
import jobApplicationLetter from "./job-application-letter";
import howToEmailApplication from "./how-to-email-a-job-application";

import tiredOfTailoring from "./tired-of-tailoring-resume-for-every-job";
import cvFormatSouthAfrica from "./cv-format-south-africa";
import cvFormatNigeria from "./cv-format-nigeria";
import cvFormatKenya from "./cv-format-kenya";
import cvFormatZimbabwe from "./cv-format-zimbabwe";
import jobscanAlternative from "./jobscan-alternative";
import howAtsWorks from "./how-ats-works";
import howToApplyFaster from "./how-to-apply-to-jobs-faster";
import resumeBuilderNoSub from "./resume-builder-no-subscription";

export const POSTS = [
  resumeBuilderNoSub,
  howToApplyFaster,
  howAtsWorks,
  jobscanAlternative,
  tiredOfTailoring,
  cvFormatSouthAfrica,
  cvFormatNigeria,
  cvFormatKenya,
  cvFormatZimbabwe,
  jobApplicationLetter,
  howToEmailApplication,
  doesTailoringWork,
  howMuchToTailor,
  cvVsResume,
  atsResumeFormat,
  howToMatchResume,
  howToCheckResume,
  howToFindKeywordGaps,
  whatIsMatchScore,
  atsResumeGuide,
  howToTailorCv,
  chatgptPrompts,
  bestFreeAtsCheckers,
  coverLetterFromJd,
  fitmycvVsChatgpt,
  bestAiTailoringTools,
  bestAiResumeBuilders,
  verbsTech,
  verbsMarketing,
  verbsFinance,
  verbsHealthcare,
  verbsSales,
  whyNotGettingInterviews,
  howManyJobsToApply,
  cvNoExperience,
  employmentGap,
  howLongShouldCvBe,
  howToGetRemoteJob,
  cvProfessionalSummary,
];

export const POSTS_BY_SLUG = Object.fromEntries(
  POSTS.map((post) => [post.meta.slug, post])
);

export function getPost(slug) {
  return POSTS_BY_SLUG[slug] ?? null;
}

// Posts flagged noindex stay reachable at their URL but drop out of the
// sitemap, the hub and the related rail, so no internal link points Google at them.
export const INDEXED_POSTS = POSTS.filter((post) => !post.meta.noindex);

/** Newest first, for the hub grid. */
export function listPosts() {
  return [...INDEXED_POSTS].sort(
    (a, b) => new Date(b.meta.date) - new Date(a.meta.date)
  );
}

/**
 * Related posts for the end-of-article rail. Prefers posts sharing the current
 * post's `series`, then falls back to shared tags, then to anything else, so
 * every post always ends with three real internal links.
 */
export function relatedPosts(slug, limit = 3) {
  const current = POSTS_BY_SLUG[slug];
  if (!current) return [];

  const score = (post) => {
    if (post.meta.slug === slug) return -1;
    let value = 0;
    if (current.meta.series && post.meta.series === current.meta.series) value += 10;
    value += post.meta.tags.filter((tag) => current.meta.tags.includes(tag)).length;
    return value;
  };

  return INDEXED_POSTS.filter((post) => post.meta.slug !== slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
