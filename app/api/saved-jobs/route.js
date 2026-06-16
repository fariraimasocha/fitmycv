import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import JobDigestItem from "@/models/JobDigestItem";
import { connectDB } from "@/utils/connect";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywall = requirePremium(session);
  if (paywall) return paywall;

  try {
    await connectDB();
    const items = await JobDigestItem.find({ userId: session.user.id, saved: true })
      .sort({ savedAt: -1 })
      .lean();
    return Response.json({ data: items });
  } catch (error) {
    console.error("Saved jobs GET error:", error);
    return Response.json({ error: "Failed to fetch saved jobs" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywall = requirePremium(session);
  if (paywall) return paywall;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await JobDigestItem.updateOne(
      { _id: id, userId: session.user.id },
      { $set: { saved: false }, $unset: { savedAt: "" } }
    );
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Saved jobs DELETE error:", error);
    return Response.json({ error: "Failed to remove saved job" }, { status: 500 });
  }
}
