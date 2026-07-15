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
    <Card className="rounded-2xl shadow-lg border">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <EnvelopeSimpleIcon size={18} aria-hidden="true" />
          Cover Letter
        </CardTitle>
        {editable && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
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
      <CardContent>
        {editable && isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={16}
              className="text-sm leading-relaxed"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
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
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {content}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No cover letter generated yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
