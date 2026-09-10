// Resume headline generator landing page.
// The differentiator is that the tool reads the posting and the CV together,
// so a headline never claims a skill the CV cannot evidence.

export const resumeHeadlineGenerator = {
  slug: "resume-headline-generator",
  seoTitle: "Resume Headline Generator: Free, Job Description Aware",
  description:
    "Upload your resume and paste a job description. Get five resume headlines built only from skills your CV actually evidences. Free, no login. The file is read in your browser.",
  keywords: [
    "resume headline generator",
    "resume title generator",
    "resume headline for job",
    "resume title for job",
    "professional resume headline",
    "resume headline examples",
    "resume title examples",
    "ats resume headline",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Resume headline generator",
  h1: "Resume headline generator",
  lede:
    "Upload your resume and paste the job description. Get five headlines in five different shapes, built only from skills your CV can actually back up, with the role title taken from the posting itself.",
  ctas: [
    { label: "Generate my headlines", href: "#tool" },
    {
      label: "Tailor my whole CV",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "headline",
  howTo: {
    name: "How to write a resume headline for a specific job",
    description:
      "Build a resume headline from the target posting and your own experience.",
    steps: [
      {
        name: "Paste the job description",
        text: "The tool reads the role title and the terms the posting leans on. Paste the whole advert, including the requirements section.",
      },
      {
        name: "Upload your resume",
        text: "Drop the PDF. We pull the text out so you do not have to copy it. A skill that is not in your CV never appears in a headline.",
      },
      {
        name: "Pick a shape and edit it",
        text: "Five headlines come back in five different shapes. Copy the one that fits, then cut anything you would not want to be asked about in an interview.",
      },
    ],
  },
  faqs: [
    {
      q: "What is a resume headline?",
      a: "A resume headline is the one line under your name at the top of your CV. It states the role you are applying for and two or three things that make you credible for it. It is not a summary, which is two or three sentences, and it is not an objective, which states what you want rather than what you offer.",
    },
    {
      q: "How is a resume headline different from a resume title?",
      a: "In practice people use the two words for the same line, and this tool treats them the same. The only useful distinction: a title is usually just the role ('Senior Backend Engineer'), while a headline adds the evidence ('Senior Backend Engineer, Go and Kubernetes, Payments Infrastructure'). If a form asks for a title, give it the role. If you are writing the top of your CV, use the headline.",
    },
    {
      q: "Is a resume headline the same as a LinkedIn headline?",
      a: "They serve different jobs. A LinkedIn headline is one line for every recruiter who finds you, so it stays general. A resume headline sits on a CV you are sending to one employer, so it should name that specific role. Reusing your LinkedIn headline on a CV is the most common way this line gets wasted.",
    },
    {
      q: "Why does this generator ask for the job description?",
      a: "Because a headline that does not name the role you are applying for is doing half a job. The posting tells the tool the exact title the employer uses and the terms they lean on. A generic AI headline generator has neither, so it guesses.",
    },
    {
      q: "Will it claim skills I do not have?",
      a: "No. Every skill in a generated headline has to appear in both the posting and your resume text. The tool shows you the split: what matched, and what the posting wants that your CV never mentions. The second list is a to-do, not headline material.",
    },
    {
      q: "How long should a resume headline be?",
      a: "One line that survives at the top of a page, so roughly 60 to 90 characters. If it wraps onto a second line on your CV, cut the weakest item. Three skills is the practical ceiling before the line stops being scannable.",
    },
    {
      q: "Do applicant tracking systems read the headline?",
      a: "They read it as text like any other line, and it sits at the very top where a human reviewer looks first. Keep it as plain text in the body of the document rather than inside a header, a text box, or an image, because those are the places parsers commonly miss.",
    },
  ],
  blocks: [
    { h2: "The line most people waste" },
    {
      p: "The top of a CV is the only part every reader sees. Most people fill it with a job title copied from their last role, or worse, with the word 'Resume'. **A headline should tell the employer which of their roles you are here for and why you are credible for it**, in one line, before anyone scrolls.",
    },
    {
      p: "That is why this generator asks for the posting as well as your CV. The role title comes from the advert, in the employer's own words. The skills come from the overlap between what they asked for and what you can evidence.",
    },

    { h2: "Five shapes, and when each one fits" },
    {
      steps: [
        {
          title: "Title plus three skills",
          body: "'Senior Backend Engineer | Go, Kubernetes, Payments'. The default. Scannable, keyword dense, works on almost every CV.",
        },
        {
          title: "Seniority plus title plus domain",
          body: "Use when the industry matters as much as the craft. Healthcare, fintech, defence, education and public sector hiring all read domain first.",
        },
        {
          title: "Title plus years plus one strength",
          body: "Use when your experience is the strongest thing you have, and only when the years are genuinely on your CV.",
        },
        {
          title: "Outcome framing",
          body: "Leads with what you deliver rather than what you are called. Useful for career changers whose old job title works against them.",
        },
        {
          title: "Plain, no pipes",
          body: "A clean sentence for a CV header where the line sits above your contact details and pipes would clutter it.",
        },
      ],
    },

    { h2: "Resume headline examples by role" },
    {
      p: "Real shapes rather than filler. Notice that every one names a role and then earns it with something specific.",
    },
    {
      table: {
        head: ["Role", "Headline"],
        rows: [
          [
            "Software engineer",
            "Senior Backend Engineer | Go, Kubernetes, Payments Infrastructure",
          ],
          [
            "Graduate engineer",
            "Junior Software Developer | Python and React | 3 Shipped Team Projects",
          ],
          [
            "Marketing manager",
            "Digital Marketing Manager | Paid Social, Lifecycle Email, HubSpot",
          ],
          [
            "Accountant",
            "Management Accountant, Month End Close and Cash Flow Forecasting",
          ],
          [
            "Registered nurse",
            "Registered Nurse | 8+ Years | Acute Medical and Triage",
          ],
          [
            "Product designer",
            "Product Designer Focused on Design Systems and Accessibility",
          ],
          [
            "Project manager",
            "PMP Certified Project Manager | Construction | 20M Budgets",
          ],
          [
            "Career changer",
            "Data Analyst | Ten Years in Retail Operations | SQL and Power BI",
          ],
          [
            "Customer support",
            "Customer Support Specialist | Zendesk | SaaS Onboarding and Retention",
          ],
          [
            "Teacher",
            "Secondary Mathematics Teacher | GCSE and A Level | Intervention Design",
          ],
        ],
      },
    },
    {
      callout: {
        title: "Match the employer's job title, not your old one",
        body: "If the posting says Growth Marketer and your last title was Marketing Executive, lead with Growth Marketer. You are not lying about your history, which the experience section states plainly. You are telling the reader which role this application is for.",
      },
    },

    { h2: "Headline, title, summary or objective" },
    {
      table: {
        head: ["", "Length", "Says", "Use it when"],
        rows: [
          [
            "Headline",
            "One line",
            "The role plus two or three proofs",
            "Almost always. It is the default top line of a CV.",
          ],
          [
            "Title",
            "Two to four words",
            "Just the role",
            "A form field asks for a title, or your CV design has no room.",
          ],
          [
            "Summary",
            "Two to three sentences",
            "Scope, specialism and a headline result",
            "You are senior, or you are changing field and the jump needs explaining.",
          ],
          [
            "Objective",
            "One to two sentences",
            "What you are looking for",
            "Rarely. It uses prime space to talk about you rather than the employer.",
          ],
        ],
      },
    },
    {
      p: "A headline and a summary can sit together, in that order. A headline and an objective compete for the same job and the objective loses.",
    },

    { h2: "Five ways a headline goes wrong" },
    {
      ol: [
        "**It says 'Resume' or your name again.** The file already says that. Use the line for something the reader does not have.",
        "**It is a list of adjectives.** 'Hardworking, detail oriented, team player' is unverifiable and every applicant claims it. Name a skill instead.",
        "**It is your LinkedIn headline.** Written for everyone, so it names no role. On a CV going to one employer, that is a miss.",
        "**It claims a tool you have used once.** The headline is the first thing an interviewer probes. Only put things there you want to be asked about.",
        "**It lives in the document header.** Some parsers skip headers and text boxes entirely. Keep the line in the body of the document.",
      ],
    },

    { h2: "Where the headline sits in a bigger fix" },
    {
      p: "A headline is the cheapest improvement on a CV and the smallest. It changes the first two seconds. It does not change what a recruiter finds when they search their applicant tracking system, and it does not change whether your bullets carry evidence.",
    },
    {
      p: "Once the top line is right, check the vocabulary gap with [missing resume keywords](/missing-resume-keywords), then work down the page with the [resume bullet rewriter](/resume-bullet-rewriter). If you would rather have all three done against one posting, that is [tailoring from a job link](/tailor-cv-from-job-link).",
    },
    {
      cta: {
        title: "Headline right, rest of the page still generic?",
        body: "Paste the job link and FitMyCV rewrites the whole CV against that posting, headline included, and writes the matching cover letter.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Resume bullet rewriter",
      href: "/resume-bullet-rewriter",
      body: "Turn a duty into an achievement bullet, one line at a time.",
    },
    {
      label: "Missing resume keywords",
      href: "/missing-resume-keywords",
      body: "See which of the posting's terms your CV never mentions.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting and see the terms you are missing.",
    },
  ],
};
