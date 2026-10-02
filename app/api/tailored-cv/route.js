import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import TailoredCV from "@/models/TailoredCV";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const cvs = await TailoredCV.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .select("jobTitle jobCompany jobUrl createdAt coverLetter")
    .lean();

  return Response.json({
    data: cvs.map(({ coverLetter, ...cv }) => ({
      ...cv,
      hasCoverLetter: Boolean(coverLetter && String(coverLetter).trim()),
    })),
  });
}
