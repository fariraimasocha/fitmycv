import { Polar, HTTPClient } from "@polar-sh/sdk";

// Polar ships date-based API versions and rotates them quarterly (January,
// April, July, October). A request that sends no version gets whatever is
// Current at the time, so an unpinned integration changes under you on the
// release date, with no deploy on our side. This pins it.
//
// 2026-04 is what the live API served us at the time of writing and what the
// checkout and portal routes were written against. Bump it deliberately after
// reading the changelog, not by accident.
// https://polar.sh/docs/api-reference/versioning
export const POLAR_API_VERSION = "2026-04";

// ponytail: a beforeRequest hook rather than the versioned SDK entrypoint
// (`@polar-sh/sdk/2026-04`), which needs a newer SDK than the 0.46 we have.
// Upgrade the dependency if you want the version-pinned types too.
export function createPolarClient() {
  const httpClient = new HTTPClient();

  httpClient.addHook("beforeRequest", (request) => {
    const pinned = new Request(request, { headers: request.headers });
    pinned.headers.set("Polar-Version", POLAR_API_VERSION);
    return pinned;
  });

  return new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    httpClient,
  });
}
