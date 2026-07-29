import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

// Server-rendered FAQ. Uses <details> rather than JS state so the answers are
// present in the initial HTML — Google only credits FAQPage schema when the
// answer text is actually visible on the page.
export default function FaqSection({
  faqs,
  heading = "Frequently asked questions",
  intro,
  muted = true,
  id = "faq",
}) {
  return (
    <section
      id={id}
      className={`landing-section ${muted ? "landing-muted-band" : ""}`}
    >
      <div className="landing-container flex flex-col items-center gap-4">
        <h2 className="landing-heading text-center font-outfit text-3xl font-extrabold sm:text-4xl">
          {heading}
        </h2>
        {intro ? (
          <p className="landing-copy text-center text-base">{intro}</p>
        ) : null}
      </div>

      <div className="landing-container mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="landing-card group rounded-2xl px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-outfit text-base font-extrabold text-[var(--landing-ink)]">
              {q}
              <PlusIcon
                size={18}
                aria-hidden="true"
                className="shrink-0 text-[var(--landing-primary-dark)] transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="landing-copy mt-3 text-sm leading-7">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
