import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing, UNTRANSLATED } from "./i18n/routing";
import { authConfig } from "./auth.config";
import { getPricingTier, resolveCountryFromHeaders } from "./lib/pricing-region";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createIntlMiddleware(routing);

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

// Auth.js swaps the request origin for AUTH_URL. Rebuild the URL the visitor
// actually asked for, so redirects and next-intl's rewrites stay on this host.
function visitorRequest(request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return request;
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.slice(0, -1);
  const { pathname, search } = request.nextUrl;
  return new NextRequest(`${proto}://${host}${pathname}${search}`, request);
}

// Auth.js ignores authorized() === false when it wraps a middleware like this
// one, so the dashboard guard has to live here. Without it, logged out
// visitors got the dashboard shell and a 401 on every action.
export default auth((authRequest) => {
  const request = visitorRequest(authRequest);
  if (!authRequest.auth?.user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/auth", request.nextUrl);
    signInUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return applyGeoCookies(request, NextResponse.redirect(signInUrl));
  }
  const response = UNTRANSLATED.test(request.nextUrl.pathname)
    ? NextResponse.next()
    : intlMiddleware(request);
  return applyGeoCookies(request, response);
});

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
