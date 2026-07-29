import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import BlogCard from "@/components/blog/BlogCard";
import JsonLd from "@/components/JsonLd";
import { listPosts } from "@/content/blog";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "CV & Resume Blog",
  description:
    "Practical guides on ATS-friendly resumes, tailoring your CV to a job description, and the action verbs that make bullets land — from the team behind FitMyCV.",
  path: "/blog",
  keywords: [
    "cv blog",
    "resume blog",
    "ats resume guide",
    "cv tips",
    "resume writing guides",
  ],
  image: "/blog/ats-resume-guide.png",
});

const collectionSchema = (posts) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "FitMyCV Blog",
  url: `${SITE_URL}/blog`,
  description:
    "Guides on ATS-friendly resumes, CV tailoring, and writing bullets that land interviews.",
  blogPost: posts.map(({ meta }) => ({
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    url: `${SITE_URL}/blog/${meta.slug}`,
    datePublished: meta.date,
    dateModified: meta.updated || meta.date,
    image: `${SITE_URL}${meta.image}`,
    author: { "@type": "Organization", name: "FitMyCV" },
  })),
});

export default function BlogIndexPage() {
  const posts = listPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-14 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.92_0.06_174_/_0.66),transparent_32rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <span className="landing-eyebrow">
              <span
                className="h-2 w-2 rounded-full bg-[var(--landing-primary)]"
                aria-hidden="true"
              />
              The FitMyCV blog
            </span>
            <h1
              className="mt-6 max-w-3xl font-outfit font-extrabold leading-[1.02] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Guides for getting past the filter
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
              How applicant tracking systems actually read a CV, how to tailor
              one to a job description without losing your evening, and the
              words that make a bullet land.
            </p>
          </div>
        </section>

        {/* Featured post */}
        <section className="px-5 pb-4 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container">
            <Link
              href={`/blog/${featured.meta.slug}`}
              className="landing-card group grid gap-0 overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 md:grid-cols-2"
            >
              <div className="relative aspect-3/2 w-full overflow-hidden bg-[var(--landing-paper-strong)] md:aspect-auto md:min-h-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.meta.image}
                  alt={featured.meta.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                <span className="landing-eyebrow w-fit">Start here</span>
                <h2 className="font-outfit text-2xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-3xl">
                  {featured.meta.title}
                </h2>
                <p className="text-base leading-8 text-[var(--landing-ink-soft)]">
                  {featured.meta.excerpt}
                </p>
                <span className="mt-2 inline-flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-primary-dark)]">
                  Read the guide
                  <ArrowRightIcon
                    size={15}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Grid */}
        <section className="landing-section">
          <div className="landing-container grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <BlogCard key={post.meta.slug} post={post.meta} priority={i < 3} />
            ))}
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />

      <JsonLd data={collectionSchema(posts)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
    </div>
  );
}
