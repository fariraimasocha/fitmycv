import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { applyProposal, restoreProposal, threadForClient } from "@/lib/agent";
import AgentThread from "@/models/AgentThread";
import TailoredCV from "@/models/TailoredCV";
import { connectDB } from "@/utils/connect";

const ACTIONS = ["apply", "reject", "restore"];

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  const { id, pid } = await params;
  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(pid)) {
    return Response.json({ error: "Change not found" }, { status: 404 });
  }

  try {
    const { action } = await request.json();
    if (!ACTIONS.includes(action)) {
      return Response.json({ error: "Unknown action" }, { status: 400 });
    }

    await connectDB();
    const userId = session.user.id;
    const thread = await AgentThread.findOne({ _id: id, userId });
    const proposal = thread?.proposals.id(pid);
    if (!proposal) {
      return Response.json({ error: "Change not found" }, { status: 404 });
    }
    const draft = await TailoredCV.findOne({ _id: thread.draftCvId, userId });
    if (!draft) {
      return Response.json(
        { error: "The draft CV for this thread was deleted. Start a new thread." },
        { status: 409 },
      );
    }

    if (action !== "restore" && proposal.status !== "pending") {
      return Response.json({ error: "This change was already handled." }, { status: 409 });
    }

    if (action === "apply") {
      try {
        applyProposal({ draft, proposal });
      } catch {
        // Positions shift when earlier changes land, so an old proposal can stop fitting.
        return Response.json(
          { error: "This change no longer fits the draft. Ask the agent to make it again." },
          { status: 409 },
        );
      }
    } else if (action === "reject") {
      proposal.status = "rejected";
    } else {
      try {
        restoreProposal({ thread, draft, proposal });
      } catch (error) {
        return Response.json({ error: error.message }, { status: 409 });
      }
    }

    await Promise.all([thread.save(), draft.save()]);

    return Response.json({ data: threadForClient(thread, draft) });
  } catch (error) {
    console.error("Agent proposal error:", error);
    return Response.json({ error: "Failed to update the change" }, { status: 500 });
  }
}
