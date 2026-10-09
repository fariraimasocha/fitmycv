"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  ChatCenteredTextIcon,
  CopyIcon,
  ArrowsClockwiseIcon,
  CrownIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardPanelHeader } from "@/components/dashboard";
import { countSentences } from "@/utils/count-sentences";

export default function WhyThisRoleCard({
  answer,
  question,
  isLoading,
  onGenerate,
  onSave,
  isSaving,
  locked = false,
}) {
  const t = useTranslations("tailor.whyThisRole");
  const defaultQuestion = t("defaultQuestion");
  const [draft, setDraft] = useState(answer ?? "");
  const [lastAnswer, setLastAnswer] = useState(answer ?? "");
  const [prompt, setPrompt] = useState(() => question || defaultQuestion);

  // A fresh answer from the parent replaces the draft, but typing is never
  // clobbered while the same answer is still on screen.
  if (answer !== undefined && answer !== lastAnswer) {
    setLastAnswer(answer);
    setDraft(answer ?? "");
  }

  const sentences = countSentences(draft);
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    toast.success(t("copied"));
  };

  return (
    <section className="dashboard-card flex flex-col overflow-hidden rounded-lg">
      <div className="dashboard-card-pad flex items-start gap-3 border-b border-[var(--landing-line)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <ChatCenteredTextIcon size={17} aria-hidden="true" />
        </span>
        <DashboardPanelHeader
          className="min-w-0 flex-1"
          title={t("title")}
          description={t("description")}
        />
      </div>
      <div className="dashboard-card-pad flex flex-col gap-4">
        {onGenerate && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="why-this-role-question"
              className="text-xs font-medium text-[var(--landing-ink-soft)]"
            >
              {t("questionLabel")}
            </label>
            <Input
              id="why-this-role-question"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={defaultQuestion}
              className="text-sm"
            />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2" aria-busy="true">
            <div className="tool-skeleton h-4 w-full rounded-sm" />
            <div className="tool-skeleton h-4 w-full rounded-sm" />
            <div className="tool-skeleton h-4 w-4/5 rounded-sm" />
          </div>
        ) : draft ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={7}
              aria-label={t("answerAria")}
              className="text-sm leading-relaxed"
            />
            <p className="text-xs tabular-nums text-muted-foreground">
              {t("counts", { sentences, words })}
            </p>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
            {onGenerate
              ? t("emptyGenerate")
              : t("emptySaved")}
          </p>
        )}

        {(onGenerate || draft) && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {onGenerate && (
              <button
                type="button"
                onClick={() => onGenerate(prompt)}
                disabled={isLoading}
                aria-busy={isLoading}
                className="dashboard-primary-btn"
              >
                {isLoading ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    {t("writing")}
                  </>
                ) : (
                  <>
                    {locked ? (
                      <CrownIcon size={16} aria-hidden="true" />
                    ) : (
                      <ArrowsClockwiseIcon size={16} aria-hidden="true" />
                    )}
                    {draft ? t("writeAgain") : t("write")}
                  </>
                )}
              </button>
            )}
            {draft && (
              <button type="button" className="dashboard-secondary-btn" onClick={handleCopy}>
                <CopyIcon size={16} aria-hidden="true" />
                {t("copy")}
              </button>
            )}
            {draft && onSave && (
              <button
                type="button"
                className="dashboard-secondary-btn"
                onClick={() => onSave(draft)}
                disabled={isSaving}
                aria-busy={isSaving}
              >
                {isSaving ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <FloppyDiskIcon size={16} aria-hidden="true" />
                    {t("save")}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
