/** fetch plus JSON for the app's own API routes. Throws the route's error message. */
export async function requestJson(url, { method = "GET", body } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const failure = await res.json().catch(() => ({}));
    throw new Error(failure.error || "Couldn't reach FitMyCV. Try again.");
  }
  return (await res.json()).data;
}
