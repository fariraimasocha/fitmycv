"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  CrownIcon,
  ArrowSquareOutIcon,
  CheckCircleIcon,
  TrashIcon,
  WarningCircleIcon,
  GoogleLogoIcon,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Profile";
const PAGE_DESCRIPTION = "Your account, plan and data.";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PlanBadge({ isPremium, status }) {
  if (!isPremium) {
    return (
      <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--landing-paper-soft)] px-2.5 text-xs font-medium text-muted-foreground">
        Free
      </span>
    );
  }
  if (status === "canceled") {
    return (
      <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--landing-accent-soft)] px-2.5 text-xs font-medium text-[var(--landing-accent-dark)]">
        Pro, canceling
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--landing-success-soft)] px-2.5 text-xs font-medium text-[var(--landing-success)]">
      Pro
    </span>
  );
}

function Field({ label, children, className }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-foreground">{children}</dd>
    </div>
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
      await signOut({ redirectTo: "/" });
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
      <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      <DashboardPanel delay={0.05}>
        <DashboardPanelHeader
          title="Account"
          description="Details come from your Google account."
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-12 rounded-md ring-1 ring-[var(--landing-line)]">
              <AvatarImage src={user.image} alt="" className="rounded-md" />
              <AvatarFallback className="rounded-md bg-[var(--landing-primary-soft)] font-outfit text-base font-semibold text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-outfit text-base font-semibold text-foreground">
                {user.name ?? "Not set"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email ?? "Not set"}
              </p>
            </div>
          </div>
          <span className="inline-flex h-8 w-fit shrink-0 items-center gap-1.5 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2.5 text-xs font-medium text-foreground">
            <GoogleLogoIcon size={14} weight="bold" aria-hidden="true" />
            Signed in with Google
          </span>
        </div>
      </DashboardPanel>

      <DashboardPanel delay={0.1}>
        <DashboardPanelHeader
          title="Plan"
          description={
            isPremium
              ? "Your Pro plan and billing."
              : "You are on the free plan."
          }
          action={<PlanBadge isPremium={isPremium} status={subscriptionStatus} />}
        />
        {isPremium && (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <span className="capitalize text-[var(--landing-success)]">
                {subscriptionStatus ?? "Active"}
              </span>
            </Field>
            {periodEnd && (
              <Field label={subscriptionStatus === "canceled" ? "Access until" : "Renews on"}>
                <span className="tabular-nums">{periodEnd}</span>
              </Field>
            )}
          </dl>
        )}
        <p className="mt-4 border-t border-[var(--landing-line)] pt-4 text-xs text-muted-foreground">
          {isPremium ? "Included in your plan" : "Included in Pro"}
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {PRO_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircleIcon
                size={16}
                weight={isPremium ? "fill" : "regular"}
                className={cn(
                  "shrink-0",
                  isPremium ? "text-[var(--landing-success)]" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          {isPremium ? (
            <Link href="/api/polar/portal" className="dashboard-secondary-btn w-full sm:w-auto">
              <ArrowSquareOutIcon size={16} aria-hidden="true" />
              Manage billing
            </Link>
          ) : (
            <Link href="/dashboard/upgrade" className="dashboard-primary-btn w-full sm:w-auto">
              <CrownIcon size={16} aria-hidden="true" />
              Upgrade to Pro
            </Link>
          )}
        </div>
      </DashboardPanel>

      <DashboardPanel delay={0.15}>
        <DashboardPanelHeader
          title={
            <span className="inline-flex items-center gap-1.5 text-destructive">
              <WarningCircleIcon size={16} weight="fill" aria-hidden="true" />
              Delete account
            </span>
          }
          description="Deletes your account and every file in it. This cannot be undone."
        />
        <div className="mt-4 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
          <p className="text-sm font-medium text-foreground">What gets deleted</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Your profile and login</li>
            <li>Reference CV and all tailored CVs with cover letters</li>
            <li>Applications, saved jobs, company research and story bank</li>
            <li>Subscription data linked to this account</li>
          </ul>
          {isPremium && (
            <p className="mt-3 text-sm font-medium text-destructive">
              You have an active Pro plan. Cancel it in Manage billing first to avoid
              future charges through Polar.
            </p>
          )}
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              setDeleteConfirm("");
              setDeleteOpen(true);
            }}
            className="dashboard-secondary-btn w-full text-destructive hover:border-destructive/40 hover:bg-destructive/10 sm:w-auto"
          >
            <TrashIcon size={16} aria-hidden="true" />
            Delete account
          </button>
        </div>
      </DashboardPanel>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteConfirm("");
        }}
      >
        <DialogContent className="rounded-lg border-[var(--landing-line)] bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <TrashIcon size={18} aria-hidden="true" />
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-left">
              This deletes{" "}
              <span className="font-medium text-foreground">{user.email}</span> and
              all of its data. Type your email to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm font-medium text-destructive">This cannot be undone</p>
              <p className="mt-1 text-sm text-muted-foreground">
                All CVs, tailored applications and research will be lost.
                {isPremium
                  ? " Your Pro access ends. Cancel billing first if you have a recurring plan."
                  : ""}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="delete-confirm" className="text-sm font-medium">
                Type <span className="font-semibold">{user.email}</span> to confirm
              </Label>
              <Input
                id="delete-confirm"
                placeholder={user.email ?? "your email"}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                autoComplete="off"
                className="h-9 border-input"
                disabled={deleting}
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteConfirm("");
              }}
              disabled={deleting}
              className="dashboard-secondary-btn w-full sm:w-auto"
            >
              Cancel
            </button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!isDeleteConfirmed || deleting}
              className="h-10 w-full rounded-md px-4 font-outfit text-sm font-medium sm:w-auto"
            >
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
}
