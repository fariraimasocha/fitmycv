"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  UserIcon,
  CrownIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
} from "@/components/dashboard";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SubscriptionBadge({ isPremium, status }) {
  if (!isPremium) {
    return (
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        Free
      </span>
    );
  }

  if (status === "canceled") {
    return (
      <span className="rounded-full bg-[var(--landing-accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--landing-accent-dark)]">
        PRO · Canceling
      </span>
    );
  }

  return (
    <span className="rounded-full border border-[#c8e6d4] bg-[#eef8f1] px-2.5 py-0.5 text-xs font-medium text-[var(--landing-success)]">
      PRO
    </span>
  );
}

const PRO_FEATURES = [
  "Tailor and download unlimited CVs as PDF",
  "AI cover letters you can download as PDF",
  "Daily job matches by email",
];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const hasRefreshed = useRef(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Refresh JWT from DB once, avoids stale isPremium after Polar webhook
  useEffect(() => {
    if (hasRefreshed.current || status !== "authenticated") return;
    hasRefreshed.current = true;
    void update();
  }, [status, update]);

  // Surface billing redirect errors, then clean the query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "portal_failed") {
      toast.error(
        "We couldn't open the billing portal. Contact support if this keeps happening.",
      );
      router.replace("/dashboard/profile", { scroll: false });
    }
  }, [router]);

  if (status === "loading" && !session) return <Loader />;

  const user = session?.user ?? {};
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isPremium = !!user.isPremium;
  const subscriptionStatus = user.subscriptionStatus ?? null;
  const periodEnd = user.subscriptionCurrentPeriodEnd
    ? formatDate(user.subscriptionCurrentPeriodEnd)
    : null;

  const isDeleteConfirmed =
    deleteConfirm.trim().toLowerCase() ===
    String(user.email ?? "")
      .trim()
      .toLowerCase();

  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmed || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: deleteConfirm.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete account");
      toast.success("Your account has been deleted.");
      setDeleteOpen(false);
      setDeleteConfirm("");
      // Clear any cached onboarding flag
      try {
        sessionStorage.removeItem("onboardingJustCompleted");
      } catch {}
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete account"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="Profile"
        description="Manage your account and subscription."
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0 }}
      >
        <Card className="dashboard-card overflow-hidden rounded-2xl border-border py-0 gap-0">
          {/* Banner strip */}
          <div className="bg-foreground/5 flex flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
            <Avatar className="h-16 w-16 ring-2 ring-border">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0">
              <p className="text-lg font-semibold leading-tight truncate">
                {user.name ?? "Not set"}
              </p>
              <p className="text-sm text-muted-foreground truncate">{user.email ?? "Not set"}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <UserIcon className="size-3" />
                Google
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Subscription card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      >
        <Card className="dashboard-card rounded-2xl border-border">
          <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CrownIcon
                className={`size-4 ${isPremium ? "text-[var(--landing-accent)]" : "text-muted-foreground"}`}
              />
              <CardTitle className="text-base">Subscription</CardTitle>
            </div>
            <SubscriptionBadge isPremium={isPremium} status={subscriptionStatus} />
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium ? (
              <>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize text-[var(--landing-success)]">
                      {subscriptionStatus ?? "Active"}
                    </span>
                  </div>
                  {periodEnd && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {subscriptionStatus === "canceled" ? "Access until" : "Renews"}
                      </span>
                      <span className="font-medium">{periodEnd}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {PRO_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircleIcon className="size-4 shrink-0 text-[var(--landing-success)]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full sm:w-auto h-auto py-3">
                  <Link href="/api/polar/portal">
                    Manage Billing
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <ul className="space-y-1.5">
                  {PRO_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircleIcon className="size-4 text-muted-foreground shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full sm:w-auto h-auto py-3">
                  <Link href="/dashboard/upgrade">
                    Upgrade to Pro
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
      >
        <Card className="dashboard-card rounded-2xl border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <WarningCircleIcon size={18} weight="fill" className="text-destructive" />
              Danger zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all data. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">What will be deleted</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Your profile and login</li>
                <li>Reference CV and all tailored CVs with cover letters</li>
                <li>Applications, saved jobs, company research and story bank</li>
                <li>Subscription data linked to this account</li>
              </ul>
              {isPremium && (
                <p className="mt-3 text-sm font-medium text-destructive">
                  You have an active PRO subscription. Cancel it in Manage Billing before deleting to avoid future charges through Polar.
                </p>
              )}
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteConfirm("");
                setDeleteOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <TrashIcon className="mr-2 size-4" />
              Delete account
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteConfirm("");
        }}
      >
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <TrashIcon size={18} />
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-left">
              This will permanently delete <span className="font-medium text-foreground">{user.email}</span> and all data. Type your email to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm font-medium text-destructive">This cannot be undone</p>
              <p className="mt-1 text-sm text-muted-foreground">
                All CVs, tailored applications, and research will be lost.
                {isPremium ? " Your PRO access will be revoked. Manage billing first if you have a recurring subscription." : ""}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="delete-confirm" className="text-sm font-medium">
                Type <span className="font-semibold">{user.email}</span> to confirm
              </label>
              <Input
                id="delete-confirm"
                placeholder={user.email ?? "your email"}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                autoComplete="off"
                className="border-input"
                disabled={deleting}
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteConfirm("");
              }}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!isDeleteConfirmed || deleting}
              className="w-full sm:w-auto"
            >
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
}
