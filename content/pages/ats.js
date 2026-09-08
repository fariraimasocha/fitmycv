// Per-vendor applicant tracking system pages.
//
// ponytail: these deliberately avoid inventing parser internals. No vendor
// publishes how its parser scores a CV, and the pages that claim exact figures
// are guessing. What is safely sayable is (a) what the application form itself
// asks you to do, which anyone can verify by applying, and (b) the layout rules
// that hold for every text-extraction parser. Both are useful. Neither is made
// up. If you add a vendor, keep to those two.

const UNIVERSAL_RULES = [
  "**One column.** A sidebar can interleave with the main column when the file is flattened to text, which scrambles your work history.",
  "**Nothing in the header or footer.** Contact details placed there are frequently dropped. Put your name, email and phone in the body of the first page.",
  "**Standard section headings.** Work Experience, Education, Skills. Not *Where I Have Made An Impact*.",
  "**Month YYYY dates.** *March 2022 to Present* is read reliably. *03/22* often is not.",
  "**No tables or text boxes.** Both are common causes of missing or reordered content.",
  "**Selectable text, not an image.** If you cannot select a line with your cursor, no parser can read it.",
];

const relatedCore = [
  {
    label: "Tailor a CV from a job link",
    href: "/tailor-cv-from-job-link",
    body: "Paste the posting URL and get a rewritten, single column CV.",
  },
  {
    label: "Free ATS resume checker",
    href: "/ats-resume-checker",
    body: "Score your CV against the posting before you apply. No account.",
  },
  {
    label: "The complete ATS resume guide",
    href: "/blog/ats-resume-guide",
    body: "Formatting, keywords, file types, and what actually filters people out.",
  },
];

export const workdayResumeFormat = {
  slug: "workday-resume-format",
  seoTitle: "Workday Resume Format: What the Parser Actually Reads",
  description:
    "How to format a CV for Workday: single column, standard headings, Month YYYY dates, and why you still have to type your skills in by hand.",
  keywords: [
    "workday resume format",
    "workday ats resume",
    "workday ats",
    "how to apply on workday",
    "workday resume parsing",
    "resume format for workday application",
    "workday application tips",
  ],
  eyebrow: "Applicant tracking systems",
  breadcrumbName: "Workday resume format",
  h1: "Workday resume format",
  lede:
    "Workday is the one that makes you retype your entire work history after uploading your CV. Here is how to format the file so the autofill gets it mostly right, and what to fix by hand when it does not.",
  ctas: [
    { label: "Tailor my CV for this role", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What resume format works best for Workday?",
      a: "A single column document with standard section headings, dates written as Month YYYY, and contact details in the body rather than the header. Whether you send PDF or DOCX matters less than whether the layout is simple.",
    },
    {
      q: "Why does Workday make me retype everything?",
      a: "Because the upload is an autofill convenience, not the application. Workday parses your file to prefill the form, then the form is what the employer stores and searches. If the prefill is wrong and you leave it, the wrong version is the one they read.",
    },
    {
      q: "Should I still attach my CV if the form has all the details?",
      a: "Yes. A human will usually open the attachment, and that is the version where your formatting, ordering and phrasing still count. Fill the form carefully and attach the good PDF.",
    },
    {
      q: "Does Workday read my skills section?",
      a: "Do not rely on it. Workday applications commonly include a separate skills step, and skills you enter there are searchable in a way that a line in your PDF may not be. Fill it in even though you already listed them.",
    },
    {
      q: "How do I tailor a CV for a Workday posting?",
      a: "Paste the posting URL into [the tailoring tool](/tailor-cv-from-job-link). It reads the requirements from the page and rewrites your CV against them, in a single column layout that survives the parse.",
    },
  ],
  blocks: [
    { h2: "What actually happens when you upload" },
    {
      p: "Workday flattens your file to text, then tries to map that text onto its own fields: contact details, each job with a title and dates, education, skills. The result is dropped into the application form for you to correct.",
    },
    {
      p: "This is why Workday feels uniquely tedious and also why it is uniquely forgiving. Nothing is silently lost, because you are shown the parse and asked to fix it. The failure mode is not rejection, it is you clicking through a bad autofill in a hurry.",
    },

    { h2: "Format rules that matter here" },
    { ul: UNIVERSAL_RULES },
    {
      callout: {
        title: "The two minutes that matter most",
        body: "After the autofill, read the work history section back. Check every job title, every start and end date, and that no role has been merged with the one below it. That is where Workday applications actually go wrong.",
      },
    },

    { h2: "Fill the form, then attach the good file" },
    {
      steps: [
        {
          title: "Upload and let it prefill",
          body: "Use your tailored CV, not your generic one. The prefill is only as good as the file it read.",
        },
        {
          title: "Correct the work history",
          body: "Titles, employers, and dates. Fix merged or reordered roles before you look at anything else.",
        },
        {
          title: "Fill the skills step by hand",
          body: "Even though your CV lists them. Recruiters search this field.",
        },
        {
          title: "Check the attachment is the tailored version",
          body: "The PDF a human opens should be the one written for this posting, not the file you uploaded three roles ago.",
        },
      ],
    },

    { h2: "One CV per posting, without the hours" },
    {
      p: "All of this assumes your CV already matches the role. If it does not, formatting will not save it. [Paste the job link](/tailor-cv-from-job-link) and get the rewrite first, then apply.",
    },
  ],
  related: relatedCore,
};

export const greenhouseAtsResume = {
  slug: "greenhouse-ats-resume",
  seoTitle: "Greenhouse ATS: How to Format Your Resume",
  description:
    "How to format a CV for Greenhouse job applications: single column, parser safe headings, and why the PDF you attach is the one a human reads.",
  keywords: [
    "greenhouse ats resume",
    "greenhouse ats",
    "greenhouse resume format",
    "how to apply greenhouse",
    "greenhouse job application tips",
    "greenhouse resume parsing",
    "boards.greenhouse.io application",
  ],
  eyebrow: "Applicant tracking systems",
  breadcrumbName: "Greenhouse ATS resume",
  h1: "Greenhouse ATS resume format",
  lede:
    "Greenhouse is the short form: name, email, CV, maybe a cover letter and a couple of questions. Less to get wrong than Workday, which means the file you attach carries almost all of the weight.",
  ctas: [
    { label: "Tailor my CV for this role", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What resume format does Greenhouse prefer?",
      a: "A single column PDF with selectable text, standard section headings, and dates as Month YYYY. Greenhouse application forms are short, so there is no autofill step to catch a bad parse for you.",
    },
    {
      q: "Does Greenhouse reject resumes automatically?",
      a: "Greenhouse is a system recruiters work in, not a robot that bins applications on a score. What it does do is make your application searchable and filterable, so a CV that parses badly or misses the posting's vocabulary is harder to find in a pile of four hundred.",
    },
    {
      q: "Should I fill in the optional cover letter?",
      a: "If the field exists and the role is one you actually want, yes. It is one of the few places on a Greenhouse form where you control the narrative, and a tailored letter costs you nothing once the CV is tailored.",
    },
    {
      q: "How do I tailor for a Greenhouse posting?",
      a: "Paste the boards.greenhouse.io URL into [the tailoring tool](/tailor-cv-from-job-link). It reads the posting directly, so you do not have to copy the description out by hand.",
    },
  ],
  blocks: [
    { h2: "Short form, heavier file" },
    {
      p: "A Greenhouse application usually asks for very little: your name, contact details, a CV, and sometimes a cover letter or two custom questions. There is no long autofill to review, which is a relief and a risk.",
    },
    {
      p: "The risk is that nothing shows you how your file was read. Whatever the parser made of your layout is what gets stored and searched, and you never see it. So the layout has to be right the first time.",
    },

    { h2: "Format rules that matter here" },
    { ul: UNIVERSAL_RULES },
    {
      p: "If you want to see what a parser makes of your current CV, open it, select all, copy, and paste into a plain text editor. Text that arrives scrambled or out of order arrives that way for the recruiter too. The [ATS resume guide](/blog/ats-resume-guide) covers this test in full.",
    },

    { h2: "Answer the custom questions properly" },
    {
      p: "Greenhouse lets employers add their own questions, and those answers sit right next to your CV in the recruiter's view. A one line answer to *why this company* reads exactly as it looks, and it is the cheapest place to separate yourself from the other applicants.",
    },

    { h2: "The vocabulary still matters" },
    {
      p: "Recruiters search their own pipeline by keyword. If the posting says *demand generation* throughout and your CV says *lead gen*, you are harder to find, even though a human would call them the same thing.",
    },
    {
      p: "[Score your CV against the posting](/ats-resume-checker) before you send it. It takes about ten seconds and needs no account.",
    },
  ],
  related: relatedCore,
};

export const leverAtsResume = {
  slug: "lever-ats-resume",
  seoTitle: "Lever ATS: How to Format Your Resume",
  description:
    "How to format a CV for Lever applications: single column, clean parsing, and why your parsed profile matters as much as the file you attached.",
  keywords: [
    "lever ats resume",
    "lever ats",
    "lever resume format",
    "jobs.lever.co application",
    "how to apply on lever",
    "lever job application tips",
    "lever resume parsing",
  ],
  eyebrow: "Applicant tracking systems",
  breadcrumbName: "Lever ATS resume",
  h1: "Lever ATS resume format",
  lede:
    "Lever builds a candidate profile from your CV and keeps it alongside the original file. Recruiters work from that profile. If the parse is messy, the first impression is messy, whatever your PDF looks like.",
  ctas: [
    { label: "Tailor my CV for this role", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What resume format works for Lever?",
      a: "Single column, selectable text, standard headings, Month YYYY dates, contact details in the body. The same rules as every other text extraction parser.",
    },
    {
      q: "Does Lever show recruiters my original file?",
      a: "The uploaded file stays attached, and a recruiter can open it. The parsed profile is what they see first in the pipeline view, so both need to be right.",
    },
    {
      q: "Should I add my LinkedIn URL?",
      a: "Yes, in the body of the CV as plain selectable text rather than only as a linked icon. An icon with a hyperlink behind it often parses as nothing at all.",
    },
    {
      q: "How do I tailor for a Lever posting?",
      a: "Paste the jobs.lever.co URL into [the tailoring tool](/tailor-cv-from-job-link). It strips the tracking parameters and reads the posting itself.",
    },
  ],
  blocks: [
    { h2: "Your profile is the first impression" },
    {
      p: "Lever turns your CV into a structured candidate profile and keeps the original file attached to it. In the pipeline view, the profile is what a recruiter scans. The PDF is one click further away, and on a busy day that click does not always happen.",
    },
    {
      p: "So the goal is a file that produces a clean profile: correct name, correct current title, work history in order with dates that parsed.",
    },

    { h2: "Format rules that matter here" },
    { ul: UNIVERSAL_RULES },
    {
      callout: {
        title: "Icons are not contact details",
        body: "A row of social icons with hyperlinks behind them is invisible to a parser. Write the email address, the phone number and the LinkedIn URL as actual text on the page.",
      },
    },

    { h2: "Lever postings are often startup postings" },
    {
      p: "Lever is common at startups and scale-ups, where a founder or hiring manager frequently reads applications directly rather than a recruiting team screening on keywords first.",
    },
    {
      p: "That changes what to optimise. Scope and ownership travel further than a keyword list: what you actually ran, what you decided, what happened as a result. Keep the parse clean so you get read, then make sure there is something worth reading.",
    },

    { h2: "Before you send it" },
    {
      p: "[Run the CV and the posting through the checker](/ats-resume-checker) to see which of the role's terms you already cover, or [paste the job link](/tailor-cv-from-job-link) and have the rewrite done for you.",
    },
  ],
  related: relatedCore,
};

export const taleoResumeFormat = {
  slug: "taleo-resume-format",
  seoTitle: "Taleo Resume Format: Formatting for an Older Parser",
  description:
    "How to format a CV for Taleo: keep it plain, keep it literal, and match the posting's exact wording. Taleo is old, and it is unforgiving of clever layouts.",
  keywords: [
    "taleo resume format",
    "taleo ats",
    "taleo resume",
    "oracle taleo application",
    "how to apply taleo",
    "taleo resume tips",
    "taleo keyword matching",
  ],
  eyebrow: "Applicant tracking systems",
  breadcrumbName: "Taleo resume format",
  h1: "Taleo resume format",
  lede:
    "Taleo is one of the oldest applicant tracking systems still in heavy use, especially in large enterprises and government. Old parsers are literal parsers. Assume less tolerance for design, and match the posting's wording exactly.",
  ctas: [
    { label: "Tailor my CV for this role", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the safest resume format for Taleo?",
      a: "The plainest one you have. Single column, one standard font, standard headings, no graphics, no tables, no text boxes, dates as Month YYYY. If you own a visually striking template, this is the application to not use it on.",
    },
    {
      q: "Does Taleo filter resumes by keyword?",
      a: "Taleo supports keyword search and filtering, and large employers using it often receive very high application volumes, so filtering is common. Matching the posting's own wording matters more here than almost anywhere else.",
    },
    {
      q: "Should I use exact phrases from the job posting?",
      a: "Use the exact terms you can honestly evidence. If the posting says *accounts payable* and you wrote *AP*, write both. Do not paste the requirements into your CV wholesale; a human reads it after the filter.",
    },
    {
      q: "PDF or Word for Taleo?",
      a: "If the form accepts both, a plain DOCX is the safer default with older parsers. Whichever you choose, check that the text is selectable and that the layout is a single column.",
    },
  ],
  blocks: [
    { h2: "Assume the least capable parser" },
    {
      p: "Taleo predates most of the tools in this category. It is deployed widely across large enterprises, healthcare, and public sector employers, often in configurations that have not been touched in years.",
    },
    {
      p: "The practical rule: whatever formatting you were unsure about elsewhere, do not do it here. Plain wins.",
    },

    { h2: "Format rules that matter here" },
    { ul: UNIVERSAL_RULES },
    {
      p: "Two more for older systems specifically: use one common font throughout, and avoid special characters in section headings. Decorative bullets and dividers are frequent sources of stray symbols in extracted text.",
    },

    { h2: "Wording is doing more work than usual" },
    {
      p: "High volume employers filter. That is not a conspiracy, it is arithmetic: four hundred applications and one recruiter. If the posting uses a specific term for the thing you do, use their term.",
    },
    {
      p: "The honest version of this advice has a limit attached. Add terms you can defend in an interview, and no others. A filter you passed by keyword stuffing hands you a conversation you cannot survive.",
    },
    {
      callout: {
        title: "Where to put the terms",
        body: "Inside bullets, attached to evidence. *Reduced accounts payable cycle time by 30% across a team of six* is a keyword match and proof at the same time. A skills list at the bottom is only the first of those.",
      },
    },

    { h2: "Find the gap before you apply" },
    {
      p: "[Paste the posting and your CV into the free checker](/ats-resume-checker) to see which of its terms you are missing. Nothing uploads, and there is no limit.",
    },
  ],
  related: relatedCore,
};

export const icimsResumeFormat = {
  slug: "icims-resume-format",
  seoTitle: "iCIMS Resume Format: How to Get Through the Form",
  description:
    "How to format a CV for iCIMS applications: single column parsing, careful review of the prefilled fields, and matching the posting's wording.",
  keywords: [
    "icims resume format",
    "icims ats",
    "icims application",
    "how to apply icims",
    "icims resume tips",
    "icims resume parsing",
    "icims job application",
  ],
  eyebrow: "Applicant tracking systems",
  breadcrumbName: "iCIMS resume format",
  h1: "iCIMS resume format",
  lede:
    "iCIMS is common at large employers, and the application is usually a multi step form that prefills from your CV. As with any prefill, the version you correct is the version they keep.",
  ctas: [
    { label: "Tailor my CV for this role", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What resume format works with iCIMS?",
      a: "Single column, selectable text, standard section headings, Month YYYY dates, and contact details in the body of the document rather than the header.",
    },
    {
      q: "Why did my details come through wrong?",
      a: "Almost always layout. Two column CVs, tables, and text boxes are the usual causes of merged jobs, missing dates, and contact details that vanish. Fix the layout and the prefill improves.",
    },
    {
      q: "Do I have to complete every step of the form?",
      a: "Complete the ones that are searchable: work history, education, and any skills or qualifications step. Those fields are how a recruiter finds you later, and a strong CV attached to an empty profile is easy to miss.",
    },
    {
      q: "How do I tailor for an iCIMS posting?",
      a: "Paste the posting URL into [the tailoring tool](/tailor-cv-from-job-link) and it reads the requirements from the page. If the page will not load for you, paste the description text into the [free checker](/ats-resume-checker) instead.",
    },
  ],
  blocks: [
    { h2: "A form that thinks it already knows you" },
    {
      p: "iCIMS applications typically upload the CV, parse it, and then walk you through several screens of prefilled fields. It is faster than typing everything, and it is also where a bad parse quietly becomes your official record.",
    },
    {
      p: "Read every prefilled screen before you advance it. Merged roles and missing end dates are the two that do the most damage, because they make a stable career look erratic.",
    },

    { h2: "Format rules that matter here" },
    { ul: UNIVERSAL_RULES },

    { h2: "Large employers, large piles" },
    {
      p: "iCIMS is used at scale, which means volume, which means search. Your application is found by someone typing terms into a box. Use the terms the posting uses, in bullets, with evidence attached.",
    },
    {
      p: "That is not a trick, it is how being findable works. The [ATS resume guide](/blog/ats-resume-guide) explains what recruiters actually search on and what they never see.",
    },

    { h2: "Do the tailoring once, not per screen" },
    {
      p: "Get the CV right before you start the form, and the form gets easier. [Paste the job link](/tailor-cv-from-job-link) and the rewrite plus a matching cover letter takes under a minute.",
    },
  ],
  related: relatedCore,
};
