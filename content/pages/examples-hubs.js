// Hub copy for /resume-examples and /cv-examples. Shared so the HTML hubs
// and their markdown twins stay on the same text.

export const resumeExamplesHub = {
  slug: "resume-examples",
  breadcrumbName: "Resume examples",
  eyebrow: "Examples",
  h1: "Resume examples for fourteen jobs",
  lede:
    "Not template galleries, but worked examples. Each one shows the summary, the bullets rewritten from a weak version to a strong one, the skills block, and the vocabulary those postings actually search for.",
  blocks: [
    { h2: "How to use these examples" },
    {
      p: "Copy the **structure**, never the sentences. A CV assembled from someone else's examples describes someone else's career, and the first competent interview question exposes it. What transfers is the shape.",
    },
    {
      ol: [
        "**Read the before-and-after bullets first.** The gap between the two is the whole lesson: same work, one version describing a job description and one describing a person.",
        "**Copy the bullet shape.** Verb, specific action, measurable result. Every rewrite on every example page follows it.",
        "**Write your summary last.** It is much easier once the experience section exists and you can see which result is strongest.",
        "**Then tailor to the actual posting.** These examples are generic by necessity; the posting in front of you is not.",
      ],
    },
    {
      callout: {
        title: "The numbers are the hard part",
        body: "Most people can write the verb and the action from memory and stall on the result. Old dashboards, performance reviews, and handover documents are where those numbers live. Spend twenty minutes there before you start writing.",
      },
    },

    { h2: "What every example has in common" },
    {
      ul: [
        "A summary that names the target title, the level, and one result, never a list of adjectives.",
        "Bullets that end in a number, or in scope where no number honestly exists.",
        "A grouped skills section where every entry also appears as evidence in a bullet.",
        "Single-column, standard headings, nothing that scrambles when the file is parsed.",
      ],
    },
    {
      p: "The reasoning behind the last point is in the [ATS-friendly resume guide](/blog/ats-resume-guide), and [how to write a resume](/how-to-write-a-resume) covers building one from a blank page.",
    },

    { h2: "From example to application" },
    {
      p: "An example gets you a solid master CV. What earns responses is the next step: reordering and rewording it for each posting so the matching evidence leads and the vocabulary matches. That takes twenty to forty minutes per role by hand. The [tailoring guide](/blog/how-to-tailor-cv-to-job-description) is the method, and [tailoring from a job link](/tailor-cv-from-job-link) does the first pass in about a minute.",
    },
    {
      cta: {
        title: "Tailor your CV to a real posting",
        body: "Paste the job link and see your own experience rewritten against that specific role.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  faqs: [
    {
      q: "Are these resume examples free to use?",
      a: "Yes. Every example page is free to read and there is no sign-up. Use the structure and the bullet shape; write the content from your own experience.",
    },
    {
      q: "Should I copy a resume example word for word?",
      a: "No. Copied bullets describe achievements you cannot defend, and interviewers probe exactly the numbers that look strongest. Copy the pattern (verb, specific action, measurable result) and fill it with your own work.",
    },
    {
      q: "What is the difference between a resume example and a resume template?",
      a: "A template is the layout: margins, headings, typography. An example is the content: what to actually write in each section and how to phrase it. You need both, and the [templates page](/resume-templates) covers the layout side.",
    },
    {
      q: "Which resume example should I use if my job is not listed?",
      a: "Pick the closest function rather than the closest job title. A support team lead learns more from the customer service example than from a generic management one, because the bullet shape and the available metrics are what transfer.",
    },
    {
      q: "Do these examples work outside the US?",
      a: "The bullet structure is universal. Conventions around length, photos, and personal details are not. The [CV examples page](/cv-examples) covers UK and European conventions, and the [resume templates page](/resume-templates) covers US ones.",
    },
  ],
};

export const cvExamplesHub = {
  slug: "cv-examples",
  breadcrumbName: "CV examples",
  eyebrow: "Examples",
  h1: "CV examples for fourteen jobs",
  lede:
    "Worked CV examples with UK conventions built in: personal statement, two-page length, no photo, and the vocabulary British job adverts actually use.",
  blocks: [
    { h2: "UK CV conventions" },
    {
      p: "The structure of a good CV is the same everywhere; the conventions are not. If you are applying in the UK or Ireland, these are the differences that matter:",
    },
    {
      table: {
        head: ["", "UK CV", "US resume"],
        rows: [
          ["Typical length", "2 pages is standard", "1 page under ~8 years"],
          ["Opening section", "Personal statement / profile", "Professional summary"],
          ["Photo", "Omit", "Omit"],
          ["Date of birth, marital status", "Omit", "Omit"],
          ["Section heading", "Work Experience or Employment History", "Experience"],
          ["Spelling", "UK (organise, analyse)", "US (organize, analyze)"],
          ["References", "Omit, \"on request\" is assumed", "Omit"],
          ["Education detail", "Degree, plus A-levels and GCSEs if early career", "Degree only"],
        ],
      },
    },
    {
      callout: {
        title: "Match the advert's spelling",
        body: "Applicant tracking systems match literal strings, so \"optimised\" and \"optimized\" are different words to a keyword search. Use the spelling the advert uses. It costs nothing and occasionally matters.",
      },
    },

    { h2: "The personal statement" },
    {
      p: "UK adverts often ask for a personal statement or profile at the top. It does the same job as a US summary: three or four lines naming your target role, your level and domain, and one concrete result. What it is not is a paragraph about being a hard-working team player with excellent communication skills. That sentence appears on roughly every CV in the country and distinguishes nobody.",
    },
    {
      compare: {
        title: "Personal statement",
        before:
          "A hard-working and enthusiastic professional with excellent communication skills, seeking a challenging role where I can utilise my abilities and grow within a dynamic organisation.",
        after:
          "Operations Manager with 6 years in e-commerce fulfilment. Cut cost per order by 19% across two warehouses by rebuilding the picking route and the agency shift model. Comfortable owning a P&L and a floor of 40 people.",
      },
    },

    { h2: "Two pages, used properly" },
    {
      p: "Two pages is standard in the UK, which is a permission rather than an obligation. Page one should carry everything that decides the shortlist: your statement, your current role, and your strongest evidence. Page two is for earlier roles, education, and certifications. If page two is a decade of unrelated work, compress it to a line per role and get the page back.",
    },
    {
      ul: [
        "Never split a single role across the page break.",
        "Repeat your name in a small footer on page two, in the body, not in the page header region, which parsers skip.",
        "If you are under three years into your career, one page is still fine and often better.",
      ],
    },

    { h2: "How to use these examples" },
    {
      p: "Copy the structure, not the sentences. Each example page shows the profile, the bullets rewritten from a weak version to a strong one, the skills block, and the keywords those adverts lean on. The bullet shape (verb, specific action, measurable result) is what transfers; the content has to be yours.",
    },
    {
      p: "For the formatting rules underneath all of this, see the [ATS-friendly resume guide](/blog/ats-resume-guide); for building one from scratch, [how to write a CV](/how-to-write-a-resume); and for the layouts, [CV templates](/cv-templates).",
    },
    {
      cta: {
        title: "Tailor your CV to a UK job advert",
        body: "Paste the link to the posting and get your CV rewritten against it, in its vocabulary.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  faqs: [
    {
      q: "How long should a UK CV be?",
      a: "Two pages is the standard expectation, and one page is fine early in your career. Three pages is only normal in academia and some medical and public-sector applications, where a full publication or training history is explicitly requested.",
    },
    {
      q: "Should a UK CV include a photo?",
      a: "No. UK employers generally strip photos for bias reasons, and images carry no extractable text so they cost you space for nothing. The same applies to date of birth, marital status, and nationality.",
    },
    {
      q: "What is a personal statement on a CV?",
      a: "A three-to-four-line profile at the top naming your target role, your level and domain, and one concrete result. It is the same thing a US resume calls a professional summary, and it is the most-read part of the document.",
    },
    {
      q: "Should I include GCSEs and A-levels on my CV?",
      a: "Within a few years of finishing education, yes, summarised in a line or two. Once you have several years of relevant work, replace them with a single line for your degree and use the space for achievements instead.",
    },
    {
      q: "What is the difference between a CV and a resume?",
      a: "Outside academia they are the same document under different names: UK and European CV, US resume. In academic and medical contexts a CV means something different: a long-form record of publications, funding, and teaching with no length limit.",
    },
    {
      q: "Do I need a different CV for every job application?",
      a: "For roles you genuinely want, yes. Different adverts for the same job title emphasise different things, and the CV that answers the advert in front of you will always outrank a generic one.",
    },
  ],
};
