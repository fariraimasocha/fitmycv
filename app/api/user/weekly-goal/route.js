import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import { getWeeklyProgress } from "@/lib/matches";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  return Response.json({ data: await getWeeklyProgress(session.user.id) });
}

export async function PUT(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { goal } = await request.json().catch(() => ({}));
  const value = Number.parseInt(goal, 10);
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    return Response.json({ error: "Pick a goal from 1 to 50." }, { status: 400 });
  }
  await connectDB();
  await User.updateOne({ _id: session.user.id }, { weeklyGoal: value });
  return Response.json({ data: await getWeeklyProgress(session.user.id) });
}
