export const meta = {
  slug: "cv-action-verbs-marketing",
  title: "28 CV Action Verbs for Marketing Roles",
  seoTitle: "28 CV Action Verbs for Marketing Roles",
  description:
    "Twenty-eight action verbs for marketing CVs — brand, growth, content, and demand generation — grouped by what they prove, with before/after bullet rewrites.",
  excerpt:
    "Marketing CVs drown in \"managed\" and \"created\". Twenty-eight verbs that show ownership and a number, grouped by discipline.",
  date: "2026-07-28",
  updated: "2026-07-28",
  readingTime: 5,
  category: "Action verbs",
  series: "action-verbs",
  tags: ["action verbs", "marketing", "resume", "bullets"],
  image: "/blog/cv-action-verbs-marketing.png",
  imageAlt: "Flat illustration of a CV document beside a geometric megaphone",
  keywords: [
    "cv action verbs marketing",
    "marketing resume action verbs",
    "resume synonyms for managed",
    "action words for marketing resume",
    "growth marketing resume verbs",
  ],
};

export const faqs = [
  {
    q: "What are the best action verbs for a marketing CV?",
    a: "Verbs that imply a measurable channel outcome: launched, scaled, positioned, segmented, converted, attributed, and reallocated. They work because each one implies a metric moved, which invites you to name it.",
  },
  {
    q: "How do I quantify marketing work that has no revenue attached?",
    a: "Use the metric your team was actually judged on — reach, engagement rate, cost per lead, pipeline sourced, share of voice, organic sessions, or time-to-publish. Brand and content roles have numbers; they are just not always revenue.",
  },
  {
    q: "Should a marketing CV mention specific tools?",
    a: "Yes, by name and inside a bullet rather than only in a skills list. HubSpot, Marketo, GA4, Ahrefs, and Figma are searched literally by recruiters, and naming the tool alongside the outcome proves you used it rather than sat near it.",
  },
];

export const blocks = [
  {
    p: "Marketing CVs have a particular failure mode: everything is *managed* or *created*, and nothing has a number attached. *Managed the social media channels* describes a hundred thousand people. It does not describe you.",
  },
  {
    p: "Strong verbs solve this by implying a metric. You cannot say *scaled* without an amount, or *reallocated* without a budget and a result.",
  },

  { h2: "28 verbs, grouped by discipline" },
  {
    table: {
      head: ["Discipline", "Verbs"],
      rows: [
        [
          "Brand and positioning",
          "Positioned, Repositioned, Defined, Unified, Refreshed, Articulated",
        ],
        [
          "Growth and acquisition",
          "Scaled, Acquired, Converted, Optimised, Tested, Reallocated",
        ],
        [
          "Content and SEO",
          "Published, Ranked, Commissioned, Repurposed, Consolidated, Audited",
        ],
        [
          "Demand generation",
          "Sourced, Nurtured, Qualified, Attributed, Segmented, Automated",
        ],
        [
          "Campaigns and launches",
          "Launched, Orchestrated, Produced, Sequenced",
        ],
      ],
    },
  },
  {
    callout: {
      title: "Every verb here wants a metric",
      body: "That is the point of choosing them. If you write \"scaled\" and cannot finish the sentence with a number, the bullet is not ready — either find the number or pick a more honest verb.",
    },
  },

  { h2: "Verbs to stop using" },
  {
    ul: [
      "**Managed** — the default marketing verb, and it says nothing about outcome. Use it only for people and budgets.",
      "**Created** — everything is created. Say what it did.",
      "**Assisted with** — hides your ownership entirely.",
      "**Handled** — vague and slightly defensive.",
      "**Responsible for** — restates your job title.",
    ],
  },

  { h2: "Before and after" },
  {
    compare: {
      title: "Content marketer",
      before:
        "Created blog content and managed the company's content calendar.",
      after:
        "• Rebuilt the content calendar around 14 bottom-of-funnel keywords, publishing 40 posts in 9 months; organic sessions grew 3.1x and organic sourced 22% of demo requests.",
    },
  },
  {
    compare: {
      title: "Performance marketer",
      before: "Managed paid ad campaigns across Google and Meta.",
      after:
        "• Reallocated £180k of annual paid spend from broad prospecting to three high-intent segments after a 6-week holdout test, cutting cost per qualified lead from £96 to £54.",
    },
  },

  { h2: "The pattern" },
  {
    p: "**Verb → the specific decision you made → the metric that moved.** The middle clause is what separates a marketer who ran campaigns from one who changed results. Name the channel, the budget, the segment, or the test.",
  },
  {
    p: "Which verbs lead should change with the posting. A demand-gen role wants *sourced*, *qualified*, and *attributed* near the top; a brand role wants *positioned* and *articulated*. Matching that emphasis is exactly what [tailoring a CV to the job description](/blog/how-to-tailor-cv-to-job-description) means in practice.",
  },
  {
    cta: {
      title: "Match your bullets to the role you want",
      body: "Paste the job link and FitMyCV reorders and rewrites your bullets around the outcomes that posting cares about.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
