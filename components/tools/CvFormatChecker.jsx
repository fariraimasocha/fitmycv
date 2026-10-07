"use client";

// Free CV format checker. Reads the CV in the browser and checks it against
// the norms of the country you are applying in. Text only: it cannot see a
// photo, layout or fonts, and says so.

import { useMemo, useState } from "react";
import { CheckIcon, WarningIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { trackEvent } from "@/lib/analytics";

// pure-region-start
const COUNTRIES = {
  za: { name: "South Africa", maxPages: 2, personal: "keep" },
  ng: { name: "Nigeria", maxPages: 2, personal: "ifAsked" },
  in: { name: "India", maxPages: 2, personal: "ifAsked" },
  uk: { name: "the UK", maxPages: 2, personal: "drop" },
  us: { name: "the US", maxPages: 2, personal: "drop" },
};

// ponytail: word count over a typical single column page. A crude page
// estimate, but the tool only sees text, so it is the honest one.
const WORDS_PER_PAGE = 450;

const has = (text, re) => re.test(text);

/** Returns [{ id, ok, title, fix }] for a CV's text and a country code. */
function checkCvFormat(text, country) {
  const c = COUNTRIES[country] ?? COUNTRIES.uk;
  const words = text.split(/\s+/).filter(Boolean).length;
  const pages = Math.max(1, Math.ceil(words / WORDS_PER_PAGE));
  const checks = [];
  const add = (id, ok, title, fix) => checks.push({ id, ok, title, fix });

  add(
    "length",
    pages <= c.maxPages,
    `About ${pages} ${pages === 1 ? "page" : "pages"} long`,
    pages <= c.maxPages
      ? `Within the ${c.maxPages} pages most employers in ${c.name} expect.`
      : `Cut to ${c.maxPages} pages for ${c.name}. Trim roles older than 10 years to one line each.`
  );

  add(
    "email",
    has(text, /[^\s@]+@[^\s@]+\.[a-z]{2,}/i),
    "Email address",
    has(text, /[^\s@]+@[^\s@]+\.[a-z]{2,}/i)
      ? "Found. Use a plain firstname.lastname style address."
      : "No email found. Put it at the top, next to your phone number."
  );

  const dob = has(text, /date of birth|\bd\.?o\.?b\b|born on|\bage\s*:\s*\d/i);
  const marital = has(text, /marital status|\bmarried\b|\bsingle\b|\bdivorced\b/i);
  const extras = has(text, /\bgender\b|\breligion\b|state of origin|\bnationality\b/i);
  const personal = dob || marital || extras;
  if (c.personal === "drop") {
    add(
      "personal",
      !personal,
      "Personal details",
      personal
        ? `Remove date of birth, marital status, gender, religion and nationality. Employers in ${c.name} do not expect them and they invite bias.`
        : `None found. Good, employers in ${c.name} do not expect them.`
    );
  } else if (c.personal === "ifAsked") {
    add(
      "personal",
      !marital,
      "Personal details",
      marital
        ? `Remove marital status. Add date of birth or state of origin only when the posting asks for them.`
        : "Fine. Add date of birth only when the posting asks for it."
    );
  } else {
    add(
      "personal",
      !marital,
      "Personal details",
      marital
        ? "Remove marital status. It has nothing to do with the job."
        : "Fine. Nationality or work permit status and a driver's licence are worth listing in South Africa."
    );
  }

  if (country === "za") {
    const idNumber = has(text, /\b\d{13}\b|\bid (number|no\.?)\b/i);
    add(
      "id",
      !idNumber,
      "ID number",
      idNumber
        ? "Remove your ID number. Share it when an employer asks, usually at offer stage. It is personal information under POPIA."
        : "Not on your CV. Share it only when an employer asks."
    );
  }

  if (country === "ng") {
    const nysc = has(text, /\bnysc\b|national youth service/i);
    add(
      "nysc",
      nysc,
      "NYSC status",
      nysc
        ? "Found. Employers check it, so keep the year you finished or your exemption."
        : "Add your NYSC status: completed with the year, exempted, or currently serving."
    );
  }

  const objective = has(text, /career objective|\bobjective\s*:|^\s*objective\s*$/im);
  add(
    "objective",
    !objective,
    "Career objective",
    objective
      ? "Replace the objective with a three line professional summary about what you offer, not what you want."
      : "No objective statement. Good."
  );

  const onRequest = has(text, /references?\s+(are\s+)?(available\s+)?(up)?on request/i);
  add(
    "references",
    !onRequest,
    "References line",
    onRequest
      ? `Delete "references available on request". Employers assume it.${country === "za" || country === "ng" ? " Or list two referees with phone numbers, which is common here." : ""}`
      : "No filler references line."
  );

  const declaration = has(text, /\bdeclaration\b|hereby declare/i);
  if (country === "in" || declaration) {
    add(
      "declaration",
      !declaration,
      "Declaration",
      declaration
        ? "Drop the \"I hereby declare\" line unless the posting asks for it. Private sector recruiters skip it."
        : "No declaration line. Fine for private sector roles."
    );
  }

  return { pages, words, checks, issues: checks.filter((ch) => !ch.ok).length };
}
// pure-region-end

export default function CvFormatChecker() {
  const [cvText, setCvText] = useState("");
  const [country, setCountry] = useState("za");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();
  const tooShort = cvText.trim().length < 40;

  const result = useMemo(
    () => (ran && !tooShort ? checkCvFormat(cvText, country) : null),
    [ran, tooShort, cvText, country]
  );

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
          trackEvent("cv_format_checked", { country });
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="cv-country" className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            Country you are applying in
          </label>
          <select
            id="cv-country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              reset();
            }}
            className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-3 text-sm text-[var(--landing-ink)] sm:w-72"
          >
            <option value="za">South Africa</option>
            <option value="ng">Nigeria</option>
            <option value="in">India</option>
            <option value="uk">United Kingdom</option>
            <option value="us">United States</option>
          </select>
        </div>

        <ResumeFileField
          id="cv-format-text"
          value={cvText}
          onChange={(text) => {
            setCvText(text);
            reset();
          }}
          onBusyChange={setCvBusy}
        />

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Check my CV format"
            busyLabel="Checking your CV"
            running={running}
            disabled={tooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy ? "Reading your CV" : "Your CV is read in this tab. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Checking your CV" lines={5} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {result.issues === 0
              ? `Your CV fits ${COUNTRIES[country].name}`
              : `${result.issues} ${result.issues === 1 ? "thing" : "things"} to fix for ${COUNTRIES[country].name}`}
          </p>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
            This checks the text only. It cannot see a photo, columns or fonts. Leave the photo off unless the posting asks for one.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {result.checks.map((ch) => (
              <li
                key={ch.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
              >
                {ch.ok ? (
                  <CheckIcon size={16} weight="bold" aria-label="Pass" className="mt-0.5 shrink-0 text-[var(--landing-success)]" />
                ) : (
                  <WarningIcon size={16} weight="bold" aria-label="Fix" className="mt-0.5 shrink-0 text-[var(--landing-coral)]" />
                )}
                <span className="text-sm leading-6 text-[var(--landing-ink)]">
                  <strong className="font-extrabold">{ch.title}.</strong> {ch.fix}
                </span>
              </li>
            ))}
          </ul>
          <HandoffCta
            title="Format fixed. Now fit it to the job."
            body="FitMyCV takes this CV and a job link, then rewrites your summary and top bullets for that posting, with a matching cover letter."
            label="Tailor my CV to a job"
            source="cv_format"
            cvText={cvText}
          />
        </div>
      ) : null}
    </div>
  );
}
