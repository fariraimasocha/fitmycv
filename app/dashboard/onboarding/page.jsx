"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReadCvLogoIcon, ArrowRightIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import ResumeUpload from "@/components/ResumeUpload";
import Loader from "@/components/Loader";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [finishing, setFinishing] = useState(false);
  const [completionFailed, setCompletionFailed] = useState(false);

  const completeOnboarding = async () => {
    setFinishing(true);
    setCompletionFailed(false);

    try {
      const response = await fetch("/api/user/onboarding", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to save onboarding progress");
      }

      await update();
      router.replace("/dashboard/tailor");
    } catch {
      toast.error("Your CV is ready, but we could not continue. Please try again.");
      setCompletionFailed(true);
      setFinishing(false);
    }
  };

  if (finishing) {
    return <Loader />;
  }

  return (
    <div className="landing-root min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-10 sm:px-8">
        <header className="flex items-center gap-2.5">
          <ReadCvLogoIcon
            size={24}
            weight="bold"
            className="text-[var(--landing-primary)]"
            aria-hidden="true"
          />
          <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            FitMyCV
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-10">
          <div className="mb-7">
            <span className="landing-eyebrow">First, add your CV</span>
            <h1 className="mt-4 font-outfit text-3xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-4xl">
              Upload once. Tailor it to every job.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--landing-ink-soft)] sm:text-base">
              We use your current CV as the source for each tailored application.
              Upload a PDF and we will take you straight to the job tailoring tool.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5 sm:p-6">
            <ResumeUpload onParsed={completeOnboarding} />
          </div>

          {completionFailed && (
            <button
              type="button"
              onClick={completeOnboarding}
              className="landing-primary-btn mt-5 w-full cursor-pointer text-sm sm:w-fit"
            >
              Continue to tailoring
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          )}

          <p className="mt-5 text-center text-xs leading-5 text-[var(--landing-ink-soft)]">
            PDF only, up to 8MB. You can edit the parsed details later.
          </p>
          <button
            type="button"
            onClick={completeOnboarding}
            className="mx-auto mt-4 block text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
          >
            Skip for now
          </button>
        </section>
      </main>
    </div>
  );
}
