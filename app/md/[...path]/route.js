import { createDualmarkRouteHandler } from "@dualmark/nextjs";
import { getDualmarkRouteConfig } from "@/lib/dualmark-pages";

const handler = createDualmarkRouteHandler(getDualmarkRouteConfig());

// force-static lets Next overwrite Vary with RSC tokens on the cached
// markdown response, which fails AEO Spec md.vary. Dynamic keeps Dualmark's
// Vary: Accept on the live response.
export const dynamic = "force-dynamic";

function withAcceptVary(response) {
  const headers = new Headers(response.headers);
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", "Accept");
  } else if (
    !existing
      .toLowerCase()
      .split(",")
      .map((token) => token.trim())
      .includes("accept")
  ) {
    headers.set("Vary", `${existing}, Accept`);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function GET(request, context) {
  return Promise.resolve(handler.GET(request, context)).then(withAcceptVary);
}

export const generateStaticParams = handler.generateStaticParams;
