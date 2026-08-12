import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // JWT-based fast path
    if (session.user.isPremium) {
      return NextResponse.redirect(new URL("/api/polar/portal", request.url));
    }

    // DB-first safety check — catches stale JWT (webhook fired but session not refreshed)
    await connectDB();
    const dbUser = await User.findOne({ _id: session.user.id }).select("isPremium");
    if (dbUser?.isPremium) {
      return NextResponse.redirect(new URL("/api/polar/portal", request.url));
    }

    const { searchParams } = new URL(request.url);
    const planParam = searchParams.get("plan");
    const plan =
      planParam === "month"
        ? "month"
        : planParam === "year"
          ? "year"
          : "lifetime";
    const productId =
      plan === "lifetime"
        ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_LIFE
        : plan === "year"
          ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_YEAR
          : process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_MONTH;

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: process.env.POLAR_SUCCESS_URL,
      customerEmail: session.user.email,
      metadata: {
        userId: String(session.user.id),
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (error) {
    console.error("Polar checkout error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=checkout_failed", request.url),
    );
  }
}
