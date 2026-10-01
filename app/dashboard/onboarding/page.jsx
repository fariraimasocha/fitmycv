"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import BrandLogo from "@/components/BrandLogo";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import ResumeUpload from "@/components/ResumeUpload";
import Loader from "@/components/Loader";
import { getActivationSteps } from "@/lib/activation-steps";
import { trackEvent } from "@/lib/analytics";

// Onboarding is now just the CV upload (value first). The previous
// 3-question wizard and the in-flow paywall have been removed per
// feedback that the upload should be the only step. Pricing is still
// available on /dashboard/upgrade and via the dashboard activation card.
const QUESTIONS = [];
const UPLOAD_STEP = 0;
const TOTAL_STEPS = 1;

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
    (total, group) => total + (group?.skills?.length ?? 0),
    0,
  );
  const years = countYears(cv?.work);

  return [
    roles > 0 && { key: "roles", value: roles, count: roles },
    skills > 0 && { key: "skills", value: skills, count: skills },
    years && { key: "years", value: `${years}+`, count: years },
  ].filter(Boolean);
}



export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const reduceMotion = useReducedMotion();
  const t = useTranslations("onboarding");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [parsedCV, setParsedCV] = useState(null);
  // A parsed CV whose save failed, kept so a retry doesn't need a re-upload.
  const [pendingCV, setPendingCV] = useState(null);
  const queryClient = useQueryClient();
  const [finishing, setFinishing] = useState(false);
  const [completionFailed, setCompletionFailed] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0] || null;
  const isUploadStep = step === UPLOAD_STEP;
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
          throw new Error("Couldn't finish setting up your account.");
        }

        // ponytail: the one signup signal PostHog gets. The landing pageview
        // already carries utm_source, so this event inherits the campaign and
        // turns "Reddit sent traffic" into "Reddit sent signups".
        trackEvent("onboarding_completed");

        // Let OnboardingGuard allow the next navigation even before the JWT
        // has been refreshed (avoids the first-click bounce back to step 1).
        try {
          sessionStorage.setItem("onboardingJustCompleted", "1");
        } catch {}

        await update();
        router.replace(destination);
      } catch {
        toast.error(t("finishError"));
        setCompletionFailed(true);
        setFinishing(false);
      }
    },
    [router, update, t],
  );

  // Skipping lands on /dashboard, not /dashboard/tailor: the tailor page
  // errors on first action without a reference CV.
  const skip = () => completeOnboarding("/dashboard", answers);

  // The upload route only parses. My CV saves after review, so onboarding has
  // to save here, or the CV is gone the moment the user leaves this page.
  const saveCV = useMutation({
    mutationFn: async (cv) => {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      });
      if (!res.ok) throw new Error("Couldn't save your CV.");
      return (await res.json()).data;
    },
    onSuccess: (saved, cv) => {
      queryClient.setQueryData(["resume"], saved);
      setPendingCV(null);
      setParsedCV(cv);
    },
    onError: (_error, cv) => {
      setPendingCV(cv);
      toast.error(t("saveError"));
    },
  });

  const onParsed = (cv) => saveCV.mutate(cv);

  if (finishing || saveCV.isPending) {
    return <Loader />;
  }

  const canGoBack = step > 0 && !onPayoff;
  const facts = onPayoff ? summariseCV(parsedCV) : [];
  // The full checklist the dashboard will show, with the CV step already
  // ticked. The user just finished it.
  const plan = getActivationSteps(session?.user?.isPremium).map((step) => ({
    ...step,
    done: step.key === "resume",
  }));

  return (
    <div className="dashboard-shell min-h-screen bg-[var(--landing-bg)] text-[var(--landing-ink)]">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center gap-3">
          {/* The slot keeps its layout box on every step so the logo never
              shifts. visibility, not `hidden`. display:none would still jump. */}
          <button
            type="button"
            onClick={() => setStep((previous) => previous - 1)}
            className={`-ml-1 shrink-0 rounded-md p-1 text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)] ${
              canGoBack ? "cursor-pointer" : "invisible"
            }`}
            aria-label={t("back")}
            aria-hidden={!canGoBack}
            tabIndex={canGoBack ? undefined : -1}
          >
            <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
          </button>

          <span className="flex shrink-0 items-center">
            <BrandLogo
              size="sm"
              wordmarkClassName="font-outfit text-base font-semibold"
            />
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
              <button
                type="button"
                onClick={skip}
                className="ml-auto shrink-0 cursor-pointer sm:ml-0 text-xs font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
              >
                {t("skip")}
              </button>
            </>
          )}
        </header>

        <section className="flex flex-1 flex-col pt-16 pb-10 sm:pt-24">
          {/* keyed so each step remounts and animates in; no exit animation.
              AnimatePresence mode="wait" deadlocks the swap here */}
          <motion.div
            key={onPayoff ? "payoff" : step}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            {onPayoff ? (
              <>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)]">{t("payoff.eyebrow")}</span>
                <h1 className="mt-4 font-outfit text-2xl font-semibold leading-tight text-[var(--landing-ink)] sm:text-3xl">
                  {t("payoff.title", { hasName: firstName ? "yes" : "no", name: firstName ?? "" })}
                </h1>

                {facts.length > 0 && (
                  <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                    {facts.map((fact) => (
                      <div key={fact.key}>
                        <dt className="sr-only">{t(`payoff.facts.${fact.key}`, { count: fact.count })}</dt>
                        <dd className="font-outfit text-4xl font-semibold text-[var(--landing-accent)]">
                          {fact.value}
                        </dd>
                        <p className="mt-0.5 text-xs text-[var(--landing-ink-soft)]">
                          {t(`payoff.facts.${fact.key}`, { count: fact.count })}
                        </p>
                      </div>
                    ))}
                  </dl>
                )}

                <p className="mt-7 text-sm leading-relaxed text-[var(--landing-ink-soft)] sm:text-base">
                  {t("payoff.intro")}
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
                          {t(`plan.${item.key}.title`)}
                        </span>
                        {!item.done && (
                          <span className="mt-0.5 block text-sm text-[var(--landing-ink-soft)]">
                            {t(`plan.${item.key}.description`)}
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
                    className="dashboard-primary-btn w-full cursor-pointer text-sm sm:w-fit"
                  >
                    {t("payoff.tailorCta")}
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
                    {t("payoff.dashboardCta")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)]">{t("upload.eyebrow")}</span>
                <h1 className="mt-4 font-outfit text-3xl font-semibold leading-tight text-[var(--landing-ink)] sm:text-4xl">
                  {t("upload.title", { hasName: firstName ? "yes" : "no", name: firstName ?? "" })}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-[var(--landing-ink-soft)] sm:text-base">
                  {t("upload.privacy")}
                </p>

                <div className="mt-7 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5 sm:p-6">
                  <ResumeUpload onParsed={onParsed} />
                </div>

                {pendingCV && (
                  <button
                    type="button"
                    onClick={() => saveCV.mutate(pendingCV)}
                    className="dashboard-primary-btn mt-5 w-full cursor-pointer text-sm sm:w-fit"
                  >
                    {t("tryAgain")}
                  </button>
                )}

                {completionFailed && (
                  <button
                    type="button"
                    onClick={() =>
                      completeOnboarding("/dashboard/tailor", answers)
                    }
                    className="dashboard-primary-btn mt-5 w-full cursor-pointer text-sm sm:w-fit"
                  >
                    {t("continueToTailoring")}
                    <ArrowRightIcon
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                    />
                  </button>
                )}

                <p className="mt-5 text-xs leading-5 text-[var(--landing-ink-soft)]">
                  {t("upload.editLater")}
                </p>
              </>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
