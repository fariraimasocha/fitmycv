"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  BriefcaseIcon,
  BuildingsIcon,
  CalendarIcon,
  FileTextIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/Loader";

export default function TailoredCVsPage() {
  const { data: cvs, isLoading } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Failed to fetch tailored CVs");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-outfit">Tailored CVs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all your previously tailored resumes and cover letters.
        </p>
      </motion.div>

      {!cvs || cvs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="rounded-2xl border shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileTextIcon size={48} className="text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No tailored CVs yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Go to{" "}
                <Link
                  href="/dashboard/tailor"
                  className="font-medium text-black underline"
                >
                  Tailor Resume
                </Link>{" "}
                to create your first tailored CV.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {cvs.map((cv, index) => (
            <motion.div
              key={cv._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * (index + 1) }}
            >
              <Link href={`/dashboard/tailored/${cv._id}`}>
                <Card className="rounded-2xl border shadow-lg transition-shadow hover:shadow-xl cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <FileTextIcon size={20} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {cv.jobTitle || "Untitled Position"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        {cv.jobCompany && (
                          <span className="flex items-center gap-1">
                            <BuildingsIcon size={14} />
                            {cv.jobCompany}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          {new Date(cv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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
