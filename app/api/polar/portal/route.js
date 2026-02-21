import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";
import User from "@/models/User";
import dbConnect from "@/lib/db";

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

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user?.polarCustomerId) {
      return NextResponse.redirect(new URL("/api/polar/checkout", request.url));
    }

    const customerSession = await polar.customerSessions.create({
      customerId: user.polarCustomerId,
    });

    return NextResponse.redirect(customerSession.customerPortalUrl);
  } catch (error) {
    console.error("Polar portal error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/profile?error=portal_failed", request.url)
    );
  }
}
