export const meta = {
  slug: "how-to-check-resume-against-job-description",
  title: "How to Check Your Resume Against a Job Description",
  seoTitle: "How to Check Your Resume Against a Job Description",
  description:
    "Four ways to check a resume against a job description, from a two minute manual pass to a free checker, and what each method can and cannot tell you.",
  excerpt:
    "You cannot proofread your own CV against a posting, because you know what you meant. Here are four checks that do not share your blind spot.",
  date: "2026-09-10",
  readingTime: 8,
  category: "ATS",
  tags: ["checking", "job description", "ats", "resume"],
  image: "/og-image.jpg",
  imageAlt: "FitMyCV",
  keywords: [
    "how to check resume against job description",
    "check resume against job description",
    "compare resume to job description",
    "resume checker job description",
    "resume compatibility checker",
    "resume relevance checker",
  ],
};

export const faqs = [
  {
    q: "How do I check my resume against a job description for free?",
    a: "Paste both into a checker that runs in your browser. The [ATS resume checker](/ats-resume-checker) gives you a coverage score and the terms you are missing, with no account and no upload. The manual version is a highlighter and ten minutes, and it catches things a keyword tool cannot.",
  },
  {
    q: "Why can I not just read them side by side myself?",
    a: "Because you know what you meant. When you read your own bullet about client communication while the posting says stakeholder management, your brain scores it as a match. A recruiter's keyword search does not, and neither does a checker. That gap is the entire reason the check is worth doing.",
  },
  {
    q: "What is a good match between a resume and a job description?",
    a: "Nobody can honestly give you a universal number, and any tool that presents one as authoritative is presenting a heuristic as a fact. Use it as a direction of travel: if the terms the posting repeats are largely absent from your CV, you have work to do. If they are present and evidenced, you are ready to send.",
  },
  {
    q: "Should I check every application?",
    a: "Check every role you actually want. The check takes about a minute once you have the habit, and it is the difference between forty applications with a generic CV and twelve with a matched one. The second set produces more interviews in less total time.",
  },
  {
    q: "Do these checks tell me whether I will get the interview?",
    a: "No. They tell you whether your CV is findable and legible against this posting. What earns the call is the evidence in your bullets. Coverage is the door, not the room.",
  },
];

export const blocks = [
  { h2: "You cannot check this yourself, and that is not a criticism" },
  {
    p: "Reading your CV beside a job description feels like a check, and it is the least reliable one available to you. You wrote the CV. You know that the line about keeping clients updated describes eighteen months of hard stakeholder management. **A recruiter's keyword search does not know that, and it is not looking for what you meant.**",
  },
  {
    p: "Every method below exists to remove your own knowledge from the reading. They differ in how long they take and what they can see.",
  },

  { h2: "Four checks, from fastest to most thorough" },
  {
    table: {
      head: ["Check", "Time", "Catches", "Misses"],
      rows: [
        [
          "The paste test",
          "10 seconds",
          "Layout and parse order problems in your own file",
          "Everything about content and vocabulary",
        ],
        [
          "The highlighter pass",
          "10 minutes",
          "Judgement, seniority, domain fit, tone",
          "Terms you unconsciously read as covered",
        ],
        [
          "A keyword checker",
          "1 minute",
          "Vocabulary gaps with no bias about what you meant",
          "Whether the evidence behind a term is any good",
        ],
        [
          "A match checker",
          "1 minute",
          "Coverage across skills, keywords and experience together",
          "Judgement calls a person would make instantly",
        ],
      ],
    },
  },
  {
    p: "They are complementary rather than competing. The fast automated checks find the vocabulary gaps you are blind to. The slow manual pass finds the things no keyword tool can see, like whether the posting wants someone who has run a team and you have only ever been in one.",
  },

  { h2: "Check one: the paste test" },
  {
    p: "Before anything about content, confirm the file is readable. Open your CV, select all, copy, and paste it into a plain text editor.",
  },
  {
    p: "What arrives is close to what a parser extracts. If sections land out of order, if your skills column has interleaved with your job history, or if your phone number is missing because it lives in a header, that is a formatting problem and no amount of keyword work will fix it. The detail is in [ATS resume format](/blog/ats-resume-format).",
  },

  { h2: "Check two: the highlighter pass" },
  {
    steps: [
      {
        title: "Mark the posting in two colours",
        body: "One colour for hard requirements, tools and named methods. Another for the softer language about how the team works and what they value.",
      },
      {
        title: "Find each first-colour term in your CV",
        body: "Not the concept. The literal term. If it is not on the page in those words, it is a gap even when you have done the work.",
      },
      {
        title: "Read the second colour for fit, not keywords",
        body: "This is where you judge seniority, autonomy and domain. A posting that says you will own this end to end is telling you something a keyword tool cannot see.",
      },
      {
        title: "Write down what is genuinely missing",
        body: "Separate cannot evidence from have not written down. The second list is your edit. The first list is your decision about whether to apply.",
      },
    ],
  },

  { h2: "Check three and four: let something else read it" },
  {
    p: "Once you have done the manual pass, run the automated one. It has no memory of what you intended, which is exactly the property you need.",
  },
  {
    ul: [
      "**[Missing resume keywords](/missing-resume-keywords)** answers the narrow question: which terms does this posting lean on that my CV never mentions? Ranked by how often the posting says them.",
      "**[ATS resume checker](/ats-resume-checker)** gives you a coverage score plus what is already matched, so you can see progress across edits.",
      "**[Resume job match checker](/resume-job-match-checker)** reads skills, keywords and experience together for an overall fit readout.",
    ],
  },
  {
    callout: {
      title: "Treat the number as a direction, not a grade",
      body: "Any match percentage is a heuristic built on word overlap. It is genuinely useful for telling whether you are moving in the right direction across two or three edits. It is not a measurement of your suitability, and no honest tool will tell you it is.",
    },
  },

  { h2: "What to do with what you find" },
  {
    ol: [
      "**Add only what you can evidence.** A term you cannot back up moves the rejection to the interview, which costs you more time, not less.",
      "**Put terms inside bullets, not in a list.** A skills list is a claim. A bullet with a number is proof. See the [resume bullet rewriter](/resume-bullet-rewriter).",
      "**Write both forms of every acronym.** CI/CD and continuous integration. PMP and Project Management Professional.",
      "**Move your strongest match upward.** A perfect match in your third role does less work than a partial one in your first two bullets.",
      "**Re-run the check.** Two or three passes usually closes most of the gap without inventing anything.",
    ],
  },
  {
    cta: {
      title: "Check, then fix, in one step",
      body: "Paste the job link and FitMyCV reads the posting and rewrites your CV and cover letter against it, keeping your real experience.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
