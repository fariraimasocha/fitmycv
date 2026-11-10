"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  PlusIcon,
  TrashIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
  XIcon,
  ListChecksIcon,
  CaretRightIcon,
  CheckIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  // Optional sonner action on the "saved" toast, the obvious next step.
  savedAction,
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
  const reduceMotion = useReducedMotion();

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
    getValues,
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

  // Accordion state. A fresh upload opens every section so the whole parse
  // can be checked; a saved CV opens the two sections people edit most.
  const [openSections, setOpenSections] = useState(() =>
    isDraft
      ? { personal: true, profiles: true, work: true, education: true, skills: true }
      : { personal: true, profiles: false, work: true, education: false, skills: false },
  );
  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const openSection = (id) =>
    setOpenSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }));

  // Field paths ("work.2.startDate") get focus; section paths ("skills") scroll.
  // The section opens first, since a hidden field cannot take focus.
  const goToFinding = (path) => {
    openSection(sectionOfPath(path));
    requestAnimationFrame(() => {
      if (path.includes(".")) {
        setFocus(path);
      } else {
        document.getElementById(`cv-section-${path}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const addProfile = () => {
    openSection("profiles");
    appendProfile({ network: "", url: "" });
  };
  const addWork = () => {
    openSection("work");
    appendWork({ company: "", position: "", location: "", startDate: "", endDate: "", description: "" });
  };
  const addEducation = () => {
    openSection("education");
    appendEducation({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" });
  };
  const addSkillGroup = () => {
    openSection("skills");
    appendSkill({ category: "", skills: [] });
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
    insert: insertSkill,
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
      toast.success(t("saved"), savedAction ? { action: savedAction } : undefined);
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

  const work = values?.work ?? [];
  const education = values?.education ?? [];
  const skills = values?.skills ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {showChecks && <CvChecks report={report} onSelect={goToFinding} t={t} />}

      {/* One panel, one row per section, hairlines between. Bodies stay
          mounted when closed so every field keeps its registered value. */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="dashboard-card divide-y divide-[var(--landing-line)] rounded-lg"
      >
        <FormSection
          id="personal"
          title={t("sections.personal")}
          open={openSections.personal}
          onToggle={() => toggleSection("personal")}
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Field label={t("fields.fullNameRequired")} htmlFor="name">
              <Input id="name" {...register("basics.name")} />
              {errors.basics?.name && (
                <p className="text-sm text-destructive">
                  {t(`errors.${errors.basics.name.message}`)}
                </p>
              )}
            </Field>
            <Field label={t("fields.headline")} htmlFor="label">
              <Input id="label" {...register("basics.label")} />
            </Field>
            <Field label={t("fields.email")} htmlFor="email">
              <Input id="email" type="email" {...register("basics.email")} />
              {errors.basics?.email && (
                <p className="text-sm text-destructive">
                  {t(`errors.${errors.basics.email.message}`)}
                </p>
              )}
            </Field>
            <Field label={t("fields.phone")} htmlFor="phone">
              <Input id="phone" {...register("basics.phone")} />
            </Field>
            <Field label={t("fields.location")} htmlFor="location" className="sm:col-span-2">
              <Input id="location" {...register("basics.location")} />
            </Field>
            <Field label={t("fields.summary")} htmlFor="summary" className="sm:col-span-2">
              <Textarea id="summary" rows={4} {...register("basics.summary")} />
            </Field>
          </div>
        </FormSection>

        <FormSection
          id="profiles"
          title={t("sections.profiles")}
          count={profilesFieldsList.length}
          open={openSections.profiles}
          onToggle={() => toggleSection("profiles")}
          action={<AddIconButton label={t("addProfile")} onClick={addProfile} />}
        >
          {profilesFieldsList.length === 0 ? (
            <SectionEmptyState actionLabel={t("addProfile")} onAction={addProfile}>
              {t("empty.profiles")}
            </SectionEmptyState>
          ) : (
            <div className="divide-y divide-[var(--landing-line)]">
              {profilesFieldsList.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-end"
                >
                  <Field label={t("fields.network")} className="flex-1">
                    <Input
                      placeholder={t("placeholders.network")}
                      {...register(`basics.profiles.${index}.network`)}
                    />
                  </Field>
                  <Field label={t("fields.url")} className="flex-1">
                    <Input
                      placeholder="https://..."
                      {...register(`basics.profiles.${index}.url`)}
                    />
                  </Field>
                  <ItemActions
                    index={index}
                    total={profilesFieldsList.length}
                    onMove={moveProfile}
                    removeLabel={t("removeProfile", { index: index + 1 })}
                    onRemove={() => removeProfile(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection
          id="work"
          title={t("sections.work")}
          count={workFieldsList.length}
          open={openSections.work}
          onToggle={() => toggleSection("work")}
          action={<AddIconButton label={t("addPosition")} onClick={addWork} />}
        >
          {workFieldsList.length === 0 ? (
            <SectionEmptyState actionLabel={t("addPosition")} onAction={addWork}>
              {t("empty.work")}
            </SectionEmptyState>
          ) : (
            <div className="divide-y divide-[var(--landing-line)]">
              {workFieldsList.map((field, index) => (
                <div key={field.id} className="space-y-4 py-5 first:pt-0 last:pb-0">
                  <ItemHeader
                    title={
                      [work[index]?.company, work[index]?.position].filter(Boolean).join(", ") ||
                      t("positionN", { index: index + 1 })
                    }
                  >
                    <ItemActions
                      index={index}
                      total={workFieldsList.length}
                      onMove={moveWork}
                      removeLabel={t("removePosition", { index: index + 1 })}
                      onRemove={() => removeWork(index)}
                    />
                  </ItemHeader>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label={t("fields.company")}>
                      <Input {...register(`work.${index}.company`)} />
                    </Field>
                    <Field label={t("fields.position")}>
                      <Input {...register(`work.${index}.position`)} />
                    </Field>
                    <Field label={t("fields.location")}>
                      <Input {...register(`work.${index}.location`)} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t("fields.startDate")}>
                        <Input
                          placeholder={t("placeholders.yearMonth")}
                          {...register(`work.${index}.startDate`)}
                        />
                      </Field>
                      <Field label={t("fields.endDate")}>
                        <Input
                          placeholder={t("placeholders.endDate")}
                          {...register(`work.${index}.endDate`)}
                        />
                      </Field>
                    </div>
                    <Field label={t("fields.description")} className="sm:col-span-2">
                      <Textarea rows={3} {...register(`work.${index}.description`)} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection
          id="education"
          title={t("sections.education")}
          count={educationFieldsList.length}
          open={openSections.education}
          onToggle={() => toggleSection("education")}
          action={<AddIconButton label={t("addEducation")} onClick={addEducation} />}
        >
          {educationFieldsList.length === 0 ? (
            <SectionEmptyState actionLabel={t("addEducation")} onAction={addEducation}>
              {t("empty.education")}
            </SectionEmptyState>
          ) : (
            <div className="divide-y divide-[var(--landing-line)]">
              {educationFieldsList.map((field, index) => (
                <div key={field.id} className="space-y-4 py-5 first:pt-0 last:pb-0">
                  <ItemHeader
                    title={education[index]?.institution || t("educationN", { index: index + 1 })}
                  >
                    <ItemActions
                      index={index}
                      total={educationFieldsList.length}
                      onMove={moveEducation}
                      removeLabel={t("removeEducation", { index: index + 1 })}
                      onRemove={() => removeEducation(index)}
                    />
                  </ItemHeader>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label={t("fields.institution")}>
                      <Input {...register(`education.${index}.institution`)} />
                    </Field>
                    <Field label={t("fields.degree")}>
                      <Input
                        placeholder={t("placeholders.degree")}
                        {...register(`education.${index}.degree`)}
                      />
                    </Field>
                    <Field label={t("fields.fieldOfStudy")}>
                      <Input {...register(`education.${index}.fieldOfStudy`)} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t("fields.startDate")}>
                        <Input
                          placeholder={t("placeholders.yearMonth")}
                          {...register(`education.${index}.startDate`)}
                        />
                      </Field>
                      <Field label={t("fields.endDate")}>
                        <Input
                          placeholder={t("placeholders.yearMonth")}
                          {...register(`education.${index}.endDate`)}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection
          id="skills"
          title={t("sections.skills")}
          count={skillsFieldsList.length}
          open={openSections.skills}
          onToggle={() => toggleSection("skills")}
          action={<AddIconButton label={t("addCategory")} onClick={addSkillGroup} />}
        >
          {skillsFieldsList.length === 0 ? (
            <SectionEmptyState actionLabel={t("addCategory")} onAction={addSkillGroup}>
              {t("empty.skills")}
            </SectionEmptyState>
          ) : (
            <div className="divide-y divide-[var(--landing-line)]">
              {skillsFieldsList.map((field, index) => (
                <div key={field.id} className="space-y-4 py-5 first:pt-0 last:pb-0">
                  <ItemHeader title={skills[index]?.category || t("categoryN", { index: index + 1 })}>
                    <ItemActions
                      index={index}
                      total={skillsFieldsList.length}
                      onMove={moveSkill}
                      removeLabel={t("removeCategory")}
                      onRemove={() =>
                        removeWithUndo({
                          value: getValues(`skills.${index}`),
                          remove: () => removeSkill(index),
                          restore: (value) => insertSkill(index, value),
                          message: t("categoryRemoved"),
                          undo: t("undo"),
                        })
                      }
                    />
                  </ItemHeader>
                  <Field label={t("fields.categoryName")}>
                    <Input
                      placeholder={t("placeholders.category")}
                      {...register(`skills.${index}.category`)}
                    />
                  </Field>
                  <SkillsList
                    control={control}
                    register={register}
                    getValues={getValues}
                    nestIndex={index}
                    t={t}
                  />
                </div>
              ))}
            </div>
          )}
        </FormSection>
      </motion.div>

      {/* Quiet save bar: hairline, no shadow. Status left, one button right. */}
      <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)]/95 px-4 py-2 backdrop-blur-md sm:bottom-4">
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
            <>
              <CheckIcon size={14} aria-hidden="true" />
              {t("status.allSaved")}
            </>
          )}
        </p>
        <button
          type="submit"
          disabled={saveMutation.isPending}
          aria-busy={saveMutation.isPending}
          className="dashboard-primary-btn dashboard-primary-btn-sm"
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
        </button>
      </div>
    </form>
  );
}

// Which accordion section a finding path lives in.
function sectionOfPath(path) {
  const [section, second] = path.split(".");
  if (section === "basics") return second === "profiles" ? "profiles" : "personal";
  return section;
}

// Teal's accordion row: chevron, label, count, trailing action icons.
function FormSection({ id, title, count, open, onToggle, action, children }) {
  const bodyId = `cv-body-${id}`;
  return (
    <section id={`cv-section-${id}`} className="scroll-mt-20">
      <div className="flex items-center gap-1 pe-2 sm:pe-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-lg ps-4 text-start transition-colors hover:text-[var(--landing-ink)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--landing-ink)] sm:ps-6"
        >
          <CaretRightIcon
            size={16}
            weight="bold"
            className={cn(
              "shrink-0 text-muted-foreground transition-transform rtl:-scale-x-100",
              open && "rotate-90",
            )}
            aria-hidden="true"
          />
          <span className="truncate font-outfit text-base font-medium text-foreground">
            {title}
          </span>
          {count > 0 && (
            <span className="rounded-full bg-[var(--landing-paper-soft)] px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </button>
        {action}
      </div>
      <div id={bodyId} hidden={!open} className="px-4 pb-6 sm:px-6">
        {children}
      </div>
    </section>
  );
}

function AddIconButton({ label, onClick }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="shrink-0 text-muted-foreground hover:text-foreground"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <PlusIcon size={16} aria-hidden="true" />
    </Button>
  );
}

function Field({ label, htmlFor, className, children }) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ItemHeader({ title, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="min-w-0 truncate text-sm font-semibold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function ItemActions({ index, total, onMove, removeLabel, onRemove }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <ItemReorderControls
        index={index}
        totalCount={total}
        onMoveUp={() => onMove(index, index - 1)}
        onMoveDown={() => onMove(index, index + 1)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label={removeLabel}
        title={removeLabel}
        onClick={onRemove}
      >
        <TrashIcon size={16} aria-hidden="true" />
      </Button>
    </div>
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
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-lg px-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--landing-ink)] sm:px-6 [&::-webkit-details-marker]:hidden">
        <CaretRightIcon
          size={16}
          weight="bold"
          className="shrink-0 text-muted-foreground transition-transform group-open:rotate-90 rtl:-scale-x-100"
          aria-hidden="true"
        />
        <span className="flex min-w-0 flex-1 items-center gap-2 font-outfit text-base font-medium text-foreground">
          <ListChecksIcon size={18} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{t("checks.title")}</span>
        </span>
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {t("checks.passed", { passed: report.passedChecks, total: report.totalChecks })}
        </span>
      </summary>
      <div className="space-y-3 border-t border-[var(--landing-line)] px-4 py-4 sm:px-6">
        <div className="space-y-3">
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
          <div className="flex items-center gap-3 rounded-md bg-[var(--landing-success-soft)] p-3">
            <CheckCircleIcon weight="fill" aria-hidden="true" className="size-5 shrink-0 text-[var(--landing-success)]" />
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
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">{children}</p>
      <button
        type="button"
        className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
        onClick={onAction}
      >
        <PlusIcon size={16} aria-hidden="true" />
        {actionLabel}
      </button>
    </div>
  );
}

// Remove now, offer it back. The remove buttons are small and sit side by
// side, and a run of fast clicks used to take more than intended.
function removeWithUndo({ value, remove, restore, message, undo }) {
  remove();
  toast(message, { action: { label: undo, onClick: () => restore(value) } });
}

function SkillsList({ control, register, getValues, nestIndex, t }) {
  const { fields, append, insert, remove, move } = useFieldArray({
    control,
    name: `skills.${nestIndex}.skills`,
  });

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{t("sections.skills")}</Label>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, k) => (
          <div key={field.id} className="flex items-center gap-0.5">
            <Input
              aria-label={t("sections.skills")}
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
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label={t("removeSkill")}
              onClick={() =>
                removeWithUndo({
                  value: getValues(`skills.${nestIndex}.skills.${k}`),
                  remove: () => remove(k),
                  restore: (value) => insert(k, value),
                  message: t("skillRemoved"),
                  undo: t("undo"),
                })
              }
            >
              <XIcon size={12} aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="dashboard-secondary-btn dashboard-secondary-btn-sm"
        onClick={() => append("")}
      >
        <PlusIcon size={16} aria-hidden="true" />
        {t("addSkill")}
      </button>
    </div>
  );
}
