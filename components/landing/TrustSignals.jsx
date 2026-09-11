import Link from "next/link";
import {
  LockKeyIcon,
  ProhibitIcon,
  TrashSimpleIcon,
  FilePdfIcon,
  LinkIcon,
  CreditCardIcon,
} from "@phosphor-icons/react/dist/ssr";

import { SUPPORT_EMAIL } from "@/lib/site";

// Trust band for the homepage and the flagship feature page.
//
// Every claim here is a verifiable property of the product. Deliberately absent:
// a user count, star rating, or named testimonials we do not have data for.
// and therefore no aggregateRating schema. Google issues manual actions for
// fabricated review markup, so that schema goes in only once there are real,
// collectible reviews to back it (see lib/structured-data.js).
const SIGNALS = [
  {
    icon: LockKeyIcon,
    title: "Your CV stays yours",
    body: "Your reference CV is stored against your account and used only to generate your own documents.",
  },
  {
    icon: ProhibitIcon,
    title: "Never shared with recruiters",
    body: "We are not a job board and not a CV database. Nothing you upload is sold, listed, or shown to employers.",
  },
  {
    icon: TrashSimpleIcon,
    title: "Delete everything, any time",
    body: "Remove your CV, your tailored documents, and your account from the dashboard whenever you want.",
  },
  {
    icon: LinkIcon,
    title: "Works with the major boards",
    body: "Paste a link from LinkedIn, Indeed, Glassdoor, or a company careers page, with no copy-pasting job text.",
  },
  {
    icon: FilePdfIcon,
    title: "ATS-safe PDF export",
    body: "Single-column, text-based PDFs with standard headings, so parsers read them the way you wrote them.",
  },
  {
    icon: CreditCardIcon,
    title: "Cancel whenever",
    body: "No contract and no cancellation flow to fight. Access runs to the end of the period you paid for.",
  },
];

const POLICY_LINK_CLASS =
  "font-medium text-[var(--landing-ink)] underline underline-offset-2 hover:text-[var(--landing-accent-dark)]";

export default function TrustSignals() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container">
        {/* Left-aligned, matching the hero's type system. */}
        <div className="max-w-2xl">
          <h2 className="landing-section-title text-2xl sm:text-3xl">
            What you are handing over, and what happens to it
          </h2>
          <p className="landing-copy mt-4 text-base">
            Your CV is the most personal document you own. Here is exactly how
            it is handled.
          </p>
        </div>

        {/* A ruled ledger rather than a card grid. ResourcesStrip below is
            already a card grid, and two of those in one page read as the same
            section twice. Rules also suit a list of commitments: it scans like
            a policy, which is what it is. */}
        <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {SIGNALS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex items-start gap-4 border-t border-[var(--landing-line)] py-5"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
                <Icon size={16} weight="bold" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-outfit text-base font-bold text-[var(--landing-ink)]">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* Methodology and provenance. Every claim above is either a property
            of the product or covered by a published policy, so link the
            policies rather than asking visitors to take our word for it. */}
        <div className="mt-10 border-t border-[var(--landing-line)] pt-8">
          <h3 className="font-outfit text-base font-bold text-[var(--landing-ink)]">
            How the tailoring works
          </h3>
          <div className="mt-3 grid gap-4 text-sm leading-6 text-[var(--landing-ink-soft)] lg:grid-cols-2 lg:gap-12">
            <p>
              We read the job posting at the link you paste, pull out its
              requirements and keywords, then rewrite your CV against them. Every
              line comes from the CV you uploaded. The model is instructed never
              to invent employers, roles, or numbers you did not give it.
            </p>
            <p>
              The claims above are covered by our{" "}
              <Link href="/privacy-policy" className={POLICY_LINK_CLASS}>
                privacy policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-and-conditions" className={POLICY_LINK_CLASS}>
                terms and conditions
              </Link>
              . Questions about any of it go to{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className={POLICY_LINK_CLASS}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
