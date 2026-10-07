// Landing pages for three CV-only free tools: format by country, weak words,
// and employment gaps. Each one ends in the CV handoff (components/tools/HandoffCta).

export const cvFormatChecker = {
  slug: "cv-format-checker",
  seoTitle: "CV Format Checker: South Africa, Nigeria, India, UK and US",
  description:
    "Check your CV format for the country you are applying in. Length, personal details, ID number, NYSC and more. Free, no sign-in, your CV stays in your browser.",
  keywords: [
    "cv format checker",
    "cv format south africa",
    "cv format nigeria",
    "resume format india",
    "uk cv format",
    "check my cv format",
    "cv format for job application",
    "what to include in a cv",
    "should i put my id number on my cv",
    "should i put my date of birth on my cv",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "CV format checker",
  h1: "CV format checker for South Africa, Nigeria, India, the UK and the US",
  lede:
    "A CV that is right in Lagos can be wrong in London. Pick the country you are applying in, add your CV, and see what to cut, add or move. It runs in your browser. Nothing is uploaded.",
  ctas: [
    { label: "Check my CV", href: "#tool" },
    { label: "Check it against a job", href: "/resume-job-match-checker", variant: "secondary" },
  ],
  tool: "cv-format",
  howTo: {
    name: "How to check your CV format for a country",
    description: "Check a CV against the format employers in one country expect.",
    steps: [
      { name: "Pick the country", text: "Choose where the job is, not where you live." },
      { name: "Add your CV", text: "Drop a PDF or paste the text. It is read in your browser." },
      { name: "Fix what it flags", text: "Each check says what to change. Fix those, then check again." },
    ],
  },
  faqs: [
    {
      q: "Should I put my ID number on my CV in South Africa?",
      a: "No. Share it when an employer asks, usually at offer stage. Your ID number is personal information under POPIA, and a CV gets forwarded and stored in places you cannot see.",
    },
    {
      q: "Should I put my date of birth on my CV?",
      a: "In the UK and the US, no. Employers there do not expect it. In Nigeria and India some postings ask for it. Add it only when the posting asks.",
    },
    {
      q: "How long should my CV be?",
      a: "Two pages covers most people in every country the checker supports. Graduates should aim for one. The checker estimates your length from the word count, see [how long a CV should be](/blog/how-long-should-a-cv-be).",
    },
    {
      q: "Should I add a photo?",
      a: "Leave it off unless the posting asks. The checker reads text, so it cannot see a photo, but this is the rule in every country it covers.",
    },
    {
      q: "Is my CV uploaded anywhere?",
      a: "No. The PDF is read in your browser tab and the checks run there. Nothing is sent to FitMyCV or stored.",
    },
  ],
  blocks: [
    { h2: "What the checker looks at" },
    {
      ul: [
        "**Length** against what employers in that country expect.",
        "**Personal details** such as date of birth, marital status and religion, which help in some countries and hurt in others.",
        "**ID number** for South Africa, and **NYSC status** for Nigeria.",
        "**A career objective** where a professional summary works better.",
        "**Filler lines** like \"references available on request\" and the Indian \"I hereby declare\" line.",
      ],
    },
    { h2: "Country guides" },
    {
      p: "For the full picture, read [CV format in South Africa](/blog/cv-format-south-africa) and [CV format in Nigeria](/blog/cv-format-nigeria).",
    },
    {
      cta: {
        title: "Format done? Fit it to the job.",
        body: "A clean format gets you read. Matching the posting gets you shortlisted.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV from a job link",
      },
    },
  ],
  related: [
    { label: "Resume job match checker", href: "/resume-job-match-checker", body: "Score your CV against a job description." },
    { label: "Weak words checker", href: "/resume-weak-words-checker", body: "Find the clichés that make a CV blend in." },
    { label: "CV templates", href: "/cv-templates", body: "Clean layouts that read well in any country." },
  ],
};

export const resumeWeakWordsChecker = {
  slug: "resume-weak-words-checker",
  seoTitle: "Resume Weak Words Checker: Find Buzzwords and Clichés",
  description:
    "Find the buzzwords, clichés and duty phrases in your resume, with what to write instead. Free, no sign-in, runs in your browser.",
  keywords: [
    "resume weak words",
    "resume buzzwords",
    "words to avoid on a resume",
    "resume cliches",
    "resume buzzword checker",
    "weak verbs resume",
    "responsible for alternative",
    "cv buzzwords to avoid",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Weak words checker",
  h1: "Resume weak words checker",
  lede:
    "\"Hard-working team player, responsible for various tasks.\" Every recruiter has read that line a thousand times. Add your CV and see every phrase that makes it blend in, with what to write instead.",
  ctas: [
    { label: "Check my CV", href: "#tool" },
    { label: "Rewrite a bullet", href: "/resume-bullet-rewriter", variant: "secondary" },
  ],
  tool: "weak-words",
  howTo: {
    name: "How to remove weak words from a resume",
    description: "Find and replace the phrases that make a CV generic.",
    steps: [
      { name: "Add your CV", text: "Drop a PDF or paste the text." },
      { name: "Read the list", text: "Each phrase shows how often it appears, where, and what to write instead." },
      { name: "Replace with proof", text: "Swap each one for a verb and a result. A number beats an adjective." },
    ],
  },
  faqs: [
    {
      q: "What should I write instead of \"responsible for\"?",
      a: "A verb that says what you did, then the result. \"Responsible for payroll\" becomes \"Ran payroll for 120 staff with no late payments in two years\". The [bullet rewriter](/resume-bullet-rewriter) does this one line at a time.",
    },
    {
      q: "Are buzzwords always bad?",
      a: "Yes, when they stand alone. \"Detail-oriented\" is a claim nobody can check. Proof of it, like an audit you passed, does the job the word was trying to do.",
    },
    {
      q: "Does the checker find every weak word?",
      a: "No. It checks a fixed list of the most common ones. It will not catch a vague sentence built from ordinary words, so read your bullets aloud too.",
    },
    {
      q: "Why does it count lines with numbers?",
      a: "Because a number is the fastest proof. If fewer than a third of your longer lines have one, the checker tells you to add some.",
    },
    {
      q: "Is my CV stored?",
      a: "No. It is read in your browser tab and never sent anywhere.",
    },
  ],
  blocks: [
    { h2: "Three kinds of weak words" },
    {
      ul: [
        "**Duty phrases** like \"responsible for\" and \"duties included\" describe the job, not what you did in it.",
        "**Vague verbs** like \"helped\", \"worked on\" and \"handled\" hide your share of the work.",
        "**Clichés** like \"team player\" and \"results-driven\" are claims with no proof attached.",
      ],
    },
    {
      compare: {
        title: "One bullet, before and after",
        context: "Customer service role",
        before: "Responsible for handling customer complaints and helped the team with various tasks.",
        after: "Resolved 40 customer complaints a week and cut repeat complaints by a quarter by rewriting the reply templates.",
      },
    },
    {
      p: "Action verbs by field: [tech](/blog/cv-action-verbs-tech), [sales](/blog/cv-action-verbs-sales), [marketing](/blog/cv-action-verbs-marketing), [finance](/blog/cv-action-verbs-finance) and [healthcare](/blog/cv-action-verbs-healthcare).",
    },
  ],
  related: [
    { label: "Resume bullet rewriter", href: "/resume-bullet-rewriter", body: "Turn a duty into an achievement bullet." },
    { label: "ATS resume checker", href: "/ats-resume-checker", body: "See which required terms your CV is missing." },
    { label: "CV format checker", href: "/cv-format-checker", body: "Check your CV for the country you are applying in." },
  ],
};

export const employmentGapExplanationGenerator = {
  slug: "employment-gap-explanation-generator",
  seoTitle: "Employment Gap Explanation Generator: CV, Cover Letter, Interview",
  description:
    "Explain a gap in your employment in one honest line. Get the wording for your CV, your cover letter and the interview. Free, no sign-in.",
  keywords: [
    "employment gap explanation",
    "how to explain a gap in employment",
    "career break on cv",
    "employment gap on resume",
    "gap in employment cover letter",
    "explain employment gap interview",
    "career gap explanation examples",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Employment gap explainer",
  h1: "Employment gap explanation generator",
  lede:
    "A gap only hurts when it looks hidden. Pick why you were away and when, and get one honest line for your CV, one for your cover letter and a short answer for the interview.",
  ctas: [
    { label: "Explain my gap", href: "#tool" },
    { label: "Read the full guide", href: "/blog/how-to-explain-employment-gap-on-cv", variant: "secondary" },
  ],
  tool: "gap",
  howTo: {
    name: "How to explain an employment gap",
    description: "Write a short, honest explanation of a career break.",
    steps: [
      { name: "Pick the reason", text: "Choose the one that is true. You do not owe details." },
      { name: "Add the dates", text: "Month and year for the start and end." },
      { name: "Copy the lines", text: "Use the CV line in your timeline, the letter line once, and practise the answer out loud." },
    ],
  },
  faqs: [
    {
      q: "Should I explain an employment gap on my CV?",
      a: "Yes, when it is longer than about three months. One line in your timeline stops a recruiter guessing. Shorter gaps rarely need anything, especially if your dates show years only.",
    },
    {
      q: "How much detail should I give about a health gap?",
      a: "Almost none. \"Health and recovery, now resolved\" is enough. You do not have to name a condition, and the useful part is that it will not affect your work.",
    },
    {
      q: "What if I was laid off?",
      a: "Say so plainly. Restructures are common and recruiters know it. What they want to hear is that you are choosing your next role on purpose.",
    },
    {
      q: "Should I mention courses or volunteering from the gap?",
      a: "Yes. Add it in the optional field. It turns the gap from time away into time used.",
    },
    {
      q: "Is anything I type stored?",
      a: "No. The text is built in your browser from templates. Nothing is sent anywhere.",
    },
  ],
  blocks: [
    { h2: "The rule: short, true, and about now" },
    {
      p: "Recruiters are not asking why you left. They are asking if you are ready to work. Every line this tool writes ends there.",
    },
    {
      p: "For examples by situation, read [how to explain an employment gap on your CV](/blog/how-to-explain-employment-gap-on-cv).",
    },
  ],
  related: [
    { label: "CV format checker", href: "/cv-format-checker", body: "Check your CV for the country you are applying in." },
    { label: "Resume job match checker", href: "/resume-job-match-checker", body: "Score your CV against a job description." },
    { label: "Professional summary generator", href: "/professional-summary-generator", body: "Three CV summaries built from a posting and your CV." },
  ],
};
