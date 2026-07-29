import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  LightbulbIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

// Renderer for the structured long-form content in `content/`. Content is data,
// not JSX, so a post is a plain object a non-React editor can safely change.
//
// ponytail: this is a deliberately tiny inline parser instead of an MDX
// pipeline — the only inline marks the content needs are links and bold, and
// MDX would pull in a compiler plus a loader config for that.

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
        <strong key={`${keyPrefix}-${n}`} className="font-bold text-[var(--landing-ink)]">
          {bold}
        </strong>
      );
    } else {
      const external = href.startsWith("http");
      parts.push(
        external ? (
          <a
            key={`${keyPrefix}-${n}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4 decoration-[oklch(0.47_0.125_177_/_0.4)] hover:decoration-[var(--landing-primary-dark)]"
          >
            {linkLabel}
          </a>
        ) : (
          <Link
            key={`${keyPrefix}-${n}`}
            href={href}
            className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4 decoration-[oklch(0.47_0.125_177_/_0.4)] hover:decoration-[var(--landing-primary-dark)]"
          >
            {linkLabel}
          </Link>
        )
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

function Block({ block }) {
  if (block.h2) {
    return (
      <h2
        id={slugifyHeading(block.h2)}
        className="landing-heading mt-14 scroll-mt-28 font-outfit text-2xl font-extrabold sm:text-3xl"
      >
        {block.h2}
      </h2>
    );
  }

  if (block.h3) {
    return (
      <h3 className="mt-10 font-outfit text-lg font-extrabold text-[var(--landing-ink)] sm:text-xl">
        {block.h3}
      </h3>
    );
  }

  if (block.p) {
    return (
      <p className="mt-5 max-w-none text-base leading-8 text-[var(--landing-ink-soft)]">
        {inline(block.p)}
      </p>
    );
  }

  if (block.ul) {
    return (
      <ul className="mt-5 flex flex-col gap-3">
        {block.ul.map((item, i) => (
          <li key={i} className="flex gap-3 text-base leading-7 text-[var(--landing-ink-soft)]">
            <CheckIcon
              size={18}
              weight="bold"
              aria-hidden="true"
              className="mt-1 shrink-0 text-[var(--landing-primary)]"
            />
            <span>{inline(item, `ul-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.ol) {
    return (
      <ol className="mt-5 flex flex-col gap-3">
        {block.ol.map((item, i) => (
          <li key={i} className="flex gap-3 text-base leading-7 text-[var(--landing-ink-soft)]">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] font-outfit text-xs font-extrabold text-[var(--landing-primary-dark)]">
              {i + 1}
            </span>
            <span>{inline(item, `ol-${i}`)}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.table) {
    const { head, rows } = block.table;
    return (
      <div className="landing-card mt-8 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-150 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--landing-line)] bg-[var(--landing-paper-strong)]">
              {head.map((cell) => (
                <th
                  key={cell}
                  scope="col"
                  className="px-5 py-4 font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink)]"
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
                        ? "px-5 py-4 font-semibold text-[var(--landing-ink)]"
                        : "px-5 py-4 leading-6 text-[var(--landing-ink-soft)]"
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
      <aside className="mt-8 flex gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.22)] bg-[oklch(0.92_0.06_174_/_0.35)] p-6">
        <LightbulbIcon
          size={22}
          weight="fill"
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--landing-primary-dark)]"
        />
        <div>
          <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
            {block.callout.title}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--landing-ink-soft)]">
            {inline(block.callout.body, "callout")}
          </p>
        </div>
      </aside>
    );
  }

  if (block.compare) {
    const { title, context, before, after } = block.compare;
    return (
      <figure className="mt-8">
        <figcaption className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
          {title}
        </figcaption>
        {context ? (
          <p className="mt-2 text-sm leading-7 text-[var(--landing-ink-soft)]">
            {inline(context, "cmp-ctx")}
          </p>
        ) : null}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.06)] p-5">
            <div className="flex items-center gap-2">
              <XIcon
                size={16}
                weight="bold"
                aria-hidden="true"
                className="text-[var(--landing-coral)]"
              />
              <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-coral)]">
                Before
              </span>
            </div>
            <p className="mt-3 font-mono text-sm leading-7 text-[var(--landing-ink)]">
              {before}
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.07)] p-5">
            <div className="flex items-center gap-2">
              <CheckIcon
                size={16}
                weight="bold"
                aria-hidden="true"
                className="text-[var(--landing-success)]"
              />
              <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-success)]">
                After
              </span>
            </div>
            <p className="mt-3 font-mono text-sm leading-7 text-[var(--landing-ink)]">
              {after}
            </p>
          </div>
        </div>
      </figure>
    );
  }

  if (block.steps) {
    return (
      <div className="mt-8 flex flex-col gap-4">
        {block.steps.map(({ title, body }, i) => (
          <div key={title} className="landing-card flex gap-5 rounded-2xl p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary-dark)] font-outfit text-sm font-extrabold text-[oklch(0.99_0.006_84)]">
              {i + 1}
            </span>
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                {title}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--landing-ink-soft)]">
                {inline(body, `step-${i}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (block.cta) {
    const { title, body, href, label } = block.cta;
    return (
      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[linear-gradient(135deg,oklch(0.92_0.06_174_/_0.5),oklch(0.997_0.006_84))] p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {title}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            {body}
          </p>
        </div>
        <Link
          href={href}
          className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
        >
          {label}
          <ArrowRightIcon
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
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
