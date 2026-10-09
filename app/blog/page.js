import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import BlogCard from "@/components/blog/BlogCard";
import JsonLd from "@/components/JsonLd";
import { listPosts } from "@/content/blog";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "CV & Resume Blog: ATS Guides and Tips",
  description:
    "Practical guides on ATS-friendly resumes, tailoring your CV to a job description, and the action verbs that make bullets land, from the FitMyCV team.",
  path: "/blog",
  keywords: [
    "cv blog",
    "resume blog",
    "ats resume guide",
    "cv tips",
    "resume writing guides",
  ],
  image: "/blog/ats-resume-guide.jpg",
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

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main dir="ltr">
        <section className="relative isolate overflow-hidden px-5 pb-10 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container flex flex-col items-center text-center">
            <span className="landing-eyebrow">
              <span
                className="h-2 w-2 rounded-full bg-[var(--landing-primary)]"
                aria-hidden="true"
              />
              The FitMyCV blog
            </span>
            <h1
              className="font-serif-display mt-6 max-w-3xl font-normal leading-[1.02] tracking-tight text-[var(--landing-ink)]"
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

        <section className="px-5 pb-16 pt-2 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
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
