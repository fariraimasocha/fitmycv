import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
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
    companyResearchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyResearch",
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobCompany: {
      type: String,
      required: true,
    },
    jobUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "evaluated",
        "applied",
        "interviewing",
        "offer",
        "rejected",
        "withdrawn",
      ],
      default: "evaluated",
    },
    statusHistory: [
      {
        status: { type: String },
        date: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    followUpDate: {
      type: Date,
    },
    appliedAt: {
      type: Date,
    },
    matchScore: {
      type: Number,
    },
    matchGrade: {
      type: String,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
