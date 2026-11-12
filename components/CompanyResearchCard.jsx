"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BuildingsIcon,
  NewspaperIcon,
  UsersThreeIcon,
  TargetIcon,
  ArticleIcon,
  ArrowSquareOutIcon,
  LightningIcon,
  WarningIcon,
  SwordIcon,
  LightbulbIcon,
} from "@phosphor-icons/react";
import FormattedDate from "@/components/FormattedDate";
import { cn } from "@/lib/utils";

function InfoBadge({ children }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-[var(--landing-line)] px-3 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function CultureChip({ signal }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-[var(--landing-accent-soft)] px-3 text-xs font-medium text-[var(--landing-accent-dark)]">
      {signal}
    </span>
  );
}

// A brief section: tinted round icon and title, then the body. The card puts a
// hairline between sections, so each one carries its own padding.
function Section({ icon: Icon, title, tone, children }) {
  return (
    <section className="dashboard-card-pad flex flex-col gap-3">
      <h3 className="flex items-center gap-3 font-outfit text-sm font-semibold text-foreground">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            tone === "success"
              ? "bg-[var(--landing-success-soft)] text-[var(--landing-success)]"
              : "bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]"
          )}
        >
          <Icon size={16} aria-hidden="true" />
        </span>
        {title}
      </h3>
      {children}
    </section>
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
  const t = useTranslations("tailor.companyResearch");
  if (isLoading) {
    return (
      <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
        <CardHeader className="dashboard-card-pad">
          <CardTitle className="text-base flex items-center gap-2">
            <BuildingsIcon size={16} className="text-muted-foreground" />
            {t("loading")}
          </CardTitle>
        </CardHeader>
        <CardContent className="dashboard-card-pad pt-0">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!brief) {
    return (
      <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          {t("empty")}
        </CardContent>
      </Card>
    );
  }

  const bulletList = (items, tone = "accent") => (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
          <span
            aria-hidden="true"
            className={cn(
              "mt-3 size-1.5 shrink-0 rounded-full",
              tone === "success" ? "bg-[var(--landing-success)]" : "bg-[var(--landing-accent)]"
            )}
          />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
      <CardHeader className="dashboard-card-pad border-b border-[var(--landing-line)]">
        <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex min-w-0 items-center gap-3 font-outfit text-base font-semibold">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
              <BuildingsIcon size={18} aria-hidden="true" />
            </span>
            <span className="truncate">{brief.companyName}</span>
          </span>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {brief.fundingStage && brief.fundingStage !== "Unknown" && (
              <InfoBadge>{brief.fundingStage}</InfoBadge>
            )}
            {brief.teamSize && brief.teamSize !== "Unknown" && (
              <InfoBadge>{brief.teamSize}</InfoBadge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {/* One hairline between sections, the way Teal splits its editor panels. */}
      <CardContent className="divide-y divide-[var(--landing-line)] p-0">
        {brief.mission && (
          <Section icon={TargetIcon} title={t("mission")}>
            <p className="border-s-2 border-[var(--landing-line)] ps-3 text-sm italic leading-6 text-muted-foreground">
              &ldquo;{brief.mission}&rdquo;
            </p>
          </Section>
        )}

        {brief.summary && (
          <Section icon={ArticleIcon} title={t("summary")}>
            <p className="text-sm leading-6 text-muted-foreground">{brief.summary}</p>
          </Section>
        )}

        {brief.cultureSignals?.length > 0 && (
          <Section icon={UsersThreeIcon} title={t("culture")}>
            <div className="flex flex-wrap gap-2">
              {brief.cultureSignals.map((signal, i) => (
                <CultureChip key={i} signal={signal} />
              ))}
            </div>
          </Section>
        )}

        {brief.techStrategy && (
          <Section icon={LightningIcon} title={t("tech")}>
            <p className="text-sm leading-6 text-muted-foreground">{brief.techStrategy}</p>
          </Section>
        )}

        {brief.challenges?.length > 0 && (
          <Section icon={WarningIcon} title={t("challenges")}>
            {bulletList(brief.challenges)}
          </Section>
        )}

        {brief.competitors?.length > 0 && (
          <Section icon={SwordIcon} title={t("competitors")}>
            <ul className="flex flex-col gap-2">
              {brief.competitors.map((comp, i) => (
                <li key={i} className="text-sm leading-6">
                  <span className="font-medium text-foreground">{comp.name}</span>
                  {comp.differentiation && (
                    <span className="text-muted-foreground">: {comp.differentiation}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {brief.positioningTips?.length > 0 && (
          <Section icon={LightbulbIcon} title={t("positioning")} tone="success">
            {bulletList(brief.positioningTips, "success")}
          </Section>
        )}

        {brief.recentNews?.length > 0 && (
          <Section icon={NewspaperIcon} title={t("news")}>
            <ul className="flex flex-col gap-4">
              {brief.recentNews.map((item, i) => (
                <li key={i} className="flex flex-col gap-1">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 text-sm font-medium text-[var(--landing-ink)] hover:underline"
                    >
                      <span>{item.title}</span>
                      <ArrowSquareOutIcon size={14} className="mt-1 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{item.title}</p>
                  )}
                  {item.publishedAt && (
                    <FormattedDate
                      date={item.publishedAt}
                      className="block text-xs text-muted-foreground"
                      options={{
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }}
                    />
                  )}
                  {item.snippet && (
                    <p className="text-sm leading-6 text-muted-foreground">{item.snippet}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </CardContent>
    </Card>
  );
}
