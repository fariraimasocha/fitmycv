export const meta = {
  slug: "cv-action-verbs-tech",
  title: "30 CV Action Verbs for Tech and Engineering Roles",
  seoTitle: "30 CV Action Verbs for Tech & Engineering Roles",
  description:
    "Thirty action verbs for software engineering, data, and IT CVs, grouped by what they prove, with before/after rewrites and the weak verbs to drop.",
  excerpt:
    "\"Responsible for the backend\" tells a recruiter nothing. Thirty verbs that do, grouped by the thing each one proves.",
  date: "2026-07-28",
  updated: "2026-07-28",
  readingTime: 5,
  category: "Action verbs",
  series: "action-verbs",
  tags: ["action verbs", "tech", "resume", "bullets"],
  image: "/blog/cv-action-verbs-tech.png",
  imageAlt:
    "Flat illustration of a CV document beside an abstract code-bracket motif",
  keywords: [
    "cv action verbs tech",
    "resume action verbs software engineer",
    "resume synonyms for developed",
    "engineering resume verbs",
    "action words for tech resume",
  ],
};

export const faqs = [
  {
    q: "What are the best action verbs for a software engineer CV?",
    a: "Verbs that name a specific engineering outcome: architected, migrated, refactored, instrumented, optimised, automated, and shipped. They beat generic verbs because each one implies a particular kind of work a hiring manager can picture.",
  },
  {
    q: "Should every bullet on my tech CV start with a different verb?",
    a: "Vary them, but do not force it. Repeating the strongest verb once across a long CV is far better than reaching for an odd synonym. What you must avoid is ten consecutive bullets that all begin with \"developed\".",
  },
  {
    q: "Is it bad to write \"responsible for\" on a CV?",
    a: "Yes, because it describes the job you were given rather than what you did with it. Two people with identical responsibilities can have wildly different impact, and \"responsible for\" hides which one you were.",
  },
];

export const blocks = [
  {
    p: "Tech CVs fail in a specific way: the technology is all there, and the impact is nowhere. A bullet like *Responsible for the payments backend* tells a hiring manager your job title again, which they already read one line above.",
  },
  {
    p: "The fix is the verb. A strong verb forces the rest of the sentence to be concrete, because you cannot write *migrated* without naming what moved, from where, and what improved.",
  },

  { h2: "30 verbs, grouped by what they prove" },
  {
    table: {
      head: ["What you want to prove", "Verbs"],
      rows: [
        [
          "You designed the system",
          "Architected, Designed, Modelled, Specified, Prototyped, Scoped",
        ],
        [
          "You built and shipped it",
          "Built, Shipped, Implemented, Delivered, Launched, Integrated",
        ],
        [
          "You improved something existing",
          "Refactored, Optimised, Migrated, Consolidated, Hardened, Reduced",
        ],
        [
          "You made it observable or reliable",
          "Instrumented, Monitored, Diagnosed, Debugged, Stabilised, Recovered",
        ],
        [
          "You removed manual work",
          "Automated, Scripted, Streamlined, Templated, Orchestrated",
        ],
        [
          "You worked through other people",
          "Led, Mentored, Reviewed, Documented, Standardised, Onboarded",
        ],
      ],
    },
  },
  {
    callout: {
      title: "Pick the verb that only fits your work",
      body: "If a verb could describe any engineer on your team, it is too weak. \"Instrumented\" and \"migrated\" are strong precisely because they narrow what must have happened.",
    },
  },

  { h2: "Verbs to stop using" },
  {
    ul: [
      "**Responsible for:** describes the job description, not you.",
      "**Helped with / assisted:** erases your contribution. Name the part you owned.",
      "**Worked on:** the emptiest phrase in tech CVs.",
      "**Utilised:** say *used*, or better, say what it achieved.",
      "**Participated in:** attendance is not an achievement.",
    ],
  },

  { h2: "Before and after" },
  {
    compare: {
      title: "Backend engineer",
      before:
        "Responsible for improving the performance of our API and working on the database.",
      after:
        "• Profiled and optimised the 12 slowest API endpoints and added covering indexes, cutting p95 latency from 840ms to 210ms and removing the need for a planned read-replica.",
    },
  },
  {
    compare: {
      title: "Data engineer",
      before: "Helped with migrating our data pipelines to a new platform.",
      after:
        "• Migrated 60+ nightly pipelines from cron-scheduled scripts to dbt on Airflow, cutting the daily failure rate from 9% to under 1% and shortening the load window by 3 hours.",
    },
  },

  { h2: "The pattern" },
  {
    p: "Every strong tech bullet is the same shape: **verb → what you specifically did, with the technology named → the measurable result.** If you cannot attach a number, attach scope: request volume, dataset size, team size, number of services.",
  },
  {
    p: "Then make sure the verbs you choose reflect the posting you are applying to. A role that stresses reliability wants *instrumented* and *stabilised* near the top; a platform role wants *architected* and *migrated*. That is the tailoring step covered in [how to tailor your CV to a job description](/blog/how-to-tailor-cv-to-job-description).",
  },
  {
    cta: {
      title: "Get the right verbs in front of the right posting",
      body: "Paste the job link and FitMyCV rewrites your bullets using the vocabulary that specific role is asking for.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
