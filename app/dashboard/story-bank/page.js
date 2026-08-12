"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  BookOpenIcon,
  TagIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
} from "@/components/dashboard";

function StoryCard({ story, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="dashboard-card overflow-hidden rounded-2xl border-border py-0 gap-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-2 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold line-clamp-1">{story.title || `Story ${index + 1}`}</p>
          {story.usedFor?.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Used for: {story.usedFor.map((u) => `${u.company} — ${u.jobTitle}`).join(", ")}
            </p>
          )}
          {story.tags?.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <TagIcon size={10} className="text-muted-foreground" />
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {expanded ? <CaretUpIcon size={14} /> : <CaretDownIcon size={14} />}
      </button>
      {expanded && (
        <CardContent className="border-t pt-3 space-y-2">
          {[
            { label: "Situation", value: story.situation },
            { label: "Task", value: story.task },
            { label: "Action", value: story.action },
            { label: "Result", value: story.result },
            { label: "Reflection", value: story.reflection },
          ]
            .filter((item) => item.value)
            .map((item) => (
              <div key={item.label}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm text-foreground">{item.value}</p>
              </div>
            ))}
        </CardContent>
      )}
    </Card>
  );
}

export default function StoryBankPage() {
  const { data: stories, isLoading } = useQuery({
    queryKey: ["story-bank"],
    queryFn: async () => {
      const res = await fetch("/api/story-bank");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="Story Bank"
        description="Your accumulated STAR stories across all applications. Use these to prepare for any interview."
      />

      {!stories || stories.length === 0 ? (
        <DashboardEmptyState
          icon={BookOpenIcon}
          title="No stories saved yet"
          description="Tailor a resume and use the Interview Prep tab to generate stories, then save them here."
          actionLabel="Go to Tailor CV"
          actionHref="/dashboard/tailor"
        />
      ) : (
        <div className="space-y-2">
          {stories.map((story, i) => (
            <motion.div
              key={story._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <StoryCard story={story} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  );
}
