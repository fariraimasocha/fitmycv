export const meta = {
  slug: "ats-resume-format",
  title: "ATS Resume Format: Two Columns, Tables, Icons and Photos Answered",
  seoTitle: "ATS Resume Format: What Parsers Can and Cannot Read",
  description:
    "Can an ATS read two column resumes, tables, text boxes, icons or a photo? A direct answer on each, what actually breaks a parse, and how to test your own file.",
  excerpt:
    "Most ATS formatting advice is folklore repeated until it sounds like fact. Here is what actually breaks a parse, what is merely risky, and the ten second test that settles it for your file.",
  date: "2026-09-10",
  readingTime: 11,
  category: "ATS",
  tags: ["ats", "formatting", "resume format", "parsing"],
  image: "/og-image.jpg",
  imageAlt: "FitMyCV",
  keywords: [
    "ats resume format",
    "ats friendly resume format",
    "can ats read two column resumes",
    "are two column resumes ats friendly",
    "can ats read tables in resumes",
    "can ats read text boxes",
    "can ats read icons on resumes",
    "should resume be one column",
    "can ats read pdf resume",
    "should resume have a photo",
    "should resume have graphics",
  ],
};

export const faqs = [
  {
    q: "Can an ATS read a two column resume?",
    a: "Often yes, sometimes badly. Modern parsers handle many two column layouts correctly. The failure mode is not that the text disappears, it is that the reading order scrambles: your skills column gets interleaved with your job history line by line. A single column removes the risk entirely, which is why it remains the safe default when you cannot test the specific system.",
  },
  {
    q: "Can an ATS read tables in a resume?",
    a: "Simple tables usually parse. Nested tables, merged cells and tables used to lay out the whole page are where it breaks, because the parser has to guess the reading order and often guesses wrong. If you use a table, keep it to one row of simple cells and never build your page structure from one.",
  },
  {
    q: "Can an ATS read text boxes?",
    a: "This is the one place the folklore is close to right. Text boxes, headers and footers are the elements most commonly skipped, because in many document formats they sit outside the main text flow. Never put your name, phone number or email in a header or a text box.",
  },
  {
    q: "Can an ATS read a PDF resume?",
    a: "Yes, provided it is a text-based PDF exported from a word processor rather than a scan or an image. The old advice to always send DOCX is out of date. What still matters is that the text is selectable: if you cannot highlight a line in your PDF reader, no parser can read it either.",
  },
  {
    q: "Should a resume have a photo?",
    a: "In the UK, US, Canada, Australia and Ireland, no. Many employers there remove photos before review to reduce bias risk, and some systems reject files with them. In much of Europe, Latin America and Asia a photo is conventional. Follow the norm of the country you are applying in, not the norm of the country you are in.",
  },
  {
    q: "Should a resume be one column?",
    a: "For any application going through a system you cannot test, yes. A single column parses in the intended order every time and costs you nothing except a design opinion. Keep the two column version for a PDF you email to a named person or hand over in the room.",
  },
  {
    q: "Do icons on a resume break an ATS?",
    a: "The icon itself is ignored, which is fine. The problem is when the icon replaces the label: a small envelope glyph next to your email carries no text, so a parser looking for the word email finds nothing. Keep the icon and keep the word.",
  },
];

export const blocks = [
  { h2: "The short version" },
  {
    p: "Most formatting advice about applicant tracking systems is folklore that got repeated until it sounded like a rule. The honest position is that **parsers vary**, the same file can come out clean in one system and scrambled in another, and nobody can tell you which system a given employer runs. So the useful question is not what is banned. It is which choices carry risk you gain nothing from taking.",
  },
  {
    table: {
      head: ["Element", "Verdict", "What actually happens"],
      rows: [
        ["Single column", "Safe", "Parses in the intended order every time. The default for anything you cannot test."],
        ["Two columns", "Risky", "Usually readable. When it fails, the reading order interleaves rather than dropping text."],
        ["Simple table", "Usually fine", "One row of simple cells is normally read left to right without trouble."],
        ["Nested or merged tables", "Avoid", "Reading order becomes a guess. This is where real scrambling happens."],
        ["Text boxes", "Avoid", "Commonly skipped entirely because they sit outside the main text flow."],
        ["Headers and footers", "Avoid", "Same problem. Never put contact details here."],
        ["Icons", "Safe if labelled", "The glyph is ignored. Losing the word next to it is the actual damage."],
        ["Photo", "Depends on country", "Conventional in much of Europe and Asia. Removed or penalised in UK, US, Canada, Australia."],
        ["Text-based PDF", "Safe", "Selectable text parses fine. The DOCX-only advice is out of date."],
        ["Scanned or image PDF", "Fails", "No text layer, so there is nothing to extract."],
        ["Charts, bars, rating dots", "Wasted", "Read as nothing. A five star Python rating conveys zero to the parser and little to a human."],
      ],
    },
  },

  { h2: "Why two columns is the argument that never ends" },
  {
    p: "A two column CV does not usually lose text. It loses **order**. The parser reads the page in a sequence, and when two columns sit side by side it has to decide whether to read across or down. Guess wrong and a line of your skills column lands between two of your job bullets, producing a record that is technically complete and effectively unreadable.",
  },
  {
    compare: {
      title: "What a scrambled parse looks like",
      context: "Same file. The left is what you designed, the right is what a parser extracted.",
      before: "SKILLS          EXPERIENCE\nPython          Senior Engineer, Acme\nAWS             2021 to present\nKubernetes      Owned the payments service",
      after: "SKILLS EXPERIENCE Python Senior Engineer, Acme AWS 2021 to present Kubernetes Owned the payments service",
    },
  },
  {
    p: "A recruiter searching for a Senior Engineer with Kubernetes still finds you here. A recruiter reading the extracted record sees a mess, and the automatic fields for job title and dates are more likely to be wrong. The cost is not usually rejection. It is a worse first impression from a file you spent an evening formatting.",
  },
  {
    callout: {
      title: "The rule that survives every version of this debate",
      body: "Never put anything that only exists once in a fragile element. Your name, your phone number, your email and your job titles must sit in the plain body of the document. A skills list that gets mangled is recoverable. A phone number in a header that was never extracted is a lost application.",
    },
  },

  { h2: "PDF or Word, settled" },
  {
    p: "Send a **text-based PDF** unless the posting asks for a Word document. PDF holds your layout on every machine, and every mainstream system has parsed PDFs for years. Send DOCX when the employer asks, which usually means their process edits or reformats the file before a hiring manager sees it.",
  },
  {
    p: "The failure case is narrow and specific: a PDF with no text layer. That happens when you scan a printed CV, photograph it, or export from a design tool that outlines the fonts. Open your file and try to select a sentence. If the cursor will not grab it, neither will a parser.",
  },

  { h2: "The photo question depends on where you are applying" },
  {
    ul: [
      "**UK, US, Canada, Australia, Ireland:** no photo. Many employers strip them before review to limit bias exposure, and some systems flag files that contain them.",
      "**Germany, France, Spain, Italy, much of central Europe:** a photo is conventional and its absence can look odd.",
      "**Japan, China, South Korea, much of Latin America and the Middle East:** commonly expected.",
      "**Anywhere, when a recruiter asks you not to:** follow the instruction. It is usually a client requirement, not a preference.",
    ],
  },
  {
    p: "Apply the norm of the country the role is in. A UK candidate applying to a Munich office should follow the German convention, not the British one.",
  },

  { h2: "The ten second test that settles it for your file" },
  {
    steps: [
      {
        title: "Open your CV and select all",
        body: "Ctrl+A or Cmd+A, then copy. This is roughly what a parser extracts, and it costs you ten seconds.",
      },
      {
        title: "Paste it into a plain text editor",
        body: "Notes, TextEdit in plain mode, or any empty text box. Formatting disappears and you see the raw sequence.",
      },
      {
        title: "Read the order, not the appearance",
        body: "Is your name first? Are the job titles attached to the right employers? Did the skills column land in the middle of a role? Whatever you see here is close to what the system will store.",
      },
      {
        title: "Fix the order, not the aesthetics",
        body: "If it reads correctly, your format is fine regardless of what any listicle says. If it does not, collapse to a single column and test again.",
      },
    ],
  },
  {
    p: "This test is more reliable than any rule in this article, because it tests **your** file rather than a generalisation about files. The free [ATS resume checker](/ats-resume-checker) gives you the same read plus a keyword match against a specific posting.",
  },

  { h2: "What actually gets people rejected" },
  {
    p: "Formatting is the part of ATS advice that gets written about most and causes the fewest rejections. In practice a clean single column CV in a text-based PDF clears the technical bar comfortably, and what decides the outcome afterwards is vocabulary and evidence: whether your CV uses the words the posting uses, and whether your bullets carry numbers.",
  },
  {
    ol: [
      "**Vocabulary mismatch.** You wrote client communication, the posting said stakeholder management, and the recruiter searched for the second one. See [missing resume keywords](/missing-resume-keywords).",
      "**Acronyms one way only.** Write both CI/CD and continuous integration, both PMP and Project Management Professional.",
      "**Evidence buried.** Your best match sits in your third role. Move it up.",
      "**Bullets without numbers.** The parse succeeded and the human still had nothing to hold onto. See the [resume bullet rewriter](/resume-bullet-rewriter).",
      "**A generic CV sent to forty postings.** The most common cause of silence, and the only one on this list that formatting cannot fix.",
    ],
  },
  {
    cta: {
      title: "Format is fine. Is the content matched?",
      body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, then exports a single column, text-based PDF.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },

  { h2: "The checklist" },
  {
    ul: [
      "Single column for anything going through a system you cannot test.",
      "Contact details in the body of the document, never in a header, footer or text box.",
      "Text-based PDF unless the posting asks for DOCX. Check the text is selectable.",
      "Icons kept, labels kept beside them.",
      "No rating bars, skill wheels, or charts. They convey nothing to either reader.",
      "Photo decided by the country the role is in.",
      "Run the copy and paste test before you send, every time you change the template.",
    ],
  },
];

const post = { meta, faqs, blocks };
export default post;
