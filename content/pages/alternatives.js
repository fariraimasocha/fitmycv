// Competitor comparison landing pages.
//
// ponytail: every price quoted here is dated and linked to the competitor's own
// pricing page, because these numbers go stale and an undated claim rots into a
// lie. If you update one, update the "checked" date in the same block.

const PRICE_CHECKED = "September 2026";

export const jobscanAlternative = {
  slug: "jobscan-alternative",
  seoTitle: "Jobscan Alternative: Tailor the CV, Not Just Score It",
  description:
    "A Jobscan alternative that rewrites your CV instead of scoring it. Paste a job link, get a tailored CV and cover letter. One payment, no monthly subscription.",
  keywords: [
    "jobscan alternative",
    "jobscan alternatives",
    "free jobscan alternative",
    "jobscan competitor",
    "cheaper than jobscan",
    "jobscan vs fitmycv",
    "resume scanner alternative",
    "ats resume checker alternative",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Jobscan alternative",
  h1: "A Jobscan alternative that does the rewrite",
  lede:
    "Jobscan tells you your CV scores 41%. Then you go and fix it yourself, re-upload, and scan again. FitMyCV reads the job link and hands back the rewritten CV and a cover letter. One payment, no subscription running while you job hunt.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Score my CV free first", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Jobscan alternative?",
      a: "It depends what you want back. If you want a match score and a keyword report, Jobscan is mature and good at it, and our free ATS resume checker does the same job with no account. If you want the rewritten CV rather than a list of what to fix, that is what FitMyCV does.",
    },
    {
      q: "Is there a free Jobscan alternative?",
      a: "Yes. Our ATS resume checker is free, needs no sign-up, and has no scan limit, because the matching runs in your browser rather than on a server. Jobscan's free plan is capped at a few scans per month.",
    },
    {
      q: "How much does Jobscan cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, Jobscan lists a free tier with a small monthly scan limit and paid plans billed monthly or quarterly. FitMyCV is $9.99 a month or $29.99 once for lifetime access. Check both pricing pages before you decide, since these change.`,
    },
    {
      q: "Does FitMyCV give a match score like Jobscan?",
      a: "Yes. You get a keyword match with the terms the posting expects, marked as present or missing in your CV, before and after the rewrite. The difference is that the rewrite is included rather than left to you.",
    },
    {
      q: "Can I use both?",
      a: "Plenty of people do. Tailor with FitMyCV, then run the result through whichever scanner you trust as a second opinion. Two tools disagreeing on a score usually means the posting is vague, not that one of them is broken.",
    },
  ],
  blocks: [
    { h2: "The difference in one line" },
    {
      p: "Jobscan is a diagnostic. FitMyCV is a rewrite. Jobscan hands you a percentage and a list of missing keywords, and the twenty to forty minutes of editing per application is still yours. FitMyCV reads the posting from its URL and returns the CV already rewritten, plus a matching cover letter.",
    },
    {
      p: "That is the whole argument. Everything below is detail.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Jobscan", "FitMyCV"],
        rows: [
          ["Match score against a posting", "Yes", "Yes"],
          ["Lists missing keywords", "Yes", "Yes"],
          ["Rewrites your CV for you", "No", "Yes"],
          ["Writes the cover letter", "No", "Yes"],
          ["Reads a job URL directly", "No, paste the description", "Yes"],
          ["Pricing model", "Subscription", "Subscription or one payment"],
          ["Free tier", "A few scans per month", "Unlimited free ATS check, no account"],
        ],
      },
    },
    {
      p: `Prices and limits checked ${PRICE_CHECKED}. Confirm on [Jobscan's pricing page](https://www.jobscan.co/pricing) and [ours](/pricing), because both move.`,
    },

    { h2: "Where Jobscan is genuinely better" },
    {
      p: "It has been at this longer. The match algorithm is mature, the ATS research library is deep, and if your job is to understand applicant tracking systems rather than to apply to jobs, that library is worth reading.",
    },
    {
      p: "If all you want is a number to optimise against and you enjoy doing the editing yourself, Jobscan does that well and you do not need us.",
    },

    { h2: "Where the subscription hurts" },
    {
      p: "A job search is not a monthly habit. It is an intense two to four months, then nothing for two years. A subscription priced per month is priced for the wrong shape, which is why people forget to cancel.",
    },
    {
      p: "FitMyCV is $9.99 a month if you want it that way, or $29.99 once and it is yours. Most people take the one payment because the monthly plan reaches the same figure by month three.",
    },

    { h2: "What you actually do with FitMyCV" },
    {
      steps: [
        {
          title: "Upload your CV once",
          body: "One reference CV. You never upload it again. Every application after this reuses it.",
        },
        {
          title: "Paste the job link",
          body: "The posting URL, not the description text. It reads LinkedIn, Greenhouse, Lever, Workday and most company careers pages.",
        },
        {
          title: "Read the gap, then take the rewrite",
          body: "You see the requirements pulled out of the posting and which of them your CV already proves. Then the rewritten CV and cover letter, as ATS-safe PDFs.",
        },
      ],
    },
    {
      callout: {
        title: "It will not invent experience",
        body: "The rewrite works from the CV you uploaded. It changes which of your real experience leads and the words used to describe it. If a posting wants five years of Kubernetes and you have none, no tool fixes that, and you should be suspicious of one that pretends to.",
      },
    },

    { h2: "Try the free part first" },
    {
      p: "You do not have to take any of this on trust. The [free ATS resume checker](/ats-resume-checker) runs in your browser, needs no account, and shows you the same keyword gap Jobscan charges for. If the gap looks right, [tailor from the job link](/tailor-cv-from-job-link) and see whether the rewrite is worth $29.99 to you.",
    },
  ],
  related: [
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "The scoring half, free and unlimited, with no account.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "The rewriting half. Paste the URL, get the CV and cover letter.",
    },
    {
      label: "Best free ATS resume checkers 2026",
      href: "/blog/best-free-ats-resume-checkers-2026",
      body: "An honest look at the free checkers, including the ones we do not build.",
    },
  ],
};

export const tealAlternative = {
  slug: "teal-alternative",
  seoTitle: "Teal Alternative: Tailoring First, Not Tracking First",
  description:
    "A Teal alternative built around tailoring rather than tracking. Paste a job link and get a rewritten CV and cover letter, with no weekly billing.",
  keywords: [
    "teal alternative",
    "tealhq alternative",
    "teal hq alternative",
    "alternative to teal resume builder",
    "teal competitor",
    "teal vs fitmycv",
    "job application tracker alternative",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Teal alternative",
  h1: "A Teal alternative for people who want the rewrite",
  lede:
    "Teal is a very good job tracker with AI attached. FitMyCV is the other way round: tailoring is the product, and tracking comes with it. If your problem is that applications take too long rather than that they are disorganised, start here.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "See pricing", href: "/pricing", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Teal alternative?",
      a: "If you want Teal's Chrome extension and kanban tracker, there is no close substitute and you should stay. If what you actually use Teal for is rewriting bullets against a posting, FitMyCV does that as the main event rather than as a credit-limited extra.",
    },
    {
      q: "Is Teal free?",
      a: `Teal has a free tier that covers tracking and a limited batch of AI credits, with the AI features gated behind Teal+. As of ${PRICE_CHECKED} Teal+ is billed weekly, monthly or quarterly. Check [Teal's pricing page](https://www.tealhq.com/pricing) for current figures.`,
    },
    {
      q: "Does FitMyCV track applications too?",
      a: "Yes. There is an applications list, saved jobs, and company research in the dashboard. It is not as developed as Teal's tracker and there is no Chrome extension yet, which is the honest trade.",
    },
    {
      q: "What does FitMyCV do that Teal does not?",
      a: "It takes a job URL rather than pasted description text, and the rewrite is unlimited on a paid plan instead of metered by AI credits. It also writes the cover letter from the tailored CV rather than from the posting alone.",
    },
  ],
  blocks: [
    { h2: "Two different products that look similar" },
    {
      p: "Teal grew out of job tracking. The bookmarklet, the kanban board, and the resume versions are the core, and the AI writing sits on top as a credit-limited feature. FitMyCV grew out of tailoring. The rewrite is the core, and the tracking sits alongside it.",
    },
    {
      p: "Neither is the wrong shape. They just solve different halves of the same week.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Teal", "FitMyCV"],
        rows: [
          ["Job tracker", "Yes, the strongest part", "Yes, simpler"],
          ["Chrome extension", "Yes", "No"],
          ["Takes a job URL", "Via the extension", "Paste the link directly"],
          ["Rewrites the whole CV", "Bullet and summary help", "Full rewrite against the posting"],
          ["Cover letter", "Yes", "Yes, written from the tailored CV"],
          ["AI usage on free tier", "A one-off batch of credits", "Free ATS check is unlimited, tailoring is paid"],
          ["Billing", "Weekly, monthly or quarterly", "Monthly or one payment"],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Both products change, so confirm on [Teal's pricing page](https://www.tealhq.com/pricing) and [ours](/pricing).`,
    },

    { h2: "Where Teal is genuinely better" },
    {
      p: "The Chrome extension. Saving a role from the board you are already looking at, with the description captured, is a real workflow advantage and we do not have an equivalent. The tracker is more mature too, with richer statuses and contacts.",
    },
    {
      p: "If your job search is disorganised rather than slow, Teal is the better buy and you should ignore the rest of this page.",
    },

    { h2: "Watch the weekly plan" },
    {
      p: "Weekly billing looks cheap next to a monthly figure and is not. A weekly plan left running for a month costs meaningfully more than the monthly plan for the same product. That is worth checking against your own calendar before you subscribe, whichever tool you pick.",
    },
    {
      p: "FitMyCV's answer to this is $29.99 once. No renewal, no forgetting to cancel after you land the job.",
    },

    { h2: "The honest recommendation" },
    {
      ul: [
        "**Your problem is chaos.** Fifty applications, no idea which. Use Teal.",
        "**Your problem is time.** Each application takes half an hour of rewriting. Use FitMyCV.",
        "**Both.** Track in Teal, tailor here. They do not conflict, and the free [ATS checker](/ats-resume-checker) costs you nothing to try.",
      ],
    },
  ],
  related: [
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Paste the posting URL, get the rewritten CV and cover letter.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting with no account and no limit.",
    },
    {
      label: "How to tailor your CV",
      href: "/blog/how-to-tailor-cv-to-job-description",
      body: "The manual method, in full, if you would rather not pay anyone.",
    },
  ],
};

export const kickresumeAlternative = {
  slug: "kickresume-alternative",
  seoTitle: "Kickresume Alternative: Tailor the CV You Already Have",
  description:
    "A Kickresume alternative for people who already have a CV. Paste a job link and get it rewritten for that role, with no watermark and no builder to learn.",
  keywords: [
    "kickresume alternative",
    "kickresume alternatives",
    "alternative to kickresume",
    "kickresume competitor",
    "kickresume vs fitmycv",
    "ai resume builder alternative",
    "resume builder alternative free",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Kickresume alternative",
  h1: "A Kickresume alternative for a CV you already have",
  lede:
    "Kickresume builds a CV from scratch in a template editor. If you already have one and the problem is that it is generic, you do not need another builder. You need it rewritten for the specific role, which is what FitMyCV does.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Browse CV templates", href: "/cv-templates", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Kickresume alternative?",
      a: "If you want a full builder with a large template gallery and a from-scratch flow, other builders are closer substitutes. If you already have a CV and want it adapted per application, that is a different tool, and it is the one FitMyCV is.",
    },
    {
      q: "Does the free plan add a watermark?",
      a: `Kickresume's free tier watermarks exports and locks the AI writer, as of ${PRICE_CHECKED}. FitMyCV never watermarks. Our free tier is the ATS resume checker, which is unlimited and needs no account; tailoring and PDF export are on the paid plan.`,
    },
    {
      q: "How many templates does FitMyCV have?",
      a: "16 themes. That is fewer than Kickresume offers, and deliberately so: they are all single column and parser safe, because a template that scrambles in an ATS is not a design choice, it is a bug.",
    },
    {
      q: "Can I import my existing CV?",
      a: "Yes, that is the normal path. Upload the PDF once and it becomes your reference CV. Every tailored version is generated from it, so you are never retyping your history into a form.",
    },
  ],
  blocks: [
    { h2: "Builder or tailor" },
    {
      p: "These are two different jobs. A builder solves the blank page: you have no CV, or the one you have is fifteen years old, and you need a well-structured document with a decent layout. Kickresume is good at that.",
    },
    {
      p: "Tailoring solves a different problem: your CV is fine, you have sent it to forty roles, and nobody has replied. The document is not badly built. It is badly aimed.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Kickresume", "FitMyCV"],
        rows: [
          ["Build a CV from scratch", "Yes, full editor", "No, you bring one"],
          ["Template count", "Large gallery", "16, all single column"],
          ["Rewrites per job posting", "AI writing help", "The whole product"],
          ["Reads a job URL", "No", "Yes"],
          ["Watermark on free exports", "Yes", "No watermark, ever"],
          ["Cover letter", "Yes", "Yes, from the tailored CV"],
          ["Pricing model", "Subscription", "Subscription or one payment"],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [Kickresume's pricing page](https://www.kickresume.com/en/pricing/) and [ours](/pricing).`,
    },

    { h2: "Why fewer templates is the right call" },
    {
      p: "Two column layouts with a sidebar look good and parse badly. When an applicant tracking system converts your PDF to text, a sidebar can interleave with the main column and turn your work history into nonsense. The recruiter never sees the design; they see the parse.",
    },
    {
      p: "Every FitMyCV theme is single column for that reason. If you want to see what a parser does to your current CV, the [ATS resume guide](/blog/ats-resume-guide) walks through it.",
    },

    { h2: "If you need both" },
    {
      p: "Build the CV wherever you like, including Kickresume. Export it as a PDF, upload it here once, and tailor from that. We are not trying to own the document. We are trying to stop you rewriting it forty times by hand.",
    },
    {
      p: "Start with the [free ATS resume checker](/ats-resume-checker) to see how the CV you have already built scores against a real posting.",
    },
  ],
  related: [
    {
      label: "CV templates",
      href: "/cv-templates",
      body: "16 single column themes, all built to survive a parser.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Upload once, then adapt it to each posting from the URL.",
    },
    {
      label: "The complete ATS resume guide",
      href: "/blog/ats-resume-guide",
      body: "Why layout, not wording, is what usually breaks a CV.",
    },
  ],
};
