import mongoose from "mongoose";

const interviewPrepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tailoredCVId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TailoredCV",
    },
    jobTitle: String,
    jobCompany: String,
    stories: [
      {
        requirement: { type: String },
        situation: { type: String },
        task: { type: String },
        action: { type: String },
        result: { type: String },
        reflection: { type: String },
      },
    ],
    redFlagQA: [
      {
        question: { type: String },
        suggestedAnswer: { type: String },
      },
    ],
    talkingPoints: [{ type: String }],
  },
  { timestamps: true }
);

interviewPrepSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.InterviewPrep ||
  mongoose.model("InterviewPrep", interviewPrepSchema);
