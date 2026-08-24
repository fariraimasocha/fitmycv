import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import ReferenceCV from "@/models/ReferenceCV";
import { TEMPLATE_IDS } from "@/utils/cv-templates/metadata";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const cv = await ReferenceCV.findOne({ userId: session.user.id }).lean();

  if (!cv) {
    return Response.json({ data: null });
  }

  return Response.json({ data: cv });
}

export async function PUT(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { basics, work, education, skills, rawText } = body;

    await connectDB();
    const cv = await ReferenceCV.findOneAndUpdate(
      { userId: session.user.id },
      { basics, work, education, skills, rawText },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return Response.json({ data: cv });
  } catch (error) {
    console.error("Resume save error:", error);
    return Response.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { template } = await request.json();
    if (!TEMPLATE_IDS.includes(template)) {
      return Response.json({ error: "Unknown template" }, { status: 400 });
    }

    await connectDB();
    const cv = await ReferenceCV.findOneAndUpdate(
      { userId: session.user.id },
      { template },
      { new: true }
    ).lean();

    return Response.json({ data: cv });
  } catch (error) {
    console.error("Template save error:", error);
    return Response.json({ error: "Failed to save template" }, { status: 500 });
  }
}
