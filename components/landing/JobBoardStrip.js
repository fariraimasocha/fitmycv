import { useTranslations } from "next-intl";

const boards = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Remotive",
  "Greenhouse",
  "Lever",
  "Workday",
  "AngelList",
];

export default function JobBoardStrip() {
  const t = useTranslations("landing.jobBoards");

  return (
    <section className="landing-section-tight landing-muted-band overflow-hidden">
      <div className="flex flex-col items-center gap-6">
        <p className="font-sans text-center text-xs font-bold uppercase tracking-[0.16em] text-[var(--landing-ink-soft)]">
          {t("title")}
        </p>

        {/* Marquee with edge fade */}
        <div
          className="relative w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="landing-marquee-track flex w-max items-center gap-12 md:gap-16">
            {[...boards, ...boards].map((board, i) => (
              <span
                key={`${board}-${i}`}
                aria-hidden={i >= boards.length}
                className="cursor-default font-outfit text-base font-bold text-[var(--landing-ink)] opacity-65 transition hover:opacity-100"
              >
                {board}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
