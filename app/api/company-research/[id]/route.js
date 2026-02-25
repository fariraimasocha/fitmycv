import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import CompanyResearch from "@/models/CompanyResearch";
import { connectDB } from "@/utils/connect";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { id } = await params;
    await connectDB();

    const brief = await CompanyResearch.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!brief) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ data: brief });
  } catch (error) {
    console.error("Company research GET [id] error:", error);
    return Response.json({ error: "Failed to fetch company research" }, { status: 500 });
  }
}
