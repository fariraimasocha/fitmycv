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
    // Inject PostHog's helper scripts into <head>, not <body>. The "2025-05-24"
    // defaults inject into <body> before the first `body > script`, which is the
    // JSON-LD <script> in app/layout.js — that collision breaks hydration.
    // (PostHog's own >=2026-01-30 defaults already use "head".)
    external_scripts_inject_target: "head",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
