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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countSentences } from "@/utils/count-sentences";

const DEFAULT_QUESTION =
  "In 3-5 sentences, tell us why you are interested in this role.";

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
    <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
      <CardHeader className="dashboard-card-pad">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ChatCenteredTextIcon
            size={18}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          <div>
            <span className="block">Why this role</span>
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
              An answer for the application form, drawn from your CV and this
              posting.
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-card-pad space-y-4 pt-0">
        {onGenerate && (
        <div className="space-y-1.5">
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
            className="h-11 rounded-xl border-border bg-[var(--landing-paper-soft)] text-sm"
          />
        </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : draft ? (
          <>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={7}
              aria-label="Your answer"
              className="max-w-prose text-sm leading-relaxed"
            />
            <p className="text-xs tabular-nums text-muted-foreground">
              {sentences} {sentences === 1 ? "sentence" : "sentences"}, {words}{" "}
              {words === 1 ? "word" : "words"}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {onGenerate
              ? "Edit the question if yours is worded differently, then write the answer."
              : "No answer saved for this application yet."}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {onGenerate && (
          <Button
            onClick={() => onGenerate(prompt)}
            disabled={isLoading}
            aria-busy={isLoading}
            className="rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
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
          </Button>
          )}
          {draft && (
            <Button
              variant="outline"
              className="rounded-md border-border"
              onClick={handleCopy}
            >
              <CopyIcon size={16} aria-hidden="true" />
              Copy answer
            </Button>
          )}
          {draft && onSave && (
            <Button
              variant="outline"
              className="rounded-md border-border"
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
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
