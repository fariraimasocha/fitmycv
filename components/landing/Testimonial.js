import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { getHomeTestimonials } from "@/content/pages/home";

// Real quotes from people who agreed to be published (content/pages/home.js).
// A grid instead of a marquee: readable at your own pace and nothing moves.
// ponytail: first six only, the rest stay in the source for the Review schema
// and other pages.
export default function Testimonial() {
  const t = useTranslations("landing.testimonial");
  const items = getHomeTestimonials(useLocale()).slice(0, 6);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="public-section scroll-mt-24"
    >
      <div className="public-container flex flex-col gap-12">
        <h2 id="testimonials-heading" className="public-section-title text-center">
          {t("heading")}
        </h2>
        <ul className="quote-grid">
          {items.map((item) => (
            <li key={item.author}>
              <figure className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-8">
                <blockquote className="font-sans text-base leading-relaxed text-[var(--landing-ink)]">
                  {item.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt=""
                    width={40}
                    height={40}
                    className="landing-inset-edge size-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-outfit text-sm font-semibold text-[var(--landing-ink)]">
                      {item.author}
                    </span>
                    {item.role && (
                      <span className="font-sans text-xs text-[var(--landing-ink-soft)]">
                        {item.role}
                      </span>
                    )}
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
