"use client";

import { motion } from "motion/react";
import {
  BriefcaseIcon,
  MapPinIcon,
  BuildingsIcon,
  CurrencyDollarIcon,
  ListChecksIcon,
  ClipboardTextIcon,
  GraduationCapIcon,
} from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JobRequirementsCard({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl border-0 shadow-lg">
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="text-xl">{data.title || "Job Listing"}</CardTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {data.company && (
                <span className="flex items-center gap-1">
                  <BuildingsIcon size={14} />
                  {data.company}
                </span>
              )}
              {data.location && (
                <span className="flex items-center gap-1">
                  <MapPinIcon size={14} />
                  {data.location}
                </span>
              )}
              {data.type && (
                <span className="flex items-center gap-1">
                  <BriefcaseIcon size={14} />
                  {data.type}
                </span>
              )}
              {data.salary && (
                <span className="flex items-center gap-1">
                  <CurrencyDollarIcon size={14} />
                  {data.salary}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.requirements.length > 0 && (
            <Section
              icon={<ListChecksIcon size={16} />}
              title="Requirements"
              items={data.requirements}
            />
          )}
          {data.responsibilities.length > 0 && (
            <Section
              icon={<ClipboardTextIcon size={16} />}
              title="Responsibilities"
              items={data.responsibilities}
            />
          )}
          {data.qualifications.length > 0 && (
            <Section
              icon={<GraduationCapIcon size={16} />}
              title="Qualifications"
              items={data.qualifications}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Section({ icon, title, items }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        {icon}
        {title}
      </h3>
      <ul className="space-y-1 pl-6 text-sm text-gray-700 list-disc">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
