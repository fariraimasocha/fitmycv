import posthog from "posthog-js";

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    // Same-origin reverse proxy (see rewrites in next.config.mjs) — keeps
    // PostHog under our CSP `'self'` and resistant to ad blockers.
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    // Opt into PostHog's modern defaults: pageview (on history change) and
    // pageleave capture for the App Router are handled automatically.
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
