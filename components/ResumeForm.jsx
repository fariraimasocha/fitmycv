"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  PlusIcon,
  TrashIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
  XIcon,
  ListChecksIcon,
  CaretDownIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ItemReorderControls from "@/components/ItemReorderControls";
import { FindingRow, SEVERITY_ORDER, SeverityCount } from "@/components/ATSScoreCard";
import { checkCv } from "@/lib/ats/rules";
import { cn } from "@/lib/utils";

// Validation messages are message keys, translated where they render.
const resumeSchema = z.object({
  basics: z.object({
    name: z.string().min(1, "nameRequired"),
    label: z.string().optional().default(""),
    email: z.string().email("emailInvalid").or(z.literal("")),
    phone: z.string().optional().default(""),
    summary: z.string().optional().default(""),
    location: z.string().optional().default(""),
    profiles: z
      .array(
        z.object({
          network: z.string().optional().default(""),
          url: z.string().optional().default(""),
        }),
      )
      .optional()
      .default([]),
  }),
  work: z
    .array(
      z.object({
        company: z.string().optional().default(""),
        position: z.string().optional().default(""),
        location: z.string().optional().default(""),
        startDate: z.string().optional().default(""),
        endDate: z.string().optional().default(""),
        description: z.string().optional().default(""),
      }),
    )
    .optional()
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string().optional().default(""),
        degree: z.string().optional().default(""),
        fieldOfStudy: z.string().optional().default(""),
        startDate: z.string().optional().default(""),
        endDate: z.string().optional().default(""),
      }),
    )
    .optional()
    .default([]),
  skills: z
    .array(
      z.object({
        category: z.string().optional().default(""),
        skills: z.array(z.string()).optional().default([]),
      }),
    )
    .optional()
    .default([]),
});

export default function ResumeForm({
  initialData,
  rawText,
  saveEndpoint = "/api/resume",
  saveMethod = "PUT",
  queryKey = ["resume"],
  saveButtonLabel,
  onSaved,
  // Fires with the current form values and the live check report on every
  // change, so a parent can drive a preview without owning the form.
  onValuesChange,
  // Hide the built-in checks panel when the parent renders the report itself.
  showChecks = true,
  // True while the values came from a fresh upload and have never been saved.
  isDraft = false,
}) {
  const queryClient = useQueryClient();
  const t = useTranslations("tailor.resumeForm");

  const form = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || {
      basics: {
        name: "",
        label: "",
        email: "",
        phone: "",
        summary: "",
        location: "",
        profiles: [],
      },
      work: [],
      education: [],
      skills: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isDirty },
  } = form;

  // Live ATS checks. `now` is captured once so render stays pure; the rules
  // only compare months, so one value per editing session is enough.
  const [now] = useState(() => Date.now());
  const values = useWatch({ control });
  const report = useMemo(() => checkCv(values, now), [values, now]);

  useEffect(() => {
    onValuesChange?.(values, report);
  }, [values, report, onValuesChange]);

  // Field paths ("work.2.startDate") get focus; section paths ("skills") scroll.
  const goToFinding = (path) => {
    if (path.includes(".")) {
      setFocus(path);
    } else {
      document.getElementById(`cv-section-${path}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const {
    fields: workFieldsList,
    append: appendWork,
    remove: removeWork,
    move: moveWork,
  } = useFieldArray({ control, name: "work" });
  const {
    fields: educationFieldsList,
    append: appendEducation,
    remove: removeEducation,
    move: moveEducation,
  } = useFieldArray({ control, name: "education" });
  const {
    fields: skillsFieldsList,
    append: appendSkill,
    remove: removeSkill,
    move: moveSkill,
  } = useFieldArray({ control, name: "skills" });
  const {
    fields: profilesFieldsList,
    append: appendProfile,
    remove: removeProfile,
    move: moveProfile,
  } = useFieldArray({ control, name: "basics.profiles" });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(saveEndpoint, {
        method: saveMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rawText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("saveError"));
      }

      return res.json();
    },
    onSuccess: (_result, data) => {
      toast.success(t("saved"));
      queryClient.invalidateQueries({ queryKey });
      // Saved values become the new baseline, so the dirty flag clears.
      reset(data);
      onSaved?.(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    saveMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {showChecks && <CvChecks report={report} onSelect={goToFinding} t={t} />}

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card className="dashboard-card rounded-lg py-0 gap-0">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border/60 dashboard-card-pad">
            <CardTitle className="text-base font-semibold">{t("sections.personal")}</CardTitle>
          </CardHeader>
          <CardContent className="dashboard-card-pad grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fields.fullNameRequired")}</Label>
              <Input id="name" {...register("basics.name")} />
              {errors.basics?.name && (
                <p className="text-destructive text-sm">
                  {t(`errors.${errors.basics.name.message}`)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">{t("fields.headline")}</Label>
              <Input id="label" {...register("basics.label")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("fields.email")}</Label>
              <Input id="email" type="email" {...register("basics.email")} />
              {errors.basics?.email && (
                <p className="text-destructive text-sm">
                  {t(`errors.${errors.basics.email.message}`)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("fields.phone")}</Label>
              <Input id="phone" {...register("basics.phone")} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="location">{t("fields.location")}</Label>
              <Input id="location" {...register("basics.location")} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="summary">{t("fields.summary")}</Label>
              <Textarea id="summary" rows={4} {...register("basics.summary")} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Online Profiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="dashboard-card rounded-lg py-0 gap-0">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border/60 dashboard-card-pad">
            <CardTitle className="text-base font-semibold">{t("sections.profiles")}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md border-border"
              onClick={() => appendProfile({ network: "", url: "" })}
            >
              <PlusIcon size={14} />
              {t("addProfileButton")}
            </Button>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-4">
            {profilesFieldsList.length === 0 && (
              <SectionEmptyState
                actionLabel={t("addProfile")}
                onAction={() => appendProfile({ network: "", url: "" })}
              >
                {t("empty.profiles")}
              </SectionEmptyState>
            )}
            {profilesFieldsList.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-[var(--landing-paper-soft)] p-4 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label>{t("fields.network")}</Label>
                  <Input
                    placeholder={t("placeholders.network")}
                    {...register(`basics.profiles.${index}.network`)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>{t("fields.url")}</Label>
                  <Input
                    placeholder="https://..."
                    {...register(`basics.profiles.${index}.url`)}
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <ItemReorderControls
                    index={index}
                    totalCount={profilesFieldsList.length}
                    onMoveUp={() => moveProfile(index, index - 1)}
                    onMoveDown={() => moveProfile(index, index + 1)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeProfile(index)}
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Work Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        id="cv-section-work"
        className="scroll-mt-20"
      >
        <Card className="dashboard-card rounded-lg py-0 gap-0">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border/60 dashboard-card-pad">
            <CardTitle className="text-base font-semibold">{t("sections.work")}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md border-border"
              onClick={() =>
                appendWork({
                  company: "",
                  position: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              <PlusIcon size={14} />
              {t("addPositionButton")}
            </Button>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-4">
            {workFieldsList.length === 0 && (
              <SectionEmptyState
                actionLabel={t("addPosition")}
                onAction={() =>
                  appendWork({
                    company: "",
                    position: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
              >
                {t("empty.work")}
              </SectionEmptyState>
            )}
            {workFieldsList.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-xl border border-border/60 bg-[var(--landing-paper-soft)] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {t("positionN", { index: index + 1 })}
                  </p>
                  <div className="flex items-center gap-1">
                    <ItemReorderControls
                      index={index}
                      totalCount={workFieldsList.length}
                      onMoveUp={() => moveWork(index, index - 1)}
                      onMoveDown={() => moveWork(index, index + 1)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeWork(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("fields.company")}</Label>
                    <Input {...register(`work.${index}.company`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.position")}</Label>
                    <Input {...register(`work.${index}.position`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.location")}</Label>
                    <Input {...register(`work.${index}.location`)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{t("fields.startDate")}</Label>
                      <Input
                        placeholder={t("placeholders.yearMonth")}
                        {...register(`work.${index}.startDate`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fields.endDate")}</Label>
                      <Input
                        placeholder={t("placeholders.endDate")}
                        {...register(`work.${index}.endDate`)}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>{t("fields.description")}</Label>
                    <Textarea
                      rows={3}
                      {...register(`work.${index}.description`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        id="cv-section-education"
        className="scroll-mt-20"
      >
        <Card className="dashboard-card rounded-lg py-0 gap-0">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border/60 dashboard-card-pad">
            <CardTitle className="text-base font-semibold">{t("sections.education")}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md border-border"
              onClick={() =>
                appendEducation({
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              <PlusIcon size={14} />
              {t("addEducationButton")}
            </Button>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-4">
            {educationFieldsList.length === 0 && (
              <SectionEmptyState
                actionLabel={t("addEducation")}
                onAction={() =>
                  appendEducation({
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                  })
                }
              >
                {t("empty.education")}
              </SectionEmptyState>
            )}
            {educationFieldsList.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-xl border border-border/60 bg-[var(--landing-paper-soft)] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {t("educationN", { index: index + 1 })}
                  </p>
                  <div className="flex items-center gap-1">
                    <ItemReorderControls
                      index={index}
                      totalCount={educationFieldsList.length}
                      onMoveUp={() => moveEducation(index, index - 1)}
                      onMoveDown={() => moveEducation(index, index + 1)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeEducation(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("fields.institution")}</Label>
                    <Input {...register(`education.${index}.institution`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.degree")}</Label>
                    <Input
                      placeholder={t("placeholders.degree")}
                      {...register(`education.${index}.degree`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.fieldOfStudy")}</Label>
                    <Input {...register(`education.${index}.fieldOfStudy`)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{t("fields.startDate")}</Label>
                      <Input
                        placeholder={t("placeholders.yearMonth")}
                        {...register(`education.${index}.startDate`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fields.endDate")}</Label>
                      <Input
                        placeholder={t("placeholders.yearMonth")}
                        {...register(`education.${index}.endDate`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        id="cv-section-skills"
        className="scroll-mt-20"
      >
        <Card className="dashboard-card rounded-lg py-0 gap-0">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border/60 dashboard-card-pad">
            <CardTitle className="text-base font-semibold">{t("sections.skills")}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md border-border"
              onClick={() => appendSkill({ category: "", skills: [] })}
            >
              <PlusIcon size={14} />
              {t("addCategoryButton")}
            </Button>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-4">
            {skillsFieldsList.length === 0 && (
              <SectionEmptyState
                actionLabel={t("addCategory")}
                onAction={() => appendSkill({ category: "", skills: [] })}
              >
                {t("empty.skills")}
              </SectionEmptyState>
            )}
            {skillsFieldsList.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-xl border border-border/60 bg-[var(--landing-paper-soft)] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {t("categoryN", { index: index + 1 })}
                  </p>
                  <div className="flex items-center gap-1">
                    <ItemReorderControls
                      index={index}
                      totalCount={skillsFieldsList.length}
                      onMoveUp={() => moveSkill(index, index - 1)}
                      onMoveDown={() => moveSkill(index, index + 1)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeSkill(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("fields.categoryName")}</Label>
                    <Input
                      placeholder={t("placeholders.category")}
                      {...register(`skills.${index}.category`)}
                    />
                  </div>
                  <SkillsList
                    control={control}
                    register={register}
                    nestIndex={index}
                    t={t}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)]/95 px-3 py-2.5 shadow-[var(--landing-shadow-sm)] backdrop-blur-md sm:bottom-4 sm:px-4">
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            isDirty || isDraft
              ? "text-[var(--landing-accent-dark)]"
              : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {isDirty || isDraft ? (
            <>
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--landing-accent)]"
                aria-hidden="true"
              />
              {isDirty ? t("status.unsaved") : t("status.notSaved")}
            </>
          ) : (
            t("status.allSaved")
          )}
        </p>
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded-md bg-foreground px-6 font-outfit font-semibold text-background hover:opacity-90"
        >
          {saveMutation.isPending ? (
            <>
              <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
              {t("saving")}
            </>
          ) : (
            <>
              <FloppyDiskIcon size={16} aria-hidden="true" />
              {saveButtonLabel ?? t("save")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Where a finding points, in the words the form itself uses. Values are
// message keys under tailor.resumeForm.location.fields.
const FIELD_NAMES = {
  name: "name",
  email: "email",
  phone: "phone",
  location: "location",
  summary: "summary",
  startDate: "startDate",
  endDate: "endDate",
  description: "description",
  url: "url",
};

function findingLocation(path, t) {
  const [section, second, third, , field] = path.split(".");
  const fieldName = (key) =>
    FIELD_NAMES[key] ? t(`location.fields.${FIELD_NAMES[key]}`) : key;
  if (section === "basics") {
    return second === "profiles"
      ? t("location.profileUrl", { index: Number(third) + 1 })
      : t("location.personal", { field: fieldName(second) });
  }
  if (section === "work" || section === "education") {
    if (second === undefined) return section === "work" ? t("sections.work") : t("sections.education");
    const label = FIELD_NAMES[third] ? fieldName(third) : (field ?? third);
    return section === "work"
      ? t("location.position", { index: Number(second) + 1, field: label })
      : t("location.education", { index: Number(second) + 1, field: label });
  }
  return t("sections.skills");
}

// The same rules as the ATS score, run on every keystroke. Ported from Reactive
// Resume's live ATS lint. Collapsed by default so it informs without taking
// over the editor.
function CvChecks({ report, onSelect, t }) {
  const counts = Object.fromEntries(
    SEVERITY_ORDER.map((severity) => [severity, report.findings.filter((f) => f.severity === severity).length]),
  );
  const percent = Math.round((report.passedChecks / report.totalChecks) * 100);

  return (
    <details className="dashboard-card group rounded-lg">
      <summary className="dashboard-card-pad flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-base font-semibold">
          <ListChecksIcon size={18} aria-hidden="true" />
          {t("checks.title")}
        </span>
        <span className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="tabular-nums">
            {t("checks.passed", { passed: report.passedChecks, total: report.totalChecks })}
          </span>
          <CaretDownIcon size={14} className="transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <div className="dashboard-card-pad space-y-3 border-t border-border/60">
        <div className="space-y-3 rounded-md border border-border bg-card p-3">
          <p className="text-xs leading-normal text-muted-foreground">
            {t("checks.intro")}
          </p>
          <div className="space-y-2">
            <p className="text-sm leading-none font-medium">
              {t("checks.checksPassed", { passed: report.passedChecks, total: report.totalChecks })}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]">
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          {report.findings.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {SEVERITY_ORDER.filter((severity) => counts[severity] > 0).map((severity) => (
                <SeverityCount key={severity} severity={severity} count={counts[severity]} />
              ))}
            </div>
          )}
        </div>
        {report.findings.length === 0 ? (
          <div className="flex items-center gap-3 rounded-md border border-dashed border-border p-3">
            <CheckCircleIcon className="size-5 shrink-0 text-[var(--landing-success)]" />
            <p className="text-sm leading-normal text-muted-foreground">{t("checks.allPassed")}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {report.findings.map((finding) => (
              <FindingRow
                key={`${finding.code}-${finding.path}`}
                finding={finding}
                location={findingLocation(finding.path, t)}
                onJump={() => onSelect(finding.path)}
              />
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}

// An empty section should carry the action, not describe the absence.
function SectionEmptyState({ children, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <p className="text-sm text-muted-foreground">{children}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-md border-border"
        onClick={onAction}
      >
        <PlusIcon size={14} />
        {actionLabel}
      </Button>
    </div>
  );
}

function SkillsList({ control, register, nestIndex, t }) {

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `skills.${nestIndex}.skills`,
  });

  return (
    <div className="space-y-2">
      <Label>{t("sections.skills")}</Label>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, k) => (
          <div key={field.id} className="flex items-center gap-1">
            <Input
              className="h-control-sm w-36"
              {...register(`skills.${nestIndex}.skills.${k}`)}
            />
            <ItemReorderControls
              index={k}
              totalCount={fields.length}
              onMoveUp={() => move(k, k - 1)}
              onMoveDown={() => move(k, k + 1)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-destructive"
              onClick={() => remove(k)}
            >
              <XIcon size={12} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="xs"
        className="rounded-full"
        onClick={() => append("")}
      >
        <PlusIcon size={12} />
        {t("addSkill")}
      </Button>
    </div>
  );
}
