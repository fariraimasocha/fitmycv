import mongoose from "mongoose";

// Stage changes and notes share one timeline. Rows written before notes
// existed have no kind and read as stage changes. "kind", not "type": type is
// reserved in mongoose schema definitions.
const timelineEntrySchema = new mongoose.Schema({
  kind: { type: String, enum: ["stage", "note"], default: "stage" },
  status: { type: String },
  date: { type: Date, default: Date.now },
  note: { type: String, default: "" },
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  // Free text shown as a label: Recruiter, Referral, Hiring manager.
  kind: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
});

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
    // Keys predate the current stage names. lib/applications.js labels
    // "evaluated" as Saved and "interviewing" as Interview.
    status: {
      type: String,
      enum: [
        "evaluated",
        "applied",
        "screening",
        "interviewing",
        "offer",
        "rejected",
        "withdrawn",
      ],
      default: "evaluated",
    },
    statusHistory: [timelineEntrySchema],
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
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    source: { type: String, default: "" },
    tags: { type: [String], default: [] },
    jobDescription: { type: String, default: "" },
    contacts: [contactSchema],
    // Hidden from the board without losing the record or its history.
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
