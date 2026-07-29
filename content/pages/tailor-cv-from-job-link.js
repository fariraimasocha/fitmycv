// Body content for /tailor-cv-from-job-link. Kept out of the page file so the
// page stays a layout and this stays editable prose.

export const FAQS = [
  {
    q: "How do I tailor my CV from a job link?",
    a: "Sign in, upload your reference CV once, then paste the URL of the job you want to apply for. FitMyCV reads the listing, extracts the requirements and vocabulary, matches them against your experience, and rewrites your CV and cover letter to fit the role — usually in under a minute.",
  },
  {
    q: "Which job boards work with a pasted link?",
    a: "Links from LinkedIn, Indeed, Glassdoor, and most major job boards and company career pages. Paste the URL of the individual posting rather than a search results page, and the requirements are detected automatically.",
  },
  {
    q: "What if the job link does not work?",
    a: "Some postings sit behind a login or an aggressive bot check, and a few company sites render the description only after a JavaScript step. When a link cannot be read you can paste the job description text directly instead — everything downstream works identically.",
  },
  {
    q: "Will tailoring my CV from a job link help me pass ATS?",
    a: "It addresses the part of ATS behaviour you can control. The tailored CV mirrors the keywords and phrasing from the posting, which is what recruiters search on, and exports as a single-column text-based PDF that parses cleanly. It cannot invent experience you do not have.",
  },
  {
    q: "Does it invent experience or exaggerate my CV?",
    a: "No. Your employers, dates, titles, and achievements come from your reference CV and are not changed. What changes is which of them lead, how they are ordered, and the vocabulary used to describe them. If a requirement is not evidenced anywhere in your CV, the tailored version does not claim it.",
  },
  {
    q: "Do I get a cover letter as well?",
    a: "Yes. Every tailored CV comes with a matching cover letter generated from the same parse of the same posting, so the two documents reinforce each other instead of arguing. Both export to PDF.",
  },
  {
    q: "How long does it take?",
    a: "Roughly 30 to 60 seconds from pasting the link to a reviewable draft, then however long you spend editing. Doing the same work by hand takes most people 20 to 40 minutes per role.",
  },
  {
    q: "Can I edit the tailored CV before downloading it?",
    a: "Yes, inline and section by section. You should — your judgement about which of your own achievements matters most to a particular employer is better than any model's, and a two-minute edit is what turns a good draft into your CV.",
  },
  {
    q: "How is this different from pasting the job description into ChatGPT?",
    a: "Three things: it reads the posting from the URL so nothing is lost in copy-paste, it works from a structured version of your CV rather than whatever you remember to include in the prompt, and it exports a formatted single-column PDF instead of chat text you then have to lay out yourself.",
  },
  {
    q: "Is my CV shared with recruiters or employers?",
    a: "No. FitMyCV is not a job board or a CV database. Your reference CV is stored against your account to generate your own documents, and you can delete it and your account at any time.",
  },
];

export const HOW_TO = {
  name: "How to tailor your CV from a job link",
  description:
    "Turn a job posting URL into a tailored CV and cover letter in under a minute.",
  steps: [
    {
      name: "Upload your reference CV once",
      text: "Your CV is parsed into structured sections — roles, dates, bullets, skills — and reused for every application from then on.",
    },
    {
      name: "Paste the job link",
      text: "Drop in the URL of the posting from LinkedIn, Indeed, Glassdoor, or a company careers page. The listing is read and its requirements extracted.",
    },
    {
      name: "Review and download",
      text: "Your summary, bullet order, wording, and skills come back rewritten against that posting, with a matching cover letter. Edit inline, then export both as PDFs.",
    },
  ],
};

export const BLOCKS = [
  { h2: "Why a link beats a copy-paste" },
  {
    p: "Every tailoring tool needs the job description. Most make you find it, select it, copy it, and paste it — and that is exactly where the process quietly breaks. People paste half the posting, miss the requirements section that was behind a *show more* toggle, or lose the responsibilities list entirely because it sat in a separate accordion.",
  },
  {
    p: "Pasting the URL removes that whole class of error. The page is read as published, including the sections you would have missed, and the extraction works from the complete text rather than from whatever survived your clipboard.",
  },

  { h2: "How job-link parsing actually works" },
  {
    p: "It is worth knowing what happens between pasting a link and getting a CV back, because it explains both what the tool is good at and where it will not help you.",
  },
  {
    steps: [
      {
        title: "The posting is fetched and reduced to text",
        body: "The page is retrieved and stripped down to the actual job content — navigation, cookie banners, related-jobs rails, and footer boilerplate are discarded so they do not pollute the keyword extraction.",
      },
      {
        title: "Structure is pulled out of the prose",
        body: "The role title, employer, seniority, responsibilities, must-have requirements, nice-to-haves, and named tools are separated out. A requirement repeated across the summary, the responsibilities, and the requirements list is weighted far more heavily than one mentioned once.",
      },
      {
        title: "Your CV is matched against those requirements",
        body: "Your reference CV is already stored as structured sections, so each extracted requirement is matched to the roles and bullets in your history that actually evidence it. Requirements with no match are left unclaimed rather than invented.",
      },
      {
        title: "The rewrite is generated against the mapping",
        body: "The summary is rewritten around the highest-weighted requirements you can evidence; bullets are reordered so matches lead, and reworded in the posting's vocabulary while keeping your numbers. The cover letter is written from the same mapping.",
      },
      {
        title: "Both documents are rendered to PDF",
        body: "Single column, standard headings, contact details in the body, real text layer. The formatting rules are covered in full in the [ATS-friendly resume guide](/blog/ats-resume-guide).",
      },
    ],
  },
  {
    callout: {
      title: "The constraint that makes it useful",
      body: "The rewrite can only use evidence that exists in your reference CV. That is a limitation and it is the point — it is what keeps the output defensible when an interviewer asks you to talk through the bullet they found most interesting.",
    },
  },

  { h2: "Three before-and-afters from real tailoring passes" },
  {
    p: "The same experience, rewritten against three different postings. Note that nothing is added — the achievements were already on the CV. What changes is which one leads and which words describe it.",
  },
  {
    compare: {
      title: "1. Professional summary — targeting a pricing-heavy PM role",
      context:
        "The posting leads with pricing, monetisation, and cross-functional work. The original summary was written for a generic product role.",
      before:
        "Experienced product professional with a track record of delivering great products in fast-paced environments. Passionate about user-centric design and collaborating with cross-functional teams.",
      after:
        "Senior Product Manager with 7 years in B2B SaaS, focused on pricing and monetisation. Led the move to usage-based billing at Northwind, lifting net revenue retention from 104% to 121%. Works day to day with engineering, sales, and finance to ship pricing changes without breaking revenue reporting.",
    },
  },
  {
    compare: {
      title: "2. Experience bullet — targeting a reliability-focused engineering role",
      context:
        "The posting repeats latency, on-call, and incident reduction. The original bullet buried all three.",
      before:
        "Worked on improving the performance of our main API and helped with the database.",
      after:
        "• Profiled and optimised the 12 slowest API endpoints and added covering indexes, cutting p95 latency from 840ms to 210ms and removing a planned read-replica from the roadmap.",
    },
  },
  {
    compare: {
      title: "3. Experience bullet — targeting a demand-generation marketing role",
      context:
        "The posting weights pipeline sourced and attribution heavily; the original described activity rather than outcome.",
      before:
        "Managed the company blog and social media channels, creating content regularly.",
      after:
        "• Rebuilt the content calendar around 14 bottom-of-funnel keywords, publishing 40 posts in 9 months; organic sessions grew 3.1x and organic sourced 22% of demo requests.",
    },
  },
  {
    p: "The pattern in all three is the same one covered in [how to tailor your CV to a job description](/blog/how-to-tailor-cv-to-job-description): verb, specific action, measurable result — with the posting's vocabulary used where it honestly applies.",
  },

  { h2: "Tailoring from a link versus tailoring by hand" },
  {
    p: "The manual method works. It is not a secret and we have written the whole thing out. The problem is arithmetic.",
  },
  {
    table: {
      head: ["", "By hand", "From a job link"],
      rows: [
        ["Time to a first draft", "20–40 minutes", "Under a minute"],
        ["Requirement extraction", "Manual highlighting, easy to miss a section", "Parsed from the full posting"],
        ["Requirement weighting", "Your judgement", "Frequency and placement across the posting"],
        ["Acronyms and synonyms", "Frequently missed", "Matched against the posting text"],
        ["Bullet reordering", "Manual", "Automatic, editable"],
        ["Matching cover letter", "A second, separate task", "From the same parse"],
        ["Formatting risk", "Whatever your template does", "Single-column ATS-safe PDF"],
        ["Sustainable at 10+ applications a week", "Rarely", "Yes"],
      ],
    },
  },
  {
    p: "At two applications a month, do it by hand — the [step-by-step guide](/blog/how-to-tailor-cv-to-job-description) is all you need. At ten a week, six hours of tailoring is what makes people stop tailoring, and a generic CV is what a low response rate is made of.",
  },

  { h2: "Tailoring a resume from a LinkedIn job link" },
  {
    p: "LinkedIn is where most people find the role and it is also where most copy-paste attempts go wrong: the description is collapsed behind a *see more* control, and the skills-match panel sits in a different part of the page entirely. Pasting the posting URL reads the full description rather than the visible fragment.",
  },
  {
    p: "Paste the URL of the individual job — the one that looks like `linkedin.com/jobs/view/…` — rather than a search or a collection page. If you are viewing the role inside the LinkedIn app, use the share option to copy the link to the posting itself.",
  },

  { h2: "Tailoring a resume from an Indeed or Glassdoor listing" },
  {
    p: "Indeed and Glassdoor postings are usually more structured than LinkedIn's — a clean requirements block and a responsibilities list — which makes the extracted requirement weighting more reliable. The same rule applies: paste the URL for the individual posting, not a search result page.",
  },
  {
    p: "Aggregators sometimes host a truncated version of a description that lives in full on the employer's own careers site. Where both exist, the employer's page is the better link, because it is the version the hiring team actually wrote.",
  },

  { h2: "Company careers pages and everything else" },
  {
    p: "Most company careers pages read fine, including the common applicant-tracking-system-hosted ones. Where a link cannot be retrieved — a login wall, an aggressive bot check, or a description that only renders after an interaction — paste the job description text directly instead. Every step after the fetch is identical.",
  },

  { h2: "What tailoring cannot fix" },
  {
    p: "Being straight about this is more useful than a feature list.",
  },
  {
    ul: [
      "**A genuine experience gap.** If a role needs five years of something you have never done, no rewrite closes that, and the interview would find it anyway.",
      "**A CV with nothing measurable in it.** Tailoring reorders and rewords your evidence. If there are no numbers anywhere, add them first — [how to write a resume](/how-to-write-a-resume) covers where to find them.",
      "**Applying to the wrong roles.** A high match score on a role you do not want is not progress.",
      "**The rest of the application.** Screening questions, portfolio links, and referrals still matter, and often more than the CV.",
    ],
  },
  {
    p: "If you want to see where you stand before tailoring anything, the [free ATS resume checker](/ats-resume-checker) scores your current CV against a posting and shows exactly which required terms are missing.",
  },
];
