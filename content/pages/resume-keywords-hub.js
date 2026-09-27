// /resume-keywords: one page that lists every role keyword page, grouped by
// field. Built from RESUME_KEYWORD_PAGES so a new role shows up here without
// a second edit. A role missing from GROUPS lands in "More roles".
import { RESUME_KEYWORD_PAGES } from "@/content/resume-keywords";

const GROUPS = [
  {
    title: "Tech and data",
    slugs: ["software-engineer", "data-analyst", "data-scientist", "ux-designer"],
  },
  {
    title: "Product, projects and analysis",
    slugs: ["product-manager", "project-manager", "business-analyst"],
  },
  {
    title: "Finance",
    slugs: ["financial-analyst", "accountant"],
  },
  {
    title: "Sales, marketing and customers",
    slugs: ["marketing-manager", "sales-manager", "customer-service"],
  },
  {
    title: "People and operations",
    slugs: ["hr-manager", "administrative-assistant"],
  },
  {
    title: "Healthcare and education",
    slugs: ["nurse", "teacher"],
  },
];

const bySlug = Object.fromEntries(
  RESUME_KEYWORD_PAGES.map((page) => [page.slug.replace(/-resume-keywords$/, ""), page]),
);

const grouped = new Set(GROUPS.flatMap((g) => g.slugs));
const leftovers = Object.keys(bySlug).filter((slug) => !grouped.has(slug));
const groups = leftovers.length
  ? [...GROUPS, { title: "More roles", slugs: leftovers }]
  : GROUPS;

const row = (slug) => {
  const page = bySlug[slug];
  return [`[${page.breadcrumbName}](/${page.slug})`, page.description];
};

export const resumeKeywordsHub = {
  slug: "resume-keywords",
  seoTitle: "Resume Keywords by Job: 16 Role Lists",
  description:
    "Resume keywords for 16 jobs, grouped by where they belong on your CV, with worked examples. Pick your role, then check your CV free.",
  keywords: [
    "resume keywords",
    "resume keywords list",
    "keywords for resume",
    "ats keywords for resume",
    "cv keywords",
    "resume keywords by job",
  ],
  eyebrow: "Keyword lists",
  breadcrumbName: "Resume keywords",
  h1: "Resume keywords by job",
  lede:
    "Pick your role to see the terms its postings repeat, grouped by where each one belongs on your CV. Then check your CV against the real posting, because that is the list that decides your application.",
  ctas: [
    { label: "Check my CV", href: "/missing-resume-keywords" },
    { label: "Tailor my CV", href: "/tailor-cv-from-job-link", variant: "secondary" },
  ],
  howTo: {
    name: "How to use resume keywords",
    description: "Use a role keyword list and the real job posting to cover the terms a recruiter searches for.",
    steps: [
      {
        name: "Open the list for your role",
        text: "Mark every term you have genuinely used in work, study or projects. Ignore the rest.",
      },
      {
        name: "Put each term inside a bullet",
        text: "A term in a skills list is a claim. The same term in a bullet with a result is evidence.",
      },
      {
        name: "Check against the posting",
        text: "Paste the job description and your CV into the missing keywords checker to see which of its terms your CV never mentions.",
      },
    ],
  },
  faqs: [
    {
      q: "What are resume keywords?",
      a: "They are the skills, tools, qualifications and job titles a posting names, which recruiters later search for in their applicant tracking system. If a term the posting repeats is not on your CV, a search for it will not find you, even when you have the experience.",
    },
    {
      q: "Where do I find the right keywords for my resume?",
      a: "In the job posting itself: the title, the requirements and the responsibilities. A role list like the ones on this page shows what postings for that job tend to ask for. The posting in front of you shows what this employer asks for, so check against it every time.",
    },
    {
      q: "Can I just add keywords to a list at the bottom of my CV?",
      a: "It is better than leaving them out, but it will not survive a human reader. Recruiters and hiring managers look for the term inside a bullet that shows you used it. Put each important term where you can back it up.",
    },
    {
      q: "Do ATS keywords need to match exactly?",
      a: "Often, yes. Many searches look for the literal string, so 'Kubernetes' may not match 'k8s' and 'CI/CD' may not match 'continuous integration'. Write the posting's form, and add the other form once in brackets when both are common.",
    },
  ],
  blocks: [
    { h2: "Pick your role" },
    {
      p: "Each list groups the terms by the job they do on your CV: qualifications, core skills, tools, how you work, and verbs that carry evidence. Each also shows before and after bullets and a sample job advert.",
    },
    ...groups.flatMap((group) => [
      { h3: group.title },
      {
        table: {
          head: ["Role", "What the list covers"],
          rows: group.slugs.filter((slug) => bySlug[slug]).map(row),
        },
      },
    ]),

    { h2: "A list is a starting point" },
    {
      p: "Postings for the same job title use different words. One asks for 'stakeholder management', another for 'client relationships'. The role lists show the common vocabulary. The posting you are answering today shows the exact words, and those are the ones to match.",
    },
    {
      p: "For the skills side of the page, see [skills to put on a resume](/blog/skills-to-put-on-a-resume).",
    },
    {
      cta: {
        title: "See which keywords your CV is missing",
        body: "Paste the job description and upload your CV. The checker lists the posting's terms your CV never mentions. Free, and your file is read in your browser.",
        href: "/missing-resume-keywords",
        label: "Check my CV",
      },
    },
  ],
  related: [
    {
      label: "Missing resume keywords",
      href: "/missing-resume-keywords",
      body: "Paste a posting and your CV. See exactly which terms you never mention.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a specific posting before you apply.",
    },
    {
      label: "Resume examples",
      href: "/resume-examples",
      body: "Worked examples by role, with rewritten bullets and a skills block.",
    },
  ],
};
