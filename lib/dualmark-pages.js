// Dualmark page map. HTML twins are assembled from the same registries the
// sitemap and /llm.txt already use, so a new blog post or landing page gets a
// markdown twin without a second content file.
import { POSTS } from "@/content/blog";
import { MARKETING_PAGES } from "@/content/pages";
import { ATS_CHECKED_ON, ATS_COMPANIES } from "@/content/ats-companies";
import { UNIVERSAL_RULES } from "@/content/pages/ats";
import { cvExamplesHub, resumeExamplesHub } from "@/content/pages/examples-hubs";
import { atsLookup } from "@/content/pages/job-tools";
import {
  BLOCKS as tailorBlocks,
  FAQS as tailorFaqs,
  HOW_TO as tailorHowTo,
} from "@/content/pages/tailor-cv-from-job-link";
import {
  HOME_FAQS,
  HOME_STEPS,
  HOME_TESTIMONIAL,
  HOME_TESTIMONIALS,
} from "@/content/pages/home";
import { RESUME_EXAMPLES } from "@/content/resume-examples";
import { keywordsPageFor } from "@/content/resume-keywords";
import { ATS_VENDORS, getAtsVendor } from "@/lib/ats-detect";
import { DUALMARK_SITE_URL } from "@/lib/dualmark-config";
import {
  blocksToMarkdown,
  faqsToMarkdown,
  howToMarkdown,
  joinMarkdown,
} from "@/lib/blocks-to-markdown";
import { PRICING } from "@/lib/pricing";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";
import landing from "@/messages/en/landing.json";
import pages from "@/messages/en/pages.json";

function fill(template, vars) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

function pageHead(title, description, path) {
  return joinMarkdown(
    `# ${title}`,
    description ? `> ${description}` : "",
    `- **URL**: ${SITE_URL}${path}`,
    "---",
  );
}

function relatedMarkdown(related = []) {
  if (!related.length) return "";
  const items = related.map((item) => {
    const href = item.href || item.path || "";
    const label = item.label || item.title || href;
    const body = item.body ? `: ${item.body}` : "";
    return `- [${label}](${href})${body}`;
  });
  return `## Related\n\n${items.join("\n")}`;
}

function exampleListMarkdown() {
  return RESUME_EXAMPLES.map(
    (example) =>
      `- [${example.role} resume example](${SITE_URL}/resume-examples/${example.slug}): ${example.blurb}`,
  ).join("\n");
}

function renderContentPage(page, path = `/${page.slug}`) {
  const ctas = (page.ctas ?? [])
    .filter((cta) => cta.href && !cta.href.startsWith("#"))
    .map((cta) => `- [${cta.label}](${cta.href})`)
    .join("\n");

  return joinMarkdown(
    pageHead(page.h1 || page.seoTitle, page.lede || page.description, path),
    howToMarkdown(page.howTo),
    blocksToMarkdown(page.blocks),
    ctas ? `## Next step\n\n${ctas}` : "",
    relatedMarkdown(page.related),
    faqsToMarkdown(page.faqs),
  );
}

function renderHub(hub, extra) {
  return joinMarkdown(
    pageHead(hub.h1, hub.lede, `/${hub.slug}`),
    extra,
    blocksToMarkdown(hub.blocks),
    faqsToMarkdown(hub.faqs),
  );
}

function renderHome() {
  const heroTitle = landing.hero.titleMain.replace(/<\/?accent>/g, "");
  const steps = HOME_STEPS.map(
    (step, i) => `${i + 1}. **${step.title}.** ${step.copy}`,
  ).join("\n");
  const quotes = [HOME_TESTIMONIAL, ...HOME_TESTIMONIALS].map(
    (item) =>
      `> ${item.quote}\n>\n> ${item.author}${item.role ? `, ${item.role}` : ""}`,
  ).join("\n\n");
  const trust = Object.values(landing.trust.signals)
    .map((signal) => `- **${signal.title}.** ${signal.body}`)
    .join("\n");

  return joinMarkdown(
    pageHead("FitMyCV", landing.meta.description, "/"),
    heroTitle,
    landing.hero.body,
    `## How it works\n\n${steps}`,
    `## ${landing.problem.title}\n\n${landing.problem.body}\n\n${landing.problem.footer}`,
    `## ${landing.trust.title}\n\n${landing.trust.body}\n\n${trust}\n\n${landing.trust.methodBody}`,
    `## ${landing.testimonial.heading}\n\n${quotes}`,
    faqsToMarkdown(HOME_FAQS),
    `[Tailor my CV](${SITE_URL}/auth) · [Pricing](${SITE_URL}/pricing) · [How job-link tailoring works](${SITE_URL}/tailor-cv-from-job-link)`,
  );
}

function renderPricing() {
  const vars = {
    lifetime: `$${PRICING.lifetime.price}`,
    month: `$${PRICING.month.price}`,
    price: `$${PRICING.lifetime.price}`,
  };
  const copy = pages.pricingPage;
  const features = pages.pricingCards.features.map((item) => `- ${item}`).join("\n");
  const faqs = Object.values(copy.faqs).map(({ q, a }) => ({
    q,
    a: fill(a, vars),
  }));

  return joinMarkdown(
    pageHead(copy.title, fill(copy.intro, vars), "/pricing"),
    `| Plan | Price | Notes |\n| --- | --- | --- |\n| ${pages.pricingCards.plans.month.label} | **${vars.month}**/month | ${pages.pricingCards.plans.month.subline} |\n| ${pages.pricingCards.plans.lifetime.label} | **${vars.lifetime}** once | ${pages.pricingCards.plans.lifetime.subline} |`,
    `## ${pages.pricingCards.includesTitle}\n\n${features}`,
    faqsToMarkdown(faqs, copy.faqTitle),
    `[Get started](${SITE_URL}/auth)`,
  );
}

function renderTailorPage() {
  const copy = pages.tailorCvFromJobLink;
  const title = `${copy.titleStart} ${copy.titleHighlight}`;
  const benefits = Object.values(copy.benefits)
    .map((item) => `- **${item.title}.** ${item.body}`)
    .join("\n");

  return joinMarkdown(
    pageHead(title, copy.intro, "/tailor-cv-from-job-link"),
    `## ${copy.benefitsTitle}\n\n${copy.benefitsIntro}\n\n${benefits}`,
    howToMarkdown(tailorHowTo),
    blocksToMarkdown(tailorBlocks),
    faqsToMarkdown(tailorFaqs, copy.faqHeading),
    `[Tailor my CV](${SITE_URL}/auth)`,
  );
}

function renderSupport() {
  return joinMarkdown(
    pageHead(
      "How can we help?",
      "Browse common topics below, or reach our team directly. We usually reply within one business day.",
      "/support",
    ),
    `## Email our support team\n\nQuestions about your account, billing, or a tailored CV? Send a message to [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}).`,
    `## Popular help topics\n\n- [Tailoring your CV from a job link](${SITE_URL}/tailor-cv-from-job-link): Learn how to paste a job link and get a CV and cover letter matched to the role.\n- [Plans and billing](${SITE_URL}/pricing): See what Premium includes, how pricing works, and how to cancel anytime.\n- [Free ATS resume checker](${SITE_URL}/ats-resume-checker): Score your CV against a job description and see which required terms are missing.\n- [Guides and resume examples](${SITE_URL}/blog): How ATS parsing works, how to tailor a CV, and worked examples for fourteen roles.`,
  );
}

function renderJobs() {
  return joinMarkdown(
    pageHead(
      "Remote jobs, straight from the source.",
      "New roles twice a day, pulled straight from company career pages.",
      "/jobs",
    ),
    "Remote jobs pulled from company career pages twice a day, posted by the employer, not an aggregator. Find a role, then tailor your CV to it in one click.",
    `[Browse remote jobs](${SITE_URL}/jobs) · [Tailor a CV from a job link](${SITE_URL}/tailor-cv-from-job-link)`,
  );
}

function renderPrivacy() {
  return joinMarkdown(
    pageHead(
      "Privacy Policy",
      "How FitMyCV collects, uses, and protects your data, including your CV content, Google account details, and payment information.",
      "/privacy-policy",
    ),
    "Last updated: June 14, 2026",
    "FitMyCV (\"we\", \"us\", or \"our\") helps you tailor your CV and cover letter to specific job listings. This Privacy Policy explains what information we collect when you use FitMyCV, how we use it, and the choices you have. By using FitMyCV you agree to the practices described here.",
    `## Information we collect\n\nWe collect the following categories of information:\n\n- **Account information.** When you sign in with Google, we receive your name, email address, and profile picture from your Google account.\n- **CV content.** The reference CV you upload and the text extracted from it, which we store so we can tailor it to the jobs you choose.\n- **Job listings.** The job links you paste and the requirements scraped from those pages.\n- **Generated documents.** The tailored CVs and cover letters we create for you.\n- **Payment information.** When you subscribe, payments are processed by our payment provider, Polar. We receive your subscription status but never see or store your full card details.\n- **Usage data.** Basic analytics about how you use the app, collected via PostHog and Vercel Analytics, to help us improve the product.`,
    `## How we use your information\n\n- To provide and operate the FitMyCV service.\n- To generate tailored CVs and cover letters from your reference CV and the job links you provide.\n- To manage your account, subscription, and billing.\n- To send you product and account communications, including optional job-match emails.\n- To analyze and improve the performance and reliability of the app.`,
    `## AI processing\n\nTo generate your documents, we send the relevant text (such as your CV content and the scraped job requirements) to third-party AI providers including OpenAI, Groq, and Exa.ai. These providers process the text on our behalf to extract requirements and produce your tailored CV and cover letter. We do not sell your personal information.`,
    `## Third parties we share data with\n\nWe share data only with the service providers that make FitMyCV work, including:\n\n- Google (authentication).\n- OpenAI, Groq, and Exa.ai (AI processing and scraping).\n- Polar (payments and subscriptions).\n- MongoDB (database hosting) and Vercel (app hosting).\n- PostHog and Vercel Analytics (product analytics).`,
    `## Data retention\n\nWe keep your information for as long as your account is active or as needed to provide the service. You can ask us to delete your account and associated data at any time by contacting us.`,
    `## Your rights\n\nYou can request access to, correction of, or deletion of your personal data. To exercise these rights, email us at [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}).`,
    `## Cookies\n\nWe use cookies and similar technologies to keep you signed in and to understand how the app is used. You can control cookies through your browser settings, though some features may not work without them.`,
    `## Security\n\nWe use industry-standard measures to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.`,
    `## Children\n\nFitMyCV is not intended for anyone under the age of 16, and we do not knowingly collect data from children.`,
    `## Changes to this policy\n\nWe may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date above. Continued use of FitMyCV after changes means you accept the updated policy.`,
    `## Contact us\n\nIf you have any questions about this Privacy Policy, contact us at [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}).`,
  );
}

function renderTerms() {
  return joinMarkdown(
    pageHead(
      "Terms and Conditions",
      "The terms that govern your use of FitMyCV, including subscriptions, billing, acceptable use, and our AI-generated content disclaimer.",
      "/terms-and-conditions",
    ),
    "Last updated: June 14, 2026",
    "These Terms and Conditions (\"Terms\") govern your access to and use of FitMyCV. By creating an account or using the service, you agree to these Terms. If you do not agree, please do not use FitMyCV.",
    `## 1. The service\n\nFitMyCV lets you upload a reference CV, paste a job link, and receive a CV and cover letter tailored to that role using AI-powered tools. We may change, suspend, or discontinue any part of the service at any time.`,
    `## 2. Your account\n\nYou sign in with Google and are responsible for activity that happens under your account. You must provide accurate information and keep your account secure. You must be at least 16 years old to use FitMyCV.`,
    `## 3. Subscriptions and billing\n\n- FitMyCV Premium is offered at $${PRICING.month.price} per month or $${PRICING.lifetime.price} for lifetime access, billed through our payment provider, Polar.\n- If prices change, your existing subscription keeps the rate you signed up at. New prices apply to new purchases only.\n- Subscriptions renew automatically at the end of each billing period unless you cancel beforehand.\n- You can cancel at any time and will retain access until the end of your current billing period.\n- Except where required by law, payments are non-refundable.`,
    `## 4. Acceptable use\n\nYou agree not to misuse FitMyCV. In particular, you will not:\n\n- Upload content you do not have the right to use, or submit false or misleading information in your CV.\n- Use the service for unlawful purposes or to infringe the rights of others.\n- Attempt to disrupt, reverse-engineer, or gain unauthorized access to the service.`,
    `## 5. AI-generated content\n\nFitMyCV uses AI to generate tailored CVs and cover letters. AI output can contain inaccuracies, so you are responsible for reviewing and editing every document before you use it. We do not guarantee any particular outcome, including interviews or job offers, and the generated content does not constitute professional career advice.`,
    `## 6. Intellectual property\n\nYou retain ownership of the CV content you upload and the documents generated for you. FitMyCV and its branding, software, and design remain our property. You may use generated documents for your own job applications.`,
    `## 7. Third-party services\n\nFitMyCV relies on third-party providers such as Google, Polar, OpenAI, Groq, and Exa.ai. Your use of the service may also be subject to their terms, and we are not responsible for the content of external job listings you choose to submit.`,
    `## 8. Disclaimers and limitation of liability\n\nFitMyCV is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.`,
    `## 9. Termination\n\nWe may suspend or terminate your access if you violate these Terms. You may stop using FitMyCV and request deletion of your account at any time.`,
    `## 10. Changes to these terms\n\nWe may update these Terms from time to time. When we do, we will revise the "Last updated" date above. Continued use of FitMyCV after changes means you accept the updated Terms.`,
    `## 11. Contact us\n\nIf you have any questions about these Terms, contact us at [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}).`,
  );
}

function renderAtsHub() {
  const groups = ATS_VENDORS.map((vendor) => ({
    vendor,
    companies: ATS_COMPANIES.filter((company) => company.ats === vendor.id),
  })).filter((group) => group.companies.length);

  const directory = groups
    .map(({ vendor, companies }) => {
      const links = companies
        .map(
          (company) =>
            `- [${company.name}](${SITE_URL}/ats/${company.slug})`,
        )
        .join("\n");
      return `### ${vendor.name}\n\n${links}`;
    })
    .join("\n\n");

  return joinMarkdown(
    renderContentPage(atsLookup, "/ats"),
    `## Companies we have checked\n\nEach company below has a job board on the hiring system's own website. Open one to see the board and what it means for your CV.\n\n${directory}`,
  );
}

function boardLabel(url) {
  return url.replace(/^https:\/\//, "").replace(/\/$/, "");
}

function renderAtsCompany(company) {
  const vendor = getAtsVendor(company.ats);
  const checkedOn = new Date(`${ATS_CHECKED_ON}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
  const faqs = [
    {
      q: `What ATS does ${company.name} use?`,
      a: `${company.name} posts its jobs on ${vendor.name}. Its job board is at ${boardLabel(company.evidenceUrl)}, which is on ${vendor.name}'s own website.`,
    },
    {
      q: `Does every ${company.name} job go through ${vendor.name}?`,
      a: `Not always. Large companies sometimes use a different system for some countries or for campus hiring. Paste the link of the exact job into the ATS lookup to check it.`,
    },
    {
      q: `How should I format my CV for ${vendor.name}?`,
      a: "Use one column, standard headings, real text rather than images, and the words the posting uses. The rules on this page apply to every applicant tracking system.",
    },
  ];
  const peers = ATS_COMPANIES.filter(
    (item) => item.ats === company.ats && item.slug !== company.slug,
  ).slice(0, 8);
  const guideLabel =
    vendor.guide === "/blog/ats-resume-guide"
      ? "ATS resume guide"
      : `${vendor.name} CV guide`;

  return joinMarkdown(
    pageHead(
      `Which ATS does ${company.name} use?`,
      `${company.name} posts its jobs on ${vendor.name}.`,
      `/ats/${company.slug}`,
    ),
    `${company.name}'s job board is at [${boardLabel(company.evidenceUrl)}](${company.evidenceUrl}), on ${vendor.name}'s own website. We checked it on ${checkedOn} and it had open jobs.`,
    `Checking a different ${company.name} job? Paste its link into the [ATS lookup](${SITE_URL}/ats).`,
    `## Format your CV so ${vendor.name} can read it\n\n${vendor.name} turns your CV file into text before anyone reads it. These rules keep that text in the right order.\n\n${UNIVERSAL_RULES.map((rule) => `- ${rule}`).join("\n")}\n\nMore detail is in the [${guideLabel}](${vendor.guide}).`,
    `## Applying to ${company.name}?\n\nPaste the job link and FitMyCV rewrites your own CV in one column, using that posting's words.\n\n[Tailor my CV](${SITE_URL}/tailor-cv-from-job-link)`,
    faqsToMarkdown(faqs, `${company.name} ATS FAQ`),
    peers.length
      ? `## Other companies on ${vendor.name}\n\n${peers.map((item) => `- [${item.name}](${SITE_URL}/ats/${item.slug})`).join("\n")}`
      : "",
  );
}

function resumeExampleFaqs(example) {
  return [
    ...(example.faqs || []),
    {
      q: `What should a ${example.role.toLowerCase()} resume include?`,
      a: `A three-line summary naming the role and one strong result, reverse-chronological experience with achievement bullets that each carry a number, a grouped skills section, and education or registrations. Everything on the page should answer the posting you are applying to.`,
    },
    {
      q: `How long should a ${example.role.toLowerCase()} CV be?`,
      a: "One page under roughly eight years of experience and two beyond that. Relevance matters more than length. A second page of unrelated history is worse than a single page that is entirely on target.",
    },
    {
      q: `What keywords do ${example.role.toLowerCase()} job postings use?`,
      a: "Take them from the specific posting rather than from a generic list. Recruiters search literal strings and different employers use different vocabulary for the same work. The keywords listed on this page are a starting point, not a substitute for reading the advert.",
    },
    {
      q: "Can I copy this resume example directly?",
      a: "Use the structure, not the sentences. A CV that is a copied example describes someone else's career, and interviews expose that immediately. Copy the shape of the bullets (verb, specific action, measurable result) and fill them with your own work.",
    },
  ];
}

function renderResumeExample(example) {
  const bullets = example.bullets
    .map(
      ({ before, after }) =>
        `**Before**\n\n${before}\n\n**After**\n\n${after}`,
    )
    .join("\n\n");
  const keywordsPage = keywordsPageFor(example.slug);
  const keywordLink = keywordsPage
    ? `A longer list, grouped by where each term belongs on the page, is on [${keywordsPage.role.toLowerCase()} resume keywords](${SITE_URL}/${keywordsPage.slug}).`
    : "";

  return joinMarkdown(
    pageHead(
      `${example.role} resume example`,
      example.intro,
      `/resume-examples/${example.slug}`,
    ),
    `## The professional summary\n\nThree lines, written last. Name the target title, the level and domain, and one result strong enough to earn the next paragraph.\n\n${example.summary}`,
    `## Experience bullets, rewritten\n\nSame work, described so a hiring manager can tell what you actually did. Every rewrite follows the same shape: verb, specific action, measurable result.\n\n${bullets}`,
    `## The skills section\n\nGrouped rather than one long comma-separated wall. Everything here should also appear inside a bullet above, where it has evidence attached.\n\n${example.skills.map((line) => `- ${line}`).join("\n")}`,
    `## Keywords these postings lean on\n\nA starting point, not a substitute for reading the advert. Take the exact vocabulary from the posting in front of you.\n\n${example.keywords.map((keyword) => `- ${keyword}`).join("\n")}${keywordLink ? `\n\n${keywordLink}` : ""}`,
    example.tip ? `## Tip\n\n${example.tip}` : "",
    faqsToMarkdown(resumeExampleFaqs(example)),
  );
}

function blogBody(post) {
  return joinMarkdown(
    blocksToMarkdown(post.blocks),
    faqsToMarkdown(post.faqs),
  );
}

export function getDualmarkRouteConfig() {
  return {
    siteUrl: DUALMARK_SITE_URL,
    collections: {
      blog: {
        converter: "blog",
        getEntries: () =>
          POSTS.map((post) => ({
            id: post.meta.slug,
            data: {
              title: post.meta.title,
              description: post.meta.description,
              publishedDate: new Date(post.meta.date),
              modifiedDate: new Date(post.meta.updated || post.meta.date),
              category: post.meta.category,
            },
            body: blogBody(post),
          })),
        listingMetadata: {
          title: "Blog",
          description:
            "Guides on CVs, cover letters, ATS optimization, and job applications.",
        },
        sort: (a, b) =>
          new Date(b.data.publishedDate) - new Date(a.data.publishedDate),
      },
    },
    staticPages: [
      { pattern: "/", render: renderHome },
      { pattern: "/pricing", render: renderPricing },
      { pattern: "/tailor-cv-from-job-link", render: renderTailorPage },
      { pattern: "/support", render: renderSupport },
      { pattern: "/jobs", render: renderJobs },
      { pattern: "/privacy-policy", render: renderPrivacy },
      { pattern: "/terms-and-conditions", render: renderTerms },
      {
        pattern: "/resume-examples",
        render: () =>
          renderHub(
            resumeExamplesHub,
            `## Examples\n\n${exampleListMarkdown()}`,
          ),
      },
      {
        pattern: "/cv-examples",
        render: () =>
          renderHub(cvExamplesHub, `## Examples\n\n${exampleListMarkdown()}`),
      },
      { pattern: "/ats", render: renderAtsHub },
      ...MARKETING_PAGES.map((page) => ({
        pattern: `/${page.slug}`,
        render: () => renderContentPage(page),
      })),
      ...RESUME_EXAMPLES.map((example) => ({
        pattern: `/resume-examples/${example.slug}`,
        render: () => renderResumeExample(example),
      })),
      ...ATS_COMPANIES.map((company) => ({
        pattern: `/ats/${company.slug}`,
        render: () => renderAtsCompany(company),
      })),
    ],
  };
}
