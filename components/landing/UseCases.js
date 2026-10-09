import { useTranslations } from "next-intl";

const CASES = ["analyst", "nurse", "developer"];

const highlight = {
  k: (chunks) => (
    <mark className="rounded-sm bg-[var(--landing-accent)]/15 px-0.5 text-[var(--landing-ink)]">
      {chunks}
    </mark>
  ),
};

// Written examples, not user results. The "before" line already holds the
// facts, so the "after" line only rewords them in the job's language.
export default function UseCases() {
  const t = useTranslations("landing.useCases");

  return (
    <section id="examples" className="landing-section">
      <div className="landing-container">
        <span className="landing-eyebrow-plain">
          {t("eyebrow")}
        </span>
        <h2
          className="font-outfit mt-4 max-w-2xl font-medium text-[var(--landing-ink)]"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
        >
          {t("title")}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--landing-ink-soft)]">
          {t("intro")}
        </p>

        <ul className="mt-8 grid gap-5 lg:grid-cols-3">
          {CASES.map((key) => (
            <li
              key={key}
              className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[var(--landing-shadow-sm)] sm:p-6"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--landing-ink-soft)]">
                  {t("jobLabel")}
                </p>
                <p className="font-outfit mt-2 text-lg font-semibold text-[var(--landing-ink)]">
                  {t(`cases.${key}.role`)}
                </p>
                <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
                  {t.rich(`cases.${key}.asks`, highlight)}
                </p>
              </div>

              <div className="flex flex-col gap-3 text-sm leading-relaxed">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--landing-ink-soft)]">
                    {t("beforeLabel")}
                  </p>
                  <p className="mt-1 text-[var(--landing-ink-soft)]">
                    {t(`cases.${key}.before`)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--landing-ink-soft)]">
                    {t("afterLabel")}
                  </p>
                  <p className="mt-1 border-s-3 border-[var(--landing-accent)] ps-3 font-medium text-[var(--landing-ink)]">
                    {t.rich(`cases.${key}.after`, highlight)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-[var(--landing-ink-soft)]">{t("footnote")}</p>
      </div>
    </section>
  );
}
