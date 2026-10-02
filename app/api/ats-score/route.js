import { auth } from "@/lib/auth";
import { atsReport } from "@/lib/ats/score";

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tailoredCV, jobData } = await request.json();

    if (!tailoredCV || typeof tailoredCV !== "object") {
      return Response.json({ error: "Add your CV first, then try again." }, { status: 400 });
    }

    return Response.json({ data: atsReport(tailoredCV, jobData) });
  } catch (error) {
    console.error("ATS score error:", error);
    return Response.json({ error: "Couldn't check your CV. Try again." }, { status: 500 });
  }
}
