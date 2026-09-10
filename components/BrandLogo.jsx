import Image from "next/image";

import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

export default function BrandLogo({
  size = "md",
  showWordmark = true,
  priority = false,
  className,
  wordmarkClassName,
  alt,
}) {
  const imageAlt = alt ?? (showWordmark ? "" : "FitMyCV");

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/cv-logo.png"
        alt={imageAlt}
        width={512}
        height={512}
        className={cn("shrink-0 object-contain", SIZE_CLASS[size])}
        priority={priority}
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-serif-display tracking-tight text-[var(--landing-ink)]",
            wordmarkClassName,
          )}
        >
          FitMyCV
        </span>
      ) : null}
    </span>
  );
}
