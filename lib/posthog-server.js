// Server-side PostHog capture over the public HTTP API. posthog-node would add
// a dependency and a flush lifecycle for the one event we send from the server.
// Analytics must never fail the caller, so every error is swallowed.
export async function captureServerEvent(distinctId, event, properties = {}) {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!host || !apiKey || !distinctId) return;

  try {
    const res = await fetch(new URL("/capture/", host), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        distinct_id: String(distinctId),
        properties,
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error(`PostHog capture failed for ${event}: ${res.status}`);
    }
  } catch (error) {
    console.error(`PostHog capture failed for ${event}:`, error);
  }
}
