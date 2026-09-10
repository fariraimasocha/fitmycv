export const meta = {
  slug: "how-to-find-resume-keyword-gaps",
  title: "How to Find the Keyword Gaps in Your Resume",
  seoTitle: "How to Find Resume Keyword Gaps",
  description:
    "Find the keyword gaps between your resume and a job description, tell a real gap from a wording gap, and close them without claiming anything untrue.",
  excerpt:
    "Most keyword gaps are not skill gaps. They are wording gaps, and the difference decides whether you spend the evening editing or applying elsewhere.",
  date: "2026-09-10",
  readingTime: 8,
  category: "ATS",
  tags: ["keywords", "gap analysis", "ats", "resume"],
  image: "/og-image.jpg",
  imageAlt: "FitMyCV",
  keywords: [
    "how to find resume keyword gaps",
    "resume keyword gap",
    "resume keyword gap checker",
    "find missing resume keywords",
    "resume skills gap",
    "resume keyword analysis",
  ],
};

export const faqs = [
  {
    q: "What is a resume keyword gap?",
    a: "A term the job description leans on that your CV never mentions. It comes in two kinds, and they need opposite responses: a wording gap, where you did the work but called it something else, and a skill gap, where you genuinely have not done it. Most gaps are the first kind, which is why gap analysis is usually an editing job rather than a career decision.",
  },
  {
    q: "How do I find missing keywords in my resume?",
    a: "Paste the posting and your CV into a checker that lists the terms present in one and absent from the other. [Missing resume keywords](/missing-resume-keywords) does exactly this and ranks the gaps by how often the posting mentions each term, so you know which ones matter.",
  },
  {
    q: "Should I add every missing keyword?",
    a: "No. Add the ones you can honestly evidence, in a bullet that shows what you did and what happened. Terms you cannot evidence should stay off the page. Adding them only moves your rejection from a screen you never see to an interview where somebody asks you about it.",
  },
  {
    q: "How many missing keywords is too many?",
    a: "It depends on which ones. Ten missing nice-to-haves matter far less than two missing must-haves. Look at where the term sits in the posting and how often it repeats, not at the length of the list.",
  },
  {
    q: "Does closing keyword gaps guarantee an interview?",
    a: "No. Keyword coverage decides whether a recruiter's search surfaces you at all. What earns the call is the evidence attached to those keywords. Closing gaps gets you read; bullets with numbers get you called.",
  },
];

export const blocks = [
  { h2: "Two kinds of gap, opposite responses" },
  {
    p: "Every missing keyword is one of two things, and confusing them wastes either your evening or your application.",
  },
  {
    table: {
      head: ["", "Wording gap", "Skill gap"],
      rows: [
        [
          "What it means",
          "You did the work and called it something else",
          "You have not done this",
        ],
        [
          "How common",
          "Most gaps on most CVs",
          "The minority, but the decisive ones",
        ],
        [
          "The response",
          "Rename it using the posting's term. Costs ten seconds.",
          "Leave it off. Decide whether the role is still worth applying for.",
        ],
        [
          "Example",
          "Posting says stakeholder management. You wrote kept clients informed.",
          "Posting says Kubernetes. You have never run a cluster.",
        ],
      ],
    },
  },
  {
    p: "**The whole value of gap analysis is telling these apart quickly.** A list of missing terms is not useful on its own. A list sorted into rename these and cannot claim these is a plan.",
  },

  { h2: "Finding the gaps" },
  {
    steps: [
      {
        title: "Get the posting's real vocabulary",
        body: "Not your summary of it. The terms it actually repeats, ranked by frequency and position. A term in the first three requirements and repeated twice carries more weight than one in a nice-to-have list.",
      },
      {
        title: "Check each against your CV text, literally",
        body: "Search for the exact string. Your judgement is compromised here because you know what you meant, so use find rather than reading.",
      },
      {
        title: "Sort the misses into two columns",
        body: "Did it, called it something else. Versus, have not done it. Be honest in the second column. Optimism here costs you an interview later, not a screen.",
      },
      {
        title: "Weigh the second column",
        body: "If the cannot-claim list holds most of the must-haves, this is a stretch role. That is useful information, not a failure.",
      },
    ],
  },
  {
    p: "The fastest version of steps one and two is a checker. [Missing resume keywords](/missing-resume-keywords) lists the terms the posting leans on that your CV never mentions, each with the number of times the posting says it, so the ranking is done for you.",
  },

  { h2: "The gaps that are almost always wording" },
  {
    ul: [
      "**Acronym versus full form.** CI/CD against continuous integration. SEO against search engine optimisation. PMP against Project Management Professional. Write both once and the gap disappears.",
      "**Product name versus category.** Zendesk against ticketing system. NetSuite against ERP. Postings and recruiters search the product.",
      "**Their noun versus your verb.** The posting says risk management. Your bullet says spotted a vendor problem early. Same thing, and only one is searchable.",
      "**Method name left implicit.** You ran two week iterations with a backlog and a retro. The posting calls that Scrum. Name it.",
      "**Seniority language.** The posting says owned. You wrote helped with. If you owned it, say owned.",
    ],
  },
  {
    callout: {
      title: "Renaming is accurate. Inventing is not.",
      body: "Describing work you genuinely did in the employer's vocabulary is what tailoring is, and it is honest. The line is simple: if somebody asked you about it in an interview, could you talk for two minutes from real experience? If yes, rename it. If no, leave it off.",
    },
  },

  { h2: "Closing a gap properly" },
  {
    p: "The wrong way to close a gap is to append the word to your skills list. It technically matches, and it convinces nobody who reads the page.",
  },
  {
    compare: {
      title: "Closing a stakeholder management gap",
      context: "Both versions contain the term. Only one survives being asked about.",
      before: "Skills: stakeholder management, communication, project delivery",
      after:
        "Brought finance and operations to a single scope after four months of disagreement, unblocking a programme that had slipped two quarters.",
    },
  },
  {
    p: "The second version matches the keyword search **and** gives the human a reason to call. That is the whole job. The [resume bullet rewriter](/resume-bullet-rewriter) helps with the restructuring if the sentence will not come.",
  },

  { h2: "How often to do this" },
  {
    p: "Once per role you actually want, and it takes about a minute after the first time. The habit that works is: check, decide whether to apply, then tailor only for the roles that survive the decision. Most people do the opposite, tailoring first and discovering the mismatch afterwards.",
  },
  {
    ol: [
      "Run the gap check before you commit an evening to a posting.",
      "Rename what you can rename. Ten seconds each.",
      "Rewrite two or three bullets to carry the renamed terms with numbers.",
      "Re-run the check to confirm the gap actually closed.",
      "If the must-have gaps are real, apply elsewhere and keep the CV.",
    ],
  },
  {
    cta: {
      title: "Find the gaps and close them in one pass",
      body: "Paste the job link and FitMyCV reads the posting, finds the gaps, and rewrites your CV and cover letter around your real experience.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
