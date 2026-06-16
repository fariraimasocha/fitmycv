import mongoose from "mongoose";

// One row per job we email a user. Powers two things at once:
//   - dedup: the cron skips jobIds already sent to this user recently
//   - saved jobs: the email "Save" link flips `saved` on the matching row
// ponytail: no TTL/cleanup yet — ~10 rows/user/day. Add a sentAt TTL on
// unsaved rows when the collection gets big.
const jobDigestItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    // Snapshot of the JSearch job — JSearch results expire, so we keep our own.
    job: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    saved: {
      type: Boolean,
      default: false,
    },
    savedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

jobDigestItemSchema.index({ userId: 1, jobId: 1 }, { unique: true });
jobDigestItemSchema.index({ userId: 1, saved: 1, savedAt: -1 });
jobDigestItemSchema.index({ userId: 1, sentAt: -1 });

export default mongoose.models.JobDigestItem ||
  mongoose.model("JobDigestItem", jobDigestItemSchema);
