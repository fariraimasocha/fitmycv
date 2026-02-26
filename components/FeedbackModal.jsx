"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
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

export default function FeedbackModal({ open, onOpenChange }) {
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
      if (!res.ok) throw new Error("Failed to send feedback");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Feedback sent! Thank you.");
      onOpenChange(false);
      setType("General");
      setMessage("");
    },
    onError: () => {
      toast.error("Failed to send feedback. Please try again.");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    mutation.mutate({ type, name, email, message });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve FitMyCV by sharing your thoughts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="feedback-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="feedback-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Send Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
