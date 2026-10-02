import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import { listTailoredCVs } from "@/lib/dashboard-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  return Response.json({ data: await listTailoredCVs(session.user.id) });
}
