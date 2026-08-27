// Cover letter landing pages. Two pages, two distinct intents: "AI cover
// letter generator" is the tool query, "cover letter builder" is the
// build-one-from-scratch query. Content is deliberately non-overlapping.

export const aiCoverLetterGenerator = {
  slug: "ai-cover-letter-generator",
  seoTitle: "AI Cover Letter Generator | Free | FitMyCV",
  description:
    "Generate a cover letter from any job link in seconds. FitMyCV reads the posting and writes a letter grounded in your real experience, then exports a PDF.",
  keywords: [
    "ai cover letter generator",
    "free ai cover letter generator",
    "cover letter generator",
    "ai cover letter writer",
    "generate cover letter from job description",
    "cover letter from job link",
  ],
  eyebrow: "AI cover letter generator",
  breadcrumbName: "AI cover letter generator",
  h1: "AI cover letter generator",
  lede:
    "Paste the job link. FitMyCV reads the posting, matches it against your CV, and writes a cover letter that references the actual role and your actual evidence — not a template with the company name swapped in.",
  ctas: [
    { label: "Generate my cover letter", href: "/tailor-cv-from-job-link" },
    { label: "See the builder", href: "/cover-letter-builder", variant: "secondary" },
  ],
  howTo: {
    name: "How to generate a cover letter from a job link",
    description:
      "Turn a job posting URL into a tailored cover letter grounded in your own experience.",
    steps: [
      {
        name: "Upload your CV once",
        text: "Your reference CV is parsed into structured sections and reused for every application.",
      },
      {
        name: "Paste the job link",
        text: "The posting is read and its requirements, tone, and vocabulary extracted.",
      },
      {
        name: "Review and export",
        text: "The generated letter references the specific role and your matching evidence. Edit anything, then export to PDF.",
      },
    ],
  },
  faqs: [
    {
      q: "How does an AI cover letter generator work?",
      a: "It reads the job posting to extract the role, the employer, and the requirements, then reads your CV to find the experience that answers them. The letter is assembled from that intersection, so each paragraph points at a specific requirement and the evidence you actually have.",
    },
    {
      q: "Is the AI cover letter generator free?",
      a: "Uploading and storing your CV and tracking applications are free. Generating tailored CVs and cover letters from a job link is part of the paid plan, because each generation involves reading the posting and running a model over your CV.",
    },
    {
      q: "Will recruiters be able to tell my cover letter was AI-generated?",
      a: "They will spot a generic one — no company specifics, no numbers, three adjectives per sentence. A letter that names the actual role, references something specific about the posting, and cites a real result from your CV does not read that way. Always edit before sending.",
    },
    {
      q: "How long should a cover letter be?",
      a: "Three to four short paragraphs, comfortably under one page — roughly 250 to 350 words. Its job is to connect two or three things on your CV to the specific role, and to say the one thing your CV cannot say for itself.",
    },
    {
      q: "Do I still need a cover letter in 2026?",
      a: "When the application asks for one, yes, and it is read more often than people assume for shortlisted candidates. It matters most when you are changing industries, explaining a gap, or applying somewhere your CV alone would not obviously fit — exactly the cases a CV cannot argue on its own.",
    },
    {
      q: "Can I edit the generated cover letter?",
      a: "Yes, and you should. The generated letter is a first draft grounded in your CV and the posting; your judgement about which of your achievements matters most to this particular employer is better than any model's.",
    },
    {
      q: "Does the cover letter match the tailored CV?",
      a: "Yes. Both are generated from the same parse of the same posting, so the letter reinforces the evidence the CV leads with instead of contradicting it or repeating it word for word.",
    },
  ],
  blocks: [
    { h2: "Why most cover letters do nothing" },
    {
      p: "The standard cover letter is a paraphrase of the CV with the company name at the top. It restates the job title, claims enthusiasm, lists three adjectives, and ends. A recruiter learns nothing they did not already have.",
    },
    {
      p: "A letter earns its place only when it does something the CV structurally cannot:",
    },
    {
      ul: [
        "**Connect two things.** Your CV lists roles separately; a letter can say why the combination is the point.",
        "**Explain a pivot or a gap.** A CV shows dates; a letter gives the reason before anyone has to guess.",
        "**Show you read the posting.** Referencing a specific responsibility proves attention in a way a tailored CV cannot.",
        "**Argue relevance across a domain change.** \"I have not worked in your industry, but this is the transferable part\" is a sentence only a letter can carry.",
      ],
    },

    { h2: "What a generated letter is built from" },
    {
      p: "The generator works from two inputs and does not stray outside them.",
    },
    {
      table: {
        head: ["From the job posting", "From your CV"],
        rows: [
          ["The exact role title and employer", "Your matching roles and achievements"],
          ["The stated requirements, in priority order", "The numbers already on your CV"],
          ["The vocabulary and register of the posting", "Your seniority and domain"],
          ["Named tools, methods, and certifications", "Where you have genuinely used them"],
        ],
      },
    },
    {
      callout: {
        title: "It will not invent achievements",
        body: "If your CV does not contain evidence for a requirement, the letter does not claim it. That constraint is what keeps the output defensible in an interview — and it is why the letter is only as good as the CV you upload.",
      },
    },

    { h2: "The structure it produces" },
    {
      steps: [
        {
          title: "Opening — the specific role, and why you",
          body: "Names the role and the employer, and states in one sentence the strongest reason you fit. No \"I am writing to apply for\".",
        },
        {
          title: "Body one — your closest evidence",
          body: "Takes the posting's highest-weighted requirement and answers it with the achievement from your CV that most directly addresses it, number included.",
        },
        {
          title: "Body two — the second angle, or the gap",
          body: "Either a second requirement with matching evidence, or an honest handling of the obvious objection: a pivot, a gap, or a domain change.",
        },
        {
          title: "Close — a plain next step",
          body: "One short paragraph. No restating the CV, no thanking them for their time twice.",
        },
      ],
    },

    { h2: "Editing the draft before you send it" },
    {
      ol: [
        "**Cut the first sentence if it restates the job title.** It almost always can go.",
        "**Check every number is one you can defend** in an interview, in the context it is used.",
        "**Add the one thing only you know** — why this company, this team, this problem. A model cannot know it and its absence is what makes letters feel interchangeable.",
        "**Read it aloud.** Anything you would not say out loud to a person, delete.",
        "**Keep it under a page.** If it needs a second page, the CV is doing the wrong job.",
      ],
    },

    { h2: "Cover letter and CV, from the same posting" },
    {
      p: "Generating the two documents separately is how they end up contradicting each other — the CV leads with one achievement and the letter argues for a different one. FitMyCV parses the posting once and produces both from that parse, so the letter reinforces whatever the tailored CV puts first.",
    },
    {
      p: "If you want to see how the CV side of that works, the [tailoring page](/tailor-cv-from-job-link) covers it, and the [cover letter builder](/cover-letter-builder) walks through building a letter from scratch when you do not have a posting URL to hand.",
    },
    {
      cta: {
        title: "Generate a cover letter for a real posting",
        body: "Paste the job link and get a letter grounded in your CV and that specific role.",
        href: "/tailor-cv-from-job-link",
        label: "Generate my cover letter",
      },
    },
  ],
  related: [
    {
      label: "Cover letter builder",
      href: "/cover-letter-builder",
      body: "Structure, paragraph-by-paragraph, when you are writing one yourself.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "The matching CV, generated from the same posting.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Check the CV your letter is attached to before you send both.",
    },
  ],
};

export const coverLetterBuilder = {
  slug: "cover-letter-builder",
  seoTitle: "AI Cover Letter Builder That Gets Read",
  description:
    "A cover letter builder that starts from the job posting, not a blank page. Paragraph-by-paragraph structure, worked examples, and AI drafting from any job link.",
  keywords: [
    "cover letter builder",
    "ai cover letter builder",
    "build a cover letter",
    "cover letter maker",
    "cover letter template",
    "how to write a cover letter",
  ],
  eyebrow: "Cover letter builder",
  breadcrumbName: "Cover letter builder",
  h1: "Cover letter builder",
  lede:
    "Four paragraphs, each with one job. This is the structure that works, what goes in each part, and how to have the first draft written for you from the job link.",
  ctas: [
    { label: "Build mine from a job link", href: "/tailor-cv-from-job-link" },
    { label: "See the AI generator", href: "/ai-cover-letter-generator", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What should a cover letter include?",
      a: "The role and employer named explicitly, one clear reason you fit, one or two pieces of specific evidence with numbers, honest handling of any obvious objection, and a short close. Everything else is padding.",
    },
    {
      q: "How do I start a cover letter without saying 'I am writing to apply for'?",
      a: "Open with the reason you fit, then name the role. For example: \"I moved a 40-person support org onto a self-serve model that cut ticket volume by a third — which is the problem your Support Operations Lead posting describes.\" It says the same thing and earns the second sentence.",
    },
    {
      q: "Should I use the same cover letter for multiple jobs?",
      a: "You can reuse the structure and your evidence library, but the specifics have to change. A letter that could be sent to any employer in your field reads exactly like one, and that is worse than sending no letter where none is required.",
    },
    {
      q: "Do I need a cover letter if the application says it is optional?",
      a: "Include one when you have something the CV cannot say — a career change, a gap, a non-obvious fit, or genuine specific knowledge of the company. If you have none of those and your CV is well tailored, an optional letter adds little.",
    },
    {
      q: "How do I address a cover letter when I do not know the hiring manager?",
      a: "\"Dear Hiring Team\" or \"Dear [Team name] Team\" is fine and reads better than \"To Whom It May Concern\". Do not spend twenty minutes hunting for a name — spend it on the evidence paragraphs instead.",
    },
    {
      q: "Can I build a cover letter without writing anything myself?",
      a: "You can have the first draft built from the job link and your CV, which handles the structure and the requirement mapping. You still need to add the one or two things only you know about why this employer — that is the part that makes it yours.",
    },
  ],
  blocks: [
    { h2: "The four-paragraph structure" },
    {
      p: "Every good cover letter is the same shape. Each paragraph has exactly one job, and if a paragraph is not doing its job it should be deleted rather than improved.",
    },
    {
      table: {
        head: ["Paragraph", "Its one job", "Length"],
        rows: [
          ["Opening", "Name the role and give the single strongest reason you fit", "2–3 sentences"],
          ["Evidence", "Answer the posting's top requirement with a specific result", "3–4 sentences"],
          ["Angle or objection", "A second requirement, or honest handling of the obvious doubt", "2–4 sentences"],
          ["Close", "A plain next step", "1–2 sentences"],
        ],
      },
    },

    { h2: "Paragraph one — the opening" },
    {
      p: "Lead with the reason, not the ritual. The reader already knows you are applying; the envelope said so.",
    },
    {
      compare: {
        title: "Opening, before and after",
        before:
          "I am writing to apply for the Marketing Manager position advertised on your website. I believe my skills and experience make me an excellent candidate for this role.",
        after:
          "I took a B2B content programme from 4k to 61k monthly organic sessions in eighteen months, and sourced 22% of pipeline from it. Your Marketing Manager posting leads with organic acquisition, which is the part of the job I have spent three years on.",
      },
    },

    { h2: "Paragraph two — the evidence" },
    {
      p: "Take the requirement the posting weights most heavily and answer it directly. One example, told properly, beats three mentioned in passing. Name the situation, what you did, and the number.",
    },
    {
      callout: {
        title: "Do not summarise your CV here",
        body: "The recruiter has the CV attached. This paragraph should go deeper on one thing than the CV bullet does — the constraint you worked under, the decision you made, why it was not obvious.",
      },
    },

    { h2: "Paragraph three — the angle, or the objection" },
    {
      p: "If your fit is obvious, use this paragraph for a second requirement. If it is not obvious, use it to say the thing the reader is already thinking:",
    },
    {
      ul: [
        "**Career change:** name the transferable mechanism, not the enthusiasm. *\"Forecasting demand for physical stock and forecasting server capacity are the same problem with different units.\"*",
        "**Employment gap:** one clean sentence, no apology, then move on.",
        "**Under the stated years of experience:** cite scope instead. Team size, budget, user count, or complexity beats a year count.",
        "**Sector switch:** name the part of the domain you already understand and the part you would be learning.",
      ],
    },

    { h2: "Paragraph four — the close" },
    {
      p: "One or two sentences. Say you would welcome a conversation and stop. Do not restate the CV, do not thank them twice, do not promise to follow up on Tuesday.",
    },

    { h2: "Building it from the posting instead of a blank page" },
    {
      p: "The hard part of this structure is not the writing — it is deciding which requirement to lead with and which of your achievements answers it. That is a mapping problem, and it is the part that takes twenty minutes per application.",
    },
    {
      p: "FitMyCV does that mapping from the job link: it ranks the posting's requirements, finds the evidence in your CV that answers each one, and drafts the four paragraphs against them. You then add the thing only you know. The [AI cover letter generator](/ai-cover-letter-generator) page covers exactly what it uses as input and what it refuses to invent.",
    },
    {
      cta: {
        title: "Start from the posting, not a blank page",
        body: "Paste the job link and get the four paragraphs drafted against your real experience.",
        href: "/tailor-cv-from-job-link",
        label: "Build my cover letter",
      },
    },
  ],
  related: [
    {
      label: "AI cover letter generator",
      href: "/ai-cover-letter-generator",
      body: "What the generator reads, what it writes, and what it will not claim.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "The CV your letter is attached to, rewritten for the same posting.",
    },
    {
      label: "How to tailor your CV",
      href: "/blog/how-to-tailor-cv-to-job-description",
      body: "The step-by-step method, with a before and after.",
    },
  ],
};
