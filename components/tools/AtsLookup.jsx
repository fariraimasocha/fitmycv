"use client";

// "Which ATS does this company use?" lookup on /ats. Reads the vendor off the
// pasted link in the browser (lib/ats-detect.js). No request, no guessing.

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";

import { detectAts, toUrl } from "@/lib/ats-detect";

export default function AtsLookup() {
  const [value, setValue] = useState("");
  const typed = value.trim();
  const url = typed ? toUrl(typed) : null;
  const vendor = url ? detectAts(typed) : null;

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <label htmlFor="ats-lookup-url" className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
        Job or careers link
      </label>
      <input
        id="ats-lookup-url"
        type="text"
        inputMode="url"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="https://job-boards.greenhouse.io/stripe/jobs/..."
        autoComplete="off"
        spellCheck={false}
        className="mt-2 w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
      />
      <p className="mt-3 text-xs font-semibold text-[var(--landing-ink-soft)]">
        Open a job and copy the link from the Apply page. The check runs as you type and nothing is sent anywhere.
      </p>

      <div aria-live="polite">
        {!typed ? null : !url ? (
          <Notice>That does not look like a link. Copy the full address from your browser.</Notice>
        ) : vendor ? (
          <div className="mt-6 rounded-2xl border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.07)] p-5">
            <p className="flex items-center gap-2 font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
              <CheckCircleIcon size={20} weight="fill" aria-hidden="true" className="text-[var(--landing-success)]" />
              This job is on {vendor.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
              The link points at {url.hostname}, which belongs to {vendor.name}.
            </p>
            <Link
              href={vendor.guide}
              className="mt-4 inline-flex items-center gap-1.5 font-outfit text-sm font-extrabold text-[var(--landing-primary-dark)] underline underline-offset-4"
            >
              How to format your CV for it
              <ArrowRightIcon size={13} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <Notice>
            We can&apos;t tell from this link. It points at {url.hostname}, which is not a hiring system we know.
            Many companies show jobs on their own site and send you elsewhere to apply. Open one job, click Apply,
            and paste that link instead.
          </Notice>
        )}
      </div>
    </div>
  );
}

function Notice({ children }) {
  return (
    <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-[oklch(0.75_0.14_75_/_0.35)] bg-[oklch(0.75_0.14_75_/_0.09)] px-4 py-2.5 text-sm leading-6 text-[var(--landing-ink)]">
      <WarningIcon size={15} weight="bold" aria-hidden="true" className="mt-1 shrink-0 text-[var(--landing-accent)]" />
      <span>{children}</span>
    </p>
  );
}
