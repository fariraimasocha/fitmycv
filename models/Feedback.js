import mongoose from "mongoose";
import { defineModel } from "@/utils/connect";

const feedbackSchema = new mongoose.Schema(
  {
    userId:  { type: String, required: true },
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    type:    { type: String, enum: ["Bug", "Feature Request", "General"], default: "General" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default defineModel("Feedback", feedbackSchema);
