"use client";

// Quiet secondary next step between free tools. Keeps Hick's law: one
// primary CTA above, one optional feeder link below.

import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { saveAtsHandoff, saveCvHandoff, saveJobDraft } from "@/lib/ats-handoff";

export default function ToolSiblingLink({
  href,
  label,
  source,
  cvText = "",
  jobText = "",
  className = "mt-4 text-center text-sm font-semibold text-[var(--landing-ink-soft)]",
}) {
  const onClick = () => {
    trackEvent("tool_feeder_click", { source, href });
    const job = jobText.trim();
    const cv = cvText.trim();
    if (job) {
      saveJobDraft(job);
      saveAtsHandoff({ jobText: job, source });
    }
    if (cv) saveCvHandoff(cv, source);
  };

  return (
    <p className={className}>
      <Link
        href={href}
        onClick={onClick}
        className="underline underline-offset-4 hover:text-[var(--landing-accent)]"
      >
        {label}
      </Link>
    </p>
  );
}
