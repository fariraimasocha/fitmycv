import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import Application from "@/models/Application";
import { connectDB } from "@/utils/connect";

export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = { userId: session.user.id };
    if (status && status !== "all") {
      query.status = status;
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ data: applications });
  } catch (error) {
    console.error("Applications GET error:", error);
    return Response.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();

    const body = await request.json();

    const application = await Application.create({
      userId: session.user.id,
      tailoredCVId: body.tailoredCVId || undefined,
      companyResearchId: body.companyResearchId || undefined,
      jobTitle: body.jobTitle || "",
      jobCompany: body.jobCompany || "",
      jobUrl: body.jobUrl || "",
      status: "evaluated",
      statusHistory: [{ status: "evaluated", date: new Date(), note: "CV tailored" }],
      matchScore: body.matchScore || undefined,
      matchGrade: body.matchGrade || undefined,
    });

    return Response.json({ data: application.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Applications POST error:", error);
    return Response.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
