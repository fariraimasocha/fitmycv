// Canonical site origin. Vercel serves the site on www — the apex domain
// 307-redirects to it — so every emitted URL (canonicals, sitemap, robots)
// must use www or crawlers flag them as redirects.
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

// Public contact address shown on support, privacy, and terms pages.
// Change this in one place to update it everywhere.
export const SUPPORT_EMAIL = "support@fitmycv.link";
