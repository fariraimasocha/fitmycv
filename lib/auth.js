import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { authConfig } from "@/auth.config";
import clientPromise from "@/lib/mongodb-client";
import { sendMagicLinkEmail } from "@/lib/auth-email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Email({
      // Required by Auth.js even though delivery goes through Cloudflare Email.
      server: {
        host: "localhost",
        port: 1025,
        auth: { user: "unused", pass: "unused" },
      },
      from: "noreply@fitmycv.link",
      maxAge: 24 * 60 * 60,
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendMagicLinkEmail({ email: identifier, url });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      const isStale = Date.now() - (token.refreshedAt ?? 0) > 60_000;
      if (trigger === "signIn" || trigger === "update" || !token.id || isStale) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).select(
            "role isPremium onboardingCompleted polarSubscriptionStatus subscriptionCurrentPeriodEnd",
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
    async signIn({ user, profile }) {
      if (process.env.NODE_ENV === "development") {
        console.log(profile ?? user);
      }

      const email = profile?.email ?? user?.email;
      if (!email) return false;

      try {
        await connectDB();
        const userExists = await User.findOne({ email });

        if (!userExists) {
          await User.create({
            name: profile?.name ?? user?.name ?? email.split("@")[0],
            email,
            image: profile?.picture ?? user?.image ?? undefined,
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
