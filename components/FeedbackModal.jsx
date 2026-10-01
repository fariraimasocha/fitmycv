"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export default function FeedbackModal({ open, onOpenChange }) {
  const t = useTranslations("pages.feedback");
  const { data: session } = useSession();

  const [type, setType] = useState("General");
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Couldn't send your feedback.");
      return res.json();
    },
    onSuccess: () => {
      trackEvent("feedback_submitted", { feedback_type: type });
      toast.success(t("sent"));
      onOpenChange(false);
      setType("General");
      setMessage("");
    },
    onError: () => {
      toast.error(t("sendError"));
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    mutation.mutate({ type, name, email, message });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="feedback-type">{t("typeLabel")}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="feedback-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">{t("types.general")}</SelectItem>
                <SelectItem value="Bug">{t("types.bug")}</SelectItem>
                <SelectItem value="Feature Request">{t("types.featureRequest")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-message">{t("messageLabel")}</Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? t("sending") : t("submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
