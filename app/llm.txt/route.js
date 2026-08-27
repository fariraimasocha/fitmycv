// Serves /llm.txt — an llms.txt-style summary of the site for AI crawlers and
// assistants. Built from the same content registries as the sitemap, so new
// blog posts, marketing pages, and resume examples appear automatically.
import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/content/blog";
import { MARKETING_PAGES } from "@/content/pages";
import { RESUME_EXAMPLES } from "@/content/resume-examples";

export const dynamic = "force-static";

function link(path, title, description) {
  return `- [${title}](${SITE_URL}${path})${description ? `: ${description}` : ""}`;
}

export function GET() {
  const marketingLinks = MARKETING_PAGES.map((page) =>
    link(`/${page.slug}`, page.seoTitle, page.description)
  );

  const exampleLinks = RESUME_EXAMPLES.map((example) =>
    link(`/resume-examples/${example.slug}`, `${example.role} resume example`, example.blurb)
  );

  const blogLinks = POSTS.map((post) =>
    link(`/blog/${post.meta.slug}`, post.meta.title, post.meta.description)
  );

  const body = `# FitMyCV

> FitMyCV tailors your CV and cover letter to any job in seconds. Paste a job link, and it reads the requirements, rewrites your CV to match with AI-powered keyword matching and ATS optimization, generates a matching cover letter, and exports everything as clean PDFs. Every tailored CV includes a match score and an ATS score.

FitMyCV Premium costs $6.99/month or $16.99 for lifetime access (pay once, keep it forever) and includes unlimited tailored CVs and cover letters, match and ATS scores, interview prep with company research and outreach, daily job matches by email, and PDF export. Cancel monthly anytime; payments are processed by Polar.

## Key pages

${link("", "Home", "Tailor your CV from a job link in seconds.")}
${link("/tailor-cv-from-job-link", "Tailor CV from a job link", "How the core product works: paste a job URL, get a tailored CV and cover letter.")}
${link("/pricing", "Pricing", "Plans, what's included, and billing FAQ.")}
${link("/resume-examples", "Resume examples", "Job-specific resume examples with rewritten bullets and keywords.")}
${link("/blog", "Blog", "Guides on CVs, cover letters, ATS optimization, and job applications.")}
${link("/support", "Support", "Contact and help.")}

## Tools and landing pages

${marketingLinks.join("\n")}

## Resume examples

${exampleLinks.join("\n")}

## Blog

${blogLinks.join("\n")}

## Legal

${link("/privacy-policy", "Privacy policy")}
${link("/terms-and-conditions", "Terms and conditions")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
