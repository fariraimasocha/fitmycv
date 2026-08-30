"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ReadCvLogoIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import toast from "react-hot-toast";
import ResumeUpload from "@/components/ResumeUpload";
import Loader from "@/components/Loader";
import { getActivationSteps } from "@/lib/activation-steps";

// Sentences are stored lowercase-initial so the name can be prefixed. With no
// name on the session, the sentence stands alone rather than reading "there, ...".
function withName(name, sentence) {
  return name
    ? `${name}, ${sentence}`
    : sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

const QUESTIONS = [
  {
    key: "goal",
    eyebrow: "Your goal",
    prompt: (name) => withName(name, "what are you here to do?"),
    options: [
      "Land my first job",
      "Switch to a better company",
      "Level up my title",
      "Break into tech",
      "Just exploring",
    ],
  },
  {
    key: "stage",
    eyebrow: "Your search",
    prompt: () => "Where are you in the search?",
    options: [
      "Not started applying yet",
      "Applying, not hearing back",
      "Interviewing, no offers yet",
      "I have an offer",
    ],
  },
  {
    key: "blocker",
    eyebrow: "The blocker",
    prompt: (name) => withName(name, "what is slowing you down most?"),
    options: [
      "My CV is not getting responses",
      "I cannot find good roles",
      "I rewrite my CV for every job",
      "I freeze in interviews",
      "I do not have time to apply",
    ],
  },
];

const TOTAL_STEPS = QUESTIONS.length + 1;

function countYears(work) {
  const years = (work ?? [])
    .map((role) =>
      Number.parseInt(String(role?.startDate ?? "").slice(0, 4), 10),
    )
    .filter((year) => Number.isFinite(year) && year > 1950);
  if (!years.length) return null;
  const span = new Date().getFullYear() - Math.min(...years);
  return span > 0 ? span : null;
}

function summariseCV(cv) {
  const roles = (cv?.work ?? []).length;
  const skills = (cv?.skills ?? []).reduce(
    (total, group) => total + (group?.keywords?.length ?? 0),
    0,
  );
  const years = countYears(cv?.work);

  return [
    roles > 0 && { value: roles, label: roles === 1 ? "role" : "roles" },
    skills > 0 && { value: skills, label: skills === 1 ? "skill" : "skills" },
    years && { value: `${years}+`, label: "years of experience" },
  ].filter(Boolean);
}

function OptionButton({ label, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-5 py-4 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-[var(--landing-accent)] bg-[var(--landing-accent-soft)] text-[var(--landing-ink)]"
          : "border-[var(--landing-line)] bg-[var(--landing-surface)] text-[var(--landing-ink)] hover:border-[#ccc5bb] hover:bg-[var(--landing-paper-soft)]"
      }`}
    >
      {label}
      {selected && (
        <CheckIcon
          size={16}
          weight="bold"
          className="shrink-0 text-[var(--landing-accent-dark)]"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [parsedCV, setParsedCV] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [completionFailed, setCompletionFailed] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0] || null;
  const isUploadStep = step === QUESTIONS.length;
  const onPayoff = Boolean(parsedCV);

  const completeOnboarding = useCallback(
    async (destination, payload) => {
      setFinishing(true);
      setCompletionFailed(false);

      try {
        const response = await fetch("/api/user/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload ?? {}),
        });
        if (!response.ok) {
          throw new Error("Failed to save onboarding progress");
        }

        await update();
        router.replace(destination);
      } catch {
        toast.error(
          "Your CV is ready, but we could not continue. Please try again.",
        );
        setCompletionFailed(true);
        setFinishing(false);
      }
    },
    [router, update],
  );

  // Skipping lands on /dashboard, not /dashboard/tailor — the tailor page
  // errors on first action without a reference CV.
  const skip = () => completeOnboarding("/dashboard", answers);

  const answer = (key, value) => {
    setAnswers((previous) => ({ ...previous, [key]: value }));
    setStep((previous) => previous + 1);
  };

  const onParsed = (cv) => setParsedCV(cv);

  if (finishing) {
    return <Loader />;
  }

  const canGoBack = step > 0 && !onPayoff;
  const question = QUESTIONS[step];
  const facts = onPayoff ? summariseCV(parsedCV) : [];
  // The full checklist the dashboard will show, with the CV step already
  // ticked — the user just finished it.
  const plan = getActivationSteps(session?.user?.isPremium).map((step) => ({
    ...step,
    done: step.key === "resume",
  }));

  return (
    <div className="landing-root min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center gap-3">
          {/* The slot keeps its layout box on every step so the logo never
              shifts. visibility, not `hidden` — display:none would still jump. */}
          <button
            type="button"
            onClick={() => setStep((previous) => previous - 1)}
            className={`-ml-1 shrink-0 rounded-lg p-1 text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)] ${
              canGoBack ? "cursor-pointer" : "invisible"
            }`}
            aria-label="Back"
            aria-hidden={!canGoBack}
            tabIndex={canGoBack ? undefined : -1}
          >
            <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
          </button>

          <span className="flex shrink-0 items-center gap-2">
            <ReadCvLogoIcon
              size={22}
              weight="bold"
              className="text-[var(--landing-primary)]"
              aria-hidden="true"
            />
            <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
              FitMyCV
            </span>
          </span>

          {!onPayoff && (
            <>
              <span
                className="hidden h-px flex-1 bg-[var(--landing-line)] sm:block"
                aria-hidden="true"
              >
                <motion.span
                  className="block h-px bg-[var(--landing-accent)]"
                  initial={false}
                  animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                />
              </span>
              <span className="ml-auto shrink-0 text-xs tracking-wider text-[var(--landing-ink-soft)] sm:ml-0">
                STEP {String(step + 1).padStart(2, "0")} / {TOTAL_STEPS}
              </span>
              <button
                type="button"
                onClick={skip}
                className="shrink-0 cursor-pointer text-xs font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
              >
                Skip for now
              </button>
            </>
          )}
        </header>

        <section className="flex flex-1 flex-col pt-16 pb-10 sm:pt-24">
          {/* keyed so each step remounts and animates in; no exit animation —
              AnimatePresence mode="wait" deadlocks the swap here */}
          <motion.div
            key={onPayoff ? "payoff" : step}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            {onPayoff ? (
              <>
                <span className="landing-eyebrow-plain">Your CV is ready</span>
                <h1 className="mt-4 font-outfit text-2xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-3xl">
                  {withName(firstName, "here is what we read.")}
                </h1>

                {facts.length > 0 && (
                  <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                    {facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="sr-only">{fact.label}</dt>
                        <dd className="font-outfit text-4xl font-extrabold text-[var(--landing-accent)]">
                          {fact.value}
                        </dd>
                        <p className="mt-0.5 text-xs text-[var(--landing-ink-soft)]">
                          {fact.label}
                        </p>
                      </div>
                    ))}
                  </dl>
                )}

                <p className="mt-7 text-sm leading-relaxed text-[var(--landing-ink-soft)] sm:text-base">
                  Every tailored CV and cover letter is built from this. You can
                  edit any of it later. Here is what happens next:
                </p>

                <ol className="mt-6 divide-y divide-[var(--landing-line)] border-y border-[var(--landing-line)]">
                  {plan.map((item, index) => (
                    <li key={item.key} className="flex gap-4 py-4">
                      <span className="pt-0.5">
                        {item.done ? (
                          <CheckIcon
                            size={14}
                            weight="bold"
                            className="text-[var(--landing-ink-soft)]"
                            aria-hidden="true"
                          />
                        ) : (
                          <span className="font-outfit text-sm font-bold text-[var(--landing-accent-dark)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        )}
                      </span>
                      <span>
                        <span
                          className={
                            item.done
                              ? "block text-sm font-semibold text-[var(--landing-ink-soft)] line-through"
                              : "block text-sm font-semibold text-[var(--landing-ink)]"
                          }
                        >
                          {item.title}
                        </span>
                        {!item.done && (
                          <span className="mt-0.5 block text-sm text-[var(--landing-ink-soft)]">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      completeOnboarding("/dashboard/tailor", answers)
                    }
                    className="landing-primary-btn w-full cursor-pointer text-sm sm:w-fit"
                  >
                    Start with step 1
                    <ArrowRightIcon
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => completeOnboarding("/dashboard", answers)}
                    className="cursor-pointer text-sm font-medium text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
                  >
                    Go to dashboard
                  </button>
                </div>
              </>
            ) : isUploadStep ? (
              <>
                <span className="landing-eyebrow-plain">Your CV</span>
                <h1 className="mt-4 font-outfit text-3xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-4xl">
                  {withName(
                    firstName,
                    "upload your CV so we can tailor everything to you.",
                  )}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-[var(--landing-ink-soft)] sm:text-base">
                  Stays private. We read it, we never share it.
                </p>

                <div className="mt-7 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5 sm:p-6">
                  <ResumeUpload onParsed={onParsed} />
                </div>

                {completionFailed && (
                  <button
                    type="button"
                    onClick={() =>
                      completeOnboarding("/dashboard/tailor", answers)
                    }
                    className="landing-primary-btn mt-5 w-full cursor-pointer text-sm sm:w-fit"
                  >
                    Continue to tailoring
                    <ArrowRightIcon
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                    />
                  </button>
                )}

                <p className="mt-5 text-xs leading-5 text-[var(--landing-ink-soft)]">
                  You can edit the parsed details later.
                </p>
              </>
            ) : (
              <>
                <span className="landing-eyebrow-plain">
                  {question.eyebrow}
                </span>
                <h1 className="mt-4 font-outfit text-3xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-4xl">
                  {question.prompt(firstName)}
                </h1>

                <div className="mt-7 flex flex-col gap-2.5">
                  {question.options.map((option) => (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={answers[question.key] === option}
                      onSelect={() => answer(question.key, option)}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
