import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Terms and Conditions",
  description:
    "The terms that govern your use of FitMyCV, including subscriptions, billing, acceptable use, and our AI-generated content disclaimer.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    type: "website",
    url: "/terms-and-conditions",
    siteName: "FitMyCV",
    title: "Terms and Conditions | FitMyCV",
    description:
      "The terms that govern your use of FitMyCV, including subscriptions, billing, acceptable use, and our AI-generated content disclaimer.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "FitMyCV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | FitMyCV",
    description:
      "The terms that govern your use of FitMyCV, including subscriptions, billing, acceptable use, and our AI-generated content disclaimer.",
    images: ["/og-image.jpg"],
  },
};

const LAST_UPDATED = "June 14, 2026";

export default function TermsAndConditionsPage() {
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main className="px-5 pb-20 pt-32 sm:px-10 lg:px-16 xl:px-24">
        <article className="mx-auto flex w-full max-w-3xl flex-col">
          <h1 className="font-outfit text-4xl font-extrabold text-[var(--landing-ink)] sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-3 text-sm font-semibold text-[var(--landing-ink-soft)]">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="mt-10 flex flex-col gap-8">
            <section className="flex flex-col gap-3">
              <p className="landing-copy text-base leading-7">
                These Terms and Conditions (&quot;Terms&quot;) govern your access
                to and use of FitMyCV. By creating an account or using the
                service, you agree to these Terms. If you do not agree, please do
                not use FitMyCV.
              </p>
            </section>

            <Section title="1. The service">
              <p className="landing-copy text-base leading-7">
                FitMyCV lets you upload a reference CV, paste a job link, and
                receive a CV and cover letter tailored to that role using
                AI-powered tools. We may change, suspend, or discontinue any part
                of the service at any time.
              </p>
            </Section>

            <Section title="2. Your account">
              <p className="landing-copy text-base leading-7">
                You sign in with Google and are responsible for activity that
                happens under your account. You must provide accurate information
                and keep your account secure. You must be at least 16 years old to
                use FitMyCV.
              </p>
            </Section>

            <Section title="3. Subscriptions and billing">
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <Bullet>
                  FitMyCV Premium is offered at $6.99 per month or $69.90 per
                  year, billed through our payment provider, Polar.
                </Bullet>
                <Bullet>
                  Subscriptions renew automatically at the end of each billing
                  period unless you cancel beforehand.
                </Bullet>
                <Bullet>
                  You can cancel at any time and will retain access until the end
                  of your current billing period.
                </Bullet>
                <Bullet>
                  Except where required by law, payments are non-refundable.
                </Bullet>
              </ul>
            </Section>

            <Section title="4. Acceptable use">
              <p className="landing-copy text-base leading-7">
                You agree not to misuse FitMyCV. In particular, you will not:
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                <Bullet>
                  Upload content you do not have the right to use, or submit false
                  or misleading information in your CV.
                </Bullet>
                <Bullet>
                  Use the service for unlawful purposes or to infringe the rights
                  of others.
                </Bullet>
                <Bullet>
                  Attempt to disrupt, reverse-engineer, or gain unauthorized
                  access to the service.
                </Bullet>
              </ul>
            </Section>

            <Section title="5. AI-generated content">
              <p className="landing-copy text-base leading-7">
                FitMyCV uses AI to generate tailored CVs and cover letters. AI
                output can contain inaccuracies, so you are responsible for
                reviewing and editing every document before you use it. We do not
                guarantee any particular outcome, including interviews or job
                offers, and the generated content does not constitute professional
                career advice.
              </p>
            </Section>

            <Section title="6. Intellectual property">
              <p className="landing-copy text-base leading-7">
                You retain ownership of the CV content you upload and the
                documents generated for you. FitMyCV and its branding, software,
                and design remain our property. You may use generated documents
                for your own job applications.
              </p>
            </Section>

            <Section title="7. Third-party services">
              <p className="landing-copy text-base leading-7">
                FitMyCV relies on third-party providers such as Google, Polar,
                OpenAI, Groq, and Exa.ai. Your use of the service may also be
                subject to their terms, and we are not responsible for the
                content of external job listings you choose to submit.
              </p>
            </Section>

            <Section title="8. Disclaimers and limitation of liability">
              <p className="landing-copy text-base leading-7">
                FitMyCV is provided &quot;as is&quot; without warranties of any
                kind. To the fullest extent permitted by law, we are not liable
                for any indirect, incidental, or consequential damages arising
                from your use of the service.
              </p>
            </Section>

            <Section title="9. Termination">
              <p className="landing-copy text-base leading-7">
                We may suspend or terminate your access if you violate these
                Terms. You may stop using FitMyCV and request deletion of your
                account at any time.
              </p>
            </Section>

            <Section title="10. Changes to these terms">
              <p className="landing-copy text-base leading-7">
                We may update these Terms from time to time. When we do, we will
                revise the &quot;Last updated&quot; date above. Continued use of
                FitMyCV after changes means you accept the updated Terms.
              </p>
            </Section>

            <Section title="11. Contact us">
              <p className="landing-copy text-base leading-7">
                If you have any questions about these Terms, contact us at{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-[var(--landing-primary-dark)] underline"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </Section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-outfit text-xl font-extrabold text-[var(--landing-ink)] sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullet({ children }) {
  return <li className="landing-copy text-base leading-7">{children}</li>;
}
