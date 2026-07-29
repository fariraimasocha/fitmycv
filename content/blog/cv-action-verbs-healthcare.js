export const meta = {
  slug: "cv-action-verbs-healthcare",
  title: "27 CV Action Verbs for Healthcare and Nursing Roles",
  seoTitle: "27 CV Action Verbs for Healthcare & Nursing",
  description:
    "Twenty-seven action verbs for healthcare, nursing, and allied health CVs — grouped by clinical, coordination, and quality work, with before/after bullet rewrites.",
  excerpt:
    "Clinical CVs undersell constantly. Twenty-seven verbs that show caseload, judgement, and outcomes without overclaiming.",
  date: "2026-07-28",
  updated: "2026-07-28",
  readingTime: 5,
  category: "Action verbs",
  series: "action-verbs",
  tags: ["action verbs", "healthcare", "resume", "bullets"],
  image: "/blog/cv-action-verbs-healthcare.png",
  imageAlt:
    "Flat illustration of a CV document beside a heartbeat line and a plus cross",
  keywords: [
    "cv action verbs healthcare",
    "nursing resume action verbs",
    "clinical resume verbs",
    "resume synonyms for provided care",
    "action words for healthcare resume",
  ],
};

export const faqs = [
  {
    q: "What are the best action verbs for a nursing CV?",
    a: "Verbs that show clinical judgement and coordination: assessed, triaged, escalated, coordinated, administered, educated, and documented. They are more informative than \"provided care\", which is true of every clinician on the rota.",
  },
  {
    q: "How do I quantify a clinical role on my CV?",
    a: "Use caseload and setting: patients per shift, bed or ward size, acuity level, clinic throughput, wait-time reduction, audit compliance percentage, incident rate, and number of staff precepted. These show scale without touching patient confidentiality.",
  },
  {
    q: "Should I list registrations and certifications on a healthcare CV?",
    a: "Always, near the top and by their exact name — NMC PIN, RN, BLS, ALS, PALS, revalidation date, specialist competencies. These are hard filters for recruiters and are searched as literal strings.",
  },
];

export const blocks = [
  {
    p: "Healthcare CVs undersell more than any other category. *Provided high-quality patient care* is true of everyone on the rota, so it distinguishes nobody — and clinicians are trained to describe work in exactly that collective, modest register.",
  },
  {
    p: "The verbs below let you be specific about judgement and scale without overclaiming or breaching confidentiality.",
  },

  { h2: "27 verbs, grouped by the kind of work" },
  {
    table: {
      head: ["Kind of work", "Verbs"],
      rows: [
        [
          "Direct clinical care",
          "Assessed, Triaged, Administered, Monitored, Stabilised, Managed",
        ],
        [
          "Judgement and escalation",
          "Escalated, Prioritised, Diagnosed, Interpreted, Advocated",
        ],
        [
          "Coordination",
          "Coordinated, Liaised, Handed over, Scheduled, Referred, Discharged",
        ],
        [
          "Quality and safety",
          "Audited, Reduced, Standardised, Implemented, Investigated, Reported",
        ],
        [
          "Teaching and supervision",
          "Precepted, Mentored, Trained, Educated, Supervised, Inducted",
        ],
      ],
    },
  },
  {
    callout: {
      title: "Scale without identifying anyone",
      body: "Caseload, bed count, acuity, shift pattern, clinic volume, and audit percentages describe your scope entirely at the service level. No patient detail is ever needed to prove you worked at scale.",
    },
  },

  { h2: "Verbs to stop using" },
  {
    ul: [
      "**Provided care** — accurate and completely undifferentiating.",
      "**Assisted with** — clinicians overuse this for work they actually led.",
      "**Responsible for** — restates the band and the job title.",
      "**Involved in** — hides your role in an improvement project.",
      "**Duties included** — a job description, not an achievement.",
    ],
  },

  { h2: "Before and after" },
  {
    compare: {
      title: "Ward nurse",
      before:
        "Responsible for providing care to patients on a busy surgical ward and assisting with admissions.",
      after:
        "• Managed a caseload of 8–10 post-operative patients per shift on a 28-bed surgical ward, triaging deteriorating patients using NEWS2 and escalating 40+ cases to the outreach team over 12 months.",
    },
  },
  {
    compare: {
      title: "Allied health / quality improvement",
      before: "Involved in a project to improve discharge processes.",
      after:
        "• Led a discharge-planning audit across 3 wards, standardised the handover template with pharmacy, and cut average discharge delay from 5.2 to 3.1 hours across a 6-month cycle.",
    },
  },

  { h2: "The pattern" },
  {
    p: "**Verb → the specific clinical or service action, with the setting and tool named → the caseload, compliance figure, or time saved.** Naming the scoring system, protocol, or pathway you used is what turns a modest sentence into evidence.",
  },
  {
    p: "Which verbs lead should follow the posting. A quality-improvement role wants *audited*, *standardised*, and *reduced* at the top; a ward role wants *triaged*, *escalated*, and *precepted*. That reordering is the core of [tailoring a CV to a job description](/blog/how-to-tailor-cv-to-job-description).",
  },
  {
    cta: {
      title: "Put the right competencies first",
      body: "Paste the job link and FitMyCV reorders your CV around the competencies and pathways that posting names.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
