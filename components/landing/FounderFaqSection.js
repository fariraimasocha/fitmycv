import Image from "next/image";
import { cookies, headers } from "next/headers";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import {
  countryCodeToFlag,
  getCountryLabel,
  resolveCountryFromHeaders,
} from "@/lib/pricing-region";
import { SUPPORT_EMAIL } from "@/lib/site";
import { HOME_FAQS } from "@/content/pages/home";
import FounderFaqAccordion from "@/components/landing/FounderFaqAccordion";

const faqs = HOME_FAQS.map(({ q, a }) => ({ question: q, answer: a }));

export default async function FounderFaqSection() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const countryFromHeader = resolveCountryFromHeaders(headerStore);
  const countryFromCookie = cookieStore.get("visitor_country")?.value?.toLowerCase();
  const country = countryFromHeader ?? countryFromCookie ?? null;
  const flag = country ? countryCodeToFlag(country) : null;
  const countryName = getCountryLabel(country);

  const greeting =
    flag && countryName
      ? `Hey friend from ${flag} ${countryName}, I'm Farirai.`
      : "Hey friend, I'm Farirai.";

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
              alt="Farirai James, founder of FitMyCV"
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="font-outfit text-base font-bold text-[var(--landing-ink)]">
                Farirai James
              </p>
              <p className="text-sm text-[var(--landing-ink-soft)]">
                Founder, FitMyCV •{" "}
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
            I kept rewriting my CV for every job link I clicked.
          </h2>

          <div className="mt-5 space-y-4 text-xs leading-6 text-[var(--landing-ink-soft)] sm:text-sm">
            <p>
              {greeting} I kept rewriting my CV for every job link I clicked.
              Each application took longer to prep than to submit.
            </p>
            <p>
              So I built FitMyCV. Paste a job link and it reads the posting,
              then rewrites your CV and cover letter for that role. No copying
              requirements into a form.
            </p>
            <p>
              I use FitMyCV on my own applications. If it saves me time on
              every link, it should do the same for you.
            </p>
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
