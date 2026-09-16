import posthog from "posthog-js";

const posthogConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );

// The single call site for every product event. This used to send to umami
// only, so anything that did not also hand-roll its own posthog.capture never
// reached PostHog at all. lead_captured was firing correctly and was invisible
// in the funnel for that reason. Callers do not choose a destination.
export function trackEvent(name, data) {
  if (typeof window === "undefined") return;

  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics should never block UX.
  }

  try {
    if (posthogConfigured()) {
      posthog.capture(name, data);
    }
  } catch {
    // Same.
  }
}
