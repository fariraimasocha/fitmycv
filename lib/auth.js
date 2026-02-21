import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign in or session update, fetch user from DB and cache in token
      if (trigger === "signIn" || trigger === "update" || !token.id) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.isPremium = dbUser.isPremium || false;
            token.subscriptionStatus =
              dbUser.polarSubscriptionStatus || null;
            token.subscriptionCurrentPeriodEnd =
              dbUser.subscriptionCurrentPeriodEnd
                ? dbUser.subscriptionCurrentPeriodEnd.toISOString()
                : null;
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
        session.user.subscriptionStatus =
          token.subscriptionStatus || null;
        session.user.subscriptionCurrentPeriodEnd =
          token.subscriptionCurrentPeriodEnd || null;
      }
      return session;
    },
    async signIn({ profile }) {
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
