import mongoose from "mongoose";

const companyResearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    jobUrl: {
      type: String,
      default: "",
    },
    mission: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    teamSize: {
      type: String,
      default: "",
    },
    fundingStage: {
      type: String,
      default: "",
    },
    cultureSignals: [{ type: String }],
    recentNews: [
      {
        title: { type: String },
        url: { type: String },
        publishedAt: { type: String },
        snippet: { type: String },
      },
    ],
    techStrategy: {
      type: String,
      default: "",
    },
    challenges: [{ type: String }],
    competitors: [
      {
        name: { type: String },
        differentiation: { type: String },
      },
    ],
    positioningTips: [{ type: String }],
  },
  { timestamps: true }
);

companyResearchSchema.index({ userId: 1, createdAt: -1 });
companyResearchSchema.index({ userId: 1, jobUrl: 1 });

export default mongoose.models.CompanyResearch ||
  mongoose.model("CompanyResearch", companyResearchSchema);
