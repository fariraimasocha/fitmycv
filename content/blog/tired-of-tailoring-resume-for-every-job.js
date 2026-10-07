// Opinion post in Farirai's own voice (writer skill: facts from brain.md only).
export const meta = {
  slug: "tired-of-tailoring-resume-for-every-job",
  title: "Tired of Tailoring Your Resume for Every Job? Me Too.",
  seoTitle: "Tired of Tailoring Your Resume for Every Job? Do This Instead",
  description:
    "Tailoring every application is worth it, but not the way most people do it. Change the top third, keep the rest, and stop spending an hour per job.",
  excerpt:
    "Job seekers on Reddit are sick of tailoring. I built a tool for it from Harare. Here is what I think actually needs changing per job, and what does not.",
  date: "2026-10-07",
  updated: "2026-10-07",
  readingTime: 5,
  category: "Tailoring",
  tags: ["tailoring", "opinion", "job search", "workflow"],
  image: "/blog/does-tailoring-your-resume-actually-work.jpg",
  imageAlt: "Flat illustration of one CV being adjusted for several job postings",
  keywords: [
    "tired of tailoring resume",
    "tailoring resume for every job",
    "do i need to tailor my resume for every job",
    "is tailoring your resume worth it",
    "tailor resume every application",
  ],
};

export const faqs = [
  {
    q: "Do I really need to tailor my resume for every job?",
    a: "Yes, but only the top third: the summary, the order of your skills, and the first bullets of your most relevant role. The rest of the CV can stay the same for every application.",
  },
  {
    q: "How long should tailoring a resume take?",
    a: "Ten to fifteen minutes by hand once you have a master CV. If it takes an hour, you are rewriting things that do not need rewriting. See [how much to tailor](/blog/how-much-should-you-tailor-your-resume).",
  },
  {
    q: "Is it fine to send the same resume everywhere?",
    a: "For jobs with the same title in the same industry, mostly yes. The moment the posting names tools, skills or outcomes your CV does not mention, a generic CV loses to one that does.",
  },
  {
    q: "Can a tool tailor my resume for me?",
    a: "Yes. FitMyCV takes your CV and a job link and rewrites the summary and top bullets for that posting, with a cover letter. Free accounts see a preview. The full documents need a paid plan.",
  },
];

export const blocks = [
  {
    p: "A post on r/jobs is titled \"I'm sick and tired of tailoring my resume to every job\". Another on r/jobsearchhacks asks how to tailor a CV from a master resume, and what the best tool is. On r/askrecruiters someone asks if tailoring makes a big difference at all.",
  },
  { p: "Same pain, three subreddits." },
  {
    p: "I'm a software developer in Harare. I built FitMyCV because of that exact pain: paste a job link, get a tailored CV. So read this knowing I sell the shortcut. I'll still tell you where you don't need it.",
  },

  { h2: "My take: tailor every job, but only the top third" },
  {
    p: "Most people quit tailoring because they do it wrong. They open the whole CV and rewrite everything. Every bullet. Every role. An hour per application.",
  },
  { p: "That's not tailoring. That's rewriting your career every time." },
  { p: "Here's what actually changes per job:" },
  {
    ol: [
      "**The summary.** Three lines, in the posting's words, about the job they're hiring for.",
      "**The skills order.** The skills they named go first.",
      "**The first two or three bullets** of your most relevant role. Same facts, their language.",
    ],
  },
  { p: "Here's what doesn't:" },
  {
    ul: [
      "Your older roles.",
      "Your education.",
      "Your contact details and layout.",
      "Anything you'd have to invent to make it fit.",
    ],
  },
  {
    p: "If a job needs you to invent experience, it's the wrong job. Don't tailor that one. Skip it.",
  },

  { h2: "Keep one master CV" },
  {
    p: "Tailoring gets fast when you stop writing and start choosing. Keep one long master CV with every role, every bullet and every number you've got. For each job you copy it and delete what doesn't fit.",
  },
  {
    p: "Deleting is faster than writing. That one change cuts most of the time. The full method is in [how to tailor a CV from a master resume](/blog/tailor-cv-from-master-resume).",
  },

  { h2: "Check before you rewrite" },
  {
    p: "Don't guess what the posting wants. Paste it next to your CV in the [job match checker](/resume-job-match-checker) and look at the missing terms. That list is your tailoring to do list. Nothing else.",
  },
  {
    cta: {
      title: "See what this job wants from your CV",
      body: "Free, no sign-in. Your CV is read in your browser and never stored.",
      href: "/resume-job-match-checker",
      label: "Check my match",
    },
  },

  { h2: "When to stop tailoring" },
  {
    p: "Two jobs with the same title at similar companies? Send the same tailored version to both. Tailor for the type of job, not the company logo.",
  },
  {
    p: "And if you're applying to dozens of jobs a week, hand tailoring will burn you out. That's when a tool earns its price. If you want to do it for free, here's [how to tailor your resume for free](/blog/how-to-tailor-resume-for-free).",
  },

  { h2: "Why I keep building this" },
  {
    p: "I've shipped apps nobody used. I've shipped apps 3 people paid for. I've shipped apps that just… sat there. Still building. Still looking for the one.",
  },
  {
    p: "FitMyCV exists because tailoring is the most boring part of a job search and the part that matters most. If it saves you the hour, use it. If you'd rather do it by hand, the top third is all you need.",
  },
  {
    cta: {
      title: "Let FitMyCV tailor the top third",
      body: "Paste a job link. FitMyCV rewrites your summary and top bullets for that posting and writes the cover letter.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV from a job link",
    },
  },
];

export default { meta, faqs, blocks };
