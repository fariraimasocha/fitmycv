// Resume file name generator landing page.
// A tiny utility with a real search intent behind it: "what should I name my
// resume". The tool is a sanitiser, so the copy stays practical.

export const resumeFileNameGenerator = {
  slug: "resume-file-name-generator",
  seoTitle: "Resume File Name Generator: What to Name Your Resume",
  description:
    "Get a clean, recruiter-friendly resume file name in seconds. Type your name and role, copy the result. Free, no login, nothing uploaded.",
  keywords: [
    "resume file name generator",
    "resume file name",
    "resume filename",
    "what should i name my resume",
    "best resume file name",
    "cv file name",
    "how to name a resume file",
    "resume naming convention",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "Resume file name generator",
  h1: "Resume file name generator",
  lede:
    "Type your name and the role you are applying for. Get a clean file name a recruiter can find again, with the characters that break uploads stripped out. Copy it, rename your file, apply.",
  ctas: [
    { label: "Name my file", href: "#tool" },
    {
      label: "Fix what is inside the file",
      href: "/ats-resume-checker",
      variant: "secondary",
    },
  ],
  tool: "filename",
  howTo: {
    name: "How to name a resume file",
    description:
      "Build a clean, searchable file name for a CV before you upload it.",
    steps: [
      {
        name: "Type your name and role",
        text: "Use the name a recruiter will see on the CV itself, and the job title from the posting rather than your current one.",
      },
      {
        name: "Add the company, optionally",
        text: "Worth doing when you are applying to several roles at one employer, or when a named person asked you to send it directly.",
      },
      {
        name: "Copy the name and rename your file",
        text: "Rename the file before you upload. Some portals rename it again on their end, but the version that reaches a recruiter's inbox is often yours.",
      },
    ],
  },
  faqs: [
    {
      q: "What should I name my resume file?",
      a: "Your name, the role, and the word Resume, joined by hyphens, saved as PDF. For example Farirai-Masocha-Software-Engineer-Resume.pdf. It tells a recruiter whose CV it is and which role it is for without opening it, and it stays readable when it appears in a download link.",
    },
    {
      q: "Should I use hyphens, underscores or spaces?",
      a: "Hyphens by default. Spaces become %20 in a download URL and can trip older upload forms, and underscores disappear when the file name is displayed underlined. Use underscores only when a portal or a recruiter explicitly asks for them.",
    },
    {
      q: "Should I include the company name?",
      a: "Include it when you are applying to more than one role at the same employer, or emailing a named contact directly. Leave it out when you are applying broadly, because the risk is real: sending a file named for one company to a different company is a hard mistake to explain.",
    },
    {
      q: "Should I put the date in the file name?",
      a: "No. A date reads as a version number, and an old date makes a current CV look stale even when you rewrote it that morning. Keep dates in the folder name on your own machine if you need them.",
    },
    {
      q: "PDF or DOCX?",
      a: "Send PDF unless the posting asks for a Word document. A PDF keeps your layout on every machine. Some employers ask for DOCX because their process edits or re-formats the file, and when they ask, give them what they asked for. The naming rules are the same either way.",
    },
    {
      q: "Does the file name affect my ATS score?",
      a: "Not the score. Applicant tracking systems parse what is inside the file, not what it is called, and most store it under their own reference anyway. The file name matters for the human side: a recruiter searching their inbox, or scanning a folder of attachments. What is inside the file is a separate job, and the [ATS resume checker](/ats-resume-checker) covers that.",
    },
    {
      q: "What if the portal renames my file on upload?",
      a: "Many do, and you cannot stop it. Name it properly anyway. Plenty of applications still arrive by email, get forwarded to a hiring manager, or get downloaded and saved to a shared drive, and in all three cases your name is the one that sticks.",
    },
  ],
  blocks: [
    { h2: "Why the file name is worth thirty seconds" },
    {
      p: "A recruiter's downloads folder holds hundreds of these. **A file called resume.pdf is invisible the moment it lands next to forty others with the same name.** Yours should say who you are and which role it is for, before anyone opens it.",
    },
    {
      p: "It is also the last thing you control before your application leaves your hands. Everything after upload belongs to somebody else's system.",
    },

    { h2: "Names that work, and names that do not" },
    {
      table: {
        head: ["File name", "Verdict", "Why"],
        rows: [
          [
            "Farirai-Masocha-Software-Engineer-Resume.pdf",
            "Best",
            "Name, role, and what the file is. Readable in a URL and in an inbox search.",
          ],
          [
            "Farirai-Masocha-Resume.pdf",
            "Good",
            "Right choice when you are applying broadly and the role varies.",
          ],
          [
            "Farirai_Masocha_Resume.pdf",
            "Fine",
            "Underscores are safe. Use them when a portal or a recruiter asks.",
          ],
          [
            "resume.pdf",
            "Poor",
            "Anonymous the moment it is saved. Collides with every other file.",
          ],
          [
            "Resume final v3 UPDATED.pdf",
            "Poor",
            "Reads as a working draft, and the spaces break download links.",
          ],
          [
            "CV 2019.pdf",
            "Poor",
            "The date makes a current CV look stale before it is opened.",
          ],
          [
            "My CV (2).pdf",
            "Poor",
            "Brackets and spaces are exactly what upload forms mishandle.",
          ],
        ],
      },
    },

    { h2: "Characters to keep out" },
    {
      p: "These break file handling somewhere between your machine, the upload form, and the recruiter's operating system. The tool strips them for you, and tells you when it did.",
    },
    {
      ul: [
        "**Slashes, colons and pipes** ( \\ / : | ) are reserved by Windows, macOS or both.",
        "**Question marks, asterisks and angle brackets** ( ? * < > ) are wildcards or reserved characters in common shells and file systems.",
        "**Quotation marks and apostrophes** are usually fine locally and inconsistent once a form quotes them into a URL.",
        "**Spaces** become %20 in a download link, which turns a tidy name into something unreadable.",
        "**Accented letters** are simplified, so the name survives a system that does not handle them well.",
        "**Emoji and symbols** never belong in a document you are sending to an employer.",
      ],
    },
    {
      callout: {
        title: "Keep your own capitalisation",
        body: "The tool leaves your capitalisation alone rather than title casing over it. People spell their own names, and an automatic rule gets surnames like McDonald, van der Berg and O'Neill wrong more often than it gets them right.",
      },
    },

    { h2: "One naming convention, used every time" },
    {
      ol: [
        "**Pick one separator and stay with it.** Hyphens unless something forces otherwise.",
        "**Lead with your name.** It is the thing a recruiter searches their inbox for.",
        "**Use the posting's job title,** not your current one, so the file matches the role it is answering.",
        "**End with Resume or CV,** whichever word the employer's market uses.",
        "**Leave out dates, version numbers and the words final, draft and updated.** They only ever cost you.",
        "**Keep it short enough to read at a glance.** Roughly eighty characters before the extension, and shorter is better.",
      ],
    },
    {
      p: "Apply the same convention to your cover letter, so the pair arrive looking deliberate: Farirai-Masocha-Software-Engineer-Cover-Letter.pdf.",
    },

    { h2: "The file name is the easy part" },
    {
      p: "This page fixes the outside of the document in thirty seconds. It does nothing for what is inside it, and the inside is what decides the application.",
    },
    {
      p: "The next two things worth your time: check which of the posting's terms your CV never mentions with [missing resume keywords](/missing-resume-keywords), then work down the page with the [resume bullet rewriter](/resume-bullet-rewriter).",
    },
    {
      cta: {
        title: "The name is right. Is the CV?",
        body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, keeping your real experience.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Missing resume keywords",
      href: "/missing-resume-keywords",
      body: "See which of the posting's terms your CV never mentions.",
    },
    {
      label: "Resume headline generator",
      href: "/resume-headline-generator",
      body: "Fix the first line a recruiter reads after they open the file.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score what is inside the document against the posting.",
    },
  ],
};
