// Use the web (fetch) transport instead of node-fetch + agentkeepalive.
// The node transport caches keep-alive sockets at module level, and on
// Cloudflare Workers a socket from one request cannot be reused by the next —
// every warm-isolate model call failed with "Connection error".
import "groq-sdk/shims/web";
import Groq from "groq-sdk";

// Every model call goes through here. Both models are gpt-oss, which reasons
// before it answers, and those reasoning tokens count against max_tokens. Low
// effort plus fixed headroom keeps each caller's budget meaning answer length.
export const MODEL_SMART = "openai/gpt-oss-120b";
export const MODEL_FAST = "openai/gpt-oss-20b";

const REASONING_HEADROOM = 2048;

let client;

export async function chat({ max_tokens = 4096, ...params }) {
  // Lazy so a build without GROQ_API_KEY can still import route modules.
  // The SDK default is a 10 minute timeout with 2 retries, so a stalled call
  // left users on a spinner with no error. Fail inside a minute instead.
  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 60_000, maxRetries: 1 });
  const create = (model) =>
    client.chat.completions.create({
      reasoning_effort: "low",
      ...params,
      model,
      max_tokens: max_tokens + REASONING_HEADROOM,
    });
  try {
    return await create(params.model);
  } catch (error) {
    // ponytail: each model has its own daily token cap on our Groq tier, so a
    // 429 on one usually means the other still has room. Paid tier lifts both.
    const other = { [MODEL_FAST]: MODEL_SMART, [MODEL_SMART]: MODEL_FAST }[params.model];
    if (error?.status !== 429 || !other) throw error;
    console.warn(`Groq 429 on ${params.model}, retrying on ${other}`);
    return create(other);
  }
}
