import mongoose from "mongoose";
import { defineModel } from "@/utils/connect";

// One EcoCash payment through Pesepay. Only Zimbabwe visitors can start one.
const ecocashPaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["lifetime", "single"], required: true },
    tailoredCvId: { type: mongoose.Schema.Types.ObjectId, ref: "TailoredCV", default: null },
    amount: { type: Number, required: true },
    phone: { type: String, required: true },
    referenceNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    providerStatus: String,
    paidAt: Date,
  },
  { timestamps: true },
);

ecocashPaymentSchema.index({ userId: 1, status: 1 });

export default defineModel("EcocashPayment", ecocashPaymentSchema);
