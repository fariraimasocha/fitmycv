"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  CopyIcon,
  ArrowsClockwiseIcon,
  LinkedinLogoIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LinkedInOutreachModal({
  open,
  onClose,
  tailoredCV,
  jobData,
  companyBrief,
}) {
  const [data, setData] = useState(null);
  const t = useTranslations("tailor.linkedin");
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [editedMessage, setEditedMessage] = useState("");

  const generate = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/linkedin-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tailoredCV, jobData, companyBrief }),
      });
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setEditedMessage(json.data.message);
        setActiveIndex(0);
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const allMessages = data
    ? [data.message, ...(data.alternateMessages || [])]
    : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(editedMessage);
    toast.success(t("copied"));
  };

  const selectMessage = (index) => {
    setActiveIndex(index);
    setEditedMessage(allMessages[index]);
  };

  if (!open) return null;

  // Generate on first open
  if (!data && !loading) {
    generate();
  }

  const charCount = editedMessage.length;
  const overLimit = charCount > 300;

  return (
    // A real Dialog: focus trap, Escape to close, and the same 8px card as
    // every other modal in the app.
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-md">
        <DialogHeader className="border-b border-[var(--landing-line)] px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <LinkedinLogoIcon size={18} weight="fill" className="text-[var(--dash-ink)]" aria-hidden="true" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : data ? (
            <>
              {/* Message versions */}
              {allMessages.length > 1 && (
                <div className="flex gap-1">
                  {allMessages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectMessage(i)}
                      className={`rounded-sm px-3 py-1 text-xs font-medium transition-colors ${
                        activeIndex === i
                          ? "bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]"
                          : "text-[var(--landing-ink-soft)] hover:bg-[var(--landing-paper-soft)] hover:text-[var(--landing-ink)]"
                      }`}
                    >
                      {t("version", { index: i + 1 })}
                    </button>
                  ))}
                </div>
              )}

              {/* Editable textarea */}
              <div className="relative">
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div
                  className={`absolute bottom-2 end-2 text-xs font-medium tabular-nums ${
                    overLimit ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {charCount}/300
                </div>
              </div>

              {overLimit && (
                <p className="text-xs text-destructive">
                  {t("overLimit")}
                </p>
              )}

              {/* Target roles */}
              {data.targetRoles?.length > 0 && (
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <UsersThreeIcon size={12} />
                    {t("targets")}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {data.targetRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1 gap-2" size="sm">
                  <CopyIcon size={14} />
                  {t("copy")}
                </Button>
                <Button
                  variant="outline"
                  onClick={generate}
                  disabled={loading}
                  size="sm"
                  className="gap-2"
                >
                  <ArrowsClockwiseIcon size={14} />
                  {t("another")}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
