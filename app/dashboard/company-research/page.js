"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  BuildingsIcon,
  CalendarIcon,
  BinocularsIcon,
  BriefcaseIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";

export default function CompanyResearchPage() {
  const { data: briefs, isLoading } = useQuery({
    queryKey: ["company-research"],
    queryFn: async () => {
      const res = await fetch("/api/company-research");
      if (!res.ok) throw new Error("Failed to fetch company research");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-outfit">Company Research</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Interview prep briefs automatically generated when you extract a job listing.
        </p>
      </motion.div>

      {!briefs || briefs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="rounded-2xl border shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
              <BinocularsIcon size={48} className="text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No company briefs yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Paste a job URL on{" "}
                <Link
                  href="/dashboard/tailor"
                  className="font-medium text-black underline"
                >
                  Tailor CV
                </Link>{" "}
                to auto-generate your first company brief.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {briefs.map((brief, index) => (
            <motion.div
              key={brief._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * (index + 1) }}
            >
              <Link href={`/dashboard/company-research/${brief._id}`}>
                <Card className="rounded-2xl border shadow-lg transition-shadow hover:shadow-xl cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <BuildingsIcon size={20} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {brief.companyName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        {brief.jobTitle && (
                          <span className="flex items-center gap-1 truncate">
                            <BriefcaseIcon size={14} />
                            {brief.jobTitle}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          <FormattedDate date={brief.createdAt} />
                        </span>
                      </div>
                      {brief.summary && (
                        <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                          {brief.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {brief.fundingStage && brief.fundingStage !== "Unknown" && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {brief.fundingStage}
                        </span>
                      )}
                      {brief.teamSize && brief.teamSize !== "Unknown" && (
                        <span className="text-xs text-muted-foreground">
                          {brief.teamSize}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
