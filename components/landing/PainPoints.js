"use client";

import {
  FileXIcon,
  ClockIcon,
  ShieldWarningIcon,
  EnvelopeSimpleIcon,
  CrosshairIcon,
  BatteryLowIcon,
  XIcon,
} from "@phosphor-icons/react";

export default function PainPoints() {
  return (
    <section className="landing-section">
      <div className="landing-container flex flex-col gap-14">
        {/* Header */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <span className="landing-eyebrow">Where applications stall</span>
          <h2 className="landing-heading font-outfit font-extrabold text-3xl sm:text-4xl">
            Sending the same CV
            <br />
            to every job?
          </h2>
          <p className="landing-copy font-sans text-base">
            Most candidates blast out identical applications and wonder why they never hear
            back. Here&apos;s what&apos;s going wrong.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="flex flex-col w-full gap-4">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Card 1 — dark, CV stack visual */}
            <div className="landing-card-strong flex-1 flex flex-col relative overflow-hidden rounded-2xl p-8 gap-3.5 min-h-[280px]">
              <div className="flex flex-col relative z-10 gap-3.5">
                <div className="flex items-center justify-center bg-[oklch(0.985_0.012_84_/_0.1)] w-11 h-11 rounded-xl shrink-0 landing-inset-edge">
                  <FileXIcon size={22} className="text-[oklch(0.88_0.04_84)]" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-extrabold text-[oklch(0.985_0.012_84)] text-2xl leading-tight">
                  Generic CVs
                  <br />
                  get ignored
                </h3>
                <p className="font-sans text-[oklch(0.88_0.04_84)] text-sm leading-relaxed max-w-[320px]">
                  Recruiters scan for keyword matches. A one-size-fits-all CV rarely hits the
                  mark — it gets 6 seconds of attention before the next candidate.
                </p>
              </div>

              {/* CV Stack Visual — hidden on small screens */}
              <div
                className="hidden sm:block absolute max-w-full"
                style={{ right: 0, top: 40, width: 380, height: 240, maxWidth: "60%" }}
                aria-hidden="true"
              >
                {[
                  { left: 0, top: 20, rotate: "-3deg" },
                  { left: 60, top: 10, rotate: "1deg" },
                  { left: 120, top: 0, rotate: "4deg" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="absolute rounded-[10px] border border-[oklch(0.985_0.012_84_/_0.14)] bg-[oklch(0.985_0.012_84_/_0.12)]"
                    style={{ width: 180, height: 220, ...s, transform: `rotate(${s.rotate})` }}
                  />
                ))}
                {/* Rejected badge */}
                <div className="absolute flex flex-row items-center gap-1.5 bg-[var(--landing-coral)] rounded-full px-3.5 py-1.5 shadow-[0_10px_20px_oklch(0.62_0.19_24_/_0.24)]" style={{ right: 0, bottom: 10 }}>
                  <XIcon size={12} className="text-[oklch(0.99_0.006_84)]" aria-hidden="true" />
                  <span className="font-sans font-bold text-xs text-[oklch(0.99_0.006_84)]">Rejected</span>
                </div>
              </div>
            </div>

            {/* Card 2 — Hours wasted */}
            <div className="landing-card flex-1 flex flex-col justify-between rounded-2xl p-8">
              <div className="flex flex-col gap-3.5">
                <div className="landing-icon flex items-center justify-center w-11 h-11 rounded-xl shrink-0">
                  <ClockIcon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-xl leading-tight">
                  Hours wasted
                  <br />
                  per application
                </h3>
                <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed">
                  Manually tweaking CVs and writing cover letters eats your entire evening.
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-outfit font-extrabold text-[var(--landing-primary-dark)] text-4xl leading-none">
                  3.5h
                </span>
                <span className="font-sans font-semibold text-sm text-[var(--landing-ink-soft)] pb-1">
                  avg. per application
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Card 3 — ATS filters */}
            <div className="landing-card flex-1 flex flex-col rounded-2xl p-8 gap-5">
              <div className="flex items-center justify-center bg-[oklch(0.92_0.08_24)] text-[var(--landing-coral)] w-11 h-11 rounded-xl shrink-0">
                <ShieldWarningIcon size={22} aria-hidden="true" />
              </div>
              <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-xl leading-tight">
                ATS filters
                <br />
                you out
              </h3>
              <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed">
                Automated tracking systems reject 75% of CVs before a human ever reads them.
              </p>
              {/* Progress bar */}
              <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row items-center justify-between">
                  <span className="font-sans font-semibold text-xs text-[var(--landing-ink-soft)]">
                    Rejection rate
                  </span>
                  <span className="font-outfit font-extrabold text-xs text-[var(--landing-coral)]">75%</span>
                </div>
                <div className="w-full bg-[var(--landing-paper-strong)] rounded h-2 overflow-hidden">
                  <div className="bg-[var(--landing-coral)] h-2 rounded w-[75%]" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Card 4 — No feedback */}
            <div className="landing-card flex-1 relative overflow-hidden rounded-2xl">
              <div className="flex flex-col p-8 gap-3.5">
                <div className="landing-icon flex items-center justify-center w-11 h-11 rounded-xl shrink-0">
                  <EnvelopeSimpleIcon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-xl leading-tight">
                  No feedback,
                  <br />
                  no replies
                </h3>
                <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed">
                  You apply and hear nothing. Was it your CV? Your experience? You never know.
                </p>
              </div>

              {/* Inbox Visual — only shown on larger screens */}
              <div
                className="hidden lg:flex absolute flex-col gap-2.5"
                style={{ left: 400, top: 24, width: 340 }}
                aria-hidden="true"
              >
                {[
                  { text: "Application received — Acme Corp", faded: false },
                  { text: "Application received — TechStart", faded: false },
                  { text: "Application received — DataFlow", faded: true },
                  { text: "Application received — Nexus AI", faded: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-row items-center gap-3 bg-[var(--landing-paper-soft)] border border-[var(--landing-line)] rounded-[10px] px-4 py-3 shadow-[0_8px_18px_oklch(0.205_0.035_244_/_0.06)]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--landing-line)] shrink-0" />
                    <span className={`font-sans font-semibold text-xs ${item.faded ? "text-[oklch(0.57_0.035_244)]" : "text-[var(--landing-ink-soft)]"}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                <span className="font-sans font-semibold text-xs text-[oklch(0.57_0.035_244)] italic">
                  No replies in 30+ days...
                </span>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Card 5 — keyword tags */}
            <div className="landing-card flex-1 flex flex-col rounded-2xl p-8 gap-4">
              <div className="flex flex-col gap-3.5">
                <div className="landing-icon flex items-center justify-center w-11 h-11 rounded-xl shrink-0">
                  <CrosshairIcon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-xl leading-tight">
                  Wrong keywords, wrong role
                </h3>
                <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed">
                  Each job description has unique requirements. Your CV needs to mirror them.
                </p>
              </div>
              {/* Keyword tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "React", missing: false },
                  { label: "Python", missing: false },
                  { label: "Java ✕", missing: true },
                  { label: "SQL ✕", missing: true },
                ].map(({ label, missing }) => (
                  <span
                    key={label}
                    className={`font-sans font-medium text-xs rounded-full px-3 py-1.5 border ${
                      missing
                        ? "text-[var(--landing-coral)] bg-[oklch(0.92_0.08_24)] border-[oklch(0.62_0.19_24_/_0.28)]"
                        : "text-[var(--landing-primary-dark)] bg-[var(--landing-primary-soft)] border-[oklch(0.47_0.125_177_/_0.22)]"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 6 — burnout, dark */}
            <div className="landing-card-strong flex-1 flex flex-col justify-between rounded-2xl p-8 gap-4">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-center bg-[oklch(0.985_0.012_84_/_0.1)] w-11 h-11 rounded-xl shrink-0 landing-inset-edge">
                  <BatteryLowIcon size={22} className="text-[oklch(0.88_0.04_84)]" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-extrabold text-[oklch(0.985_0.012_84)] text-xl leading-tight">
                  Application burnout
                  <br />
                  is real
                </h3>
                <p className="font-sans text-[oklch(0.88_0.04_84)] text-sm leading-relaxed">
                  After 50+ rejections, motivation tanks. The process shouldn&apos;t feel this painful.
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-outfit font-extrabold text-[oklch(0.985_0.012_84)] text-4xl leading-none">
                  50+
                </span>
                <span className="font-sans font-semibold text-[oklch(0.82_0.035_84)] text-sm pb-1">
                  applications before burnout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
