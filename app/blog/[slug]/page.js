import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRightIcon, ClockIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import BlogCard from "@/components/blog/BlogCard";
import Blocks, { slugifyHeading } from "@/components/content/Blocks";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import FormattedDate from "@/components/FormattedDate";
import { POSTS, getPost, relatedPosts } from "@/content/blog";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const { meta } = post;
  return pageMetadata({
    absoluteTitle: `${meta.seoTitle || meta.title} | FitMyCV`,
    description: meta.description,
    path: `/blog/${meta.slug}`,
    keywords: meta.keywords,
    image: meta.image,
    type: "article",
    publishedTime: meta.date,
    modifiedTime: meta.updated || meta.date,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, faqs, blocks } = post;
  const related = relatedPosts(slug);
  const headings = blocks.filter((block) => block.h2).map((block) => block.h2);

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <article>
          {/* Header */}
          <section className="relative isolate overflow-hidden px-5 pb-10 pt-32 sm:px-10 lg:px-16 xl:px-24">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(circle_at_50%_12%,oklch(0.92_0.06_174_/_0.6),transparent_30rem)]"
            />

            <div className="mx-auto w-full max-w-3xl">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
              >
                <Link href="/" className="hover:text-[var(--landing-ink)]">
                  Home
                </Link>
                <CaretRightIcon size={11} aria-hidden="true" />
                <Link href="/blog" className="hover:text-[var(--landing-ink)]">
                  Blog
                </Link>
                <CaretRightIcon size={11} aria-hidden="true" />
                <span className="text-[var(--landing-ink)]">{meta.category}</span>
              </nav>

              <h1
                className="mt-6 font-outfit font-extrabold leading-[1.06] tracking-tight text-[var(--landing-ink)]"
                style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}
              >
                {meta.title}
              </h1>

              <p className="mt-6 text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
                {meta.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--landing-line)] pt-5 text-sm font-semibold text-[var(--landing-ink-soft)]">
                <span>FitMyCV Team</span>
                <span aria-hidden="true">·</span>
                <FormattedDate
                  date={meta.date}
                  locale="en-GB"
                  options={{ day: "numeric", month: "long", year: "numeric" }}
                />
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon size={14} weight="bold" aria-hidden="true" />
                  {meta.readingTime} min read
                </span>
              </div>
            </div>
          </section>

          {/* Cover */}
          <div className="px-5 sm:px-10 lg:px-16 xl:px-24">
            <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[28px] border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] shadow-[var(--landing-shadow-sm)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.image}
                alt={meta.imageAlt}
                width={1536}
                height={1024}
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Body */}
          <section className="px-5 pb-4 pt-14 sm:px-10 lg:px-16 xl:px-24">
            <div className="mx-auto w-full max-w-3xl">
              {headings.length > 3 ? (
                <nav
                  aria-label="On this page"
                  className="landing-card mb-12 rounded-2xl p-6"
                >
                  <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                    On this page
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {headings.map((heading) => (
                      <li key={heading}>
                        <a
                          href={`#${slugifyHeading(heading)}`}
                          className="text-sm font-semibold leading-6 text-[var(--landing-primary-dark)] hover:underline hover:underline-offset-4"
                        >
                          {heading}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <Blocks blocks={blocks} />
            </div>
          </section>
        </article>

        <div className="mt-8">
          <FaqSection
            faqs={faqs}
            heading="Frequently asked questions"
            id="faq"
          />
        </div>

        {/* Related */}
        {related.length ? (
          <section className="landing-section">
            <div className="landing-container">
              <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
                Keep reading
              </h2>
              <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <BlogCard key={item.meta.slug} post={item.meta} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <CTABand />
      </main>
      <Footer />

      <JsonLd
        data={articleSchema({
          headline: meta.title,
          description: meta.description,
          path: `/blog/${meta.slug}`,
          image: meta.image,
          datePublished: meta.date,
          dateModified: meta.updated || meta.date,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: meta.title, path: `/blog/${meta.slug}` },
        ])}
      />
    </div>
  );
}
