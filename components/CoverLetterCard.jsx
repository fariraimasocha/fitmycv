"use client";

import { useState } from "react";
import {
  EnvelopeSimpleIcon,
  PencilSimpleIcon,
  XIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { DashboardPanelHeader } from "@/components/dashboard";

export default function CoverLetterCard({
  content,
  editable,
  onSave,
  isSaving,
  fontStack,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave?.(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <section className="dashboard-card flex flex-col overflow-hidden rounded-lg">
      <div className="dashboard-card-pad flex items-start gap-3 border-b border-[var(--landing-line)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <EnvelopeSimpleIcon size={17} aria-hidden="true" />
        </span>
        <DashboardPanelHeader
          className="min-w-0 flex-1 items-center"
          title="Cover letter"
          description={
            content
              ? "Written from your tailored CV and this posting."
              : "Written with the CV when you tailor. You can also write your own."
          }
          action={
            editable ? (
              <button
                type="button"
                className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                aria-label={isEditing ? "Cancel editing cover letter" : "Edit cover letter"}
                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <XIcon size={14} aria-hidden="true" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilSimpleIcon size={14} aria-hidden="true" />
                    Edit
                  </>
                )}
              </button>
            ) : undefined
          }
        />
      </div>
      <div className="dashboard-card-pad">
        {editable && isEditing ? (
          <div className="flex flex-col gap-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={16}
              aria-label="Cover letter text"
              className="text-sm leading-relaxed"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                aria-busy={isSaving}
                className="dashboard-primary-btn"
              >
                {isSaving ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FloppyDiskIcon size={16} aria-hidden="true" />
                    Save cover letter
                  </>
                )}
              </button>
            </div>
          </div>
        ) : content ? (
          // Shown as the page it becomes, in the CV's font, so what you read
          // here is what the PDF looks like.
          <article
            className="mx-auto max-w-2xl rounded-md border border-[var(--landing-line)] bg-white px-5 py-7 text-base leading-7 text-foreground sm:px-12 sm:py-12"
            style={fontStack ? { fontFamily: fontStack } : undefined}
          >
            {content
              .split(/\n\s*\n/)
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, i) => (
                <p key={`${i}-${paragraph.slice(0, 24)}`} className="mb-5 whitespace-pre-line last:mb-0">
                  {paragraph.trim()}
                </p>
              ))}
          </article>
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
              Your cover letter will appear here.
              {editable ? " Write one now and it saves with this CV." : ""}
            </p>
            {editable && (
              <button
                type="button"
                className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                onClick={() => setIsEditing(true)}
              >
                <PencilSimpleIcon size={14} aria-hidden="true" />
                Write a cover letter
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
