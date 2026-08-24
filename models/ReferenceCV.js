import mongoose from "mongoose";

const referenceCVSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
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
    rawText: String,
    template: { type: String, default: "classic" },
  },
  { timestamps: true }
);

export default mongoose.models.ReferenceCV ||
  mongoose.model("ReferenceCV", referenceCVSchema);
