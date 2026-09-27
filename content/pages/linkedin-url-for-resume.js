// LinkedIn URL for resume landing page.
// A small utility with a real search behind it: "how do I put my LinkedIn
// link on my CV". The tool only tidies the pasted URL, so the copy stays
// practical and makes no claims about the profile itself.

export const linkedinUrlForResume = {
  slug: "linkedin-url-for-resume",
  seoTitle: "LinkedIn URL for Resume: Clean Your CV Link",
  description:
    "Paste your LinkedIn profile link and get a clean version for your CV, plus the full link to put behind it. Free, no login, nothing uploaded.",
  keywords: [
    "linkedin url for resume",
    "linkedin link on resume",
    "cv with linkedin link",
    "resume linkedin link",
    "linkedin link for cv",
    "cv link",
    "link to cv",
    "resume url",
    "how to put linkedin on resume",
  ],
  eyebrow: "Free tool",
  breadcrumbName: "LinkedIn URL for resume",
  h1: "LinkedIn URL for your resume",
  lede:
    "Paste the link from your LinkedIn profile. Get the short form to print on your CV and the full form to put behind it as a hyperlink, with the tracking text and country prefix stripped out.",
  ctas: [
    { label: "Clean my link", href: "#tool" },
    {
      label: "Check the rest of my CV",
      href: "/ats-resume-checker",
      variant: "secondary",
    },
  ],
  tool: "link",
  howTo: {
    name: "How to add a LinkedIn link to a resume",
    description: "Turn a copied LinkedIn address into a clean link for a CV.",
    steps: [
      {
        name: "Copy your profile address",
        text: "Open your own LinkedIn profile and copy the address from the browser bar, or use the share option on your profile.",
      },
      {
        name: "Paste it into the tool",
        text: "The tool strips the tracking text, the country or mobile prefix and anything after your name, and shows you what it removed.",
      },
      {
        name: "Add both forms to your CV",
        text: "Type the short form in your contact line and set the full form as the hyperlink behind it, so the text reads cleanly and a click still works.",
      },
    ],
  },
  faqs: [
    {
      q: "Where does the LinkedIn link go on a resume?",
      a: "In the contact line at the top, next to your email and phone number. Keep it in the body of the document, not in a header, footer or text box, because some applicant tracking systems skip those areas.",
    },
    {
      q: "Should I put my LinkedIn on my resume?",
      a: "Yes, if your profile matches your CV and is reasonably complete. Recruiters often look you up anyway, and a link saves them the search. If the profile is years out of date or contradicts your CV, update it first or leave the link off.",
    },
    {
      q: "Should the LinkedIn link be clickable in a PDF?",
      a: "Yes. Type the short form as the visible text and set the full https link behind it. Word, Google Docs and most CV builders let you add a hyperlink to selected text, and the link survives when you export to PDF.",
    },
    {
      q: "Should I use the full URL or the short one?",
      a: "Print the short one, linkedin.com/in/your-name. The https and www add length without telling the reader anything. The full form belongs behind the text as the hyperlink, where nobody has to read it.",
    },
    {
      q: "Can applicant tracking systems read links?",
      a: "They read the link as text, like any other line. Many store it as a profile field, and some ignore it. That is why the printed text should be a clean, readable address rather than a long string with tracking code on the end.",
    },
    {
      q: "What about GitHub, a portfolio or a personal site?",
      a: "Add them to the same contact line in the same short form, for example github.com/your-name. Only include links that support the role you are applying for, and check each one opens before you send the CV.",
    },
    {
      q: "How do I get a custom LinkedIn URL?",
      a: "On your profile, open the option to edit your public profile and URL, then edit the custom URL. Use your name, or your name plus a word if it is taken. The old link usually stops working, so update anything that used it.",
    },
  ],
  blocks: [
    { h2: "Why a clean link is worth a minute" },
    {
      p: "A copied LinkedIn address often carries a country prefix, a language path and tracking text. **On a printed CV that string looks careless, and in some PDFs it breaks across lines and stops working as a link.** The clean form is short, reads as your name, and fits on the same line as your email.",
    },

    { h2: "LinkedIn links that work, and ones that do not" },
    {
      table: {
        head: ["Link on the CV", "Verdict", "Why"],
        rows: [
          [
            "linkedin.com/in/farirai-masocha",
            "Best",
            "Short, readable, and reads as your name.",
          ],
          [
            "https://www.linkedin.com/in/farirai-masocha",
            "Fine",
            "Works, but the https and www add length and say nothing.",
          ],
          [
            "linkedin.com/in/farirai-masocha-4b2a19c3",
            "Weak",
            "The random ending looks unfinished. Set a custom URL.",
          ],
          [
            "uk.linkedin.com/in/farirai-masocha?originalSubdomain=zw",
            "Poor",
            "Country prefix and tracking text. Long, messy and easy to break.",
          ],
          [
            "LinkedIn",
            "Poor",
            "A bare word. On paper, or in a system that drops hyperlinks, nobody can follow it.",
          ],
        ],
      },
    },

    { h2: "Set a custom URL first" },
    {
      p: "If your link ends in a run of numbers and letters, LinkedIn made it for you. You can change it in a couple of minutes.",
    },
    {
      ol: [
        "**Open your own profile** while signed in to LinkedIn.",
        "**Find the option to edit your public profile and URL.** It sits near the top of your profile page.",
        "**Edit your custom URL** and type your name. If it is taken, add a middle initial or a word from your field.",
        "**Save, then paste the new link into the tool** above to get the clean form for your CV.",
      ],
    },
    {
      callout: {
        title: "Update everywhere the old link lives",
        body: "Changing your custom URL usually means the old address stops working. Check your email signature, portfolio and any CV you have already saved before you send the next application.",
      },
    },

    { h2: "Where it sits on the page" },
    {
      p: "One line under your name holds everything a recruiter needs to reach you: name, city, email, phone and links. Keep it as plain text in the body of the document.",
    },
    {
      ul: [
        "**Order it by what a recruiter uses first:** email and phone, then LinkedIn, then GitHub or a portfolio.",
        "**Use the same short form for every link,** so the line reads as one set.",
        "**Leave out links that do not help this application.** A personal blog about something unrelated takes space and invites the wrong questions.",
        "**Click every link in the exported PDF** before you send it. A link that worked in the editor can break on export.",
      ],
    },

    { h2: "The link is the easy part" },
    {
      p: "A clean link fixes one line. The recruiter who clicks it has already decided your CV is worth a second look, and that decision rests on everything else on the page.",
    },
    {
      p: "Name the file properly with the [resume file name generator](/resume-file-name-generator), fix the line under your name with the [resume headline generator](/resume-headline-generator), then check the whole CV against the posting with the [ATS resume checker](/ats-resume-checker).",
    },
    {
      cta: {
        title: "The link is clean. Is the CV?",
        body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, keeping your real experience.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  related: [
    {
      label: "Resume file name generator",
      href: "/resume-file-name-generator",
      body: "Name the file so a recruiter can find it again.",
    },
    {
      label: "Resume headline generator",
      href: "/resume-headline-generator",
      body: "Fix the line under your name that a recruiter reads first.",
    },
    {
      label: "Free ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your CV against a posting and see the terms you are missing.",
    },
  ],
};
