"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChatCircleIcon, KanbanIcon, TrophyIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { DashboardStatCard, DashboardStatGrid } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PillTrack } from "@/components/charts/PillTrack";
import { computeInsights, computeTimeline } from "@/lib/applications";

// The Insights tab of the Applications page. Its own file so recharts loads
// only when someone opens the tab.
export default function ApplicationInsights({ applications }) {
  const [now] = useState(() => Date.now());
  const insights = useMemo(() => computeInsights(applications), [applications]);
  const timeline = useMemo(
    () => computeTimeline(applications.map((a) => a.createdAt), now),
    [applications, now]
  );

  const tiles = [
    { label: "Applications", value: insights.total, icon: KanbanIcon },
    {
      label: "Response rate",
      value: `${insights.responseRate}%`,
      icon: ChatCircleIcon,
      subtitle: "Applied and reached screening",
    },
    { label: "Reached interview", value: insights.interviews, icon: UsersThreeIcon },
    {
      label: "Offers",
      value: insights.offers,
      icon: TrophyIcon,
      subtitle: insights.rejected ? `${insights.rejected} rejected` : undefined,
    },
  ];

  return (
    <div className="space-y-4">
      <DashboardStatGrid>
        {tiles.map((tile, i) => (
          <DashboardStatCard key={tile.label} {...tile} delay={i * 0.05} />
        ))}
      </DashboardStatGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
          <CardHeader className="dashboard-card-pad">
            <CardTitle className="text-base">Pipeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              How many applications reached each stage, including ones that later closed.
            </p>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-3 pt-0">
            {insights.funnel.map((step) => (
              <div key={step.key} className="space-y-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {step.reached}
                    {step.conversion !== null && `, ${step.conversion}% of the stage before`}
                  </span>
                </div>
                <PillTrack value={step.share} color="var(--landing-accent)" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
          <CardHeader className="dashboard-card-pad">
            <CardTitle className="text-base">Added per week</CardTitle>
            <p className="text-sm text-muted-foreground">Applications added in the last 8 weeks.</p>
          </CardHeader>
          <CardContent className="dashboard-card-pad pt-0">
            {/* recharts writes fill as an SVG attribute, where var() does not resolve. currentColor does. */}
            <div className="h-56 text-[var(--landing-accent)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeline} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    contentStyle={{ borderRadius: 6, borderColor: "#e3ddd4", fontSize: 12 }}
                  />
                  <Bar dataKey="count" name="Added" fill="currentColor" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
