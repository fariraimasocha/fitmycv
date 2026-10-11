// LinkedIn profile checker landing page.
// Pasted text against one posting, section by section. The tool never fetches
// a profile, so the copy never promises a "profile scan" by URL.

export const linkedinProfileChecker = {
  slug: "linkedin-profile-checker",
  seoTitle: "LinkedIn Profile Checker for Any Job Posting",
  description:
    "Paste your LinkedIn headline, About and skills next to a job posting. See which of its terms each section covers. Free, no login, runs in your browser.",
  keywords: [
    "linkedin profile checker",
    "linkedin profile optimization",
    "linkedin profile keywords",
    "optimize linkedin profile for job",
    "linkedin headline keywords",
    "linkedin profile review free",
    "linkedin profile score",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "LinkedIn profile checker",
  h1: "Check your LinkedIn profile against a job",
  lede:
    "Paste a job posting and your headline, About and skills. See which of the posting's main terms each section covers, which ones belong in your headline, and which ones are not on your profile at all.",
  ctas: [
    { label: "Check my profile", href: "#tool" },
    { label: "Check my CV instead", href: "/ats-resume-checker", variant: "secondary" },
  ],
  tool: "linkedin-profile",
  howTo: {
    name: "How to check a LinkedIn profile against a job posting",
    description: "Compare the sections of a LinkedIn profile with the terms a posting uses.",
    steps: [
      {
        name: "Paste the job posting",
        text: "Use the whole advert, including the requirements. The tool ranks the terms it repeats most.",
      },
      {
        name: "Paste your headline, About and skills",
        text: "Copy each one from your own profile. Nothing is fetched from LinkedIn and nothing is stored.",
      },
      {
        name: "Fix the gaps you can back up",
        text: "Move terms that are already on your profile into your headline. Add missing ones only where your experience supports them.",
      },
    ],
  },
  faqs: [
    {
      q: "Why paste text instead of a profile link?",
      a: "Reading LinkedIn profiles automatically is against LinkedIn's terms, and a pasted copy is what you would edit anyway. It also means the check runs in your browser and nothing leaves this tab.",
    },
    {
      q: "How is the score worked out?",
      a: "The tool picks the 15 terms the posting repeats most, then checks whether each one appears in your headline, About or skills. The score is the share of those terms found anywhere on your profile. It is a keyword check, not a judgement of how well the profile reads.",
    },
    {
      q: "Why does the headline matter most?",
      a: "It is the line shown under your name in LinkedIn search results and next to every comment you leave. If a term is already in your About or skills, the headline is the cheapest place to make it visible.",
    },
    {
      q: "Should I add every missing term?",
      a: "No. Add the ones your experience backs up. A recruiter who asks about a skill you listed and do not have is worse than a gap.",
    },
    {
      q: "Is this the same as checking my CV?",
      a: "No. Your CV goes to one employer, your profile is seen by everyone who searches. Use this for the profile, and the free ATS resume checker or the tailoring tool for the CV.",
    },
  ],
  blocks: [
    { h2: "What the check looks at" },
    {
      p: "Three sections: your headline, your About and your skills. **For each term the posting leans on, you see which section mentions it.** Terms that are on your profile but not in your headline are listed first, because they are the quickest fix.",
    },
  ],
};
