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
    <section
      className="bg-[#F8FAFC] border-t border-b border-[#E2E8F0] px-5 sm:px-8 md:px-16 lg:px-[100px] xl:px-[140px] py-8"
    >
      <div className="flex flex-col items-center gap-6">
        <p
          className="text-[#94A3B8] text-center"
          style={{
            fontFamily: "var(--font-sn-pro)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          WORKS WITH JOB BOARDS YOU ALREADY USE
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {boards.map((board) => (
            <span
              key={board}
              className="text-[#94A3B8] cursor-default hover:text-[#64748B] transition-colors text-sm md:text-base"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
              }}
            >
              {board}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
