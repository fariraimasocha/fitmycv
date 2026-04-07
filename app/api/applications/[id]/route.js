import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import Application from "@/models/Application";
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

    const application = await Application.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!application) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    // If status is changing, push to history
    if (body.status && body.status !== application.status) {
      application.statusHistory.push({
        status: body.status,
        date: new Date(),
        note: body.statusNote || "",
      });
      application.status = body.status;

      if (body.status === "applied" && !application.appliedAt) {
        application.appliedAt = new Date();
      }
    }

    if (body.notes !== undefined) application.notes = body.notes;
    if (body.followUpDate !== undefined) {
      application.followUpDate = body.followUpDate ? new Date(body.followUpDate) : null;
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
