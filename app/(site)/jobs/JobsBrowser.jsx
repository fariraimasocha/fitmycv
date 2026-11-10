"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import {
  MagnifyingGlassIcon,
  ArrowSquareOutIcon,
  LockSimpleIcon,
  BriefcaseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  SparkleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { CheckboxFieldInput } from "@/components/ui/checkbox-field-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Radix Select reserves the empty string, so "all" stands in for no filter and
// is translated back to an absent query param.
const ALL = "all";

const CATEGORY_OPTIONS = [
  { value: ALL, label: "All roles" },
  { value: "Engineering", label: "Engineering" },
  { value: "Data & AI", label: "Data & AI" },
  { value: "Design", label: "Design" },
  { value: "Product", label: "Product" },
  { value: "Other", label: "Other" },
];

const TYPE_OPTIONS = [
  { value: ALL, label: "Any type" },
  { value: "Full time", label: "Full time" },
  { value: "Part time", label: "Part time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

const PERIOD_OPTIONS = [
  { value: ALL, label: "Any time" },
  { value: "24h", label: "Past 24 hours" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
];

function ago(date, now) {
  const days = Math.floor((now - new Date(date).getTime()) / 864e5);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  return `${Math.floor(days / 7)} weeks ago`;
}

// Most ATS pages do not publish a date. Saying "Posted today" for a job we
// merely found today would be a claim we cannot back, so an unknown date falls
// back to when it entered the pool and says so.
function dateLabel(job, now) {
  if (job.postedAt) return `Posted ${ago(job.postedAt, now)}`;
  if (job.listedAt) return `Listed ${ago(job.listedAt, now)}`;
  return null;
}

function FilterField({
  id,
  label,
  value,
  onValueChange,
  options,
  triggerLabel,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* htmlFor points at the trigger so clicking the label opens the select
          and a screen reader reads the two together. */}
      <label
        htmlFor={id}
        className="text-xs font-semibold text-[var(--landing-ink)]"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className="h-control w-full rounded-md"
          aria-label={triggerLabel}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// The company name is absent from the response for non-Pro viewers, so there is
// nothing here to un-blur. This bar is a placeholder, not a covered up value.
function LockedCompany() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="inline-block h-3.5 w-28 rounded-sm bg-muted-foreground/25 blur-[3px]"
      />
      <span className="sr-only">Company name hidden. Upgrade to see it.</span>
    </span>
  );
}

// ATS CDNs serve wordmarks and banners from the same paths as square marks,
// so shape cannot be known from the URL. Anything wider than this renders as an
// unreadable sliver in a 40px tile, so it falls back to the initial.
const MAX_LOGO_RATIO = 2.2;

// Falls back to the initial when there is no logo, the CDN drops it, or the
// image turns out to be a wordmark.
function CompanyAvatar({ job }) {
  const [rejected, setRejected] = useState(false);
  const showLogo = Boolean(job.logo) && !rejected;

  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h || w / h > MAX_LOGO_RATIO || h / w > MAX_LOGO_RATIO)
      setRejected(true);
  };

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--landing-line)] text-sm font-semibold text-foreground sm:h-11 sm:w-11">
      {job.locked ? (
        <LockSimpleIcon className="size-4 opacity-50" weight="bold" />
      ) : showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={job.logo}
          alt={job.company ? `${job.company} logo` : ""}
          loading="lazy"
          onLoad={handleLoad}
          onError={() => setRejected(true)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        (job.company?.[0] ?? "?").toUpperCase()
      )}
    </div>
  );
}

// Hairline tokens instead of the shell's .dashboard-card, because this
// component also renders on the public /jobs page, outside the shell.
const PANEL =
  "rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)]";
const ROW_BTN = "dashboard-secondary-btn dashboard-secondary-btn-sm w-full sm:w-auto";

function JobRow({ job, upgradeHref, now }) {
  const posted = dateLabel(job, now);
  const meta = [
    job.remote ? "Remote" : null,
    job.employmentType,
    posted,
  ].filter(Boolean);

  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <CompanyAvatar job={job} />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--landing-ink)]">
            {job.title}
          </p>

          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
            {job.locked ? <LockedCompany /> : <span>{job.company}</span>}
            {meta.map((bit) => (
              <span key={bit} className="flex items-center gap-1.5">
                <span aria-hidden="true">·</span>
                {bit}
              </span>
            ))}
          </p>

          {(job.location || job.salary) && (
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1">
                  <CurrencyDollarIcon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  {job.salary}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-2 sm:flex sm:items-center">
        {job.locked ? (
          <Link href={upgradeHref} className={ROW_BTN}>
            <LockSimpleIcon size={16} aria-hidden="true" />
            Unlock company and apply link
          </Link>
        ) : (
          <>
            {/* The pool already holds the URL, so tailoring skips the paste a link step. */}
            <Link
              href={`/dashboard/tailor?url=${encodeURIComponent(job.applyUrl)}`}
              className={ROW_BTN}
            >
              <SparkleIcon size={16} aria-hidden="true" />
              Tailor my CV
            </Link>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className={ROW_BTN}
            >
              Apply on company site
              <ArrowSquareOutIcon size={16} aria-hidden="true" />
            </a>
          </>
        )}
      </div>
    </li>
  );
}

export default function JobsBrowser({ className = "landing-container flex flex-col gap-5 pb-20" }) {
  const { data: session } = useSession();
  const reduceMotion = useReducedMotion();
  const [now] = useState(() => Date.now());
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(ALL);
  const [period, setPeriod] = useState(ALL);
  const [jobType, setJobType] = useState(ALL);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [paidOnly, setPaidOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Signed out visitors go to sign up, signed in free users go to checkout.
  const upgradeHref = session?.user ? "/dashboard/upgrade" : "/auth";
  const hasFilters =
    Boolean(q) ||
    category !== ALL ||
    period !== ALL ||
    jobType !== ALL ||
    remoteOnly ||
    paidOnly;

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(input.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page) });
    if (q) p.set("q", q);
    if (category !== ALL) p.set("category", category);
    if (period !== ALL) p.set("posted", period);
    if (jobType !== ALL) p.set("type", jobType);
    if (remoteOnly) p.set("remote", "1");
    if (paidOnly) p.set("salary", "1");
    return p.toString();
  }, [page, q, category, period, jobType, remoteOnly, paidOnly]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["jobs-feed", params],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/feed?${params}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    placeholderData: keepPreviousData,
  });

  const jobs = data?.data ?? [];
  const isPremium = Boolean(data?.isPremium);

  const clearFilters = () => {
    setInput("");
    setQ("");
    setCategory(ALL);
    setPeriod(ALL);
    setJobType(ALL);
    setRemoteOnly(false);
    setPaidOnly(false);
    setPage(1);
  };

  const pick = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const countLabel = isPending
    ? "Loading jobs"
    : `${(data?.total ?? 0).toLocaleString()} ${data?.total === 1 ? "job" : "jobs"}`;

  return (
    <div className={className}>
      {/* Teal header row: what you are looking at on the left, search on the right. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className="font-outfit text-base font-semibold text-[var(--landing-ink)]"
        >
          {countLabel}
        </p>
        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search job titles"
            aria-label="Search job titles"
            className="h-control rounded-md ps-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside aria-label="Filters" className="lg:sticky lg:top-20 lg:w-60 lg:shrink-0">
          <div className={`${PANEL} flex flex-col gap-4 p-4`}>
            <div className="flex min-h-6 items-center justify-between">
              <h2 className="font-outfit text-sm font-semibold text-[var(--landing-ink)]">
                Filters
              </h2>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <FilterField
                id="filter-role"
                label="Role"
                triggerLabel="Filter by role"
                value={category}
                onValueChange={pick(setCategory)}
                options={CATEGORY_OPTIONS}
              />
              <FilterField
                id="filter-job-type"
                label="Job type"
                triggerLabel="Filter by job type"
                value={jobType}
                onValueChange={pick(setJobType)}
                options={TYPE_OPTIONS}
              />
              <FilterField
                id="filter-posted"
                label="Posted"
                triggerLabel="Filter by date posted"
                value={period}
                onValueChange={pick(setPeriod)}
                options={PERIOD_OPTIONS}
              />
            </div>

            <div className="flex flex-col gap-2 border-t border-[var(--landing-line)] pt-4 sm:flex-row sm:gap-6 lg:flex-col lg:gap-2">
              <CheckboxFieldInput
                id="filter-remote-only"
                label="Remote only"
                checked={remoteOnly}
                onCheckedChange={(v) => {
                  setRemoteOnly(v);
                  setPage(1);
                }}
              />
              <CheckboxFieldInput
                id="filter-salary-listed"
                label="Salary listed"
                checked={paidOnly}
                onCheckedChange={(v) => {
                  setPaidOnly(v);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {!isPremium && jobs.length > 0 && (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--landing-ink)]">
                Company names and apply links are hidden on the free plan.
              </p>
              <Link
                href={upgradeHref}
                className="dashboard-primary-btn dashboard-primary-btn-sm w-full sm:w-auto"
              >
                Unlock all jobs
              </Link>
            </div>
          )}

          {isError ? (
            <div className={`${PANEL} px-6 py-12 text-center text-sm text-muted-foreground`}>
              Something went wrong loading jobs. Refresh the page to try again.
            </div>
          ) : !isPending && jobs.length === 0 ? (
            <div className={`${PANEL} flex flex-col items-center gap-2 px-6 py-14 text-center`}>
              <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
                <BriefcaseIcon size={22} aria-hidden="true" />
              </span>
              <p className="font-outfit text-base font-semibold text-[var(--landing-ink)]">
                {hasFilters ? "No jobs match these filters" : "No jobs yet"}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {hasFilters
                  ? "Try a wider role or a longer time range."
                  : "We add new roles twice a day. Check back soon."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  className="dashboard-secondary-btn mt-2"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : jobs.length > 0 ? (
            <motion.ul
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`${PANEL} divide-y divide-[var(--landing-line)] overflow-hidden`}
            >
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} upgradeHref={upgradeHref} now={now} />
              ))}
            </motion.ul>
          ) : null}

          {(page > 1 || data?.hasMore) && (
            <div className="flex items-center justify-between gap-3 sm:justify-center">
              <button
                type="button"
                className="dashboard-secondary-btn dashboard-secondary-btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <CaretLeftIcon size={16} aria-hidden="true" />
                Previous page
              </button>
              <span className="text-sm tabular-nums text-muted-foreground">Page {page}</span>
              <button
                type="button"
                className="dashboard-secondary-btn dashboard-secondary-btn-sm"
                disabled={!data?.hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                Next page
                <CaretRightIcon size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
