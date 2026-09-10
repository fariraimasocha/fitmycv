// Gap finder landing page. The keyword extractor answers "what does this job
// want?". This page answers the narrower question: "what am I missing?"

export const missingResumeKeywords = {
  slug: "missing-resume-keywords",
  seoTitle: "Find Missing Resume Keywords: Free Tool",
  description:
    "Upload your CV and paste a job description to see which keywords are missing from your resume, and how often the posting mentions each one. Free. The file is read in your browser.",
  keywords: [
    "missing resume keywords",
    "resume missing keywords",
    "keywords missing from resume",
    "find missing resume keywords",
    "job description keywords for resume",
    "extract keywords from job description",
    "job description keyword finder",
    "job description keyword extractor",
    "resume keyword gap",
    "resume keyword analysis",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Missing resume keywords",
  h1: "Find the keywords missing from your resume",
  lede:
    "Upload your CV and paste a job description. You get the terms the posting asks for that your CV never mentions, ranked by how many times the posting mentions each one. No sign-up, and nothing leaves your browser.",
  ctas: [
    { label: "Score my whole CV", href: "/ats-resume-checker" },
    {
      label: "Tailor from a job link",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "gaps",
  howTo: {
    name: "How to find the keywords missing from your resume",
    description:
      "Compare a job description against your CV and list the terms the posting uses that your CV never mentions.",
    steps: [
      {
        name: "Paste the job description",
        text: "Copy the full posting, including the responsibilities and the requirements, and paste it into the first box. Partial text produces a partial gap list.",
      },
      {
        name: "Upload your CV",
        text: "Drop the PDF. We pull the text out so you do not have to copy it. Skills, bullets, and the summary all get read.",
      },
      {
        name: "Work down the missing list",
        text: "Each missing term shows how many times the posting mentions it. Start at the top, and add the ones you can honestly evidence inside a bullet with a result attached.",
      },
    ],
  },
  faqs: [
    {
      q: "How do I find the keywords missing from my resume?",
      a: "Paste the job posting and upload your CV into the tool above. It pulls the terms the posting leans on, checks each one against your CV text, and lists the ones your CV never mentions. The whole comparison runs in your browser and takes a few seconds.",
    },
    {
      q: "What is a resume keyword gap?",
      a: "A keyword gap is a term the employer uses that your CV does not. It is usually a vocabulary problem rather than an experience problem. You did the work, you just described it in different words than the person writing the posting did, so a recruiter searching for their words never finds you.",
    },
    {
      q: "What does \"Mentioned 4x\" mean next to a keyword?",
      a: "It is the number of times that exact term appears in the job description you pasted. Nothing is weighted or estimated. A term mentioned four times is repeated across the summary, the responsibilities, and the requirements, which usually means it is a real must-have rather than a nice-to-have.",
    },
    {
      q: "Should I add every missing keyword to my resume?",
      a: "No. Add only the ones you can honestly evidence, and add each one inside a bullet that says what you did and what happened. Claiming a tool you have never used moves the rejection from the CV screen to the interview, which is a worse place to be rejected.",
    },
    {
      q: "How is this different from the free ATS keyword checker?",
      a: "The keyword checker lists what the job wants. This page lists what your CV lacks. The checker needs only the posting and gives you a ranked vocabulary list to write from. This page needs your CV too, and subtracts what you already cover so you are left with the gaps.",
    },
    {
      q: "Does my CV get uploaded or stored anywhere?",
      a: "The PDF is read in this tab. The file is never sent to a server, and nothing is stored. Close the tab and it is gone.",
    },
    {
      q: "Why is a term listed as missing when it is on my CV?",
      a: "Usually spelling or form. The posting may abbreviate what you spell out, or use a plural, a hyphen, or a different tense. Check the exact string in your CV and match the posting's form where it is honest to do so. Writing both forms once, such as \"search engine optimisation (SEO)\", solves most of these.",
    },
  ],
  blocks: [
    { h2: "What counts as a missing keyword" },
    {
      p: "A missing keyword is a term the job description leans on that does not appear anywhere in your CV text. The tool pulls single words and repeated two-word phrases out of the posting, checks each one against your CV, and shows you the remainder.",
    },
    {
      p: "The number beside each term is the honest count of how many times the posting mentions it. That is the whole ranking. A term repeated four times across the summary, the responsibilities, and the requirements is a real must-have. A term mentioned once may be a nice-to-have that costs you nothing to skip.",
    },
    {
      callout: {
        title: "Gaps, not a grade",
        body: "There is no score on this page on purpose. A percentage tells you how you did. A list of missing terms tells you what to do next, which is the only useful output when you have twenty minutes before the application closes.",
      },
    },

    { h2: "Keyword extractor, gap finder, or full checker?" },
    {
      p: "Three related jobs, three different answers. Pick the one that matches the question you actually have.",
    },
    {
      table: {
        head: ["", "This page", "Keyword extractor", "ATS resume checker"],
        rows: [
          [
            "The question it answers",
            "What is my CV missing?",
            "What does this job want?",
            "How well do I match overall?",
          ],
          ["Needs the job description", "Yes", "Yes", "Yes"],
          ["Needs your CV", "Yes", "No", "Yes"],
          ["Gives a match score", "No", "No", "Yes"],
          ["Lists missing terms with mention counts", "Yes", "No", "No"],
          ["Rewrites your CV", "No", "No", "No"],
        ],
      },
    },
    {
      p: "If you have not written the CV yet, start with the [job description keyword extractor](/free-ats-keyword-checker), which ranks what the posting is asking for. If you want a single number to track across drafts, use the [ATS resume checker](/ats-resume-checker). If you already have a CV and one specific posting in front of you, stay here.",
    },

    { h2: "What to do with each missing keyword" },
    {
      p: "Work down the list from the most-mentioned term. For each one, run it through the same four questions.",
    },
    {
      ol: [
        "**Can I evidence it?** If you have done the work, it belongs on the CV. If you have not, skip it and move on. A gap you cannot fill honestly is information about the role, not a task.",
        "**Do I already say it in different words?** If the posting says *stakeholder management* and your bullet says *kept the business informed*, you are describing the same work in words nobody searches for. Change the words, not the work.",
        "**Is it an acronym problem?** Write both forms once, such as \"continuous integration (CI)\", so a literal search for either form finds you.",
        "**Where does it go?** Inside a bullet, with an action and a number. A skills list is a claim. A bullet that names the tool and the result is proof, and it is what the human reading after the filter actually wants.",
      ],
    },
    {
      p: "Then paste the updated CV back in and re-run. Two or three passes usually clears most of the list without inventing anything. The [full tailoring method](/blog/how-to-tailor-cv-to-job-description) walks through the same process with a before and after example.",
    },

    { h2: "Why the mention count changes what you fix first" },
    {
      p: "Job descriptions are not flat. The same requirement gets restated in the summary, again in the responsibilities, and again in the must-haves, while genuinely optional things appear once in a bullet near the bottom. Counting mentions makes that hierarchy visible without reading the posting three times.",
    },
    {
      steps: [
        {
          title: "Mentioned three times or more",
          body: "Treat as a must-have. If you can evidence it, it belongs in your summary and in at least one bullet in your most recent role.",
        },
        {
          title: "Mentioned twice",
          body: "Worth a bullet if you have the evidence. This is where most of the quick wins are, because these terms are real requirements that are easy to miss on a first read.",
        },
        {
          title: "Mentioned once",
          body: "Optional. Add it to your skills line if it is true, and do not restructure anything for it.",
        },
      ],
    },

    { h2: "What this gap analysis cannot tell you" },
    {
      p: "It is a frequency and phrase heuristic, not a language model. It compares strings. It cannot tell you that *owned the P&L* and *managed the budget* mean the same thing in your industry, and it will not spot a requirement the posting only implies. Use your judgement on synonyms.",
    },
    {
      p: "It also has nothing to say about layout. If your CV pastes into the box out of order or with content missing, a real applicant tracking system will extract the same mess, and no amount of keyword work fixes that. The [ATS resume guide](/blog/ats-resume-guide) covers the formatting rules underneath all of this.",
    },
    {
      p: "And it does not rewrite anything. Closing a keyword gap by hand is twenty to forty minutes per role, which is why most people stop tailoring after a dozen applications. If you would rather not, the [resume optimizer](/resume-optimizer) explains what an automated rewrite changes and what it leaves alone.",
    },
    {
      cta: {
        title: "Close the gaps without rewriting by hand",
        body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, using the experience you already have.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Free ATS keyword checker",
      href: "/free-ats-keyword-checker",
      body: "Only have the posting? Get the ranked list of terms it leans on before you write.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Want one number to track across drafts? Score your CV against the posting.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Paste the posting URL and get a rewritten CV and cover letter in under a minute.",
    },
  ],
};
