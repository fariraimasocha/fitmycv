import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import StoryBank from "@/models/StoryBank";
import { connectDB } from "@/utils/connect";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();
    const bank = await StoryBank.findOne({ userId: session.user.id }).lean();
    return Response.json({ data: bank?.stories || [] });
  } catch (error) {
    console.error("Story bank GET error:", error);
    return Response.json({ error: "Failed to fetch story bank" }, { status: 500 });
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
    const { story } = await request.json();

    if (!story || !story.title) {
      return Response.json({ error: "Story with title is required" }, { status: 400 });
    }

    const bank = await StoryBank.findOneAndUpdate(
      { userId: session.user.id },
      {
        $push: {
          stories: {
            title: story.title,
            situation: story.situation || "",
            task: story.task || "",
            action: story.action || "",
            result: story.result || "",
            reflection: story.reflection || "",
            tags: story.tags || [],
            usedFor: story.usedFor || [],
          },
        },
      },
      { new: true, upsert: true }
    ).lean();

    return Response.json({ data: bank.stories }, { status: 201 });
  } catch (error) {
    console.error("Story bank POST error:", error);
    return Response.json({ error: "Failed to save story" }, { status: 500 });
  }
}
