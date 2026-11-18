"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { DashboardPanel, DashboardPanelHeader } from "./DashboardPanel";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

const QUERY_KEY = ["weekly-goal"];

async function fetchWeeklyGoal() {
  const res = await fetch("/api/user/weekly-goal");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Couldn't load your weekly goal.");
  return json.data;
}

async function saveWeeklyGoal(goal) {
  const res = await fetch("/api/user/weekly-goal", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Couldn't save your goal.");
  return json.data;
}

// Counts only this week. Past weeks are not shown or mentioned, so a missed
// week costs nothing and the bar starts fresh on Monday.
export function HomeWeeklyGoal({ className, delay = 0.1 }) {
  const t = useTranslations("dashboard.home.weeklyGoal");
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(null);
  const { data, isError } = useQuery({ queryKey: QUERY_KEY, queryFn: fetchWeeklyGoal });

  const mutation = useMutation({
    mutationFn: saveWeeklyGoal,
    onSuccess: (next, goal) => {
      queryClient.setQueryData(QUERY_KEY, next);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      trackEvent("weekly_goal_set", { goal });
      setDraft(null);
      toast.success(t("saved"));
    },
    onError: () => toast.error(t("saveError")),
  });

  const goal = data?.goal ?? 0;
  const applied = data?.applied ?? 0;
  const percent = goal ? Math.min(100, (applied / goal) * 100) : 0;
  const reached = goal > 0 && applied >= goal;

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = Number.parseInt(draft, 10);
    if (!Number.isInteger(value) || value < 1 || value > 50) return;
    mutation.mutate(value);
  };

  return (
    <DashboardPanel delay={delay} className={className}>
      <DashboardPanelHeader
        title={t("title")}
        action={
          data && draft === null ? (
            <button
              type="button"
              onClick={() => setDraft(String(goal))}
              className="tap-target shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("change")}
            </button>
          ) : null
        }
      />

      {isError && <p className="mt-4 text-sm text-muted-foreground">{t("loadError")}</p>}

      {data && (
        <>
          <p className="mt-4 text-sm font-medium tabular-nums text-foreground" aria-live="polite">
            {t("progress", { applied, goal })}
          </p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
            role="progressbar"
            aria-valuenow={Math.min(applied, goal)}
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-label={t("progress", { applied, goal })}
          >
            <motion.div
              className="h-full origin-left rounded-full bg-[var(--landing-accent)] rtl:origin-right"
              style={{ width: `${percent}%` }}
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.15, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>

          {reached ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-foreground">
              <CheckCircleIcon size={16} aria-hidden="true" className="shrink-0 text-[var(--landing-success)]" />
              {t("done")}
            </p>
          ) : (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{t("hint")}</p>
          )}

          {draft !== null && (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-center gap-2 border-t border-dash-line pt-4">
              <label htmlFor="weekly-goal-input" className="w-full text-xs text-muted-foreground sm:w-auto">
                {t("label")}
              </label>
              <Input
                id="weekly-goal-input"
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                required
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-20 text-base sm:text-sm"
              />
              <button
                type="submit"
                disabled={mutation.isPending}
                className="dashboard-secondary-btn dashboard-secondary-btn-sm tap-target"
              >
                {mutation.isPending ? t("saving") : t("save")}
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="tap-target text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("cancel")}
              </button>
            </form>
          )}
        </>
      )}
    </DashboardPanel>
  );
}
