import { setRequestLocale } from "next-intl/server";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/JsonLd";
import { INDEXED_POSTS } from "@/content/blog";
import { AUTHOR, SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: `${AUTHOR.name}, ${AUTHOR.role}`,
  description: `${AUTHOR.short} Every guide on the FitMyCV blog is written by ${AUTHOR.name}.`,
  path: AUTHOR.path,
});

// Newest first, so the page shows what is being written now.
const posts = [...INDEXED_POSTS].sort((a, b) => (b.meta.date > a.meta.date ? 1 : -1));

export default function AuthorPage() {
  setRequestLocale("en");
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main dir="ltr">
        <section className="px-5 pb-16 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl">
            <h1
              className="font-serif-display font-normal leading-[1.04] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}
            >
              {AUTHOR.name}
            </h1>
            <p className="mt-4 text-lg font-bold text-[var(--landing-ink-soft)]">{AUTHOR.short}</p>
            <p className="mt-6 text-lg leading-8 text-[var(--landing-ink)]">{AUTHOR.origin}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {AUTHOR.profiles.map((p) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    rel="me noopener"
                    target="_blank"
                    className="text-sm font-bold text-[var(--landing-primary-dark)] underline underline-offset-4"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="landing-section-title mt-14 text-2xl sm:text-3xl">Guides by {AUTHOR.name.split(" ")[0]}</h2>
            <ul className="mt-6 flex flex-col divide-y divide-[var(--landing-line)] border-y border-[var(--landing-line)]">
              {posts.map(({ meta }) => (
                <li key={meta.slug} className="py-3">
                  <Link
                    href={`/blog/${meta.slug}`}
                    className="text-base font-semibold text-[var(--landing-ink)] underline-offset-4 hover:underline"
                  >
                    {meta.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: AUTHOR.name,
            jobTitle: AUTHOR.role,
            description: AUTHOR.short,
            url: `${SITE_URL}${AUTHOR.path}`,
            sameAs: AUTHOR.profiles.map((p) => p.url),
            worksFor: { "@type": "Organization", name: "FitMyCV", url: SITE_URL },
          },
        }}
      />
    </div>
  );
}
