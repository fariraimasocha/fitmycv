import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";

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

    if (session.user.isPremium) {
      return NextResponse.redirect(new URL("/api/polar/portal", request.url));
    }

    const checkout = await polar.checkouts.create({
      products: [process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID],
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
