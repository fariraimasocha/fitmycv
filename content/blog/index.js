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

export const POSTS = [
  atsResumeGuide,
  howToTailorCv,
  bestAiResumeBuilders,
  verbsTech,
  verbsMarketing,
  verbsFinance,
  verbsHealthcare,
  verbsSales,
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
