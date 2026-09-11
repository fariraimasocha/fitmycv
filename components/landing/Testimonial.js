import Image from "next/image";
import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";

import { HOME_TESTIMONIAL } from "@/content/pages/home";

// One real, attributed quote. The section carries a heading and figure/
// figcaption markup so readers, crawlers, and screen readers can all tell the
// quote from the attribution. Add more entries only for feedback we can name.
export default function Testimonial() {
  const { quote, author, role, image } = HOME_TESTIMONIAL;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="landing-section-tight landing-muted-band flex scroll-mt-24 flex-col items-center"
    >
      <div className="landing-reveal landing-container flex flex-col items-center w-full max-w-3xl gap-8">
        <QuotesIcon
          size={32}
          weight="fill"
          className="text-[var(--landing-accent)]"
          aria-hidden="true"
        />

        <h2
          id="testimonials-heading"
          className="landing-eyebrow-plain text-center"
        >
          From a FitMyCV user
        </h2>

        <figure className="flex w-full flex-col items-center gap-8">
          {/* Quote with highlight */}
          <div className="relative w-full">
            <div
              className="hidden sm:block absolute bg-[oklch(0.9_0.075_68)] rounded h-[30px] w-[45%] right-0 top-[3px]"
              aria-hidden="true"
            />
            <blockquote className="relative z-10 w-full text-center font-serif-display text-xl leading-relaxed text-[var(--landing-ink)] sm:text-2xl">
              {quote}
            </blockquote>
          </div>

          <figcaption className="flex flex-row items-center gap-4">
            <Image
              src={image}
              alt={author}
              width={60}
              height={60}
              className="landing-inset-edge rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <span className="font-outfit font-extrabold text-lg text-[var(--landing-ink)]">
                {author}
              </span>
              <span className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)]">
                {role}
              </span>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
