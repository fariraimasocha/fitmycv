// Template landing pages. These describe the 16 layouts the app actually
// ships (utils/cv-templates/metadata.js) rather than offering downloads we do
// not have — the CTA sends people into the product where the templates exist.

export const cvTemplates = {
  slug: "cv-templates",
  seoTitle: "Free ATS-Friendly CV Templates (16 Layouts)",
  description:
    "16 ATS-friendly CV templates that parse cleanly: single column, standard headings, no graphics. Drop your content in and export a recruiter-ready PDF.",
  keywords: [
    "cv template",
    "free cv template",
    "ats friendly cv template",
    "cv templates uk",
    "professional cv template",
    "cv layout",
  ],
  eyebrow: "Templates",
  breadcrumbName: "CV templates",
  h1: "ATS-friendly CV templates",
  lede:
    "16 layouts, all single-column and built to survive parsing. Choose one, drop your content in, and export a clean PDF. No design software and no sidebar that scrambles on extraction.",
  ctas: [
    { label: "Use a template", href: "/auth" },
    { label: "How to write a CV", href: "/how-to-write-a-resume", variant: "secondary" },
  ],
  showTemplates: true,
  faqs: [
    {
      q: "What makes a CV template ATS-friendly?",
      a: "A single-column layout, standard section headings, contact details in the document body rather than the header, no tables or text boxes used for layout, no graphics or skill-rating dots, and export as a text-based PDF. Every template here follows all six rules.",
    },
    {
      q: "Are these CV templates free?",
      a: "Creating an account and building your CV in any of the 16 layouts is free, and so is tailoring it to a job posting: you get the rewritten CV and the cover letter on screen without paying. The paid plan is what adds the match score and the ATS score, and lets you download the result as a PDF.",
    },
    {
      q: "Why do the templates not have colours and sidebars?",
      a: "Because sidebars are the single most common cause of scrambled parsing. A parser can read straight across both columns and interleave your skills list into a job description. The templates are deliberately conservative for that reason, with restraint in typography rather than decoration.",
    },
    {
      q: "Which CV template should I choose?",
      a: "For most people, Classic or Professional. Choose Technical if you need a prominent skills block, Executive if you are senior and leading with scope, Compact if you are fighting for space, and Minimal if your content is strong enough to carry the page on its own.",
    },
    {
      q: "Can I change template later?",
      a: "Yes. Your content is stored as structured data rather than as a formatted document, so switching layout re-renders the same CV in a different template without any retyping.",
    },
    {
      q: "What is the difference between a CV and a resume template?",
      a: "In the UK, Ireland, and much of Europe, CV means the standard two-page application document, which is what a resume means in the US. Outside academia the templates are interchangeable; the same layouts work for both, and the [resume templates page](/resume-templates) covers the US conventions.",
    },
  ],
  blocks: [
    { h2: "Why these templates look plain" },
    {
      p: "Most template galleries optimise for the preview thumbnail. Sidebars, colour blocks, icon rows, and skill-rating dots all look excellent at a glance and cause specific, well-documented problems the moment the file is parsed.",
    },
    {
      table: {
        head: ["Design flourish", "What happens on parse"],
        rows: [
          ["Two-column sidebar", "Reading order can interleave both columns into nonsense"],
          ["Contact details in the header", "Skipped entirely: a perfect record nobody can contact"],
          ["Tables used for layout", "Read cell by cell; order destroyed, nested tables dropped"],
          ["Icons instead of labels", "No text to extract, so the field is simply missing"],
          ["Skill-rating dots", "No text, and no evidence for the human reader either"],
          ["Image or scanned export", "No text layer at all: nothing to index"],
        ],
      },
    },
    {
      p: "The [ATS-friendly resume guide](/blog/ats-resume-guide) covers the mechanism behind each of these, if you want the reasoning rather than the rule.",
    },

    { h2: "Choosing between the fourteen" },
    {
      ul: [
        "**Classic / Professional:** the default choice for most roles and most industries.",
        "**Technical:** foregrounds a structured skills and tooling block, for engineering and data roles.",
        "**Executive:** more room for a scope-led summary, for senior and leadership applications.",
        "**Compact / Minimal:** the tightest typography, when you are trying to keep a dense history on one page.",
        "**Modern / Clean / Elegant:** the same structure with slightly warmer type and spacing.",
        "**Spotlight / Sidebar:** a visually distinct header block, still single-column in reading order.",
      ],
    },
    {
      callout: {
        title: "The template is not the hard part",
        body: "Layout gets you parsed. What earns the interview is bullets with a verb, a specific action, and a number, plus a CV tailored to the posting in front of you. Templates buy you an hour; tailoring buys you the response.",
      },
    },

    { h2: "After you pick one" },
    {
      steps: [
        {
          title: "Fill in the structure, not the styling",
          body: "Your content is stored as structured sections, so you are writing text rather than fighting a layout. Switch templates any time without retyping.",
        },
        {
          title: "Write the bullets properly",
          body: "Verb, specific action, measurable result. [How to write a resume](/how-to-write-a-resume) has the full method and worked examples.",
        },
        {
          title: "Tailor per application",
          body: "The same master CV, reordered and reworded for each posting. [Tailoring from a job link](/tailor-cv-from-job-link) does the first pass in about a minute.",
        },
        {
          title: "Check before you send",
          body: "Run the finished PDF through the [free ATS resume checker](/ats-resume-checker) against the actual job description.",
        },
      ],
    },
  ],
  related: [
    {
      label: "Resume templates",
      href: "/resume-templates",
      body: "The same layouts, with US resume conventions and length guidance.",
    },
    {
      label: "Google Docs CV template",
      href: "/google-docs-cv-template",
      body: "Building an ATS-safe CV in Google Docs, and where it falls short.",
    },
    {
      label: "How to write a resume",
      href: "/how-to-write-a-resume",
      body: "What goes in each section, in what order, with examples.",
    },
  ],
};

export const resumeTemplates = {
  slug: "resume-templates",
  seoTitle: "Free ATS Resume Templates That Parse Cleanly",
  description:
    "16 free ATS resume templates: single column, standard headings, no graphics. Built for US conventions and the rules parsers actually enforce.",
  keywords: [
    "resume template",
    "free resume template",
    "ats resume template",
    "professional resume template",
    "simple resume template",
    "best resume format",
  ],
  eyebrow: "Templates",
  breadcrumbName: "Resume templates",
  h1: "ATS resume templates",
  lede:
    "16 layouts that parse cleanly, with US resume conventions built in: one page where it should be one page, reverse-chronological, and no design flourish that costs you a field.",
  ctas: [
    { label: "Use a template", href: "/auth" },
    { label: "Resume tips", href: "/resume-tips", variant: "secondary" },
  ],
  showTemplates: true,
  faqs: [
    {
      q: "What is the best resume format in 2026?",
      a: "Reverse-chronological, single column, standard headings, exported as a text-based PDF. Functional and skills-based formats obscure your timeline, which parsers handle badly and recruiters read as evasive.",
    },
    {
      q: "Should a resume be one page or two?",
      a: "One page under roughly eight years of experience, two beyond that. The real constraint is relevance rather than length. Two pages where the second is a decade of unrelated roles is worse than one page that is entirely on target.",
    },
    {
      q: "Do these resume templates work with Workday, Greenhouse, and Taleo?",
      a: "Yes. The rules that matter are the same across all of them: one column, headings from the standard vocabulary, contact details in the body, no tables or images, and a real text layer. These templates follow all five.",
    },
    {
      q: "Should I put my address on my resume?",
      a: "City and state or country is enough, and it is worth including because recruiters filter by location. A full street address adds nothing and is unnecessary personal data on a document you send to strangers.",
    },
    {
      q: "Can I use a Word resume template instead?",
      a: "You can, and if an application form specifically asks for .doc or .docx you should. Just apply the same rules. Many stock Word templates use text boxes and two-column tables, which is precisely what scrambles on extraction.",
    },
    {
      q: "Are these templates really free?",
      a: "Building your resume in any of the 16 layouts is free with an account, and so is tailoring it to a specific job posting. The paid plan is what lets you export the tailored version as a PDF.",
    },
  ],
  blocks: [
    { h2: "The rules every template here follows" },
    {
      ol: [
        "**One column.** Reading order top to bottom, always.",
        "**Contact details in the body.** Never in the page header region.",
        "**Standard headings.** Experience, Education, Skills, Certifications, Projects.",
        "**No tables or text boxes for layout.** Paragraphs and bullets only.",
        "**No graphics, icons, or rating dots.** Nothing that carries meaning without text.",
        "**Text-based PDF export.** Selectable text, every time.",
      ],
    },
    {
      p: "Those six are not stylistic preferences. Each one maps to a specific, repeatable parsing failure. The [complete ATS guide](/blog/ats-resume-guide) walks through what breaks and why.",
    },

    { h2: "US resume conventions" },
    {
      table: {
        head: ["Convention", "US resume", "UK / EU CV"],
        rows: [
          ["Typical length", "1 page under ~8 years", "2 pages is normal"],
          ["Photo", "Omit", "Omit in UK; common in parts of the EU"],
          ["Date of birth / marital status", "Never", "Never in the UK"],
          ["Section name", "Experience", "Work Experience or Employment History"],
          ["Spelling", "US (organize, optimize)", "UK (organise, optimise)"],
          ["References", "Omit entirely", "Omit entirely"],
        ],
      },
    },
    {
      p: "If you are applying in the UK, Ireland, or Europe, the [CV templates page](/cv-templates) covers the same layouts with those conventions instead.",
    },

    { h2: "Picking the right one" },
    {
      p: "Most people should use **Classic** or **Professional** and spend the saved time on the bullets. Reach for **Technical** if a structured skills block matters, **Executive** if you are leading with scope and P&L, and **Compact** if a dense history has to fit on one page.",
    },
    {
      callout: {
        title: "Switching later costs nothing",
        body: "Content is stored as structured sections, not as a formatted document, so changing template re-renders the same resume in a new layout without retyping a word.",
      },
    },

    { h2: "The template is step one of three" },
    {
      p: "Layout gets you parsed. Bullets get you read. Tailoring gets you the response. [How to write a resume](/how-to-write-a-resume) covers the second, and [tailoring from a job link](/tailor-cv-from-job-link) covers the third in about a minute per application.",
    },
  ],
  related: [
    {
      label: "CV templates",
      href: "/cv-templates",
      body: "The same layouts with UK and European CV conventions.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score the finished resume against the posting you are applying to.",
    },
    {
      label: "Resume tips",
      href: "/resume-tips",
      body: "Twenty-seven specific fixes, ordered by impact.",
    },
  ],
};

export const googleDocsCvTemplate = {
  slug: "google-docs-cv-template",
  seoTitle: "ATS-Friendly Google Docs CV Template",
  description:
    "How to build an ATS-friendly CV in Google Docs: the structure to use, which built-in templates to avoid, and the correct export settings.",
  keywords: [
    "google docs cv template",
    "google docs resume template",
    "ats friendly google docs resume template",
    "free google docs cv template",
    "cv template google docs",
  ],
  eyebrow: "Guide",
  breadcrumbName: "Google Docs CV template",
  h1: "ATS-friendly Google Docs CV template",
  lede:
    "Google Docs is free, works everywhere, and its built-in CV templates are mostly a trap. Here is the structure to build instead (ten minutes, no add-ons) and the export settings that keep it parseable.",
  ctas: [
    { label: "Skip the setup", href: "/cv-templates" },
    { label: "How to write a CV", href: "/how-to-write-a-resume", variant: "secondary" },
  ],
  howTo: {
    name: "How to build an ATS-friendly CV in Google Docs",
    description:
      "Build a single-column, parse-safe CV in Google Docs and export it correctly.",
    steps: [
      {
        name: "Start from a blank document",
        text: "Do not use the built-in CV templates. Several use two-column tables and place contact details in the page header.",
      },
      {
        name: "Set margins and type",
        text: "2cm margins all round, a standard font at 10–11pt for body text, and 1.15 line spacing.",
      },
      {
        name: "Build the sections in order",
        text: "Contact details, summary, experience, skills, education. Each heading styled as Heading 2 using the standard vocabulary.",
      },
      {
        name: "Write bullets with the list tool",
        text: "Use the real bulleted-list button rather than typing dashes, so the structure survives extraction.",
      },
      {
        name: "Export as PDF",
        text: "File → Download → PDF Document. Never print to image, and never use File → Print → Save as PDF from a browser preview.",
      },
    ],
  },
  faqs: [
    {
      q: "Are the built-in Google Docs CV templates ATS-friendly?",
      a: "Mostly not. Several of the stock templates use two-column tables for layout and place the name and contact details in the page header, the two changes most likely to scramble or lose information when the file is parsed. Start from a blank document instead.",
    },
    {
      q: "How do I make a CV in Google Docs?",
      a: "Start blank, set 2cm margins, use Heading 2 for standard section names, write experience bullets with the real list tool, and export with File → Download → PDF Document. The full structure is laid out on this page and takes about ten minutes.",
    },
    {
      q: "Should I send my CV as a Google Docs link?",
      a: "No. Send a PDF attachment unless the application explicitly asks otherwise. A share link can be permission-blocked, is not archivable by the employer's system, and tells them when you opened it.",
    },
    {
      q: "Does exporting from Google Docs keep the text layer?",
      a: "Yes, if you use File → Download → PDF Document. That produces a proper text-based PDF. Printing to an image, screenshotting, or exporting from a browser print preview can strip or degrade the text layer.",
    },
    {
      q: "What font should I use in a Google Docs CV?",
      a: "Any standard system font at 10 to 11pt for body text and 14 to 18pt for your name. Avoid decorative or recently added Google Fonts, which can embed with non-standard character maps and produce garbled text on extraction.",
    },
    {
      q: "Can I tailor a Google Docs CV to each job automatically?",
      a: "Not within Google Docs. You would duplicate the file and edit it by hand each time, which is twenty to forty minutes per application. That is the specific limitation this site exists to remove.",
    },
  ],
  blocks: [
    { h2: "Why not just use the built-in templates" },
    {
      p: "Google Docs ships several CV templates and they are a reasonable starting point visually. The problem is structural: some use a **two-column table** for the layout and put the name and contact block in the **page header**. Those are the two most reliable ways to lose information during parsing: reading order interleaves, and header content is routinely skipped entirely.",
    },
    {
      p: "Ten minutes from a blank document gives you something that looks nearly identical and parses correctly.",
    },

    { h2: "The structure to build" },
    {
      steps: [
        {
          title: "Page setup",
          body: "File → Page setup. Margins 2cm on all sides. Keep the page size as A4 or Letter to match where you are applying.",
        },
        {
          title: "Contact block: in the body",
          body: "First lines of the document, not the header. Name at 16–18pt bold, then a single line: target job title | city | phone | email | LinkedIn URL.",
        },
        {
          title: "Section headings",
          body: "Use the Heading 2 style (not just bold text) for Summary, Experience, Skills, Education. Real heading styles give the document structure that survives export.",
        },
        {
          title: "Experience entries",
          body: "One line per role: Employer - Job Title (Mar 2022 – Present). Then three to six bullets using the bulleted-list button, never typed dashes.",
        },
        {
          title: "Skills",
          body: "Two or three grouped lines of plain text. No tables, no columns, no rating graphics.",
        },
        {
          title: "Export",
          body: "File → Download → PDF Document (.pdf). Open the result and try to select a line of text. If you cannot, something went wrong.",
        },
      ],
    },
    {
      callout: {
        title: "The one thing not to do",
        body: "Do not use Insert → Table to put two things side by side. If you need a job title on the left and dates on the right, put them on one line separated by an en dash or a pipe. Tabs and right-alignment are also safe; tables are not.",
      },
    },

    { h2: "Checking it worked" },
    {
      ol: [
        "Open the exported PDF and select all, then paste into a plain text editor.",
        "Read what arrives: sections in order, contact details present, bullets intact.",
        "If anything is scrambled or missing, the culprit is almost always a table or a header.",
        "Then score the content against a real posting with the [free ATS resume checker](/ats-resume-checker).",
      ],
    },

    { h2: "Where Google Docs runs out" },
    {
      p: "It is genuinely fine for building and storing a master CV. What it cannot do is the per-application work: duplicating the file, rereading the posting, remapping which bullets lead, and rewriting the summary for each role. That is twenty to forty minutes each time, and it is the step almost everyone abandons around application twelve.",
    },
    {
      table: {
        head: ["", "Google Docs", "FitMyCV"],
        rows: [
          ["Build a master CV", "Yes", "Yes"],
          ["Free", "Yes", "Free to build; paid to tailor"],
          ["Switch layout without retyping", "No", "Yes, 16 templates"],
          ["Read a job posting URL", "No", "Yes"],
          ["Rewrite bullets against a posting", "No", "Yes"],
          ["Matching cover letter", "No", "Yes"],
        ],
      },
    },
    {
      p: "If the Google Docs route is enough for you, the structure above is all you need. If the per-application editing is what is stopping you, the [CV templates](/cv-templates) page covers the 16 built-in layouts and [tailoring from a job link](/tailor-cv-from-job-link) covers the part Docs cannot do.",
    },
  ],
  related: [
    {
      label: "CV templates",
      href: "/cv-templates",
      body: "16 ATS-safe layouts with no setup and no table traps.",
    },
    {
      label: "How to write a resume",
      href: "/how-to-write-a-resume",
      body: "What goes in each section once the document is set up.",
    },
    {
      label: "ATS resume checker",
      href: "/ats-resume-checker",
      body: "Score your exported PDF against the posting you are applying to.",
    },
  ],
};
