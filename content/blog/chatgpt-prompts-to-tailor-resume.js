export const meta = {
  slug: "chatgpt-prompts-to-tailor-resume",
  title: "How to Tailor a Resume to a Job Description Using ChatGPT",
  seoTitle: "ChatGPT Prompts to Tailor a Resume to a Job Description",
  description:
    "Copy-paste ChatGPT and Claude prompts to tailor your resume to a job description without inventing experience. Gap analysis first, then summary, then bullets.",
  excerpt:
    "The prompt that works is not “rewrite my resume”. It is a two-pass: compare first, then edit only what you can evidence. Here are the prompts, and when a job-link tool is faster.",
  date: "2026-08-28",
  updated: "2026-08-28",
  readingTime: 9,
  category: "Tailoring",
  tags: ["tailoring", "chatgpt", "prompts", "resume", "job description"],
  image: "/blog/chatgpt-prompts-to-tailor-resume.png",
  imageAlt:
    "Flat illustration of a chat panel interlocking with a CV document, representing ChatGPT prompts used to tailor a resume",
  keywords: [
    "how to tailor resume to job description using chatgpt",
    "how to tailor resume to job description using claude",
    "tailor resume to job description prompt",
    "chatgpt prompts to tailor resume",
    "tailor resume to job description using ai",
    "best prompt to tailor resume to job description",
  ],
};

export const faqs = [
  {
    q: "How do I tailor my resume to a job description using ChatGPT?",
    a: "Do it in two passes. First, paste the job description and your resume and ask for a comparison table of requirements versus evidence, with a hard rule not to invent skills or metrics. Second, rewrite only the summary, skills order, and the top three bullets of your most relevant role. Work section by section. A one-shot “rewrite my whole resume” is how fabricated tools and numbers sneak in.",
  },
  {
    q: "What is the best ChatGPT prompt to tailor a resume to a job description?",
    a: "The best prompt is a constrained gap analysis, not a rewrite. Tell the model to use only facts already on your resume, mark unsupported requirements as do-not-add, and return a table: job requirement, matching evidence, weak evidence, safe edit. Then run a second prompt on one section at a time.",
  },
  {
    q: "Can I use Claude instead of ChatGPT to tailor a resume?",
    a: "Yes. The same two-pass method works in Claude. Paste the job description and the relevant resume section into each message rather than relying on earlier chat memory. Claude is often careful with constraints if you repeat “do not invent metrics, tools, titles, or employers”.",
  },
  {
    q: "Is it safe to paste my whole resume into ChatGPT?",
    a: "Paste the work history and skills you need compared, and omit personal contact details. You do not need your address or phone number in the prompt. For rewrites, send one section at a time so the model does not silently drop bullets from a long document.",
  },
  {
    q: "Should I tailor a resume with ChatGPT or a dedicated tool?",
    a: "ChatGPT is fine for one role if you constrain it and check every line. It is slow and error-prone at ten applications a week, because you still have to copy the posting, paste sections, and lay out a PDF. A job-link tailor reads the URL, works from a structured CV, and exports a parse-safe file. Use ChatGPT when you want control of one application; use the tool when volume is the bottleneck.",
  },
];

export const blocks = [
  {
    p: "Most ChatGPT resume advice fails for the same reason: the prompt is too vague. “Improve my resume for this job” produces generic corporate filler and, worse, tools and metrics you never used. A good tailoring prompt does three things. It gives the model the job description, it constrains the output so it cannot invent facts, and it asks for a comparison before any rewrite.",
  },
  {
    p: "This is the two-pass method, with copy-paste prompts for ChatGPT and Claude, plus the one case where pasting a job link is simply faster.",
  },
  {
    callout: {
      title: "The rule that keeps it honest",
      body: "Never ask for a full rewrite in one shot. Compare first. Then edit the summary, the skills order, and three bullets. If a requirement is not on your resume, mark it as do-not-add. Claiming a tool in the prompt is how you get caught in the interview.",
    },
  },

  { h2: "How to tailor a resume to a job description using ChatGPT" },
  {
    p: "Work in this order. Skipping the comparison is how the model inflates your experience.",
  },
  {
    ol: [
      "**Strip contact details** from the paste. ChatGPT does not need your phone number.",
      "**Paste the full job description**, including requirements hidden behind “see more”.",
      "**Run the gap-analysis prompt** below. Do not rewrite anything yet.",
      "**Rewrite one section at a time**: summary, then skills order, then the top bullets of the most relevant role.",
      "**Run the sceptic prompt** on the finished draft before you export it.",
    ],
  },

  { h2: "Prompt 1: gap analysis (do this first)" },
  {
    p: "Copy this into ChatGPT. Replace the bracketed blocks. This is the prompt that answers “tailor resume to job description prompt” without handing the model a blank cheque.",
  },
  {
    callout: {
      title: "Copy-paste: comparison table",
      body: "Act as a resume editor. Compare my resume to this job description. Build a table with four columns: job requirement, matching resume evidence, weak or missing evidence, and safe edit. Use only facts present in my resume. Do not add skills, tools, employers, titles, dates, credentials, metrics, or responsibilities. Mark unsupported requirements as “do not add”.\n\nJob description:\n[PASTE JD]\n\nResume:\n[PASTE RESUME WITHOUT CONTACT DETAILS]",
    },
  },
  {
    p: "Read the “do not add” column before you touch a sentence. Those rows are either a cover-letter topic or a sign this role is a stretch.",
  },

  { h2: "Prompt 2: rewrite the professional summary" },
  {
    p: "Only after the table exists. Keep it to two or three lines. Name the target title and two evidenced requirements.",
  },
  {
    callout: {
      title: "Copy-paste: summary",
      body: "Rewrite my resume summary for this target job using only the supported evidence from the table. Keep it to 2–3 lines. State the target title, my level and domain, and two requirements I can evidence. Avoid generic phrases. Do not add facts.\n\nSupported evidence from the table:\n[PASTE THE STRONG ROWS]\n\nCurrent summary:\n[PASTE SUMMARY]",
    },
  },

  { h2: "Prompt 3: rewrite three bullets (not the whole job)" },
  {
    p: "ChatGPT handles five focused bullets far better than “rewrite everything”. Ask for before-and-after so you can see what changed.",
  },
  {
    callout: {
      title: "Copy-paste: bullets",
      body: "The job description emphasises this requirement: “[PASTE THE EXACT REQUIREMENT LINE]”. Here are my current bullets from the most relevant role: [PASTE 3–5 BULLETS]. Rewrite so the most relevant bullet leads. Mirror the job description’s terminology only where it is accurate to my experience. Do not add tools, scope, or results I did not state. Keep each bullet under two lines, start with an action verb, and show before/after for each. Keep my numbers exactly as they are.",
    },
  },

  { h2: "Prompt 4: the sceptic pass" },
  {
    p: "This is the one that catches invented metrics. Run it on the finished draft, not on the original.",
  },
  {
    callout: {
      title: "Copy-paste: sceptic review",
      body: "Act as a sceptical hiring manager. Compare this tailored draft to my original resume. Flag any metric, tool, title, employer, or responsibility that is stronger than the original or not present there. Quote the offending line. Do not suggest replacements that add new facts.",
    },
  },

  { h2: "How to tailor a resume to a job description using Claude" },
  {
    p: "Use the same four prompts. Two Claude-specific habits help:",
  },
  {
    ul: [
      "**Re-paste the job description** in every rewrite message. Long chats lose details.",
      "**Repeat the constraint in the same message** as the rewrite: “Do not invent metrics, tools, titles, or employers.” Claude follows a nearby rule more reliably than one from ten turns ago.",
    ],
  },
  {
    p: "If you already have a Claude project with your master CV loaded, still paste the specific JD and the three bullets you want changed. Project memory is not a substitute for a tight prompt.",
  },

  { h2: "What ChatGPT cannot do (and a job link can)" },
  {
    p: "The method above works. The arithmetic does not, once you apply weekly. You still have to find the posting, copy it, paste sections, check for hallucinations, and put the result into a layout that an ATS can parse.",
  },
  {
    table: {
      head: ["", "ChatGPT or Claude", "From a job link"],
      rows: [
        ["Reads the posting from a URL", "No — you copy-paste", "Yes"],
        ["Works from a structured CV", "Only if you paste it each time", "Yes, uploaded once"],
        ["Invented tools and metrics", "Common unless you constrain it", "Blocked: only your evidence"],
        ["ATS-safe PDF export", "You lay it out yourself", "Single-column PDF"],
        ["Cover letter from the same parse", "A separate chat", "Same posting, same pass"],
        ["Sustainable at 10 applications/week", "Rarely", "Yes"],
      ],
    },
  },
  {
    p: "If you want the manual method written out without a model in the loop, use the [step-by-step tailoring guide](/blog/how-to-tailor-cv-to-job-description). If you want the honest ChatGPT-versus-tool split, that is the [FitMyCV vs ChatGPT comparison](/blog/fitmycv-vs-chatgpt-resume-tailoring). If the bottleneck is producing a first draft per posting, [paste the job link](/tailor-cv-from-job-link) instead.",
  },
  {
    cta: {
      title: "Skip the copy-paste loop on the next role",
      body: "Upload your CV once, paste the job URL, and get a tailored resume and cover letter you can edit. Same honesty rule: nothing is invented.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV from a job link",
    },
  },

  { h2: "The checklist" },
  {
    ul: [
      "Compare before you rewrite. Unsupported rows stay off the resume.",
      "Edit the summary, skills order, and three bullets — not the whole document in one prompt.",
      "Keep your original numbers. If a metric is missing, you supply it; the model does not.",
      "Run the sceptic pass. Delete anything it flags.",
      "Export from a real editor and run the [ATS checker](/ats-resume-checker) against the same posting.",
    ],
  },
];

const post = { meta, faqs, blocks };
export default post;
