import { NextResponse } from "next/server";

export function requirePremium(session) {
  if (!session?.user?.isPremium) {
    return NextResponse.json(
      { error: "This needs Pro. Upgrade to use it.", code: "PREMIUM_REQUIRED", upgradeUrl: "/dashboard/upgrade" },
      { status: 402 }
    );
  }
  return null;
}
