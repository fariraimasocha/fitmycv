import { SpinnerGapIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function Loader({ className, fullPage = true }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullPage && "min-h-screen",
        className,
      )}
    >
      <SpinnerGapIcon
        size={32}
        className="text-muted-foreground animate-spin"
      />
    </div>
  );
}
