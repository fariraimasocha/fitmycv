import { cn } from "@/lib/utils";

export function gradeChipClass(grade) {
  if (!grade || grade === "N/A") {
    return "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]";
  }
  const letter = String(grade).charAt(0);
  if (letter === "A") {
    return "border border-[var(--landing-line)] bg-[#eef8f1] text-[var(--landing-success)]";
  }
  if (letter === "B") {
    return "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink)]";
  }
  if (letter === "C") {
    return "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]";
  }
  return "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-accent)]";
}

export function GradeBadge({ grade, className, size = "sm" }) {
  if (!grade) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs",
        gradeChipClass(grade),
        className
      )}
    >
      {grade}
    </span>
  );
}

export function AtsScoreChip({ score, loading, className, onClick }) {
  const label = loading ? "ATS…" : typeof score === "number" ? `ATS ${score}` : "ATS —";
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--landing-ink)]",
        onClick && "transition-colors hover:border-[var(--landing-ink)]",
        className
      )}
    >
      {label}
    </Comp>
  );
}
