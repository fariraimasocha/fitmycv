"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  SearchCheck,
  Sparkles,
} from "lucide-react";

const artifactMotion = {
  hidden: { opacity: 0, y: 18, rotate: 0 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 + index * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const artifactHover = {
  y: -5,
  transition: { duration: 0.18, ease: "easeOut" },
};

function ArtifactShell({ children, className = "", index = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      custom={index}
      variants={artifactMotion}
      initial="hidden"
      animate="visible"
      whileHover={reduceMotion ? undefined : artifactHover}
      className={`border border-[var(--landing-line)] bg-[oklch(0.997_0.006_84)] shadow-[0_20px_42px_oklch(0.205_0.035_244_/_0.10),0_4px_12px_oklch(0.205_0.035_244_/_0.06)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ResumeSheet() {
  return (
    <ArtifactShell
      index={0}
      className="relative z-20 w-full rounded-[18px] p-5 sm:p-6 md:absolute md:left-[9%] md:top-10 md:w-[42%] md:-rotate-2"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-outfit text-xl font-extrabold leading-none text-[var(--landing-ink)]">
            Farirai M.
          </p>
          <p className="mt-1 text-xs font-semibold text-[var(--landing-ink-soft)]">
            Product Engineer
          </p>
        </div>
        <div className="rounded-full bg-[var(--landing-primary-soft)] px-3 py-1 text-xs font-extrabold text-[var(--landing-primary-dark)]">
          CV
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-2.5 w-10/12 rounded-full bg-[oklch(0.33_0.04_244_/_0.16)]" />
        <div className="h-2.5 w-8/12 rounded-full bg-[oklch(0.33_0.04_244_/_0.12)]" />
        <div className="h-2.5 w-11/12 rounded-full bg-[oklch(0.33_0.04_244_/_0.12)]" />
      </div>

      <div className="mt-6 rounded-xl border border-[oklch(0.47_0.125_177_/_0.18)] bg-[oklch(0.92_0.06_174_/_0.55)] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--landing-primary-dark)]">
          <Sparkles size={16} aria-hidden="true" />
          Tailored highlights
        </div>
        <ul className="space-y-2 text-sm font-semibold text-[var(--landing-ink)]">
          <li className="flex items-center gap-2">
            <CheckCircle2
              size={15}
              className="text-[var(--landing-success)]"
              aria-hidden="true"
            />
            Payment systems experience first
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2
              size={15}
              className="text-[var(--landing-success)]"
              aria-hidden="true"
            />
            Matched to Stripe job language
          </li>
        </ul>
      </div>
    </ArtifactShell>
  );
}

function JobBrief() {
  return (
    <ArtifactShell
      index={1}
      className="z-10 rounded-[18px] p-5 md:absolute md:right-[8%] md:top-3 md:w-[38%] md:rotate-2"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-ink)] text-[oklch(0.99_0.006_84)]">
          <BriefcaseBusiness size={19} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--landing-ink-soft)]">
            Job link
          </p>
          <h2 className="mt-1 font-outfit text-lg font-extrabold leading-tight text-[var(--landing-ink)]">
            Senior Software Engineer
          </h2>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {["TypeScript", "Payments", "APIs", "Reliability"].map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[var(--landing-line)] bg-[oklch(0.985_0.012_84)] px-3 py-1 text-xs font-bold text-[var(--landing-ink-soft)]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 border-t border-[var(--landing-line)] pt-4">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--landing-ink-soft)]">
          <span>Keyword coverage</span>
          <span className="text-[var(--landing-primary-dark)]">18/21</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[oklch(0.885_0.025_83)]">
          <div className="h-full w-[86%] rounded-full bg-[var(--landing-primary-dark)]" />
        </div>
      </div>
    </ArtifactShell>
  );
}

function MatchStamp() {
  return (
    <ArtifactShell
      index={2}
      className="z-30 flex items-center gap-4 rounded-[999px] px-5 py-4 md:absolute md:left-[36%] md:top-[41%] md:-rotate-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)]">
        <BadgeCheck size={24} aria-hidden="true" />
      </div>
      <div>
        <p className="font-outfit text-3xl font-extrabold leading-none text-[var(--landing-ink)]">
          94%
        </p>
        <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--landing-ink-soft)]">
          ATS match
        </p>
      </div>
    </ArtifactShell>
  );
}

function CoverLetterNote() {
  return (
    <ArtifactShell
      index={3}
      className="z-20 rounded-[18px] bg-[oklch(0.96_0.048_88)] p-5 md:absolute md:bottom-8 md:left-[13%] md:w-[34%] md:rotate-3"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-[var(--landing-ink)]">
        <FileText size={17} aria-hidden="true" />
        Cover letter
      </div>
      <p className="text-sm font-semibold leading-6 text-[var(--landing-ink-soft)]">
        &quot;Your work on reliable payments maps directly to Stripe&apos;s
        infrastructure team.&quot;
      </p>
    </ArtifactShell>
  );
}

function InterviewPrepCard() {
  return (
    <ArtifactShell
      index={4}
      className="z-20 rounded-[18px] p-5 md:absolute md:bottom-12 md:right-[10%] md:w-[35%] md:-rotate-2"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--landing-ink)]">
          <ClipboardList size={17} aria-hidden="true" />
          Interview prep
        </div>
        <SearchCheck
          size={18}
          className="text-[var(--landing-primary-dark)]"
          aria-hidden="true"
        />
      </div>
      <div className="space-y-2 text-sm font-semibold text-[var(--landing-ink-soft)]">
        <p>3 likely questions</p>
        <p>2 company talking points</p>
        <p>1 salary angle to prepare</p>
      </div>
    </ArtifactShell>
  );
}

function ApplicationDesk() {
  return (
    <div className="relative mx-auto mt-12 grid w-full max-w-5xl gap-4 md:mt-16 md:h-[520px] md:block">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 hidden h-[420px] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[oklch(0.205_0.035_244_/_0.12)] md:block"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-[6%] hidden h-24 w-[88%] rounded-[50%] bg-[oklch(0.205_0.035_244_/_0.06)] blur-2xl md:block"
      />
      <ResumeSheet />
      <JobBrief />
      <MatchStamp />
      <CoverLetterNote />
      <InterviewPrepCard />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-screen overflow-hidden px-5 pb-16 pt-32 sm:px-10 lg:px-16 xl:px-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.985_0.012_84)_72%,oklch(0.965_0.02_84)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.92_0.06_174_/_0.72),transparent_34rem)]"
      />
      <div className="landing-container relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <h1
            className="max-w-6xl font-outfit font-extrabold leading-[0.95] tracking-normal text-[var(--landing-ink)]"
            style={{ fontSize: "clamp(48px, 8.4vw, 126px)" }}
          >
            Tailor your CV
            <br />
            <span className="relative inline-block px-2 text-[var(--landing-ink)]">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[0.07em] -z-10 h-[0.32em] -rotate-1 bg-[oklch(0.87_0.071_313_/_0.72)]"
              />
              to every job in minutes.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
            Paste a job link, upload your CV, and FitMyCV rewrites your resume,
            cover letter, and interview prep to match the role.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="landing-primary-btn group min-w-[210px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              Tailor my CV
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="#how-it-works"
              className="landing-secondary-btn min-w-[190px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        <ApplicationDesk />
      </div>
    </section>
  );
}
