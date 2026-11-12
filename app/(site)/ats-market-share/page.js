import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { CaretRightIcon, DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import study from "@/data/ats-study-sp500.json";
import { ATS_COMPANIES } from "@/content/ats-companies";
import { getAtsVendor } from "@/lib/ats-detect";
import { SITE_URL } from "@/lib/site";
import { articleSchema, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

const PATH = "/ats-market-share";
const { checkedOn, companies } = study;
const total = companies.length;
const found = companies.filter((c) => c.ats);
const pct = (n, of = total) => Math.round((n / of) * 100);
const checkedLabel = new Date(`${checkedOn}T00:00:00Z`).toLocaleDateString("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Vendors by company count, largest first.
const vendors = Object.entries(
  found.reduce((acc, c) => ({ ...acc, [c.ats]: (acc[c.ats] ?? 0) + 1 }), {})
)
  .map(([id, count]) => ({ ...getAtsVendor(id), count }))
  .sort((a, b) => b.count - a.count);
const top = vendors[0];

// For each sector: companies, how many we tied to a vendor, and the leader.
const sectors = Object.entries(
  companies.reduce((acc, c) => {
    (acc[c.sector] ??= []).push(c);
    return acc;
  }, {})
)
  .map(([sector, rows]) => {
    const counts = rows.filter((r) => r.ats).reduce((acc, r) => ({ ...acc, [r.ats]: (acc[r.ats] ?? 0) + 1 }), {});
    const [leaderId, leaderCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [];
    return { sector, total: rows.length, leader: leaderId ? getAtsVendor(leaderId) : null, leaderCount };
  })
  .sort((a, b) => b.total - a.total);

const companyPage = new Map(ATS_COMPANIES.map((c) => [c.name.toLowerCase(), c.slug]));
const pageFor = (name) => companyPage.get(name.replace(/,? Inc\.?$|\s*\(.*\)$/i, "").toLowerCase());

const TITLE = `Which ATS Do S&P 500 Companies Use? (${checkedOn.slice(0, 4)} Data)`;
const DESCRIPTION = `We checked the job boards of all ${total} S&P 500 companies. ${top.name} runs ${top.count} of them. See the full list, each sector's leader, and the method.`;

export const metadata = pageMetadata({
  absoluteTitle: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "ats market share",
    "which ats do companies use",
    "most popular applicant tracking systems",
    "workday market share",
    "s&p 500 applicant tracking systems",
    "ats statistics",
  ],
});

const faqs = [
  {
    q: "Which applicant tracking system do most large companies use?",
    a: `${top.name}. Of the ${total} S&P 500 companies we checked in ${checkedLabel}, ${top.count} have a job board on ${top.name}, which is ${pct(top.count)}% of the index.`,
  },
  {
    q: "How did you work out which ATS a company uses?",
    a: "We searched each company's name across the job board domains of 17 ATS vendors and kept a result only when the board's own address named the company. Every claim on this page links to that board, so you can check it yourself.",
  },
  {
    q: "Why do some companies show no ATS?",
    a: "Some run their own hiring system, some hide the vendor behind their own careers domain, and some boards did not show up in search. A blank means we could not tie the company to a vendor, not that it has none.",
  },
  {
    q: "Can I use this data?",
    a: "Yes. Download the CSV below and link to this page as the source.",
  },
];

function Bar({ label, count, href }) {
  // Same base as the label: share of every company checked.
  const width = `${Math.max(pct(count), 1)}%`;
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        {href ? (
          <Link href={href} className="font-bold text-[var(--landing-ink)] underline-offset-4 hover:underline">
            {label}
          </Link>
        ) : (
          <span className="font-bold text-[var(--landing-ink)]">{label}</span>
        )}
        <span className="tabular-nums text-[var(--landing-ink-soft)]">
          {count} {count === 1 ? "company" : "companies"}, {pct(count) ? `${pct(count)}%` : "under 1%"}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-[var(--landing-paper-soft)]">
        <div className="h-2.5 rounded-full bg-[var(--landing-primary)]" style={{ width }} />
      </div>
    </li>
  );
}

export default function AtsMarketSharePage() {
  setRequestLocale("en");
  const notFound = total - found.length;

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main dir="ltr">
        <section className="relative isolate overflow-hidden px-5 pb-10 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
            >
              <Link href="/" className="hover:text-[var(--landing-ink)]">Home</Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <Link href="/ats" className="hover:text-[var(--landing-ink)]">ATS lookup</Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <span className="text-[var(--landing-ink)]">S&amp;P 500 study</span>
            </nav>
            <h1
              className="font-serif-display mt-6 font-normal leading-[1.04] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}
            >
              Which ATS do S&amp;P 500 companies use?
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
              We checked the job boards of all {total} companies in the S&amp;P 500 in {checkedLabel}.{" "}
              {found.length} of them ({pct(found.length)}%) have a job board we could tie to a named
              applicant tracking system. {top.name} runs {top.count} of those, more than any other vendor.
            </p>
          </div>
        </section>

        <section className="px-5 pb-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [`${total}`, "S&P 500 companies checked"],
                [`${pct(top.count)}%`, `have a ${top.name} job board`],
                [`${vendors.length}`, "different vendors found"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-5">
                  <p className="font-outfit text-3xl font-extrabold tabular-nums text-[var(--landing-ink)]">{value}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--landing-ink-soft)]">{label}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="landing-section-title text-2xl sm:text-3xl">ATS market share in the S&amp;P 500</h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                Each bar counts companies, not job postings. A company with ten thousand openings counts once.
                Percentages are of all {total} companies.
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {vendors.map((v) => (
                  <Bar
                    key={v.id}
                    label={v.name}
                    count={v.count}
                    href={v.guide !== "/blog/ats-resume-guide" ? v.guide : null}
                  />
                ))}
                <li className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="font-bold text-[var(--landing-ink-soft)]">No vendor found</span>
                  <span className="tabular-nums text-[var(--landing-ink-soft)]">
                    {notFound} companies, {pct(notFound)}%
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="landing-section-title text-2xl sm:text-3xl">The leading ATS in each sector</h2>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--landing-line)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--landing-paper-soft)] text-[var(--landing-ink)]">
                    <tr>
                      <th className="p-3 font-bold">Sector</th>
                      <th className="p-3 font-bold">Companies</th>
                      <th className="p-3 font-bold">Most used ATS</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--landing-ink-soft)]">
                    {sectors.map((s) => (
                      <tr key={s.sector} className="border-t border-[var(--landing-line)]">
                        <td className="p-3 font-semibold text-[var(--landing-ink)]">{s.sector}</td>
                        <td className="p-3 tabular-nums">{s.total}</td>
                        <td className="p-3">
                          {s.leader ? `${s.leader.name} (${s.leaderCount} of ${s.total})` : "None found"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="landing-section-title text-2xl sm:text-3xl">What this means for your CV</h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                If you apply to large companies, the odds are high that {top.name} or one of the next few vendors
                reads your CV first. They parse the file into fields, and recruiters then search those fields for
                the words in the job ad. Two things matter most: a layout the parser can read, and the posting&apos;s
                own words in your CV. The{" "}
                <Link href="/ats-resume-checker" className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4">
                  free ATS resume checker
                </Link>{" "}
                tests the first. The{" "}
                <Link href="/resume-job-match-checker" className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4">
                  job match checker
                </Link>{" "}
                tests the second. To look up one employer, paste a job link into the{" "}
                <Link href="/ats" className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4">
                  ATS lookup
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="landing-section-title text-2xl sm:text-3xl">How we checked</h2>
              <ul className="mt-4 flex list-disc flex-col gap-3 ps-5 text-base leading-8 text-[var(--landing-ink-soft)]">
                <li>
                  The company list is the S&amp;P 500 as listed on Wikipedia in {checkedLabel}. Alphabet, Fox and
                  News Corp have two share classes each and count once.
                </li>
                <li>
                  For each company we searched the job board domains of 17 ATS vendors, including Workday,
                  Greenhouse, iCIMS, Oracle, SuccessFactors and Taleo.
                </li>
                <li>
                  A result counted only when the board&apos;s own address named the company, such as
                  abbott.wd5.myworkdayjobs.com. Oracle addresses do not carry the name, so there the page title had
                  to carry the full company name.
                </li>
                <li>
                  Where a company had boards on more than one system, we counted the one with the most results.
                  Hits on small-business systems were checked by hand, because they are often a franchise or an
                  unrelated account using the company&apos;s name. So were one-word matches: a board called
                  &quot;union&quot; or &quot;parker&quot; turned out to belong to a startup, not Union Pacific or Parker
                  Hannifin. Boards that only cover one country or one subsidiary were left out.
                </li>
                <li>
                  The limit: companies that hire through their own system, or hide the vendor behind their own
                  domain, show as no vendor found. The real share of every vendor is likely higher than shown here.
                </li>
              </ul>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="landing-section-title text-2xl sm:text-3xl">All {total} companies</h2>
                <a
                  href={`${PATH}/data.csv`}
                  download
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--landing-primary-dark)] underline underline-offset-4"
                >
                  <DownloadSimpleIcon size={16} aria-hidden="true" />
                  Download the CSV
                </a>
              </div>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                Each vendor links to the board we found, so you can check any row.
              </p>
              <div className="mt-6 max-h-150 overflow-auto rounded-2xl border border-[var(--landing-line)]">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-[var(--landing-paper-soft)] text-[var(--landing-ink)]">
                    <tr>
                      <th className="p-3 font-bold">Company</th>
                      <th className="p-3 font-bold">Sector</th>
                      <th className="p-3 font-bold">ATS</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--landing-ink-soft)]">
                    {companies.map((c) => {
                      const slug = pageFor(c.name);
                      return (
                        <tr key={c.ticker} className="border-t border-[var(--landing-line)]">
                          <td className="p-3 font-semibold text-[var(--landing-ink)]">
                            {slug ? (
                              <Link href={`/ats/${slug}`} className="underline underline-offset-4">{c.name}</Link>
                            ) : (
                              c.name
                            )}
                          </td>
                          <td className="p-3">{c.sector}</td>
                          <td className="p-3">
                            {c.ats ? (
                              <a href={c.evidenceUrl} rel="nofollow noopener" target="_blank" className="underline underline-offset-4">
                                {getAtsVendor(c.ats).name}
                              </a>
                            ) : (
                              "Not found"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-6">
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">Using this data?</p>
              <p className="mt-2 text-sm leading-7 text-[var(--landing-ink-soft)]">
                You are welcome to quote it. Please link to this page as the source: FitMyCV, Which ATS do S&amp;P
                500 companies use?, {checkedLabel}, {SITE_URL.replace(/^https?:\/\//, "")}
                {PATH}.
              </p>
            </aside>
          </div>
        </section>

        <FaqSection faqs={faqs} heading="ATS market share FAQ" />
        <CTABand />
      </main>
      <Footer />

      <JsonLd
        data={articleSchema({
          headline: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: checkedOn,
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Applicant tracking systems used by S&P 500 companies",
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          dateModified: checkedOn,
          creator: { "@type": "Organization", name: "FitMyCV", url: SITE_URL },
          license: "https://creativecommons.org/licenses/by/4.0/",
          distribution: {
            "@type": "DataDownload",
            encodingFormat: "text/csv",
            contentUrl: `${SITE_URL}${PATH}/data.csv`,
          },
        }}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "ATS lookup", path: "/ats" },
          { name: "S&P 500 study", path: PATH },
        ])}
      />
    </div>
  );
}
