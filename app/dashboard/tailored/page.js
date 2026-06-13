"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  BriefcaseIcon,
  BuildingsIcon,
  CalendarIcon,
  FileTextIcon,
  TrashIcon,
  ArrowRightIcon,
  ReadCvLogoIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";

export default function TailoredCVsPage() {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: cvs, isLoading } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Failed to fetch tailored CVs");
      const json = await res.json();
      return json.data;
    },
  });

  const { data: referenceCV } = useQuery({
    queryKey: ["reference-cv"],
    queryFn: () => fetch("/api/reference-cv").then((r) => r.json()),
  });

  const hasReferenceCV = !!referenceCV?.data;

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/tailored-cv/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete CV");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
      toast.success("CV deleted");
      setConfirmDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setConfirmDeleteId(null);
    },
  });

  const handleTrashClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteId === id) {
      deleteMutation.mutate(id);
    } else {
      setConfirmDeleteId(id);
    }
  };

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
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16 text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <FileTextIcon size={28} className="text-muted-foreground/60" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold font-outfit text-foreground">
                  No tailored CVs yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-[320px]">
                  {hasReferenceCV
                    ? "Paste a job listing URL and we'll tailor your CV to match the role."
                    : "Upload your base CV first, then paste any job URL to generate a tailored version."}
                </p>
              </div>
              <Link
                href={hasReferenceCV ? "/dashboard/tailor" : "/dashboard/resume"}
                className="group inline-flex items-center gap-2 font-outfit font-semibold text-sm bg-foreground text-background rounded-[10px] px-5 py-2.5 transition-all duration-200 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
              >
                {hasReferenceCV ? (
                  <>
                    Tailor your first resume
                    <ArrowRightIcon size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                ) : (
                  <>
                    <ReadCvLogoIcon size={14} aria-hidden="true" />
                    Upload your CV
                  </>
                )}
              </Link>
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <FileTextIcon size={20} className="text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {cv.jobTitle || "Untitled Position"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {cv.jobCompany && (
                          <span className="flex items-center gap-1">
                            <BuildingsIcon size={14} />
                            {cv.jobCompany}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          <FormattedDate date={cv.createdAt} />
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={confirmDeleteId === cv._id ? "destructive" : "ghost"}
                      size="sm"
                      className="shrink-0 rounded-full"
                      disabled={deleteMutation.isPending}
                      onClick={(e) => handleTrashClick(e, cv._id)}
                      aria-label={
                        confirmDeleteId === cv._id
                          ? `Confirm delete ${cv.jobTitle || "CV"}`
                          : `Delete ${cv.jobTitle || "CV"}`
                      }
                    >
                      {confirmDeleteId === cv._id ? (
                        "Delete?"
                      ) : (
                        <TrashIcon size={16} aria-hidden="true" />
                      )}
                    </Button>
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
