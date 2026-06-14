// Canonical site origin. Vercel serves the site on www — the apex domain
// 307-redirects to it — so every emitted URL (canonicals, sitemap, robots)
// must use www or crawlers flag them as redirects.
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.fitmycv.link";

// Public contact address shown on support, privacy, and terms pages.
// Change this in one place to update it everywhere.
export const SUPPORT_EMAIL = "support@fitmycv.link";
