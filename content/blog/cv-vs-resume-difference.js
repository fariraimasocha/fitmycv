export const meta = {
  slug: "cv-vs-resume-difference",
  title: "CV vs Resume: What Is the Difference?",
  seoTitle: "CV vs Resume: What Is the Difference?",
  description:
    "What separates a CV from a resume, why the answer changes by country, and which one to send when the posting does not say.",
  excerpt:
    "In the US they are two different documents. In the UK, Ireland and much of the Commonwealth they are the same document under a different name. Both facts matter when you apply abroad.",
  date: "2026-09-12",
  readingTime: 6,
  category: "Basics",
  tags: ["cv", "resume", "format", "international"],
  image: "/blog/cv-vs-resume-difference.png",
  imageAlt:
    "Flat illustration of a short resume page and a long CV page beside a globe icon",
  keywords: [
    "cv vs resume",
    "cv vs resume difference",
    "difference between cv and resume",
    "is a cv the same as a resume",
    "what is the difference between a cv and a resume",
    "cv or resume which to send",
  ],
};

export const faqs = [
  {
    q: "What is the difference between a CV and a resume?",
    a: "It depends where you are. In the United States and Canada they are different documents: a resume is a one to two page targeted summary, while a CV is a long academic record of publications, research and teaching. In the UK, Ireland, Australia, New Zealand, South Africa and most of Europe, CV is simply the everyday word for the same two page document Americans call a resume.",
  },
  {
    q: "Is a CV the same as a resume?",
    a: "Outside North America, yes, in ordinary job hunting. Inside North America, no. This is why the question has two confidently contradictory answers online: both are correct in their own market, and neither page usually says which market it means.",
  },
  {
    q: "Which should I send if the job posting does not specify?",
    a: "Match the employer's country, not your own. A US employer asking for a resume wants one or two pages, targeted. A UK employer asking for a CV wants the same thing under a different name. Only send a long academic CV if the role is academic or research based, or if the posting explicitly asks for publications.",
  },
  {
    q: "How long should each one be?",
    a: "A US resume is one page early in a career and two pages once you have the history to justify it. A UK style CV is conventionally two pages. An academic CV has no page limit, because it is a complete record rather than a pitch, and ten pages or more is unremarkable.",
  },
  {
    q: "Should a CV include a photo?",
    a: "In the UK, Ireland, the US, Canada and Australia, no. Recruiters there generally treat a photo as a liability for bias reasons and some applicant tracking systems parse image heavy layouts badly. In parts of continental Europe a photo remains conventional. Follow the employer's country.",
  },
];

export const blocks = [
  {
    p: "**Short answer: in the United States a CV and a resume are different documents. Almost everywhere else they are the same document under different names.** A US resume is a targeted one to two page summary. A US CV is a long academic record. A UK CV is what an American would call a resume.",
  },
  {
    p: "That regional split is why this question has two confident and contradictory answers online. Both are right in their own market.",
  },

  { h2: "The three documents people mean" },
  {
    table: {
      head: ["", "US resume", "UK style CV", "Academic CV"],
      rows: [
        ["Typical length", "1 to 2 pages", "2 pages", "No limit, often 10 or more"],
        ["Purpose", "Targeted pitch for one role", "Targeted pitch for one role", "Complete professional record"],
        ["Tailored per application", "Yes", "Yes", "Rarely, mostly static"],
        ["Publications section", "No", "No", "Yes, usually central"],
        ["Photo", "No", "No", "No"],
        ["Used in", "US, Canada", "UK, Ireland, Australia, NZ, South Africa, much of Europe", "Academia and research worldwide"],
      ],
    },
  },
  {
    p: "The first two columns describe the same document. Only the word changes at the border.",
  },

  { h2: "Where the confusion comes from" },
  {
    p: "Curriculum vitae is Latin for course of life, and the term arrived in academia first, where it meant a full record of scholarly output. North American usage kept that meaning and coined resume for the short commercial version.",
  },
  {
    p: "British and Commonwealth usage went the other way: CV became the everyday word for any job application document, and resume never took hold. Neither is a mistake. They are two conventions with a shared vocabulary, which is exactly the setup for people talking past each other.",
  },

  { h2: "Which one to send" },
  {
    ol: [
      "**Look at the employer's country, not yours.** A South African applying to a US company sends a US style resume, even though at home the same document is a CV.",
      "**Read the posting's own word.** If a US posting says CV and the role is not academic, they almost certainly mean a resume. Send the two page targeted version.",
      "**Only go long for academic and research roles.** Publications, grants, conference talks and teaching history belong on an academic CV and nowhere else.",
      "**When genuinely unsure, send two pages, targeted.** It is the safest document in every market. Nobody has ever been rejected for a clear, relevant two page application.",
    ],
  },

  { h2: "What does not change between them" },
  {
    p: "Whatever the market calls it, the same things break the document. Applicant tracking systems parse a two column layout with a sidebar badly, because converting the PDF to text can interleave the columns and scramble your work history. Single column survives. This is true of a resume in Chicago and a CV in Manchester.",
  },
  {
    p: "Tailoring works the same way too. Recruiters search their system by keyword regardless of what the document is called, so the posting's vocabulary needs to appear where your experience genuinely supports it. Our guide to [how much to tailor](/blog/how-much-should-you-tailor-your-resume) applies to both.",
  },
  {
    callout: {
      title: "One base document, two labels",
      body: "If you apply across markets, you do not need two CVs. You need one strong two page document, saved under whichever filename the employer's country expects, and aimed at each posting. The content difference between a good UK CV and a good US resume is close to zero.",
    },
  },

  { h2: "A note on spelling and dates" },
  {
    p: "Small things that mark a document as foreign: date formats, spelling, and phone number formatting. Write dates the way the employer's country writes them, use their spelling conventions, and give your number in international format if you are applying abroad. None of this is decisive, and all of it is free.",
  },

  { h2: "If you are applying in both markets" },
  {
    p: "Keep one reference document and aim it per application. That is the whole workflow: the base stays stable, the top third moves to match each posting, and the label on the file follows the employer.",
  },
  {
    cta: {
      title: "One CV, aimed at each posting",
      body: "Upload your reference document once, paste the job link, and FitMyCV rewrites it to match the role. Works the same whether the employer calls it a CV or a resume.",
      href: "/tailor-cv-from-job-link",
      label: "Tailor my CV",
    },
  },
];

const post = { meta, faqs, blocks };
export default post;
