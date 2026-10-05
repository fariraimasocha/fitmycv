import posthog from "posthog-js";
import { reloadOnChunkLoadError } from "@/lib/chunkReload";

// ponytail: browser translation (Chrome, Edge) swaps React's text nodes for its
// own, then React throws NotFoundError on the next update and the page shows
// the error boundary (facebook/react#11538). Skip the move instead of crashing.
// Remove once React handles this itself.
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  };
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

// Error boundaries handle chunk errors that React catches. These listeners
// handle the rest, for example a chunk that fails outside a render.
window.addEventListener("error", (event) => reloadOnChunkLoadError(event.error));
window.addEventListener("unhandledrejection", (event) =>
  reloadOnChunkLoadError(event.reason),
);

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = projectToken
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  // Local runs use the live project's token, so their events would count as
  // real traffic. Drop them before they leave the browser. Debug logging still
  // shows what would have been sent.
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    disable_session_recording: isLocal,
    before_send: (event) => (isLocal ? null : event),
  });
}
