import { getCloudflareContext } from "@opennextjs/cloudflare";

// Workers rate limit bindings, declared under "ratelimits" in wrangler.jsonc.
// They count across every isolate, unlike an in-memory Map.
export async function isRateLimited(binding, key) {
  let limiter;
  try {
    limiter = getCloudflareContext().env?.[binding];
  } catch {
    return false; // next dev has no Workers context.
  }
  if (!limiter) return false;
  const { success } = await limiter.limit({ key });
  return !success;
}

// Every free route that calls Groq shares one budget per signed in user.
// ponytail: a per-minute cap bounds bursts, not a daily total. Add a Mongo
// counter on User if the monthly Groq bill still climbs.
export const groqRateLimited = (userId) => isRateLimited("GROQ_LIMITER", `user:${userId}`);

export const tooManyRequests = () =>
  Response.json(
    { error: "You've sent a lot of requests in a short time. Wait a minute and try again." },
    { status: 429 },
  );
