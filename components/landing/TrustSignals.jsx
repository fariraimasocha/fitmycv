import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  { key: "yours", icon: LockKeyIcon },
  { key: "notShared", icon: ProhibitIcon },
  { key: "delete", icon: TrashSimpleIcon },
  { key: "boards", icon: LinkIcon },
  { key: "pdf", icon: FilePdfIcon },
  { key: "cancel", icon: CreditCardIcon },
];

const POLICY_LINK_CLASS =
  "font-medium text-[var(--landing-ink)] underline underline-offset-2 hover:text-[var(--landing-accent-dark)]";

export default function TrustSignals() {
  const t = useTranslations("landing.trust");

  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container">
        {/* Left-aligned, matching the hero's type system. */}
        <div className="max-w-2xl">
          <h2 className="landing-section-title text-2xl sm:text-3xl">
            {t("title")}
          </h2>
          <p className="landing-copy mt-4 text-base">
            {t("body")}
          </p>
        </div>

        {/* A ruled ledger rather than a card grid. ResourcesStrip below is
            already a card grid, and two of those in one page read as the same
            section twice. Rules also suit a list of commitments: it scans like
            a policy, which is what it is. */}
        <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {SIGNALS.map(({ key, icon: Icon }) => (
            <li
              key={key}
              className="flex items-start gap-4 border-t border-[var(--landing-line)] py-5"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
                <Icon size={16} weight="bold" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-outfit text-base font-bold text-[var(--landing-ink)]">
                  {t(`signals.${key}.title`)}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {t(`signals.${key}.body`)}
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
            {t("methodTitle")}
          </h3>
          <div className="mt-3 grid gap-4 text-sm leading-6 text-[var(--landing-ink-soft)] lg:grid-cols-2 lg:gap-12">
            <p>{t("methodBody")}</p>
            <p>
              {t.rich("policies", {
                email: SUPPORT_EMAIL,
                privacy: (chunks) => (
                  <Link href="/privacy-policy" className={POLICY_LINK_CLASS}>
                    {chunks}
                  </Link>
                ),
                terms: (chunks) => (
                  <Link href="/terms-and-conditions" className={POLICY_LINK_CLASS}>
                    {chunks}
                  </Link>
                ),
                mail: (chunks) => (
                  <a href={`mailto:${SUPPORT_EMAIL}`} className={POLICY_LINK_CLASS}>
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
