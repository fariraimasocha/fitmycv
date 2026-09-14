import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { runAgentTurn, threadForClient } from "@/lib/agent";
import AgentThread from "@/models/AgentThread";
import TailoredCV from "@/models/TailoredCV";
import { connectDB } from "@/utils/connect";

// A turn can take several model calls plus a job page crawl.
export const maxDuration = 120;

const MAX_MESSAGE_CHARS = 8000;

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: "Thread not found" }, { status: 404 });
  }

  try {
    const { text } = await request.json();
    const userText = typeof text === "string" ? text.trim().slice(0, MAX_MESSAGE_CHARS) : "";
    if (!userText) {
      return Response.json({ error: "Write a message first." }, { status: 400 });
    }

    await connectDB();
    const userId = session.user.id;
    const thread = await AgentThread.findOne({ _id: id, userId });
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }
    const draft = await TailoredCV.findOne({ _id: thread.draftCvId, userId });
    if (!draft) {
      return Response.json(
        { error: "The draft CV for this thread was deleted. Start a new thread." },
        { status: 409 },
      );
    }

    if (thread.title === "New thread") thread.title = userText.slice(0, 60);

    try {
      await runAgentTurn({ thread, draft, userText });
    } catch (error) {
      // Tool errors are handled inside the loop, so this is the model call
      // failing. Keep the user's message and say so in the chat.
      console.error("Agent turn error:", error);
      thread.messages.push({
        role: "assistant",
        content: "I couldn't reach the model just now. Send your message again in a moment.",
        toolCalls: [],
      });
    }

    await Promise.all([thread.save(), draft.save()]);

    return Response.json({ data: threadForClient(thread, draft) });
  } catch (error) {
    console.error("Agent message error:", error);
    return Response.json({ error: "Failed to send the message" }, { status: 500 });
  }
}
