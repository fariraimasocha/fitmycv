import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { authConfig } from "@/auth.config";
import getMongoClient from "@/lib/mongodb-client";
import { sendMagicLinkEmail } from "@/lib/auth-email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(getMongoClient),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // A plain email provider. next-auth/providers/email wraps Nodemailer,
    // which pulled nodemailer into the Worker bundle just to be ignored:
    // delivery goes through Cloudflare Email.
    {
      id: "email",
      type: "email",
      name: "Email",
      from: "noreply@fitmycv.link",
      maxAge: 24 * 60 * 60,
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendMagicLinkEmail({ email: identifier, url });
      },
      options: {},
    },
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
          } else if (token.id && trigger !== "signIn") {
            // The account was deleted. Returning null ends this session
            // instead of letting the old token keep its id and premium flag.
            return null;
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
