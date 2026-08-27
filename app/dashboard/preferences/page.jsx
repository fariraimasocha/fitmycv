"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { XIcon, CrownIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/dashboard";

function Toggle({ id, checked, onChange, label, description }) {
  return (
    <label htmlFor={id} className="flex items-start justify-between gap-4 cursor-pointer">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-primary shrink-0"
      />
    </label>
  );
}

export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const isPremium = !!session?.user?.isPremium;

  const [titles, setTitles] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [country, setCountry] = useState("us");
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const { data: prefs, isLoading } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const res = await fetch("/api/preferences");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
    enabled: isPremium,
  });

  useEffect(() => {
    if (!prefs) return;
    setTitles(prefs.titles ?? []);
    setCountry(prefs.country ?? "us");
    setRemoteOnly(prefs.remoteOnly !== false);
    setEmailDigest(prefs.emailDigest !== false);
  }, [prefs]);

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

  function addTitle() {
    const t = titleInput.trim();
    if (!t || titles.includes(t) || titles.length >= 10) {
      setTitleInput("");
      return;
    }
    setTitles([...titles, t]);
    setTitleInput("");
  }

  if (status === "loading") return <Loader />;

  if (!isPremium) {
    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <Card className="rounded-xl border-border text-center">
          <CardContent className="py-12 space-y-4">
            <CrownIcon className="size-8 text-amber-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-lg font-semibold">Job preferences are a Pro feature</p>
              <p className="text-sm text-muted-foreground">
                Upgrade to control your daily job matches by email.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/upgrade">
                Upgrade to Pro
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="Job Preferences"
        description="Control your daily job-match email."
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="dashboard-card rounded-2xl border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Target roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Add the job titles you want matched. Leave empty to use the titles from your CV.
            </p>
            {titles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {titles.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTitles(titles.filter((x) => x !== t))}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${t}`}
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTitle();
                  }
                }}
                placeholder="e.g. Frontend Engineer"
              />
              <Button type="button" variant="outline" onClick={addTitle}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      >
        <Card className="rounded-xl border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Email & filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Country</p>
                <p className="text-xs text-muted-foreground">
                  Which job market to search. Remote roles are often country-scoped.
                </p>
              </div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-44 shrink-0">
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
            </div>
            <Toggle
              id="emailDigest"
              checked={emailDigest}
              onChange={setEmailDigest}
              label="Email me daily job matches"
              description="Turn off to unsubscribe from the digest."
            />
            <Toggle
              id="remoteOnly"
              checked={remoteOnly}
              onChange={setRemoteOnly}
              label="Remote roles only"
              description="Only include remote jobs in your matches."
            />
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-end">
        <Button
          onClick={() => mutation.mutate({ titles, country, remoteOnly, emailDigest })}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving…" : "Save preferences"}
        </Button>
      </div>
    </DashboardPageShell>
  );
}
