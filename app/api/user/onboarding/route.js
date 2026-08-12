import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select(
    "onboardingCompleted",
  );

  // Legacy users without the field are treated as onboarded
  const completed = user?.onboardingCompleted !== false;

  return NextResponse.json({ completed });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, {
    onboardingCompleted: true,
  });

  return NextResponse.json({ completed: true });
}
