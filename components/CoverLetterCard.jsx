"use client";

import { useState } from "react";
import {
  EnvelopeSimpleIcon,
  PencilSimpleIcon,
  XIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
      <CardHeader className="dashboard-card-pad flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <EnvelopeSimpleIcon
            size={18}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          Cover Letter
        </CardTitle>
        {editable && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-md border-[var(--landing-line)]"
            aria-label={isEditing ? "Cancel editing cover letter" : "Edit cover letter"}
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
          >
            {isEditing ? (
              <>
                <XIcon size={14} />
                Cancel
              </>
            ) : (
              <>
                <PencilSimpleIcon size={14} />
                Edit
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="dashboard-card-pad pt-0">
        {editable && isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={16}
              className="max-w-prose text-sm leading-relaxed"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-md bg-foreground px-6 font-outfit font-medium text-background hover:bg-black"
              >
                {isSaving ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FloppyDiskIcon size={16} />
                    Save Cover Letter
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : content ? (
          // Shown as the page it becomes, in the CV's font, so what you read
          // here is what the PDF looks like.
          <article
            className="mx-auto max-w-2xl rounded-md border border-[var(--landing-line)] bg-white px-5 py-7 text-base leading-7 text-foreground shadow-[var(--landing-shadow-sm)] sm:px-12 sm:py-12"
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
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              Tailoring a CV writes a cover letter with it. You can also write
              your own.
            </p>
            {editable && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-[var(--landing-line)]"
                onClick={() => setIsEditing(true)}
              >
                <PencilSimpleIcon size={14} aria-hidden="true" />
                Write one
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
