import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { normalizeCv } from "@/lib/cv-patch";
import AgentThread from "@/models/AgentThread";
import ReferenceCV from "@/models/ReferenceCV";
import TailoredCV from "@/models/TailoredCV";
import { connectDB } from "@/utils/connect";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();
    const threads = await AgentThread.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .select("title sourceLabel draftCvId createdAt updatedAt")
      .lean();

    return Response.json({ data: threads });
  } catch (error) {
    console.error("Agent threads GET error:", error);
    return Response.json({ error: "Failed to load threads" }, { status: 500 });
  }
}

// Starts a thread on a fresh copy of the chosen CV, so the source never changes.
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { sourceId } = await request.json();
    const userId = session.user.id;
    const fromTailored = Boolean(sourceId) && sourceId !== "reference";

    if (fromTailored && !mongoose.isValidObjectId(sourceId)) {
      return Response.json({ error: "Choose a CV to start from." }, { status: 400 });
    }

    await connectDB();
    const source = fromTailored
      ? await TailoredCV.findOne({ _id: sourceId, userId }).lean()
      : await ReferenceCV.findOne({ userId }).lean();

    if (!source) {
      return Response.json(
        { error: fromTailored ? "That CV no longer exists. Choose another one." : "Upload your CV first, then start a thread." },
        { status: 404 },
      );
    }

    const sourceLabel = fromTailored
      ? [source.jobTitle, source.jobCompany].filter(Boolean).join(" at ") || "Tailored CV"
      : "Main CV";

    const draft = await TailoredCV.create({
      userId,
      ...normalizeCv(source),
      jobTitle: `Agent draft: ${sourceLabel}`.slice(0, 200),
      jobCompany: source.jobCompany || "",
      jobUrl: source.jobUrl || "",
      jobData: source.jobData,
    });

    const thread = await AgentThread.create({ userId, draftCvId: draft._id, sourceLabel });

    return Response.json({ data: { _id: thread._id } }, { status: 201 });
  } catch (error) {
    console.error("Agent threads POST error:", error);
    return Response.json({ error: "Failed to start a thread" }, { status: 500 });
  }
}
