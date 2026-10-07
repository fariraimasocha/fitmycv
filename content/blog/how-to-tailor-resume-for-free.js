export const meta = {
  slug: "how-to-tailor-resume-for-free",
  title: "How to Tailor Your Resume for Free",
  seoTitle: "How to Tailor Your Resume to a Job Description for Free",
  description:
    "A zero cost way to tailor your resume for every application: find the keywords with free tools, rewrite with ChatGPT's free tier, then check the result.",
  excerpt:
    "You do not need to pay to tailor a resume. You need a posting, a free keyword check, one careful prompt, and a second check. Here is the full workflow.",
  date: "2026-10-07",
  updated: "2026-10-07",
  readingTime: 8,
  category: "Tailoring",
  tags: ["tailoring", "free tools", "chatgpt", "keywords"],
  image: "/blog/chatgpt-prompts-to-tailor-resume.jpg",
  imageAlt:
    "Flat illustration of a resume being compared with a job posting next to a chat window",
  keywords: [
    "tailor resume for free",
    "free resume tailoring",
    "tailor resume to job description free",
    "free ai resume tailor",
    "how to tailor resume for free",
  ],
};

export const faqs = [
  {
    q: "Can I tailor my resume for free?",
    a: "Yes. Copy the job posting, find its key terms with a free keyword checker, rewrite your summary and top bullets with ChatGPT's free tier using a strict prompt, and check the result again with a free match checker. It costs nothing but about 20 minutes per job.",
  },
  {
    q: "What is the best free AI resume tailor?",
    a: "ChatGPT's free tier does the rewriting well if you give it a constrained prompt that compares first and forbids invented facts. Pair it with a free checker that shows which required terms are missing before and after, so you can see whether the edit worked.",
  },
  {
    q: "Are FitMyCV's free tools really free?",
    a: "Yes. The checkers run in your browser with no sign-in, and your CV is not uploaded or stored. The paid product is the job-link tailor that writes the full tailored CV and cover letter.",
  },
  {
    q: "Will ChatGPT make things up on my resume?",
    a: "It can, if you ask it to rewrite your whole resume for a job in one go. Ask it to compare first, list what is missing, and mark gaps as do not add. Then ask for edits to a few lines only. Read every line it gives you before you use it.",
  },
  {
    q: "When is it worth paying for a resume tailoring tool?",
    a: "When you apply to many jobs a week and the copying, pasting and layout work becomes the bottleneck. Also when you want a clean ATS-safe PDF and a cover letter from the same posting without a second session. If you apply to a few jobs a month, the free workflow is enough.",
  },
  {
    q: "How much of my resume should I change for each job?",
    a: "The top third. Rewrite the summary, reorder the skills list, and adjust the bullets in your most recent one or two roles. Employers, titles and dates never change.",
  },
];

export const blocks = [
  {
    p: "**Yes, you can tailor your resume for every application without paying anything.** You need the job posting, a free keyword check, one careful ChatGPT prompt, and a second check at the end. It takes about 20 minutes per job. This page walks through it and then says plainly where a paid tool saves you time.",
  },
  {
    p: "This is the cheap guide people keep asking for on Reddit. No trials that turn into a charge, no sign-ups to read your own results.",
  },

  { h2: "What you need" },
  {
    ul: [
      "**Your resume as plain text.** Copy it out of your document. Remove your phone number and address before pasting it anywhere.",
      "**The full job posting.** Copy all of it, including the requirements and the nice to haves.",
      "**FitMyCV's free tools.** They run in your browser, need no sign-in, and your CV is not uploaded or stored.",
      "**A free ChatGPT account.** Any capable chat model works. The prompt matters more than the model.",
    ],
  },

  { h2: "The free tailoring workflow" },
  {
    steps: [
      {
        title: "Copy the posting",
        body: "Paste the whole job description into a note. Highlight anything under required, must have, or that appears more than once. Those lines decide the shortlist.",
      },
      {
        title: "Find the keywords",
        body: "Paste the posting into the [free ATS keyword checker](/free-ats-keyword-checker) to pull out the skills and terms it uses. Then run your resume against it with the [missing resume keywords](/missing-resume-keywords) tool to see which ones you do not mention.",
      },
      {
        title: "Sort the gaps",
        body: "For each missing term, decide one thing: do you have this experience under a different name, or do you not have it? Only the first kind gets added. The second kind stays off the resume.",
      },
      {
        title: "Rewrite with a constrained prompt",
        body: "Use the prompt below. It compares first, edits only the top of the resume, and refuses to invent. Do not ask ChatGPT to rewrite the whole resume in one go.",
      },
      {
        title: "Clean up the wording",
        body: "Run the new version through the [resume weak words checker](/resume-weak-words-checker). It flags cliches and weak verbs that ChatGPT tends to add.",
      },
      {
        title: "Check it again",
        body: "Paste the tailored resume and the posting into the [resume job match checker](/resume-job-match-checker). Compare the score and the missing terms with where you started.",
      },
    ],
  },

  { h2: "The prompt" },
  {
    p: "This is a single prompt you can paste into ChatGPT's free tier. It forces the model to compare before it edits, and to leave out anything you cannot back up.",
  },
  {
    callout: {
      title: "Copy-paste: compare, then edit",
      body: "You are a careful resume editor. Do two things in order.\n\nFirst, compare my resume to the job description. Make a table with three columns: requirement from the job, matching evidence from my resume, and status (covered, covered under a different name, or not on my resume). Mark every requirement that is not on my resume as DO NOT ADD.\n\nSecond, using only covered requirements, rewrite my professional summary in two or three lines, reorder my skills list so the most relevant skills come first, and rewrite the three bullets from my most recent role that best match the job. Use the job's wording only where it accurately describes what I did. Keep every number exactly as it is. Do not add any tool, skill, employer, title, date, metric or responsibility that is not already in my resume. Show each bullet as before and after.\n\nJob description:\n[PASTE JOB DESCRIPTION]\n\nResume:\n[PASTE RESUME WITHOUT CONTACT DETAILS]",
    },
  },
  {
    p: "Read the DO NOT ADD rows before anything else. If most rows are DO NOT ADD, the role is a stretch and your time may be better spent on a closer match. If you want more prompts, including a sceptic pass that catches inflated claims, see [ChatGPT prompts to tailor a resume](/blog/chatgpt-prompts-to-tailor-resume).",
  },

  { h2: "What a good edit looks like" },
  {
    p: "Here is one invented example. The posting is for a marketing coordinator and it repeats campaign reporting and email marketing.",
  },
  {
    compare: {
      title: "A bullet after the free workflow",
      context: "The original already described the work. The edit moves the posting's terms to the front and keeps the number unchanged.",
      before:
        "Helped the team with newsletters and put together monthly numbers for the manager.",
      after:
        "Ran the monthly email newsletter to 8,000 subscribers and built campaign reports for the marketing manager.",
    },
  },
  {
    p: "The 8,000 figure must already be true and on your original resume, or at least something you can prove. If ChatGPT adds a number you did not give it, delete it. The [resume bullet rewriter](/resume-bullet-rewriter) is another free way to get a stronger draft of a single bullet, and the [professional summary generator](/professional-summary-generator) does the same for your summary.",
  },
  {
    cta: {
      title: "See your starting score first",
      body: "Paste your resume and the job description. See which required terms are covered and which are missing. Free, no sign-in, nothing uploaded.",
      href: "/resume-job-match-checker",
      label: "Check my resume",
    },
  },

  { h2: "How much to change" },
  {
    p: "Change the top third and stop. That means the summary, the order of your skills, and the bullets in your most recent one or two roles. Employers, titles and dates stay as they are. The reasoning is in [how much should you tailor your resume](/blog/how-much-should-you-tailor-your-resume).",
  },
  {
    p: "It helps a lot to start from a master resume: one long private document with every role, bullet and metric you have. Then tailoring is mostly deleting, which is faster than writing. The method is in [how to tailor a CV from a master resume](/blog/tailor-cv-from-master-resume).",
  },

  { h2: "Where the free workflow falls short" },
  {
    p: "The free route works. It is what we would tell a friend applying to a few jobs a month. But it has real costs, and they grow with volume.",
  },
  {
    table: {
      head: ["Problem", "Free workflow", "Paid tool"],
      rows: [
        ["Time per job", "About 20 minutes of copying, pasting and checking", "Paste a job link, then edit the draft"],
        ["Layout", "You paste text back into your document and fix the format", "Download a PDF"],
        ["Cover letter", "A second prompt and a second round of checks", "Written from the same posting in the same pass"],
        ["Invented facts", "You must catch them yourself", "Built from your uploaded CV only"],
        ["Cost", "Nothing", "A monthly or lifetime plan"],
      ],
    },
  },
  {
    p: "**Volume is the main reason to pay.** If you apply to ten jobs a week, the free workflow is several hours of copy and paste. Most people stop tailoring after a few applications because of that, not because the method is wrong.",
  },
  {
    p: "**A clean file is the second reason.** ChatGPT gives you text. You still have to put it into a single-column layout that applicant tracking systems can read, and keep that layout tidy each time.",
  },
  {
    p: "**The cover letter is the third.** With the free route, you write it separately. With FitMyCV, you upload your CV once, paste a job link or the job description, and get a tailored CV and a cover letter, both downloadable as PDFs.",
  },

  { h2: "What FitMyCV costs" },
  {
    p: "Free accounts can tailor and see a preview: the full summary, the first line of each role, and the first paragraph of the cover letter. The full documents need a paid plan. That is $9.99 a month or $29.99 lifetime. In South Africa, Zimbabwe, Kenya, Nigeria and Uganda it is $6.99 a month or $16.99 lifetime.",
  },
  {
    p: "If you apply rarely, keep using the free workflow. If you apply often, try the [job-link tailor](/tailor-cv-from-job-link) on one real posting and compare it with what you would have done by hand. For a longer side by side, read [FitMyCV vs ChatGPT for resume tailoring](/blog/fitmycv-vs-chatgpt-resume-tailoring). If you are not sure tailoring is worth the effort at all, start with [does tailoring your resume actually work](/blog/does-tailoring-your-resume-actually-work). For the manual method without any AI, see the [step by step tailoring guide](/blog/how-to-tailor-cv-to-job-description).",
  },

  { h2: "A quick checklist before you send" },
  {
    ul: [
      "Every required term you genuinely have appears somewhere on the resume.",
      "No tool, title or number appears that was not on your original.",
      "The summary names the role you are applying for.",
      "The most relevant bullet leads in your most recent role.",
      "The [ATS resume checker](/ats-resume-checker) shows no required terms missing that you could have honestly included.",
      "You could talk about every line for two minutes in an interview.",
    ],
  },
  {
    cta: {
      title: "Check your resume against the job, free",
      body: "Paste your resume and the posting. See your match score and the missing terms. Runs in your browser, no sign-in, nothing stored.",
      href: "/resume-job-match-checker",
      label: "Check my match",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
