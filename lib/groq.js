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

// Last resort when both Groq models are rate limited. Not a reasoning model,
// so it needs no headroom and takes temperature as is.
export const OPENAI_FALLBACK_MODEL = "gpt-4.1-mini";

let client;

export async function chat({ max_tokens = 4096, ...params }) {
  // Lazy so a build without GROQ_API_KEY can still import route modules.
  // The SDK default is a 10 minute timeout with 2 retries, so a stalled call
  // left users on a spinner with no error. Fail inside a minute instead.
  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 60_000, maxRetries: 1 });
  const groq = (model) =>
    client.chat.completions.create({
      reasoning_effort: "low",
      ...params,
      model,
      max_tokens: max_tokens + REASONING_HEADROOM,
    });

  // ponytail: each Groq model has its own daily token cap on our tier, so a
  // 429 on one usually means the other still has room. Paid tier lifts both.
  const other = { [MODEL_FAST]: MODEL_SMART, [MODEL_SMART]: MODEL_FAST }[params.model];
  let rateLimited;
  for (const model of [params.model, other].filter(Boolean)) {
    try {
      return await groq(model);
    } catch (error) {
      if (error?.status !== 429) throw error;
      console.warn(`Groq 429 on ${model}`);
      rateLimited = error;
    }
  }
  if (!process.env.OPENAI_API_KEY) throw rateLimited;
  console.warn(`Both Groq models rate limited, falling back to ${OPENAI_FALLBACK_MODEL}`);
  return openaiChat({ ...params, max_tokens });
}

// Plain fetch: OpenAI takes the same chat body and returns the same shape
// (choices[0].message, tool_calls), so callers don't change.
async function openaiChat({ reasoning_effort: _unused, max_tokens, ...params }) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params, model: OPENAI_FALLBACK_MODEL, max_completion_tokens: max_tokens }),
    signal: AbortSignal.timeout(60_000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Keep status so callers treat an OpenAI 429 like a Groq one.
    throw Object.assign(new Error(body.error?.message || `OpenAI ${res.status}`), { status: res.status });
  }
  return body;
}
