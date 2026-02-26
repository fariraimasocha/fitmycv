import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ isPremium: false }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).select("isPremium").lean();
  return Response.json({ isPremium: !!user?.isPremium });
}
