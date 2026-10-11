import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { getHomeTestimonials } from "@/content/pages/home";

// ponytail: CSS marquee (same track as JobBoardStrip), no carousel lib. The
// list renders twice so the loop is seamless; the copy is hidden from readers.
export default function Testimonial() {
  const t = useTranslations("landing.testimonial");
  const items = getHomeTestimonials(useLocale());

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="landing-section-tight landing-muted-band flex scroll-mt-24 flex-col items-center gap-8 overflow-hidden"
    >
      <h2 id="testimonials-heading" className="landing-eyebrow-plain text-center">
        {t("heading")}
      </h2>

      <div
        className="relative w-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <ul className="landing-marquee-track landing-marquee-slow flex w-max gap-4 px-4 md:gap-6">
          {[...items, ...items].map((item, i) => (
            <li
              key={`${item.author}-${i}`}
              aria-hidden={i >= items.length || undefined}
              className="w-72 shrink-0 sm:w-80"
            >
              <figure className="landing-card flex h-full flex-col justify-between gap-6 rounded-2xl p-6">
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
                    <span className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
                      {item.author}
                    </span>
                    {item.role && (
                      <span className="font-sans text-xs font-semibold text-[var(--landing-ink-soft)]">
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
