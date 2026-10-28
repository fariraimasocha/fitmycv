import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { LIFETIME_SPOTS, LIFETIME_SPOTS_SINCE } from "@/lib/pricing";

// Lifetime spots left at the current price. A lifetime buyer is a premium
// user with no Polar subscription, activated since the counter started.
// ponytail: one count per request, cached for a minute at the edge. Store the
// plan on the user if monthly buyers ever lose their subscription id.
export async function GET() {
  await connectDB();
  const sold = await User.countDocuments({
    isPremium: true,
    polarSubscriptionId: null,
    // An old monthly account can carry a status without an id. Not lifetime.
    polarSubscriptionStatus: null,
    premiumActivatedAt: { $gte: LIFETIME_SPOTS_SINCE },
  });
  return Response.json(
    { total: LIFETIME_SPOTS, left: Math.max(0, LIFETIME_SPOTS - sold) },
    { headers: { "Cache-Control": "public, s-maxage=60" } },
  );
}
