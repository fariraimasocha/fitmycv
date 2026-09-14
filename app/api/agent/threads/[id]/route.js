import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { threadForClient } from "@/lib/agent";
import AgentThread from "@/models/AgentThread";
import TailoredCV from "@/models/TailoredCV";
import { connectDB } from "@/utils/connect";

async function guard(params) {
  const session = await auth();
  if (!session?.user?.id) {
    return { response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const paywallResponse = requirePremium(session);
  if (paywallResponse) return { response: paywallResponse };

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return { response: Response.json({ error: "Thread not found" }, { status: 404 }) };
  }
  return { id, userId: session.user.id };
}

export async function GET(request, { params }) {
  const { response, id, userId } = await guard(params);
  if (response) return response;

  try {
    await connectDB();
    const thread = await AgentThread.findOne({ _id: id, userId }).lean();
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }
    const draft = await TailoredCV.findOne({ _id: thread.draftCvId, userId }).lean();

    return Response.json({ data: threadForClient(thread, draft) });
  } catch (error) {
    console.error("Agent thread GET error:", error);
    return Response.json({ error: "Failed to load the thread" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { response, id, userId } = await guard(params);
  if (response) return response;

  try {
    const { reviewEdits } = await request.json();
    if (typeof reviewEdits !== "boolean") {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await connectDB();
    const result = await AgentThread.updateOne({ _id: id, userId }, { $set: { reviewEdits } });
    if (result.matchedCount === 0) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    return Response.json({ data: { reviewEdits } });
  } catch (error) {
    console.error("Agent thread PATCH error:", error);
    return Response.json({ error: "Failed to update the thread" }, { status: 500 });
  }
}

// Deletes the conversation only. The draft stays in Tailored CVs.
export async function DELETE(request, { params }) {
  const { response, id, userId } = await guard(params);
  if (response) return response;

  try {
    await connectDB();
    const result = await AgentThread.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }
    return Response.json({ data: { deleted: true } });
  } catch (error) {
    console.error("Agent thread DELETE error:", error);
    return Response.json({ error: "Failed to delete the thread" }, { status: 500 });
  }
}
