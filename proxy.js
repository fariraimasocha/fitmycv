import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { getPricingTier, resolveCountryFromHeaders } from "./lib/pricing-region";

const { auth } = NextAuth(authConfig);

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

// Auth.js ignores authorized() === false when it wraps a middleware like this
// one, so the dashboard guard has to live here. Without it, logged out
// visitors got the dashboard shell and a 401 on every action.
export default auth((request) => {
  if (!request.auth?.user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/auth", request.nextUrl);
    signInUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return applyGeoCookies(request, NextResponse.redirect(signInUrl));
  }
  return applyGeoCookies(request, NextResponse.next());
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_vercel|favicon.ico).*)"],
};
