import mongoose from "mongoose";

// One conversation with the CV agent. Messages are stored in the shape the
// model API expects, so each turn replays them as they are.
const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "tool"], required: true },
  content: { type: String, default: "" },
  // Assistant turns: tool calls exactly as the model returned them.
  toolCalls: { type: mongoose.Schema.Types.Mixed },
  // Tool turns: which call this answers.
  toolCallId: String,
  toolName: String,
  // Tool turns the chat renders as cards.
  proposalId: String,
  question: { type: mongoose.Schema.Types.Mixed },
  at: { type: Date, default: Date.now },
});

const proposalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, default: "" },
  operations: { type: mongoose.Schema.Types.Mixed, required: true },
  status: {
    type: String,
    enum: ["pending", "applied", "rejected", "reverted"],
    default: "pending",
  },
  // The draft as it was just before this change applied, for Restore.
  snapshot: { type: mongoose.Schema.Types.Mixed },
  appliedAt: Date,
  at: { type: Date, default: Date.now },
});

const agentThreadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "New thread" },
    // A TailoredCV copied from the source, so the original never changes.
    draftCvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TailoredCV",
      required: true,
    },
    sourceLabel: { type: String, default: "" },
    reviewEdits: { type: Boolean, default: true },
    messages: [messageSchema],
    proposals: [proposalSchema],
  },
  { timestamps: true }
);

agentThreadSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.AgentThread ||
  mongoose.model("AgentThread", agentThreadSchema);
