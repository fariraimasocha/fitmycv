import { SpinnerGapIcon } from "@phosphor-icons/react";

export default function Loader({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
    >
      <SpinnerGapIcon
        size={32}
        className="text-muted-foreground animate-spin"
      />
    </div>
  );
}
