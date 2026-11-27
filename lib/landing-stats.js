import { getCloudflareContext } from "@opennextjs/cloudflare";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import TailoredCV from "@/models/TailoredCV";
import Application from "@/models/Application";

const TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 1500;

// ponytail: cached per worker isolate. The incremental cache drops writes
// (open-next.config.ts), so unstable_cache would not persist. Each isolate
// counts at most every six hours; move to KV if that ever shows up in load.
let cached = { value: { users: null, tailored: null, tracked: null }, at: 0 };

function roundDown(count, step = 100) {
  return count >= step ? Math.floor(count / step) * step : null;
}

/**
 * Live counts, rounded down so we never claim more than is true. Each field is
 * null while the count is still too small to show. Shared by the homepage
 * render and /api/landing-stats.
 */
export async function countLandingStats() {
  await connectDB();
  const [users, tailored, tracked] = await Promise.all([
    User.estimatedDocumentCount(),
    TailoredCV.estimatedDocumentCount(),
    // Every role on an applications board, saved or applied. Most people do
    // not mark roles applied, so an "applied" count would undersell use.
    Application.estimatedDocumentCount(),
  ]);
  return {
    users: roundDown(users),
    // Tailored CVs and tracked jobs grow faster than accounts; floor to 10
    // once past 10 so early traction still shows without overstating.
    tailored: roundDown(tailored, tailored >= 100 ? 100 : 10),
    tracked: roundDown(tracked, tracked >= 100 ? 100 : 10),
  };
}

let refreshing = null;

/**
 * Homepage traction numbers, rounded down so we never claim more than is true.
 * Either field is null when the count is unknown or still too small to show.
 *
 * Never blocks the render: a stale cache is returned at once and refreshed in
 * the background. On a fresh isolate the first visitor gets nulls (the strip
 * hides), instead of waiting up to TIMEOUT_MS on a new Mongo connection.
 */
export async function getLandingStats() {
  if (Date.now() - cached.at >= TTL_MS && !refreshing) {
    refreshing = refresh().finally(() => {
      refreshing = null;
    });
    try {
      // Workers cancels unawaited work when the response ends unless it is handed to waitUntil.
      getCloudflareContext().ctx?.waitUntil(refreshing);
    } catch {
      // Not on workerd (node dev): the promise just runs.
    }
  }
  return cached.value;
}

async function refresh() {
  try {
    const value = await Promise.race([
      countLandingStats(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
      ),
    ]);
    cached = { value, at: Date.now() };
  } catch {
    // Keep the last good value and try again in a minute, not on every request.
    cached = { value: cached.value, at: Date.now() - TTL_MS + 60_000 };
  }
}

/** Signed-up accounts only. Kept for call sites that do not need the strip. */
export async function getUserCount() {
  const { users } = await getLandingStats();
  return users;
}
