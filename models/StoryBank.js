import mongoose from "mongoose";

const storyBankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stories: [
      {
        title: { type: String },
        situation: { type: String },
        task: { type: String },
        action: { type: String },
        result: { type: String },
        reflection: { type: String },
        tags: [{ type: String }],
        usedFor: [
          {
            jobTitle: { type: String },
            company: { type: String },
            date: { type: Date },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

storyBankSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.StoryBank ||
  mongoose.model("StoryBank", storyBankSchema);
