export function trackEvent(name, data) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics should never block UX.
  }
}
