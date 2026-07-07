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

/* ---------- mini visuals (contained) ---------- */

function StackedCVs() {
  return (
    <div className="relative h-36 w-full" aria-hidden="true">
      {[
        { left: "6%", top: 14, rotate: "-6deg" },
        { left: "30%", top: 6, rotate: "-1deg" },
        { left: "54%", top: 0, rotate: "5deg" },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute flex w-24 flex-col gap-1.5 rounded-lg border border-[oklch(0.985_0.012_84_/_0.16)] bg-[oklch(0.985_0.012_84_/_0.1)] p-2.5"
          style={{ left: s.left, top: s.top, height: 122, transform: `rotate(${s.rotate})` }}
        >
          <div className="h-1.5 w-2/3 rounded bg-[oklch(0.985_0.012_84_/_0.4)]" />
          <div className="h-1 w-full rounded bg-[oklch(0.985_0.012_84_/_0.18)]" />
          <div className="h-1 w-full rounded bg-[oklch(0.985_0.012_84_/_0.18)]" />
          <div className="h-1 w-3/4 rounded bg-[oklch(0.985_0.012_84_/_0.18)]" />
        </div>
      ))}
      <div className="absolute bottom-1 right-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-coral)] px-3 py-1.5 shadow-[0_10px_20px_oklch(0.62_0.19_24_/_0.3)]">
        <XIcon size={11} className="text-[oklch(0.99_0.006_84)]" aria-hidden="true" />
        <span className="font-sans text-xs font-bold text-[oklch(0.99_0.006_84)]">
          Rejected
        </span>
      </div>
    </div>
  );
}

function TimeBreakdown() {
  const rows = [
    { label: "Rewriting bullets", pct: 60 },
    { label: "Cover letter", pct: 85 },
    { label: "Formatting", pct: 40 },
  ];
  return (
    <div className="flex flex-col gap-2">
      {rows.map(({ label, pct }) => (
        <div key={label} className="flex items-center gap-2.5">
          <span className="w-24 shrink-0 font-sans text-[11px] font-semibold text-[var(--landing-ink-soft)]">
            {label}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]">
            <div
              className="h-full rounded-full bg-[var(--landing-primary-dark)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function InboxSilence() {
  const rows = [
    { text: "Applied — Acme Corp", faded: false },
    { text: "Applied — TechStart", faded: false },
    { text: "Applied — DataFlow", faded: true },
  ];
  return (
    <div className="flex flex-col gap-1.5" aria-hidden="true">
      {rows.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-2"
        >
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-line)]" />
          <span
            className={`font-sans text-xs font-semibold ${
              item.faded ? "text-[oklch(0.62_0.03_244)]" : "text-[var(--landing-ink-soft)]"
            }`}
          >
            {item.text}
          </span>
        </div>
      ))}
      <span className="pl-1 font-sans text-[11px] font-semibold italic text-[oklch(0.62_0.03_244)]">
        No replies in 30+ days…
      </span>
    </div>
  );
}

function AtsFunnel() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-semibold text-[var(--landing-ink-soft)]">
          Rejected before a human sees it
        </span>
        <span className="font-outfit text-xs font-extrabold text-[var(--landing-coral)]">
          75%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--landing-paper-strong)]">
        <div className="h-full rounded-full bg-[var(--landing-coral)]" style={{ width: "75%" }} />
      </div>
      <div className="flex items-center gap-2 font-sans text-[11px] font-semibold text-[var(--landing-ink-soft)]">
        <span>100 sent</span>
        <span className="h-px flex-1 bg-[var(--landing-line)]" />
        <span className="text-[var(--landing-ink)]">25 read</span>
      </div>
    </div>
  );
}

function KeywordGap() {
  const tags = [
    { label: "React", missing: false },
    { label: "Python", missing: false },
    { label: "Java", missing: true },
    { label: "SQL", missing: true },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ label, missing }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs font-medium ${
            missing
              ? "border-[oklch(0.62_0.19_24_/_0.28)] bg-[oklch(0.92_0.08_24)] text-[var(--landing-coral)]"
              : "border-[oklch(0.47_0.125_177_/_0.22)] bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]"
          }`}
        >
          {missing && <XIcon size={10} weight="bold" aria-hidden="true" />}
          {label}
        </span>
      ))}
    </div>
  );
}

function BurnoutTrend() {
  const bars = [80, 68, 55, 44, 30, 20, 12];
  return (
    <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-[oklch(0.985_0.012_84_/_0.22)]"
          style={{ height: `${h}%`, minHeight: 6 }}
        />
      ))}
    </div>
  );
}

/* ---------- card shells ---------- */

function IconChip({ icon: Icon, tone }) {
  const cls =
    tone === "dark"
      ? "bg-[oklch(0.985_0.012_84_/_0.1)] landing-inset-edge text-[oklch(0.88_0.04_84)]"
      : tone === "coral"
        ? "bg-[oklch(0.92_0.08_24)] text-[var(--landing-coral)]"
        : "landing-icon";
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cls}`}>
      <Icon size={20} aria-hidden="true" />
    </div>
  );
}

function Stat({ value, label, dark }) {
  return (
    <div className="flex items-end gap-2">
      <span
        className={`font-outfit text-3xl font-extrabold leading-none ${
          dark ? "text-[oklch(0.985_0.012_84)]" : "text-[var(--landing-primary-dark)]"
        }`}
      >
        {value}
      </span>
      <span
        className={`pb-0.5 font-sans text-xs font-semibold ${
          dark ? "text-[oklch(0.82_0.035_84)]" : "text-[var(--landing-ink-soft)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// compact vertical card
function PainCard({ icon, tone, title, copy, children, className = "" }) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col gap-3.5 rounded-2xl p-6 ${
        dark ? "landing-card-strong" : "landing-card"
      } ${className}`}
    >
      <IconChip icon={icon} tone={tone} />
      <div className="flex flex-col gap-2">
        <h3
          className={`font-outfit text-lg font-extrabold leading-tight ${
            dark ? "text-[oklch(0.985_0.012_84)]" : "text-[var(--landing-ink)]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`font-sans text-sm leading-relaxed ${
            dark ? "text-[oklch(0.88_0.04_84)]" : "text-[var(--landing-ink-soft)]"
          }`}
        >
          {copy}
        </p>
      </div>
      <div className="mt-auto pt-1">{children}</div>
    </div>
  );
}

export default function PainPoints() {
  return (
    <section className="landing-section">
      <div className="landing-container flex flex-col gap-12">
        {/* Header */}
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <span className="landing-eyebrow">Where applications stall</span>
          <h2 className="landing-heading font-outfit text-3xl font-extrabold sm:text-4xl">
            Sending the same CV
            <br />
            to every job?
          </h2>
          <p className="landing-copy font-sans text-base">
            Most candidates blast out identical applications and wonder why they
            never hear back. Here&apos;s what&apos;s going wrong.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Wide dark intro card */}
          <div className="landing-card-strong flex flex-col gap-6 rounded-2xl p-6 sm:col-span-2 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3 lg:flex-1">
              <IconChip icon={FileXIcon} tone="dark" />
              <h3 className="font-outfit text-lg font-extrabold leading-tight text-[oklch(0.985_0.012_84)]">
                Generic CVs get ignored
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[oklch(0.88_0.04_84)]">
                Recruiters scan for keyword matches. A one-size-fits-all CV gets
                six seconds before the next candidate.
              </p>
            </div>
            <div className="lg:flex-1">
              <StackedCVs />
            </div>
          </div>

          <PainCard
            icon={ClockIcon}
            title="Hours wasted per application"
            copy="Manually tweaking CVs and cover letters eats your evening."
          >
            <div className="flex flex-col gap-3">
              <TimeBreakdown />
              <Stat value="3.5h" label="avg. per application" />
            </div>
          </PainCard>

          <PainCard
            icon={ShieldWarningIcon}
            tone="coral"
            title="ATS filters you out"
            copy="Automated systems reject most CVs before a human ever reads them."
          >
            <AtsFunnel />
          </PainCard>

          <PainCard
            icon={EnvelopeSimpleIcon}
            title="No feedback, no replies"
            copy="You apply and hear nothing. Was it your CV? You never know."
          >
            <InboxSilence />
          </PainCard>

          <PainCard
            icon={CrosshairIcon}
            title="Wrong keywords, wrong role"
            copy="Every job has unique requirements. Your CV needs to mirror them."
          >
            <KeywordGap />
          </PainCard>

          {/* Wide dark closing card */}
          <div className="landing-card-strong flex flex-col gap-6 rounded-2xl p-6 sm:col-span-2 lg:col-span-3 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3 lg:flex-1">
              <IconChip icon={BatteryLowIcon} tone="dark" />
              <h3 className="font-outfit text-lg font-extrabold leading-tight text-[oklch(0.985_0.012_84)]">
                Application burnout is real
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[oklch(0.88_0.04_84)]">
                After 50+ rejections, motivation tanks. The process shouldn&apos;t
                feel this painful.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:flex-1">
              <BurnoutTrend />
              <Stat value="50+" label="applications before burnout" dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
