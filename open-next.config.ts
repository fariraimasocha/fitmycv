import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered pages are served from Workers static assets instead of being
// rendered again. ponytail: read only, so it suits pages without revalidate;
// switch to the R2 incremental cache if a public page ever needs ISR.
// Writes are dropped quietly: Next tries to store every 404 for an unknown
// slug, and the stock cache logs an error each time, which bot scans for
// /wp-admin would turn into a flood. The name is kept so populateCache still
// recognises it.
const readOnlyCache = {
  name: staticAssetsIncrementalCache.name,
  get: (...args: Parameters<typeof staticAssetsIncrementalCache.get>) =>
    staticAssetsIncrementalCache.get(...args),
  set: async () => {},
  delete: async () => {},
};

export default defineCloudflareConfig({
  incrementalCache: readOnlyCache,
  enableCacheInterception: true,
});
