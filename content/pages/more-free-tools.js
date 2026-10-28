// Three free tools picked from Search Console demand: a CV checker for people
// who say CV (same engine as /ats-resume-checker), a job application letter
// generator next to the best ranking blog post, and a keywords generator for
// the role keyword lists. Each result ends in a "Close these gaps" handoff.
import ROLES from "@/content/resume-keywords";

export const cvChecker = {
  slug: "cv-checker",
  seoTitle: "Free CV Checker: No Login, Check Your CV Against a Job",
  description:
    "Free CV checker, no login. Upload your CV and paste the job advert. See your match score and the terms your CV is missing. Your CV is read in your browser.",
  keywords: [
    "cv checker",
    "free cv checker",
    "check my cv",
    "ats cv checker",
    "free ats cv checker",
    "cv checker no login",
    "cv checker against job description",
    "cv scanner",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "CV checker",
  h1: "Free CV checker, no login",
  lede:
    "Upload your CV and paste the job advert. See your match score and the exact terms the employer asked for that your CV never mentions. No account, no limit.",
  ctas: [{ label: "Check my CV", href: "#tool" }],
  tool: "match",
  howTo: {
    name: "How to check your CV against a job advert",
    description: "Score your CV against one advert and find the terms it is missing.",
    steps: [
      {
        name: "Paste the job advert",
        text: "Copy the whole advert, including the requirements, and paste it into the job description box.",
      },
      {
        name: "Upload your CV",
        text: "Drop the PDF. The text is read in your browser. If it comes out jumbled, an applicant tracking system will read it jumbled too.",
      },
      {
        name: "Fix the gaps you can back up",
        text: "Add each missing term you have really used to a bullet with a result, then check again.",
      },
    ],
  },
  faqs: [
    {
      q: "Is this CV checker free?",
      a: "Yes. There is no account and no limit on checks. The check runs in your browser.",
    },
    {
      q: "Is my CV uploaded anywhere?",
      a: "No. The PDF is read in this tab and nothing is stored. Close the tab and it is gone.",
    },
    {
      q: "Is a CV checker the same as an ATS resume checker?",
      a: "Yes. A CV and a resume do the same job when you apply, and this page uses the same check as our ATS resume checker. The name you search for depends on where you live.",
    },
    {
      q: "What is a good score?",
      a: "75% and above means you cover most of the advert's key terms. 50% to 75% means a tailoring pass is worth it. Below 50% usually means the CV is generic for this role.",
    },
    {
      q: "Should I add every missing term?",
      a: "Only the ones you have really done. Put each one in a bullet that shows what you did and what happened. Claiming a skill you do not have only moves the rejection to the interview.",
    },
  ],
  blocks: [
    { h2: "What the CV checker looks at" },
    {
      p: "It pulls the words and two word phrases the advert repeats, weighted by how often they appear, and checks which of them are in your CV. The score is the share it finds. It checks wording, not your writing or your layout.",
    },
    { h2: "Why a qualified CV can score low" },
    {
      ul: [
        "You describe the work in different words from the advert.",
        "You use an abbreviation the advert spells out, or the other way round.",
        "Your best evidence sits in an older role near the bottom of the page.",
      ],
    },
    {
      p: "All three are fixed by tailoring the CV to the advert, not by adding experience. The [guide to tailoring a CV to a job description](/blog/how-to-tailor-cv-to-job-description) covers how to do it yourself.",
    },
  ],
  related: [
    { label: "ATS resume checker", href: "/ats-resume-checker", body: "The same check, with a comparison to Jobscan." },
    { label: "CV format checker", href: "/cv-format-checker", body: "Check your CV for the country you are applying in." },
    { label: "Job application letter generator", href: "/job-application-letter-generator", body: "A letter built from the advert and your CV." },
  ],
};

export const jobApplicationLetterGenerator = {
  slug: "job-application-letter-generator",
  seoTitle: "Job Application Letter Generator: Free, No Login",
  description:
    "Paste the job advert and upload your CV. Get a simple job application letter that uses your real skills and results. Free, no login, nothing stored.",
  keywords: [
    "job application letter generator",
    "application letter generator",
    "application letter for a job",
    "simple job application letter",
    "short job application letter",
    "how to write application letter for a job",
    "job application letter example",
    "application letter for employment",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Job application letter generator",
  h1: "Job application letter generator",
  lede:
    "Paste the job advert and upload your CV. Get a full letter and a short one, built only from skills and results your CV already shows. No login, nothing stored.",
  ctas: [{ label: "Write my letter", href: "#tool" }],
  tool: "letter-from-cv",
  howTo: {
    name: "How to write a job application letter",
    description: "Build a simple application letter from the job advert and your own CV.",
    steps: [
      {
        name: "Paste the job advert",
        text: "The tool reads the job title and the terms the advert repeats.",
      },
      {
        name: "Upload your CV",
        text: "The text is read in your browser. A skill that is not in your CV never appears in the letter.",
      },
      {
        name: "Check it and send it",
        text: "Add the company name and your name, check every claim, and copy the letter into your email or a document.",
      },
    ],
  },
  faqs: [
    {
      q: "What is a job application letter?",
      a: "It is a short letter that says which job you are applying for, why you fit, and asks for an interview. In many countries it is the same thing as a cover letter.",
    },
    {
      q: "How long should an application letter be?",
      a: "Three or four short paragraphs, under one page. The short version on this page is for an email or a small form box.",
    },
    {
      q: "Does the generator make anything up?",
      a: "No. The job title comes from the advert, every skill appears in both the advert and your CV, and every result is a line copied from your CV. Where your CV has no result with a number, the letter leaves a gap for you to fill.",
    },
    {
      q: "Is my CV stored?",
      a: "No. The letter is built in your browser and nothing is sent anywhere.",
    },
    {
      q: "Who do I address the letter to?",
      a: "Use the hiring manager's name if the advert gives it. If not, \"Dear Hiring Manager\" is fine.",
    },
  ],
  blocks: [
    { h2: "The shape of a simple application letter" },
    {
      ol: [
        "**Say the job.** Name the role and the company in the first line.",
        "**Show the fit.** Name the skills the advert asks for that you have used, then give one result with a number.",
        "**Ask for the interview.** One line, then thank them.",
      ],
    },
    {
      p: "For more examples and a format you can copy, read the [job application letter guide](/blog/job-application-letter). To send it by email, see [how to email a job application](/blog/how-to-email-a-job-application).",
    },
  ],
  related: [
    { label: "Job application letter guide", href: "/blog/job-application-letter", body: "Format, examples and what to leave out." },
    { label: "CV checker", href: "/cv-checker", body: "See which terms in the advert your CV is missing." },
    { label: "Professional summary generator", href: "/professional-summary-generator", body: "Three CV summaries built from a posting and your CV." },
  ],
};

export const resumeKeywordsGenerator = {
  slug: "resume-keywords-generator",
  seoTitle: "Resume Keywords Generator by Job Title: Free",
  description:
    "Pick your job title and get the resume keywords employers use, grouped by where they go. Upload your CV to see which ones you are missing. Free, no login.",
  keywords: [
    "resume keywords generator",
    "resume keywords by job title",
    "cv keywords generator",
    "keywords for resume",
    "ats keywords generator",
    "resume skills generator",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Resume keywords generator",
  h1: "Resume keywords generator",
  lede:
    "Pick your job title and get the keywords postings for that role use, grouped by where they belong. Then upload your CV to see which ones it is missing.",
  ctas: [{ label: "Get my keywords", href: "#tool" }],
  tool: "keywords-generator",
  // Only what the generator renders, so the page prose for each role stays on
  // the server.
  toolProps: {
    roles: ROLES.map(({ slug, role, plural, groups }) => ({
      slug,
      role,
      plural,
      groups: groups.map(({ title, terms }) => ({ title, terms })),
    })),
  },
  howTo: {
    name: "How to find keywords for your resume",
    description: "Get the keywords for your role and check your CV against them.",
    steps: [
      { name: "Pick your job title", text: "The list shows the terms postings for that role use, grouped by type." },
      { name: "Upload your CV", text: "Each term is marked as covered or missing. The CV is read in your browser." },
      { name: "Add the ones you have done", text: "Put each missing term you can back up inside a bullet with a result." },
    ],
  },
  faqs: [
    {
      q: "Where do these keywords come from?",
      a: "They are the lists on our per role keyword pages, built from the terms job postings for each role repeat. Each one links to its full page.",
    },
    {
      q: "My job title is not listed. What now?",
      a: "Paste the job advert into the free ATS keyword checker. It pulls the keywords from that exact posting, which beats any general list.",
    },
    {
      q: "Is my CV stored?",
      a: "No. It is read in this tab and nothing is sent anywhere.",
    },
  ],
  blocks: [
    { h2: "A list is a start, the advert decides" },
    {
      p: "Every posting weights these terms differently. Use the list to find what your CV leaves out, then check against the real advert with the [CV checker](/cv-checker) before you apply.",
    },
  ],
  related: [
    { label: "All resume keyword lists", href: "/resume-keywords", body: "Every role, with examples of each term in a bullet." },
    { label: "ATS keyword checker", href: "/free-ats-keyword-checker", body: "Pull the keywords out of any job advert." },
    { label: "CV checker", href: "/cv-checker", body: "Score your CV against one job advert." },
  ],
};
