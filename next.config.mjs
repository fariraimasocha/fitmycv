import { withDualmark } from "@dualmark/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import { SITE_URL } from "./lib/site.js";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Three root layouts (app/[locale], app/(site), app/(app)) leave no single
    // layout for unmatched URLs, so app/global-not-found.js renders those.
    globalNotFound: true,
    optimizePackageImports: [
      "@phosphor-icons/react",
      "radix-ui",
      "motion",
    ],
  },
  async redirects() {
    return [
      // Posts removed Dec 2026 for zero Search Console clicks in 90 days.
      // Each points at the closest live page so old links still land somewhere useful.
      { source: "/blog/why-am-i-not-getting-interviews", destination: "/blog/tips-for-tailoring-a-cv-to-specific-jobs", permanent: true },
      { source: "/blog/ats-resume-format", destination: "/blog/ats-resume-guide", permanent: true },
      { source: "/blog/how-to-get-a-remote-job", destination: "/blog", permanent: true },
      { source: "/blog/how-to-find-resume-keyword-gaps", destination: "/blog/how-to-check-resume-against-job-description", permanent: true },
      { source: "/blog/how-to-explain-employment-gap-on-cv", destination: "/employment-gap-explanation-generator", permanent: true },
      { source: "/blog/skills-to-put-on-a-resume", destination: "/resume-keywords", permanent: true },
      { source: "/blog/career-change-cv", destination: "/blog", permanent: true },
      { source: "/blog/how-to-tailor-cv-to-job-description", destination: "/blog/tips-for-tailoring-a-cv-to-specific-jobs", permanent: true },
      { source: "/blog/how-to-follow-up-on-a-job-application", destination: "/blog/how-to-email-a-job-application", permanent: true },
      { source: "/blog/how-to-tailor-a-resume-for-a-specific-job", destination: "/blog/tips-for-tailoring-a-cv-to-specific-jobs", permanent: true },
      { source: "/blog/cover-letter-from-job-description", destination: "/ai-cover-letter-generator", permanent: true },
      { source: "/blog/cover-letter-with-no-experience", destination: "/ai-cover-letter-generator", permanent: true },
      { source: "/blog/cv-professional-summary-examples", destination: "/professional-summary-generator", permanent: true },
      { source: "/blog/how-much-should-you-tailor-your-resume", destination: "/blog/tips-for-tailoring-a-cv-to-specific-jobs", permanent: true },
      { source: "/blog/how-long-should-a-cv-be", destination: "/cv-format-checker", permanent: true },
      { source: "/blog/does-tailoring-your-resume-actually-work", destination: "/blog/tips-for-tailoring-a-cv-to-specific-jobs", permanent: true },
      { source: "/blog/cv-vs-resume-difference", destination: "/blog", permanent: true },
      { source: "/blog/how-many-jobs-should-i-apply-to", destination: "/blog", permanent: true },
      { source: "/blog/how-to-match-resume-to-job-description", destination: "/blog/tips-for-tailoring-a-cv-to-specific-jobs", permanent: true },
      { source: "/blog/what-is-a-resume-match-score", destination: "/blog/how-to-check-resume-against-job-description", permanent: true },
      { source: "/blog/best-ai-resume-builders-2026", destination: "/blog/best-ai-resume-tailoring-tools-2026", permanent: true },
      { source: "/blog/cv-with-no-experience", destination: "/blog", permanent: true },
      {
        source: "/",
        has: [{ type: "host", value: "^fitmycv\\.link$" }],
        destination: "https://www.fitmycv.link/",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "^fitmycv\\.link$" }],
        destination: "https://www.fitmycv.link/:path+",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/llms.txt", destination: "/llm.txt" }];
  },
  async headers() {
    return [
      {
        // AEO Spec md.vary: markdown twins must advertise that the
        // representation depends on Accept. Next overwrites Vary on
        // prerendered RSC responses, so this is a second layer for .md URLs.
        source: "/index.md",
        headers: [{ key: "Vary", value: "Accept" }],
      },
      {
        source: "/:path*.md",
        headers: [{ key: "Vary", value: "Accept" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://datafa.st https://app.chatwoot.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https: wss: https://datafa.st",
              "frame-src https://app.chatwoot.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default withDualmark(withNextIntl(nextConfig), {
  siteUrl: SITE_URL,
});
