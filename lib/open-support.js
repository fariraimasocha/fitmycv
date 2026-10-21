/**
 * Opens the support chat from an error or a stuck screen. Falls back to the
 * support page when the widget has not booted (blocked script, /print).
 */
export function openSupport() {
  try {
    if (window.$chatwoot) {
      window.$chatwoot.toggle("open");
      return;
    }
  } catch (error) {
    console.error("Chatwoot toggle failed:", error);
  }
  window.location.assign("/support");
}
