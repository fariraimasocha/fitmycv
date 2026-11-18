import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import Application from "@/models/Application";

const FOLLOW_UP_DAYS = 7;

// Marks the application behind a tailored CV as applied. Open to free users on
// purpose: it is one status change on their own row, and it feeds the weekly
// goal. The full board stays Pro.
export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connectDB();
    const application = await Application.findOne({ tailoredCVId: id, userId: session.user.id });
    if (!application) {
      return Response.json({ error: "This application no longer exists." }, { status: 404 });
    }
    // Only move forward from "saved". A row already past applied keeps its stage.
    if (application.status === "evaluated") {
      const now = new Date();
      application.status = "applied";
      application.appliedAt = now;
      application.followUpDate ??= new Date(now.getTime() + FOLLOW_UP_DAYS * 864e5);
      application.statusHistory.push({ status: "applied", date: now, note: "Marked as applied" });
      await application.save();
    }
    return Response.json({
      data: {
        status: application.status,
        appliedAt: application.appliedAt ?? null,
        followUpDate: application.followUpDate ?? null,
      },
    });
  } catch (error) {
    console.error("Mark applied error:", error);
    return Response.json({ error: "Couldn't mark this as applied. Try again." }, { status: 500 });
  }
}
