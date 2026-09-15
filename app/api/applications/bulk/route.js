import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { STAGE_LABEL, pickApplicationFields } from "@/lib/applications";
import Application from "@/models/Application";
import { connectDB } from "@/utils/connect";

const MAX_IDS = 500;

// Bulk actions for the tracker table: move stage, add a tag, archive, delete.
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const body = await request.json();
    const ids = (Array.isArray(body.ids) ? body.ids : [])
      .filter((id) => mongoose.isValidObjectId(id))
      .slice(0, MAX_IDS);

    if (ids.length === 0) {
      return Response.json({ error: "Select at least one application." }, { status: 400 });
    }
    if (body.status && !STAGE_LABEL[body.status]) {
      return Response.json({ error: "Unknown stage" }, { status: 400 });
    }

    await connectDB();
    // Scoped to the signed-in user, so foreign ids simply match nothing.
    const scope = { _id: { $in: ids }, userId: session.user.id };

    if (body.delete === true) {
      const result = await Application.deleteMany(scope);
      return Response.json({ data: { deleted: result.deletedCount } });
    }

    if (body.status) {
      const now = new Date();
      await Application.updateMany(
        { ...scope, status: { $ne: body.status } },
        {
          $set: { status: body.status },
          $push: { statusHistory: { kind: "stage", status: body.status, date: now, note: "" } },
        }
      );
      if (body.status !== "evaluated") {
        await Application.updateMany({ ...scope, appliedAt: null }, { $set: { appliedAt: now } });
      }
    }

    const tags = Array.isArray(body.addTags) ? pickApplicationFields({ tags: body.addTags }).tags : [];
    if (tags.length > 0) {
      await Application.updateMany(scope, { $addToSet: { tags: { $each: tags } } });
    }

    if (typeof body.archived === "boolean") {
      await Application.updateMany(scope, { $set: { archived: body.archived } });
    }

    return Response.json({ data: { updated: ids.length } });
  } catch (error) {
    console.error("Applications bulk error:", error);
    return Response.json({ error: "Bulk update failed" }, { status: 500 });
  }
}
