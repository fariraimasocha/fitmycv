import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import TailoredCV from "@/models/TailoredCV";

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

  return Response.json({ data: cv });
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

    const update = {};
    if (body.basics !== undefined) update.basics = body.basics;
    if (body.work !== undefined) update.work = body.work;
    if (body.education !== undefined) update.education = body.education;
    if (body.skills !== undefined) update.skills = body.skills;
    if (body.coverLetter !== undefined) update.coverLetter = body.coverLetter;
    if (body.jobTitle !== undefined) update.jobTitle = body.jobTitle;
    if (body.jobCompany !== undefined) update.jobCompany = body.jobCompany;
    if (body.jobUrl !== undefined) update.jobUrl = body.jobUrl;

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
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

    return Response.json({ data: cv });
  } catch (error) {
    console.error("Tailored CV update error:", error);
    return Response.json({ error: "Failed to update tailored CV" }, { status: 500 });
  }
}
