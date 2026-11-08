// Interview questions generator landing page.
// Same promise as the summary generator: the posting decides the questions
// and the CV decides the proof, so nothing is invented. It fills templates;
// it does not write answers, so the copy never calls it AI.

export const interviewQuestionsFromJobDescription = {
  slug: "interview-questions-from-job-description",
  seoTitle: "Interview Questions From a Job Description, Free",
  description:
    "Paste a job description and upload your CV. See the questions this job will ask, the line from your CV that answers each, and the gaps to prepare for.",
  keywords: [
    "interview questions from job description",
    "interview questions generator",
    "job description interview questions",
    "interview questions based on job description",
    "interview prep from job description",
    "likely interview questions",
    "interview question generator from resume",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Interview questions from a job description",
  h1: "Interview questions from a job description",
  lede:
    "Paste the job description and upload your CV. Get the questions this job is likely to ask, the line from your own CV that answers each one, and the skills they want that your CV does not show yet. No login, nothing stored.",
  ctas: [
    { label: "Get my questions", href: "#tool" },
    {
      label: "Tailor my CV first",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "interview",
  howTo: {
    name: "How to predict interview questions from a job description",
    description:
      "Turn the job posting and your CV into a list of likely questions with proof from your own experience.",
    steps: [
      {
        name: "Paste the job description",
        text: "Paste the whole advert, including the requirements. The tool reads the role title and the skills the posting repeats.",
      },
      {
        name: "Upload your CV",
        text: "Drop the PDF. The text is read in your browser and nothing is stored.",
      },
      {
        name: "Prepare one story per question",
        text: "Each question comes with the line from your CV that answers it. Build a short story around that line, and prepare an honest answer for every gap.",
      },
    ],
  },
  faqs: [
    {
      q: "How does this tool pick the questions?",
      a: "It reads the job title and the skills the posting repeats, then checks which of them your CV mentions. Skills on both lists become questions with a proof line from your CV. Skills only in the posting become gap questions, because an interviewer will ask about them.",
    },
    {
      q: "Does it write my answers for me?",
      a: "No. It shows you the line from your own CV that answers each question, and how to shape it. The words in the interview should be yours, and an answer built on your real work is easier to defend when they ask a follow up.",
    },
    {
      q: "What questions come up in almost every interview?",
      a: "Tell me about yourself, why do you want this role, tell me about a time you solved a hard problem, what is your biggest weakness, and where do you see yourself in a few years. This tool adds the questions specific to the job you paste.",
    },
    {
      q: "What should I do about the gap questions?",
      a: "If you have used the skill and your CV just does not say so, add it to your CV before you apply. If you have not, prepare an honest answer about the closest thing you have done and how you would learn it. Never claim a skill you cannot talk about for two minutes.",
    },
    {
      q: "What is the STAR method?",
      a: "Situation, task, action, result. Set the scene in one sentence, say what you had to do, spend most of the time on what you did, and finish on the result. Your CV line is usually the result, so build the story backwards from it.",
    },
    {
      q: "Is my CV uploaded anywhere?",
      a: "No. The PDF is read inside your browser tab and nothing is stored or sent to a server. Close the tab and it is gone.",
    },
  ],
  blocks: [
    { h2: "The posting tells you what they will ask" },
    {
      p: "Interviewers work from the job description. The skills it repeats are the skills they have to check, so they become questions. **If a skill appears three times in the posting, expect to be asked about it.**",
    },
    {
      ol: [
        "**Role questions.** Why this role, and walk me through your CV. Every interview has them.",
        "**Skill questions.** Tell me about a time you used a skill the posting asks for. Your CV should already hold the answer.",
        "**Gap questions.** The posting asks for something your CV never mentions. These are the ones that catch people out.",
      ],
    },
    {
      callout: {
        title: "Why the proof comes from your CV",
        body: "The interviewer has your CV in front of them. A story that matches a line on the page is believed. A story that does not raises a question. This tool only uses lines it finds in your own CV.",
      },
    },

    { h2: "How to answer a skill question" },
    {
      table: {
        head: ["Step", "What to say", "Length"],
        rows: [
          ["Situation", "Where you were and what was going on", "One sentence"],
          ["Task", "What you had to get done", "One sentence"],
          ["Action", "What you did, in the first person", "Most of the answer"],
          ["Result", "What changed, with a number if you have one", "One or two sentences"],
        ],
      },
    },

    { h2: "Fix the gaps before the interview, not during it" },
    {
      p: "A gap question in the interview often means a gap on the CV first. If the posting asks for something you have done and your CV does not say so, the recruiter may never invite you. Check the full list of missing terms with [missing resume keywords](/missing-resume-keywords), or score your CV against the posting with the [ATS resume checker](/ats-resume-checker).",
    },
    {
      cta: {
        title: "Want your CV to answer these questions for you?",
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
      label: "Professional summary generator",
      href: "/professional-summary-generator",
      body: "Three CV summaries built from the posting and your CV.",
    },
    {
      label: "Resume bullet rewriter",
      href: "/resume-bullet-rewriter",
      body: "Turn a duty into an achievement bullet you can talk about.",
    },
  ],
};
