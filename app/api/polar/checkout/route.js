import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createPolarClient } from "@/lib/polar";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { appUrl } from "@/lib/site";
import { getPolarProductId } from "@/lib/pricing";
import {
  getPricingTier,
  resolveCountryFromHeaders,
  resolveCustomerIp,
} from "@/lib/pricing-region";

const polar = createPolarClient();

function localAppUrl(path, request) {
  return process.env.NODE_ENV === "production"
    ? appUrl(path)
    : new URL(path, request.url);
}

async function resolveCheckoutTier() {
  const headerStore = await headers();
  const country = resolveCountryFromHeaders(headerStore);
  return getPricingTier(country);
}

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.redirect(localAppUrl("/auth", request));
    }

    if (session.user.isPremium) {
      return NextResponse.redirect(localAppUrl("/api/polar/portal", request));
    }

    await connectDB();
    const dbUser = await User.findOne({ _id: session.user.id }).select("isPremium");
    if (dbUser?.isPremium) {
      return NextResponse.redirect(localAppUrl("/api/polar/portal", request));
    }

    const { searchParams } = new URL(request.url);
    const planParam = searchParams.get("plan");
    const plan = planParam === "month" ? "month" : "lifetime";
    const tier = await resolveCheckoutTier();
    const productId = getPolarProductId(tier, plan);

    if (!productId) {
      throw new Error(`Missing Polar product ID for tier=${tier}, plan=${plan}`);
    }

    const headerStore = await headers();
    const customerIp = resolveCustomerIp(headerStore);

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl:
        process.env.NODE_ENV === "production"
          ? appUrl(`/payment/success?plan=${plan}`).toString()
          : process.env.POLAR_SUCCESS_URL ||
            localAppUrl(`/payment/success?plan=${plan}`, request).toString(),
      returnUrl: localAppUrl("/dashboard/upgrade", request).toString(),
      externalCustomerId: String(session.user.id),
      customerName: session.user.name || undefined,
      customerEmail: session.user.email,
      ...(customerIp ? { customerIpAddress: customerIp } : {}),
      metadata: {
        userId: String(session.user.id),
        pricingTier: tier,
        plan,
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (error) {
    console.error("Polar checkout error:", error);
    return NextResponse.redirect(
      localAppUrl("/dashboard/upgrade?error=checkout_failed", request),
    );
  }
}
