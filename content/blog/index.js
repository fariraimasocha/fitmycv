// Blog registry. Each post is a module exporting `meta`, `faqs` and `blocks`.
// The registry is the single source of truth for the hub, the sitemap, and the
// related-posts rails, so adding a post means adding one import and one entry.
import atsResumeGuide from "./ats-resume-guide";
import bestAiResumeBuilders from "./best-ai-resume-builders-2026";
import howToTailorCv from "./how-to-tailor-cv-to-job-description";
import verbsTech from "./cv-action-verbs-tech";
import verbsMarketing from "./cv-action-verbs-marketing";
import verbsFinance from "./cv-action-verbs-finance";
import verbsHealthcare from "./cv-action-verbs-healthcare";
import verbsSales from "./cv-action-verbs-sales";
import whyNotGettingInterviews from "./why-am-i-not-getting-interviews";
import howManyJobsToApply from "./how-many-jobs-should-i-apply-to";
import howToFollowUp from "./how-to-follow-up-on-a-job-application";
import coverLetterNoExperience from "./cover-letter-with-no-experience";
import cvNoExperience from "./cv-with-no-experience";
import employmentGap from "./how-to-explain-employment-gap-on-cv";
import careerChangeCv from "./career-change-cv";
import howLongShouldCvBe from "./how-long-should-a-cv-be";
import howToGetRemoteJob from "./how-to-get-a-remote-job";
import cvProfessionalSummary from "./cv-professional-summary-examples";

export const POSTS = [
  atsResumeGuide,
  howToTailorCv,
  bestAiResumeBuilders,
  verbsTech,
  verbsMarketing,
  verbsFinance,
  verbsHealthcare,
  verbsSales,
  whyNotGettingInterviews,
  howManyJobsToApply,
  howToFollowUp,
  coverLetterNoExperience,
  cvNoExperience,
  employmentGap,
  careerChangeCv,
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

/** Newest first, for the hub grid. */
export function listPosts() {
  return [...POSTS].sort(
    (a, b) => new Date(b.meta.date) - new Date(a.meta.date)
  );
}

/**
 * Related posts for the end-of-article rail. Prefers posts sharing the current
 * post's `series`, then falls back to shared tags, then to anything else — so
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

  return POSTS.filter((post) => post.meta.slug !== slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
