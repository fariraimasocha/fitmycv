"use client";

import Link from "next/link";
import { CrownIcon, CheckCircleIcon, ArrowRightIcon } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DOWNLOAD_FEATURES = [
  "Download tailored CVs as PDF",
  "Download cover letters as PDF",
  "Access all your tailored CVs",
  "Unlimited CV tailoring",
];

export default function UpgradePromptModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <CrownIcon className="size-5 text-amber-500" />
            <DialogTitle>Unlock your tailored CV</DialogTitle>
          </div>
          <DialogDescription>
            Your documents are ready. Upgrade to Pro to download them as PDFs.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 my-2">
          {DOWNLOAD_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircleIcon className="size-4 text-green-600 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild className="flex-1">
            <Link href="/api/polar/checkout">
              Upgrade to Pro
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
