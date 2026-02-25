"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BuildingsIcon,
  NewspaperIcon,
  UsersThreeIcon,
  TargetIcon,
  ArticleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";

function InfoBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function CultureChip({ signal }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
      {signal}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export default function CompanyResearchCard({ brief, isLoading }) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BuildingsIcon size={16} />
            Researching company…
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!brief) {
    return (
      <Card className="rounded-2xl border shadow-lg">
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Company research will appear here after tailoring your resume.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-2 text-base">
            <BuildingsIcon size={18} />
            {brief.companyName}
          </span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {brief.fundingStage && brief.fundingStage !== "Unknown" && (
              <InfoBadge>{brief.fundingStage}</InfoBadge>
            )}
            {brief.teamSize && brief.teamSize !== "Unknown" && (
              <InfoBadge>{brief.teamSize}</InfoBadge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mission */}
        {brief.mission && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <TargetIcon size={15} />
              Mission
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-3">
              &ldquo;{brief.mission}&rdquo;
            </p>
          </div>
        )}

        {/* Executive Summary */}
        {brief.summary && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ArticleIcon size={15} />
              Executive Summary
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {brief.summary}
            </p>
          </div>
        )}

        {/* Culture Signals */}
        {brief.cultureSignals?.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <UsersThreeIcon size={15} />
              Culture Signals
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {brief.cultureSignals.map((signal, i) => (
                <CultureChip key={i} signal={signal} />
              ))}
            </div>
          </div>
        )}

        {/* Recent News */}
        {brief.recentNews?.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <NewspaperIcon size={15} />
              Recent News
            </h3>
            <ul className="space-y-3">
              {brief.recentNews.map((item, i) => (
                <li key={i} className="space-y-0.5">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <span>{item.title}</span>
                      <ArrowSquareOutIcon size={12} className="mt-0.5 shrink-0" />
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{item.title}</p>
                  )}
                  {item.publishedAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {item.snippet && (
                    <p className="text-sm text-muted-foreground">{item.snippet}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
