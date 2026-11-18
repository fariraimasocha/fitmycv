import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import BlogCard from "@/components/blog/BlogCard";
import Blocks, { slugifyHeading } from "@/components/content/Blocks";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import FormattedDate from "@/components/FormattedDate";
import { POSTS, getPost, relatedPosts } from "@/content/blog";
import { AUTHOR } from "@/lib/site";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
} from "@/lib/seo";

// dynamicParams stays on: with it off, an unknown param made Next throw an
// internal NoFallbackError into the logs. The notFound() below 404s either way.

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
    noindex: meta.noindex,
  });
}

function Toc({ headings, className = "" }) {
  return (
    <ul className={`flex flex-col gap-2.5 border-s border-[var(--landing-line)] ${className}`}>
      {headings.map((heading) => (
        <li key={heading}>
          <a
            href={`#${slugifyHeading(heading)}`}
            className="-ms-px block border-s border-transparent ps-3 text-sm leading-5 text-[var(--landing-ink-soft)] transition-colors hover:border-[var(--landing-ink)] hover:text-[var(--landing-ink)]"
          >
            {heading}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function BlogPostPage({ params }) {
  setRequestLocale("en");
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, faqs, blocks } = post;
  const related = relatedPosts(slug);
  const headings = blocks.filter((block) => block.h2).map((block) => block.h2);
  const toc = faqs?.length ? [...headings, "Frequently asked questions"] : headings;

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main dir="ltr">
        {/* The article sits on paper: long reads are easier dark on light. */}
        <div className="reading-light">
          <article className="px-5 pb-20 pt-12 sm:px-10 sm:pt-16 lg:px-16 xl:px-24">
            {/* Header */}
            {/* The nav's frame: same container and inset as the logo and the
                Sign up button, so the page shares one left and right edge. */}
            <header className="landing-container px-4 sm:px-8">
              <div>
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--landing-ink-faint)]">
                  <Link href="/blog" className="hover:text-[var(--landing-ink)]">
                    Blog
                  </Link>
                  <CaretRightIcon size={12} aria-hidden="true" />
                  <span className="font-medium text-[var(--landing-accent-dark)]">{meta.category}</span>
                </nav>

                <h1
                  className="font-serif-display mt-4 max-w-200 font-normal leading-[1.05] tracking-[-0.01em] text-[var(--landing-ink)]"
                  style={{ fontSize: "clamp(36px, 5.2vw, 64px)" }}
                >
                  {meta.title}
                </h1>

                <p className="mt-6 max-w-170 text-xl leading-8 text-[var(--landing-ink-soft)]">{meta.excerpt}</p>

                <div className="mt-8 flex items-center gap-3 border-t border-[var(--landing-line)] pt-6">
                  <Image
                    src="/fari.png"
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 text-sm leading-5">
                    <Link
                      href={AUTHOR.path}
                      rel="author"
                      className="font-semibold text-[var(--landing-ink)] underline-offset-4 hover:underline"
                    >
                      {AUTHOR.name}
                    </Link>
                    <p className="text-[var(--landing-ink-faint)]">
                      {meta.updated && meta.updated !== meta.date ? "Updated " : ""}
                      <FormattedDate
                        date={meta.updated || meta.date}
                        locale="en-GB"
                        options={{ day: "numeric", month: "long", year: "numeric" }}
                      />
                      {" · "}
                      {meta.readingTime} min read
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Cover */}
            <div className="landing-container px-4 sm:px-8 mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.image}
                alt={meta.imageAlt}
                width={1536}
                height={1024}
                className="aspect-2/1 h-auto w-full rounded-2xl border border-[var(--landing-line)] object-cover"
              />
            </div>

            {/* Body: the contents rail starts on the nav's left edge, then one 680px
                reading column. Text wider than 680px gets hard to track. */}
            <div className="landing-container px-4 sm:px-8 mt-12 lg:grid lg:grid-cols-[14rem_minmax(0,42.5rem)] lg:gap-x-16">
              {headings.length > 3 ? (
                <nav aria-label="On this page" className="mb-10 lg:mb-0">
                  {/* Phones: one tap opens the list, so the opening is not
                      pushed below a block of links. */}
                  <details className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] lg:hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex min-h-control cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-[var(--landing-ink)]">
                      On this page
                      <CaretDownIcon size={16} aria-hidden="true" />
                    </summary>
                    <Toc headings={toc} className="px-4 pb-4" />
                  </details>
                  <div className="sticky top-24 hidden lg:block">
                    <p className="text-sm font-semibold text-[var(--landing-ink)]">On this page</p>
                    <Toc headings={toc} className="mt-3" />
                  </div>
                </nav>
              ) : (
                <div className="hidden lg:block" />
              )}

              <div className="min-w-0">
                <Blocks blocks={blocks} />

                {faqs?.length ? (
                  <FaqSection faqs={faqs} heading="Frequently asked questions" id="frequently-asked-questions" inline />
                ) : null}

                <aside className="mt-16 flex gap-4 border-t border-[var(--landing-line)] pt-8">
                  <Image
                    src="/fari.png"
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold text-[var(--landing-ink)]">
                      <Link href={AUTHOR.path} rel="author" className="underline-offset-4 hover:underline">
                        {AUTHOR.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--landing-ink-faint)]">{AUTHOR.short}</p>
                    <p className="mt-3 text-base leading-7 text-[var(--landing-ink-soft)]">{AUTHOR.origin}</p>
                  </div>
                </aside>
              </div>
            </div>
          </article>

          {/* Related */}
          {related.length ? (
            <section className="border-t border-[var(--landing-line)] px-5 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
              <div className="landing-container px-4 sm:px-8">
                <h2 className="text-2xl font-semibold leading-tight tracking-[-0.015em] text-[var(--landing-ink)] sm:text-[1.75rem]">
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
        </div>

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
          author: AUTHOR,
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
