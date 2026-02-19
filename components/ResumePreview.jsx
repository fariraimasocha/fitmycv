import { Card, CardContent } from "@/components/ui/card";

// ── Helper: split description into bullet items ──────────

function BulletList({ description }) {
  if (!description) return null;
  const items = description.split("\n").filter((l) => l.trim());
  if (items.length === 0) return null;
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {items.map((item, i) => (
        <li key={i}>{item.trim()}</li>
      ))}
    </ul>
  );
}

// ── Classic — Harvard Resume ────────────────────────────

function ClassicSectionHeading({ children }) {
  return (
    <h2 className="mb-2 border-b border-black pb-1 text-xs font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  );
}

function ClassicPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);

  return (
    <div className="space-y-5 font-serif text-black">
      {/* Header: centered, uppercase name */}
      <div className="text-center">
        {basics.name && <h1 className="text-xl font-bold uppercase">{basics.name}</h1>}
        {contactParts.length > 0 && <p className="mt-1 text-xs">{contactParts.join("  |  ")}</p>}
        {basics.profiles?.length > 0 && (
          <p className="mt-0.5 text-xs">
            {basics.profiles.filter((p) => p.network || p.url).map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network)).join("  |  ")}
          </p>
        )}
      </div>

      {basics.summary && (
        <div>
          <ClassicSectionHeading>Summary</ClassicSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <ClassicSectionHeading>Experience</ClassicSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  {job.position && <p className="text-xs font-bold">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs">
                      {job.startDate}{job.startDate && job.endDate ? " - " : ""}{job.endDate}
                    </p>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  {job.company && <p className="text-xs italic">{job.company}</p>}
                  {job.location && <p className="shrink-0 text-xs italic">{job.location}</p>}
                </div>
                <div className="text-xs leading-relaxed">
                  <BulletList description={job.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <ClassicSectionHeading>Education</ClassicSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs">
                      {edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}
                    </p>
                  )}
                </div>
                {edu.institution && <p className="text-xs italic">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <ClassicSectionHeading>Skills</ClassicSectionHeading>
          <div className="space-y-1">
            {skills.map((group, i) => (
              <div key={i} className="text-xs">
                {group.category && <span className="font-bold">{group.category}: </span>}
                <span>{(group.skills || []).join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modern — Jake's Resume (Overleaf) ───────────────────

function ModernSectionHeading({ children }) {
  return (
    <div className="mb-2">
      <h2 className="text-sm font-bold uppercase text-black">{children}</h2>
      <div className="mt-0.5 h-px w-full bg-black" />
    </div>
  );
}

function ModernPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);

  return (
    <div className="space-y-3 text-black">
      {/* Header: centered, large name */}
      <div className="text-center">
        {basics.name && <h1 className="text-2xl font-bold">{basics.name}</h1>}
        {contactParts.length > 0 && <p className="mt-1 text-xs">{contactParts.join("  |  ")}</p>}
        {basics.profiles?.length > 0 && (
          <p className="mt-0.5 text-xs">
            {basics.profiles.filter((p) => p.network || p.url).map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network)).join("  |  ")}
          </p>
        )}
      </div>

      {basics.summary && (
        <div>
          <ModernSectionHeading>Summary</ModernSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <ModernSectionHeading>Experience</ModernSectionHeading>
          <div className="space-y-2">
            {work.map((job, i) => (
              <div key={i}>
                {/* Company-first (Jake's signature) */}
                <div className="flex items-start justify-between">
                  {job.company && <p className="text-xs font-bold">{job.company}</p>}
                  {job.location && <p className="shrink-0 text-xs italic">{job.location}</p>}
                </div>
                <div className="flex items-start justify-between">
                  {job.position && <p className="text-xs italic">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs">
                      {job.startDate}{job.startDate && job.endDate ? " - " : ""}{job.endDate}
                    </p>
                  )}
                </div>
                <div className="text-xs leading-snug">
                  <BulletList description={job.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <ModernSectionHeading>Education</ModernSectionHeading>
          <div className="space-y-1">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  {edu.institution && <p className="text-xs font-bold">{edu.institution}</p>}
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs">
                      {edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}
                    </p>
                  )}
                </div>
                <p className="text-xs italic">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <ModernSectionHeading>Technical Skills</ModernSectionHeading>
          <div className="space-y-0.5">
            {skills.map((group, i) => (
              <div key={i} className="text-xs">
                {group.category && <span className="font-bold">{group.category}: </span>}
                <span>{(group.skills || []).join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Clean — FlowCV / Resume.io Modern ───────────────────

function CleanSectionHeading({ children }) {
  return (
    <h2 className="mb-1.5 mt-4 text-xs font-bold uppercase tracking-wide text-[#333]">
      {children}
    </h2>
  );
}

function CleanPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);

  return (
    <div className="space-y-4 text-black">
      {/* Header: left-aligned, gray accents */}
      <div className="border-b-2 border-[#999] pb-3">
        {basics.name && <h1 className="text-xl font-bold">{basics.name}</h1>}
        {basics.label && <p className="mt-0.5 text-sm text-[#444]">{basics.label}</p>}
        {contactParts.length > 0 && <p className="mt-1 text-xs text-[#555]">{contactParts.join("  |  ")}</p>}
        {basics.profiles?.length > 0 && (
          <p className="mt-0.5 text-xs text-[#555]">
            {basics.profiles.filter((p) => p.network || p.url).map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network)).join("  |  ")}
          </p>
        )}
      </div>

      {basics.summary && (
        <div>
          <CleanSectionHeading>Summary</CleanSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <CleanSectionHeading>Experience</CleanSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  {job.position && <p className="text-xs font-bold">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs font-bold text-[#555]">
                      {job.startDate}{job.startDate && job.endDate ? " - " : ""}{job.endDate}
                    </p>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  {job.company && <p className="text-xs text-[#555]">{job.company}</p>}
                  {job.location && <p className="shrink-0 text-xs text-[#555]">{job.location}</p>}
                </div>
                <div className="text-xs leading-relaxed">
                  <BulletList description={job.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <CleanSectionHeading>Education</CleanSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs font-bold text-[#555]">
                      {edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}
                    </p>
                  )}
                </div>
                {edu.institution && <p className="text-xs text-[#555]">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <CleanSectionHeading>Skills</CleanSectionHeading>
          <div className="space-y-1.5">
            {skills.map((group, i) => (
              <div key={i} className="text-xs">
                {group.category && <span className="font-bold">{group.category}: </span>}
                <span>{(group.skills || []).join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Minimal — Zero decoration, max whitespace ───────────

function MinimalPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);

  return (
    <div className="space-y-8 text-black leading-loose">
      {/* Header: left-aligned, no decorations */}
      <div>
        {basics.name && <h1 className="text-xl font-bold">{basics.name}</h1>}
        {contactParts.length > 0 && <p className="mt-1 text-xs">{contactParts.join("  |  ")}</p>}
        {basics.profiles?.length > 0 && (
          <p className="mt-0.5 text-[9px]">
            {basics.profiles.filter((p) => p.network || p.url).map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network)).join("  |  ")}
          </p>
        )}
      </div>

      {basics.summary && (
        <div>
          <h2 className="mb-2 text-xs font-normal text-black">Summary</h2>
          <p className="text-xs leading-loose whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-normal text-black">Experience</h2>
          <div className="space-y-4">
            {work.map((job, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  {job.position && <p className="text-xs font-bold">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs text-gray-500">
                      {job.startDate}{job.startDate && job.endDate ? " - " : ""}{job.endDate}
                    </p>
                  )}
                </div>
                {job.company && <p className="text-xs">{job.company}</p>}
                {job.description && (
                  <p className="mt-1 text-xs leading-loose whitespace-pre-line">{job.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-normal text-black">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs text-gray-500">
                      {edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}
                    </p>
                  )}
                </div>
                {edu.institution && <p className="text-xs">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-normal text-black">Skills</h2>
          <div className="space-y-1">
            {skills.map((group, i) => (
              <p key={i} className="text-xs">
                {group.category ? `${group.category}: ` : ""}{(group.skills || []).join(", ")}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Creative — Blue accent bar + colored headings ────────

function CreativeSectionHeading({ children }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="w-1 self-stretch bg-blue-800 rounded-full" />
      <h2 className="text-xs font-bold uppercase tracking-wide text-blue-800">
        {children}
      </h2>
    </div>
  );
}

function CreativePreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);

  return (
    <div className="space-y-4 text-gray-800">
      {/* Header: blue bar with white text */}
      <div className="-mx-8 -mt-8 bg-blue-800 px-8 py-4">
        {basics.name && <h1 className="text-lg font-bold text-white">{basics.name}</h1>}
      </div>

      {contactParts.length > 0 && <p className="text-[9px] text-black">{contactParts.join("  |  ")}</p>}
      {basics.profiles?.length > 0 && (
        <p className="text-[9px] text-gray-500">
          {basics.profiles.filter((p) => p.network || p.url).map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network)).join("  |  ")}
        </p>
      )}

      {basics.summary && (
        <div>
          <CreativeSectionHeading>Summary</CreativeSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <CreativeSectionHeading>Experience</CreativeSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  {job.position && <p className="text-xs font-bold text-black">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs text-gray-500">
                      {job.startDate}{job.startDate && job.endDate ? " - " : ""}{job.endDate}
                    </p>
                  )}
                </div>
                {job.company && <p className="text-xs text-gray-500">{job.company}</p>}
                <BulletList description={job.description} />
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <CreativeSectionHeading>Skills</CreativeSectionHeading>
          <div className="space-y-1">
            {skills.map((group, i) => (
              <div key={i} className="text-xs">
                {group.category && <span className="font-bold">{group.category}: </span>}
                <span>{(group.skills || []).join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <CreativeSectionHeading>Education</CreativeSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs text-gray-500">
                      {edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}
                    </p>
                  )}
                </div>
                {edu.institution && <p className="text-xs text-gray-500">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Technical — Monospace, terminal aesthetic ─────────────

function DashList({ description }) {
  if (!description) return null;
  const items = description.split("\n").filter((l) => l.trim());
  if (items.length === 0) return null;
  return (
    <div className="mt-1 space-y-0.5 pl-2">
      {items.map((item, i) => (
        <p key={i} className="text-[9px]">- {item.trim()}</p>
      ))}
    </div>
  );
}

function TechnicalPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);
  const commentLine = "# " + "\u2500".repeat(36);

  return (
    <div className="space-y-3 font-mono text-black text-[9px]">
      {/* Header: terminal comment decorators */}
      <div>
        <p className="text-gray-500">{commentLine}</p>
        {basics.name && <h1 className="text-sm font-bold uppercase">{basics.name}</h1>}
        {contactParts.length > 0 && <p>{contactParts.join(" | ")}</p>}
        {basics.profiles?.length > 0 && (
          <p>
            {basics.profiles.filter((p) => p.network || p.url).map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network)).join(" | ")}
          </p>
        )}
        <p className="text-gray-500">{commentLine}</p>
      </div>

      {/* Skills FIRST */}
      {skills?.length > 0 && (
        <div>
          <h2 className="mb-1 text-[10px] font-bold uppercase border-b border-black pb-0.5">Skills</h2>
          <div className="space-y-1">
            {skills.map((group, i) => (
              <div key={i}>
                {group.category && <p className="font-bold">[{group.category}]</p>}
                {(group.skills || []).map((skill, j) => (
                  <p key={j} className="pl-2">- {skill}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {basics.summary && (
        <div>
          <h2 className="mb-1 text-[10px] font-bold uppercase border-b border-black pb-0.5">Summary</h2>
          <p className="whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <h2 className="mb-1 text-[10px] font-bold uppercase border-b border-black pb-0.5">Experience</h2>
          <div className="space-y-2">
            {work.map((job, i) => (
              <div key={i}>
                <p>
                  <span className="font-bold">{job.company}</span>
                  {job.position && ` | ${job.position}`}
                  {(job.startDate || job.endDate) && ` | ${[job.startDate, job.endDate].filter(Boolean).join("-")}`}
                </p>
                {job.location && <p className="text-gray-500">// {job.location}</p>}
                <DashList description={job.description} />
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <h2 className="mb-1 text-[10px] font-bold uppercase border-b border-black pb-0.5">Education</h2>
          <div className="space-y-1">
            {education.map((edu, i) => (
              <p key={i}>
                <span className="font-bold">{edu.institution}</span>
                {(edu.degree || edu.fieldOfStudy) && ` | ${[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}`}
                {(edu.startDate || edu.endDate) && ` | ${[edu.startDate, edu.endDate].filter(Boolean).join("-")}`}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────

const PREVIEWS = {
  classic: ClassicPreview,
  modern: ModernPreview,
  clean: CleanPreview,
  minimal: MinimalPreview,
  creative: CreativePreview,
  technical: TechnicalPreview,
};

const PADDING = {
  modern: "p-4",
  minimal: "p-10",
  creative: "p-8",
  technical: "p-4",
};

export default function ResumePreview({ data, template = "classic" }) {
  const { basics, work, education, skills } = data;
  const Preview = PREVIEWS[template] || ClassicPreview;
  const padding = PADDING[template] || "p-8";

  return (
    <Card className="rounded-2xl border shadow-lg">
      <CardContent className={`${padding} ${template === "creative" ? "overflow-hidden" : ""}`}>
        <Preview basics={basics} work={work} education={education} skills={skills} />
      </CardContent>
    </Card>
  );
}
