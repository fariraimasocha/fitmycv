import Image from "next/image";
import { cookies, headers } from "next/headers";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { getLocale, getTranslations } from "next-intl/server";
import {
  countryCodeToFlag,
  getCountryLabel,
  resolveCountryFromHeaders,
} from "@/lib/pricing-region";
import { SUPPORT_EMAIL } from "@/lib/site";
import { getHomeFaqs } from "@/content/pages/home";
import FounderFaqAccordion from "@/components/landing/FounderFaqAccordion";

// English keeps the hand-written labels. Other languages ask Intl
// for the country name in that language, falling back to English.
function localizedCountryName(country, locale) {
  const english = getCountryLabel(country);
  if (!english || locale === "en") return english;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(country.toUpperCase()) ?? english;
  } catch {
    return english;
  }
}

export default async function FounderFaqSection() {
  const [cookieStore, headerStore, t, locale] = await Promise.all([
    cookies(),
    headers(),
    getTranslations("landing.faq"),
    getLocale(),
  ]);
  const countryFromHeader = resolveCountryFromHeaders(headerStore);
  const countryFromCookie = cookieStore.get("visitor_country")?.value?.toLowerCase();
  const country = countryFromHeader ?? countryFromCookie ?? null;
  const flag = country ? countryCodeToFlag(country) : null;
  const countryName = localizedCountryName(country, locale);
  const faqs = getHomeFaqs(locale).map(({ q, a }) => ({ question: q, answer: a }));

  const greeting =
    flag && countryName
      ? t("greetingCountry", { flag, country: countryName })
      : t("greeting");

  return (
    <section
      id="faq"
      aria-labelledby="founder-faq-heading"
      className="landing-section scroll-mt-24 px-5 sm:px-10 lg:px-16 xl:px-24"
    >
      <div className="landing-container grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <article className="landing-card rounded-2xl p-6 sm:p-8">
          <header className="flex items-center gap-4">
            <Image
              src="/fari.png"
              alt={t("founderAlt")}
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="font-outfit text-base font-bold text-[var(--landing-ink)]">
                Farirai James
              </p>
              <p className="text-sm text-[var(--landing-ink-soft)]">
                {t("founderRole")}{" "}
                <a
                  href="https://x.com/fariraijames"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--landing-ink)] underline-offset-2 hover:underline"
                >
                  @fariraijames
                </a>
              </p>
            </div>
          </header>

          <h2
            id="founder-faq-heading"
            className="font-serif-display mt-8 text-2xl font-normal leading-snug text-[var(--landing-ink)] sm:text-[1.75rem]"
          >
            {t("heading")}
          </h2>

          <div className="mt-5 space-y-4 text-xs leading-6 text-[var(--landing-ink-soft)] sm:text-sm">
            <p>
              {greeting} {t("story1")}
            </p>
            <p>{t("story2")}</p>
            <p>{t("story3")}</p>
          </div>

          <footer className="mt-8 border-t border-[var(--landing-line)] pt-6">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--landing-ink)] underline-offset-2 hover:underline"
            >
              <EnvelopeSimpleIcon size={18} aria-hidden="true" />
              {SUPPORT_EMAIL}
            </a>
          </footer>
        </article>

        <FounderFaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
