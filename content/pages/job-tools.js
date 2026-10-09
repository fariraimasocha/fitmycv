// Free tools that start from a job link: the posting saver and the ATS
// lookup. The saver is a normal registry page. The lookup page object is
// rendered by app/ats/page.js, which adds the company list under the tool,
// so it is not in MARKETING_PAGES.

export const saveJobPostingAsPdf = {
  slug: "save-job-posting-as-pdf",
  seoTitle: "Save a Job Posting as PDF: Free, No Login",
  description:
    "Paste a job link from LinkedIn or a company careers page and keep the full posting as a PDF before it comes down. Free, no sign-up.",
  keywords: [
    "save job posting as pdf",
    "download linkedin job description",
    "save linkedin job description",
    "job description pdf",
    "save job posting",
    "keep job description after it closes",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Save job posting as PDF",
  h1: "Save a job posting as PDF",
  lede:
    "Paste the job link. We read the posting and give you its full text to save as a PDF or copy, so you still have it when the listing comes down.",
  ctas: [{ label: "Save a posting", href: "#tool" }],
  tool: "job-save",
  howTo: {
    name: "How to save a job posting as a PDF",
    description: "Keep a copy of a job description before the listing is removed.",
    steps: [
      {
        name: "Copy the job link",
        text: "Open the posting and copy the address from your browser bar. A LinkedIn job link works, and so does a link to a company careers page or a job board.",
      },
      {
        name: "Paste it and save",
        text: "The tool reads the page and shows the posting's text with the link and the date you saved it.",
      },
      {
        name: "Download the PDF",
        text: "Click Save as PDF and choose Save as PDF as the destination in the print window. Only the posting is printed.",
      },
    ],
  },
  faqs: [
    {
      q: "Why save a job posting at all?",
      a: "Employers take listings down when the role closes, often before your interview. The description is the best guide to what they will ask, so keep a copy the day you apply.",
    },
    {
      q: "Does it work with LinkedIn jobs?",
      a: "Yes, for public job links like linkedin.com/jobs/view/ followed by a number. If LinkedIn will not show the posting without a login, the tool tells you and you can save the page from your own browser instead.",
    },
    {
      q: "What if the posting has already closed?",
      a: "Then the page is usually gone and there is nothing left to read. Save postings when you apply, not when the interview is booked.",
    },
    {
      q: "Do you store the postings I save?",
      a: "No. The page is read once to show you its text. Nothing is saved to an account or a database.",
    },
    {
      q: "Why does the saved text look plain?",
      a: "The tool keeps the words of the posting, not the site's layout, logos or buttons. That makes the PDF easy to read and search later.",
    },
  ],
  blocks: [
    { h2: "What to do with a saved posting" },
    {
      ul: [
        "**Before the interview,** reread the responsibilities and match each one to a story from your own work.",
        "**When you write the cover letter,** use the posting's own words for the skills it asks for.",
        "**After an offer,** compare the role you were offered with the one that was advertised.",
      ],
    },
  ],
  related: [
    {
      label: "Which ATS does a company use?",
      href: "/ats",
      body: "Paste a job link and see the hiring system behind it.",
    },
    {
      label: "Resume job match checker",
      href: "/resume-job-match-checker",
      body: "Score your resume against the posting you just saved.",
    },
    {
      label: "ATS keyword checker",
      href: "/free-ats-keyword-checker",
      body: "Pull out the terms the posting leans on.",
    },
  ],
};

export const atsLookup = {
  slug: "ats",
  seoTitle: "Which ATS Does a Company Use? Free Lookup",
  description:
    "Paste a job link and see which applicant tracking system the company hires through: Workday, Greenhouse, Lever, SuccessFactors, Taleo and more. Free, no login.",
  keywords: [
    "which ats does company use",
    "what ats does a company use",
    "ats lookup",
    "company ats checker",
    "which applicant tracking system",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Which ATS does a company use?",
  h1: "Which ATS does this company use?",
  lede:
    "Paste a link to one of the company's jobs. The link itself shows which applicant tracking system the job sits on, so you know how your CV will be read.",
  ctas: [{ label: "Check a link", href: "#tool" }],
  tool: "ats-lookup",
  faqs: [
    {
      q: "How does the lookup know which ATS a company uses?",
      a: "Each hiring system hosts jobs on its own web address, like greenhouse.io, lever.co or myworkdayjobs.com. The tool reads that address from the link you paste. It does not guess from the company name.",
    },
    {
      q: "Why does it say it can't tell?",
      a: "The link points at the company's own site. Many companies list jobs on their own pages and send you to the hiring system when you click Apply. Paste the link from the Apply page instead.",
    },
    {
      q: "Can a company use more than one ATS?",
      a: "Yes. Large companies sometimes run different systems for different countries or for campus hiring. The answer is for the job you pasted, so check the link of the job you are applying to.",
    },
    {
      q: "Does knowing the ATS change how I write my CV?",
      a: "The basics are the same everywhere: one column, standard headings, real text rather than images, and the words the posting uses. The guides for each system cover the few things that differ.",
    },
  ],
};
