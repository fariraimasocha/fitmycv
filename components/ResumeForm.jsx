"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  FloppyDiskIcon,
  SpinnerGapIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ItemReorderControls from "@/components/ItemReorderControls";

const resumeSchema = z.object({
  basics: z.object({
    name: z.string().min(1, "Name is required"),
    label: z.string().optional().default(""),
    email: z.string().email("Invalid email").or(z.literal("")),
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
  saveButtonLabel = "Save Resume",
  onSaved,
}) {
  const queryClient = useQueryClient();

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
    formState: { errors },
  } = form;

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
        throw new Error(err.error || "Failed to save");
      }

      return res.json();
    },
    onSuccess: (_result, data) => {
      toast.success("Resume saved!");
      queryClient.invalidateQueries({ queryKey });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" {...register("basics.name")} />
              {errors.basics?.name && (
                <p className="text-destructive text-sm">
                  {errors.basics.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Job Title / Headline</Label>
              <Input id="label" {...register("basics.label")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("basics.email")} />
              {errors.basics?.email && (
                <p className="text-destructive text-sm">
                  {errors.basics.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("basics.phone")} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("basics.location")} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
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
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>Online Profiles</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => appendProfile({ network: "", url: "" })}
            >
              <PlusIcon size={14} />
              Add Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {profilesFieldsList.length === 0 && (
              <p className="text-sm text-gray-500">No profiles added yet.</p>
            )}
            {profilesFieldsList.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Network</Label>
                  <Input
                    placeholder="LinkedIn, GitHub..."
                    {...register(`basics.profiles.${index}.network`)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL</Label>
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
                    className="text-destructive"
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
      >
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>Work Experience</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
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
              Add Position
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {workFieldsList.length === 0 && (
              <p className="text-sm text-gray-500">
                No work experience added yet.
              </p>
            )}
            {workFieldsList.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-xl bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Position {index + 1}
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
                      className="text-destructive"
                      onClick={() => removeWork(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input {...register(`work.${index}.company`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input {...register(`work.${index}.position`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input {...register(`work.${index}.location`)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        placeholder="YYYY-MM"
                        {...register(`work.${index}.startDate`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        placeholder="YYYY-MM or Present"
                        {...register(`work.${index}.endDate`)}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Description / Achievements</Label>
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
      >
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>Education</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
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
              Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {educationFieldsList.length === 0 && (
              <p className="text-sm text-gray-500">No education added yet.</p>
            )}
            {educationFieldsList.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-xl bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Education {index + 1}
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
                      className="text-destructive"
                      onClick={() => removeEducation(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input {...register(`education.${index}.institution`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      placeholder="B.Sc., M.A., Ph.D..."
                      {...register(`education.${index}.degree`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input {...register(`education.${index}.fieldOfStudy`)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        placeholder="YYYY-MM"
                        {...register(`education.${index}.startDate`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        placeholder="YYYY-MM"
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
      >
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>Skills</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => appendSkill({ category: "", skills: [] })}
            >
              <PlusIcon size={14} />
              Add Category
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillsFieldsList.length === 0 && (
              <p className="text-sm text-gray-500">No skills added yet.</p>
            )}
            {skillsFieldsList.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-xl bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Category {index + 1}
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
                      className="text-destructive"
                      onClick={() => removeSkill(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      placeholder="e.g. Programming Languages"
                      {...register(`skills.${index}.category`)}
                    />
                  </div>
                  <SkillsList
                    control={control}
                    register={register}
                    nestIndex={index}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            size="lg"
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            {saveMutation.isPending ? (
              <>
                <SpinnerGapIcon size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FloppyDiskIcon size={16} />
                {saveButtonLabel}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </form>
  );
}

function SkillsList({ control, register, nestIndex }) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `skills.${nestIndex}.skills`,
  });

  return (
    <div className="space-y-2">
      <Label>Skills</Label>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, k) => (
          <div key={field.id} className="flex items-center gap-1">
            <Input
              className="h-8 w-36"
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
        Add Skill
      </Button>
    </div>
  );
}
