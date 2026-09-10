// Resume bullet rewriter landing page.
// The tool restructures a bullet and marks where the numbers go. It does not
// know the user's numbers, and the copy says so rather than implying an AI
// rewrite that never happens on this page.

export const resumeBulletRewriter = {
  slug: "resume-bullet-rewriter",
  seoTitle: "Resume Bullet Point Rewriter: Free, No Sign-Up",
  description:
    "Paste a resume bullet and get three stronger rewrites with the metric slots marked. Turn job duties into achievement bullets. Free, no login, nothing uploaded.",
  keywords: [
    "resume bullet point rewriter",
    "resume bullet point rewrite",
    "resume bullet point generator",
    "resume bullet generator",
    "resume bullet points generator",
    "resume achievement generator",
    "resume achievement bullet generator",
    "turn job duties into resume bullets",
    "rewrite resume bullet points",
    "improve resume bullet points",
    "resume action verb generator",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Resume bullet rewriter",
  h1: "Rewrite a resume bullet point",
  lede:
    "Paste one bullet. Get three stronger rewrites, a plain read on what is weak, and the exact spot where your number belongs. Add the target job description and the tool shows which of the posting's terms this bullet could carry.",
  ctas: [
    { label: "Rewrite my bullet", href: "#tool" },
    {
      label: "Rewrite my whole CV",
      href: "/tailor-cv-from-job-link",
      variant: "secondary",
    },
  ],
  tool: "bullet",
  howTo: {
    name: "How to rewrite a resume bullet point",
    description:
      "Turn a duty into an achievement bullet with a strong verb and a number.",
    steps: [
      {
        name: "Paste one bullet",
        text: "Copy a single line from your CV, the weakest one you can find. Bullets that start with 'Managed', 'Responsible for' or 'Assisted with' are the best candidates.",
      },
      {
        name: "Add the job description, optionally",
        text: "Paste the posting you are targeting. The tool then lists the terms that posting leans on which this bullet never mentions, so you can fold in the ones you can honestly evidence.",
      },
      {
        name: "Pick a rewrite and fill the slots",
        text: "Each rewrite has bracketed slots where a number belongs. Replace them with your real figures. A slot you cannot fill is a sign the bullet needs a different angle.",
      },
    ],
  },
  faqs: [
    {
      q: "What does this bullet rewriter actually do?",
      a: "It swaps a duty opener for a strong action verb, restructures the sentence around a result, and marks the place where a number belongs. It also flags what is wrong with the original: a passive opener, no figure anywhere, pronouns, vague words like 'various', or a sentence that has run past twenty five words.",
    },
    {
      q: "Does it invent the numbers for me?",
      a: "No, and that is deliberate. The tool has never seen your work, so any figure it produced would be fiction. It gives you the sentence with a bracketed slot and you fill in the real number. A bullet with an invented metric survives the screen and fails the interview.",
    },
    {
      q: "Is it free, and do I need an account?",
      a: "It is free and there is no sign-up. The whole rewrite runs in your browser using JavaScript on the page. Nothing is uploaded, nothing is stored, and there is no usage limit.",
    },
    {
      q: "How do I turn a job duty into an achievement bullet?",
      a: "Start with an action verb, name what you did, then attach the outcome. 'Responsible for the support queue' is a duty. 'Resolved 80 support tickets a week and held first response under two hours' is an achievement. The work is identical. The second version tells a hiring manager what happened.",
    },
    {
      q: "What if I genuinely have no numbers for a bullet?",
      a: "You usually have more than you think: how many, how often, how many people, how long it took before and after, how much money moved through it. When none of those exist, use scope instead. Naming the systems, the team size, or the stakeholders you worked with beats a bare duty.",
    },
    {
      q: "How many bullets should each role have?",
      a: "Three to five for your most recent role, two to three for older ones, and one or two for anything more than ten years back. Every bullet you keep should earn its line. Cut the ones that only restate the job title.",
    },
    {
      q: "Will stronger bullets improve my ATS score?",
      a: "Indirectly. Applicant tracking systems match vocabulary, so folding the posting's real terms into a bullet does help you surface in a recruiter search. The rewrite itself is for the human who reads you afterwards. Check the vocabulary side with the [ATS resume checker](/ats-resume-checker).",
    },
  ],
  blocks: [
    { h2: "Duties describe the job. Achievements describe you." },
    {
      p: "Most CV bullets are copied from a job description, which is why so many read the same. **A duty says what you were assigned. An achievement says what changed because you were there.** Every rewrite on this page pushes a line from the first shape into the second.",
    },
    {
      compare: {
        title: "Support",
        context: "Same job. The second version tells a hiring manager the size of it.",
        before: "Managed customer support tickets.",
        after:
          "Resolved 80+ support tickets a week and held first response under two hours.",
      },
    },
    {
      compare: {
        title: "Engineering",
        context: "The duty hides the scale. The achievement names it.",
        before: "Responsible for maintaining the payments service.",
        after:
          "Owned the payments service through 4x traffic growth, cutting failed charges from 3% to 0.4%.",
      },
    },
    {
      compare: {
        title: "Marketing",
        context: "Helped with is doing no work in that sentence.",
        before: "Helped with social media and email campaigns.",
        after:
          "Ran 12 lifecycle email campaigns a quarter, lifting click-through from 1.8% to 3.1%.",
      },
    },

    { h2: "The four parts of a bullet that works" },
    {
      steps: [
        {
          title: "An action verb, first word",
          body: "Not 'Responsible for', not 'Tasked with', not 'Helped'. Lead with the thing you did: built, cut, negotiated, migrated, recovered, trained.",
        },
        {
          title: "The thing you acted on",
          body: "Specific enough that a stranger can picture it. 'The billing pipeline' beats 'various systems'.",
        },
        {
          title: "A number",
          body: "How many, how often, how much, how much faster. One real figure does more for a bullet than three more adjectives.",
        },
        {
          title: "The outcome",
          body: "What was true afterwards that was not true before. This is the half most people leave off, and it is the half that gets read.",
        },
      ],
    },

    { h2: "Weak openers and what to use instead" },
    {
      p: "The tool detects these openers and offers replacements from the matching verb family. The point is not a thesaurus swap. A stronger verb forces you to say what actually happened.",
    },
    {
      table: {
        head: ["Weak opener", "What it hides", "Try instead"],
        rows: [
          [
            "Responsible for",
            "Whether you did it or watched it",
            "Owned, ran, led, directed",
          ],
          [
            "Managed",
            "The size of the thing you managed",
            "Scaled, streamlined, oversaw, coordinated",
          ],
          [
            "Helped with",
            "Your actual contribution",
            "Built, delivered, supported, contributed",
          ],
          [
            "Assisted",
            "Everything",
            "Supported, enabled, trained, advised",
          ],
          [
            "Worked on",
            "The outcome",
            "Developed, shipped, rebuilt, migrated",
          ],
          [
            "Involved in",
            "Whether you were central or incidental",
            "Drove, contributed to, delivered",
          ],
          [
            "Duties included",
            "That this is a copied job description",
            "Cut the phrase and start with the verb",
          ],
        ],
      },
    },
    {
      callout: {
        title: "One verb per bullet, and no repeats",
        body: "If four bullets in the same role open with 'Led', a reader stops seeing the word. Spread the verb families across the section: one build, one improve, one lead, one save.",
      },
    },

    { h2: "Finding the number when you think you have none" },
    {
      ol: [
        "**Count the work.** Tickets, releases, clients, articles, invoices, shifts, reports. Anything you did repeatedly has a rate.",
        "**Measure the before and after.** Load time, error rate, close time, churn, headcount, turnaround. A change from one figure to another is the strongest shape a bullet has.",
        "**Size the thing you touched.** Budget, revenue, user base, team, region, fleet. Scope is a number even when performance is not.",
        "**Time it.** Hours saved a week, days cut from a cycle, a deadline pulled forward. Time is the metric non-technical readers feel fastest.",
        "**Check the paper trail.** Old dashboards, invoices, sprint boards, performance reviews. The figure usually exists, you just never wrote it down.",
      ],
    },
    {
      p: "Estimate honestly when you must, and round conservatively. 'Roughly 50 a week' is defensible in an interview. '87.4% improvement' with nothing behind it is not.",
    },

    { h2: "Tailoring a bullet to a specific posting" },
    {
      p: "Paste the job description into the second box and the tool lists the terms that posting leans on which your bullet never mentions. These are suggestions, not instructions. Fold in the ones you genuinely did, in the posting's own words, and leave the rest alone.",
    },
    {
      p: "The reason to use the posting's wording is narrow and practical: recruiters search their applicant tracking system for the terms in their own advert. If you wrote 'kept people informed' and they search 'stakeholder management', you do not appear. To see the full gap across your whole CV rather than one line, use [missing resume keywords](/missing-resume-keywords).",
    },

    { h2: "What this page does, and what it does not" },
    {
      table: {
        head: ["", "This rewriter", "Tailoring from a job link"],
        rows: [
          ["Restructures one bullet", "Yes", "Yes"],
          ["Marks where the number goes", "Yes", "Yes"],
          ["Knows your real numbers", "No", "Reads them from your CV"],
          ["Rewrites the whole CV", "No", "Yes"],
          ["Writes a matching cover letter", "No", "Yes"],
          ["Needs an account", "No", "Yes"],
          ["Free limit", "Unlimited", "Paid generations"],
        ],
      },
    },
    {
      p: "This page is a workbench for one line at a time. It is genuinely useful when you have three bad bullets and twenty minutes. When you have a specific posting and a whole CV to move, the rewrite you want is [tailoring from a job link](/tailor-cv-from-job-link), which reads your real experience and keeps your real numbers.",
    },
    {
      cta: {
        title: "Rewrite every bullet at once",
        body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, keeping the numbers you already have.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Missing resume keywords",
      href: "/missing-resume-keywords",
      body: "See which terms the posting leans on that your CV never mentions.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting before you start rewriting bullets.",
    },
    {
      label: "The complete ATS resume guide",
      href: "/blog/ats-resume-guide",
      body: "How applicant tracking systems read a CV, and what that means for formatting.",
    },
  ],
};
