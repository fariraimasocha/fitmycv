import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { appUrl } from "@/lib/site";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

function localAppUrl(path, request) {
  return process.env.NODE_ENV === "production"
    ? appUrl(path)
    : new URL(path, request.url);
}

async function createCustomerPortalSession(user, returnUrl) {
  if (user.polarCustomerId) {
    try {
      return await polar.customerSessions.create({
        customerId: user.polarCustomerId,
        returnUrl,
      });
    } catch {
      console.warn(
        `Stored Polar customer ID failed for user ${user._id}; attempting recovery.`,
      );
    }
  }

  try {
    return await polar.customerSessions.create({
      externalCustomerId: String(user._id),
      returnUrl,
    });
  } catch {
    const customers = await polar.customers.list({
      email: user.email,
      limit: 1,
    });
    const customer = customers.result.items[0];

    if (!customer) {
      throw new Error(`No Polar customer found for user ${user._id}`);
    }

    if (customer.id !== user.polarCustomerId) {
      await User.updateOne(
        { _id: user._id },
        { $set: { polarCustomerId: customer.id } },
      );
    }

    return polar.customerSessions.create({
      customerId: customer.id,
      returnUrl,
    });
  }
}

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.redirect(localAppUrl("/auth", request));
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select(
      "email polarCustomerId isPremium",
    );

    if (!user?.isPremium) {
      return NextResponse.redirect(localAppUrl("/dashboard/upgrade", request));
    }

    const customerSession = await createCustomerPortalSession(
      user,
      localAppUrl("/dashboard/profile", request).toString(),
    );

    return NextResponse.redirect(customerSession.customerPortalUrl);
  } catch (error) {
    console.error("Polar portal error:", error);
    return NextResponse.redirect(
      localAppUrl("/dashboard/profile?error=portal_failed", request),
    );
  }
}
