"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowLeftIcon,
  BuildingsIcon,
  CalendarIcon,
  BriefcaseIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";

export default function CompanyResearchDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: brief, isLoading } = useQuery({
    queryKey: ["company-research", id],
    queryFn: async () => {
      const res = await fetch(`/api/company-research/${id}`);
      if (!res.ok) throw new Error("Failed to fetch company research");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!brief) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Company research brief not found.</p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => router.push("/dashboard/company-research")}
        >
          <ArrowLeftIcon size={16} />
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => router.push("/dashboard/company-research")}
        >
          <ArrowLeftIcon size={16} />
          Back to Company Research
        </Button>

        <div>
          <h1 className="text-2xl font-bold font-outfit flex items-center gap-2">
            <BuildingsIcon size={22} />
            {brief.companyName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {brief.jobTitle && (
              <span className="flex items-center gap-1">
                <BriefcaseIcon size={14} />
                {brief.jobTitle}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarIcon size={14} />
              <FormattedDate date={brief.createdAt} />
            </span>
            {brief.jobUrl && (
              <a
                href={brief.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
              >
                <ArrowSquareOutIcon size={14} />
                Job posting
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <CompanyResearchCard brief={brief} isLoading={false} />
      </motion.div>
    </div>
  );
}
