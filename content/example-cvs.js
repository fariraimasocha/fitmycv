// Full CV documents for /resume-examples/<slug>, rendered with the same
// templates the app exports. People and employers are invented; the
// universities are real so the education lines read naturally.
//
// `tailoring` shows one CV before and after tailoring to an example posting.
// The after version only rewords and reorders facts already in the before
// version. If a fact is not in `before`, it must not appear in `after`.
// The page scores both with lib/resume-job-match.js, so the numbers are computed,
// never typed in.

const salesManager = {
  basics: {
    name: "Amara Osei",
    label: "Sales Manager",
    email: "amara.osei@example.com",
    phone: "+44 7700 900142",
    location: "London, UK",
    summary:
      "Sales Manager leading a team of 8 across UK and Nordics, carrying a £6.4M annual quota. Hit 112% of team target in 2025, raised average deal size from £34k to £51k, and took 3 of 8 reps from under quota to above it inside two quarters.",
    profiles: [{ network: "LinkedIn", url: "linkedin.com/in/amaraosei" }],
  },
  work: [
    {
      company: "Fenwick Software",
      position: "Sales Manager, UK and Nordics",
      location: "London, UK",
      startDate: "Jan 2023",
      endDate: "Present",
      description: [
        "Lead 8 account executives against a £6.4M annual quota, closing 2025 at 112% with 6 of 8 reps individually above target.",
        "Moved the team upmarket from SMB to mid market, raising average deal size from £34k to £51k while holding the sales cycle at 71 days.",
        "Introduced weekly deal reviews and a MEDDIC qualification standard, taking 3 underperforming reps above quota within two quarters and cutting slipped deals by a third.",
        "Hired 4 account executives in 2025 and built a 30 day ramp plan, bringing new hires to a first closed deal in 47 days instead of 90.",
        "Own the weekly regional forecast, landing within 5% of the committed number in 7 of the last 8 quarters.",
        "Agreed a shared lead definition with marketing and cut inbound follow-up time from 2 days to 4 hours, lifting meeting conversion from 18% to 27%.",
      ].join("\n"),
    },
    {
      company: "Fenwick Software",
      position: "Senior Account Executive",
      location: "London, UK",
      startDate: "Mar 2020",
      endDate: "Dec 2022",
      description: [
        "Closed £1.9M in new SaaS annual recurring revenue in 2022 at 131% of quota, the top result on a team of 11.",
        "Ran the first mid market pilot, 14 deals in two quarters, which became the team's main segment in 2023.",
        "Coached 3 new account executives through their first quarter as the team's informal ramp buddy.",
      ].join("\n"),
    },
    {
      company: "Lumen Data",
      position: "Account Executive",
      location: "London, UK",
      startDate: "Sep 2017",
      endDate: "Feb 2020",
      description: [
        "Sold analytics software to UK retailers, averaging 108% of quota across 9 quarters.",
        "Wrote the outbound email sequence the team adopted, lifting booked meetings by 22%.",
      ].join("\n"),
    },
  ],
  education: [
    {
      institution: "University of Leeds",
      degree: "BA",
      fieldOfStudy: "Business Management",
      startDate: "Sep 2014",
      endDate: "Jun 2017",
    },
  ],
  skills: [
    { category: "Sales", skills: ["Pipeline management", "Forecasting", "Territory planning", "MEDDIC", "Solution selling"] },
    { category: "Leadership", skills: ["Coaching", "Performance management", "Hiring", "Quota setting"] },
    { category: "Systems", skills: ["Salesforce", "HubSpot", "Gong", "Outreach", "LinkedIn Sales Navigator"] },
  ],
};

const firstTimeManager = {
  basics: {
    name: "Daniel Reyes",
    label: "Sales Manager",
    email: "daniel.reyes@example.com",
    phone: "+44 7700 900318",
    location: "Manchester, UK",
    summary:
      "First-line Sales Manager with 14 months leading 5 account executives, promoted after two years as the team's top seller. Took the team from 84% to 103% of a £2.1M quota in my first full year, and kept every rep I inherited.",
    profiles: [{ network: "LinkedIn", url: "linkedin.com/in/danielreyes" }],
  },
  work: [
    {
      company: "Brightwell HR",
      position: "Sales Manager",
      location: "Manchester, UK",
      startDate: "Sep 2025",
      endDate: "Present",
      description: [
        "Lead 5 account executives selling HR software to firms of 50 to 500 staff, closing my first full year at 103% of a £2.1M quota, up from 84% the year before.",
        "Set up one-to-one call coaching every week using Gong recordings, and raised the team's demo to close rate from 19% to 26%.",
        "Kept all 5 inherited reps through the change of manager, in a year when the wider sales floor lost a quarter of its sellers.",
        "Rebuilt territory splits by company size, which ended weekly disputes over account ownership.",
      ].join("\n"),
    },
    {
      company: "Brightwell HR",
      position: "Account Executive",
      location: "Manchester, UK",
      startDate: "Jun 2023",
      endDate: "Aug 2025",
      description: [
        "Finished 2024 at 138% of quota, first of 12 account executives, with £640k in new business.",
        "Shortened the average sales cycle from 52 to 38 days by running proposals as shared mutual action plans.",
      ].join("\n"),
    },
    {
      company: "Northgate Telecom",
      position: "Business Development Representative",
      location: "Manchester, UK",
      startDate: "Aug 2021",
      endDate: "May 2023",
      description: [
        "Booked 31 qualified meetings a month on average against a target of 22.",
        "Promoted to account executive after 18 months, the fastest on the team that year.",
      ].join("\n"),
    },
  ],
  education: [
    {
      institution: "Manchester Metropolitan University",
      degree: "BSc",
      fieldOfStudy: "Marketing",
      startDate: "Sep 2018",
      endDate: "Jun 2021",
    },
  ],
  skills: [
    { category: "Sales", skills: ["Full cycle sales", "Mutual action plans", "Discovery", "Negotiation"] },
    { category: "Leadership", skills: ["Call coaching", "One-to-ones", "Territory design", "Pipeline reviews"] },
    { category: "Systems", skills: ["HubSpot", "Gong", "Apollo", "Excel"] },
  ],
};

const fieldSalesManager = {
  basics: {
    name: "Grace Whitfield",
    label: "Field Sales Manager",
    email: "grace.whitfield@example.com",
    phone: "+44 7700 900527",
    location: "Birmingham, UK",
    summary:
      "Field Sales Manager running a 9 person team across the Midlands and North for a building products distributor. Grew regional revenue from £11.2M to £14.6M over three years, and won 2 national contractor accounts worth £1.8M a year.",
    profiles: [{ network: "LinkedIn", url: "linkedin.com/in/gracewhitfield" }],
  },
  work: [
    {
      company: "Calder Building Supplies",
      position: "Regional Field Sales Manager",
      location: "Birmingham, UK",
      startDate: "Apr 2022",
      endDate: "Present",
      description: [
        "Manage 9 field sales representatives covering 1,400 trade accounts, growing regional revenue from £11.2M to £14.6M in three years.",
        "Won 2 national contractor accounts worth £1.8M a year by pairing site visits with a dedicated stock agreement.",
        "Replaced paper visit reports with Salesforce mobile logging, giving weekly visibility of 600+ customer visits.",
        "Cut lapsed accounts by 30% with a quarterly win-back call plan run by each representative.",
      ].join("\n"),
    },
    {
      company: "Calder Building Supplies",
      position: "Area Sales Representative",
      location: "Leicester, UK",
      startDate: "Jan 2018",
      endDate: "Mar 2022",
      description: [
        "Grew a 220 account territory from £2.3M to £3.4M in sales, the largest increase in the region in 2021.",
        "Opened 46 new trade accounts by working builders' merchant counters on early mornings.",
      ].join("\n"),
    },
  ],
  education: [
    {
      institution: "Nottingham Trent University",
      degree: "BA",
      fieldOfStudy: "Business",
      startDate: "Sep 2014",
      endDate: "Jun 2017",
    },
  ],
  skills: [
    { category: "Sales", skills: ["Key account management", "Territory planning", "Trade and contractor sales", "Pricing negotiation"] },
    { category: "Leadership", skills: ["Field coaching", "Ride-alongs", "Performance reviews", "Recruitment"] },
    { category: "Systems", skills: ["Salesforce", "Microsoft Dynamics", "Power BI"] },
  ],
};

// Same facts as salesManager, in the posting's words and order.
const salesManagerTailored = {
  ...salesManager,
  basics: {
    ...salesManager.basics,
    label: "Mid-Market Sales Manager",
    summary:
      "Mid-market Sales Manager leading 8 account executives in a SaaS new business team, carrying a £6.4M annual quota. Hit 112% of target in 2025, grew average deal size from £34k to £51k, and built a 30 day ramp plan that brought new hires to a first closed deal in 47 days.",
  },
  work: [
    {
      ...salesManager.work[0],
      description: [
        "Lead 8 account executives on new business against a £6.4M annual quota, closing 2025 at 112% with 6 of 8 reps above target.",
        "Moved the team from SMB to mid-market SaaS deals, raising average deal size from £34k to £51k while holding the sales cycle at 71 days.",
        "Hired 4 account executives in 2025 and built a 30 day ramp plan, cutting ramp time to a first closed deal from 90 days to 47.",
        "Own forecast accuracy for the region, landing within 5% of the committed number in 7 of the last 8 quarters.",
        "Coach through weekly deal reviews and a MEDDIC qualification standard, taking 3 underperforming reps above quota within two quarters.",
        "Built pipeline with marketing on a shared lead definition, and cut inbound follow-up from 2 days to 4 hours, lifting meeting conversion from 18% to 27%.",
      ].join("\n"),
    },
    salesManager.work[1],
    salesManager.work[2],
  ],
  skills: [
    { category: "Sales", skills: ["New business", "Pipeline generation", "Forecast accuracy", "MEDDIC", "Mid-market SaaS"] },
    { category: "Leadership", skills: ["Coaching", "Hiring", "Ramp planning", "Performance management"] },
    { category: "Systems", skills: ["HubSpot", "Salesforce", "Gong", "Outreach", "LinkedIn Sales Navigator"] },
  ],
};

export const EXAMPLE_CVS = {
  "sales-manager": {
    cvs: [
      {
        id: "saas",
        heading: "Sales Manager CV example",
        note: "A manager of 8 in B2B software. Quota, attainment and deal size sit in the summary, and every bullet carries a number.",
        template: "standard",
        data: salesManager,
      },
      {
        id: "first-time",
        heading: "First-time Sales Manager CV example",
        note: "Promoted from top seller to manager 14 months ago. The CV leads with the team's result and keeps the selling record as proof.",
        template: "crisp",
        data: firstTimeManager,
      },
      {
        id: "field",
        heading: "Field Sales Manager CV example",
        note: "Territory and key account selling outside software. Revenue growth and named account wins do the work here.",
        template: "professional",
        data: fieldSalesManager,
      },
    ],
    tailoring: {
      posting: {
        title: "Sales Manager, Mid-Market",
        company: "Harbourline Payroll",
        text: [
          "Harbourline Payroll is hiring a Sales Manager to lead our mid-market new business team in London.",
          "You will lead a team of 6 to 10 account executives selling payroll SaaS to companies of 200 to 2,000 staff.",
          "What you will do: own new business targets and forecast accuracy for the team. Coach account executives through deal reviews and a clear qualification framework such as MEDDIC. Hire and ramp new account executives, and cut ramp time. Build pipeline with marketing, including pipeline generation from inbound and outbound.",
          "What we look for: 2+ years managing a quota-carrying SaaS sales team. A record of hitting team targets in mid-market deals. Experience with HubSpot and Gong. Strong coaching and hiring record.",
        ].join("\n"),
        asks: [
          "Lead 6 to 10 account executives on mid-market new business",
          "Own forecast accuracy",
          "Coach through deal reviews and MEDDIC",
          "Hire and cut ramp time",
          "Build pipeline with marketing",
          "HubSpot and Gong",
        ],
      },
      before: salesManager,
      after: salesManagerTailored,
      template: "standard",
      changes: [
        "The title and summary now say mid-market, SaaS and new business, the posting's own words for work the CV already described.",
        "Hiring and ramp time moved up to third, because the posting asks for it in its own line.",
        "\"Own the weekly regional forecast\" became \"own forecast accuracy\", the phrase the posting uses.",
        "The skills section leads with the posting's terms, and HubSpot comes before Salesforce.",
        "Nothing new was added. Every number and claim comes from the original CV.",
      ],
    },
  },
};

export const getExampleCvs = (slug) => EXAMPLE_CVS[slug] ?? null;
