import { useTranslations } from "next-intl";
import RevealWords from "@/components/landing/RevealWords";
import { Link } from "@/i18n/navigation";
import {
  LockKeyIcon,
  ProhibitIcon,
  TrashSimpleIcon,
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
        <div className="mx-auto max-w-2xl text-center">
          <RevealWords text={t("title")} className="font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl" />
          <p className="landing-copy mt-4 text-base">
            {t("body")}
          </p>
        </div>

        {/* Only the privacy promises. Boards and PDF export are features, and
            the job board strip and templates already show them. One row on
            desktop, no rules: the icon chips separate the items. */}
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNALS.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-start gap-3">
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
        <div className="mt-8 rounded-2xl bg-[var(--landing-paper-soft)] p-5 sm:p-6">
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
