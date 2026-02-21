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
    .select("jobTitle jobCompany jobUrl createdAt")
    .lean();

  return Response.json({ data: cvs });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { jobTitle, jobCompany, jobUrl, basics, work, education, skills, coverLetter } = body;

    await connectDB();
    const cv = await TailoredCV.create({
      userId: session.user.id,
      jobTitle,
      jobCompany,
      jobUrl,
      basics,
      work,
      education,
      skills,
      coverLetter,
    });

    return Response.json({ data: cv }, { status: 201 });
  } catch (error) {
    console.error("Tailored CV save error:", error);
    return Response.json({ error: "Failed to save tailored CV" }, { status: 500 });
  }
}
