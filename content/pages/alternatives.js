// Competitor comparison landing pages.
//
// ponytail: every price quoted here is dated and linked to the competitor's own
// pricing page, because these numbers go stale and an undated claim rots into a
// lie. If you update one, update the "checked" date in the same block.

import { PRICING } from "@/lib/pricing";

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
      a: "19 themes. That is fewer than Kickresume offers, and deliberately so: they are all single column and parser safe, because a template that scrambles in an ATS is not a design choice, it is a bug.",
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
          ["Template count", "Large gallery", "17, sixteen single column"],
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
      body: "19 layouts, sixteen single column, all built to survive a parser.",
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

export const huntrAlternative = {
  slug: "huntr-alternative",
  seoTitle: "Huntr Alternative: The Rewrite Without the Tracker",
  description:
    "A Huntr alternative for people who want the tailored CV, not a job board to maintain. Paste a job link, get a rewritten CV and cover letter. One payment, no subscription.",
  keywords: [
    "huntr alternative",
    "huntr alternatives",
    "huntr competitor",
    "cheaper than huntr",
    "huntr vs fitmycv",
    "free huntr alternative",
    "huntr resume tailor alternative",
    "job tracker alternative",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Huntr alternative",
  h1: "A Huntr alternative that skips the tracker",
  lede:
    "Huntr is a job tracker with a tailoring feature attached. If you want the kanban board, the autofill, and 100 applications in one place, Huntr is the better buy and this page will not talk you out of it. If you only ever wanted the tailored CV, you are paying for a workspace you do not open.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "See what it costs", href: "/pricing", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Huntr alternative?",
      a: "It depends on which half of Huntr you actually use. If you want the pipeline tracking and the application autofill, nothing here replaces that, and Huntr does it well. If the tracker sat untouched and you were really there for the tailoring, FitMyCV does that one job from a job link.",
    },
    {
      q: "Is there a free Huntr alternative?",
      a: "Huntr's free plan gives you two job tailored resumes, then asks you to upgrade. Our free ATS resume checker has no scan limit and no account, because the matching runs in your browser. It scores and shows keyword gaps. The rewrite itself is paid.",
    },
    {
      q: "How much does Huntr cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, Huntr Pro lists $40 a month, or $90 billed quarterly, or $160 billed every six months. FitMyCV is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once for lifetime access. Six months of Huntr Pro is roughly five times our one time price. Check both pages before deciding, since these change.`,
    },
    {
      q: "Does FitMyCV track my applications?",
      a: "There is a saved list of everything you have tailored, so you can find the CV you sent to a role three weeks ago. It is not a pipeline board and it does not autofill applications. If that workflow matters to you, Huntr is built for it and we are not.",
    },
    {
      q: "Can I use both?",
      a: "Yes, and it is a reasonable setup. Track in Huntr on the free tier, tailor here, upload the finished PDF to the Huntr record. You keep the board without paying for tailoring twice.",
    },
  ],
  blocks: [
    { h2: "One product, two jobs" },
    {
      p: "Huntr bundles a job tracker and a resume tailor. That is a genuine advantage when you are running thirty live applications and need to remember who you spoke to. It is dead weight when you apply to four roles a month and just want the CV to fit.",
    },
    {
      p: "The pricing follows the bundle. You pay for the tracker whether or not you open it.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Huntr", "FitMyCV"],
        rows: [
          ["Job pipeline board", "Yes, up to 100 jobs free", "No"],
          ["Application autofill", "Yes, unlimited on free", "No"],
          ["Reads a job URL", "Yes", "Yes"],
          ["Tailored CVs on the free tier", "2", "0, the checker is free instead"],
          ["Rewrites the CV for you", "Yes", "Yes"],
          ["Cover letter", "Yes", "Yes, from the tailored CV"],
          ["One time payment option", "No", `Yes, $${PRICING.lifetime.price}`],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [Huntr's pricing page](https://huntr.co/pricing) and [ours](/pricing).`,
    },

    { h2: "Where Huntr is genuinely better" },
    {
      p: "The autofill is the part people underrate. Huntr fills application forms from your saved profile, and on a portal that asks for your entire work history in separate fields, that saves real time. We do nothing like it.",
    },
    {
      p: "The free tier is also generous on the tracking side: 100 jobs, unlimited contacts, unlimited autofills. If you are early in a search and want structure for nothing, start there.",
    },

    { h2: "Where the subscription stops making sense" },
    {
      p: "Job searches end. A subscription does not, unless you remember to cancel it. That is the argument for a one time price: you buy the tool, you find the job, and there is no monthly line item running against a problem you no longer have.",
    },
    {
      callout: {
        title: "The honest version",
        body: "If you will use a tracker every week for six months, Huntr is worth its price and this comparison is not for you. If you tried a tracker and stopped opening it by week two, you already know which half you were paying for.",
      },
    },

    { h2: "If you want to test the difference" },
    {
      p: "Run your current CV through the [free ATS resume checker](/ats-resume-checker) against a real posting. It shows the keyword gaps without an account. If the gaps look like the reason you are not hearing back, [tailoring from the job link](/tailor-cv-from-job-link) is the fix.",
    },
  ],
  related: [
    {
      label: "Teal alternative",
      href: "/teal-alternative",
      body: "The other tracker and tailor bundle, compared the same way.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Upload once, then adapt it to each posting from the URL.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting with no account and no limit.",
    },
  ],
};

export const enhancvAlternative = {
  slug: "enhancv-alternative",
  seoTitle: "Enhancv Alternative: Aimed at the Job, Not the Layout",
  description:
    "An Enhancv alternative for people who need the CV to match the posting, not to look distinctive. Single column, parser safe, rewritten from a job link.",
  keywords: [
    "enhancv alternative",
    "enhancv alternatives",
    "enhancv competitor",
    "cheaper than enhancv",
    "enhancv vs fitmycv",
    "free enhancv alternative",
    "enhancv resume builder alternative",
    "ats safe resume builder",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Enhancv alternative",
  h1: "An Enhancv alternative that aims the CV",
  lede:
    "Enhancv is a design tool. It makes a CV that looks unlike everyone else's, and it is very good at that. FitMyCV assumes your CV already looks fine and the problem is that it says the same thing to every employer. Different problem, different product.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free first", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Enhancv alternative?",
      a: "If you want the design work, look at Kickresume or stay with Enhancv, because our layouts are deliberately plain. If you want the CV rewritten to match a specific posting, that is what FitMyCV does, and it starts from the job link rather than a template gallery.",
    },
    {
      q: "Is there a free Enhancv alternative?",
      a: "Enhancv's free tier runs for 7 days and puts Enhancv branding on the export. Our ATS resume checker is free with no time limit, no account, and no watermark, but it scores rather than builds. The rewrite is paid.",
    },
    {
      q: "How much does Enhancv cost compared to FitMyCV?",
      a: `We could not quote an Enhancv figure honestly. When we checked in ${PRICE_CHECKED} their pricing page returned a calculation error instead of a price, so any number here would be a guess. Read it yourself at [enhancv.com/pricing](https://enhancv.com/pricing/). Ours is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once, on [our pricing page](/pricing).`,
    },
    {
      q: "Are your templates as good looking as Enhancv's?",
      a: "No. Enhancv's design tooling is ahead of ours and it is not close. Ours are single column and plain on purpose, because that is what survives a parser. If the CV is going to a design studio, the visual difference may be worth more than the parse safety.",
    },
    {
      q: "Can I use both?",
      a: "Yes. Build the CV in Enhancv, export the PDF, upload it here once, and tailor from that for each posting. We are not trying to own the document.",
    },
  ],
  blocks: [
    { h2: "Design or aim" },
    {
      p: "Enhancv sells distinctiveness. The pitch is a CV that does not look like the other two hundred in the pile, and for some roles that is exactly right.",
    },
    {
      p: "The tradeoff is that distinctive usually means multi column, and multi column is where parsers fail. A sidebar can interleave with the main column when an applicant tracking system converts your PDF to text, and your work history arrives as nonsense. The recruiter never sees the design. They see the parse.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Enhancv", "FitMyCV"],
        rows: [
          ["Visual design range", "Wide, its main strength", "Narrow, single column only"],
          ["Builds a CV from scratch", "Yes, full editor", "No, you bring one"],
          ["Reads a job URL", "No, paste the description", "Yes"],
          ["Rewrites to match a posting", "AI suggestions", "The whole product"],
          ["Branding on free exports", "Yes, on the free tier", "No watermark, ever"],
          ["Free tier length", "7 days", "Unlimited on the checker"],
          ["One time payment option", "Not listed", `Yes, $${PRICING.lifetime.price}`],
        ],
      },
    },
    {
      p: `Feature detail checked ${PRICE_CHECKED} on [Enhancv's pricing page](https://enhancv.com/pricing/), which did not render a price at the time. Ours is on [our pricing page](/pricing).`,
    },

    { h2: "Why our layouts are deliberately boring" },
    {
      p: "Every FitMyCV theme is single column. That is a constraint, not an oversight. One column means the parser reads your history in the order you wrote it, which is the only formatting decision that reliably changes whether a human sees your CV at all.",
    },
    {
      p: "If you want to watch this happen to your current CV, the [ATS resume guide](/blog/ats-resume-guide) walks through what a parser does to a sidebar.",
    },

    { h2: "Where Enhancv is genuinely better" },
    {
      p: "The editor. Enhancv's live design tooling, section variety, and template range are a different class from ours, and if your CV is currently ugly in a way that is costing you, fixing that is a real gain. We do not compete there and we are not going to pretend otherwise.",
    },

    { h2: "The sequence that uses both" },
    {
      steps: [
        {
          title: "Build it once, wherever it looks best",
          body: "Enhancv, Kickresume, Google Docs. The tool does not matter as long as the export is a text based PDF.",
        },
        {
          title: "Check the parse",
          body: "Run it through the [free ATS resume checker](/ats-resume-checker). If a sidebar is scrambling your history, you will see it here.",
        },
        {
          title: "Aim it per posting",
          body: "Upload once, then [tailor from each job link](/tailor-cv-from-job-link). The design stays yours. The wording moves to match the role.",
        },
      ],
    },
  ],
  related: [
    {
      label: "Kickresume alternative",
      href: "/kickresume-alternative",
      body: "The other builder first tool, compared on the same terms.",
    },
    {
      label: "CV templates",
      href: "/cv-templates",
      body: "Plain single column layouts built to survive a parser.",
    },
    {
      label: "The complete ATS resume guide",
      href: "/blog/ats-resume-guide",
      body: "Why layout, not wording, is what usually breaks a CV.",
    },
  ],
};

export const reziAlternative = {
  slug: "rezi-alternative",
  seoTitle: "Rezi Alternative: Rewrites the CV You Have",
  description:
    "A Rezi alternative that starts from your existing CV and a job link instead of a blank editor. Lifetime access for a fraction of Rezi's one time price.",
  keywords: [
    "rezi alternative",
    "rezi alternatives",
    "rezi competitor",
    "cheaper than rezi",
    "rezi vs fitmycv",
    "free rezi alternative",
    "rezi ai alternative",
    "rezi lifetime alternative",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Rezi alternative",
  h1: "A Rezi alternative that starts from your CV",
  lede:
    "Rezi builds an ATS friendly CV from scratch, scoring as you type. It is a solid way to produce a first document. FitMyCV assumes you already have one and the job is aiming it at a specific posting, which is a different task and a much smaller purchase.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Compare the price", href: "/pricing", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Rezi alternative?",
      a: "If you are writing a CV for the first time and want structure while you type, Rezi is built for exactly that and does it well. If your CV exists and is not getting replies, the gap is usually aim rather than structure, and that is what FitMyCV works on.",
    },
    {
      q: "Is there a free Rezi alternative?",
      a: "Rezi's free plan covers one resume and three PDF downloads. Our ATS resume checker is free with no download cap and no account, because it runs in your browser. It tells you what is missing. The rewrite is paid.",
    },
    {
      q: "How much does Rezi cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, Rezi lists Pro at $29 a month and a lifetime option at $149 as a one time payment. FitMyCV is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once. Both of us sell lifetime access, so it is a clean comparison: $149 against $${PRICING.lifetime.price}. Check both pages, since these change.`,
    },
    {
      q: "Does Rezi offer anything FitMyCV does not?",
      a: "Yes, two things worth naming. Rezi ships a 30 day money back guarantee on paid plans and we do not offer a refund window on the one time purchase. Rezi also includes AI interview practice, which we do not do at all.",
    },
    {
      q: "Can I use both?",
      a: "Yes. Build the base CV in Rezi on the free plan, export the PDF, then upload it here and tailor per posting. You get the structured first draft without paying for two subscriptions.",
    },
  ],
  blocks: [
    { h2: "Blank page or wrong aim" },
    {
      p: "These tools solve problems that feel similar and are not. Rezi solves the blank page: you need a CV, it should be ATS friendly, and you want scoring while you write it.",
    },
    {
      p: "FitMyCV solves the fortieth application: the CV is fine, you have sent it everywhere, and nobody has replied. Rebuilding it will not help, because the document is not badly built. It is badly aimed.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Rezi", "FitMyCV"],
        rows: [
          ["Builds a CV from scratch", "Yes, its main job", "No, you bring one"],
          ["Reads a job URL", "No, paste the description", "Yes"],
          ["Rewrites per posting", "Keyword targeting", "The whole product"],
          ["Free tier", "1 resume, 3 PDF downloads", "Unlimited free checks, no account"],
          ["Interview practice", "Yes", "No"],
          ["Money back guarantee", "30 days", "None on the one time purchase"],
          ["Lifetime price", "$149 once", `$${PRICING.lifetime.price} once`],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [Rezi's pricing page](https://www.rezi.ai/pricing) and [ours](/pricing).`,
    },

    { h2: "The lifetime comparison is the honest one" },
    {
      p: `Most comparisons on this page type set a monthly price against a one time price and call it a saving. That is not a fair read. Rezi and FitMyCV both sell lifetime access, so the numbers line up directly: $149 against $${PRICING.lifetime.price}, checked ${PRICE_CHECKED}.`,
    },
    {
      p: "What the higher price buys you is a full editor, interview practice, and a refund window. Whether that is worth the difference depends on whether you need a CV built or a CV aimed.",
    },

    { h2: "Where Rezi is genuinely better" },
    {
      p: "The 30 day money back guarantee is a real advantage and we do not match it. If you are unsure whether any of this category works for you, buying the one with a refund window is the rational move.",
    },
    {
      p: "Real time scoring while you type is also a better teaching tool than a report after the fact. You learn the habits rather than outsourcing them.",
    },

    { h2: "Start with the free check" },
    {
      p: "Before paying either of us, run your current CV against a real posting in the [free ATS resume checker](/ats-resume-checker). If the structure is broken, Rezi is the better buy. If the structure is fine and the keywords are missing, [tailoring from the job link](/tailor-cv-from-job-link) is the shorter path.",
    },
  ],
  related: [
    {
      label: "Jobscan alternative",
      href: "/jobscan-alternative",
      body: "The scoring tool, compared on the same terms.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Upload once, then adapt it to each posting from the URL.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting with no account and no limit.",
    },
  ],
};

export const resumeWordedAlternative = {
  slug: "resume-worded-alternative",
  seoTitle: "Resume Worded Alternative: The Rewrite, Not the Grade",
  description:
    "A Resume Worded alternative that returns the rewritten CV instead of a score and a to do list. Paste a job link, get a tailored CV and cover letter.",
  keywords: [
    "resume worded alternative",
    "resume worded alternatives",
    "resume worded competitor",
    "cheaper than resume worded",
    "resume worded vs fitmycv",
    "free resume worded alternative",
    "resume grader alternative",
    "targeted resume tool",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Resume Worded alternative",
  h1: "A Resume Worded alternative that does the rewrite",
  lede:
    "Resume Worded grades. It scores your CV, scores your LinkedIn, and hands you a line by line list of what to fix. Then the fixing is yours. FitMyCV reads the job link and returns the CV already rewritten, plus a cover letter.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Grade my CV free first", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best Resume Worded alternative?",
      a: "If you want feedback and intend to do the editing yourself, Resume Worded's line level critique is more detailed than ours and it also covers LinkedIn. If you want the edited document back, FitMyCV does that from a job link.",
    },
    {
      q: "Is there a free Resume Worded alternative?",
      a: "Resume Worded's free tier gives you a partial Score My Resume report and holds the full analysis behind Pro. Our ATS resume checker is free and complete: full keyword match, no account, no scan cap, because it runs in your browser.",
    },
    {
      q: "How much does Resume Worded cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, Resume Worded Pro lists $49 a month, $99 billed quarterly, or $229 billed for a year. FitMyCV is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once for lifetime access. One year of Resume Worded Pro is roughly seven times our one time price. Check both pages, since these change.`,
    },
    {
      q: "Does FitMyCV review my LinkedIn profile?",
      a: "No. Resume Worded grades your LinkedIn profile as well as your CV, and that is a genuinely useful feature we do not have. If LinkedIn feedback is what you are shopping for, we are not the tool.",
    },
    {
      q: "Can I use both?",
      a: "Yes, and the order matters. Tailor here first, then run the result through Resume Worded as a second opinion. A grader is more useful pointed at a finished document than at a generic one.",
    },
  ],
  blocks: [
    { h2: "A grade is not a rewrite" },
    {
      p: "Resume Worded tells you the bullet is weak. It will suggest stronger lines and show you phrasing from strong candidates. What it hands back is a report.",
    },
    {
      p: "That is useful once. It is less useful on the fortieth application, because the work of applying the feedback lands on you every single time, and it is twenty to forty minutes per role.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Resume Worded", "FitMyCV"],
        rows: [
          ["Scores the CV", "Yes, line by line", "Yes, keyword match"],
          ["Grades your LinkedIn", "Yes", "No"],
          ["Reads a job URL", "No, paste the description", "Yes"],
          ["Returns the rewritten CV", "Suggested lines", "Yes, the full document"],
          ["Cover letter", "No", "Yes, from the tailored CV"],
          ["Full report on the free tier", "No", "Yes, on the checker"],
          ["One time payment option", "No", `Yes, $${PRICING.lifetime.price}`],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [Resume Worded's pricing page](https://resumeworded.com/get-pro) and [ours](/pricing).`,
    },

    { h2: "Where Resume Worded is genuinely better" },
    {
      p: "The LinkedIn grader has no equivalent here. Your profile is doing recruiting work while you sleep and most people never audit it. If that is the gap in your search, Resume Worded addresses it and we do not.",
    },
    {
      p: "Its critique is also more granular than our keyword match. We tell you which terms the posting expects and whether they appear. Resume Worded will argue with your verb choice.",
    },

    { h2: "The case for getting the document back" },
    {
      p: "The argument for a rewrite tool is not that the feedback is wrong. It is that feedback plus forty applications is a second job. Reading a report is fast. Acting on it, per role, is not.",
    },
    {
      callout: {
        title: "Try the cheap test first",
        body: "Run one posting through our free checker and read the keyword gaps. If seeing the gaps is enough and you enjoy the editing, a grader is all you need and it is the cheaper habit. If you look at the list and think you will not do this forty times, that is the honest signal.",
      },
    },

    { h2: "Where to start" },
    {
      p: "The [free ATS resume checker](/ats-resume-checker) gives you the full match report with no account. If the gaps are real, [tailoring from the job link](/tailor-cv-from-job-link) closes them and returns the document.",
    },
  ],
  related: [
    {
      label: "Jobscan alternative",
      href: "/jobscan-alternative",
      body: "The other scoring tool, compared on the same terms.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Full keyword match with no account and no scan cap.",
    },
    {
      label: "How to find resume keyword gaps",
      href: "/blog/how-to-find-resume-keyword-gaps",
      body: "What a match report is actually telling you.",
    },
  ],
};

export const tailoredcvAlternative = {
  slug: "tailoredcv-alternative",
  seoTitle: "TailoredCV Alternative: Same Job, From the Link",
  description:
    "A TailoredCV.ai alternative that reads the job posting from its URL instead of asking you to paste it. One payment option, and a free checker with no account.",
  keywords: [
    "tailoredcv alternative",
    "tailoredcv ai alternative",
    "tailoredcv competitor",
    "cheaper than tailoredcv",
    "tailoredcv vs fitmycv",
    "free tailoredcv alternative",
    "ai cv tailoring alternative",
    "resume tailoring tool comparison",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "TailoredCV alternative",
  h1: "A TailoredCV alternative that reads the link",
  lede:
    "TailoredCV.ai and FitMyCV make close to the same promise: your CV, rewritten to match a posting, ATS safe at the end. The differences are narrow and worth being precise about, because on a page like this the vague version is usually the dishonest one.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "See the pricing", href: "/pricing", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the difference between TailoredCV and FitMyCV?",
      a: "Two things mainly. TailoredCV asks you to paste the job posting text; FitMyCV takes the job URL and reads the posting itself. And TailoredCV is subscription only, while FitMyCV has a one time option. On the core rewrite, the products are genuinely similar.",
    },
    {
      q: "Is there a free TailoredCV alternative?",
      a: "TailoredCV has no free plan, though it does publish free standalone tools including a keyword extractor and an ATS checker. Our free ATS resume checker is comparable: no account, no scan cap. Neither of us gives away the full rewrite.",
    },
    {
      q: "How much does TailoredCV cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, TailoredCV Pro lists $15 a month, or $150 for a year, which works out at $12.50 a month. FitMyCV is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once. A single year of TailoredCV is about five times our one time price. Check both pages, since these change.`,
    },
    {
      q: "Does TailoredCV do anything FitMyCV does not?",
      a: "Its free standalone tools are good and there are more of them than ours: a keyword extractor, a bullet rewriter, and a summary generator, all usable without paying. If you only want to fix three bullet points, that is a real option and it costs nothing.",
    },
    {
      q: "Which one should I pick?",
      a: "If you apply through links and want the posting read for you, or you would rather not hold a subscription through a long search, FitMyCV fits better. If you paste job text anyway and prefer a monthly plan, the two are close enough that price is the deciding factor.",
    },
  ],
  blocks: [
    { h2: "The overlap is real" },
    {
      p: "Most comparison pages open by inventing a gap. This one should not. TailoredCV restructures and rewrites a CV against a posting, keeps it ATS friendly, and does it well. That is our product description too.",
    },
    {
      p: "So the useful question is not which is better in general. It is which of two narrow differences matters to how you actually apply.",
    },

    { h2: "Difference one: link or paste" },
    {
      p: "TailoredCV asks you to paste the job posting. FitMyCV takes the URL and reads the posting itself, including the parts hidden behind a 'see more' toggle that people routinely miss when copying by hand.",
    },
    {
      p: "If you apply from LinkedIn or Indeed, this is the difference between one paste and three. If you get postings as text in an email from a recruiter, it is worth nothing to you.",
    },

    { h2: "Difference two: subscription or one payment" },
    {
      p: `TailoredCV is billed monthly or yearly. FitMyCV offers $${PRICING.month.price} a month or $${PRICING.lifetime.price} once. Job searches end, subscriptions do not unless you cancel them, and that is the whole argument for a one time price.`,
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "TailoredCV", "FitMyCV"],
        rows: [
          ["Rewrites the CV to a posting", "Yes", "Yes"],
          ["Reads a job URL", "No, paste the text", "Yes"],
          ["Cover letter", "Yes", "Yes, from the tailored CV"],
          ["Free standalone tools", "Several, no account", "ATS checker, no account"],
          ["Free plan for the rewrite", "No", "No"],
          ["Monthly price", "$15", `$${PRICING.month.price}`],
          ["One time payment option", "No", `Yes, $${PRICING.lifetime.price}`],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [TailoredCV's site](https://tailoredcv.ai/) and [our pricing page](/pricing).`,
    },

    { h2: "Where TailoredCV is genuinely better" },
    {
      p: "The free tool set. A keyword extractor, a bullet rewriter and a summary generator, all free and all usable without an account, is more free utility than we publish. If your CV needs three specific repairs rather than a rewrite, use those and pay nobody.",
    },
    {
      callout: {
        title: "A fair way to test both",
        body: "Take one posting you actually want. Run it through our free checker to see the keyword gaps, then try each tool's rewrite on the same posting and compare the output side by side. Two tools trained on the same task will differ most on tone, and tone is the part only you can judge.",
      },
    },

    { h2: "Start with the free check" },
    {
      p: "The [free ATS resume checker](/ats-resume-checker) needs no account and has no scan limit. If the gaps it finds look like the reason you are not hearing back, [tailoring from the job link](/tailor-cv-from-job-link) closes them.",
    },
  ],
  related: [
    {
      label: "Seekario alternative",
      href: "/seekario-alternative",
      body: "The other tool that reads a job URL, compared honestly.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Upload once, then adapt it to each posting from the URL.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting with no account and no limit.",
    },
  ],
};

export const seekarioAlternative = {
  slug: "seekario-alternative",
  seoTitle: "Seekario Alternative: The Rewrite Without the Credits",
  description:
    "A Seekario alternative for people who want unlimited tailoring without metering AI credits. One payment, no monthly plan, job link in and CV out.",
  keywords: [
    "seekario alternative",
    "seekario alternatives",
    "seekario competitor",
    "cheaper than seekario",
    "seekario vs fitmycv",
    "free seekario alternative",
    "ai resume tailor alternative",
    "job url resume tailoring",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "Seekario alternative",
  h1: "A Seekario alternative without the credit meter",
  lede:
    "Seekario is the closest thing to us on features. It reads a job URL, it has a Chrome extension, and it tailors a CV to the posting. If you want that plus a job search workspace, it is a fair buy. The split is how you pay: credits and tiers there, one price here.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Compare the price", href: "/pricing", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the difference between Seekario and FitMyCV?",
      a: "Feature for feature they are close, and Seekario has a Chrome extension we do not. The difference is the pricing model. Seekario meters AI credits across tiers, so unlimited tailoring means the top plan. FitMyCV has one product and no credit counting.",
    },
    {
      q: "Is there a free Seekario alternative?",
      a: "Seekario has a free forever plan with 5 AI credits, which is genuinely useful for trying it. Our free ATS resume checker is unmetered but only scores. Different shapes of free: they give you a few full rewrites, we give you unlimited diagnosis.",
    },
    {
      q: "How much does Seekario cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, Seekario lists a free tier with 5 AI credits, Casual at $12 a month for 40 credits, and Active at $39 a month or $79 a quarter for unlimited credits. FitMyCV is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once, with no credit limit on either. Check both pages, since these change.`,
    },
    {
      q: "Does Seekario do anything FitMyCV does not?",
      a: "Yes. The Chrome extension pulls job details from the page you are already looking at, which is a smoother workflow than copying a URL. Seekario also bundles job search, contacts, and application tracking. We do none of that.",
    },
    {
      q: "Do I have to count credits with FitMyCV?",
      a: "No. There is one paid product and it does not meter rewrites. That is a simpler promise to make when the tool does one job rather than running a whole workspace.",
    },
  ],
  blocks: [
    { h2: "The closest feature match, and where it splits" },
    {
      p: "Almost every tool in this category asks you to paste the job description. Seekario does not, and neither do we. That puts it closer to FitMyCV than anything else on the market, and it deserves saying up front.",
    },
    {
      p: "The split is not features. It is the shape of the purchase.",
    },

    { h2: "Credits versus one price" },
    {
      p: "Seekario meters AI credits: 5 free, 40 on the middle tier, unlimited at the top. Metering is honest pricing, and for light use the middle tier may be cheaper than anything we sell.",
    },
    {
      p: "It also changes how you behave. When rewrites are counted, you ration them, and you skip tailoring for the role you were unsure about. That is the role worth tailoring for.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "Seekario", "FitMyCV"],
        rows: [
          ["Reads a job URL", "Yes", "Yes"],
          ["Chrome extension", "Yes", "No"],
          ["Job search and tracking", "Yes", "No"],
          ["AI usage metered by credits", "Yes, by tier", "No"],
          ["Free tier", "5 AI credits", "Unlimited free checks, no rewrite"],
          ["Unlimited tailoring price", "$39/month", `$${PRICING.month.price}/month or $${PRICING.lifetime.price} once`],
          ["One time payment option", "No", `Yes, $${PRICING.lifetime.price}`],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [Seekario's pricing](https://seekario.ai/ai-resume-tailor) and [ours](/pricing).`,
    },

    { h2: "Where Seekario is genuinely better" },
    {
      p: "The Chrome extension. Copying a URL is a small friction, but small frictions are what stop people tailoring on application thirty. An extension that reads the page you are on removes it, and we do not have an answer to that.",
    },
    {
      p: "The free tier is also the more generous shape if you want to test the actual output. Five real rewrites tell you more about whether a tool suits your voice than any number of score reports.",
    },

    { h2: "Who should pick which" },
    {
      ul: [
        "**Pick Seekario** if you want one workspace for searching, tracking and tailoring, or if the extension workflow is what makes you actually do it.",
        "**Pick FitMyCV** if you already have a system for tracking and only want the rewrite, or if you would rather buy once than hold a plan through a search of unknown length.",
        "**Pick either** if you are light touch. At forty credits a month for $12, Seekario's middle tier is competitive and we are not going to pretend otherwise.",
      ],
    },

    { h2: "Try the free check first" },
    {
      p: "Run one posting through the [free ATS resume checker](/ats-resume-checker) before paying anyone. If the gaps are small, neither tool is urgent. If they are large, [tailoring from the job link](/tailor-cv-from-job-link) shows what a rewrite changes.",
    },
  ],
  related: [
    {
      label: "TailoredCV alternative",
      href: "/tailoredcv-alternative",
      body: "The closest positioning rival, compared line by line.",
    },
    {
      label: "Huntr alternative",
      href: "/huntr-alternative",
      body: "The other workspace bundle, weighed against a single job tool.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Upload once, then adapt it to each posting from the URL.",
    },
  ],
};

export const visualcvAlternative = {
  slug: "visualcv-alternative",
  seoTitle: "VisualCV Alternative: Per Application, Not Per Portfolio",
  description:
    "A VisualCV alternative for people who need each application aimed rather than one hosted CV. Paste a job link, get a rewritten CV and cover letter.",
  keywords: [
    "visualcv alternative",
    "visualcv alternatives",
    "visualcv competitor",
    "cheaper than visualcv",
    "visualcv vs fitmycv",
    "free visualcv alternative",
    "online cv builder alternative",
    "resume hosting alternative",
  ],
  eyebrow: "Comparison",
  breadcrumbName: "VisualCV alternative",
  h1: "A VisualCV alternative aimed at each application",
  lede:
    "VisualCV is a home for your CV: templates, a hosted personal site, a shareable link, a career journal. FitMyCV is not a home for anything. It rewrites the CV you already have to match one specific posting, and then you send it.",
  ctas: [
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link" },
    { label: "Check my CV free first", href: "/ats-resume-checker", variant: "secondary" },
  ],
  faqs: [
    {
      q: "What is the best VisualCV alternative?",
      a: "If you want the hosted CV, the personal site and the shareable link, look at VisualCV or Kickresume, because we host nothing. If you want each application aimed at its posting, that is what FitMyCV does.",
    },
    {
      q: "Is there a free VisualCV alternative?",
      a: "VisualCV's free tier is genuinely generous: your first resume, unlimited PDF downloads, and a personal site. We will not undersell that. Our free ATS resume checker is unlimited but scores rather than builds.",
    },
    {
      q: "How much does VisualCV cost compared to FitMyCV?",
      a: `As of ${PRICE_CHECKED}, VisualCV Pro lists $16 a month billed quarterly, and the free tier covers one resume with unlimited PDF downloads. FitMyCV is $${PRICING.month.price} a month or $${PRICING.lifetime.price} once. Check both pages, since these change.`,
    },
    {
      q: "Does FitMyCV host my CV or give me a personal site?",
      a: "No. There is no hosted profile, no public link, no career journal. You upload a reference CV, tailor from it, and download PDFs. If a hosted presence is what you are shopping for, VisualCV does it and we do not.",
    },
    {
      q: "Can I use both?",
      a: "Yes, and they barely overlap. Keep the hosted CV and personal site on VisualCV, export the PDF, and tailor from it here for each posting you actually apply to.",
    },
  ],
  blocks: [
    { h2: "One document or forty" },
    {
      p: "VisualCV is built around a CV as an artefact you maintain. You style it, you host it, you share a link, you keep a career journal feeding it. That model suits people who are visible and approached, rather than applying in volume.",
    },
    {
      p: "Applying in volume is a different problem. Forty applications means forty postings with different vocabulary, and a single maintained document cannot be aimed at all of them at once.",
    },

    { h2: "Side by side" },
    {
      table: {
        head: ["", "VisualCV", "FitMyCV"],
        rows: [
          ["Hosted CV and personal site", "Yes", "No"],
          ["Shareable public link", "Yes", "No"],
          ["Career journal", "Yes", "No"],
          ["Reads a job URL", "No", "Yes"],
          ["Rewrites per posting", "No", "The whole product"],
          ["Free tier", "1 resume, unlimited PDFs", "Unlimited free checks"],
          ["One time payment option", "No", `Yes, $${PRICING.lifetime.price}`],
        ],
      },
    },
    {
      p: `Checked ${PRICE_CHECKED}. Confirm on [VisualCV's pricing page](https://www.visualcv.com/pricing/) and [ours](/pricing).`,
    },

    { h2: "Where VisualCV is genuinely better" },
    {
      p: "The free tier. One resume with unlimited PDF downloads and a personal site, at no cost, is more than most tools in this category give away, and it is enough for a lot of people to never need a paid plan at all.",
    },
    {
      p: "The career journal is also a quietly good idea. Most people cannot remember what they achieved in March by the time they update a CV in November, and a running log fixes that. We have a [story bank](/dashboard/story-bank) that serves a similar purpose, but VisualCV got there first.",
    },

    { h2: "The case for aiming instead of hosting" },
    {
      p: "A hosted CV is a broadcast. It says the same thing to everyone who opens the link, which is right for inbound interest and wrong for a specific application.",
    },
    {
      p: "If you are being approached, host. If you are applying, aim. Most people need both, at different points in the same search.",
    },

    { h2: "Where to start" },
    {
      p: "Run your current CV through the [free ATS resume checker](/ats-resume-checker) against a posting you want. If it scores well, hosting is your gap, not tailoring. If the keywords are missing, [tailoring from the job link](/tailor-cv-from-job-link) is the shorter path.",
    },
  ],
  related: [
    {
      label: "Kickresume alternative",
      href: "/kickresume-alternative",
      body: "The other builder first tool, compared on the same terms.",
    },
    {
      label: "Enhancv alternative",
      href: "/enhancv-alternative",
      body: "Design led building, weighed against parser safety.",
    },
    {
      label: "Tailor a CV from a job link",
      href: "/tailor-cv-from-job-link",
      body: "Upload once, then adapt it to each posting from the URL.",
    },
  ],
};
