import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowRightIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import { HOME_TESTIMONIALS } from "@/content/pages/home";

// Free tools a post can embed with { tool: "<key>" }. Loaded on demand, so a
// post only ships the tool it actually embeds.
const TOOLS = {
  "application-letter": dynamic(() => import("@/components/tools/ApplicationLetterGenerator")),
  "keyword-checker": dynamic(() => import("@/components/tools/KeywordChecker")),
  "job-match": dynamic(() => import("@/components/tools/JobMatchChecker")),
  "weak-words": dynamic(() => import("@/components/tools/WeakWordsChecker")),
  "bullet-rewriter": dynamic(() => import("@/components/tools/BulletRewriter")),
  "cv-format": dynamic(() => import("@/components/tools/CvFormatChecker")),
  "ats-lookup": dynamic(() => import("@/components/tools/AtsLookup")),
  "gap-explainer": dynamic(() => import("@/components/tools/GapExplainer")),
  "summary": dynamic(() => import("@/components/tools/SummaryGenerator")),
};

// Renderer for the structured long-form content in `content/`. Content is data,
// not JSX, so a post is a plain object a non-React editor can safely change.
//
// ponytail: this is a deliberately tiny inline parser instead of an MDX
// pipeline. The only inline marks the content needs are links and bold, and
// MDX would pull in a compiler plus a loader config for that.
//
// Blocks that carry information only FitMyCV has (see scripts/check-unique-info.mjs):
//   figure       { src, alt, caption, width, height }  screenshot of the product in use
//   video        { src, poster, caption }              a real recording
//   data         { title, stats: [{ value, label }], source, href }  first-party numbers
//   testimonial  "Titus"                               a real quote from content/pages/home.js
//   expert       { quote, name, role, href? }          a named person, quoted with consent
//   take         { claim, body }                       our position, with the evidence
//   framework    { name, summary, steps: [{ title, body }] }  a named method of ours
//   tool         "<key in TOOLS>"                      an interactive tool
// Each one renders nothing when a field that backs the claim is missing.

const LINK =
  "font-medium text-[var(--landing-ink)] underline decoration-[var(--landing-accent-line)] decoration-1 underline-offset-4 transition-colors hover:decoration-[var(--landing-accent)]";

/** Parses `[label](/href)` and `**bold**` in a plain string. */
function inline(text, keyPrefix = "i") {
  const parts = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match;
  let n = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    const [, linkLabel, href, bold] = match;
    if (bold) {
      parts.push(
        <strong key={`${keyPrefix}-${n}`} className="font-semibold text-[var(--landing-ink)]">
          {bold}
        </strong>
      );
    } else if (href.startsWith("http")) {
      parts.push(
        <a key={`${keyPrefix}-${n}`} href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
          {linkLabel}
        </a>
      );
    } else {
      parts.push(
        <Link key={`${keyPrefix}-${n}`} href={href} className={LINK}>
          {linkLabel}
        </Link>
      );
    }

    last = match.index + match[0].length;
    n += 1;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Stable, readable anchor id so H2s can be deep-linked and listed in a TOC. */
export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// A small label above a block, in the accent so it reads as ours.
function Eyebrow({ children }) {
  return <p className="text-sm font-semibold text-[var(--landing-accent-dark)]">{children}</p>;
}

function Caption({ children }) {
  return (
    <figcaption className="mt-3 text-sm leading-6 text-[var(--landing-ink-faint)]">
      {inline(children, "cap")}
    </figcaption>
  );
}

function Block({ block }) {
  if (block.tool) {
    const Tool = TOOLS[block.tool];
    return Tool ? (
      <div className="mt-10">
        <Tool />
      </div>
    ) : null;
  }

  if (block.h2) {
    return (
      <h2
        id={slugifyHeading(block.h2)}
        className="mt-16 scroll-mt-24 text-2xl font-semibold leading-tight tracking-[-0.015em] text-[var(--landing-ink)] sm:text-[1.75rem]"
      >
        {block.h2}
      </h2>
    );
  }

  if (block.h3) {
    return (
      <h3 className="mt-10 text-xl font-semibold leading-snug text-[var(--landing-ink)]">
        {block.h3}
      </h3>
    );
  }

  if (block.p) {
    return (
      <p className="mt-6 text-lg leading-8 text-[var(--landing-ink-soft)]">{inline(block.p)}</p>
    );
  }

  if (block.ul) {
    return (
      <ul className="mt-6 flex list-disc flex-col gap-3 ps-6 text-lg leading-8 text-[var(--landing-ink-soft)] marker:text-[var(--landing-accent)]">
        {block.ul.map((item, i) => (
          <li key={i} className="ps-1">
            {inline(item, `ul-${i}`)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.ol) {
    return (
      <ol start={block.start} className="mt-6 flex list-decimal flex-col gap-3 ps-6 text-lg leading-8 text-[var(--landing-ink-soft)] marker:font-semibold marker:text-[var(--landing-ink)]">
        {block.ol.map((item, i) => (
          <li key={i} className="ps-1">
            {inline(item, `ol-${i}`)}
          </li>
        ))}
      </ol>
    );
  }

  if (block.table) {
    const { head, rows } = block.table;
    return (
      <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <table className="w-full hyphens-auto wrap-anywhere border-collapse text-start text-sm">
          <thead>
            <tr className="border-b border-[var(--landing-line)]">
              {head.map((cell) => (
                <th
                  key={cell}
                  scope="col"
                  className="px-3 py-3 text-start text-sm font-semibold text-[var(--landing-ink)] sm:px-5"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[var(--landing-line)] last:border-0">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={
                      j === 0
                        ? "px-3 py-3 align-top font-medium text-[var(--landing-ink)] sm:px-5"
                        : "px-3 py-3 align-top leading-6 text-[var(--landing-ink-soft)] sm:px-5"
                    }
                  >
                    {inline(cell, `t-${i}-${j}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.callout) {
    return (
      <aside className="mt-10 border-s-2 border-[var(--landing-accent)] ps-5">
        <p className="text-base font-semibold text-[var(--landing-ink)]">{block.callout.title}</p>
        <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-[var(--landing-ink-soft)]">
          {inline(block.callout.body, "callout")}
        </p>
      </aside>
    );
  }

  if (block.compare) {
    const { title, context, before, after } = block.compare;
    return (
      <figure className="mt-10">
        <figcaption className="text-base font-semibold text-[var(--landing-ink)]">{title}</figcaption>
        {context ? (
          <p className="mt-2 text-base leading-7 text-[var(--landing-ink-soft)]">
            {inline(context, "cmp-ctx")}
          </p>
        ) : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            { label: "Before", text: before, Icon: XIcon, tone: "text-[var(--landing-coral)]" },
            { label: "After", text: after, Icon: CheckIcon, tone: "text-[var(--landing-success)]" },
          ].map(({ label, text, Icon, tone }) => (
            <div
              key={label}
              className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5"
            >
              <p className={`inline-flex items-center gap-2 text-sm font-semibold ${tone}`}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </p>
              <p className="mt-3 text-base leading-7 text-[var(--landing-ink)]">{text}</p>
            </div>
          ))}
        </div>
      </figure>
    );
  }

  if (block.steps) {
    return (
      <ol className="mt-10 flex flex-col">
        {block.steps.map(({ title, body }, i) => (
          <li
            key={title}
            className="flex gap-5 border-t border-[var(--landing-line)] py-6 last:border-b"
          >
            <span className="w-6 shrink-0 text-lg font-semibold tabular-nums leading-7 text-[var(--landing-accent-dark)]">
              {i + 1}
            </span>
            <div>
              <p className="text-lg font-semibold leading-7 text-[var(--landing-ink)]">{title}</p>
              <p className="mt-2 text-base leading-7 text-[var(--landing-ink-soft)]">
                {inline(body, `step-${i}`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  if (block.cta) {
    const { title, body, href, label, secondary } = block.cta;
    return (
      <div className="mt-12 flex flex-col gap-5 rounded-2xl bg-[var(--landing-ink)] p-7 text-[var(--landing-on-primary)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-2 max-w-xl text-base leading-7 text-[color-mix(in_oklch,var(--landing-on-primary)_72%,transparent)]">{body}</p>
          {secondary?.href && secondary?.label ? (
            <p className="mt-3 text-sm leading-6 text-[color-mix(in_oklch,var(--landing-on-primary)_72%,transparent)]">
              <Link
                href={secondary.href}
                className="font-semibold text-[var(--landing-on-primary)] underline underline-offset-4 hover:opacity-90"
              >
                {secondary.label}
              </Link>
            </p>
          ) : null}
        </div>
        <Link
          href={href}
          className="group inline-flex min-h-control shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--landing-on-primary)] px-5 text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:bg-[var(--landing-paper)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-on-primary)]"
        >
          {label}
          <ArrowRightIcon
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>
    );
  }

  // Unique information. Each needs the field that backs its claim.

  if (block.figure?.src && block.figure.alt) {
    const { src, alt, caption, width = 1600, height = 1000 } = block.figure;
    return (
      <figure className="mt-10">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 680px, 100vw"
          className="h-auto w-full rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)]"
        />
        {caption ? <Caption>{caption}</Caption> : null}
      </figure>
    );
  }

  if (block.video?.src) {
    const { src, poster, caption } = block.video;
    return (
      <figure className="mt-10">
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-xl border border-[var(--landing-line)] bg-black"
        />
        {caption ? <Caption>{caption}</Caption> : null}
      </figure>
    );
  }

  if (block.data?.stats?.length && block.data.source) {
    const { title, stats, source, href } = block.data;
    return (
      <figure className="mt-10 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-6 sm:p-7">
        <Eyebrow>From our data</Eyebrow>
        {title ? (
          <p className="mt-1 text-lg font-semibold leading-7 text-[var(--landing-ink)]">{title}</p>
        ) : null}
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="text-3xl font-semibold tabular-nums tracking-[-0.02em] text-[var(--landing-ink)]">
                {value}
              </dd>
              <dd className="mt-1 text-sm leading-5 text-[var(--landing-ink-soft)]">{label}</dd>
            </div>
          ))}
        </dl>
        <figcaption className="mt-6 border-t border-[var(--landing-line)] pt-4 text-sm leading-6 text-[var(--landing-ink-faint)]">
          Source:{" "}
          {href ? (
            <Link href={href} className={LINK}>
              {source}
            </Link>
          ) : (
            source
          )}
        </figcaption>
      </figure>
    );
  }

  if (block.testimonial) {
    const person = HOME_TESTIMONIALS.find((t) => t.author === block.testimonial);
    if (!person) return null;
    return (
      <figure className="mt-10 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-6 sm:p-7">
        <blockquote className="text-lg leading-8 text-[var(--landing-ink)]">
          <p>{person.quote}</p>
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          <Image src={person.image} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
          <span className="text-sm leading-5">
            <span className="block font-semibold text-[var(--landing-ink)]">{person.author}</span>
            <span className="text-[var(--landing-ink-faint)]">FitMyCV user</span>
          </span>
        </figcaption>
      </figure>
    );
  }

  if (block.expert?.quote && block.expert.name && block.expert.role) {
    const { quote, name, role, href } = block.expert;
    return (
      <figure className="mt-12 border-s-2 border-[var(--landing-ink)] ps-6">
        <blockquote className="font-serif-display text-2xl leading-snug text-[var(--landing-ink)] sm:text-[1.75rem]">
          <p>{quote}</p>
        </blockquote>
        <figcaption className="mt-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
          <span className="font-semibold text-[var(--landing-ink)]">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
                {name}
              </a>
            ) : (
              name
            )}
          </span>
          , {role}
        </figcaption>
      </figure>
    );
  }

  if (block.take?.claim && block.take.body) {
    const { claim, body } = block.take;
    return (
      <aside className="mt-12 rounded-2xl bg-[var(--landing-accent-soft)] p-6 sm:p-7">
        <Eyebrow>Our take</Eyebrow>
        <p className="mt-2 text-xl font-semibold leading-8 text-[var(--landing-ink)]">{claim}</p>
        <p className="mt-3 text-base leading-7 text-[var(--landing-ink-soft)]">{inline(body, "take")}</p>
      </aside>
    );
  }

  if (block.framework?.name && block.framework.steps?.length) {
    const { name, summary, steps } = block.framework;
    return (
      <section className="mt-12 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-6 sm:p-8">
        <Eyebrow>A FitMyCV method</Eyebrow>
        <p className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.015em] text-[var(--landing-ink)]">
          {name}
        </p>
        {summary ? (
          <p className="mt-3 text-base leading-7 text-[var(--landing-ink-soft)]">{inline(summary, "fw")}</p>
        ) : null}
        <ol className="mt-6 flex flex-col gap-5">
          {steps.map(({ title, body }, i) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--landing-ink)] text-sm font-semibold tabular-nums text-[var(--landing-on-primary)]">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="text-base font-semibold leading-6 text-[var(--landing-ink)]">{title}</p>
                <p className="mt-1 text-base leading-7 text-[var(--landing-ink-soft)]">
                  {inline(body, `fw-${i}`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return null;
}

export default function Blocks({ blocks }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  );
}
