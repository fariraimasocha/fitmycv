// Professional summary generator landing page.
// Same promise as the headline generator: the tool reads the posting and the
// CV together, so a summary never claims a skill or a result the CV cannot
// back up. It fills a formula; it does not write prose, so the copy never
// calls it AI.

export const professionalSummaryGenerator = {
  slug: "professional-summary-generator",
  seoTitle: "Professional Summary Generator for Your CV",
  description:
    "Upload your CV and paste a job description. Get three professional summaries built from your real skills and results. Free, no login.",
  keywords: [
    "professional summary generator",
    "professional summary for cv",
    "professional summary for resume",
    "cv professional summary examples",
    "job summary for resume",
    "resume summary generator",
    "cv summary generator",
    "professional summary examples",
    "summary for resume",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Professional summary generator",
  h1: "Professional summary generator",
  lede:
    "Upload your CV and paste the job description. Get three professional summaries that name the role from the posting, use only skills your CV shows, and lead with a real result from your own CV.",
  ctas: [
    { label: "Write my summary", href: "#tool" },
    {
      label: "Tailor my whole CV",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "summary",
  howTo: {
    name: "How to write a professional summary for a specific job",
    description:
      "Build a CV professional summary from the target posting and your own experience.",
    steps: [
      {
        name: "Paste the job description",
        text: "The tool reads the role title and the terms the posting repeats. Paste the whole advert, including the requirements.",
      },
      {
        name: "Upload your CV",
        text: "Drop the PDF. The text is read in your browser. A skill that is not in your CV never appears in a summary.",
      },
      {
        name: "Pick one and make it yours",
        text: "Three summaries come back in three shapes. Copy the one that fits, check every number, and cut anything you would not want to be asked about.",
      },
    ],
  },
  faqs: [
    {
      q: "What is a professional summary on a CV?",
      a: "It is the two to four lines at the top of your CV, under your name and headline. It says what role you are aiming at, your level and field, and one result that proves you can do the job. Recruiters read it first, so it decides whether they read the rest.",
    },
    {
      q: "How does this generator write the summary?",
      a: "It fills a simple formula: the role title from the posting, your years and field from your CV, the skills both documents share, and a line from your CV that contains a number. It does not invent anything. If your CV has no line with a number, the summary shows a bracket where your result should go.",
    },
    {
      q: "Is a professional summary the same as a resume summary?",
      a: "Yes. CV professional summary, resume summary, profile and personal statement all name the same block at the top of the page. The advice is the same whatever you call it.",
    },
    {
      q: "How long should a professional summary be?",
      a: "Two to four lines, or roughly 30 to 60 words. If yours runs longer, the extra detail belongs in your experience section, where it can sit next to the role it came from.",
    },
    {
      q: "Should I change my summary for each job?",
      a: "For roles you really want, yes. It is the fastest part of a CV to tailor and the part read first. Swap in the posting's job title and the result that best matches what they asked for. That is why this tool asks for the job description.",
    },
    {
      q: "Summary or objective: which should I use?",
      a: "A summary, almost always. An objective says what you want. A summary says what you offer and proves it, which is what the reader is looking for. Even a first CV is better served by a summary built around a project or a course.",
    },
    {
      q: "Is my CV uploaded anywhere?",
      a: "No. The PDF is read inside your browser tab and nothing is stored or sent to a server. Close the tab and it is gone.",
    },
  ],
  blocks: [
    { h2: "The formula every good summary follows" },
    {
      p: "A strong summary answers three questions in order: who you are professionally, what you are aiming at, and what your proof is. **Title and level, then domain and years, then one result with a number.** That is the whole structure, and it is exactly what this tool fills in.",
    },
    {
      ol: [
        "**Title and level.** The role you are applying for, in the employer's words. Senior Data Analyst, not experienced professional.",
        "**Domain and years.** Your field and how long you have worked in it, so the reader can place you in a second.",
        "**One result with a number.** A real outcome from your CV: a percentage, a count, a budget, a time saved. This is the line most summaries skip.",
      ],
    },
    {
      callout: {
        title: "Why the result has to come from your CV",
        body: "A summary is the first thing an interviewer asks about. If a number in it is not on the rest of your CV, it reads as invented. This tool only uses result lines it finds in your own CV, and marks the gap when there are none.",
      },
    },

    { h2: "Professional summary examples by career stage" },
    {
      table: {
        head: ["Stage", "Summary"],
        rows: [
          [
            "Graduate",
            "Statistics graduate aiming for a junior data analyst role. Built a final year project analysing five years of city transport data in Python and SQL.",
          ],
          [
            "Early career",
            "Customer support specialist with 3 years in SaaS. Skilled in Zendesk, onboarding and renewals. Cut first reply time from 9 hours to 2 across a queue of 400 tickets a week.",
          ],
          [
            "Mid-level",
            "Digital marketing manager with 6+ years in B2B SaaS. Skilled in paid social, lifecycle email and HubSpot. Grew qualified leads 40% in a year on a flat budget.",
          ],
          [
            "Senior",
            "Senior project manager with 9 years in commercial construction. Brought the last three projects in on or under budget and cut handover delays from 3 weeks to 4 days.",
          ],
          [
            "Career changer",
            "Learning and development specialist moving from 6 years in secondary teaching. Designed training for 200 learners and lifted assessment pass rates 18%.",
          ],
          [
            "Nurse",
            "Registered nurse with 8 years in acute medicine. Skilled in triage, IV therapy and discharge planning. Precepted 12 newly qualified nurses on a 28 bed ward.",
          ],
        ],
      },
    },
    {
      p: "More worked examples, with before and after versions, are in the guide to [CV professional summary examples](/blog/cv-professional-summary-examples).",
    },

    { h2: "Summary, headline or objective" },
    {
      table: {
        head: ["", "Length", "Says", "Use it when"],
        rows: [
          [
            "Headline",
            "One line",
            "The role plus two or three proofs",
            "Almost always. It sits under your name, above the summary.",
          ],
          [
            "Summary",
            "Two to four lines",
            "Level, field and one result",
            "Almost always. It is the first block a recruiter reads.",
          ],
          [
            "Objective",
            "One to two sentences",
            "What you are looking for",
            "Rarely. It talks about you rather than the employer.",
          ],
        ],
      },
    },
    {
      p: "A headline and a summary work together, in that order. If the line above your summary still repeats your old job title, the [resume headline generator](/resume-headline-generator) builds one from the same posting.",
    },

    { h2: "Five ways a summary goes wrong" },
    {
      ol: [
        "**It is a list of adjectives.** Results-driven, hardworking and detail-oriented fit every applicant, so they tell the reader nothing. Name a skill and a result instead.",
        "**It has no number.** A summary without a result is a claim. One real figure turns it into evidence.",
        "**It names no role.** A summary that could go to any employer is doing half a job. Use the title from the posting.",
        "**It says what you want.** That is an objective. Say what you offer the employer instead.",
        "**It runs to five lines.** Past four lines it stops being scannable. Move the extra detail into your experience section.",
      ],
    },

    { h2: "Where the summary sits in a bigger fix" },
    {
      p: "The summary is the most read part of your CV, but it is still one block. It does not change whether your bullets carry evidence or whether a recruiter's search finds your CV. Check the vocabulary gap with [missing resume keywords](/missing-resume-keywords), then rework the bullets with the [resume bullet rewriter](/resume-bullet-rewriter).",
    },
    {
      cta: {
        title: "Want the whole CV to match, not just the summary?",
        body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, summary included, keeping your real experience and your real numbers.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Resume headline generator",
      href: "/resume-headline-generator",
      body: "Five headlines for the line above your summary, from the same posting.",
    },
    {
      label: "CV professional summary examples",
      href: "/blog/cv-professional-summary-examples",
      body: "The formula, with before and after examples by career stage.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting and see the terms you are missing.",
    },
  ],
};
