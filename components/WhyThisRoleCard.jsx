"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChatCenteredTextIcon,
  CopyIcon,
  ArrowsClockwiseIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardPanelHeader } from "@/components/dashboard";
import { countSentences } from "@/utils/count-sentences";

const DEFAULT_QUESTION =
  "In 3 to 5 sentences, tell us why you are interested in this role.";

export default function WhyThisRoleCard({
  answer,
  question,
  isLoading,
  onGenerate,
  onSave,
  isSaving,
}) {
  const [draft, setDraft] = useState(answer ?? "");
  const [lastAnswer, setLastAnswer] = useState(answer ?? "");
  const [prompt, setPrompt] = useState(question || DEFAULT_QUESTION);

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
    toast.success("Answer copied");
  };

  return (
    <section className="dashboard-card flex flex-col overflow-hidden rounded-lg">
      <div className="dashboard-card-pad flex items-start gap-3 border-b border-[var(--landing-line)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <ChatCenteredTextIcon size={17} aria-hidden="true" />
        </span>
        <DashboardPanelHeader
          className="min-w-0 flex-1"
          title="Why this role"
          description="An answer for the application form, drawn from your CV and this posting."
        />
      </div>
      <div className="dashboard-card-pad flex flex-col gap-4">
        {onGenerate && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="why-this-role-question"
              className="text-xs font-medium text-[var(--landing-ink-soft)]"
            >
              The question you were asked
            </label>
            <Input
              id="why-this-role-question"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={DEFAULT_QUESTION}
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
              aria-label="Your answer"
              className="text-sm leading-relaxed"
            />
            <p className="text-xs tabular-nums text-muted-foreground">
              {sentences} {sentences === 1 ? "sentence" : "sentences"}, {words}{" "}
              {words === 1 ? "word" : "words"}
            </p>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
            {onGenerate
              ? "Your answer will appear here. Change the question if yours is worded differently, then write it."
              : "No answer saved for this application."}
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
                    Writing…
                  </>
                ) : (
                  <>
                    <ArrowsClockwiseIcon size={16} aria-hidden="true" />
                    {draft ? "Write it again" : "Write my answer"}
                  </>
                )}
              </button>
            )}
            {draft && (
              <button type="button" className="dashboard-secondary-btn" onClick={handleCopy}>
                <CopyIcon size={16} aria-hidden="true" />
                Copy answer
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
                    Saving…
                  </>
                ) : (
                  <>
                    <FloppyDiskIcon size={16} aria-hidden="true" />
                    Save answer
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
