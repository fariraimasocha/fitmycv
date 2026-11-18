"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { FileTextIcon, LinkIcon, SparkleIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

// The home page's one main action. Tailoring needs a reference CV, so without
// one the card sends you to upload it instead of showing a form that would fail.
export function HomeJobLinkForm({ hasCV, delay = 0.05 }) {
  const t = useTranslations("dashboard.home");
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const link = url.trim();
    if (!link) return;
    trackEvent("home_link_submitted");
    router.push(`/dashboard/tailor?url=${encodeURIComponent(link)}&auto=1`);
  };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      aria-labelledby="home-link-title"
      className="dashboard-card dashboard-card-pad rounded-lg"
    >
      {hasCV ? (
        <>
          <h2 id="home-link-title" className="font-outfit text-base font-semibold text-foreground">
            {t("linkForm.title")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("linkForm.description")}</p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <LinkIcon
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("linkForm.placeholder")}
                aria-label={t("linkForm.label")}
                autoComplete="url"
                spellCheck={false}
                className="w-full ps-9 text-base sm:text-sm"
              />
            </div>
            <button type="submit" className="dashboard-primary-btn tap-target w-full sm:w-auto">
              <SparkleIcon size={16} aria-hidden="true" />
              {t("tailorMyCv")}
            </button>
          </form>
          <Link
            href="/dashboard/resume"
            className="tap-target mt-3 inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileTextIcon size={14} aria-hidden="true" />
            {t("myCv")}
          </Link>
        </>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 id="home-link-title" className="font-outfit text-base font-semibold text-foreground">
              {t("linkForm.noCvTitle")}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {t("linkForm.noCvDescription")}
            </p>
          </div>
          <Link href="/dashboard/resume" className="dashboard-primary-btn tap-target w-full shrink-0 sm:w-auto">
            <UploadSimpleIcon size={16} aria-hidden="true" />
            {t("linkForm.noCvAction")}
          </Link>
        </div>
      )}
    </motion.section>
  );
}
