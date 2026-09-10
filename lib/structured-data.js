// Centralized SEO structured-data (JSON-LD) for FitMyCV.
// Plain module (no server-only imports) so it can be shared by client and
// server components. Built from the canonical SITE_URL so every emitted URL
// matches the www origin used by canonicals, sitemap, and robots.
//
// Two rules hold everything here together:
//   1. Every fact in this file is also visible on the page that emits it.
//      Prices come from lib/pricing.js, the feature list mirrors the Features
//      section, the review mirrors the quote in the Testimonial section.
//   2. Entities are linked by @id rather than repeated, so search and answer
//      engines resolve one organization, one site, and one product.
//
// NOTE: We intentionally do NOT include an AggregateRating. Google can issue
// manual actions for fabricated review markup. The single Review below is a
// real, attributed quote that is rendered on the page; add more only when
// there are more real ones, and add aggregateRating only once there are
// enough collectible reviews to compute one honestly.
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";
import { PRICING } from "@/lib/pricing";

const DESCRIPTION =
  "FitMyCV tailors your CV and cover letter to any job description in seconds: AI-powered keyword matching, ATS optimization, and one-click PDF export.";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APPLICATION_ID = `${SITE_URL}/#software`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "FitMyCV",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  description: DESCRIPTION,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: SUPPORT_EMAIL,
    url: `${SITE_URL}/support`,
    availableLanguage: "English",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "FitMyCV",
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
};

// Mirrors the pricing cards. Both plans are shown on the page, so both belong
// in the markup: quoting only the lifetime price hid the cheaper option.
const offers = [
  {
    "@type": "Offer",
    name: `${PRICING.month.label} Premium`,
    price: PRICING.month.price,
    priceCurrency: "USD",
    url: `${SITE_URL}/pricing`,
    availability: "https://schema.org/InStock",
  },
  {
    "@type": "Offer",
    name: `${PRICING.lifetime.label} Premium`,
    price: PRICING.lifetime.price,
    priceCurrency: "USD",
    url: `${SITE_URL}/pricing`,
    availability: "https://schema.org/InStock",
  },
];

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": APPLICATION_ID,
  name: "FitMyCV",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: DESCRIPTION,
  image: `${SITE_URL}/og-image.jpg`,
  provider: { "@id": ORGANIZATION_ID },
  // Each entry matches a card in the Features section on the homepage.
  featureList: [
    "Tailor a CV to any job link",
    "Match score and gap analysis before you apply",
    "ATS keyword matching pulled from the job post",
    "Tailored cover letter generation",
    "One-click PDF export of the CV and cover letter",
    "16 ATS-safe CV themes",
  ],
  offers,
};

/**
 * WebPage node for a public page, linked to the site and the product so the
 * three resolve as one entity graph rather than three loose blobs.
 */
export function webPageSchema({ name, description, path = "/", about = true }) {
  // Trailing slash stripped so this matches the canonical Next.js emits.
  const url = new URL(path, `${SITE_URL}/`).toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    primaryImageOfPage: `${SITE_URL}/og-image.jpg`,
    publisher: { "@id": ORGANIZATION_ID },
    ...(about ? { about: { "@id": APPLICATION_ID } } : {}),
  };
}

/**
 * A single named review of the product. Only pass quotes that are rendered on
 * the page and attributed to a real person who agreed to be quoted. No
 * reviewRating: nobody gave us a star, so we do not publish one.
 */
export function reviewSchema({ quote, author, role }) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": APPLICATION_ID },
    reviewBody: quote,
    author: {
      "@type": "Person",
      name: author,
      ...(role ? { jobTitle: role } : {}),
    },
  };
}
