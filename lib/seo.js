// Shared metadata + JSON-LD builders for the public marketing pages.
// Keeping them here means every page emits a canonical, an OG image, and
// consistent schema without repeating 40 lines of metadata per file.
import { SITE_URL } from "@/lib/site";

const DEFAULT_OG = "/og-image.jpg";

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
}) {
  const resolvedTitle = absoluteTitle ? { absolute: absoluteTitle } : title;
  const social = absoluteTitle || `${title} | FitMyCV`;

  return {
    title: resolvedTitle,
    description,
    keywords,
    alternates: { canonical: path },
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
    author: { "@type": "Organization", name: "FitMyCV", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "FitMyCV",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.jpg` },
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
