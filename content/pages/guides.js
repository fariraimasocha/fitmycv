// Top-of-funnel informational pages. High volume, low competition, and they
// feed the tool pages through internal links.

export const resumeTips = {
  slug: "resume-tips",
  seoTitle: "27 Resume Tips That Lift Your Response Rate",
  description:
    "Twenty-seven resume tips grouped by the problem they solve: parsing, keywords, bullets, structure, and the final check. Ordered by impact.",
  keywords: [
    "resume tips",
    "cv tips",
    "resume advice",
    "resume writing tips",
    "how to improve my resume",
    "resume dos and donts",
  ],
  eyebrow: "Guide",
  breadcrumbName: "Resume tips",
  h1: "Resume tips that actually change your response rate",
  lede:
    "Twenty-seven specific things to change, grouped by the problem each one solves, and ordered so the highest-impact fixes come first.",
  ctas: [
    { label: "Check my CV now", href: "/ats-resume-checker" },
    { label: "How to write a resume", href: "/how-to-write-a-resume", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the single most important resume tip?",
      a: "Tailor it to the posting you are applying to. Every other tip on this page is worth a few percent; sending a CV that matches the specific role is worth more than all of them combined.",
    },
    {
      q: "How long should a resume be?",
      a: "One page under about eight years of experience, two pages beyond that, and rarely more. Length is not the real constraint. Relevance is. A two-page CV where page two is a decade of unrelated roles is worse than a one-page CV that is entirely on target.",
    },
    {
      q: "Should I include a photo on my resume?",
      a: "In the UK, US, Canada, and Australia, no. Many employers strip them for bias reasons and some ATS parsers choke on them. In parts of continental Europe and Asia it remains normal. Follow the convention of the country you are applying in.",
    },
    {
      q: "Do I need a resume objective or summary?",
      a: "A summary, yes; an objective, no. An objective states what you want, which nobody is optimising for. A three-line summary that names your target title, your level, and one piece of evidence is the highest-value real estate on the page.",
    },
    {
      q: "Should I include references on my resume?",
      a: "No, and \"references available on request\" is a wasted line. It is assumed. Use the space for another bullet with a number in it.",
    },
    {
      q: "How far back should a resume go?",
      a: "Ten to fifteen years in detail. Older roles can be compressed into a single line each under an \"Earlier experience\" heading, which preserves the timeline without spending page space on work nobody will ask about.",
    },
  ],
  blocks: [
    {
      p: "Most resume advice is either too vague to act on (\"be concise\") or too cosmetic to matter (\"use a modern font\"). What follows is neither. Each item names a specific change, and the sections are ordered by how much difference they make.",
    },

    { h2: "Fix the parse first (tips 1–6)" },
    {
      p: "None of the wording advice matters if the document does not extract cleanly. These six take under an hour and are the difference between being in the search results and being invisible.",
    },
    {
      ol: [
        "**Use a single column.** Sidebars are the most common cause of scrambled parsing. A parser can read straight across both columns and interleave your skills into a job description.",
        "**Put contact details in the body, not the header.** Header and footer regions are routinely skipped, which produces a perfect record nobody can contact.",
        "**Delete tables and text boxes.** They parse inconsistently and can destroy reading order entirely.",
        "**Remove graphics, photos, and skill-rating dots.** They carry no text, so a parser sees nothing and the space is wasted.",
        "**Export a text-based PDF.** Not a scan, not a print-to-image. Test by trying to select a line of text.",
        "**Use standard section headings.** Experience, Education, Skills, Certifications, Projects. \"Where I've Made an Impact\" matches nothing.",
      ],
    },
    {
      p: "The [ATS-friendly resume guide](/blog/ats-resume-guide) explains why each of these breaks, if you want the mechanism rather than the rule.",
    },

    { h2: "Get found (tips 7–12)" },
    {
      ol: [
        "**Use the market job title, not your internal one.** \"Growth Wizard\" matches nothing; put the real title first and the internal one in brackets.",
        "**Take vocabulary from the posting verbatim.** Recruiters search literal strings, not meanings.",
        "**Write acronyms both ways once.** \"Search engine optimisation (SEO)\" catches searches for either.",
        "**Put important keywords inside bullets, not only in a skills list.** A list is a claim; a bullet is evidence.",
        "**Name the tools explicitly.** Salesforce, dbt, Figma, NetSuite, Kubernetes. Proper nouns are searched directly.",
        "**Never hide keywords in white text.** It is trivially visible on copy, some systems flag it, and it converts a maybe into a no.",
      ],
    },

    { h2: "Make the bullets work (tips 13–19)" },
    {
      ol: [
        "**Lead with a verb, never with \"Responsible for\".** Responsibility describes the job you were given, not what you did with it.",
        "**Attach a number wherever one honestly exists:** percentage, volume, time, revenue, headcount, error rate.",
        "**Name the scope.** Team size, budget, region, user count. Scope is what separates two people with the same title.",
        "**Cut duties everyone in your role performs.** Keep only what you specifically changed.",
        "**One idea per bullet.** Two achievements crammed into one sentence means neither lands.",
        "**Keep bullets to two lines.** Anything longer gets skimmed past.",
        "**Vary your verbs, but do not reach.** Repeating the right verb beats an odd synonym. The [action verbs series](/blog/cv-action-verbs-tech) has lists by industry.",
      ],
    },
    {
      compare: {
        title: "The rewrite these seven produce",
        before:
          "Responsible for managing the customer support team and improving processes.",
        after:
          "• Led a 12-person support team through a move to tiered triage, cutting first-response time from 9h to 90min and lifting CSAT from 78% to 91% in two quarters.",
      },
    },

    { h2: "Structure and relevance (tips 20–24)" },
    {
      ol: [
        "**Put the most relevant role first within reverse-chronological order.** If your most relevant experience is older, add a short \"Relevant experience\" section above it.",
        "**Lead each role with its strongest matching bullet.** Most readers get two bullets deep.",
        "**Write a three-line summary naming your target title, level, and one result.** Delete any summary that could describe someone else.",
        "**Compress old and irrelevant roles to a single line each** rather than deleting them and creating unexplained gaps.",
        "**Give month and year for every date.** \"2021–2023\" across three roles forces the reader to guess.",
      ],
    },

    { h2: "Before you send (tips 25–27)" },
    {
      ol: [
        "**Run the copy-paste test.** Select all in your exported PDF, paste into a plain text editor, and read what arrives. That is what the parser sees.",
        "**Do the six-second scan.** Cover everything below the top third of page one. Does what remains say what you do, at what level, and why you fit this role?",
        "**Score the keyword overlap against the actual posting.** Eyeballing misses synonyms and acronyms. The [free ATS resume checker](/ats-resume-checker) does it in seconds.",
      ],
    },

    { h2: "The one that outweighs the rest" },
    {
      p: "Tailor per role. A CV that answers the specific posting beats a beautifully written generic one every time, and it is the only item on this list that compounds. Every application you tailor is a fresh chance rather than the same lottery ticket.",
    },
    {
      p: "The catch is time: twenty to forty minutes per role by hand. If that is what makes you stop, [tailoring from the job link](/tailor-cv-from-job-link) does the first pass in about a minute and leaves you to review it.",
    },
  ],
  related: [
    {
      label: "How to write a resume",
      href: "/how-to-write-a-resume",
      body: "Start here if you are building one from scratch rather than fixing one.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a real posting and see the missing terms.",
    },
    {
      label: "The complete ATS guide",
      href: "/blog/ats-resume-guide",
      body: "Why each formatting rule exists, and what actually breaks without it.",
    },
  ],
};

export const howToWriteAResume = {
  slug: "how-to-write-a-resume",
  seoTitle: "How to Write a Resume in 2026 (Step-by-Step)",
  description:
    "How to write a resume from scratch in 2026: what to include, section order, bullets that land, the right length, and the checks to run before you send.",
  keywords: [
    "how to write a resume",
    "how to write a cv",
    "resume writing guide",
    "what to include in a resume",
    "resume format 2026",
    "resume sections order",
  ],
  eyebrow: "Guide",
  breadcrumbName: "How to write a resume",
  h1: "How to write a resume",
  lede:
    "From a blank page to a document you can send, in seven steps: what goes in each section, in what order, and how to write bullets a recruiter will actually stop on.",
  ctas: [
    { label: "See CV templates", href: "/cv-templates" },
    { label: "Resume tips", href: "/resume-tips", variant: "secondary" },
  ],
  howTo: {
    name: "How to write a resume",
    description:
      "Write a resume from scratch: structure, sections, bullets, length, and final checks.",
    steps: [
      {
        name: "Collect the raw material",
        text: "List every role, date, tool, and result you can remember before worrying about wording.",
      },
      {
        name: "Choose a single-column structure",
        text: "Contact details, summary, experience, skills, education. One column, standard headings.",
      },
      {
        name: "Write the experience section first",
        text: "Verb, specific action, measurable result. Two lines maximum per bullet.",
      },
      {
        name: "Write the summary last",
        text: "Three lines naming your target title, level, and one strong result from the section above.",
      },
      {
        name: "Trim to length and check",
        text: "One page under eight years of experience. Run the copy-paste test and score against a real posting.",
      },
    ],
  },
  faqs: [
    {
      q: "What should a resume include?",
      a: "Contact details, a short professional summary, work experience with dated roles and achievement bullets, a skills section, and education. Certifications and projects if they are relevant. Nothing else is required, and most other sections cost more space than they earn.",
    },
    {
      q: "What order should resume sections go in?",
      a: "Contact details, summary, experience, skills, education for anyone with more than a year or two of work. Students and recent graduates move education above experience. If you are changing careers, a relevant projects or certifications section can sit above older roles.",
    },
    {
      q: "How do I write a resume with no experience?",
      a: "Treat coursework, projects, volunteering, and part-time work as experience and write them the same way: verb, action, result. A university project with a real deliverable and a number is stronger evidence than a vague line about a summer job.",
    },
    {
      q: "What is the best resume format?",
      a: "Reverse-chronological, single column, standard headings. Functional or skills-based formats hide your timeline, which makes recruiters suspicious and parsers unreliable. Use reverse-chronological and solve relevance by reordering bullets instead.",
    },
    {
      q: "How long should it take to write a resume?",
      a: "Two to three hours for a solid first version if you gather the raw material first. Most of that time goes into the experience bullets. The summary, skills, and education take twenty minutes between them.",
    },
    {
      q: "Should I write one resume or several?",
      a: "Write one strong master CV containing everything, then tailor a copy per application. Maintaining three separate CVs from scratch is how they drift out of sync; tailoring from one master does not.",
    },
  ],
  blocks: [
    { h2: "Step 1: Gather the raw material" },
    {
      p: "Do not start writing. Open a blank document and dump, for each role: employer, exact title, start and end month, the tools you used, what you were measured on, and anything you changed. Do not edit and do not worry about phrasing.",
    },
    {
      p: "This is the step people skip, and it is why first drafts stall. Writing and remembering at the same time is much harder than doing them separately.",
    },
    {
      callout: {
        title: "Hunt for the numbers now",
        body: "Old dashboards, performance reviews, handover documents, and team updates are where the numbers are. A bullet with a number is worth three without, and you will not remember them later.",
      },
    },

    { h2: "Step 2: Set up the structure" },
    {
      p: "Single column, top to bottom, in this order:",
    },
    {
      ol: [
        "**Contact details:** name, target job title, city, phone, email, LinkedIn. In the document body, never in the page header.",
        "**Professional summary:** three lines. Written last.",
        "**Experience:** reverse chronological.",
        "**Skills:** grouped, twelve to twenty items, not forty.",
        "**Education:** degree, institution, year. Move above experience if you graduated within the last year or two.",
        "**Optional:** certifications, projects, publications, languages. Only if relevant to the roles you want.",
      ],
    },

    { h2: "Step 3: Write the experience section" },
    {
      p: "This is 80% of the work and 80% of the value. For each role write a one-line context sentence if the employer is not well known, then three to six bullets in the same shape every time: **verb → specific action → measurable result.**",
    },
    {
      compare: {
        title: "The shape, applied",
        before: "Duties included handling customer queries and updating records.",
        after:
          "• Handled 60–80 customer queries a day across chat and email, and rebuilt the response macros; average handling time fell from 7.5 to 4.2 minutes with no drop in satisfaction.",
      },
    },
    {
      ul: [
        "Two lines maximum per bullet.",
        "One idea per bullet.",
        "Strongest bullet first. Most readers stop after two.",
        "Cut anything everyone in your role does.",
      ],
    },
    {
      p: "If the verbs are the part you get stuck on, the action-verb series has lists by industry: [tech](/blog/cv-action-verbs-tech), [marketing](/blog/cv-action-verbs-marketing), [finance](/blog/cv-action-verbs-finance), [healthcare](/blog/cv-action-verbs-healthcare), and [sales](/blog/cv-action-verbs-sales).",
    },

    { h2: "Step 4: Write the skills section" },
    {
      p: "Group into two or three categories rather than one long comma-separated wall. Twelve to twenty items. Every item here should also appear inside a bullet above. A skill with no evidence anywhere is a claim, and readers discount claims.",
    },

    { h2: "Step 5: Write the summary last" },
    {
      p: "Now that the experience section exists, the summary is easy: three lines naming your target title, your level and domain, and the single strongest result from below. If it could describe someone else with your job title, rewrite it.",
    },
    {
      compare: {
        title: "Summary",
        before:
          "Hard-working professional with excellent communication skills and a passion for delivering results in fast-paced environments.",
        after:
          "Operations Manager, 6 years in e-commerce fulfilment. Cut cost per order by 19% across two warehouses by rebuilding the picking route and the agency shift model. Comfortable owning a P&L and a floor of 40 people.",
      },
    },

    { h2: "Step 6: Trim to length" },
    {
      p: "One page if you have under about eight years of experience, two beyond that. Cut in this order: old irrelevant roles down to one line each, duty bullets, the skills wall, then anything on page two that does not support the roles you want. Never cut dates or shrink the font below 10pt to make it fit.",
    },

    { h2: "Step 7: Check before you send" },
    {
      ol: [
        "**Copy-paste test.** Select all in the PDF, paste into a plain text editor, read what arrives.",
        "**Six-second scan.** Cover everything below the top third of page one. Does it say what you do, at what level, and why you fit?",
        "**Score against a real posting.** Run it through the [free ATS resume checker](/ats-resume-checker) with the actual job description.",
        "**Read it aloud.** Anything that sounds like a brochure gets cut.",
      ],
    },

    { h2: "Then tailor it per application" },
    {
      p: "What you have now is a master CV. It is not what you should send. Sending the same document to every posting is the single biggest cause of low response rates.",
    },
    {
      p: "For each role, reorder the bullets so the matching ones lead, rewrite the summary around that posting's top requirements, and adjust the vocabulary to match. The [tailoring guide](/blog/how-to-tailor-cv-to-job-description) is the full method, and [tailoring from a job link](/tailor-cv-from-job-link) does the first pass automatically if doing it by hand is what makes you stop.",
    },
  ],
  related: [
    {
      label: "Resume tips",
      href: "/resume-tips",
      body: "Twenty-seven specific fixes, ordered by how much difference they make.",
    },
    {
      label: "CV templates",
      href: "/cv-templates",
      body: "16 ATS-safe layouts to drop your content into.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score the finished CV against the posting you are applying to.",
    },
  ],
};
