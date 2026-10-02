import mongoose from "mongoose";
import { defineModel } from "@/utils/connect";

const leadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      required: true,
      default: "ats_checker",
    },
    country: {
      type: String,
      default: null,
    },
    score: {
      type: Number,
      default: null,
    },
    missingKeywordCount: {
      type: Number,
      default: null,
    },
    emailedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

leadSchema.index({ email: 1, source: 1 }, { unique: true });

export default defineModel("Lead", leadSchema);
