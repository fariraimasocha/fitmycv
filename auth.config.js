export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isPremium = token.isPremium || false;
        session.user.subscriptionStatus = token.subscriptionStatus || null;
        session.user.subscriptionCurrentPeriodEnd =
          token.subscriptionCurrentPeriodEnd || null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPremium = !!auth?.user?.isPremium;
      const pathname = nextUrl.pathname;

      const isOnDashboard = pathname.startsWith("/dashboard");
      const isOnAuth = pathname === "/auth";

      const PREMIUM_PATHS = ["/dashboard/tailor", "/dashboard/tailored"];
      const isOnPremiumPage = PREMIUM_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );

      if (isOnDashboard && !isLoggedIn) return false;
      if (isOnPremiumPage && isLoggedIn && !isPremium) {
        return Response.redirect(new URL("/dashboard/upgrade", nextUrl));
      }
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
