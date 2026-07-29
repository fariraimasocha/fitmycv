export const meta = {
  slug: "cv-action-verbs-finance",
  title: "26 CV Action Verbs for Finance and Accounting Roles",
  seoTitle: "26 CV Action Verbs for Finance & Accounting",
  description:
    "Twenty-six action verbs for finance, accounting, and FP&A CVs — grouped by what they prove, with before/after bullet rewrites and the weak verbs to drop.",
  excerpt:
    "Finance CVs are precise about numbers and vague about impact. Twenty-six verbs that fix the second half.",
  date: "2026-07-28",
  updated: "2026-07-28",
  readingTime: 5,
  category: "Action verbs",
  series: "action-verbs",
  tags: ["action verbs", "finance", "resume", "bullets"],
  image: "/blog/cv-action-verbs-finance.png",
  imageAlt:
    "Flat illustration of a CV document beside a rising bar chart and upward arrow",
  keywords: [
    "cv action verbs finance",
    "accounting resume action verbs",
    "fp&a resume verbs",
    "resume synonyms for prepared",
    "action words for finance resume",
  ],
};

export const faqs = [
  {
    q: "What are the best action verbs for a finance CV?",
    a: "Verbs that show judgement rather than process: forecast, modelled, reconciled, restructured, automated, negotiated, and advised. Finance CVs tend to over-index on preparing and reporting, which describes the task rather than the decision it enabled.",
  },
  {
    q: "How do I show impact in an accounting role that is mostly process?",
    a: "Quantify the process itself. Close cycle days, reconciliation backlog, audit adjustments, error rates, headcount supported, entity or ledger count, and value of transactions processed are all legitimate numbers that show scale and improvement.",
  },
  {
    q: "Should I list accounting standards and systems on my CV?",
    a: "Yes, and name them explicitly — IFRS, US GAAP, SOX, NetSuite, SAP, Oracle, Workday. Recruiters search these as literal strings, so a bullet that says \"under IFRS 16\" does double duty as evidence and as a keyword.",
  },
];

export const blocks = [
  {
    p: "Finance CVs are unusual: they are full of numbers and still fail to show impact. *Prepared monthly management accounts* is precise about the task and silent about whether anything got better because you were there.",
  },
  {
    p: "The verbs below push toward judgement — the decisions you made, the risk you removed, the time you gave back.",
  },

  { h2: "26 verbs, grouped by what they prove" },
  {
    table: {
      head: ["What you want to prove", "Verbs"],
      rows: [
        [
          "You analysed and advised",
          "Forecast, Modelled, Analysed, Advised, Evaluated, Benchmarked",
        ],
        [
          "You controlled and assured",
          "Reconciled, Audited, Validated, Substantiated, Remediated, Safeguarded",
        ],
        [
          "You improved the process",
          "Automated, Streamlined, Shortened, Standardised, Consolidated, Migrated",
        ],
        [
          "You moved the commercial outcome",
          "Negotiated, Restructured, Recovered, Reduced, Secured",
        ],
        [
          "You worked through others",
          "Partnered, Led, Trained, Presented",
        ],
      ],
    },
  },
  {
    callout: {
      title: "Numbers you already have",
      body: "Close days, variance percentage, audit adjustments, DSO, headcount supported, entity count, transaction value, hours saved per month. Finance roles have more available metrics than almost any other function — use them.",
    },
  },

  { h2: "Verbs to stop using" },
  {
    ul: [
      "**Prepared** — the default finance verb. Fine occasionally, but it describes production, not judgement.",
      "**Assisted with** — hides ownership on exactly the work you want credit for.",
      "**Responsible for** — restates the job title.",
      "**Involved in** — proximity is not contribution.",
      "**Handled** — vague where finance should be precise.",
    ],
  },

  { h2: "Before and after" },
  {
    compare: {
      title: "Financial accountant",
      before:
        "Responsible for preparing monthly management accounts and assisting with the year-end audit.",
      after:
        "• Shortened the monthly close from 11 to 6 working days by automating three intercompany reconciliations in NetSuite, and cleared the year-end audit with zero adjustments for two consecutive years.",
    },
  },
  {
    compare: {
      title: "FP&A analyst",
      before: "Built financial models and helped with the annual budget process.",
      after:
        "• Rebuilt the driver-based revenue model across 4 business units, cutting quarterly forecast variance from 14% to 5% and giving the exec team a rolling 12-month view for the first time.",
    },
  },

  { h2: "The pattern" },
  {
    p: "**Verb → the specific change you made, with the system or standard named → the number that improved.** In finance the number is rarely missing; what is missing is the decision that produced it.",
  },
  {
    p: "Which verbs lead should track the posting. A controllership role wants *reconciled*, *remediated*, and *substantiated*; an FP&A role wants *forecast*, *modelled*, and *advised*. See [how to tailor your CV to a job description](/blog/how-to-tailor-cv-to-job-description) for the reordering method.",
  },
  {
    cta: {
      title: "Lead with the verbs this role is asking for",
      body: "Paste the job link and FitMyCV rewrites your bullets around the responsibilities that posting actually names.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
