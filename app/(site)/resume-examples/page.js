import { setRequestLocale } from "next-intl/server";
import ExamplesHub from "@/components/content/ExamplesHub";
import { resumeExamplesHub } from "@/content/pages/examples-hubs";
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

export default function ResumeExamplesPage() {
  setRequestLocale("en");
  return <ExamplesHub hub={resumeExamplesHub} />;
}
