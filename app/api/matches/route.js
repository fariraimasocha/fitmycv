import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { getTopMatches } from "@/lib/matches";

// Jobs from the crawled pool that fit the user's main CV. Free viewers get the
// same lock as the jobs board: role and fit, no company or apply link.
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const n = Math.min(10, Math.max(1, Number.parseInt(searchParams.get("n") ?? "3", 10) || 3));
  const exclude = searchParams.getAll("exclude");

  try {
    await connectDB();
    const user = await User.findById(session.user.id).select("previousActiveAt").lean();
    const data = await getTopMatches({
      userId: session.user.id,
      isPremium: Boolean(session.user.isPremium),
      n,
      exclude,
      since: user?.previousActiveAt ?? null,
    });
    return Response.json({ data });
  } catch (error) {
    console.error("Matches GET error:", error);
    return Response.json({ error: "Couldn't load matching jobs. Refresh the page." }, { status: 500 });
  }
}
