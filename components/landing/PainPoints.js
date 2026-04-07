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
    <section className="bg-background px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <h2 className="font-outfit font-bold text-foreground text-3xl sm:text-4xl tracking-tight leading-tight">
            Sending the same CV
            <br />
            to every job?
          </h2>
          <p className="font-sans text-muted-foreground text-base leading-relaxed">
            Most candidates blast out identical applications and wonder why they never hear
            back. Here&apos;s what&apos;s going wrong.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="flex flex-col w-full gap-4">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Card 1 — dark, CV stack visual */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-foreground rounded-[20px] p-8 gap-3.5 min-h-[280px]">
              <div className="flex flex-col relative z-10 gap-3.5">
                <div className="flex items-center justify-center bg-foreground/70 w-11 h-11 rounded-xl shrink-0">
                  <FileXIcon size={22} className="text-foreground/50" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-bold text-background text-2xl leading-tight tracking-tight">
                  Generic CVs
                  <br />
                  get ignored
                </h3>
                <p className="font-sans text-background/60 text-sm leading-relaxed max-w-[320px]">
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
                    className="absolute bg-foreground/40 rounded-[10px] border border-foreground/20"
                    style={{ width: 180, height: 220, ...s, transform: `rotate(${s.rotate})` }}
                  />
                ))}
                {/* Rejected badge */}
                <div className="absolute flex flex-row items-center gap-1.5 bg-destructive rounded-full px-3.5 py-1.5" style={{ right: 0, bottom: 10 }}>
                  <XIcon size={12} className="text-white" aria-hidden="true" />
                  <span className="font-sans font-semibold text-xs text-white">Rejected</span>
                </div>
              </div>
            </div>

            {/* Card 2 — Hours wasted */}
            <div className="flex-1 flex flex-col justify-between bg-muted rounded-[20px] p-8 border border-border">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-center bg-border w-11 h-11 rounded-xl shrink-0">
                  <ClockIcon size={22} className="text-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-bold text-foreground text-xl leading-tight tracking-tight">
                  Hours wasted
                  <br />
                  per application
                </h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  Manually tweaking CVs and writing cover letters eats your entire evening.
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-outfit font-bold text-foreground text-4xl leading-none tracking-tight">
                  3.5h
                </span>
                <span className="font-sans font-medium text-sm text-muted-foreground pb-1">
                  avg. per application
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Card 3 — ATS filters */}
            <div className="flex-1 flex flex-col bg-muted rounded-[20px] p-8 border border-border gap-5">
              <div className="flex items-center justify-center bg-border w-11 h-11 rounded-xl shrink-0">
                <ShieldWarningIcon size={22} className="text-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-outfit font-bold text-foreground text-xl leading-tight tracking-tight">
                ATS filters
                <br />
                you out
              </h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                Automated tracking systems reject 75% of CVs before a human ever reads them.
              </p>
              {/* Progress bar */}
              <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row items-center justify-between">
                  <span className="font-sans font-medium text-xs text-muted-foreground">
                    Rejection rate
                  </span>
                  <span className="font-outfit font-bold text-xs text-destructive">75%</span>
                </div>
                <div className="w-full bg-border rounded h-2 overflow-hidden">
                  <div className="bg-destructive h-2 rounded w-[75%]" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Card 4 — No feedback */}
            <div className="flex-1 relative overflow-hidden bg-muted rounded-[20px] border border-border">
              <div className="flex flex-col p-8 gap-3.5">
                <div className="flex items-center justify-center bg-border w-11 h-11 rounded-xl shrink-0">
                  <EnvelopeSimpleIcon size={22} className="text-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-bold text-foreground text-xl leading-tight tracking-tight">
                  No feedback,
                  <br />
                  no replies
                </h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
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
                    className="flex flex-row items-center gap-3 bg-background border border-border rounded-[10px] px-4 py-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-border shrink-0" />
                    <span className={`font-sans font-medium text-xs ${item.faded ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                <span className="font-sans font-medium text-xs text-muted-foreground/50 italic">
                  No replies in 30+ days...
                </span>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Card 5 — keyword tags */}
            <div className="flex-1 flex flex-col bg-muted rounded-[20px] p-8 border border-border gap-4">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-center bg-border w-11 h-11 rounded-xl shrink-0">
                  <CrosshairIcon size={22} className="text-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-bold text-foreground text-xl leading-tight tracking-tight">
                  Wrong keywords, wrong role
                </h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
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
                        ? "text-destructive bg-destructive/10 border-destructive/30"
                        : "text-muted-foreground bg-background border-border"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 6 — burnout, dark */}
            <div className="flex-1 flex flex-col justify-between bg-foreground rounded-[20px] p-8 gap-4">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-center bg-foreground/70 w-11 h-11 rounded-xl shrink-0">
                  <BatteryLowIcon size={22} className="text-background/50" aria-hidden="true" />
                </div>
                <h3 className="font-outfit font-bold text-background text-xl leading-tight tracking-tight">
                  Application burnout
                  <br />
                  is real
                </h3>
                <p className="font-sans text-background/60 text-sm leading-relaxed">
                  After 50+ rejections, motivation tanks. The process shouldn&apos;t feel this painful.
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-outfit font-bold text-background text-4xl leading-none tracking-tight">
                  50+
                </span>
                <span className="font-sans font-medium text-sm text-background/50 pb-1">
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
