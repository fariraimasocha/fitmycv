export const meta = {
  slug: "what-is-a-resume-match-score",
  title: "What Is a Resume Match Score, and Should You Trust It?",
  seoTitle: "What Is a Resume Match Score?",
  description:
    "What a resume match score actually measures, how the number is calculated, what counts as a good score, and the four things it cannot see.",
  excerpt:
    "A match score measures word overlap between two documents. That is genuinely useful and much narrower than most people assume it is.",
  date: "2026-09-10",
  readingTime: 7,
  category: "ATS",
  tags: ["match score", "ats", "keywords", "resume"],
  image: "/og-image.jpg",
  imageAlt: "FitMyCV",
  keywords: [
    "what is a resume match score",
    "resume match score",
    "resume match rate",
    "ats score meaning",
    "what is a good resume match score",
    "resume compatibility score",
  ],
};

export const faqs = [
  {
    q: "What is a resume match score?",
    a: "A number, usually a percentage, describing how much of a job description's important vocabulary appears in your CV. It is a measure of word overlap between two documents. It is not a measure of your suitability for the role, and no tool has access to the information that would be needed to measure that.",
  },
  {
    q: "What is a good resume match score?",
    a: "There is no industry standard, and any specific threshold you see quoted is that tool's own heuristic rather than a fact about hiring. As a working rule: high coverage means you are speaking the posting's language, middling means a tailoring pass is worth the time, and low usually means either a generic CV or a genuine stretch. Treat it as a direction of travel across edits, not a grade.",
  },
  {
    q: "Do employers see my match score?",
    a: "No. The score comes from the tool you ran, not from the employer's system. Applicant tracking systems do rank and filter candidates, but by their own criteria, which you cannot see and which differ between systems and between recruiters using the same system.",
  },
  {
    q: "Why did my score drop when I improved my resume?",
    a: "Usually because you cut filler. Scores based on proportional overlap can fall when you remove padding, even though the CV got better. This is the clearest illustration of why the score is a diagnostic rather than a target: optimising the number directly makes the document worse.",
  },
  {
    q: "Can I get 100%?",
    a: "You can approach it by pasting the job description into your CV, which would also destroy the document. A very high score usually means you have copied rather than tailored, and it reads that way to the human who opens the file.",
  },
];

export const blocks = [
  { h2: "What the number actually is" },
  {
    p: "Every resume match score works roughly the same way. The tool reads the job description, extracts the terms it leans on, weights them by how often and how prominently they appear, then checks how many of them appear in your CV. The score is the weighted proportion covered.",
  },
  {
    p: "That is the whole mechanism. It is a **document similarity measure**, and understanding that tells you exactly what it is good for and where it is useless.",
  },
  {
    callout: {
      title: "Different tools give different numbers for the same pair",
      body: "There is no shared standard for which terms count, how they are weighted, or whether inflections match. A 62% in one tool and a 78% in another can both be honest readings of the same two documents. Compare a score against itself across your own edits, never against a score from somewhere else.",
    },
  },

  { h2: "What it can see" },
  {
    ul: [
      "**Vocabulary mismatch.** The posting says stakeholder management and your CV says kept clients informed. This is the score's core competence and it is genuinely valuable.",
      "**Missing named tools.** Salesforce, Kubernetes, NetSuite, Zendesk. Concrete nouns are exactly what this kind of matching handles well.",
      "**Acronym asymmetry.** You wrote continuous integration and the posting said CI/CD.",
      "**Whether you tailored at all.** A generic CV against a specific posting scores visibly low, every time.",
    ],
  },

  { h2: "What it cannot see" },
  {
    table: {
      head: ["The score cannot judge", "Why", "What does judge it"],
      rows: [
        [
          "Whether your evidence is any good",
          "It matches the word, not the sentence around it",
          "The hiring manager, in about six seconds",
        ],
        [
          "Seniority and scope",
          "Owned it and helped with it contain the same nouns",
          "A human reading your bullets for scale",
        ],
        [
          "Whether the claim is true",
          "It has no access to your history",
          "The interview",
        ],
        [
          "Domain fit",
          "Two roles can share vocabulary and almost no substance",
          "A recruiter who knows the sector",
        ],
      ],
    },
  },
  {
    p: "This is why a CV can score well and still get no reply. Coverage decides whether you are **found**. The evidence decides whether you are **called**. They are separate problems and the score only speaks to the first.",
  },

  { h2: "The trap: optimising the number" },
  {
    p: "Because the score is proportional, you can raise it by adding matched terms or by deleting unmatched text. Both move the number. Only one makes the CV better.",
  },
  {
    compare: {
      title: "Two ways to reach the same score",
      context: "Identical percentage. One of these gets read, the other gets deleted.",
      before:
        "Skills: stakeholder management, risk management, change control, governance, RAID, budgeting, forecasting, Agile, Scrum, Waterfall, PRINCE2, Jira",
      after:
        "Brought finance and operations to a single scope after four months of disagreement, unblocking a 2.4M programme that had slipped two quarters.",
    },
  },
  {
    p: "A keyword stuffed skills block scores well and reads as desperate. If you find yourself adding words for the score rather than because they describe your work, the tool has stopped helping you.",
  },

  { h2: "How to use it properly" },
  {
    steps: [
      {
        title: "Run it before you decide to apply",
        body: "A very low score on a role you thought was a fit usually means a vocabulary problem worth ten minutes, or a genuine stretch worth skipping.",
      },
      {
        title: "Read the missing list, not the number",
        body: "The list is the useful output. The number is a summary of the list. See [missing resume keywords](/missing-resume-keywords) for the version that shows only the gaps.",
      },
      {
        title: "Close gaps inside bullets",
        body: "Every term you add should arrive attached to something you did and something that happened. Not as another entry in a list.",
      },
      {
        title: "Re-run and compare against your own previous score",
        body: "Two or three passes is normal. Direction of travel is the signal. The absolute value is not.",
      },
      {
        title: "Stop when the terms are covered and evidenced",
        body: "Further gains come from better bullets, not more matching. Chasing the last few points is wasted time.",
      },
    ],
  },
  {
    cta: {
      title: "Past the score, into the rewrite",
      body: "Paste the job link and FitMyCV rewrites your CV and cover letter against the posting, closing the gaps with your own experience.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
