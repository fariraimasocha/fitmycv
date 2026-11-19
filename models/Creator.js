import mongoose from "mongoose";
import { defineModel } from "@/utils/connect";

// A UGC creator's share link (/r/<code>) and private stats page
// (/creator/<statsToken>). Signups are counted live from User.referredBy.
const creatorSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    statsToken: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default defineModel("Creator", creatorSchema);
