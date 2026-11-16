// Shared metadata + JSON-LD builders for the public marketing pages.
// Keeping them here means every page emits a canonical, an OG image, and
// consistent schema without repeating 40 lines of metadata per file.
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

// A new filename, not an overwrite: WhatsApp, LinkedIn and X cache previews by
// image URL, so changing the picture means changing the URL.
const DEFAULT_OG = "/social-preview.jpg?v=2";

// Pages kept live for visitors but out of Google's index and the sitemap, so
// the index holds the pages that earn clicks. From `pnpm seo:triage`, 90 days
// to 2026-11-14. Rules: no clicks and under 10 impressions on a page older than
// 6 weeks, plus resume examples and role keyword pages with no clicks and under
// 200 impressions, plus four ATS checker translations with no clicks.
// To put a page back, delete its line. Blog posts use `noindex` in their meta.
export const NOINDEX_PATHS = new Set([
  "/greenhouse-ats-resume",
  "/resume-bullet-rewriter",
  // Translations with no clicks.
  "/zh",
  "/ar",
  "/zh/pricing",
  "/de/pricing",
  "/es/pricing",
  "/pt/pricing",
  "/zh/tailor-cv-from-job-link",
  "/es/ats-resume-checker",
  "/pt/ats-resume-checker",
  "/zh/ats-resume-checker",
  "/ar/ats-resume-checker",
  // Resume examples. operations-manager and sales-manager stay: 1,277 and 791 impressions.
  ...[
    "account-executive",
    "accountant",
    "administrative-assistant",
    "business-analyst",
    "customer-service-representative",
    "data-analyst",
    "data-scientist",
    "devops-engineer",
    "financial-analyst",
    "first-job",
    "hr-manager",
    "marketing-manager",
    "nurse",
    "product-manager",
    "project-manager",
    "software-engineer",
    "teacher",
    "ux-designer",
  ].map((role) => `/resume-examples/${role}`),
  // Role keyword pages. Those with clicks or 200+ impressions stay.
  ...[
    "accountant",
    "data-analyst",
    "data-scientist",
    "financial-analyst",
    "marketing-manager",
    "product-manager",
    "project-manager",
    "software-engineer",
    "teacher",
    "ux-designer",
  ].map((role) => `/${role}-resume-keywords`),
]);

/** Spread into a page's metadata. Empty unless the path is in NOINDEX_PATHS. */
export const robotsFor = (path) =>
  NOINDEX_PATHS.has(path) ? { robots: { index: false, follow: true } } : {};

/**
 * Build a Next.js `metadata` object for a public page.
 * `title` is passed through the root layout's "%s | FitMyCV" template unless
 * `absoluteTitle` is set (used where the task specifies an exact title tag).
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
}) {
  const resolvedTitle = absoluteTitle ? { absolute: absoluteTitle } : title;
  const social = absoluteTitle || `${title} | FitMyCV`;

  return {
    title: resolvedTitle,
    description,
    keywords,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : robotsFor(path)),
    openGraph: {
      type,
      url: path,
      siteName: "FitMyCV",
      title: social,
      description,
      images: [{ url: image, alt: social }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      images: [image],
    },
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function howToSchema({ name, description, steps }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map(({ name: stepName, text }, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: stepName,
      text,
    })),
  };
}

export function articleSchema({
  headline,
  description,
  path,
  image = DEFAULT_OG,
  datePublished,
  dateModified,
  author = null,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: `${SITE_URL}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    // A page with a visible byline names the person. Pages without one stay
    // credited to FitMyCV, so the schema never claims more than the page shows.
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: `${SITE_URL}${author.path}`,
          sameAs: author.profiles.map((p) => p.url),
        }
      : { "@type": "Organization", name: "FitMyCV", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "FitMyCV",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/fitmycv-logo.png` },
    },
  };
}

/** Breadcrumbs help Google render the URL path and reinforce site structure. */
export function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE_URL}${path}`,
    })),
  };
}

// Pages that exist in every language. Legal and marketing slug pages render
// English under /fr etc. and keep an English canonical, so they are left out.
export const TRANSLATED_PATHS = ["", "/pricing", "/tailor-cv-from-job-link", "/ats-resume-checker"];
const LOCALES = routing.locales;

const localePath = (locale, path) => (locale === "en" ? path || "/" : `/${locale}${path}`);

/**
 * canonical + hreflang links for a translated page. `path` is the English path
 * ("" for home). Spread into a page's metadata as `alternates`.
 */
export function localeAlternates(locale, path) {
  return {
    canonical: localePath(locale, path),
    languages: {
      // hreflang only points at versions Google may index.
      ...Object.fromEntries(
        LOCALES.map((l) => [l, localePath(l, path)]).filter(([, href]) => !NOINDEX_PATHS.has(href)),
      ),
      "x-default": localePath("en", path),
    },
  };
}
