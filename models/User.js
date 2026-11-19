import mongoose from "mongoose";
import { defineModel } from "@/utils/connect";

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
    // false for new sign-ups; undefined on legacy users skips onboarding
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    // Captured in onboarding; labels are stored verbatim and fed to the
    // tailoring prompt. Null for users who skipped and for legacy users.
    onboarding: {
      goal: { type: String, default: null },
      stage: { type: String, default: null },
      blocker: { type: String, default: null },
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
      enum: [
        null,
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
      ],
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
    // Opt-out for one-off product announcements. Separate from
    // jobPreferences.emailDigest, which only governs the daily digest and sits
    // behind a premium-gated settings page. Queries use $ne:false so legacy
    // users with no value stay in.
    marketingEmails: {
      type: Boolean,
      default: true,
    },
    // Stamped once the job board announcement is sent, so a re-run of
    // scripts/send-announcement.mjs resumes instead of mailing anyone twice.
    jobBoardAnnouncedAt: {
      type: Date,
      default: null,
    },
    // Next signup nurture email to send (lib/nurture-email.js), 6 = done.
    // No default on purpose: legacy users have no value and never enter it.
    nurtureStep: {
      type: Number,
    },
    // Last Polar checkout this user opened, for the one reminder the nurture
    // cron sends if they have not paid 2 hours later. A new checkout clears
    // checkoutReminderSentAt, so each attempt can earn one reminder.
    checkoutStartedAt: { type: Date },
    checkoutPlan: { type: String },
    checkoutCvId: { type: mongoose.Schema.Types.ObjectId, ref: "TailoredCV" },
    checkoutReminderSentAt: { type: Date },
    // Creator code from the `ref` cookie set by /r/<code>, saved at signup.
    referredBy: { type: String, index: true },
    // The one "your CV is saved" email after a paywall with no checkout.
    paywallReminderSentAt: { type: Date },
    // Drives the daily job digest. Defaults are opt-in; an existing user with
    // no jobPreferences is treated as emailDigest:true / remoteOnly:true.
    // Weekly applications goal shown on the dashboard home. No streaks: a
    // missed week just resets.
    weeklyGoal: { type: Number, default: 5, min: 1, max: 50 },
    // Bumped by the dashboard home at most every 12 hours. previousActiveAt
    // keeps the visit before, so "New since your last visit" survives the bump.
    lastActiveAt: { type: Date, default: null },
    previousActiveAt: { type: Date, default: null },
    // Last weekly match email to a free user. Guards a retried cron run.
    weeklyMatchesSentAt: { type: Date, default: null },
    jobPreferences: {
      titles: { type: [String], default: [] }, // overrides CV-derived queries
      country: { type: String, default: "us" }, // ISO-2; JSearch market to search
      remoteOnly: { type: Boolean, default: true },
      emailDigest: { type: Boolean, default: true }, // the real unsubscribe toggle
    },
  },
  { timestamps: true },
);

export default defineModel("User", userSchema);
