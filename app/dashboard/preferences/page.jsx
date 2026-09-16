"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

const PAGE_TITLE = "Job preferences";
const PAGE_DESCRIPTION = "Choose which jobs land in your daily email.";
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
      if (!res.ok) throw new Error("Failed to save");
      return (await res.json()).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      toast.success("Preferences saved");
    },
    onError: () => toast.error("Could not save preferences"),
  });

  const isDirty =
    titles.length !== saved.titles.length ||
    titles.some((t, i) => t !== saved.titles[i]) ||
    country !== saved.country ||
    remoteOnly !== saved.remoteOnly ||
    emailDigest !== saved.emailDigest;

  function addTitle() {
    const t = titleInput.trim();
    if (!t || titles.includes(t) || titles.length >= MAX_TITLES) {
      setTitleInput("");
      return;
    }
    setTitles([...titles, t]);
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
          title="Target roles"
          description="Add up to 10 job titles. Leave empty to use the titles from your CV."
          action={
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {titles.length} of {MAX_TITLES}
            </span>
          }
        />
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title-input" className="text-sm font-medium">
              Job title
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
                placeholder="Frontend Engineer"
                disabled={atLimit}
                className="h-9"
              />
              <button
                type="button"
                onClick={addTitle}
                disabled={atLimit || !titleInput.trim()}
                className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
              >
                Add title
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {atLimit
                ? "You have reached the limit. Remove a title to add another."
                : "Press Enter or Add title to save it to the list."}
            </p>
          </div>
          {titles.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {titles.map((t) => (
                <li
                  key={t}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] pl-2.5 pr-1 text-sm text-foreground"
                >
                  <span className="max-w-60 truncate">{t}</span>
                  <button
                    type="button"
                    onClick={() => setTitles(titles.filter((x) => x !== t))}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    aria-label={`Remove ${t}`}
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
          title="Job market"
          description="Where to look for matching roles."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country
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
              Remote roles are often limited to one country.
            </p>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel delay={0.15}>
        <DashboardPanelHeader
          title="Email"
          description="What arrives in your inbox."
        />
        <div className="mt-4 divide-y divide-[var(--landing-line)]">
          <ToggleRow
            id="emailDigest"
            checked={emailDigest}
            onChange={setEmailDigest}
            label="Email me daily job matches"
            description="Turn off to stop the daily email."
          />
          <ToggleRow
            id="remoteOnly"
            checked={remoteOnly}
            onChange={setRemoteOnly}
            label="Remote roles only"
            description="Only include remote jobs in your matches."
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
              Unsaved changes
            </>
          ) : (
            "All changes saved"
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
              Saving…
            </>
          ) : (
            <>
              <FloppyDiskIcon size={16} aria-hidden="true" />
              Save preferences
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function PreferencesPage() {
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
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
    enabled: isPremium,
  });

  if (status === "loading") return <Loader />;

  if (!isPremium) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <DashboardEmptyState
          icon={CrownIcon}
          title="Job preferences are part of Pro"
          description="Upgrade to pick the roles, country and email settings for your daily job matches."
          actionLabel="Upgrade to Pro"
          actionHref="/dashboard/upgrade"
          secondaryLabel="Back to home"
          secondaryHref="/dashboard"
        />
      </DashboardPageShell>
    );
  }

  if (isLoading) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <LoadingPanels />
      </DashboardPageShell>
    );
  }

  if (isError) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title="Couldn't load your preferences"
          description="Check your connection and try again."
          actionLabel={isFetching ? "Retrying…" : "Try again"}
          onAction={() => refetch()}
          actionDisabled={isFetching}
        />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <PreferencesForm prefs={prefs} />
    </DashboardPageShell>
  );
}
