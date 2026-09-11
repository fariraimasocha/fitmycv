import { XCircleIcon, CheckCircleIcon, FileTextIcon } from "@phosphor-icons/react/dist/ssr";

// ponytail: the dashboard's ArcGauge and PillTrack animate on mount, which is
// right where they are used (they mount in view when data lands) and wrong
// here: mounted far below the fold the spring gets throttled and settles at
// the wrong value. A marketing figure only has to be correct, so these are
// drawn statically and animated by CSS when the band scrolls in.

// The terms a real posting asks for that a generic CV tends to miss. Kept
// generic enough to be true of the example rather than of any one posting.
const MISSING = ["Kubernetes", "Terraform", "Event-driven", "SLOs", "Postgres"];
const PRESENT = ["Python", "AWS", "CI/CD"];

const ARC_SIZE = 104;
const ARC_STROKE = 9;
const ARC_RADIUS = ARC_SIZE / 2 - ARC_STROKE;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

function ScoreArc({ value }) {
  const offset = ARC_CIRCUMFERENCE * (1 - value / 100);
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: ARC_SIZE, height: ARC_SIZE }}
    >
      <svg
        width={ARC_SIZE}
        height={ARC_SIZE}
        viewBox={`0 0 ${ARC_SIZE} ${ARC_SIZE}`}
        className="-rotate-90"
        role="img"
        aria-label={`Match score ${value} out of 100`}
      >
        <circle
          cx={ARC_SIZE / 2}
          cy={ARC_SIZE / 2}
          r={ARC_RADIUS}
          fill="none"
          stroke="oklch(1 0 0 / 0.12)"
          strokeWidth={ARC_STROKE}
        />
        <circle
          className="problem-arc"
          cx={ARC_SIZE / 2}
          cy={ARC_SIZE / 2}
          r={ARC_RADIUS}
          fill="none"
          stroke="var(--landing-accent)"
          strokeWidth={ARC_STROKE}
          strokeLinecap="round"
          strokeDasharray={ARC_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ "--arc-from": ARC_CIRCUMFERENCE, "--arc-to": offset }}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-outfit text-2xl font-extrabold text-white"
      >
        {value}%
      </span>
    </div>
  );
}

function Term({ label, found }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        found
          ? "bg-[oklch(1_0_0_/_0.1)] text-white"
          : "bg-[var(--landing-accent-dark)] text-white"
      }`}
    >
      {found ? (
        <CheckCircleIcon size={12} weight="fill" aria-hidden="true" />
      ) : (
        <XCircleIcon size={12} weight="fill" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

/**
 * Shows the problem rather than asserting it: a real failure state, with the
 * score and the terms that caused it, instead of a grid of cards claiming the
 * same thing in prose.
 */
export default function TheProblem() {
  return (
    <section className="landing-dark-band landing-section">
      <div className="landing-container">
        <span className="landing-dark-eyebrow">The problem</span>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
          <h2
            className="font-outfit font-medium text-white lg:col-span-6"
            style={{
              fontSize: "clamp(2rem, 3.6vw, 3.4rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            You are not being turned down. You are being filtered out.
          </h2>

          <p className="text-lg leading-relaxed text-[var(--landing-ink-inverse-soft)] lg:col-span-5 lg:col-start-8">
            Most companies screen with software before a recruiter sees
            anything. If your CV misses the words the posting uses, it is
            dropped. Quietly, and with no reply to tell you why.
          </p>
        </div>

        {/* The failure state, as the product would report it. */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-[oklch(1_0_0_/_0.12)] bg-[oklch(1_0_0_/_0.04)]">
          <div className="flex items-center gap-3 border-b border-[oklch(1_0_0_/_0.12)] px-5 py-4">
            <FileTextIcon size={18} className="text-white" aria-hidden="true" />
            <span className="font-outfit text-sm font-bold text-white">
              Your CV, against one posting
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-accent-dark)] px-3 py-1 text-xs font-semibold text-white">
              <XCircleIcon size={12} weight="fill" aria-hidden="true" />
              Filtered out
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex items-center gap-5 lg:col-span-4">
              <ScoreArc value={47} />
              <div>
                <p className="font-outfit text-sm font-bold text-white">
                  Qualification match
                </p>
                <p className="mt-1 text-sm text-[var(--landing-ink-inverse-soft)]">
                  Against the job description
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <p className="text-sm font-semibold text-white">
                Five terms the posting asks for that your CV never says
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MISSING.map((term) => (
                  <Term key={term} label={term} found={false} />
                ))}
                {PRESENT.map((term) => (
                  <Term key={term} label={term} found />
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[var(--landing-ink-inverse-soft)]">
                    Keyword coverage
                  </span>
                  <span className="font-outfit text-xs font-bold text-white">
                    3 of 8
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[oklch(1_0_0_/_0.12)]">
                  <div
                    className="problem-bar h-full rounded-full bg-[var(--landing-accent)]"
                    style={{ width: "37%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base text-[var(--landing-ink-inverse-soft)]">
          FitMyCV reads the posting, finds the terms you are missing, and
          rewrites your CV to use them. Only from experience you actually have.
        </p>
      </div>
    </section>
  );
}
