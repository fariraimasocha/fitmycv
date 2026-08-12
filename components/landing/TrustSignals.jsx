import {
  LockKeyIcon,
  ProhibitIcon,
  TrashSimpleIcon,
  FilePdfIcon,
  LinkIcon,
  CreditCardIcon,
} from "@phosphor-icons/react/dist/ssr";

// Trust band for the homepage and the flagship feature page.
//
// Every claim here is a verifiable property of the product. Deliberately absent:
// a user count, star rating, or named testimonials we do not have data for —
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
    body: "Paste a link from LinkedIn, Indeed, Glassdoor, or a company careers page — no copy-pasting job text.",
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

export default function TrustSignals() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="landing-section-title text-2xl sm:text-3xl">
            What you are handing over, and what happens to it
          </h2>
          <p className="landing-copy text-center text-base">
            Your CV is the most personal document you own. Here is exactly how
            it is handled.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="landing-card flex flex-col gap-3 rounded-2xl p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
                <Icon size={19} weight="bold" aria-hidden="true" />
              </span>
              <span className="font-medium text-base text-[var(--landing-ink)]">
                {title}
              </span>
              <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                {body}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
