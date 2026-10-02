import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import TailoredCV from "@/models/TailoredCV";
import { requirePremium } from "@/lib/paywall";
import { httpUrl, tailoredForViewer } from "@/lib/tailored-preview";

const CONTENT_FIELDS = ["basics", "work", "education", "skills", "coverLetter", "whyThisRole"];

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();
  const cv = await TailoredCV.findOne({
    _id: id,
    userId: session.user.id,
  }).lean();

  if (!cv) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ data: tailoredForViewer(session, cv) });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const { id } = await params;

  try {
    const body = await request.json();

    // Free users only hold the preview, so saving it would wipe the full CV.
    if (CONTENT_FIELDS.some((field) => body[field] !== undefined)) {
      const paywallResponse = requirePremium(session);
      if (paywallResponse) return paywallResponse;
    }

    const update = {};
    for (const field of [...CONTENT_FIELDS, "jobTitle", "jobCompany"]) {
      if (body[field] !== undefined) update[field] = body[field];
    }
    if (body.jobUrl !== undefined) update.jobUrl = httpUrl(body.jobUrl);

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "There are no changes to save." }, { status: 400 });
    }

    await connectDB();
    const cv = await TailoredCV.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!cv) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ data: tailoredForViewer(session, cv) });
  } catch (error) {
    console.error("Tailored CV update error:", error);
    return Response.json({ error: "Couldn't save your tailored CV. Try again." }, { status: 500 });
  }
}
