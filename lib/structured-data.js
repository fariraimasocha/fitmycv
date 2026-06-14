// Centralized SEO structured-data (JSON-LD) for FitMyCV.
// Plain module (no server-only imports) so it can be shared by client and
// server components. Built from the canonical SITE_URL so every emitted URL
// matches the www origin used by canonicals, sitemap, and robots.
//
// NOTE: We intentionally do NOT include a fabricated AggregateRating — Google
// can issue manual actions for fake review markup. Add it here only once real,
// collectible reviews exist.
import { SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "FitMyCV tailors your CV and cover letter to any job description in seconds — AI-powered keyword matching, ATS optimization, and one-click PDF export.";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FitMyCV",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  description: DESCRIPTION,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FitMyCV",
  url: SITE_URL,
  description: DESCRIPTION,
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FitMyCV",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: DESCRIPTION,
  offers: {
    "@type": "Offer",
    price: "6.99",
    priceCurrency: "USD",
  },
};
