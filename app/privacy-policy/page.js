import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How FitMyCV collects, uses, and protects your data — including your CV content, Google account details, and payment information.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    type: "website",
    url: "/privacy-policy",
    siteName: "FitMyCV",
    title: "Privacy Policy | FitMyCV",
    description:
      "How FitMyCV collects, uses, and protects your data — including your CV content, Google account details, and payment information.",
    images: [{ url: "/hero.png", width: 3024, height: 1714, alt: "FitMyCV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | FitMyCV",
    description:
      "How FitMyCV collects, uses, and protects your data — including your CV content, Google account details, and payment information.",
    images: ["/hero.png"],
  },
};

const LAST_UPDATED = "June 14, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main className="px-5 pb-20 pt-32 sm:px-10 lg:px-16 xl:px-24">
        <article className="mx-auto flex w-full max-w-3xl flex-col">
          <h1 className="font-outfit text-4xl font-extrabold text-[var(--landing-ink)] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm font-semibold text-[var(--landing-ink-soft)]">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="mt-10 flex flex-col gap-8">
            <section className="flex flex-col gap-3">
              <p className="landing-copy text-base leading-7">
                FitMyCV (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
                helps you tailor your CV and cover letter to specific job
                listings. This Privacy Policy explains what information we
                collect when you use FitMyCV, how we use it, and the choices you
                have. By using FitMyCV you agree to the practices described here.
              </p>
            </section>

            <Section title="Information we collect">
              <p className="landing-copy text-base leading-7">
                We collect the following categories of information:
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                <Bullet>
                  <strong>Account information.</strong> When you sign in with
                  Google, we receive your name, email address, and profile
                  picture from your Google account.
                </Bullet>
                <Bullet>
                  <strong>CV content.</strong> The reference CV you upload and
                  the text extracted from it, which we store so we can tailor it
                  to the jobs you choose.
                </Bullet>
                <Bullet>
                  <strong>Job listings.</strong> The job links you paste and the
                  requirements scraped from those pages.
                </Bullet>
                <Bullet>
                  <strong>Generated documents.</strong> The tailored CVs and
                  cover letters we create for you.
                </Bullet>
                <Bullet>
                  <strong>Payment information.</strong> When you subscribe,
                  payments are processed by our payment provider, Polar. We
                  receive your subscription status but never see or store your
                  full card details.
                </Bullet>
                <Bullet>
                  <strong>Usage data.</strong> Basic analytics about how you use
                  the app, collected via Umami and Vercel Analytics, to help us
                  improve the product.
                </Bullet>
              </ul>
            </Section>

            <Section title="How we use your information">
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <Bullet>To provide and operate the FitMyCV service.</Bullet>
                <Bullet>
                  To generate tailored CVs and cover letters from your reference
                  CV and the job links you provide.
                </Bullet>
                <Bullet>
                  To manage your account, subscription, and billing.
                </Bullet>
                <Bullet>
                  To send you product and account communications, including
                  optional job-match emails.
                </Bullet>
                <Bullet>
                  To analyze and improve the performance and reliability of the
                  app.
                </Bullet>
              </ul>
            </Section>

            <Section title="AI processing">
              <p className="landing-copy text-base leading-7">
                To generate your documents, we send the relevant text — such as
                your CV content and the scraped job requirements — to third-party
                AI providers including OpenAI, Groq, and Exa.ai. These providers
                process the text on our behalf to extract requirements and
                produce your tailored CV and cover letter. We do not sell your
                personal information.
              </p>
            </Section>

            <Section title="Third parties we share data with">
              <p className="landing-copy text-base leading-7">
                We share data only with the service providers that make FitMyCV
                work, including:
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                <Bullet>Google (authentication).</Bullet>
                <Bullet>OpenAI, Groq, and Exa.ai (AI processing and scraping).</Bullet>
                <Bullet>Polar (payments and subscriptions).</Bullet>
                <Bullet>MongoDB (database hosting) and Vercel (app hosting).</Bullet>
                <Bullet>Umami and Vercel Analytics (product analytics).</Bullet>
              </ul>
            </Section>

            <Section title="Data retention">
              <p className="landing-copy text-base leading-7">
                We keep your information for as long as your account is active or
                as needed to provide the service. You can ask us to delete your
                account and associated data at any time by contacting us.
              </p>
            </Section>

            <Section title="Your rights">
              <p className="landing-copy text-base leading-7">
                You can request access to, correction of, or deletion of your
                personal data. To exercise these rights, email us at{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-[var(--landing-primary-dark)] underline"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </Section>

            <Section title="Cookies">
              <p className="landing-copy text-base leading-7">
                We use cookies and similar technologies to keep you signed in and
                to understand how the app is used. You can control cookies through
                your browser settings, though some features may not work without
                them.
              </p>
            </Section>

            <Section title="Security">
              <p className="landing-copy text-base leading-7">
                We use industry-standard measures to protect your information.
                However, no method of transmission or storage is completely
                secure, and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="Children">
              <p className="landing-copy text-base leading-7">
                FitMyCV is not intended for anyone under the age of 16, and we do
                not knowingly collect data from children.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p className="landing-copy text-base leading-7">
                We may update this Privacy Policy from time to time. When we do,
                we will revise the &quot;Last updated&quot; date above. Continued
                use of FitMyCV after changes means you accept the updated policy.
              </p>
            </Section>

            <Section title="Contact us">
              <p className="landing-copy text-base leading-7">
                If you have any questions about this Privacy Policy, contact us at{" "}
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
  return (
    <li className="landing-copy text-base leading-7">{children}</li>
  );
}
