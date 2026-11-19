import { PRICING } from "@/lib/pricing";

const LIFETIME = `$${PRICING.lifetime.price}`;
const SINGLE = `$${PRICING.single.price}`;
const MONTH = `$${PRICING.month.price}`;

export const meta = {
  slug: "resume-builder-no-subscription",
  title: "Resume Builders With No Subscription: Free, One-Time and Lifetime Options",
  seoTitle: "Resume Builder No Subscription: Free & Lifetime Picks",
  description:
    "Which resume builders are free, which charge once, and which turn a $2.95 trial into a bill every four weeks. Pricing checked on each vendor's own page.",
  excerpt:
    "Most \"free\" resume builders let you build for free and charge you to download. Some turn a $2.95 trial into a bill every four weeks. Here is what each one actually charges, checked on their own pricing pages.",
  date: "2026-11-19",
  readingTime: 8,
  category: "Comparisons",
  tags: ["resume builder", "pricing", "lifetime", "free tools"],
  image: "/blog/resume-builder-no-subscription.jpg",
  imageAlt:
    "Flat illustration of a CV between a single paid receipt and a crossed out calendar of repeating charges",
  keywords: [
    "resume builder no subscription",
    "free resume builder no subscription",
    "lifetime resume tool",
    "resume builder one time payment",
    "resume builder lifetime deal",
    "which resume builder does not charge a monthly fee",
    "free online resume maker without recurring charges",
  ],
};

export const faqs = [
  {
    q: "Which resume builder does not charge a monthly fee?",
    a: "Reactive Resume is free and open source with no paid tier. FlowCV has a free forever plan with unlimited PDF downloads and no watermark. Rezi and FitMyCV both sell a lifetime plan you pay for once. Resume.io and Resume Genius start with a $2.95 trial that renews automatically every four weeks.",
  },
  {
    q: "Is there a lifetime resume tool?",
    a: `Yes. Rezi sells a Lifetime plan for $149, one payment. FitMyCV sells lifetime access for ${LIFETIME} once (less in some regions), which covers tailored CV and cover letter downloads. Check what lifetime includes before you buy: some tools mean lifetime access to templates only.`,
  },
  {
    q: "Why can I build a resume for free but not download it?",
    a: "Because the download is the paywall. Resume.io and Resume Genius both say on their pricing pages that free downloads are TXT only. A TXT file loses all formatting, so most people pay at that point, often into a trial that renews.",
  },
  {
    q: "How do I avoid a resume builder subscription charge?",
    a: "Before you enter a card, find the renewal line under the price. It usually says auto renews and how often. If it says billed every four weeks, that is 13 charges a year, not 12. Set a calendar reminder for the day before the trial ends, and cancel from your account settings.",
  },
  {
    q: "Is FitMyCV free?",
    a: `Building and previewing is free: upload your CV, paste a job link, and see a preview of the tailored CV and cover letter. Downloads are paid. You can pay ${LIFETIME} once for lifetime access, ${SINGLE} for a single CV and its cover letter, or ${MONTH} a month.`,
  },
];

export const blocks = [
  { h2: "The short answer" },
  {
    p: "Resume builders with no subscription come in three kinds: **truly free** (Reactive Resume, FlowCV's free plan), **pay once** (Rezi Lifetime, FitMyCV Lifetime, Novoresume's one month pass), and **free to build, paid to download**, where a cheap trial turns into a bill every four weeks (Resume.io, Resume Genius).",
  },
  {
    p: "I build FitMyCV, which sells a lifetime plan, so read this knowing that. Every price below comes from the vendor's own pricing page, checked on 19 November 2026. Prices change, so check the checkout page before you pay.",
  },

  { h2: "What does each resume builder actually charge?" },
  {
    table: {
      head: ["Builder", "Free PDF?", "Pay once option", "Subscription or trial"],
      rows: [
        ["Reactive Resume", "Yes, open source", "Not needed, no paid tier", "None"],
        ["FlowCV", "Yes, unlimited, no watermark", "No", "Pro $5/month, billed yearly, renews"],
        ["Novoresume", "Yes, with Novoresume branding", "1 month pass, one charge", "Pro renews each period"],
        ["Rezi", "3 PDF downloads", "Lifetime, $149", "Pro $29/month"],
        ["FitMyCV", "Preview only", `Lifetime, ${LIFETIME} (less in some regions)`, `${MONTH}/month, or ${SINGLE} for one CV`],
        ["Kickresume", "Not stated as PDF", "No", "$19/month, $27 per 3 months, $54 per year"],
        ["Resume.io", "No, TXT only", "No", "$2.95 for 7 days, then $29.95 every 4 weeks"],
        ["Resume Genius", "No, TXT only", "No", "$2.95 for 14 days, then $23.95 every four weeks"],
      ],
    },
  },
  {
    p: "Zety, LiveCareer, MyPerfectResume, Teal and Canva did not load for us, so they are not in the table. I would rather leave them out than print a price I could not check.",
  },

  { h2: "Which resume builders are actually free?" },
  {
    p: "Two are free with no catch you will hit:",
  },
  {
    ul: [
      "**[Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume)** is open source under the MIT licence. Its README says there is no tracking, no ads and no paid tier. It exports PDF and Word.",
      "**[FlowCV](https://flowcv.com/pricing)** has a free forever plan with unlimited PDF downloads and no branding. Pro adds extras and renews automatically.",
    ],
  },
  {
    p: "[Novoresume's](https://novoresume.com/pricing) Basic plan is free with no card and gives you a PDF, but it carries Novoresume branding. Google Docs templates are also free if you are happy doing the formatting yourself.",
  },
  {
    p: "Free works well when you need one resume. It gets slow when you are sending 10 to 20 versions a week, because you rewrite each one by hand. That is a time cost, not a money cost, but it is real.",
  },

  { h2: "Which resume tools have a lifetime plan?" },
  {
    p: "A lifetime resume tool charges you once and never again. Two I could confirm:",
  },
  {
    ul: [
      "**[Rezi Lifetime](https://www.rezi.ai/pricing):** $149, described as all features for one payment.",
      `**FitMyCV Lifetime:** ${LIFETIME} once, lower in some regions. You upload your CV once, paste a job link, and it rewrites your CV and writes a cover letter for that posting. Lifetime covers the downloads, the tracker and daily job matches.`,
    ],
  },
  {
    p: "Novoresume also sells a 1 month pass that its pricing page describes as one charge with nothing to cancel. That is pay once, but it ends after a month, so it suits a short search.",
  },
  {
    callout: {
      title: "Watch the word \"one time\"",
      body: "Resume Genius describes its annual plan as a \"one time payment of $95.40 for 12 month access\". The same line says it auto renews annually. One payment per year is still a subscription.",
    },
  },

  { h2: "How does a $2.95 trial turn into a subscription?" },
  {
    figure: {
      src: "/blog/resume-builder-no-subscription-trial.jpg",
      alt: "A timeline with one small coin at the start followed by a repeating row of larger coins",
      caption: "One small charge, then the real price, every four weeks.",
      width: 1200,
      height: 800,
    },
  },
  {
    p: "You build your resume for free. You click download. The free option is a TXT file, so you pick the $2.95 trial. If you do not cancel, it renews at the full price. Both of these come from the vendors' own pricing pages:",
  },
  {
    ul: [
      "**[Resume.io](https://resume.io/pricing):** 7 day trial for $2.95, then auto renews to $29.95 billed every 4 weeks.",
      "**[Resume Genius](https://resumegenius.com/pricing):** 14 day trial for $2.95, then auto renews at $23.95 billed every four weeks.",
    ],
  },
  {
    p: "Billed every four weeks means **13 charges a year, not 12**. The trial is not hidden. The renewal line sits right under the price. It is just easy to miss when you only wanted a PDF tonight.",
  },

  { h2: "What does that cost over a six month job search?" },
  {
    figure: {
      src: "/blog/resume-builder-no-subscription-cost.jpg",
      alt: "Bar chart comparing a flat cost that stays the same with a cost that grows every month",
      caption: "A flat price stays flat. A renewing plan keeps climbing.",
      width: 1200,
      height: 800,
    },
  },
  {
    p: "Here is the cost if you forget to cancel, over 26 weeks, using the prices above:",
  },
  {
    table: {
      head: ["Plan", "How it bills", "Total after 6 months"],
      rows: [
        ["Reactive Resume or FlowCV free", "Free", "$0"],
        ["FitMyCV Lifetime", "Once", LIFETIME],
        ["Rezi Lifetime", "Once", "$149"],
        ["Resume Genius trial, never cancelled", "$2.95, then $23.95 every 4 weeks", "$146.65 (6 renewals)"],
        ["Resume.io trial, never cancelled", "$2.95, then $29.95 every 4 weeks", "$212.60 (7 renewals)"],
      ],
    },
  },
  {
    p: "A trial you cancel on time costs $2.95, which is the cheapest paid option on this list. The risk is only in forgetting. Most job searches run longer than people plan for, which is where flat pricing wins.",
  },

  { h2: "How do you check a resume builder before you pay?" },
  {
    steps: [
      {
        title: "Check the free download format",
        body: "If free means TXT only, you will be asked to pay at the end. Know that before you spend an hour building.",
      },
      {
        title: "Read the line under the price",
        body: "Look for auto renews, billed every, and the full price after the trial.",
      },
      {
        title: "Set a reminder for the day before the trial ends",
        body: "Put it in your calendar the moment you pay.",
      },
      {
        title: "Find the cancel button first",
        body: "Open your account settings and find it before you need it. If you cannot find it, that tells you something.",
      },
    ],
  },

  { h2: "Which one should you pick?" },
  {
    ul: [
      "**One resume, no budget:** Reactive Resume or FlowCV.",
      "**A short search, one polished document:** a trial you cancel on time, or Novoresume's one month pass.",
      `**Many applications, each tailored to the job:** a lifetime plan, because tailoring is the slow part and a search can run for months. Preview for free, then pay ${LIFETIME} once if it is worth it.`,
    ],
  },
  {
    p: "If you are applying a lot, our guide on [how to apply to jobs faster](/blog/how-to-apply-to-jobs-faster) covers the rest of the routine. For a wider look at AI builders, see [the best AI resume builders compared](/blog/best-ai-resume-builders-2026).",
  },
  {
    cta: {
      title: "Preview a tailored CV for free",
      body: "Paste a job link and see your CV rewritten for it. No card needed to preview.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
