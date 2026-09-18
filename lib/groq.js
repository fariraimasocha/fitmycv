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

export function chat({ max_tokens = 4096, ...params }) {
  // Lazy so a build without GROQ_API_KEY can still import route modules.
  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY });
  return client.chat.completions.create({
    reasoning_effort: "low",
    ...params,
    max_tokens: max_tokens + REASONING_HEADROOM,
  });
}
