"use client";

// Free application letter generator, embedded in /blog/job-application-letter.
// Fills the post's own template with what you type. Templates, no AI, nothing
// leaves the tab. Empty optional parts drop out, as the post says to cut a
// paragraph rather than pad it.

import { useMemo, useState } from "react";
import { CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import HandoffCta from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { trackEvent } from "@/lib/analytics";

// pure-region-start
const REQUIRED = ["name", "role", "company", "background"];

/** Trims and drops a trailing full stop so the text reads mid-sentence. Case is
 *  left alone, since lowercasing breaks "MBA", "Excel" and people's names. */
function clause(s = "") {
  return s.trim().replace(/\.$/, "");
}

/** Trims and makes sure a standalone sentence ends with a full stop. */
function sentence(s = "") {
  const t = s.trim();
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/** Builds the letter, or null until the required fields are filled. */
function buildLetter(f) {
  if (REQUIRED.some((k) => !f[k]?.trim())) return null;
  const v = (k) => f[k]?.trim() ?? "";
  const where = v("source") ? ` advertised on ${clause(f.source)}` : "";
  const result = v("result") ? `, where I ${clause(f.result)}` : "";
  const evidence = [
    [f.req1, f.proof1, "Your posting asks for"],
    [f.req2, f.proof2, "You also mention"],
  ]
    .filter(([req, proof]) => req?.trim() && proof?.trim())
    .map(([req, proof, lead], i, all) =>
      `${all.length === 1 ? "Your posting asks for" : lead} ${clause(req)}. ${sentence(proof)}`
    );
  const why = v("why") ? `I would like to join ${v("company")} because ${clause(f.why)}.` : "";
  const contact = [v("phone"), v("email")].filter(Boolean).join(" | ");

  return [
    `Dear ${v("recipient") || "Hiring Manager"},`,
    `I am applying for the ${v("role")} role${where}. I am ${clause(f.background)}${result}.`,
    ...evidence,
    why,
    "My CV is attached. I would welcome the chance to discuss the role.",
    [v("recipient") ? "Yours sincerely," : "Kind regards,", v("name"), contact].filter(Boolean).join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}
// pure-region-end

const FIELDS = [
  { key: "name", label: "Your name", placeholder: "Tendai Moyo" },
  { key: "role", label: "Job title", placeholder: "Accounts Assistant" },
  { key: "company", label: "Company", placeholder: "Swift Freight" },
  { key: "source", label: "Where you saw it (optional)", placeholder: "your careers page" },
  { key: "recipient", label: "Who to address (optional)", placeholder: "Ms Dube" },
  {
    key: "background",
    label: "Finish the sentence: I am...",
    placeholder: "an accounts payable clerk at a wholesale distributor",
    wide: true,
  },
  {
    key: "result",
    label: "Finish the sentence: where I... (optional)",
    placeholder: "process around 400 supplier invoices a month",
    wide: true,
  },
  { key: "req1", label: "A requirement from the posting (optional)", placeholder: "reconciliation experience" },
  {
    key: "proof1",
    label: "What you did that shows it",
    placeholder: "Last year I cleared a backlog of 60 unmatched items in three weeks.",
  },
  { key: "req2", label: "Another requirement (optional)", placeholder: "strong Excel skills" },
  {
    key: "proof2",
    label: "What you did that shows it",
    placeholder: "I built the tracker our team uses for the weekly payment run.",
  },
  {
    key: "why",
    label: "Why this company (optional)",
    placeholder: "your team handles accounts for a fleet across four countries",
    wide: true,
  },
  { key: "phone", label: "Phone (optional)", placeholder: "+263 77 123 4567" },
  { key: "email", label: "Email (optional)", placeholder: "tendai@example.com" },
];

export default function ApplicationLetterGenerator() {
  const [form, setForm] = useState({});
  const { running, ran, start, reset } = useToolRun();
  const ready = REQUIRED.every((k) => form[k]?.trim());
  const letter = useMemo(() => (ran ? buildLetter(form) : null), [ran, form]);

  const field =
    "w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-3 text-sm text-[var(--landing-ink)]";
  const fieldLabel = "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";

  return (
    <div className="landing-card mt-8 rounded-3xl p-4 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
          trackEvent("application_letter_generated", {
            evidence: [form.proof1, form.proof2].filter((p) => p?.trim()).length,
          });
        }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {FIELDS.map((f) => (
          <div key={f.key} className={`flex flex-col gap-2 ${f.wide ? "sm:col-span-2" : ""}`}>
            <label htmlFor={`letter-${f.key}`} className={fieldLabel}>{f.label}</label>
            <input
              id={`letter-${f.key}`}
              value={form[f.key] ?? ""}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, [f.key]: e.target.value }));
                reset();
              }}
              placeholder={f.placeholder}
              className={field}
            />
          </div>
        ))}
        <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center">
          <ToolSubmitButton label="Write my letter" busyLabel="Writing your letter" running={running} disabled={!ready} />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {ready ? "Nothing you type leaves this tab." : "Fill in your name, the job title, the company and your current role."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Writing your letter" lines={5} /> : null}

      {letter ? (
        <div className="landing-rise mt-8 flex flex-col gap-3 border-t border-[var(--landing-line)] pt-8">
          <div className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">Your application letter</p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(letter);
                  toast.success("Letter copied");
                }}
                aria-label="Copy your application letter"
                className="rounded-md p-1.5 text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
              >
                <CopyIcon size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[var(--landing-ink)]">{letter}</p>
          </div>
          <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
            Read it out loud once and change anything that does not sound like you.
          </p>
          <HandoffCta
            title="Letter done. Now match the CV to the same job."
            body="Paste the job link and FitMyCV rewrites your CV and letter against that posting, keeping your real experience."
            label="Tailor my CV to this job"
            source="application_letter"
          />
        </div>
      ) : null}
    </div>
  );
}
