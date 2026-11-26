import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

// Server-rendered FAQ. Uses <details> rather than JS state so the answers are
// present in the initial HTML. Google only credits FAQPage schema when the
// answer text is actually visible on the page.
export default function FaqSection({
  faqs,
  heading = "Frequently asked questions",
  intro,
  muted = true,
  id = "faq",
  inline = false,
}) {
  // Inside an article: one more section of the reading column, with the
  // article's own heading style, not a centered band of its own.
  if (inline) {
    return (
      <section id={id} className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-semibold leading-tight tracking-[-0.015em] text-[var(--landing-ink)] sm:text-[1.75rem]">
          {heading}
        </h2>
        <div className="mt-6 border-t border-[var(--landing-line)]">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group border-b border-[var(--landing-line)] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex min-h-control cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold leading-7 text-[var(--landing-ink)]">
                {q}
                <PlusIcon
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--landing-ink-faint)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-5 pe-9 text-base leading-7 text-[var(--landing-ink-soft)]">{a}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`landing-section ${muted ? "landing-muted-band" : ""}`}
    >
      <div className="landing-container flex flex-col items-center gap-4">
        <h2 className="public-section-title text-center">
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
            className="landing-card group rounded-2xl [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-outfit sm:px-6 text-base font-semibold text-[var(--landing-ink)]">
              {q}
              <PlusIcon
                size={18}
                aria-hidden="true"
                className="shrink-0 text-[var(--landing-primary-dark)] transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="landing-copy -mt-2 px-5 pb-5 text-sm leading-7 sm:px-6">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
