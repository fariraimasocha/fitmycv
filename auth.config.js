const isProd = process.env.NODE_ENV === "production";

// Share the session cookie between apex and www so a magic-link created on
// fitmycv.link still authenticates on www.fitmycv.link after the 308 redirect.
// Do not put Domain on the CSRF cookie: Auth.js names it __Host-authjs.csrf-token
// on HTTPS, and browsers reject __Host- cookies that have a Domain attribute,
// which would leave sign-out POSTs without a CSRF cookie. Only in production.
// On localhost a Domain attribute would prevent the cookie from being set at all.
const productionCookieConfig = isProd
  ? {
      cookies: {
        sessionToken: { options: { domain: ".fitmycv.link" } },
        callbackUrl: { options: { domain: ".fitmycv.link" } },
      },
    }
  : {};

export const authConfig = {
  trustHost: true,
  ...productionCookieConfig,
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isPremium = token.isPremium || false;
        session.user.onboardingCompleted = token.onboardingCompleted !== false;
        session.user.subscriptionStatus = token.subscriptionStatus || null;
        session.user.subscriptionCurrentPeriodEnd =
          token.subscriptionCurrentPeriodEnd || null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isOnDashboard = pathname.startsWith("/dashboard");
      const isOnAuth = pathname === "/auth";

      if (isOnDashboard && !isLoggedIn) return false;

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (pathname === "/" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
