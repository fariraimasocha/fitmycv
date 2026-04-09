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
    <section className="bg-muted border-t border-b border-border px-5 py-8 sm:px-10 lg:px-16 xl:px-24">
      <div className="flex flex-col items-center gap-6">
        <p className="font-sans font-semibold text-xs text-muted-foreground/70 text-center tracking-widest uppercase">
          Works with job boards you already use
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12">
          {boards.map((board) => (
            <span
              key={board}
              className="font-outfit font-semibold text-base text-muted-foreground cursor-default hover:text-foreground transition-colors"
            >
              {board}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
