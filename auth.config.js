export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPremium = !!auth?.user?.isPremium;
      const pathname = nextUrl.pathname;

      const isOnDashboard = pathname.startsWith("/dashboard");
      const isOnAuth = pathname === "/auth";

      const PREMIUM_PATHS = ["/dashboard/tailor", "/dashboard/tailored"];
      const isOnPremiumPage = PREMIUM_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
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
