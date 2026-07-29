export const meta = {
  slug: "ats-resume-guide",
  title: "How to Write an ATS-Friendly Resume in 2026 (Complete Guide)",
  // Kept under ~60 chars so it survives the SERP truncation.
  seoTitle: "ATS-Friendly Resume in 2026: The Complete Guide",
  description:
    "A practical guide to writing an ATS-friendly resume in 2026: formatting rules that parse cleanly, how to place keywords, which file type to use, and the mistakes that get CVs rejected before a human reads them.",
  excerpt:
    "Most rejections happen before a human opens your CV. Here is exactly how applicant tracking systems read a resume in 2026 — and how to write one that survives the parse.",
  date: "2026-07-29",
  updated: "2026-07-29",
  readingTime: 12,
  category: "ATS",
  tags: ["ats", "resume", "keywords", "formatting"],
  image: "/blog/ats-resume-guide.png",
  imageAlt:
    "Flat illustration of a CV document passing through a scanner beam, representing an applicant tracking system parsing a resume",
  keywords: [
    "ats resume checker",
    "ats friendly resume",
    "how to beat ats",
    "ats resume",
    "applicant tracking system resume",
    "ats resume format 2026",
    "does my resume pass ats",
  ],
};

export const faqs = [
  {
    q: "What is an ATS-friendly resume?",
    a: "An ATS-friendly resume is one an applicant tracking system can parse without losing information. In practice that means a single-column layout, standard section headings like Experience and Education, real selectable text rather than images, and wording that mirrors the language used in the job description.",
  },
  {
    q: "Do applicant tracking systems really reject resumes automatically?",
    a: "Most modern systems do not auto-reject on a score alone. What they do is rank and filter: recruiters search and sort by keyword, title, and skill, and a CV that parses badly or misses the role's core terms simply never appears in the result set. The practical outcome is the same — nobody reads it.",
  },
  {
    q: "Should I use a PDF or a Word document?",
    a: "Use a text-based PDF unless the application form explicitly asks for .doc or .docx. Every mainstream ATS has parsed PDFs reliably for years, and a PDF preserves your layout everywhere. The one PDF that fails is a scanned or image-exported one, because there is no text layer to extract.",
  },
  {
    q: "How many keywords should I include in my resume?",
    a: "Cover the role's must-have skills and the exact job title, then stop. Aim to reflect the terms that appear repeatedly in the posting rather than hitting a density target. Keywords stuffed into a hidden block or repeated unnaturally read as spam to recruiters and add nothing to how the system ranks you.",
  },
  {
    q: "Do I need a different resume for every job application?",
    a: "For any role you genuinely want, yes. Different postings for the same job title emphasise different skills, and the CV that matches the posting in front of you will always outrank a generic one. Tailoring by hand takes 20 to 40 minutes per role, which is why most people stop doing it after a few applications.",
  },
  {
    q: "Do headers, footers, and tables break ATS parsing?",
    a: "Content placed in the header or footer region of a document is frequently skipped, so never put your phone number or email there. Tables and text boxes are parsed inconsistently: some systems read them cell by cell and scramble the reading order. Keep contact details in the body and lay out content with normal paragraphs and bullets.",
  },
  {
    q: "Does an ATS read my resume's graphics, photos, or skill bars?",
    a: "No. Images, icons, charts, and those five-dot skill rating graphics carry no extractable text, so they are invisible to the parser and occupy space that could hold real evidence. If a skill matters, write it as a word in a Skills section and show it again in a bullet.",
  },
  {
    q: "How can I check whether my resume is ATS-friendly?",
    a: "Copy the text out of your own PDF and paste it into a plain text editor. If the reading order jumbles, sections disappear, or bullets turn into stray characters, a parser will see the same mess. For a keyword view, run the CV and the job description through an ATS checker that scores overlap against the posting.",
  },
];

export const blocks = [
  {
    p: "You applied to forty roles and heard back from two. It is tempting to read that as a verdict on your experience, but far more often it is a verdict on **parsing and keyword coverage** — the CV never made it into the pile a human actually reads.",
  },
  {
    p: "Almost every mid-size and enterprise employer now runs applications through an applicant tracking system. The ATS ingests your file, extracts the text, tries to slot that text into structured fields — name, employer, title, dates, skills — and stores the result as a searchable record. Recruiters then search that database. If the extraction went badly, or your record does not contain the words they search for, you are not rejected so much as **invisible**.",
  },
  {
    p: "This guide covers what actually breaks in that pipeline, in the order it breaks: the file, the layout, the section structure, the keywords, and the evidence. Work through it once on your master CV and you will not have to think about it again.",
  },

  { h2: "What an ATS actually does with your resume" },
  {
    p: "The phrase \"beating the ATS\" suggests a gatekeeper with a pass mark. That is not how it works, and believing it leads people to strange tactics like white keyword text, which recruiters catch immediately.",
  },
  { p: "The real sequence is closer to this:" },
  {
    ol: [
      "**Ingestion.** Your file is uploaded and the system attempts to extract a text layer from it. A scanned or image-based file dies here with nothing to show.",
      "**Parsing.** The extracted text is split into blocks and mapped onto fields the system understands — contact details, work history entries, education, skills. This is where multi-column layouts, tables, and unusual headings cause the most damage.",
      "**Structuring.** Each work history entry is broken into employer, title, start date, and end date. Inconsistent date formats and job titles buried inside a paragraph reduce the quality of this step.",
      "**Search and ranking.** A recruiter searches for a title, a skill, a location, or a boolean string. Some systems also score your record against the requisition automatically. Either way, you surface only if the terms are present in your record.",
      "**Human review.** A recruiter opens the shortlist and spends a matter of seconds per CV deciding whether to read properly.",
    ],
  },
  {
    callout: {
      title: "The honest version",
      body: "Steps 1 to 3 decide whether your CV is legible to the machine. Step 4 decides whether it is findable. Step 5 decides whether it is convincing. Most advice online only addresses step 4, which is why people stuff keywords into an unreadable two-column template and still hear nothing.",
    },
  },

  { h2: "Choose a format that survives extraction" },
  {
    p: "Formatting is the cheapest thing to fix and the most expensive thing to get wrong, because a parse failure discards information you never get to argue about.",
  },
  { h3: "Use a single-column layout" },
  {
    p: "A sidebar looks designed. It is also the single most common cause of scrambled parsing. When a parser walks a two-column page it may read straight across both columns, interleaving your skills list into the middle of a job description. Everything after that point is noise. One column, top to bottom, reads correctly in every system.",
  },
  { h3: "Keep contact details in the body" },
  {
    p: "Content in the header and footer regions of a document is routinely skipped. Put your name, phone number, email, city, and LinkedIn URL in the first few lines of the document body instead.",
  },
  { h3: "Avoid tables, text boxes, and columns for layout" },
  {
    p: "Tables are read inconsistently — some parsers go cell by cell and destroy the reading order, some drop nested tables entirely. Use ordinary paragraphs and bullet lists. If you want two things side by side, such as a job title and dates, put them on one line separated by a pipe or an en dash.",
  },
  { h3: "Drop the graphics" },
  {
    p: "Photos, logos, icons, donut charts, and skill-rating dots contain no text. A parser sees nothing. A recruiter sees a claim with no evidence — a four-out-of-five rating for Python means nothing next to a bullet that says you shipped a Python service handling a specific load.",
  },
  { h3: "Use standard, boring fonts" },
  {
    p: "Any common system font renders and extracts predictably. Exotic fonts can embed with non-standard character maps, which produces mojibake on extraction. Keep body text at 10 to 12 point.",
  },
  { h3: "Send a text-based PDF" },
  {
    p: "Unless the form asks for .docx, export a PDF directly from your editor — never print-to-image or scan. To verify, open the PDF and try to select a line of text with your cursor. If you cannot select it, no parser can read it.",
  },
  {
    compare: {
      title: "Layout: what parses versus what scrambles",
      context:
        "Same content, two layouts. The left version is what the parser produces when a sidebar is read straight across.",
      before:
        "Jane Okafor  Skills  Senior Data Analyst  SQL, Python  Acme Corp 2022–Present  dbt, Looker  Built reporting pipeline...",
      after:
        "Jane Okafor\nSenior Data Analyst | London | jane@email.com\n\nEXPERIENCE\nAcme Corp — Senior Data Analyst (2022–Present)\n• Built reporting pipeline...\n\nSKILLS\nSQL, Python, dbt, Looker",
    },
  },

  { h2: "Use section headings the parser already knows" },
  {
    p: "Parsers detect sections by matching headings against a known vocabulary. A creative heading breaks that match and the content underneath may be filed as unclassified text.",
  },
  {
    table: {
      head: ["Use this", "Not this"],
      rows: [
        ["Experience / Work Experience / Professional Experience", "Where I've Made an Impact"],
        ["Education", "Academic Adventures"],
        ["Skills / Technical Skills", "My Toolkit"],
        ["Certifications", "Badges & Credentials"],
        ["Projects", "Things I've Built"],
        ["Summary / Professional Summary", "About Me"],
      ],
    },
  },
  {
    p: "Order matters too. Lead with a short summary, then Experience, then Skills, then Education, then anything else. Recent, relevant work is what both the parser and the recruiter are looking for first.",
  },
  { h3: "Write dates and titles consistently" },
  {
    p: "Use one date format throughout — `Mar 2022 – Present` or `03/2022 – Present`, not both. Put the job title on its own line next to the employer rather than inside a sentence. Spell out the title the way the industry writes it: if the market says **Product Manager**, do not submit **Product Ninja**.",
  },

  { h2: "Get the keywords right without stuffing" },
  {
    p: "Keywords are how you get found in step 4. The job description is not a wish list to be admired — it is the literal vocabulary the recruiter will search with.",
  },
  { h3: "Take the terms from the posting, not from your imagination" },
  {
    p: "Read the posting and pull out: the exact job title, the named tools and technologies, the certifications, the methodologies, and any repeated phrases. Terms that appear in both the summary and the requirements list are the ones that matter most.",
  },
  { h3: "Match the posting's phrasing, including acronyms" },
  {
    p: "Systems match strings, not meaning. If the posting says **SEO**, and your CV only says *search engine optimisation*, a literal search for SEO can miss you. Write both the first time: \"search engine optimisation (SEO)\". Do the same for CPA, CRM, GCP, and every other abbreviation.",
  },
  { h3: "Put keywords where they carry evidence" },
  {
    p: "A Skills section is a list of claims. A bullet is proof. Every important keyword should appear in at least one bullet that shows you used it to do something with a result attached.",
  },
  {
    compare: {
      title: "Keyword placement: claim versus evidence",
      before:
        "Skills: Salesforce, forecasting, pipeline management, stakeholder communication",
      after:
        "• Rebuilt the Salesforce pipeline stages and forecasting model with the RevOps lead, cutting forecast variance from 28% to 9% across three quarters.",
    },
  },
  { h3: "Never fake it" },
  {
    p: "White text, tiny fonts, and hidden keyword blocks are trivially caught — the text is visible the moment anyone copies the document, and some systems flag it outright. It converts a maybe into a definite no.",
  },
  {
    callout: {
      title: "How much is enough?",
      body: "If the posting names ten specific requirements and your CV honestly covers seven of them in your own words, you are in good shape. Chasing the other three by claiming skills you do not have just moves the rejection to the interview.",
    },
  },

  { h2: "Write bullets that convince the human at the end" },
  {
    p: "Passing the parse gets you seen. Bullets get you the call. The pattern that works is simple: **a strong verb, the specific thing you did, and the measurable outcome.**",
  },
  {
    ul: [
      "Lead with the verb, not with \"Responsible for\" — see the [CV action verbs by industry series](/blog/cv-action-verbs-tech) for lists you can lift from.",
      "Attach a number wherever one honestly exists: percentage, volume, time saved, revenue, headcount, error rate.",
      "Name the scope: team size, budget, region, user count. Scope is what separates two people with identical titles.",
      "Cut the duties everyone in your role performs and keep the things you specifically changed.",
    ],
  },
  {
    compare: {
      title: "Bullet rewrite",
      before:
        "Responsible for managing the company's social media accounts and creating content.",
      after:
        "• Ran organic social across four channels, growing combined following from 12k to 47k in 11 months and driving 18% of inbound demo requests.",
    },
  },

  { h2: "The mistakes that cost people interviews" },
  {
    ol: [
      "**One generic CV for every application.** The single biggest source of low response rates. Different postings for the same title stress different skills.",
      "**A two-column template downloaded because it looked good.** Beautiful in a preview, scrambled after extraction.",
      "**Contact details in the header.** The system files a perfect record with no way to contact you.",
      "**Job titles nobody searches for.** Internal titles like \"Growth Wizard\" match nothing. Put the market title first and the internal one in brackets.",
      "**Unexplained gaps and vague dates.** \"2021–2023\" across three roles forces a recruiter to guess. Give month and year.",
      "**A skills wall with no evidence.** Forty comma-separated technologies signals breadth without depth.",
      "**Sending the file as an image or a scan.** Nothing to extract, nothing to rank.",
      "**Burying the most relevant role.** If the role that matches is third down the page, most readers never reach it. Lead with relevance.",
    ],
  },

  { h2: "How to check your resume before you send it" },
  {
    steps: [
      {
        title: "Run the copy-paste test",
        body: "Open your PDF, select all, and paste into a plain text editor. Read what comes out. If sections are out of order, characters are mangled, or your phone number is missing, the parser sees exactly that.",
      },
      {
        title: "Read it against the posting",
        body: "Put the job description beside your CV. Highlight every requirement the posting names, then find where your CV answers it. Anything unanswered is either a gap to fill or a reason to skip the role.",
      },
      {
        title: "Score the keyword overlap",
        body: "Manual comparison misses synonyms and acronyms. An ATS checker scores the overlap between your CV and the specific posting and shows which required terms are missing. Try the [free ATS resume checker](/ats-resume-checker) on the exact job you are applying to.",
      },
      {
        title: "Do the six-second scan",
        body: "Look at the top third of page one only. Does it say what you do, at what level, and why you fit this role? That is the region most recruiters actually read.",
      },
    ],
  },

  { h2: "Doing this for every application, without losing your evening" },
  {
    p: "Everything above is correct and everything above is slow. Tailoring one CV properly — rereading the posting, remapping bullets, adjusting the summary, matching the vocabulary — takes most people 20 to 40 minutes. Applying to fifteen roles a week is then a part-time job, so people quietly revert to the generic CV and the response rate collapses.",
  },
  {
    p: "That is the specific problem FitMyCV solves. You paste the job link, and it reads the posting, extracts the requirements and the exact vocabulary, then rewrites your CV and cover letter against them — keeping your real experience and your voice, and putting the posting's terminology where it carries evidence. The output is a single-column, parse-safe PDF.",
  },
  {
    cta: {
      title: "Tailor your CV to the next job you apply for",
      body: "Paste the job link, upload your CV once, and get a tailored, ATS-ready CV and cover letter in under a minute.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },

  { h2: "The short version" },
  {
    ul: [
      "One column, standard headings, contact details in the body, no tables or graphics.",
      "Text-based PDF unless the form demands .docx. Check by selecting the text.",
      "Take keywords from the posting verbatim, spell out acronyms both ways, and prove each one in a bullet.",
      "Every bullet: verb, specific action, measurable result.",
      "Tailor per role. If that is too slow to sustain, automate it rather than abandon it.",
    ],
  },
];

const post = { meta, faqs, blocks };
export default post;
