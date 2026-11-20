"use client";

// Job posting saver used by /save-job-posting-as-pdf. The server reads the
// page (/api/tools/job-save); everything after that happens in the browser.
//
// ponytail: "Save as PDF" is the browser's own print dialog, with print CSS in
// globals.css (.job-print-area) hiding the rest of the page. No PDF library.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { FilePdfIcon, WarningIcon } from "@phosphor-icons/react";

import { CtaCard } from "@/components/tools/HandoffCta";
import { CopyButton, ToolPreview, ToolProgress, ToolSubmitButton } from "@/components/tools/tool-run";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { toUrl } from "@/lib/ats-detect";
import { trackEvent } from "@/lib/analytics";

const PREVIEW = [
  { title: "The full posting", body: "The text of the page as written, with its link and today's date on top." },
  { title: "A PDF", body: "Saved through your browser's print window, so you keep it after the posting closes." },
  { title: "Text you can copy", body: "Paste it into your notes or into the other tools here." },
];

async function fetchPosting(url) {
  let res;
  try {
    res = await fetch("/api/tools/job-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // fetch only rejects when the request never arrived: offline, or blocked.
    throw new Error(
      "We couldn't reach FitMyCV. Check your connection and try again. Your link is still in the box."
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "We couldn't open that posting. Try again.");
  return { ...data, savedAt: new Date() };
}

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "job";
  }
};

export default function JobPostingSaver() {
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();
  const [value, setValue] = useState("");
  const [notALink, setNotALink] = useState(false);
  const save = useMutation({
    mutationFn: fetchPosting,
    onError: () => trackEvent("tool_error", { tool: "job_saver" }),
  });
  const posting = save.data;
  const error = notALink
    ? "That does not look like a link. Copy the full address of the job page from your browser."
    : save.isError
      ? save.error.message
      : null;

  const onSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    // Checked here so a typo never costs a request. The route checks it again.
    const url = toUrl(value);
    if (!url) {
      setNotALink(true);
      return;
    }
    trackEvent("tool_run", { tool: "job_saver" });
    save.mutate(url.href);
  };

  const savePdf = () => {
    const previous = document.title;
    document.title = `job-posting-${hostOf(posting.url)}-${posting.savedAt.toISOString().slice(0, 10)}`;
    window.print();
    document.title = previous;
  };

  const tailor = () => {
    saveAtsHandoff({ jobText: posting.text, source: "job_saver" });
    trackEvent("job_saver_cta", { signed_in: Boolean(session?.user) });
    const dest = "/dashboard/tailor";
    if (session?.user) {
      router.push(dest);
      return;
    }
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label htmlFor="job-save-url" className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
          Job posting link
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="job-save-url"
            type="text"
            inputMode="url"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setNotALink(false);
            }}
            placeholder="https://www.linkedin.com/jobs/view/..."
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
          />
          <div className="shrink-0">
            <ToolSubmitButton
              label="Save posting"
              busyLabel="Reading"
              running={save.isPending}
              disabled={!value.trim()}
            />
          </div>
        </div>
        <p className="mt-2 text-xs font-semibold text-[var(--landing-ink-soft)]">
          Paste the link from LinkedIn, a company careers page or a job board. We read the page once and store nothing.
        </p>
      </form>

      {save.isPending ? <ToolProgress message="Reading the posting" lines={5} /> : null}

      {error && !save.isPending ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-[oklch(0.75_0.14_75_/_0.35)] bg-[oklch(0.75_0.14_75_/_0.09)] px-4 py-2.5 text-sm leading-6 text-[var(--landing-ink)]"
        >
          <WarningIcon size={16} aria-hidden="true" className="mt-1 shrink-0 text-[var(--landing-accent)]" />
          {error}
        </p>
      ) : null}

      {!posting && !save.isPending ? <ToolPreview items={PREVIEW} /> : null}

      {posting && !save.isPending ? (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={savePdf} className="landing-primary-btn font-outfit text-sm">
              <FilePdfIcon size={16} aria-hidden="true" />
              Save as PDF
            </button>
            <CopyButton
              tool="job_saver"
              text={posting.text}
              message="Posting copied"
              ariaLabel="Copy the posting text"
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-[var(--landing-ink-soft)]">
            In the print window, set the destination to Save as PDF.
          </p>

          <article className="job-print-area mt-6 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5 sm:p-7">
            <p className="break-all text-xs font-semibold text-[var(--landing-ink-soft)]">
              Saved from {posting.url} on{" "}
              {posting.savedAt.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="mt-4 max-h-125 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-7 text-[var(--landing-ink)] print:max-h-none print:overflow-visible">
              {posting.text}
            </div>
          </article>

          <CtaCard
            title="Saved. Now tailor your CV to it."
            body="FitMyCV rewrites your own CV around this posting, using its words and your real experience."
            label="Tailor my CV"
            onClick={tailor}
          />
        </div>
      ) : null}
    </div>
  );
}
