import Link from "next/link";

import MarketingPage from "@/components/content/MarketingPage";
import { atsLookup } from "@/content/pages/job-tools";
import { ATS_COMPANIES } from "@/content/ats-companies";
import { ATS_VENDORS } from "@/lib/ats-detect";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: `${atsLookup.seoTitle} | FitMyCV`,
  description: atsLookup.description,
  path: "/ats",
  keywords: atsLookup.keywords,
});

// Vendors in ATS_VENDORS order, each with the companies we have a page for.
const groups = ATS_VENDORS.map((vendor) => ({
  vendor,
  companies: ATS_COMPANIES.filter((c) => c.ats === vendor.id),
})).filter((g) => g.companies.length);

export default function AtsLookupPage() {
  return (
    <MarketingPage page={atsLookup}>
      <section className="px-5 pb-4 pt-14 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="landing-section-title text-2xl sm:text-3xl">Companies we have checked</h2>
          <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
            Each company below has a job board on the hiring system&apos;s own website. Open one to see the board
            and what it means for your CV.
          </p>
          <div className="mt-8 flex flex-col gap-8">
            {groups.map(({ vendor, companies }) => (
              <div key={vendor.id}>
                <h3 className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">{vendor.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {companies.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/ats/${c.slug}`}
                        className="inline-block rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3.5 py-1.5 text-sm font-bold text-[var(--landing-ink)] hover:border-[var(--landing-primary)]"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
