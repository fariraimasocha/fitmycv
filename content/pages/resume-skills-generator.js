// Resume skills generator landing page.
// Same promise as the other CV and posting tools: a skill goes in the section
// only when the CV already shows it. It fills a list; it does not write prose,
// so the copy never calls it AI.

export const resumeSkillsGenerator = {
  slug: "resume-skills-generator",
  seoTitle: "Resume Skills Generator From a Job Description",
  description:
    "Paste a job description and upload your CV. Get a skills section built only from skills you can prove, plus the skills the job wants that your CV is missing.",
  keywords: [
    "resume skills generator",
    "skills for resume",
    "skills section generator",
    "cv skills generator",
    "skills for resume from job description",
    "what skills to put on a resume",
    "resume skills list",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Resume skills generator",
  h1: "Resume skills generator",
  lede:
    "Paste the job description and upload your CV. Get a skills section in the order the posting stresses them, using only skills your CV already shows, and a list of the ones the job wants that you have not shown yet. No login, nothing stored.",
  ctas: [
    { label: "Build my skills section", href: "#tool" },
    {
      label: "Tailor my whole CV",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "skills",
  howTo: {
    name: "How to write a skills section for a specific job",
    description: "Build a CV skills section from the target posting and your own experience.",
    steps: [
      {
        name: "Paste the job description",
        text: "Paste the whole advert, including the requirements. The tool ranks the skills the posting repeats.",
      },
      {
        name: "Upload your CV",
        text: "Drop the PDF. The text is read in your browser and nothing is stored.",
      },
      {
        name: "Copy the section and check the proof",
        text: "Copy the skills line into your CV. Each skill comes with the line from your CV that shows it in use. If a skill has no line, add one bullet that does.",
      },
    ],
  },
  faqs: [
    {
      q: "How does the generator pick my skills?",
      a: "It ranks the skills the job description repeats, then keeps only the ones your CV mentions. They are listed in the order the posting stresses them, so the skills the employer cares about most come first.",
    },
    {
      q: "Why is a skill I have missing from the section?",
      a: "Because your CV never mentions it. The tool will not list a skill your CV cannot back up. It shows those in the gap list instead. If you have really used one, add a bullet that shows where, then run the tool again.",
    },
    {
      q: "How many skills should a CV list?",
      a: "Most CVs do well with 6 to 12. Past that the list stops being read. Pick the ones the job asks for and that your bullets prove.",
    },
    {
      q: "Hard skills or soft skills?",
      a: "Lead with hard skills: tools, methods and qualifications a recruiter can search for. Soft skills like communication are better shown in a bullet than listed, because anyone can type them.",
    },
    {
      q: "Do ATS systems read the skills section?",
      a: "Yes. Recruiters search an ATS for terms from the posting, and the skills section is an easy place for those terms to sit. Use the posting's exact wording, which is what this tool does.",
    },
    {
      q: "Is my CV uploaded anywhere?",
      a: "No. The PDF is read inside your browser tab and nothing is stored or sent to a server. Close the tab and it is gone.",
    },
  ],
  blocks: [
    { h2: "The posting decides the order" },
    {
      p: "A skills section is read in seconds, so the first few items carry it. **Put the skills the posting repeats first, in the employer's words.** If the advert says Power BI three times, Power BI goes near the front.",
    },
    {
      callout: {
        title: "Why every skill needs a bullet behind it",
        body: "A recruiter who sees a skill listed looks for it in your experience. If it is not there, the list reads as padding. This tool shows the line from your CV that proves each skill, and flags the ones with no proof.",
      },
    },

    { h2: "Skills section examples" },
    {
      table: {
        head: ["Role", "Skills section"],
        rows: [
          ["Data analyst", "SQL, Python, Tableau, Power BI, A/B testing, Excel, stakeholder reporting"],
          ["Nurse", "Triage, IV therapy, wound care, EPIC, discharge planning, patient education"],
          ["Software engineer", "TypeScript, React, Node.js, PostgreSQL, AWS, CI/CD, code review"],
          ["Marketing manager", "Paid social, HubSpot, email automation, SEO, Google Analytics, budget planning"],
          ["Project manager", "Agile, Jira, risk management, stakeholder management, budgeting, PRINCE2"],
        ],
      },
    },

    { h2: "What to do with the gap list" },
    {
      p: "The gap list is the skills the job asks for that your CV never mentions. If you have used one, add a bullet that shows it and it will move into your section. If you have not, leave it out. For the full vocabulary check, use [missing resume keywords](/missing-resume-keywords) or the [ATS resume checker](/ats-resume-checker).",
    },
    {
      cta: {
        title: "Want the whole CV to match, not just the skills?",
        body: "Paste the job link and FitMyCV tailors your CV and cover letter to that posting, using only your real experience.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting and see the terms you are missing.",
    },
    {
      label: "Interview questions from a job description",
      href: "/interview-questions-from-job-description",
      body: "The questions this job will ask, with proof from your CV.",
    },
    {
      label: "Professional summary generator",
      href: "/professional-summary-generator",
      body: "Three CV summaries built from the posting and your CV.",
    },
  ],
};
