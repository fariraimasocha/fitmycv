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

  if (country) {
    res.cookies.set("visitor_country", country.toUpperCase(), {
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}

export default auth((request) => applyGeoCookies(request, NextResponse.next()));

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
