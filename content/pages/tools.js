// Tool + optimiser landing pages.

export const atsResumeChecker = {
  slug: "ats-resume-checker",
  seoTitle: "Free ATS Resume Checker: No Sign-Up",
  description:
    "Free ATS resume checker with job description, no login. Paste a posting and your CV for a keyword match score. Nothing is uploaded. Unlimited checks.",
  keywords: [
    "ats resume checker",
    "free ats resume checker",
    "ats resume checker free online without login",
    "ats resume checker with job description free",
    "ats resume",
    "resume checker",
    "ats scanner",
    "check resume against job description",
    "resume keyword scanner",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "ATS resume checker",
  h1: "Free ATS resume checker",
  lede:
    "Free ATS resume checker, no sign-up and nothing uploaded. Paste a job description and your CV. See your keyword match score and the exact terms the posting expects that your CV never mentions, in about ten seconds.",
  ctas: [
    { label: "Tailor my CV instead", href: "/tailor-cv-from-job-link" },
    { label: "Read the ATS guide", href: "/blog/ats-resume-guide", variant: "secondary" },
  ],
  tool: "match",
  howTo: {
    name: "How to check your resume against an ATS",
    description:
      "Score your CV against a specific job posting and find the required keywords it is missing.",
    steps: [
      {
        name: "Paste the job description",
        text: "Copy the full text of the posting you are applying to and paste it into the job description box.",
      },
      {
        name: "Paste your CV text",
        text: "Open your CV, select all, copy, and paste it in. If the text pastes out of order, your layout will scramble in a real ATS too.",
      },
      {
        name: "Read the score and the gaps",
        text: "The checker returns a weighted keyword match score plus the terms the posting leans on that your CV never mentions. Add the ones you can honestly evidence.",
      },
    ],
  },
  faqs: [
    {
      q: "What is an ATS resume checker?",
      a: "An ATS resume checker compares your CV against a specific job description and reports how much of the posting's important vocabulary your CV actually contains. It is a diagnostic: it shows you the gap between what the employer asked for and what your CV says.",
    },
    {
      q: "Is this ATS checker really free?",
      a: "Yes, and there is no sign-up. The whole check runs in your browser using JavaScript on the page, so there is no account, no upload, and no usage limit.",
    },
    {
      q: "Does my CV get uploaded or stored anywhere?",
      a: "No. The text you paste never leaves your browser tab. There is no network request and nothing is written to a server. Close the tab and it is gone.",
    },
    {
      q: "What is a good ATS match score?",
      a: "As a rule of thumb, 75% and above means you are covering the posting's core vocabulary, 50 to 75% means a tailoring pass is worth the twenty minutes, and below 50% usually means either your CV is generic or the role is a genuine stretch. Treat it as a signal, not a grade.",
    },
    {
      q: "Should I add every missing keyword to my resume?",
      a: "Only the ones you can honestly evidence. Add each one inside a bullet that shows you used it and what happened, not as another entry in a skills list. Claiming tools you have never used simply moves the rejection to the interview.",
    },
    {
      q: "Why does my CV score badly when I am qualified for the role?",
      a: "Usually one of three reasons: you describe the same work in different words than the posting does, you spell out an acronym the posting abbreviates (or the reverse), or your most relevant evidence sits in an older role further down the page. All three are fixed by tailoring rather than by adding experience.",
    },
    {
      q: "Does a high score guarantee an interview?",
      a: "No. Keyword coverage gets your CV surfaced in a recruiter's search; the bullets are what earn the call. Once the score looks healthy, spend your remaining effort making sure each bullet has a specific action and a number attached.",
    },
  ],
  blocks: [
    { h2: "What this checker actually measures" },
    {
      p: "It extracts the terms the job description leans on: single words and two-word phrases, weighted by how often and how prominently they appear. Then it checks which of them appear anywhere in your CV text. The score is the weighted proportion covered.",
    },
    {
      p: "That is deliberately narrow. It tells you about **vocabulary overlap**, which is the thing that determines whether a recruiter's keyword search surfaces you. It does not judge your writing, your layout, or your experience.",
    },
    {
      callout: {
        title: "The copy-paste test comes free",
        body: "When you paste your CV in, look at what arrives. If sections land out of order or content is missing, that is exactly what an applicant tracking system will extract from your file, and it is a layout problem, not a keyword problem.",
      },
    },

    { h2: "What to do with a low score" },
    {
      ol: [
        "**Check the vocabulary first.** If the posting says *stakeholder management* and you wrote *keeping people informed*, you are describing the same work in words nobody searches for.",
        "**Spell out acronyms both ways.** Write \"search engine optimisation (SEO)\" so a literal search for either form finds you.",
        "**Move the relevant evidence up.** A perfect match buried in your third role does less than a partial match in your first two bullets.",
        "**Put keywords inside bullets, not just in a skills list.** A skills list is a claim; a bullet with a number is proof.",
        "**Then re-run the check.** Two or three passes usually moves a 40% into the 70s without inventing anything.",
      ],
    },

    { h2: "No login, no upload, unlimited checks" },
    {
      p: "The whole check runs in your browser using JavaScript on the page. There is no account wall, no email gate, and no file sent to a server. Close the tab and the text is gone. That is the difference between this page and checkers that ask you to sign up for two free scans.",
    },

    { h2: "Checker vs Jobscan vs a full rewrite" },
    {
      table: {
        head: ["", "This checker", "Jobscan", "Tailoring from a job link"],
        rows: [
          ["Needs an account", "No", "Yes", "Yes"],
          ["Uploads your file", "No", "Yes", "Yes, to your account"],
          ["Job-description matching", "Yes", "Yes", "Yes"],
          ["Rewrites the CV", "No", "No", "Yes"],
          ["Free limit", "Unlimited", "A few scans / month", "Paid generations"],
        ],
      },
    },
    {
      p: "Jobscan is the benchmark match rate. This page is the no-login diagnostic. If you want the rewrite as well, that is [tailoring from a job link](/tailor-cv-from-job-link). A longer comparison of free checkers is in [best free ATS resume checkers 2026](/blog/best-free-ats-resume-checkers-2026).",
    },

    { h2: "Checker, or tailoring?" },
    {
      p: "This page diagnoses. It does not rewrite. That distinction matters, because the rewrite is the part that takes twenty to forty minutes per role, which is why most people stop tailoring after a dozen applications.",
    },
    {
      table: {
        head: ["", "This checker", "Tailoring from a job link"],
        rows: [
          ["Tells you what is missing", "Yes", "Yes"],
          ["Rewrites your summary and bullets", "No", "Yes"],
          ["Writes a matching cover letter", "No", "Yes"],
          ["Reads a job URL directly", "No", "Yes"],
          ["Needs an account", "No", "Yes"],
          ["Exports a formatted PDF", "No", "Yes"],
        ],
      },
    },
    {
      p: "If you would rather skip the manual rewrite, [tailor your CV from the job link](/tailor-cv-from-job-link) instead. It reads the posting for you and produces the rewritten CV and cover letter directly. The [step-by-step tailoring guide](/blog/how-to-tailor-cv-to-job-description) covers the manual method in full if you prefer to do it yourself.",
    },
  ],
  related: [
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Paste the posting URL and get a rewritten CV and cover letter in under a minute.",
    },
    {
      label: "Free ATS keyword checker",
      href: "/free-ats-keyword-checker",
      body: "Only have the job description? Pull out the terms that matter before you write.",
    },
    {
      label: "The complete ATS resume guide",
      href: "/blog/ats-resume-guide",
      body: "Formatting, keywords, file types, and the mistakes that get CVs filtered out.",
    },
  ],
};

export const freeAtsKeywordChecker = {
  slug: "free-ats-keyword-checker",
  seoTitle: "Free ATS Keyword Checker for Job Postings",
  description:
    "Paste a job description and get the ranked list of keywords an applicant tracking system will index it by. Free, no sign-up, runs entirely in your browser.",
  keywords: [
    "ats keyword checker",
    "free ats keyword checker",
    "job description keyword extractor",
    "resume keyword finder",
    "ats keywords",
    "keyword scanner for resume",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "ATS keyword checker",
  h1: "Free ATS keyword checker",
  lede:
    "Paste any job description and get the ranked list of terms it actually leans on: the vocabulary a recruiter will search with and an ATS will index. No account, no email, no limit.",
  ctas: [
    { label: "Score my CV too", href: "/ats-resume-checker" },
    { label: "Tailor from a job link", href: "/tailor-cv-from-job-link", variant: "secondary" },
  ],
  tool: "keywords",
  faqs: [
    {
      q: "How do I find the keywords in a job description?",
      a: "Paste the full posting into the box above. The tool ranks single words and two-word phrases by how much weight the posting gives them, so the terms at the top are the ones repeated across the summary, the responsibilities, and the requirements.",
    },
    {
      q: "Which keywords matter most on a CV?",
      a: "The exact job title, named tools and technologies, certifications, and any phrase that appears in more than one section of the posting. Those are what recruiters type into a search box, and they are matched as literal strings rather than by meaning.",
    },
    {
      q: "How many keywords should I include?",
      a: "Cover the terms you can honestly evidence and stop there. Density targets are a myth. Repeating a term ten times does not outrank mentioning it once inside a bullet with a result attached, and it reads badly to the human at the end.",
    },
    {
      q: "Do I need to give my email to see the results?",
      a: "No. The full ranked list appears immediately and the extraction runs in your browser, so nothing is uploaded and there is nothing to gate.",
    },
    {
      q: "What is the difference between this and the ATS resume checker?",
      a: "This page only needs the job description and shows you what the posting is asking for. The ATS resume checker also takes your CV and scores how much of that vocabulary you already cover, plus what is missing.",
    },
  ],
  blocks: [
    { h2: "Why keyword extraction is the first step" },
    {
      p: "Before you rewrite a single bullet you need to know what the employer is actually asking for, not what the role is called, but which specific terms carry the weight. Postings bury this: a requirement mentioned once in a bullet list matters far less than a phrase repeated in the summary, the responsibilities, and the requirements.",
    },
    {
      p: "Ranking the terms makes that visible in a few seconds instead of two careful readings.",
    },

    { h2: "How to use the list" },
    {
      steps: [
        {
          title: "Sort into can, partly, and cannot",
          body: "Split the ranked terms into what you can strongly evidence, what you can weakly evidence, and what you cannot claim. The first group drives your rewrite; the third tells you whether the role is a genuine fit.",
        },
        {
          title: "Put the top terms in your summary",
          body: "Anything in the top five belongs in your professional summary, with evidence attached, not buried in your third bullet under your second job.",
        },
        {
          title: "Prove each term in a bullet",
          body: "A skills list is a claim. A bullet that names the tool, the action, and the number is proof. Aim for every important term to appear at least once as proof.",
        },
        {
          title: "Score the result",
          body: "Once you have rewritten, run the CV and the posting through the [ATS resume checker](/ats-resume-checker) to confirm the gap actually closed.",
        },
      ],
    },

    { h2: "A note on what this cannot do" },
    {
      p: "This is a frequency-and-phrase heuristic, not a language model. It is very good at showing you what a posting emphasises and completely unable to tell you whether *managed a P&L* and *owned the budget* mean the same thing in your industry. Use your judgement on synonyms, and read the [ATS resume guide](/blog/ats-resume-guide) for how keyword matching actually behaves inside a real system.",
    },
  ],
  related: [
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Add your CV and get a match score plus the terms you are missing.",
    },
    {
      label: "How to tailor your CV",
      href: "/blog/how-to-tailor-cv-to-job-description",
      body: "The step-by-step method, with a full before-and-after example.",
    },
    {
      label: "CV action verbs by industry",
      href: "/blog/cv-action-verbs-tech",
      body: "Verb lists for tech, marketing, finance, healthcare, and sales.",
    },
  ],
};

export const resumeOptimizer = {
  slug: "resume-optimizer",
  seoTitle: "AI Resume Optimizer: Rewrite Your CV for Any Job",
  description:
    "An AI resume optimizer that rewrites your CV against a specific job posting: keyword coverage, stronger bullets, and an ATS-safe PDF export.",
  keywords: [
    "resume optimizer",
    "resume optimizer tool",
    "ai resume writer",
    "optimize resume for ats",
    "ai resume optimizer",
    "improve my resume with ai",
  ],
  eyebrow: "Resume optimizer",
  breadcrumbName: "Resume optimizer",
  h1: "AI resume optimizer",
  lede:
    "Your CV is not broken. It is generic. FitMyCV rewrites the CV you already have against the specific posting you are applying to, so the right evidence leads and the right words are used.",
  ctas: [
    { label: "Optimize my CV", href: "/tailor-cv-from-job-link" },
    { label: "Check my score first", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What does a resume optimizer actually do?",
      a: "It takes a CV you already have and improves it against a target: stronger verbs, quantified bullets, sections ordered by relevance, and the vocabulary the posting uses. It does not invent experience. It changes which of your real experience leads and how it is described.",
    },
    {
      q: "Will an AI-optimized resume still sound like me?",
      a: "It should, and that is the test to apply. Good optimisation keeps your achievements, your numbers, and your register, and changes emphasis and phrasing. If the output reads like a press release full of superlatives with no specifics, edit it back.",
    },
    {
      q: "Can a resume optimizer fix a CV that keeps getting rejected?",
      a: "It fixes two of the three common causes: weak keyword coverage and buried relevance. It cannot fix a layout that scrambles when parsed, so if your CV is a two-column template with a sidebar, change that first. The third cause, a genuine experience gap, no tool can fix.",
    },
    {
      q: "Is it safe to run my CV through an AI tool?",
      a: "Check what each tool does with your data before uploading. FitMyCV stores your reference CV so you only upload it once, and you can delete it and your account at any time. Our free browser-based checkers never transmit anything at all.",
    },
    {
      q: "How is this different from a resume builder?",
      a: "A builder creates a document from scratch, usually starting from a template and a job title. An optimizer starts from the CV you already have and improves it against a specific posting. If you have no CV yet, start with a builder; if you have one that is not getting responses, optimise.",
    },
    {
      q: "How long does optimising a resume take?",
      a: "By hand, twenty to forty minutes per role: rereading the posting, remapping bullets, rewriting the summary. From a job link it is under a minute to a first draft, and then however long you want to spend reviewing and adjusting it.",
    },
  ],
  blocks: [
    { h2: "The three reasons a CV gets ignored" },
    {
      p: "Before optimising anything, it is worth knowing which problem you actually have. They need different fixes.",
    },
    {
      table: {
        head: ["Symptom", "Cause", "Fix"],
        rows: [
          [
            "No responses at all, across role types",
            "Layout scrambles on parse, or contact details are in the header",
            "Rebuild as single-column with details in the body",
          ],
          [
            "Responses for some roles, silence for others",
            "Generic CV that matches some postings by luck",
            "Tailor per posting, which is what an optimizer is for",
          ],
          [
            "Recruiter calls that go nowhere",
            "Bullets describe duties, not outcomes",
            "Rewrite bullets as verb, action, number",
          ],
        ],
      },
    },
    {
      p: "The [free ATS resume checker](/ats-resume-checker) tells you quickly which of these you are dealing with: paste your CV and see whether the text arrives intact and whether the vocabulary matches.",
    },

    { h2: "What the optimizer changes" },
    {
      ul: [
        "**The professional summary:** rewritten to name the target title and the two or three requirements the posting leans on hardest, with evidence attached.",
        "**Bullet order:** the bullets that answer the posting move to the top of each role, where they are actually read.",
        "**Bullet wording:** weak verbs replaced, duties converted into outcomes, and your numbers kept in place.",
        "**Vocabulary:** the posting's exact terms and acronyms used where they honestly apply, so recruiter searches surface you.",
        "**The skills section:** reordered around the must-haves and trimmed of anything irrelevant to this role.",
        "**Layout:** exported as a single-column, text-based PDF that survives extraction.",
      ],
    },
    {
      callout: {
        title: "What it never changes",
        body: "Your employers, your dates, your job titles, and your achievements. An optimizer that invents any of those is not optimising, and the interview will find it.",
      },
    },

    { h2: "How it works" },
    {
      steps: [
        {
          title: "Upload your CV once",
          body: "It becomes your reference CV, parsed into structured sections. You never upload it again.",
        },
        {
          title: "Paste the job link",
          body: "LinkedIn, Indeed, Glassdoor, or a company careers page. The posting is read and its requirements and vocabulary extracted.",
        },
        {
          title: "Review the rewrite",
          body: "Summary, bullets, and skills come back rewritten against that posting. Edit anything inline. It is your CV and your judgement about your own work is better than any model's.",
        },
        {
          title: "Export and apply",
          body: "Download an ATS-safe PDF of the CV and the matching cover letter, generated from the same posting so the two documents agree.",
        },
      ],
    },

    { h2: "Optimise for the posting, not for a score" },
    {
      p: "It is tempting to treat a match percentage as the goal. It is not. It is a proxy. A CV stuffed with terms you cannot defend scores well and interviews badly. The honest version of optimisation is: cover everything you can genuinely evidence, describe it in the words the employer uses, and put the strongest evidence where it gets read.",
    },
    {
      p: "If you would rather do all of that by hand, the [step-by-step tailoring guide](/blog/how-to-tailor-cv-to-job-description) is the same method written out, and the [ATS resume guide](/blog/ats-resume-guide) covers the formatting rules underneath it.",
    },
    {
      cta: {
        title: "Optimise your CV for the next role",
        body: "Paste the job link and see your CV rewritten against that specific posting.",
        href: "/tailor-cv-from-job-link",
        label: "Optimize my CV",
      },
    },
  ],
  related: [
    {
      label: "Tailor from a job link",
      href: "/tailor-cv-from-job-link",
      body: "The full flow: paste a posting URL, get a tailored CV and cover letter.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Find out which of the three problems your CV actually has.",
    },
    {
      label: "Cover letter builder",
      href: "/cover-letter-builder",
      body: "A matching cover letter written from the same job posting.",
    },
  ],
};
