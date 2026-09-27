// Job duties to resume bullets landing page.
// The tool rewrites pasted duties into achievement shaped bullets and marks
// where the numbers go. It does not know the user's numbers, and the copy says
// so rather than implying an AI rewrite that never happens on this page.

export const jobDescriptionToResumeBullets = {
  slug: "job-description-to-resume-bullets",
  seoTitle: "Job Duties for Resume: Turn Duties Into Bullets",
  description:
    "Paste the duties from a job description and get resume bullets that lead with an action verb and mark where your numbers go. Free, no login.",
  keywords: [
    "job duties for resume",
    "job responsibilities for resume",
    "work description for resume",
    "resume job description",
    "resume job description examples",
    "job description to resume",
    "job duties for resume examples",
    "how to write job duties on a resume",
    "turn job duties into resume bullets",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Job duties to resume bullets",
  h1: "Turn job duties into resume bullets",
  lede:
    "Paste the duties from your job description, one per line. Get each one back as a resume bullet that opens with an action verb and shows where your number belongs.",
  ctas: [
    { label: "Rewrite my duties", href: "#tool" },
    {
      label: "Tailor my whole CV",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "duties",
  howTo: {
    name: "How to turn job duties into resume bullets",
    description:
      "Rewrite the duties from a job description as achievement bullets for your CV.",
    steps: [
      {
        name: "Paste your duties",
        text: "Copy the responsibilities from the job description for a role you held, or from your own notes. One duty per line. Bullet points and numbered lists work too.",
      },
      {
        name: "Read each rewrite",
        text: "Weak openers like 'Responsible for' and 'Assisted with' are removed. Each duty comes back in the past tense with a strong verb first.",
      },
      {
        name: "Fill in the numbers",
        text: "Every bullet has a highlighted slot where a figure belongs, and a note on what to count. Replace each slot with a real number you can defend.",
      },
    ],
  },
  faqs: [
    {
      q: "Should I copy my job description onto my resume?",
      a: "No. A job description lists what the employer asked of anyone in the role. Your CV should say what you did with it and what changed. Use the duties as a starting list, then rewrite each one as an achievement with a number.",
    },
    {
      q: "What does this tool actually do?",
      a: "It splits your pasted text into single duties, removes weak openers like 'Responsible for', puts the verb in the past tense, and adds a bracketed slot where a number belongs. It runs on fixed rules in your browser. It does not use AI and it cannot know your numbers.",
    },
    {
      q: "Does it make up numbers?",
      a: "No. It marks the place for a number and tells you what kind to look for: how many, how often, how much, or how much faster. You fill in the real figure. An invented number gets through the screen and falls apart in the interview.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "It is free, with no sign-up and no usage limit. Everything runs in your browser. Nothing you paste is uploaded or stored.",
    },
    {
      q: "What is the difference between job duties and achievements?",
      a: "A duty is what you were assigned: 'Handle customer refunds'. An achievement is what happened because you did it: 'Processed 40 refunds a week and cut the backlog from ten days to two'. Recruiters read the second kind, because every applicant for the role had the same duties.",
    },
    {
      q: "How many bullets should each job have?",
      a: "Three to five for your most recent role, two or three for older ones, and one or two for anything over ten years ago. Keep the bullets closest to the job you are applying for, and cut the rest.",
    },
    {
      q: "Should the bullets match the job I am applying for?",
      a: "Yes. Rewrite the duties first, then check which terms the new posting uses that your bullets never mention. The [missing resume keywords](/missing-resume-keywords) tool shows that gap. Tailoring from a job link does both steps across your whole CV.",
    },
  ],
  blocks: [
    { h2: "Duties are what you were given. Achievements are what you did with them." },
    {
      p: "Most CVs list duties copied from a job description, which is why so many read the same. **Everyone who held the role had the same duties.** What sets you apart is what changed because you were there, and that needs a verb, the work, and a number.",
    },
    {
      compare: {
        title: "Customer support",
        context: "The duty from the advert, and the same work written as a result.",
        before: "Responsible for handling customer refunds.",
        after:
          "Processed 40 refunds a week and cut the backlog from ten days to two.",
      },
    },
    {
      compare: {
        title: "Operations",
        context: "The duty names a task. The bullet says how big it was.",
        before: "Duties included stock control and ordering.",
        after:
          "Ran stock control for three stores and cut out of stock items by a third.",
      },
    },

    { h2: "Job duties for resume examples by role" },
    {
      p: "The left column is how a job description usually phrases the duty. The right column is the same duty as a resume bullet. **The numbers are examples.** Use your own, and leave out anything you cannot back up.",
    },
    {
      table: {
        head: ["Role", "Duty as written in the advert", "As a resume bullet"],
        rows: [
          [
            "Customer service",
            "Respond to customer enquiries by phone and email",
            "Answered 60 customer enquiries a day by phone and email and held a 95% satisfaction score",
          ],
          [
            "Retail",
            "Responsible for merchandising and stock replenishment",
            "Reset store displays weekly and cut stock gaps on the shop floor by 30%",
          ],
          [
            "Administrative assistant",
            "Manage the director's diary and arrange meetings",
            "Ran the diaries of two directors and booked 25 meetings a week without a clash",
          ],
          [
            "Nurse",
            "Monitor patients and administer medication",
            "Monitored 8 patients a shift on an acute ward and gave medication with no reported errors",
          ],
          [
            "Teacher",
            "Plan and deliver lessons in line with the curriculum",
            "Planned and taught 22 lessons a week across three year groups, lifting pass rates from 64% to 78%",
          ],
          [
            "Software engineer",
            "Develop and maintain web applications",
            "Built and maintained three internal web apps used by 400 staff, cutting page load time by half",
          ],
          [
            "Sales",
            "Build relationships with new and existing clients",
            "Built a book of 35 accounts and grew repeat revenue by 18% in a year",
          ],
          [
            "Accountant",
            "Prepare month end reports and reconciliations",
            "Prepared month end reports for four entities and closed the books two days faster",
          ],
          [
            "Marketing",
            "Assist with social media and email campaigns",
            "Ran 12 email campaigns a quarter and grew the list from 8,000 to 14,000 subscribers",
          ],
          [
            "Warehouse",
            "Pick, pack and dispatch customer orders",
            "Picked and packed 300 orders a shift at 99.8% accuracy",
          ],
        ],
      },
    },
    {
      callout: {
        title: "Use the employer's words, and your own numbers",
        body: "Keep the terms from the job description you are applying to, because recruiters search for them. Change everything else: the verb, the scale, and the result.",
      },
    },

    { h2: "The shape every bullet should take" },
    {
      steps: [
        {
          title: "A past tense action verb, first",
          body: "Built, ran, cut, trained, resolved. Not 'Responsible for', 'Duties included' or 'Helped with', which describe the job rather than you.",
        },
        {
          title: "The work, in plain words",
          body: "Specific enough that a stranger can picture it. 'The refund queue' beats 'various customer issues'.",
        },
        {
          title: "A number",
          body: "How many, how often, how much, or how much faster. One real figure does more than any adjective.",
        },
        {
          title: "What changed",
          body: "What was true after that was not true before. This is the part a job description never tells you, so only you can add it.",
        },
      ],
    },

    { h2: "Weak openers this tool removes" },
    {
      table: {
        head: ["In the job description", "What it hides", "What to write instead"],
        rows: [
          ["Responsible for", "Whether you did it or watched it", "Owned, ran, led"],
          ["Duties included", "That the line is copied from an advert", "Start with the verb"],
          ["Tasked with", "The result", "Delivered, completed, shipped"],
          ["Assisted with", "Your part in it", "Supported, trained, resolved"],
          ["Helped", "Everything", "The actual verb for what you did"],
          ["Worked on", "The outcome", "Built, rebuilt, migrated"],
          ["Involved in", "Whether you were central", "Drove, delivered, contributed"],
        ],
      },
    },

    { h2: "Finding the number" },
    {
      ol: [
        "**Count the work.** Tickets, orders, patients, lessons, invoices, shifts. Anything you did often has a rate.",
        "**Compare before and after.** Backlog, errors, wait times, close time. A change from one figure to another is the strongest bullet you can write.",
        "**Size what you touched.** Budget, team, number of sites, customers, users. Scope counts as a number.",
        "**Check old records.** Reports, dashboards, rotas and appraisals often hold the figure you forgot.",
      ],
    },
    {
      p: "When you have to estimate, round down and say 'about'. 'About 50 a week' holds up in an interview. A precise figure with nothing behind it does not.",
    },

    { h2: "From one job's duties to the next job's CV" },
    {
      p: "This page rewrites duties you paste, one list at a time. When you are applying for a specific job, the bullets also need to use that posting's words. Check the gap with [missing resume keywords](/missing-resume-keywords), polish single lines with the [resume bullet rewriter](/resume-bullet-rewriter), or do the whole CV at once with [tailoring from a job link](/tailor-cv-from-job-link).",
    },
    {
      cta: {
        title: "Tailor every bullet to the job you want",
        body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, keeping your real experience and your real numbers.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Resume bullet rewriter",
      href: "/resume-bullet-rewriter",
      body: "Rewrite one bullet three ways, with a read on what is weak.",
    },
    {
      label: "Missing resume keywords",
      href: "/missing-resume-keywords",
      body: "See which of the posting's terms your CV never mentions.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting before you apply.",
    },
  ],
};
