import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { connectDB } from "@/utils/connect";
import TailoredCV from "@/models/TailoredCV";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  const { id } = await params;

  await connectDB();
  const cv = await TailoredCV.findOne({
    _id: id,
    userId: session.user.id,
  }).lean();

  if (!cv) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ data: cv });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  const { id } = await params;

  await connectDB();
  const cv = await TailoredCV.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  });

  if (!cv) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  const { id } = await params;

  try {
    const body = await request.json();

    await connectDB();
    const cv = await TailoredCV.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!cv) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ data: cv });
  } catch (error) {
    console.error("Tailored CV update error:", error);
    return Response.json({ error: "Failed to update tailored CV" }, { status: 500 });
  }
}
