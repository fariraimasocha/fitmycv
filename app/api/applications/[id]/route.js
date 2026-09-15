import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { STAGE_LABEL, pickApplicationFields } from "@/lib/applications";
import Application from "@/models/Application";
import TailoredCV from "@/models/TailoredCV";
import { connectDB } from "@/utils/connect";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();
    const { id } = await params;

    const application = await Application.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!application) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    return Response.json({ data: application });
  } catch (error) {
    console.error("Application GET error:", error);
    return Response.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// The stage entry that marks the current stage. It can't be deleted, or the
// timeline would stop explaining why the application sits where it does.
function currentStageEntry(application) {
  return [...application.statusHistory]
    .filter((entry) => (entry.kind ?? "stage") === "stage" && entry.status === application.status)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (body.status && !STAGE_LABEL[body.status]) {
      return Response.json({ error: "Unknown stage" }, { status: 400 });
    }

    const application = await Application.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!application) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    const fields = pickApplicationFields(body);
    // Company and role are required, so a blank value keeps the stored one.
    if (!fields.jobTitle) delete fields.jobTitle;
    if (!fields.jobCompany) delete fields.jobCompany;
    application.set(fields);

    if (body.tailoredCVId !== undefined) {
      if (!body.tailoredCVId) {
        application.tailoredCVId = undefined;
      } else {
        const owned =
          mongoose.isValidObjectId(body.tailoredCVId) &&
          (await TailoredCV.exists({ _id: body.tailoredCVId, userId: session.user.id }));
        if (!owned) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        application.tailoredCVId = body.tailoredCVId;
      }
    }

    // If status is changing, push to history
    if (body.status && body.status !== application.status) {
      application.statusHistory.push({
        kind: "stage",
        status: body.status,
        date: new Date(),
        note: typeof body.statusNote === "string" ? body.statusNote.slice(0, 500) : "",
      });
      application.status = body.status;

      if (body.status !== "evaluated" && !application.appliedAt) {
        application.appliedAt = new Date();
      }
    }

    const note = typeof body.addNote === "string" ? body.addNote.trim() : "";
    if (note) {
      application.statusHistory.push({ kind: "note", date: new Date(), note: note.slice(0, 2000) });
    }

    if (body.updateEntry && typeof body.updateEntry === "object") {
      const { entryId, date, text } = body.updateEntry;
      const entry = mongoose.isValidObjectId(entryId) ? application.statusHistory.id(entryId) : null;
      if (!entry) {
        return Response.json({ error: "Timeline entry not found" }, { status: 404 });
      }
      const parsed = date ? new Date(date) : null;
      if (parsed && !Number.isNaN(parsed.getTime())) entry.date = parsed;
      const trimmed = typeof text === "string" ? text.trim().slice(0, 2000) : "";
      if (trimmed && entry.kind === "note") entry.note = trimmed;
    }

    if (body.deleteEntry) {
      const entry = mongoose.isValidObjectId(body.deleteEntry) ? application.statusHistory.id(body.deleteEntry) : null;
      if (entry) {
        if (String(currentStageEntry(application)?._id) === String(entry._id)) {
          return Response.json({ error: "The current stage's entry can't be deleted." }, { status: 400 });
        }
        entry.deleteOne();
      }
    }

    if (body.followUpDate !== undefined) {
      const followUp = body.followUpDate ? new Date(body.followUpDate) : null;
      application.followUpDate = followUp && !Number.isNaN(followUp.getTime()) ? followUp : null;
    }

    await application.save();

    return Response.json({ data: application.toObject() });
  } catch (error) {
    console.error("Application PUT error:", error);
    return Response.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();
    const { id } = await params;

    const result = await Application.deleteOne({
      _id: id,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Application DELETE error:", error);
    return Response.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
