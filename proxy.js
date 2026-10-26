import { createDualmarkMiddleware } from "@dualmark/nextjs";
import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing, UNTRANSLATED } from "./i18n/routing";
import { authConfig } from "./auth.config";
import { DUALMARK_SKIP_PATHS, DUALMARK_SITE_URL } from "./lib/dualmark-config";
import { getPricingTier, resolveCountryFromHeaders } from "./lib/pricing-region";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createIntlMiddleware(routing);
const dualmark = createDualmarkMiddleware({
  siteUrl: DUALMARK_SITE_URL,
  middleware: { skipPaths: DUALMARK_SKIP_PATHS },
});

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function applyGeoCookies(request, response) {
  const country = resolveCountryFromHeaders(request.headers);
  const tier = getPricingTier(country);
  const res = response ?? NextResponse.next();

  res.cookies.set("pricing_tier", tier, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("__Secure-authjs.session-token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  if (country) {
    res.cookies.set("visitor_country", country.toUpperCase(), {
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}

function copyNegotiationHeaders(from, to) {
  const link = from.headers.get("Link");
  if (link) {
    const existing = to.headers.get("Link");
    to.headers.set("Link", existing ? `${existing}, ${link}` : link);
  }

  const vary = from.headers.get("Vary");
  if (vary) {
    const existing = to.headers.get("Vary");
    if (!existing) {
      to.headers.set("Vary", vary);
    } else if (
      !existing
        .toLowerCase()
        .split(",")
        .map((token) => token.trim())
        .includes("accept")
    ) {
      to.headers.set("Vary", `${existing}, Accept`);
    }
  }

  return to;
}

// Auth.js swaps the request origin for AUTH_URL. Rebuild the URL the visitor
// actually asked for, so redirects and next-intl's rewrites stay on this host.
function visitorRequest(request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return request;
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.slice(0, -1);
  const { pathname, search } = request.nextUrl;
  return new NextRequest(`${proto}://${host}${pathname}${search}`, request);
}

// Dualmark runs first so `.md` twins, Accept: text/markdown, and AI crawlers
// never hit next-intl or the dashboard guard. HTML responses keep Dualmark's
// Link and Vary headers after auth/intl finish.
export default auth(async (authRequest) => {
  const request = visitorRequest(authRequest);
  const dualmarkResponse = await dualmark(request);

  if (dualmarkResponse.status === 406) {
    return dualmarkResponse;
  }

  if (dualmarkResponse.headers.get("x-middleware-next") !== "1") {
    return applyGeoCookies(request, dualmarkResponse);
  }

  if (!authRequest.auth?.user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/auth", request.nextUrl);
    signInUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return applyGeoCookies(request, NextResponse.redirect(signInUrl));
  }
  const response = UNTRANSLATED.test(request.nextUrl.pathname)
    ? NextResponse.next()
    : intlMiddleware(request);
  return applyGeoCookies(request, copyNegotiationHeaders(dualmarkResponse, response));
});

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|_next/|favicon.ico|md/).*)"],
};
