"use client";

// Free weak words checker. Finds the clichés and duty phrases that make a CV
// read like everyone else's, and says what to write instead. Runs in the
// browser.

import { useMemo, useState } from "react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { trackEvent } from "@/lib/analytics";

// pure-region-start
// [phrase, kind, what to do instead]. Matched case-insensitively on word edges.
// ponytail: a fixed list, not a model. Add a phrase here when users ask why
// something obvious was missed.
const WEAK_PHRASES = [
  ["responsible for", "duty", "Start with what you did: Led, Ran, Built, Managed."],
  ["duties included", "duty", "List results, not duties. What changed because you were there?"],
  ["tasked with", "duty", "Say what you delivered instead of what you were given."],
  ["worked on", "vague", "Name your part: Built, Designed, Wrote, Tested."],
  ["helped", "vague", "Say what you did: Supported 12 clients, Cut errors by 20%."],
  ["assisted with", "vague", "Name your share of the work, or the result it produced."],
  ["involved in", "vague", "Say what you owned in it."],
  ["handled", "vague", "Use a precise verb: Resolved, Processed, Negotiated."],
  ["various", "vague", "Name them, or give the count."],
  ["etc", "vague", "Finish the list or cut it to the two items that matter."],
  ["hard-working", "cliche", "Show it: a deadline you hit or the volume you carried."],
  ["hardworking", "cliche", "Show it: a deadline you hit or the volume you carried."],
  ["team player", "cliche", "Name a team result and your part in it."],
  ["results-driven", "cliche", "Delete it and put one real result in its place."],
  ["results driven", "cliche", "Delete it and put one real result in its place."],
  ["detail-oriented", "cliche", "Give proof: an error rate, an audit you passed."],
  ["detail oriented", "cliche", "Give proof: an error rate, an audit you passed."],
  ["self-motivated", "cliche", "Show something you started without being asked."],
  ["self motivated", "cliche", "Show something you started without being asked."],
  ["go-getter", "cliche", "Delete it. Every recruiter skips it."],
  ["think outside the box", "cliche", "Describe the unusual fix you found."],
  ["passionate", "cliche", "Show the evidence: a side project, a course, a result."],
  ["dynamic", "cliche", "Delete it. It says nothing a recruiter can check."],
  ["synergy", "cliche", "Say who you worked with and what it produced."],
  ["excellent communication skills", "cliche", "Show it: a report you wrote, a team you trained."],
  ["proven track record", "cliche", "Replace it with the record: one number."],
  ["fast learner", "cliche", "Name something you learned and how fast you used it."],
  ["quick learner", "cliche", "Name something you learned and how fast you used it."],
  ["best of breed", "cliche", "Delete it."],
  ["go-to person", "cliche", "Say what people came to you for."],
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Lines that look like bullets or role lines, for the numbers check. */
function bulletLines(text) {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.split(/\s+/).length >= 6);
}

/** Returns { found: [{ phrase, kind, fix, count, example }], lines, withNumbers }. */
function findWeakWords(text) {
  const lines = text.split(/\n+/);
  const found = [];
  for (const [phrase, kind, fix] of WEAK_PHRASES) {
    const re = new RegExp(`(^|[^a-z])${escape(phrase)}(?=$|[^a-z])`, "gi");
    const count = (text.match(re) || []).length;
    if (!count) continue;
    // Same advice twice ("hard-working" and "hardworking") reads as a bug.
    if (found.some((f) => f.fix === fix)) {
      found.find((f) => f.fix === fix).count += count;
      continue;
    }
    const one = new RegExp(re.source, "i");
    const example = lines.find((l) => one.test(l))?.trim() ?? "";
    found.push({ phrase, kind, fix, count, example: example.slice(0, 140) });
  }
  found.sort((a, b) => b.count - a.count);
  const bullets = bulletLines(text);
  const withNumbers = bullets.filter((l) => /\d/.test(l)).length;
  return { found, lines: bullets.length, withNumbers };
}
// pure-region-end

const KIND_LABEL = { duty: "Duty phrase", vague: "Vague verb", cliche: "Cliché" };

export default function WeakWordsChecker() {
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();
  const tooShort = cvText.trim().length < 40;

  const result = useMemo(() => (ran && !tooShort ? findWeakWords(cvText) : null), [ran, tooShort, cvText]);
  const total = result?.found.reduce((n, f) => n + f.count, 0) ?? 0;

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
          trackEvent("weak_words_checked");
        }}
        className="flex flex-col gap-5"
      >
        <ResumeFileField
          id="weak-words-text"
          value={cvText}
          onChange={(text) => {
            setCvText(text);
            reset();
          }}
          onBusyChange={setCvBusy}
        />
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Find weak words"
            busyLabel="Reading your CV"
            running={running}
            disabled={tooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy ? "Reading your CV" : "Your CV is read in this tab. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Reading your CV" lines={4} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {total === 0 ? "No weak words found" : `${total} weak ${total === 1 ? "word" : "words"} found`}
          </p>
          {result.lines > 0 ? (
            <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
              {result.withNumbers} of your {result.lines} longer lines have a number in them.
              {result.withNumbers / result.lines < 0.3
                ? " Add a count, a percentage or a time saved to more of them. Numbers are what a recruiter remembers."
                : " Good. Numbers are what a recruiter remembers."}
            </p>
          ) : null}

          {result.found.length ? (
            <ul className="mt-6 flex flex-col gap-3">
              {result.found.map((f) => (
                <li
                  key={f.phrase}
                  className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
                >
                  <p className="text-sm text-[var(--landing-ink)]">
                    <strong className="font-extrabold">&ldquo;{f.phrase}&rdquo;</strong>
                    <span className="ml-2 text-xs font-bold uppercase tracking-widest text-[var(--landing-ink-soft)]">
                      {KIND_LABEL[f.kind]} · {f.count}×
                    </span>
                  </p>
                  {f.example ? (
                    <p className="mt-1 text-xs italic leading-5 text-[var(--landing-ink-soft)]">{f.example}</p>
                  ) : null}
                  <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink)]">{f.fix}</p>
                </li>
              ))}
            </ul>
          ) : null}

          <HandoffCta
            title="Rewrite these for a real job"
            body="FitMyCV rewrites your summary and top bullets against a job posting, in the posting's own words, using only what is already in your CV."
            label="Rewrite my CV for a job"
            source="weak_words"
            cvText={cvText}
          />
        </div>
      ) : null}
    </div>
  );
}
