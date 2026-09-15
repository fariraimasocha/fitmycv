import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { STAGE_LABEL, pickApplicationFields } from "@/lib/applications";
import Application from "@/models/Application";
import TailoredCV from "@/models/TailoredCV";
import CompanyResearch from "@/models/CompanyResearch";
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
    const archived = searchParams.get("archived");

    const query = { userId: session.user.id };
    // "all" lets the tracker filter archived rows on the client. Rows created
    // before archiving existed have no flag, hence $ne.
    if (archived === "true") query.archived = true;
    else if (archived !== "all") query.archived = { $ne: true };
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
    const fields = pickApplicationFields(body);

    if (!fields.jobTitle || !fields.jobCompany) {
      return Response.json({ error: "Add a company and a role." }, { status: 400 });
    }

    if (body.tailoredCVId) {
      const ownedCv = await TailoredCV.findOne({
        _id: body.tailoredCVId,
        userId: session.user.id,
      }).select("_id");
      if (!ownedCv) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (body.companyResearchId) {
      const ownedBrief = await CompanyResearch.findOne({
        _id: body.companyResearchId,
        userId: session.user.id,
      }).select("_id");
      if (!ownedBrief) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const status = STAGE_LABEL[body.status] ? body.status : "evaluated";
    const entered = body.stageEnteredAt ? new Date(body.stageEnteredAt) : new Date();
    const stageDate = Number.isNaN(entered.getTime()) ? new Date() : entered;
    const followUp = body.followUpDate ? new Date(body.followUpDate) : null;

    const application = await Application.create({
      ...fields,
      userId: session.user.id,
      tailoredCVId: body.tailoredCVId || undefined,
      companyResearchId: body.companyResearchId || undefined,
      status,
      statusHistory: [
        { kind: "stage", status, date: stageDate, note: body.tailoredCVId && !body.stageEnteredAt ? "CV tailored" : "" },
      ],
      appliedAt: status === "evaluated" ? undefined : stageDate,
      followUpDate: followUp && !Number.isNaN(followUp.getTime()) ? followUp : undefined,
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
