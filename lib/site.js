// Canonical site origin. The Cloudflare worker serves the site on https://www.
// The apex and plain http 308-redirect to it, so every emitted URL (canonicals,
// sitemap, robots) must use https://www or crawlers flag them as redirects.
const PRODUCTION_SITE_URL = "https://www.fitmycv.link";

export function resolveSiteUrl(
  configuredUrl = process.env.NEXT_PUBLIC_APP_URL,
  environment = process.env.NODE_ENV,
) {
  if (!configuredUrl) return PRODUCTION_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (environment === "production" && isLoopback) {
      return PRODUCTION_SITE_URL;
    }

    return url.origin;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

export function appUrl(path) {
  return new URL(path, `${SITE_URL}/`);
}

// The person who writes the blog. Every line here is a fact Farirai approved
// (~/.claude/skills/writer/brain.md). Do not add credentials that are not true.
export const AUTHOR = {
  name: "Farirai Masocha",
  role: "Founder of FitMyCV",
  path: "/about/farirai-masocha",
  short: "Software developer in Harare, Zimbabwe, and the founder of FitMyCV.",
  origin:
    "I hate rewriting my CV every time I apply for a job. I hate writing cover letters even more. So I built FitMyCV.",
  profiles: [
    { label: "X", url: "https://x.com/fariraijames" },
    { label: "Website", url: "https://techstack.co.zw" },
  ],
};

// Public contact address shown on support, privacy, and terms pages.
// Change this in one place to update it everywhere.
export const SUPPORT_EMAIL = "support@fitmycv.link";
