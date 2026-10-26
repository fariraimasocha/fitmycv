import { setRequestLocale } from "next-intl/server";
import ExamplesHub from "@/components/content/ExamplesHub";
import { cvExamplesHub } from "@/content/pages/examples-hubs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: "CV Examples for 14 Jobs (UK, 2026) | FitMyCV",
  description:
    "CV examples for fourteen roles with UK conventions: two-page length, no photo, personal statement structure, and the keywords UK job adverts actually use.",
  path: "/cv-examples",
  keywords: [
    "cv examples",
    "cv examples uk",
    "cv sample",
    "professional cv examples",
    "cv example 2026",
  ],
});

export default function CvExamplesPage() {
  setRequestLocale("en");
  return <ExamplesHub hub={cvExamplesHub} />;
}
