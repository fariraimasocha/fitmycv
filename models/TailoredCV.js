import mongoose from "mongoose";
import { defineModel } from "@/utils/connect";

const tailoredCVSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: String,
    jobCompany: String,
    jobUrl: String,
    // The scraped posting, kept so the answer writers on the saved CV page
    // have the requirements to work from.
    jobData: mongoose.Schema.Types.Mixed,
    basics: {
      name: String,
      label: String,
      email: String,
      phone: String,
      summary: String,
      location: String,
      profiles: [
        {
          network: String,
          url: String,
        },
      ],
    },
    work: [
      {
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String,
      },
    ],
    skills: [
      {
        category: String,
        skills: [String],
      },
    ],
    coverLetter: String,
    whyThisRole: String,
    // Set by the Polar webhook when a free user buys this one CV. It opens the
    // full CV and cover letter for this job only, never the rest of Pro.
    unlockedAt: Date,
    unlockOrderId: String,
  },
  { timestamps: true }
);

tailoredCVSchema.index({ userId: 1, createdAt: -1 });

export default defineModel("TailoredCV", tailoredCVSchema);
