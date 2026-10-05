import { trackEvent } from "@/lib/analytics";

const RELOADED_AT_KEY = "chunkReloadedAt";
// If the chunk fails again this soon after a reload, the new build does not
// fix it. Stop here so the page does not reload in a loop.
const RELOAD_GUARD_MS = 30_000;

function isChunkLoadError(error) {
  return (
    error?.name === "ChunkLoadError" ||
    String(error?.message ?? "").includes("Failed to load chunk")
  );
}

// Each deploy replaces the hashed files in _next/static. A tab that opened
// before the deploy then asks for chunks that no longer exist. One full reload
// gets the new build.
export function reloadOnChunkLoadError(error) {
  if (!isChunkLoadError(error)) return;
  try {
    const lastReload = Number(sessionStorage.getItem(RELOADED_AT_KEY));
    if (lastReload && Date.now() - lastReload < RELOAD_GUARD_MS) return;
    sessionStorage.setItem(RELOADED_AT_KEY, String(Date.now()));
  } catch {
    // Without storage there is no loop guard, so do not reload.
    return;
  }
  trackEvent("chunk_load_reload");
  window.location.reload();
}
