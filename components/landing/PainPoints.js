"use client";

const PAINS = [
  {
    title: "Generic CVs get ignored",
    body: "Recruiters scan for keyword matches. A one-size-fits-all CV gets six seconds before they move on.",
  },
  {
    title: "Hours wasted per application",
    body: "Manually rewriting bullets, cover letters, and formatting for every role eats your evenings.",
  },
  {
    title: "ATS filters you out",
    body: "Automated systems reject most CVs before a human ever reads them: wrong keywords, wrong format.",
  },
  {
    title: "No feedback, no replies",
    body: "You apply and hear nothing. Was it your CV? The job? You never know, so you keep guessing.",
  },
];

function PainCard({ title, body }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-white p-6 sm:p-7">
      <h3 className="flex items-start gap-2.5 text-base font-semibold text-[var(--landing-ink)]">
        <span className="mt-0.5 shrink-0 text-[var(--landing-accent)]" aria-hidden="true">
          ✕
        </span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--landing-ink-soft)]">{body}</p>
    </div>
  );
}

export default function PainPoints() {
  return (
    <section className="landing-section">
      <div className="landing-container flex flex-col items-center gap-12 text-center">
        <div className="flex max-w-3xl flex-col items-center gap-4">
          <span className="landing-eyebrow gap-2.5 px-3 py-1.5">
            The application tax
          </span>
          <h2 className="landing-section-title text-3xl sm:text-4xl lg:text-5xl">
            You&apos;re tailoring every application,{" "}
            <em className="text-[var(--landing-accent)]">alone</em>.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--landing-ink-soft)]">
            Pasting the same CV everywhere feels fast until the silence adds up.
            Here&apos;s what&apos;s actually going wrong.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2">
          {PAINS.map((pain) => (
            <PainCard key={pain.title} {...pain} />
          ))}
        </div>

        <p className="landing-meta-line pt-2">
          [ One reference CV · Any job link · Tailored in under a minute ]
        </p>
      </div>
    </section>
  );
}
