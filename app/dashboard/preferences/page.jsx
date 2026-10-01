"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  XIcon,
  CrownIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/countries";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardEmptyState,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";

const MAX_TITLES = 10;

function ToggleRow({ id, checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function LoadingPanels() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="tool-skeleton h-44 rounded-lg" />
      <div className="tool-skeleton h-32 rounded-lg" />
      <div className="tool-skeleton h-36 rounded-lg" />
    </div>
  );
}

// Saved values with the same defaults the API applies, so a fresh account
// reads as "All changes saved" instead of "Unsaved changes".
function readPrefs(prefs) {
  return {
    titles: prefs?.titles ?? [],
    country: prefs?.country ?? "us",
    remoteOnly: prefs ? prefs.remoteOnly !== false : true,
    emailDigest: prefs ? prefs.emailDigest !== false : true,
  };
}

// The form seeds its state from `prefs` once on mount. It only renders after
// the query has settled, so the seed is the saved record. After a save the
// refetched `prefs` feeds `saved`, which is what the status text compares to.
function PreferencesForm({ prefs }) {
  const t = useTranslations("dashboard.preferences");
  const queryClient = useQueryClient();
  const saved = useMemo(() => readPrefs(prefs), [prefs]);

  const [titles, setTitles] = useState(saved.titles);
  const [titleInput, setTitleInput] = useState("");
  const [country, setCountry] = useState(saved.country);
  const [remoteOnly, setRemoteOnly] = useState(saved.remoteOnly);
  const [emailDigest, setEmailDigest] = useState(saved.emailDigest);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(t("saveChangesError"));
      return (await res.json()).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      toast.success(t("saved"));
    },
    onError: () => toast.error(t("saveError")),
  });

  const isDirty =
    titles.length !== saved.titles.length ||
    titles.some((title, i) => title !== saved.titles[i]) ||
    country !== saved.country ||
    remoteOnly !== saved.remoteOnly ||
    emailDigest !== saved.emailDigest;

  function addTitle() {
    const title = titleInput.trim();
    if (!title || titles.includes(title) || titles.length >= MAX_TITLES) {
      setTitleInput("");
      return;
    }
    setTitles([...titles, title]);
    setTitleInput("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({ titles, country, remoteOnly, emailDigest });
  }

  const atLimit = titles.length >= MAX_TITLES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DashboardPanel delay={0.05}>
        <DashboardPanelHeader
          title={t("targetRoles")}
          description={t("targetRolesDescription")}
          action={
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {t("titleCount", { count: titles.length, max: MAX_TITLES })}
            </span>
          }
        />
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title-input" className="text-sm font-medium">
              {t("jobTitle")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="title-input"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTitle();
                  }
                }}
                placeholder={t("jobTitlePlaceholder")}
                disabled={atLimit}
                className="h-9"
              />
              <button
                type="button"
                onClick={addTitle}
                disabled={atLimit || !titleInput.trim()}
                className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
              >
                {t("addTitle")}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {atLimit
                ? t("limitReached")
                : t("addTitleHint")}
            </p>
          </div>
          {titles.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {titles.map((title) => (
                <li
                  key={title}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] pl-2.5 pr-1 text-sm text-foreground"
                >
                  <span className="max-w-60 truncate">{title}</span>
                  <button
                    type="button"
                    onClick={() => setTitles(titles.filter((x) => x !== title))}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    aria-label={t("removeTitle", { title })}
                  >
                    <XIcon size={12} weight="bold" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DashboardPanel>

      <DashboardPanel delay={0.1}>
        <DashboardPanelHeader
          title={t("jobMarket")}
          description={t("jobMarketDescription")}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="country" className="text-sm font-medium">
              {t("country")}
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger
                id="country"
                className="h-9 w-full border-[var(--landing-line)] bg-[var(--landing-surface)]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("countryHint")}
            </p>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel delay={0.15}>
        <DashboardPanelHeader
          title={t("email")}
          description={t("emailDescription")}
        />
        <div className="mt-4 divide-y divide-[var(--landing-line)]">
          <ToggleRow
            id="emailDigest"
            checked={emailDigest}
            onChange={setEmailDigest}
            label={t("emailDigest")}
            description={t("emailDigestDescription")}
          />
          <ToggleRow
            id="remoteOnly"
            checked={remoteOnly}
            onChange={setRemoteOnly}
            label={t("remoteOnly")}
            description={t("remoteOnlyDescription")}
          />
        </div>
      </DashboardPanel>

      <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)]/95 px-3 py-2.5 backdrop-blur-md sm:bottom-4 sm:px-4">
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            isDirty ? "text-[var(--landing-accent-dark)]" : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {isDirty ? (
            <>
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--landing-accent)]"
                aria-hidden="true"
              />
              {t("unsaved")}
            </>
          ) : (
            t("allSaved")
          )}
        </p>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="dashboard-primary-btn"
        >
          {mutation.isPending ? (
            <>
              <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
              {t("saving")}
            </>
          ) : (
            <>
              <FloppyDiskIcon size={16} aria-hidden="true" />
              {t("savePreferences")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function PreferencesPage() {
  const t = useTranslations("dashboard.preferences");
  const { data: session, status } = useSession();
  const isPremium = !!session?.user?.isPremium;

  const {
    data: prefs,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const res = await fetch("/api/preferences");
      if (!res.ok) throw new Error(t("loadError"));
      const json = await res.json();
      return json.data;
    },
    enabled: isPremium,
  });

  if (status === "loading") return <Loader />;

  if (!isPremium) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={t("title")} description={t("description")} />
        <DashboardEmptyState
          icon={CrownIcon}
          title={t("proTitle")}
          description={t("proDescription")}
          actionLabel={t("proAction")}
          actionHref="/dashboard/upgrade"
          secondaryLabel={t("backHome")}
          secondaryHref="/dashboard"
        />
      </DashboardPageShell>
    );
  }

  if (isLoading) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={t("title")} description={t("description")} />
        <LoadingPanels />
      </DashboardPageShell>
    );
  }

  if (isError) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={t("title")} description={t("description")} />
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title={t("loadFailedTitle")}
          description={t("loadFailedDescription")}
          actionLabel={isFetching ? t("retrying") : t("tryAgain")}
          onAction={() => refetch()}
          actionDisabled={isFetching}
        />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader title={t("title")} description={t("description")} />
      <PreferencesForm prefs={prefs} />
    </DashboardPageShell>
  );
}
