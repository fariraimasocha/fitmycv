"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  LightbulbIcon,
  WarningCircleIcon,
  ChatTeardropDotsIcon,
  BookmarkSimpleIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

function StoryAccordion({ story, index, onSave }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-2 p-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Story {index + 1}</p>
          <p className="text-sm font-medium line-clamp-1">{story.requirement}</p>
        </div>
        {expanded ? <CaretUpIcon size={14} /> : <CaretDownIcon size={14} />}
      </button>
      {expanded && (
        <div className="border-t px-3 pb-3 pt-2 space-y-2">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Situation</p>
            <p className="text-sm text-foreground">{story.situation}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Task</p>
            <p className="text-sm text-foreground">{story.task}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</p>
            <p className="text-sm text-foreground">{story.action}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</p>
            <p className="text-sm text-foreground">{story.result}</p>
          </div>
          {story.reflection && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reflection</p>
              <p className="text-sm text-foreground italic">{story.reflection}</p>
            </div>
          )}
          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(story)}
              className="mt-1 text-xs"
            >
              <BookmarkSimpleIcon size={14} />
              Save to Story Bank
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  );
}

export default function InterviewPrepCard({ prepData, isLoading, jobTitle, jobCompany }) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Generating interview prep...</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!prepData) {
    return (
      <Card className="rounded-2xl border shadow-lg">
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Interview prep will appear here after tailoring your CV.
        </CardContent>
      </Card>
    );
  }

  const handleSaveStory = async (story) => {
    try {
      const res = await fetch("/api/story-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: {
            title: story.requirement,
            situation: story.situation,
            task: story.task,
            action: story.action,
            result: story.result,
            reflection: story.reflection,
            tags: [],
            usedFor: [{ jobTitle: jobTitle || "", company: jobCompany || "", date: new Date() }],
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Story saved to bank!");
    } catch {
      toast.error("Failed to save story");
    }
  };

  const { stories, redFlagQA, talkingPoints } = prepData;

  return (
    <Card className="rounded-2xl border shadow-lg">
      <CardHeader>
        <CardTitle className="text-base">Interview Preparation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* STAR Stories */}
        {stories?.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ChatTeardropDotsIcon size={16} />
              STAR Stories ({stories.length})
            </h3>
            <div className="space-y-2">
              {stories.map((story, i) => (
                <StoryAccordion
                  key={i}
                  story={story}
                  index={i}
                  onSave={handleSaveStory}
                />
              ))}
            </div>
          </div>
        )}

        {/* Red Flag Q&A */}
        {redFlagQA?.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
              <WarningCircleIcon size={16} weight="fill" />
              Red Flag Questions
            </h3>
            <div className="space-y-3">
              {redFlagQA.map((qa, i) => (
                <div key={i} className="rounded-lg bg-amber-50 dark:bg-amber-900/10 p-3 space-y-1.5">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Q: {qa.question}
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    A: {qa.suggestedAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Talking Points */}
        {talkingPoints?.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
              <LightbulbIcon size={16} weight="fill" />
              Key Talking Points
            </h3>
            <ul className="space-y-1.5">
              {talkingPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-green-500">*</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
