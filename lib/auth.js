import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { authConfig } from "@/auth.config";

function sendAuthDebugLog(location, message, data, hypothesisId) {
  const payload = {
    sessionId: "2ae789",
    location,
    message,
    data,
    timestamp: Date.now(),
    hypothesisId,
    runId: "pre-fix",
  };
  // #region agent log
  fetch("http://127.0.0.1:7261/ingest/793c915b-9566-44f0-bafe-da689dd0cf13", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "2ae789",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
  console.error("[auth-debug]", JSON.stringify(payload));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(error) {
      sendAuthDebugLog(
        "lib/auth.js:logger.error",
        "NextAuth error",
        {
          name: error?.name,
          type: error?.type,
          message: error?.message,
          cause: error?.cause?.message,
        },
        "H1-H5"
      );
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Refresh from DB on sign in, explicit update, or every 60s so
      // webhook-driven changes (e.g. Polar setting isPremium) self-heal
      const isStale = Date.now() - (token.refreshedAt ?? 0) > 60_000;
      if (trigger === "signIn" || trigger === "update" || !token.id || isStale) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).select(
            "role isPremium onboardingCompleted polarSubscriptionStatus subscriptionCurrentPeriodEnd"
          );
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.isPremium = dbUser.isPremium || false;
            token.onboardingCompleted = dbUser.onboardingCompleted !== false;
            token.subscriptionStatus =
              dbUser.polarSubscriptionStatus || null;
            token.subscriptionCurrentPeriodEnd =
              dbUser.subscriptionCurrentPeriodEnd
                ? dbUser.subscriptionCurrentPeriodEnd.toISOString()
                : null;
            token.refreshedAt = Date.now();
          }
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Use cached values from JWT token instead of DB lookup
      if (token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isPremium = token.isPremium || false;
        session.user.onboardingCompleted = token.onboardingCompleted !== false;
        session.user.subscriptionStatus =
          token.subscriptionStatus || null;
        session.user.subscriptionCurrentPeriodEnd =
          token.subscriptionCurrentPeriodEnd || null;
      }
      return session;
    },
    async signIn({ profile }) {
      sendAuthDebugLog(
        "lib/auth.js:signIn",
        "signIn callback reached",
        { hasEmail: Boolean(profile?.email) },
        "H4"
      );
      if (process.env.NODE_ENV === "development") {
        console.log(profile);
      }
      try {
        await connectDB();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
});
