"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
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
} from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { dateLocale } from "@/i18n/routing";

// Subscription statuses with a translated label. Anything else shows as stored.
const KNOWN_STATUSES = ["active", "canceled", "trialing", "past_due", "incomplete", "unpaid"];

function formatDate(dateStr, locale) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(dateLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PlanBadge({ isPremium, status }) {
  const t = useTranslations("dashboard.profile");
  if (!isPremium) {
    return (
      <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--landing-paper-soft)] px-3 text-xs font-medium text-muted-foreground">
        {t("planFree")}
      </span>
    );
  }
  if (status === "canceled") {
    return (
      <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--landing-accent-soft)] px-3 text-xs font-medium text-[var(--landing-accent-dark)]">
        {t("planCancelling")}
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--landing-success-soft)] px-3 text-xs font-medium text-[var(--landing-success)]">
      {t("planPro")}
    </span>
  );
}

// Teal settings pattern: one panel, a titled group per topic, and rows with
// the label on the left and the value or control on the right from sm up.
function SettingsGroup({ title, description, aside, children }) {
  return (
    <section>
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-1 sm:px-6">
        <div className="min-w-0">
          <h2 className="font-outfit text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {aside}
      </div>
      <div className="divide-y divide-[var(--landing-line)]">{children}</div>
    </section>
  );
}

function SettingsRow({ label, children, className }) {
  return (
    <div className={cn("grid gap-2 px-4 py-4 sm:grid-cols-3 sm:gap-6 sm:px-6", className)}>
      <dt className="text-sm font-medium text-foreground">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground sm:col-span-2">{children}</dd>
    </div>
  );
}

// The row that holds a group's one action, aligned with the value column.
function ActionRow({ children }) {
  return (
    <div className="flex px-4 py-4 sm:justify-end sm:px-6">{children}</div>
  );
}

// Labels come from messages (profile.features.<key>).
const PRO_FEATURES = ["tailoredPdf", "coverLetterPdf", "dailyMatches"];

export default function ProfilePage() {
  const t = useTranslations("dashboard.profile");
  const locale = useLocale();
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
      toast.error(t("portalError"));
      router.replace("/dashboard/profile", { scroll: false });
    }
  }, [router, t]);

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
    ? formatDate(user.subscriptionCurrentPeriodEnd, locale)
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
      if (!res.ok) throw new Error(data.error || t("deleteError"));
      toast.success(t("deleted"));
      setDeleteOpen(false);
      setDeleteConfirm("");
      // Clear any cached onboarding flag
      try {
        sessionStorage.removeItem("onboardingJustCompleted");
      } catch {}
      await signOut({ redirectTo: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("deleteError")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardPageShell>
      <DashboardPageHeader title={t("title")} description={t("description")} />

      <DashboardPanel pad={false} delay={0.05} bodyClassName="divide-y divide-[var(--landing-line)]">
        <SettingsGroup title={t("account")} description={t("accountDescription")}>
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-12 ring-1 ring-[var(--landing-line)]">
                <AvatarImage src={user.image} alt="" />
                <AvatarFallback className="bg-[var(--landing-primary-soft)] font-outfit text-base font-semibold text-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name ?? t("notSet")}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email ?? t("notSet")}
                </p>
              </div>
            </div>
            <span className="inline-flex h-6 w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 text-xs font-medium text-foreground">
              <GoogleLogoIcon size={14} weight="bold" aria-hidden="true" />
              {t("signedInWithGoogle")}
            </span>
          </div>
        </SettingsGroup>

        <SettingsGroup
          title={t("plan")}
          description={isPremium ? t("planDescriptionPro") : t("planDescriptionFree")}
          aside={<PlanBadge isPremium={isPremium} status={subscriptionStatus} />}
        >
          <dl className="divide-y divide-[var(--landing-line)]">
            {isPremium && (
              <SettingsRow label={t("status")}>
                <span className="font-medium capitalize text-[var(--landing-success)]">
                  {!subscriptionStatus
                    ? t("statuses.active")
                    : KNOWN_STATUSES.includes(subscriptionStatus)
                      ? t(`statuses.${subscriptionStatus}`)
                      : subscriptionStatus}
                </span>
              </SettingsRow>
            )}
            {isPremium && periodEnd && (
              <SettingsRow label={subscriptionStatus === "canceled" ? t("accessUntil") : t("renewsOn")}>
                <span className="font-medium tabular-nums">{periodEnd}</span>
              </SettingsRow>
            )}
            <SettingsRow label={isPremium ? t("includedInPlan") : t("includedInPro")}>
              <ul className="flex flex-col gap-2">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircleIcon
                      size={16}
                      weight={isPremium ? "fill" : "regular"}
                      className={cn(
                        "shrink-0",
                        isPremium ? "text-[var(--landing-success)]" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    {t(`features.${feature}`)}
                  </li>
                ))}
              </ul>
            </SettingsRow>
          </dl>
          <ActionRow>
            {isPremium ? (
              <Link href="/api/polar/portal" className="dashboard-secondary-btn w-full sm:w-auto">
                <ArrowSquareOutIcon size={16} aria-hidden="true" />
                {t("manageBilling")}
              </Link>
            ) : (
              <Link href="/dashboard/upgrade" className="dashboard-primary-btn w-full sm:w-auto">
                <CrownIcon size={16} aria-hidden="true" />
                {t("upgrade")}
              </Link>
            )}
          </ActionRow>
        </SettingsGroup>

        <SettingsGroup
          title={
            <span className="inline-flex items-center gap-2 text-destructive">
              <WarningCircleIcon size={16} weight="fill" aria-hidden="true" />
              {t("deleteAccount")}
            </span>
          }
          description={t("deleteDescription")}
        >
          <dl>
            <SettingsRow label={t("whatGetsDeleted")}>
              <ul className="list-disc space-y-1 ps-4 text-muted-foreground">
                <li>{t("deletedItems.profile")}</li>
                <li>{t("deletedItems.cvs")}</li>
                <li>{t("deletedItems.applications")}</li>
                <li>{t("deletedItems.subscription")}</li>
              </ul>
              {isPremium && (
                <p className="mt-3 font-medium text-destructive">{t("activePlanWarning")}</p>
              )}
            </SettingsRow>
          </dl>
          <ActionRow>
            <button
              type="button"
              onClick={() => {
                setDeleteConfirm("");
                setDeleteOpen(true);
              }}
              className="dashboard-secondary-btn w-full text-destructive hover:border-destructive/40 hover:bg-destructive/10 sm:w-auto"
            >
              <TrashIcon size={16} aria-hidden="true" />
              {t("deleteAccount")}
            </button>
          </ActionRow>
        </SettingsGroup>
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
              {t("dialogTitle")}
            </DialogTitle>
            <DialogDescription className="text-start">
              {t.rich("dialogDescription", {
                email: user.email ?? "",
                strong: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm font-medium text-destructive">{t("cannotUndo")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dialogWarning")}
                {isPremium ? ` ${t("dialogWarningPro")}` : ""}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="delete-confirm" className="text-sm font-medium">
                {t.rich("typeToConfirm", {
                  email: user.email ?? "",
                  strong: (chunks) => <span className="font-semibold">{chunks}</span>,
                })}
              </Label>
              <Input
                id="delete-confirm"
                placeholder={user.email ?? t("emailPlaceholder")}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                autoComplete="off"
                className="h-control border-input"
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
              {t("cancel")}
            </button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!isDeleteConfirmed || deleting}
              className="h-control w-full rounded-md px-4 font-outfit text-sm font-medium sm:w-auto"
            >
              {deleting ? t("deleting") : t("deleteAccount")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
}
