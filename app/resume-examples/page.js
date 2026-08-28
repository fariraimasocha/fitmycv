import ExamplesHub from "@/components/content/ExamplesHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: "Resume Examples for 14 Jobs (2026) | FitMyCV",
  description:
    "Resume examples for fourteen common roles, each with a worked professional summary, before-and-after bullets, a skills section, and the right keywords.",
  path: "/resume-examples",
  keywords: [
    "resume examples",
    "resume samples",
    "resume example 2026",
    "job specific resume examples",
    "professional resume examples",
  ],
});

const hub = {
  slug: "resume-examples",
  breadcrumbName: "Resume examples",
  eyebrow: "Examples",
  h1: "Resume examples for fourteen jobs",
  lede:
    "Not template galleries, but worked examples. Each one shows the summary, the bullets rewritten from a weak version to a strong one, the skills block, and the vocabulary those postings actually search for.",
  blocks: [
    { h2: "How to use these examples" },
    {
      p: "Copy the **structure**, never the sentences. A CV assembled from someone else's examples describes someone else's career, and the first competent interview question exposes it. What transfers is the shape.",
    },
    {
      ol: [
        "**Read the before-and-after bullets first.** The gap between the two is the whole lesson: same work, one version describing a job description and one describing a person.",
        "**Copy the bullet shape.** Verb, specific action, measurable result. Every rewrite on every example page follows it.",
        "**Write your summary last.** It is much easier once the experience section exists and you can see which result is strongest.",
        "**Then tailor to the actual posting.** These examples are generic by necessity; the posting in front of you is not.",
      ],
    },
    {
      callout: {
        title: "The numbers are the hard part",
        body: "Most people can write the verb and the action from memory and stall on the result. Old dashboards, performance reviews, and handover documents are where those numbers live. Spend twenty minutes there before you start writing.",
      },
    },

    { h2: "What every example has in common" },
    {
      ul: [
        "A summary that names the target title, the level, and one result, never a list of adjectives.",
        "Bullets that end in a number, or in scope where no number honestly exists.",
        "A grouped skills section where every entry also appears as evidence in a bullet.",
        "Single-column, standard headings, nothing that scrambles when the file is parsed.",
      ],
    },
    {
      p: "The reasoning behind the last point is in the [ATS-friendly resume guide](/blog/ats-resume-guide), and [how to write a resume](/how-to-write-a-resume) covers building one from a blank page.",
    },

    { h2: "From example to application" },
    {
      p: "An example gets you a solid master CV. What earns responses is the next step: reordering and rewording it for each posting so the matching evidence leads and the vocabulary matches. That takes twenty to forty minutes per role by hand. The [tailoring guide](/blog/how-to-tailor-cv-to-job-description) is the method, and [tailoring from a job link](/tailor-cv-from-job-link) does the first pass in about a minute.",
    },
    {
      cta: {
        title: "Tailor your CV to a real posting",
        body: "Paste the job link and see your own experience rewritten against that specific role.",
        href: "/tailor-cv-from-job-link",
        label: "Tailor my CV",
      },
    },
  ],
  faqs: [
    {
      q: "Are these resume examples free to use?",
      a: "Yes. Every example page is free to read and there is no sign-up. Use the structure and the bullet shape; write the content from your own experience.",
    },
    {
      q: "Should I copy a resume example word for word?",
      a: "No. Copied bullets describe achievements you cannot defend, and interviewers probe exactly the numbers that look strongest. Copy the pattern (verb, specific action, measurable result) and fill it with your own work.",
    },
    {
      q: "What is the difference between a resume example and a resume template?",
      a: "A template is the layout: margins, headings, typography. An example is the content: what to actually write in each section and how to phrase it. You need both, and the [templates page](/resume-templates) covers the layout side.",
    },
    {
      q: "Which resume example should I use if my job is not listed?",
      a: "Pick the closest function rather than the closest job title. A support team lead learns more from the customer service example than from a generic management one, because the bullet shape and the available metrics are what transfer.",
    },
    {
      q: "Do these examples work outside the US?",
      a: "The bullet structure is universal. Conventions around length, photos, and personal details are not. The [CV examples page](/cv-examples) covers UK and European conventions, and the [resume templates page](/resume-templates) covers US ones.",
    },
  ],
};

export default function ResumeExamplesPage() {
  return <ExamplesHub hub={hub} />;
}
