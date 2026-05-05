"use client";

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
  return (
    <section className="landing-section-tight landing-muted-band">
      <div className="landing-container flex flex-col items-center gap-6">
        <p className="font-sans text-center text-xs font-bold uppercase tracking-[0.16em] text-[var(--landing-ink-soft)]">
          Works with job boards you already use
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12">
          {boards.map((board) => (
            <span
              key={board}
              className="cursor-default font-outfit text-base font-bold text-[var(--landing-ink)] opacity-65 transition hover:opacity-100"
            >
              {board}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
