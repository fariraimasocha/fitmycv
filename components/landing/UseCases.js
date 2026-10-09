import { useTranslations } from "next-intl";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import RevealWords from "@/components/landing/RevealWords";

const CASES = ["analyst", "nurse", "developer"];

const highlight = {
  k: (chunks) => (
    <mark className="rounded-sm bg-[var(--landing-accent-soft)] px-0.5 text-[var(--landing-ink)] decoration-[var(--landing-accent)] underline decoration-1 underline-offset-3">
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
        <RevealWords text={t("title")} className="mt-4 max-w-2xl font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl" />
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--landing-ink-soft)]">
          {t("intro")}
        </p>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {CASES.map((key) => (
            <li key={key} className="bezel flex flex-col">
              {/* The rewrite is the preview: before on top, the tailored
                  line under it with the job's words marked. */}
              <div className="bezel-inner flex flex-1 flex-col gap-4 p-5 text-sm leading-relaxed">
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--landing-ink-faint)]">
                    {t("beforeLabel")}
                  </p>
                  <p className="mt-1.5 text-[var(--landing-ink-soft)]">
                    {t(`cases.${key}.before`)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[var(--landing-accent)]" aria-hidden="true">
                  <span className="h-px flex-1 bg-[var(--landing-line)]" />
                  <ArrowDownIcon size={14} weight="bold" />
                  <span className="h-px flex-1 bg-[var(--landing-line)]" />
                </div>

                <div className="rounded-xl bg-[var(--landing-surface)] p-4">
                  <p className="tag-accent">{t("afterLabel")}</p>
                  <p className="mt-2 font-medium text-[var(--landing-ink)]">
                    {t.rich(`cases.${key}.after`, highlight)}
                  </p>
                </div>
              </div>

              <div className="px-3.5 pb-2.5 pt-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--landing-ink-faint)]">
                  {t("jobLabel")}
                </p>
                <p className="mt-1 font-outfit text-sm font-semibold text-[var(--landing-ink)]">
                  {t(`cases.${key}.role`)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--landing-ink-soft)]">
                  {t.rich(`cases.${key}.asks`, highlight)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-[var(--landing-ink-soft)]">{t("footnote")}</p>
      </div>
    </section>
  );
}
