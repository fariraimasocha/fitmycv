export const meta = {
  slug: "how-ats-works",
  title: "How ATS Works: How Applicant Tracking Systems Filter Resumes",
  seoTitle: "How ATS Works: How Resumes Get Filtered (2026)",
  description:
    "How an ATS works, step by step: how it reads your resume, the three ways it filters you out, and how to tell which one rejected your application.",
  excerpt:
    "An ATS reads your resume, turns it into fields, and then a rule, a ranking or a recruiter's search decides if anyone looks at it. Here is how each one works, and how to tell which one said no.",
  date: "2026-11-19",
  readingTime: 9,
  category: "ATS",
  tags: ["ats", "resume", "applicant tracking system", "keywords"],
  image: "/blog/how-ats-works.jpg",
  imageAlt:
    "Flat illustration of a CV going into an applicant tracking system, coming out as separate data fields and a ranked list of candidates",
  keywords: [
    "how ats works",
    "how does ats work",
    "how do applicant tracking systems filter resumes",
    "ats resume scanner",
    "ats scanner",
    "why resume rejected by ats",
    "does ats automatically reject resumes",
    "how to beat applicant tracking system",
  ],
};

export const faqs = [
  {
    q: "How does an ATS work?",
    a: "An applicant tracking system reads your resume and turns it into structured fields: name, contact details, job titles, employers, dates, skills and education. Recruiters then filter that data in three ways. Knockout questions reject people who give the wrong answer. Ranking tools sort candidates by how well they match the job. Recruiters search the database by keyword. Your resume has to survive the read first, then show up in all three.",
  },
  {
    q: "Does an ATS automatically reject resumes?",
    a: "Mostly no, unless the employer set it up to. The most common automatic rejection comes from knockout questions in the application form, like work authorisation or location. Rejection based on the resume content itself is possible in some systems but less common. In a 2025 Enhancv survey, 23 of 25 US recruiters said their ATS does not auto reject for formatting, content or design.",
  },
  {
    q: "Is the claim that 75% of resumes are rejected by ATS true?",
    a: "There is no study behind it. The number is widely traced to a 2012 sales pitch from Preptel, a resume optimisation company that has since closed. The better evidence is the 2021 Harvard Business School and Accenture Hidden Workers report, where roughly 90% of executives said their systems screen out qualified candidates who do not match exact criteria.",
  },
  {
    q: "Why was my resume rejected by an ATS in minutes?",
    a: "A rejection that arrives within minutes or hours is almost always a knockout question. You answered something in the application form, like years of experience, a licence, or whether you need sponsorship, and a rule rejected you. The resume itself probably was never read.",
  },
  {
    q: "Can an ATS resume scanner tell me if I will pass?",
    a: "No scanner can copy what one employer sees, because every company configures its own system. A good scanner can still tell you two useful things: whether your file reads cleanly as text, and which words from the job posting are missing from your resume. Those are the two things you control.",
  },
  {
    q: "What ATS do most big companies use?",
    a: "Workday is the biggest. Jobscan's 2026 count found 97.4% of Fortune 500 companies use a detectable ATS, and over 40% of them use Workday. SAP SuccessFactors, Oracle, iCIMS and Greenhouse cover much of the rest.",
  },
];

export const blocks = [
  { h2: "The short answer" },
  {
    p: "An applicant tracking system (ATS) **reads your resume, turns it into data, and lets the employer filter that data**. Nothing magic happens in between. Three filters decide if a person ever looks at your application: a rule, a rank and a search.",
  },
  {
    p: "Almost every large employer uses one. Jobscan checked all 500 career sites in 2026 and found [97.4% of the Fortune 500](https://www.jobscan.co/blog/fortune-500-use-applicant-tracking-systems/) use a detectable ATS. Over 40% use Workday. So the question is not if your resume goes through one. It is which filter is in your way.",
  },

  { h2: "What does an ATS do with your resume?" },
  {
    steps: [
      {
        title: "It reads the file as plain text",
        body: "Your PDF or Word file gets converted to text. Design, colours and layout are dropped. Anything that is an image, like a scanned CV or a logo, has no text to read.",
      },
      {
        title: "It splits the text into fields",
        body: "The parser guesses which line is your name, which lines are job titles, which are employers and dates, and which words are skills. This is the step two column layouts and text boxes can break.",
      },
      {
        title: "It stores you as a candidate record",
        body: "That record is what recruiters see first. Many never open the original file unless something in the record makes them want to.",
      },
      {
        title: "It runs the employer's filters",
        body: "Knockout questions, ranking scores and keyword search all run on the record, not on the pretty file you designed.",
      },
    ],
  },

  { h2: "What does the parsed version of my CV look like?" },
  {
    compare: {
      title: "What you sent vs what the ATS stored",
      context: "A two column CV. The parser read across the page instead of down each column.",
      before: "SKILLS          EXPERIENCE\nPython          Data Analyst, Acme\nSQL             2022 to present\nTableau         Built the churn dashboard",
      after: "Job title: Python Data Analyst\nEmployer: Acme SQL\nDates: (not found)\nSkills: Tableau Built the churn dashboard",
    },
  },
  {
    p: "Every word is still there. But the job title is wrong, the dates are gone, and a recruiter filtering for SQL in the skills field misses you. You can check your own file in ten seconds: open it, select all, copy, and paste into a plain text note. What you see is close to what the parser gets. Our [ATS resume format guide](/blog/ats-resume-format) covers which layouts survive this and which do not.",
  },

  { h2: "How do applicant tracking systems filter resumes?" },
  {
    figure: {
      src: "/blog/how-ats-works-three-filters.jpg",
      alt: "Three cards side by side: an application form behind a barrier, a ranked list of candidates with the top one highlighted, and a magnifying glass over a CV",
      caption: "The three filters: a rule, a rank and a person searching.",
      width: 1200,
      height: 800,
    },
  },
  {
    p: "Once you are a record, the employer can filter you three ways. Most job seekers only hear about keywords. Keywords are just one of the three.",
  },
  { h3: "Filter 1: the rule (knockout questions)" },
  {
    p: "These are the yes or no questions in the application form. Do you have the right to work here? Do you have a nursing licence? Can you work from the office in Cape Town? Pick the wrong answer and a rule rejects you automatically.",
  },
  {
    p: "Greenhouse documents this plainly. Its Auto-Reject feature [uses custom application questions to screen and reject candidates based on their responses](https://support.greenhouse.io/hc/en-us/articles/203105595-Application-Rules-Overview), for things like licence or location requirements. It works on your answers, not your resume. This is the filter behind most instant rejections.",
  },
  { h3: "Filter 2: the rank (AI scoring)" },
  {
    p: "Many systems now score you against the job and sort the list. Workday is the biggest example. Its HiredScore feature [grades candidates from A to D](https://doc.workday.com/hiredscore/en-us/workday-hiredscore/recruiter-productivity-/concept--hiredscore-grades.html). Meeting all the basic qualifications in the job post gets you an A or B. Missing some puts you at C or D. Preferred qualifications decide between A and B.",
  },
  {
    p: "Two details matter here. First, the grade is built from your parsed resume, so a qualification that got scrambled in the read does not count. Second, Workday's docs say HiredScore gives no grade at all when there is no resume. A grade is not a rejection. It decides where you sit in a list a recruiter scrolls, and people rarely scroll far.",
  },
  {
    callout: {
      title: "What this means for you",
      body: "The ranking checks each basic qualification in the job post against your resume. If the post says \"3 years of SQL\" and your resume says \"database work since 2022\", a human sees the match. A model checking that line might not. Use the posting's own words for every requirement you meet.",
    },
  },
  { h3: "Filter 3: the person (recruiter search)" },
  {
    figure: {
      src: "/blog/how-ats-works-recruiter-search.jpg",
      alt: "A search bar with two keyword chips above five CVs, with only the two matching CVs highlighted",
      caption: "Recruiters search the database. Only resumes with the exact words show up.",
      width: 1200,
      height: 800,
    },
  },
  {
    p: "Recruiters also search the database the way you search Google. They type a job title and a few skills, and the ATS returns the records that contain those words. If they search for \"stakeholder management\" and you wrote \"worked with clients\", you do not show up. Nobody rejected you. You were just never found.",
  },
  {
    p: "Search is literal. Write acronyms both ways (\"SEO\" and \"search engine optimisation\"). Use the job title the market uses, not your company's internal one. Our guide to [finding resume keyword gaps](/blog/how-to-find-resume-keyword-gaps) shows how to pull the right words from a posting.",
  },

  { h2: "Does an ATS automatically reject resumes?" },
  {
    p: "Less often than the internet says. You have probably read that 75% of resumes are rejected by ATS before a human sees them. There is no study behind that number. It is [widely traced to a 2012 sales pitch](https://www.f1jobs.io/resources/blog/ats-resume-service-75-percent-rejection-myth) by Preptel, a resume optimisation company that has since closed.",
  },
  {
    p: "What the evidence does show:",
  },
  {
    ul: [
      "**Rigid criteria do filter people out.** In the 2021 [Hidden Workers report](https://www.accenture.com/content/dam/accenture/final/a-com-migration/r3-3/pdf/pdf-169/accenture-hidden-worker-report.pdf) by Harvard Business School and Accenture, more than 90% of employers said they use these systems to filter or rank candidates. Roughly 90% of executives said qualified people get screened out because they do not match exact job criteria.",
      "**Gaps can be a filter.** The same report found most systems can exclude candidates for things like gaps in full-time work, whatever their other qualifications.",
      "**Formatting rarely triggers rejection by itself.** In a [2025 survey of 25 US recruiters](https://enhancv.com/blog/does-ats-reject-resumes/) by Enhancv, a resume builder, 23 said their ATS does not auto reject for formatting, content or design. Small sample, vendor research, but it matches what recruiters say publicly.",
    ],
  },
  {
    p: "So the honest picture: rules reject you automatically, rankings bury you, and searches miss you. The resume's job is to stay out of the second and third.",
  },

  { h2: "Why was my resume rejected by ATS?" },
  {
    p: "The timing of the reply tells you which filter it was.",
  },
  {
    table: {
      head: ["What happened", "Most likely filter", "What to fix"],
      rows: [
        ["Rejected within minutes or hours", "A knockout question", "Reread the form. Check the work authorisation, location, licence and years of experience answers."],
        ["Rejected after a few days or weeks", "A person, often after a rank", "Your resume was seen. Make the match obvious in the top third of page one."],
        ["Total silence", "A low rank, or no search found you", "Use the posting's exact words for skills and titles. Apply early."],
        ["Rejected for a job you clearly fit", "Missing words, or a scrambled parse", "Run the copy and paste test, then compare your resume to the posting."],
      ],
    },
  },
  {
    p: "If silence is the pattern across many applications, the problem is usually that one generic resume went to every job. Our post on [why you are not getting interviews](/blog/why-am-i-not-getting-interviews) goes through that in more detail.",
  },

  { h2: "Can an ATS resume scanner tell you if you will pass?" },
  {
    p: "Not exactly. No scanner sees what one employer set up: their knockout questions, their ranking settings, or what the recruiter will type into search. Any tool that promises a pass rate is guessing.",
  },
  {
    p: "A scanner is still worth running for the two things you control. One, does your file read cleanly as text? Two, which words from this posting are missing from your resume? That is what our free [ATS resume checker](/ats-resume-checker) does. It reads your file the way a parser would and compares it to the job you paste. The score is a guide to what to fix. Our post on [what a resume match score means](/blog/what-is-a-resume-match-score) explains how to read it.",
  },

  { h2: "How do I find out which ATS a company uses?" },
  {
    p: "Click apply and look at the web address. Workday postings sit on myworkdayjobs.com, Greenhouse on greenhouse.io, Lever on lever.co. Our [ATS lookup](/ats) lists which system dozens of big employers use. Knowing it tells you what to expect: Workday may grade you, Greenhouse may run knockout rules, and almost all of them let recruiters search.",
  },

  { h2: "What should you do about it?" },
  {
    ol: [
      "**Answer the form honestly and carefully.** It is the only filter that rejects you automatically, so read every question twice.",
      "**Use one column and a text PDF.** Then run the copy and paste test. If it reads in the right order, your format is fine.",
      "**Put contact details in the body**, never in a header, footer or text box.",
      "**Mirror the posting's words** for every requirement you actually meet. Same skill names, same job title wording, acronyms both ways.",
      "**Put the best match near the top.** Rankings and recruiters both weight what they see first.",
      "**Tailor for each job.** A ranking is built per job. One resume cannot use the exact words of ten different postings.",
    ],
  },
  {
    p: "That last step is the one nobody wants to do, and it is the reason I built FitMyCV. For the full checklist on writing a resume that reads well, see the [ATS friendly resume guide](/blog/ats-resume-guide).",
  },
  {
    cta: {
      title: "Match your resume to the job in one step",
      body: "Paste the job link. FitMyCV rewrites your CV with the posting's own words, in a single column PDF that reads cleanly.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
