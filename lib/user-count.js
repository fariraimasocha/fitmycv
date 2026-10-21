import { connectDB } from "@/utils/connect";
import User from "@/models/User";

const TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 1500;

// ponytail: cached per worker isolate. The incremental cache drops writes
// (open-next.config.ts), so unstable_cache would not persist. Each isolate
// counts at most every six hours; move to KV if that ever shows up in load.
let cached = { value: null, at: 0 };

/**
 * Signed-up accounts, rounded down to the nearest hundred so the homepage
 * never claims more than is true. Returns null when the count is unknown,
 * and the hero then shows no number at all.
 */
export async function getUserCount() {
  if (Date.now() - cached.at < TTL_MS) return cached.value;
  try {
    // The connect is inside the race too: a cold database connection must
    // never hold up the homepage. Past the limit the hero shows no number.
    const count = await Promise.race([
      connectDB().then(() => User.estimatedDocumentCount()),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)),
    ]);
    cached = { value: count >= 100 ? Math.floor(count / 100) * 100 : null, at: Date.now() };
  } catch {
    // Keep the last good value and try again in a minute, not on every request.
    cached = { value: cached.value, at: Date.now() - TTL_MS + 60_000 };
  }
  return cached.value;
}
