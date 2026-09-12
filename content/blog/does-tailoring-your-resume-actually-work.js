export const meta = {
  slug: "does-tailoring-your-resume-actually-work",
  title: "Does Tailoring Your Resume Actually Work?",
  seoTitle: "Does Tailoring Your Resume Actually Work?",
  description:
    "What the evidence on resume tailoring actually shows, which study everyone is quoting, and why the honest answer is narrower than the marketing claims.",
  excerpt:
    "The strongest public evidence is one field experiment, it was about cover letters, and it was run by a company that sells resume writing. Here is what it does and does not prove.",
  date: "2026-09-12",
  readingTime: 8,
  category: "Applications",
  tags: ["tailoring", "evidence", "callbacks", "research"],
  image: "/blog/does-tailoring-your-resume-actually-work.png",
  imageAlt:
    "Flat illustration of a CV with an upward trend arrow, magnifying glass, and checkmark",
  keywords: [
    "does tailoring your resume actually work",
    "does tailoring your resume work",
    "is tailoring your resume worth it",
    "resume tailoring statistics",
    "tailored resume callback rate",
    "does customizing your resume help",
  ],
};

export const faqs = [
  {
    q: "Does tailoring your resume actually work?",
    a: "The evidence points yes, but it is thinner than the marketing suggests. The strongest public field experiment tested tailored cover letters, not resumes: ResumeGo submitted 7,287 fictitious applications between July 2019 and January 2020 and found applications with a tailored cover letter had a 53% higher callback rate than applications with no cover letter. No comparable public experiment isolates the tailored resume by itself.",
  },
  {
    q: "Is there a study on tailored resumes specifically?",
    a: "Not a large public one that we could find. Most numbers you see quoted about tailored resumes trace back either to the ResumeGo cover letter study, to vendor marketing pages with no methodology attached, or to figures with no traceable origin at all. If a page gives you a percentage without naming a sample size and a date, treat it as advertising.",
  },
  {
    q: "How much of the effect is the cover letter and how much is the resume?",
    a: "Nobody has separated them publicly. The ResumeGo design compared no cover letter, a generic cover letter, and a tailored cover letter, so it measures the value of tailoring that document. It is reasonable to expect the same mechanism applies to a resume, since both work by matching the posting's language, but expecting it is not the same as measuring it.",
  },
  {
    q: "Should I tailor if the evidence is this thin?",
    a: "Yes, for two reasons that do not depend on the study. Recruiters search their applicant tracking system by keyword, so a CV missing the posting's terms is harder to find. And tailoring forces you to read the posting properly, which improves the application regardless of what any algorithm does with it.",
  },
  {
    q: "Why do so many articles quote 75% of resumes being rejected by ATS?",
    a: "Because it is repeated, not because it is sourced. We could not trace that figure to a primary study, and we are not going to repeat it. Applicant tracking systems do filter, and Harvard Business School and Accenture published a 2020 report called Hidden Workers: Untapped Talent examining exactly that, but the specific 75% number circulating online has no methodology behind it that we could verify.",
  },
];

export const blocks = [
  {
    p: "**Short answer: probably yes, and the honest evidence is narrower than anyone selling you a tool will admit.** The strongest public experiment tested tailored cover letters, not resumes, and it was run by a company that sells resume writing. That does not make it wrong. It makes it one study, with an interest, about a neighbouring document.",
  },
  {
    p: "This page exists because almost every article on this question opens with a confident percentage and never says where it came from. Below is what we could actually trace.",
  },

  { h2: "The one study worth citing" },
  {
    p: "ResumeGo ran a field experiment between 15 July 2019 and 10 January 2020, submitting 7,287 fictitious job applications. The applications were split into three groups: no cover letter, a generic cover letter, and a cover letter tailored to the specific posting. They counted interview callbacks within 30 days.",
  },
  {
    p: "Applications with a tailored cover letter had a **53% higher callback rate** than applications with no cover letter at all. You can read the [methodology on their research page](https://www.resumego.net/research/cover-letters/).",
  },
  {
    p: "That is a real experiment with a real sample size and a stated date range, which already puts it ahead of most numbers in this category.",
  },

  { h2: "What the study does not show" },
  {
    ul: [
      "**It is not about resumes.** It tested cover letters. Applying the finding to a CV is an inference, not a result.",
      "**The applications were fictitious.** That is standard for this method and it is also why the callbacks are callbacks, not hires. Nobody in the study got a job.",
      "**ResumeGo sells resume writing services.** A finding that tailoring works is commercially convenient for them. This does not invalidate the design, but it is a reason to want independent replication, and we could not find one.",
      "**It is from 2019 and 2020.** Hiring tooling has changed since, in both directions: better parsing, and far more AI generated applications competing with yours.",
    ],
  },

  { h2: "The numbers we deliberately did not use" },
  {
    p: "While researching this piece we kept meeting two claims. Neither made it in.",
  },
  {
    p: "**'Tailored resumes get 3x more interview callbacks.'** We could not find a study behind this. It appears on tool marketing pages, cited to nothing.",
  },
  {
    p: "**'75% of resumes are rejected by an ATS before a human sees them.'** Widely repeated, no traceable primary source. Applicant tracking systems genuinely do screen people out, and the Harvard Business School and Accenture report [Hidden Workers: Untapped Talent](https://www.hks.harvard.edu/centers/mrcbg/programs/growthpolicy/look-inside-hidden-workers-untapped-talent-joseph-fuller) (2020) is the serious work on that problem. But the specific 75% figure is folklore.",
  },
  {
    callout: {
      title: "How to read any statistic on this topic",
      body: "Ask three questions. What was the sample size? Over what dates? Who paid for it? A page that cannot answer all three is quoting another page that could not either. That includes pages selling you a tailoring tool, ours included, which is why the only figure on this page names all three.",
    },
  },

  { h2: "The case for tailoring that does not need a study" },
  {
    p: "Set the callback research aside. Two mechanisms are observable without an experiment.",
  },
  {
    p: "**Recruiters search by keyword.** An applicant tracking system is a database, and the people using it type terms into a search box to shortlist. A CV that does not contain the posting's vocabulary is harder to surface, whatever any scoring model thinks of it. This is not a filter you fail. It is a search you do not appear in.",
  },
  {
    p: "**Tailoring forces you to read the posting.** Most generic applications are generic because the applicant skimmed. The act of matching your experience to stated requirements surfaces the ones you cannot evidence, which is information worth having before an interview rather than during one.",
  },

  { h2: "Where tailoring does nothing" },
  {
    p: "It will not fix a genuine qualification gap. If a posting requires five years of a technology you have never used, no rewrite closes that, and a tool that claims otherwise is writing you a liability rather than a CV.",
  },
  {
    p: "It also will not help if your CV does not parse. Layout failures happen before wording matters: a two column CV with a sidebar can interleave into nonsense when converted to text. Our [ATS resume guide](/blog/ats-resume-guide) covers that, and it is worth ruling out first.",
  },

  { h2: "So how much should you do?" },
  {
    p: "Enough to cover the posting's real vocabulary with experience you actually have, and no more. Optimising past that point produces a CV written for a parser and read by nobody. We work through the stopping point in [how much you should tailor your resume](/blog/how-much-should-you-tailor-your-resume).",
  },
  {
    cta: {
      title: "See the gap before you decide",
      body: "The free ATS resume checker shows which of a posting's terms your CV already covers. No account, no scan limit. If the gaps are small, tailoring is not your bottleneck.",
      href: "/ats-resume-checker",
      label: "Check my CV free",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
