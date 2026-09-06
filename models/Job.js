import mongoose from "mongoose";

// Shared pool of remote jobs crawled from company ATS pages (greenhouse, lever,
// ashby and friends). Unlike JobDigestItem these rows belong to nobody: one
// crawl, every user reads the same collection. Gating happens at read time in
// lib/job-crawler.js (publicJob), never here.
const jobSchema = new mongoose.Schema(
  {
    // Canonical ATS URL. The dedupe key across crawls.
    url: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    // Derived from the URL slug, not an LLM. see lib/job-crawler.js.
    company: {
      type: String,
      required: true,
    },
    companySlug: {
      type: String,
    },
    // Company logo URL from the ATS CDN, allowlisted in logoFromImage.
    logo: {
      type: String,
      default: null,
    },
    // "greenhouse" | "lever" | "ashby" | "workable" | "smartrecruiters"
    source: {
      type: String,
    },
    remote: {
      type: Boolean,
      default: true,
    },
    // Derived from the title at crawl time (deterministic, see categorise).
    category: {
      type: String,
      default: "Other",
    },
    // Extracted from the page text; null whenever the posting doesn't say.
    location: { type: String, default: null },
    salary: { type: String, default: null },
    employmentType: { type: String, default: null },
    snippet: {
      type: String,
    },
    // Only set when the source actually told us. null is common and honest.
    postedAt: {
      type: Date,
      default: null,
    },
    crawledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Doubles as the feed's sort index (a single-field btree serves both
// directions) and as the TTL that expires stale postings. no cleanup cron.
jobSchema.index({ crawledAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
// Backs the category filter, which is the one that actually narrows the list.
jobSchema.index({ category: 1, crawledAt: -1 });

export default mongoose.models.Job || mongoose.model("Job", jobSchema);
