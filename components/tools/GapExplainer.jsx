"use client";

// Free employment gap explainer. Pick why you were away and for how long,
// get one line for the CV, one for the cover letter and an interview answer.
// Templates, no AI, nothing leaves the tab.

import { useMemo, useState } from "react";
import { CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import HandoffCta from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { trackEvent } from "@/lib/analytics";

// pure-region-start
// cv: the CV line. letter: a cover letter sentence. answer: what to say in an
// interview. Every reason ends on readiness to work, which is the real question.
const REASONS = {
  caregiving: {
    label: "Caring for a family member",
    cv: "Career break: full-time carer for a family member",
    letter: "I took a planned career break to care for a family member, and that responsibility has now ended.",
    answer: "I stepped away to care for a family member. That is now settled, and I am ready to work full time.",
  },
  parenting: {
    label: "Raising children",
    cv: "Career break: full-time parent",
    letter: "I took a career break to raise my children and am now returning to work full time.",
    answer: "I took time out to raise my children. They are settled now, and I am ready to focus on work again.",
  },
  health: {
    label: "Health or recovery",
    cv: "Career break: health and recovery, now fully resolved",
    letter: "I took time away to deal with a health matter, which is now resolved.",
    answer: "I took time off for a health matter. It is resolved and it will not affect my work.",
  },
  layoff: {
    label: "Laid off and job searching",
    cv: "Career break: job search after a company restructure",
    letter: "My role was cut in a restructure, and I have used the time since to choose my next role carefully.",
    answer: "My role was cut in a restructure. Since then I have been choosing roles carefully instead of taking the first offer.",
  },
  study: {
    label: "Study or a course",
    cv: "Full-time study",
    letter: "I took time out to study full time, which gave me skills I will use in this role.",
    answer: "I went back to study full time so I could move into this kind of work.",
  },
  freelance: {
    label: "Freelancing or own business",
    cv: "Self-employed: freelance and own business",
    letter: "I spent this time running my own work, which taught me to find clients, price work and deliver alone.",
    answer: "I ran my own work. It taught me a lot, and now I want to do that work inside a team again.",
  },
  relocation: {
    label: "Moving country or city",
    cv: "Career break: relocation",
    letter: "I took a short break to relocate, and I am now settled and available to start.",
    answer: "I moved and took time to settle in properly. I am settled now and ready to start.",
  },
  travel: {
    label: "Travel",
    cv: "Career break: planned travel",
    letter: "I took a planned break to travel and came back ready for a long term role.",
    answer: "I planned a break to travel. I did it on purpose, and I am back and looking for a role to commit to.",
  },
};

/** Whole months from "YYYY-MM" to "YYYY-MM", or null if either is missing or reversed. */
function monthsBetween(from, to) {
  const m = (s) => /^(\d{4})-(\d{2})$/.exec(s ?? "");
  const a = m(from);
  const b = m(to);
  if (!a || !b) return null;
  const n = (Number(b[1]) - Number(a[1])) * 12 + (Number(b[2]) - Number(a[2]));
  return n >= 0 ? n : null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const label = (s) => `${MONTHS[Number(s.slice(5, 7)) - 1]} ${s.slice(0, 4)}`;

/** Builds the three texts. `did` is optional: a course, volunteering, a project. */
function explainGap({ reason, from, to, did = "" }) {
  const r = REASONS[reason];
  const months = monthsBetween(from, to);
  if (!r || months === null) return null;
  const extra = did.trim().replace(/\.$/, "");
  const extraCv = extra ? `. ${extra[0].toUpperCase()}${extra.slice(1)}` : "";
  const extraSpoken = extra ? ` During that time I also ${extra[0].toLowerCase()}${extra.slice(1)}.` : "";
  return {
    months,
    short: months < 3,
    cv: `${label(from)} to ${label(to)}. ${r.cv}${extraCv}.`,
    letter: r.letter + extraSpoken,
    answer: r.answer + extraSpoken,
  };
}
// pure-region-end

function CopyBlock({ title, text }) {
  return (
    <div className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">{title}</p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(text);
            toast.success("Copied");
          }}
          aria-label={`Copy ${title.toLowerCase()}`}
          className="rounded-md p-1.5 text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
        >
          <CopyIcon size={16} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink)]">{text}</p>
    </div>
  );
}

export default function GapExplainer() {
  const [reason, setReason] = useState("caregiving");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [did, setDid] = useState("");
  const { running, ran, start, reset } = useToolRun();
  const months = monthsBetween(from, to);

  const result = useMemo(
    () => (ran ? explainGap({ reason, from, to, did }) : null),
    [ran, reason, from, to, did]
  );

  const field =
    "w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-3 text-sm text-[var(--landing-ink)]";
  const fieldLabel = "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";
  const change = (set) => (e) => {
    set(e.target.value);
    reset();
  };

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
          trackEvent("gap_explained", { reason, months });
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="gap-reason" className={fieldLabel}>Why were you away?</label>
          <select id="gap-reason" value={reason} onChange={change(setReason)} className={field}>
            {Object.entries(REASONS).map(([key, r]) => (
              <option key={key} value={key}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="gap-from" className={fieldLabel}>Gap started</label>
            <input id="gap-from" type="month" value={from} onChange={change(setFrom)} className={field} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="gap-to" className={fieldLabel}>Gap ended</label>
            <input id="gap-to" type="month" value={to} onChange={change(setTo)} className={field} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="gap-did" className={fieldLabel}>Anything you did during it (optional)</label>
          <input
            id="gap-did"
            value={did}
            onChange={change(setDid)}
            placeholder="Completed a Google Data Analytics certificate"
            className={field}
          />
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Explain my gap"
            busyLabel="Writing your lines"
            running={running}
            disabled={months === null}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {from && to && months === null ? "The end month must come after the start month." : "Nothing you type leaves this tab."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Writing your lines" lines={3} /> : null}

      {result ? (
        <div className="landing-rise mt-8 flex flex-col gap-3 border-t border-[var(--landing-line)] pt-8">
          {result.short ? (
            <p className="text-sm leading-6 text-[var(--landing-ink)]">
              <strong className="font-extrabold">You may not need this.</strong> A gap under 3 months rarely needs explaining. Show years only on your CV dates and it disappears.
            </p>
          ) : null}
          <CopyBlock title="On your CV" text={result.cv} />
          <CopyBlock title="In your cover letter" text={result.letter} />
          <CopyBlock title="In the interview" text={result.answer} />
          <HandoffCta
            title="Gap handled. Now fit the rest of your CV."
            body="FitMyCV rewrites your CV and cover letter for a specific job posting, so the gap is one line and your experience does the talking."
            label="Tailor my CV to a job"
            source="gap_explainer"
          />
        </div>
      ) : null}
    </div>
  );
}
