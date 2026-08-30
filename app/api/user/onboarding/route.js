import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";

const ANSWER_KEYS = ["goal", "stage", "blocker"];
const MAX_ANSWER_LENGTH = 120;

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

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The skip path and the retry send no body at all — that must keep working.
  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const update = { onboardingCompleted: true };
  for (const key of ANSWER_KEYS) {
    const value = body?.[key];
    if (typeof value === "string" && value.trim()) {
      update[`onboarding.${key}`] = value.trim().slice(0, MAX_ANSWER_LENGTH);
    }
  }

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, update);

  return NextResponse.json({ completed: true });
}
