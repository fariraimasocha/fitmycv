"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  XIcon,
  CopyIcon,
  ArrowsClockwiseIcon,
  LinkedinLogoIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function LinkedInOutreachModal({
  open,
  onClose,
  tailoredCV,
  jobData,
  companyBrief,
}) {
  const [data, setData] = useState(null);
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
      toast.error("Failed to generate message");
    } finally {
      setLoading(false);
    }
  };

  const allMessages = data
    ? [data.message, ...(data.alternateMessages || [])]
    : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(editedMessage);
    toast.success("Copied to clipboard!");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-background border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <LinkedinLogoIcon size={18} weight="fill" className="text-blue-600" />
            <h2 className="text-sm font-semibold">LinkedIn Connection Message</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
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
                      onClick={() => selectMessage(i)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                        activeIndex === i
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      Version {i + 1}
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
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div
                  className={`absolute bottom-2 right-2 text-xs font-medium tabular-nums ${
                    overLimit ? "text-red-500" : "text-muted-foreground"
                  }`}
                >
                  {charCount}/300
                </div>
              </div>

              {overLimit && (
                <p className="text-xs text-red-500">
                  Message exceeds LinkedIn's 300-character limit for connection requests.
                </p>
              )}

              {/* Target roles */}
              {data.targetRoles?.length > 0 && (
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <UsersThreeIcon size={12} />
                    Suggested targets
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {data.targetRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
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
                  Copy Message
                </Button>
                <Button
                  variant="outline"
                  onClick={generate}
                  disabled={loading}
                  size="sm"
                  className="gap-2"
                >
                  <ArrowsClockwiseIcon size={14} />
                  Regenerate
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
