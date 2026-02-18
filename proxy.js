import { NextResponse } from "next/server";

//clean proxy
export function proxy(request) {
  // Check for next-auth session token cookie
  // next-auth uses different cookie names based on environment:
  // - "next-auth.session-token" in development
  // - "__Secure-next-auth.session-token" in production (HTTPS)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
