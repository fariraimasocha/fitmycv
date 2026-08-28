// Job-specific resume examples. Each entry renders a page at
// /resume-examples/<slug> with a worked summary, rewritten bullets, a skills
// block, and the keywords that role's postings actually lean on.

export const RESUME_EXAMPLES = [
  {
    slug: "software-engineer",
    role: "Software Engineer",
    seniority: "Mid to senior",
    blurb:
      "Backend, frontend, and full-stack engineers, and how to show system ownership rather than a list of technologies.",
    intro:
      "Software engineering CVs fail in a predictable way: the stack is exhaustively documented and the impact is missing. A recruiter can see you have used Kubernetes; they cannot see whether you kept a cluster alive under load or attended a talk about it. The example below leads with ownership and consequence, and lets the technology sit inside the evidence rather than in a wall of logos.",
    summary:
      "Senior Backend Engineer, 7 years building payment and billing systems in Go and Python. Led the migration of a monolith's billing path to three services handling 4k req/s at p95 210ms. Comfortable owning a service end to end: design, on-call, and the postmortem.",
    bullets: [
      {
        before: "Worked on improving the performance of our main API.",
        after:
          "Profiled and optimised the 12 slowest endpoints and added covering indexes, cutting p95 latency from 840ms to 210ms and removing a planned read-replica from the roadmap.",
      },
      {
        before: "Responsible for the payments service and helping the team.",
        after:
          "Owned the payments service through a 4x traffic increase, introducing idempotency keys and a retry ledger that reduced duplicate-charge incidents from 11 per quarter to zero.",
      },
      {
        before: "Helped migrate our infrastructure to Kubernetes.",
        after:
          "Migrated 22 services from EC2 to EKS with zero customer-visible downtime, cutting deploy time from 26 to 4 minutes and infrastructure spend by 31%.",
      },
    ],
    skills: [
      "Languages: Go, Python, TypeScript, SQL",
      "Infrastructure: AWS, Kubernetes, Terraform, PostgreSQL, Kafka",
      "Practice: distributed systems, observability, on-call, code review, mentoring",
    ],
    keywords: [
      "backend engineer",
      "distributed systems",
      "microservices",
      "CI/CD",
      "observability",
      "on-call",
      "system design",
    ],
    tip: "Name the constraint you worked under. \"Zero customer-visible downtime\" and \"under a 4x traffic increase\" are what separate an engineer who did a migration from one who did a hard migration.",
  },
  {
    slug: "marketing-manager",
    role: "Marketing Manager",
    seniority: "Mid to senior",
    blurb:
      "Brand, growth, and demand generation, replacing \"managed\" with a decision and a metric.",
    intro:
      "Marketing CVs drown in *managed* and *created*, and almost none of them attach a number. The fix is not more adjectives. It is naming the decision you made and the metric that moved because of it. Even brand and content roles have numbers; they are simply not always revenue.",
    summary:
      "Marketing Manager, 6 years in B2B SaaS, focused on organic acquisition and lifecycle. Took content from 4k to 61k monthly organic sessions in 18 months and sourced 22% of pipeline from it. Runs a team of four across content, SEO, and email.",
    bullets: [
      {
        before: "Managed the company blog and social media channels.",
        after:
          "Rebuilt the content calendar around 14 bottom-of-funnel keywords, publishing 40 posts in 9 months; organic sessions grew 3.1x and organic sourced 22% of demo requests.",
      },
      {
        before: "Ran paid campaigns across Google and Meta.",
        after:
          "Reallocated £180k of annual paid spend from broad prospecting to three high-intent segments after a 6-week holdout test, cutting cost per qualified lead from £96 to £54.",
      },
      {
        before: "Worked on improving our email marketing.",
        after:
          "Segmented a 90k-contact list by product usage and rebuilt onboarding into 5 behavioural sequences, lifting trial-to-paid conversion from 6.2% to 9.8%.",
      },
    ],
    skills: [
      "Channels: SEO, content, paid search, paid social, lifecycle email",
      "Tools: HubSpot, GA4, Ahrefs, Webflow, Figma",
      "Practice: positioning, segmentation, attribution, A/B testing, team leadership",
    ],
    keywords: [
      "demand generation",
      "content marketing",
      "SEO",
      "lifecycle marketing",
      "attribution",
      "campaign management",
      "GA4",
    ],
    tip: "If a bullet has no number, ask what your team was measured on that quarter. Reach, cost per lead, pipeline sourced, and time-to-publish are all legitimate.",
  },
  {
    slug: "nurse",
    role: "Nurse",
    seniority: "Registered / band 5–6",
    blurb:
      "Ward, community, and specialist nursing, showing caseload and judgement without breaching confidentiality.",
    intro:
      "Clinical CVs undersell more than any other category, because clinicians are trained to describe work collectively and modestly. *Provided high-quality patient care* is true of everyone on the rota. Caseload, acuity, escalation, and audit numbers describe your scope entirely at the service level. No patient detail is ever needed.",
    summary:
      "Registered Nurse (NMC PIN active), 5 years across acute surgical and post-operative care on a 28-bed ward. Manages a caseload of 8–10 patients per shift, precepts newly qualified staff, and led a discharge-planning audit that cut average delay by 2.1 hours.",
    bullets: [
      {
        before:
          "Responsible for providing care to patients on a busy surgical ward.",
        after:
          "Managed a caseload of 8–10 post-operative patients per shift on a 28-bed surgical ward, triaging deterioration using NEWS2 and escalating 40+ cases to the critical care outreach team over 12 months.",
      },
      {
        before: "Involved in a project to improve discharge processes.",
        after:
          "Led a discharge-planning audit across 3 wards, standardised the handover template with pharmacy, and cut average discharge delay from 5.2 to 3.1 hours over a 6-month cycle.",
      },
      {
        before: "Helped train new members of staff.",
        after:
          "Precepted 6 newly qualified nurses through their preceptorship year, with all 6 completing sign-off on schedule and 4 remaining on the ward at 18 months.",
      },
    ],
    skills: [
      "Clinical: post-operative care, wound management, IV therapy, NEWS2 escalation, venepuncture",
      "Registrations: NMC (active PIN), BLS, ILS, safeguarding level 3",
      "Practice: preceptorship, clinical audit, multidisciplinary handover, care planning",
    ],
    keywords: [
      "registered nurse",
      "NMC",
      "patient assessment",
      "clinical audit",
      "safeguarding",
      "preceptorship",
      "care planning",
    ],
    tip: "Put your registration and its status in the top three lines. It is a hard filter, and recruiters search for it as a literal string.",
  },
  {
    slug: "project-manager",
    role: "Project Manager",
    seniority: "Mid to senior",
    blurb:
      "Delivery across technical and business programmes, showing scope, not just methodology.",
    intro:
      "Project management CVs list certifications and methodologies and skip the thing hiring managers care about: how big, how complex, and what happened. Two project managers with identical PRINCE2 certificates can be running a £40k internal tool or a £6m multi-vendor migration. Scope is the differentiator.",
    summary:
      "Project Manager, 8 years delivering technical programmes in regulated environments. Delivered a £4.2m core-systems migration across 3 vendors and 40 stakeholders, on time and 6% under budget. PRINCE2 Practitioner, comfortable in both waterfall and hybrid delivery.",
    bullets: [
      {
        before: "Managed multiple projects and stakeholders.",
        after:
          "Delivered a £4.2m core-banking migration across 3 external vendors and 40 internal stakeholders, landing on the regulatory deadline and 6% under budget.",
      },
      {
        before: "Responsible for project reporting and risk management.",
        after:
          "Rebuilt the programme RAID and reporting cadence for a 9-workstream portfolio, cutting steering-committee prep from 2 days to 3 hours and surfacing 4 critical dependencies missed by the previous model.",
      },
      {
        before: "Helped the team adopt agile ways of working.",
        after:
          "Moved 3 delivery teams from quarterly waterfall to two-week iterations, shortening average time from requirement sign-off to production from 14 weeks to 5.",
      },
    ],
    skills: [
      "Delivery: PRINCE2 Practitioner, Agile/Scrum, hybrid delivery, RAID, benefits realisation",
      "Tools: Jira, Confluence, MS Project, Smartsheet, Power BI",
      "Practice: vendor management, stakeholder engagement, budget ownership, governance",
    ],
    keywords: [
      "project manager",
      "PRINCE2",
      "stakeholder management",
      "budget management",
      "risk management",
      "vendor management",
      "programme delivery",
    ],
    tip: "Lead every project bullet with its size: budget, headcount, workstreams, or duration. Methodology goes in the skills section, not in the achievement.",
  },
  {
    slug: "data-analyst",
    role: "Data Analyst",
    seniority: "Junior to mid",
    blurb:
      "Analytics and BI roles, proving the decision your analysis changed, not the chart you built.",
    intro:
      "Analyst CVs describe outputs (dashboards built, reports produced, queries written) and skip outcomes. Nobody hires an analyst for dashboards; they hire one to change decisions. Every strong analyst bullet ends with what somebody did differently because of the work.",
    summary:
      "Data Analyst, 3 years in e-commerce analytics. Built the retention model that redirected £240k of annual retention spend toward the two cohorts that responded to it. Fluent in SQL and Python, and the person the commercial team goes to before making a call.",
    bullets: [
      {
        before: "Built dashboards and reports for the business teams.",
        after:
          "Replaced 14 hand-maintained spreadsheets with a modelled Looker layer over dbt, cutting weekly reporting effort by 11 hours and ending three long-running disagreements about which revenue number was correct.",
      },
      {
        before: "Analysed customer data to find insights.",
        after:
          "Segmented 400k customers by repeat-purchase behaviour and showed that two of five retention campaigns drove all measurable lift; £240k of annual spend was reallocated to those two.",
      },
      {
        before: "Wrote SQL queries and helped with data quality.",
        after:
          "Instrumented dbt tests across 60 models and a freshness alert on the nightly load, cutting silently stale dashboards from roughly 4 a month to zero over two quarters.",
      },
    ],
    skills: [
      "Languages: SQL, Python (pandas, scikit-learn), dbt",
      "Tools: Looker, Tableau, BigQuery, Snowflake, Git",
      "Practice: experiment design, cohort analysis, data modelling, stakeholder reporting",
    ],
    keywords: [
      "data analyst",
      "SQL",
      "dbt",
      "data modelling",
      "A/B testing",
      "cohort analysis",
      "BI reporting",
    ],
    tip: "End each bullet with the decision that changed. \"So the team stopped doing X\" is stronger evidence than the size of the dataset.",
  },
  {
    slug: "accountant",
    role: "Accountant",
    seniority: "Qualified / part-qualified",
    blurb:
      "Financial and management accounting, quantifying the process, not just the outputs.",
    intro:
      "Accounting CVs are full of numbers and still fail to show impact, because the numbers describe the ledger rather than the improvement. Close days, audit adjustments, reconciliation backlog, and error rates are all legitimate achievement metrics, and they are sitting in your month-end pack already.",
    summary:
      "ACCA-qualified Financial Accountant, 5 years across group reporting and statutory audit for a 6-entity group. Shortened the monthly close from 11 to 6 working days and cleared two consecutive year-end audits with zero adjustments. IFRS and NetSuite.",
    bullets: [
      {
        before:
          "Responsible for preparing monthly management accounts and assisting with year-end.",
        after:
          "Shortened the monthly close from 11 to 6 working days by automating three intercompany reconciliations in NetSuite, and cleared year-end with zero audit adjustments for two consecutive years.",
      },
      {
        before: "Involved in improving financial controls.",
        after:
          "Rebuilt the balance-sheet reconciliation framework across 6 entities, clearing a 40-item backlog and reducing unreconciled balances from £310k to under £12k.",
      },
      {
        before: "Helped implement a new accounting system.",
        after:
          "Led the finance workstream of a NetSuite implementation across 6 entities, migrating 4 years of history and going live on schedule with no restatement.",
      },
    ],
    skills: [
      "Standards: IFRS, UK GAAP, statutory reporting, consolidation",
      "Systems: NetSuite, SAP, Excel (Power Query), Power BI",
      "Practice: month-end close, balance-sheet reconciliation, audit liaison, controls design",
    ],
    keywords: [
      "financial accountant",
      "ACCA",
      "IFRS",
      "month-end close",
      "reconciliation",
      "statutory reporting",
      "NetSuite",
    ],
    tip: "Name the standard and the system in the bullet. \"Under IFRS 16 in NetSuite\" does double duty as evidence and as a searchable keyword.",
  },
  {
    slug: "account-executive",
    role: "Account Executive",
    seniority: "Mid to senior",
    blurb:
      "New-logo and expansion sales: attainment, deal size, and cycle length in every bullet.",
    intro:
      "Sales is the easiest function to quantify and the most likely to hide behind *managed a pipeline*. A hiring manager is reading for four numbers: quota and attainment, average deal size, win rate, and cycle length. If those are not on the page, the CV is doing none of its job.",
    summary:
      "Account Executive, 5 years in mid-market B2B SaaS. 127% of a £1.1m quota last year across 19 deals, with average deal size up from £52k to £74k. Strongest on multi-stakeholder deals with a security or procurement gate.",
    bullets: [
      {
        before:
          "Responsible for managing a pipeline of enterprise accounts and building client relationships.",
        after:
          "Closed £1.4m new ARR against a £1.1m quota (127%) across 19 mid-market deals, lifting average deal size from £52k to £74k by leading with the multi-team use case.",
      },
      {
        before: "Worked on generating new business.",
        after:
          "Generated 41% of my own pipeline through targeted outbound into 60 named accounts, booking 74 first meetings in 12 months at a 22% meeting-to-opportunity rate.",
      },
      {
        before: "Helped shorten our sales cycle.",
        after:
          "Introduced a security-review pre-brief at the discovery stage, cutting average cycle length on regulated accounts from 121 to 78 days across 9 deals.",
      },
    ],
    skills: [
      "Motion: outbound prospecting, multi-threaded enterprise deals, MEDDIC, mutual action plans",
      "Tools: Salesforce, Outreach, Gong, LinkedIn Sales Navigator",
      "Practice: negotiation, procurement and security review, forecasting, territory planning",
    ],
    keywords: [
      "account executive",
      "quota attainment",
      "new business",
      "MEDDIC",
      "Salesforce",
      "pipeline generation",
      "enterprise sales",
    ],
    tip: "Put quota and attainment in the summary, not three bullets down. It is the first thing a sales hiring manager looks for and the reason they keep reading.",
  },
  {
    slug: "customer-service-representative",
    role: "Customer Service Representative",
    seniority: "Entry to mid",
    blurb:
      "Support and service roles: volume, resolution, and the process you improved.",
    intro:
      "Customer service CVs are often the thinnest, and they need not be. Support roles generate more measurable data than almost any other entry-level job: ticket volume, handling time, first-contact resolution, satisfaction scores. Using them turns a generic CV into a specific one immediately.",
    summary:
      "Customer Service Representative, 3 years in high-volume e-commerce support across chat, email, and phone. Handles 60–80 contacts a day at 94% CSAT, and rebuilt the response macro library that cut average handling time by 44%.",
    bullets: [
      {
        before: "Duties included handling customer queries and updating records.",
        after:
          "Handled 60–80 customer contacts a day across chat and email, maintaining 94% CSAT against a team average of 88%.",
      },
      {
        before: "Helped improve our processes.",
        after:
          "Rewrote 30 response macros after auditing the 200 most common queries, cutting average handling time from 7.5 to 4.2 minutes with no drop in satisfaction.",
      },
      {
        before: "Trained new team members.",
        after:
          "Onboarded 8 new advisors as floor buddy, bringing average time-to-independence down from 6 weeks to 4.",
      },
    ],
    skills: [
      "Channels: live chat, email, inbound phone, social",
      "Tools: Zendesk, Intercom, Shopify, Salesforce Service Cloud",
      "Practice: de-escalation, macro and knowledge-base authoring, QA, onboarding",
    ],
    keywords: [
      "customer service",
      "CSAT",
      "first contact resolution",
      "Zendesk",
      "de-escalation",
      "ticket handling",
      "knowledge base",
    ],
    tip: "Compare yourself to the team average where you can. \"94% CSAT against a team average of 88%\" is far stronger than 94% alone.",
  },
  {
    slug: "teacher",
    role: "Teacher",
    seniority: "Qualified / QTS",
    blurb:
      "Primary and secondary teaching: attainment, intervention, and responsibility beyond the classroom.",
    intro:
      "Teaching CVs describe the timetable and skip the outcomes. Attainment and progress data, intervention results, and whole-school responsibilities are the evidence, and every teacher has them. Lead with the subject and key stage, because that is what recruiters filter on first.",
    summary:
      "Secondary Mathematics Teacher (QTS), 6 years across KS3–KS5. Raised GCSE grade 5+ attainment in my classes from 58% to 74% over three cohorts, and led the Year 11 intervention programme across the department.",
    bullets: [
      {
        before: "Taught maths to students in Years 7 to 13.",
        after:
          "Taught KS3–KS5 Mathematics across 6 classes, raising grade 5+ attainment in my GCSE cohorts from 58% to 74% over three years against a department average of 63%.",
      },
      {
        before: "Ran intervention sessions for struggling students.",
        after:
          "Designed and led a targeted Year 11 intervention for 34 borderline students, with 27 achieving a grade 4 or above at the summer series.",
      },
      {
        before: "Helped with the department's schemes of work.",
        after:
          "Rewrote the KS3 scheme of work around mastery sequencing with two colleagues, cutting reteaching time in Year 9 by an estimated two weeks per term.",
      },
    ],
    skills: [
      "Teaching: KS3, KS4, KS5 Mathematics; mastery sequencing; formative assessment",
      "Qualifications: QTS, PGCE, safeguarding level 2, exam board examiner (AQA)",
      "Practice: intervention design, data-driven tracking, form tutoring, parental engagement",
    ],
    keywords: [
      "QTS",
      "secondary teacher",
      "KS3 KS4 KS5",
      "attainment",
      "intervention",
      "safeguarding",
      "scheme of work",
    ],
    tip: "Put subject, key stage, and QTS in the first two lines. Schools filter on all three before reading anything else.",
  },
  {
    slug: "product-manager",
    role: "Product Manager",
    seniority: "Mid to senior",
    blurb:
      "Product roles: the decision you made and what happened, not the features you shipped.",
    intro:
      "Product CVs list shipped features, which tells a hiring manager what the roadmap contained and nothing about your judgement. The interesting part is always the decision: what you chose not to build, what the data said, and what moved as a result.",
    summary:
      "Senior Product Manager, 7 years in B2B SaaS, focused on pricing and monetisation. Led the move to usage-based billing at Northwind, lifting net revenue retention from 104% to 121%. Works day to day with engineering, sales, and finance.",
    bullets: [
      {
        before:
          "Worked with different teams to update how the product was priced.",
        after:
          "Led the shift from seat-based to usage-based pricing across 3 plans, coordinating engineering, sales, and finance; net revenue retention rose from 104% to 121% over four quarters with no increase in churn.",
      },
      {
        before: "Responsible for the roadmap and shipping new features.",
        after:
          "Cut the roadmap from 14 initiatives to 5 after a usage audit showed 71% of requested features served under 3% of accounts, shortening average time-to-ship from 11 weeks to 6.",
      },
      {
        before: "Ran user research and gathered feedback.",
        after:
          "Ran 32 customer interviews across two segments and killed a committed integration project, redirecting a quarter of engineering capacity to onboarding, activation rose from 41% to 58%.",
      },
    ],
    skills: [
      "Practice: pricing and packaging, discovery, roadmap prioritisation, experimentation, stakeholder alignment",
      "Tools: Amplitude, Looker, Figma, Linear, SQL",
      "Domains: B2B SaaS, monetisation, onboarding and activation",
    ],
    keywords: [
      "product manager",
      "roadmap",
      "discovery",
      "pricing",
      "activation",
      "experimentation",
      "stakeholder management",
    ],
    tip: "Include one thing you killed. Deciding not to build something, with the reasoning and the reallocation, is the strongest product signal on a CV.",
  },
];

export const EXAMPLES_BY_SLUG = Object.fromEntries(
  RESUME_EXAMPLES.map((example) => [example.slug, example])
);

export function getResumeExample(slug) {
  return EXAMPLES_BY_SLUG[slug] ?? null;
}
