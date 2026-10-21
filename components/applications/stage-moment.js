import { toast } from "sonner";

/**
 * The toast after a stage change. Interview and Offer are the wins of a job
 * search, so they get their own words and a next step instead of the generic
 * "Moved to {stage}". `t` is useTranslations("dashboard.stageMoments").
 * Returns false for other stages so the caller keeps its own message.
 */
export function showStageMoment({ status, t, router, firstOffer = false }) {
  if (status === "interviewing") {
    toast.success(t("interviewTitle"), {
      description: t("interviewBody"),
      action: { label: t("interviewAction"), onClick: () => router.push("/dashboard/story-bank") },
    });
    return true;
  }
  if (status === "offer") {
    toast.success(firstOffer ? t("firstOfferTitle") : t("offerTitle"), {
      description: t("offerBody"),
      action: { label: t("offerAction"), onClick: () => router.push("/dashboard/compare") },
    });
    return true;
  }
  return false;
}
