import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    polarCustomerId: {
      type: String,
      default: null,
    },
    premiumActivatedAt: {
      type: Date,
      default: null,
    },
    polarSubscriptionId: {
      type: String,
      default: null,
    },
    polarSubscriptionStatus: {
      type: String,
      enum: [null, "incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid"],
      default: null,
    },
    subscriptionCurrentPeriodEnd: {
      type: Date,
      default: null,
    },
    subscriptionCanceledAt: {
      type: Date,
      default: null,
    },
    premiumRevokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
