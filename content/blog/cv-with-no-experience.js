export const meta = {
  slug: "cv-with-no-experience",
  title: "How to Write a CV With No Experience (Template and Example)",
  seoTitle: "How to Write a CV With No Experience",
  description:
    "How to write a CV with no work experience: which sections to use, how to order them, and how to turn projects and coursework into quantified bullets.",
  excerpt:
    "A first CV is not an empty CV. Reorder the page around what you actually have, prove it with numbers, and it reads like someone worth meeting.",
  date: "2026-08-20",
  updated: "2026-08-20",
  readingTime: 8,
  category: "CV Tips",
  series: "cv-foundations",
  tags: ["cv tips", "no experience", "graduates", "entry level"],
  image: "/blog/cv-with-no-experience.png",
  imageAlt:
    "Flat illustration of a first CV built from education, projects, and skills blocks slotting into place",
  keywords: [
    "cv with no experience",
    "how to write a cv with no experience",
    "first cv no experience",
    "cv for first job",
    "student cv no work experience",
  ],
};

export const faqs = [
  {
    q: "How do I write a CV if I have no work experience?",
    a: "Reorder the page around what you do have. Lead with a short summary, then education, then a projects section, then skills, then any volunteering or part-time work. Turn each item into a bullet with a specific action and a result, ideally with a number. The absence of a formal job history is normal for a first CV and is not held against you.",
  },
  {
    q: "What sections should a no experience CV have?",
    a: "A contact header, a two or three line summary, education with relevant modules or grades, a projects or coursework section, a skills section, and volunteering or part-time work. Add a certifications section if you have any. Put whichever section is strongest closest to the top.",
  },
  {
    q: "How long should a CV with no experience be?",
    a: "One page. With no work history to document, a single well-organised page is expected and preferred. Fill it with real evidence rather than padding, and use white space so it looks considered rather than sparse.",
  },
  {
    q: "Can I put school projects on my CV?",
    a: "Yes, and you should. A projects section is one of the most effective parts of a first CV. Describe what you built or researched, the tools or methods you used, and the outcome. A capstone project that used the exact skills a role needs is strong evidence of capability.",
  },
  {
    q: "How do I make a first CV pass an ATS?",
    a: "Use a single-column layout, standard section headings such as Education, Projects, and Skills, put your contact details in the body rather than the header, and mirror the posting's key words in your bullets. Save as PDF unless a Word file is requested. Clean formatting is what keeps your content readable.",
  },
];

export const blocks = [
  {
    p: "A CV with no work experience is not an empty CV. It is a CV built around different evidence. Employers hiring for entry level and graduate roles do not expect a work history. They expect signs that you can do the job and will grow, and those signs come from your education, projects, volunteering, and skills. The task is to organise the page so that evidence leads.",
  },
  {
    p: "This guide covers which sections to use, how to order them, and how to write bullets that sound like results rather than descriptions, with a before and after.",
  },
  {
    callout: {
      title: "The short version",
      body: "Reorder a first CV around your strengths: summary, education, projects, skills, then volunteering or part-time work. Turn every item into a bullet with a specific action and a measurable result. Keep it to one page, use a clean single-column layout, and mirror the posting's key words so it reads as a fit.",
    },
  },

  { h2: "Order the page around what you have" },
  {
    p: "The single most important decision is section order. On a first CV, education and projects usually outrank the thin work section, so they go near the top. Lead with whatever is strongest for the specific role.",
  },
  {
    table: {
      head: ["Section", "Why it earns its place", "Order"],
      rows: [
        ["Contact header", "Name, email, phone, city, and a LinkedIn or portfolio link", "Top"],
        ["Summary", "Two or three lines naming the target role and your best proof", "1"],
        ["Education", "Degree, key modules, grades, and relevant achievements", "2"],
        ["Projects", "Academic, personal, or freelance work with outcomes", "3"],
        ["Skills", "Tools and methods the posting names, that you can evidence", "4"],
        ["Volunteering and part-time", "Reliability, teamwork, and service under pressure", "5"],
      ],
    },
  },
  {
    p: "If your projects are stronger than your degree, put projects above education. The order is not fixed. It follows your evidence and the role.",
  },

  { h2: "Write a summary that names the role" },
  {
    p: "A first CV still benefits from a short summary at the top, and it should name the target role explicitly. Three lines: who you are, the role you are aiming at, and your single strongest piece of proof.",
  },
  {
    compare: {
      title: "Summary, before and after",
      context: "Target role: junior data analyst. Recent graduate, no full-time roles yet.",
      before:
        "Hardworking and motivated recent graduate looking for an opportunity to start my career and learn new skills in a dynamic environment.",
      after:
        "Recent statistics graduate aiming for a junior data analyst role. Built a final-year project analysing 5 years of city transport data in Python and SQL, presenting the findings to a panel of 40. Comfortable with pandas, dashboards, and turning messy data into clear recommendations.",
    },
  },

  { h2: "Turn projects into evidence" },
  {
    p: "The projects section is where a no experience CV wins or loses. Describe each project the way you would a job: the situation, what you did, the tools you used, and the result. A number makes it real.",
  },
  {
    compare: {
      title: "Project bullet, before and after",
      context: "Same university group project. The second version reads like delivered work.",
      before:
        "Did a group project where we built a website and I helped with the design and some of the coding.",
      after:
        "Built the front end of a group booking website in React, owning the layout and the checkout flow; the prototype scored highest of 9 teams in the module and was cited by the lecturer as the most usable.",
    },
  },
  {
    p: "The same approach works for volunteering and part-time jobs. A retail role becomes handled a checkout queue of 60 an hour during peak trading with a 98 percent accuracy rate on till reconciliation. Specifics turn ordinary experience into proof.",
  },

  { h2: "Make it readable by software and humans" },
  {
    p: "A clean layout matters as much on a first CV as on any other. The software that reads your CV needs a simple structure, and a recruiter scanning for six seconds needs to find the highlights fast.",
  },
  {
    steps: [
      {
        title: "Use a single column",
        body: "Multi-column layouts are the most common way to get your content scrambled by a parser. One column, left aligned, standard headings such as Education, Projects, and Skills.",
      },
      {
        title: "Keep contact details in the body",
        body: "Many systems cannot read headers and footers, so a name or email placed there can vanish. Put your details in the main body, with your name as the top line.",
      },
      {
        title: "Mirror the posting's words",
        body: "Work the exact skills and tools from the posting into your bullets where they are true. This is what makes a thin CV surface in a search.",
      },
      {
        title: "Check the parse",
        body: "Run your CV and the posting through a free ATS resume checker to confirm the content is readable and the key terms are present.",
      },
    ],
  },
  {
    p: "For the full formatting rules, see our ATS-friendly resume guide. For the sections and wording of a first professional CV, our how to write a resume guide walks through each block.",
  },

  { h2: "Tailor the first CV to each role" },
  {
    p: "With limited material, tailoring matters even more, because which project or skill you lead with should change with the role. The problem is that reordering and rewording a CV for every application is slow, and most people give up and send one generic version.",
  },
  {
    p: "FitMyCV does the reordering for you. You paste the job link, and it reads the posting and rewrites your summary, promotes the most relevant projects and skills, and mirrors the role's language, then drafts a matching cover letter. Your real education, projects, and results stay exactly as they are. What changes is which of them lead. Pair this with our cover letter with no experience guide to get both documents right.",
  },
  {
    cta: {
      title: "Tailor your first CV to the role",
      body: "Paste a job link and get your projects and skills reordered and reworded for that exact posting, plus a matching cover letter to send with it.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV from a job link",
    },
  },

  { h2: "The checklist" },
  {
    ul: [
      "Order the page around your strengths: summary, education, projects, skills, then the rest.",
      "Write a summary that names the target role and your single best proof.",
      "Turn every project, volunteer stint, and part-time job into an action plus a result.",
      "Use a single-column layout with standard headings and contact details in the body.",
      "Mirror the posting's key words, then check the parse before you send.",
    ],
  },
];

const post = { meta, faqs, blocks };
export default post;
