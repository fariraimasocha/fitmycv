import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    {
      _id: session.user.id,
      "purchaseAnalyticsPending.orderId": { $ne: null },
    },
    { $unset: { purchaseAnalyticsPending: 1 } },
  ).select("purchaseAnalyticsPending");

  const pending = user?.purchaseAnalyticsPending;
  if (!pending?.orderId) {
    return Response.json({ pending: false });
  }

  return Response.json({
    pending: true,
    orderId: pending.orderId,
    plan: pending.plan || "lifetime",
  });
}
