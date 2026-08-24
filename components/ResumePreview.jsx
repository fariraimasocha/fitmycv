import { Card, CardContent } from "@/components/ui/card";
import {
  EnvelopeSimpleIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeSimpleIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";

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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
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
              <div key={i} className="break-inside-avoid">
                <p>
                  <span className="font-bold">{job.company}</span>
                  {job.position && ` | ${job.position}`}
                  {(job.startDate || job.endDate) && ` | ${[job.startDate, job.endDate].filter(Boolean).join("-")}`}
                </p>
                {job.location && <p className="text-gray-500">{"// "}{job.location}</p>}
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

// ── Shared: contact row with icons ──────────────────────

function ContactWithIcons({ basics, className = "", accentClass = "text-gray-500", center = false }) {
  const items = [];
  if (basics.email) items.push({ Icon: EnvelopeSimpleIcon, text: basics.email });
  if (basics.phone) items.push({ Icon: PhoneIcon, text: basics.phone });
  if (basics.location) items.push({ Icon: MapPinIcon, text: basics.location });
  (basics.profiles || [])
    .filter((p) => p.url || p.network)
    .forEach((p) => {
      const isLinkedIn = (p.network || "").toLowerCase().includes("linkedin");
      items.push({
        Icon: isLinkedIn ? LinkedinLogoIcon : GlobeSimpleIcon,
        text: (p.url || p.network).replace(/^https?:\/\//, ""),
      });
    });

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${center ? "justify-center" : ""} ${className}`}>
      {items.map(({ Icon, text }, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <Icon size={12} className={accentClass} aria-hidden="true" />
          <span className="break-words">{text}</span>
        </span>
      ))}
    </div>
  );
}

// ── Sidebar — Two-column functional (Mariah Blanchard) ───

function SidebarSectionHeading({ children }) {
  return (
    <div className="mb-2">
      <h2 className="text-sm font-bold uppercase tracking-wide text-black">{children}</h2>
      <div className="mt-1 h-px w-8 bg-black" />
    </div>
  );
}

function SidebarPreview({ basics, work, education, skills }) {
  return (
    <div className="text-black">
      {/* Header */}
      <div className="mb-6 border-b-2 border-black pb-3">
        {basics.name && (
          <h1 className="text-3xl font-bold uppercase leading-tight tracking-wide">{basics.name}</h1>
        )}
        {basics.label && (
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-gray-700">{basics.label}</p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Left rail */}
        <div className="w-1/3 space-y-6">
          <div>
            <SidebarSectionHeading>Contact</SidebarSectionHeading>
            <div className="space-y-1 text-xs">
              {basics.phone && <p>{basics.phone}</p>}
              {basics.email && <p className="break-words">{basics.email}</p>}
              {basics.location && <p>{basics.location}</p>}
              {(basics.profiles || [])
                .filter((p) => p.url || p.network)
                .map((p, i) => (
                  <p key={i} className="break-words">{(p.url || p.network).replace(/^https?:\/\//, "")}</p>
                ))}
            </div>
          </div>

          {skills?.length > 0 && (
            <div>
              <SidebarSectionHeading>Skills</SidebarSectionHeading>
              <div className="space-y-1 text-xs">
                {skills.flatMap((g) => g.skills || []).map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main */}
        <div className="flex-1 space-y-5">
          {basics.summary && (
            <div>
              <SidebarSectionHeading>Profile</SidebarSectionHeading>
              <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
            </div>
          )}

          {education?.length > 0 && (
            <div>
              <SidebarSectionHeading>Education</SidebarSectionHeading>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="break-inside-avoid">
                    <p className="text-xs font-bold">{edu.institution}</p>
                    {(edu.degree || edu.fieldOfStudy || edu.startDate || edu.endDate) && (
                      <p className="text-xs text-gray-600">
                        {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                        {(edu.degree || edu.fieldOfStudy) && (edu.startDate || edu.endDate) ? " · " : ""}
                        {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {work?.length > 0 && (
            <div>
              <SidebarSectionHeading>Experience</SidebarSectionHeading>
              <div className="space-y-3">
                {work.map((job, i) => (
                  <div key={i} className="break-inside-avoid">
                    <div className="flex items-start justify-between gap-2">
                      {job.position && <p className="text-xs font-bold">{job.position}</p>}
                      {(job.startDate || job.endDate) && (
                        <p className="shrink-0 text-xs text-gray-600">
                          {[job.startDate, job.endDate].filter(Boolean).join(" - ")}
                        </p>
                      )}
                    </div>
                    {(job.company || job.location) && (
                      <p className="text-xs italic text-gray-600">
                        {[job.company, job.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="text-xs leading-relaxed">
                      <BulletList description={job.description} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Spotlight — Awesome-CV accent (Byungjin Park) ────────

function SpotlightSectionHeading({ children }) {
  const text = String(children);
  return (
    <div className="mb-2 mt-4 flex items-center gap-3">
      <h2 className="text-base font-bold uppercase tracking-wide">
        <span className="text-red-700">{text.slice(0, 3)}</span>
        <span className="text-gray-800">{text.slice(3)}</span>
      </h2>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
}

function SpotlightPreview({ basics, work, education, skills }) {
  const [firstName, ...restName] = (basics.name || "").split(" ");

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="mb-4 text-center">
        {basics.name && (
          <h1 className="text-4xl font-light tracking-wide text-gray-400">
            {firstName} <span className="font-bold text-black">{restName.join(" ")}</span>
          </h1>
        )}
        {basics.label && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-700">{basics.label}</p>
        )}
        <ContactWithIcons basics={basics} center className="mt-2 text-xs text-gray-600" accentClass="text-gray-500" />
      </div>

      {basics.summary && (
        <div>
          <SpotlightSectionHeading>Summary</SpotlightSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <SpotlightSectionHeading>Experience</SpotlightSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-2">
                  {job.company && <p className="text-sm font-bold text-black">{job.company}</p>}
                  {job.location && <p className="shrink-0 text-xs italic text-red-700">{job.location}</p>}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  {job.position && <p className="text-xs uppercase tracking-wide text-gray-700">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs italic text-red-700">{[job.startDate, job.endDate].filter(Boolean).join(" - ")}</p>
                  )}
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
          <SpotlightSectionHeading>Education</SpotlightSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-2">
                  {edu.institution && <p className="text-sm font-bold text-black">{edu.institution}</p>}
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs italic text-red-700">{[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}</p>
                  )}
                </div>
                {(edu.degree || edu.fieldOfStudy) && (
                  <p className="text-xs uppercase tracking-wide text-gray-700">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <SpotlightSectionHeading>Skills</SpotlightSectionHeading>
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

// ── Executive — Navy professional (Daniel Mercer) ───────

function ExecutiveSectionHeading({ children }) {
  return (
    <div className="mb-2 mt-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">{children}</h2>
      <div className="mt-0.5 h-px w-full bg-gray-900/30" />
    </div>
  );
}

function ExecutivePreview({ basics, work, education, skills }) {
  return (
    <div className="text-gray-800">
      <div>
        {basics.name && <h1 className="text-3xl font-bold text-gray-900">{basics.name}</h1>}
        {basics.label && <p className="text-base text-gray-900/80">{basics.label}</p>}
      </div>
      <ContactWithIcons basics={basics} className="mt-1 mb-2 text-xs text-gray-600" accentClass="text-gray-900" />

      {basics.summary && (
        <div>
          <ExecutiveSectionHeading>Summary</ExecutiveSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <ExecutiveSectionHeading>Professional Experience</ExecutiveSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs">
                    {job.position && <span className="font-bold text-black">{job.position}</span>}
                    {job.company && <span className="italic text-gray-700">{job.position ? ", " : ""}{job.company}</span>}
                  </p>
                  <div className="shrink-0 text-right text-xs text-gray-500">
                    {(job.startDate || job.endDate) && <p>{[job.startDate, job.endDate].filter(Boolean).join(" – ")}</p>}
                    {job.location && <p>{job.location}</p>}
                  </div>
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
          <ExecutiveSectionHeading>Education</ExecutiveSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-black">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                  {edu.institution && <p className="text-xs italic text-gray-700">{edu.institution}</p>}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <p className="shrink-0 text-right text-xs text-gray-500">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <ExecutiveSectionHeading>Skills</ExecutiveSectionHeading>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {skills
              .flatMap((g) => (g.category ? [`${g.category}: ${(g.skills || []).join(", ")}`] : g.skills || []))
              .map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-900" />
                  <span>{s}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Compact — Dense one-pager (Olivia Bennett) ──────────

function CompactSectionHeading({ children }) {
  return (
    <h2 className="mb-1 mt-3 border-b border-gray-400 pb-0.5 text-xs font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  );
}

function CompactPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);
  const profileParts = (basics.profiles || [])
    .filter((p) => p.url || p.network)
    .map((p) => (p.url || p.network).replace(/^https?:\/\//, ""));

  return (
    <div className="text-[11px] leading-snug text-black">
      <div className="mb-2 text-center">
        {basics.name && <h1 className="text-xl font-bold uppercase tracking-wide">{basics.name}</h1>}
        {basics.label && <p className="text-xs font-semibold text-gray-700">{basics.label}</p>}
        {(contactParts.length > 0 || profileParts.length > 0) && (
          <p className="mt-0.5 text-[10px] text-gray-600">{[...contactParts, ...profileParts].join("  •  ")}</p>
        )}
      </div>

      {basics.summary && (
        <div>
          <CompactSectionHeading>Summary</CompactSectionHeading>
          <p className="whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <CompactSectionHeading>Professional Experience</CompactSectionHeading>
          <div className="space-y-1.5">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <p>
                    {job.position && <span className="font-bold">{job.position}</span>}
                    {job.company && <span className="italic">{job.position ? ", " : ""}{job.company}</span>}
                  </p>
                  <p className="shrink-0 text-[10px] text-gray-600">
                    {[job.startDate, job.endDate].filter(Boolean).join(" – ")}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>
                {job.description && (
                  <ul className="list-disc pl-4">
                    {job.description.split("\n").filter((l) => l.trim()).map((l, j) => (
                      <li key={j}>{l.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <CompactSectionHeading>Education</CompactSectionHeading>
          <div className="space-y-1">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid flex items-baseline justify-between gap-3">
                <p>
                  <span className="font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</span>
                  {edu.institution && <span className="italic">, {edu.institution}</span>}
                </p>
                <p className="shrink-0 text-[10px] text-gray-600">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <CompactSectionHeading>Skills</CompactSectionHeading>
          <div className="space-y-0.5">
            {skills.map((group, i) => (
              <p key={i}>
                {group.category && <span className="font-bold">{group.category}: </span>}
                <span>{(group.skills || []).join(", ")}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Elegant — Refined serif (Andrew O'Sullivan) ─────────

function ElegantSectionHeading({ children }) {
  return (
    <h2 className="mb-2 mt-4 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-[0.15em] text-black">
      {children}
    </h2>
  );
}

function ElegantPreview({ basics, work, education, skills }) {
  return (
    <div className="font-serif text-black">
      <div className="mb-3 text-center">
        {basics.name && <h1 className="text-3xl font-bold">{basics.name}</h1>}
        {basics.label && <p className="mt-0.5 text-sm italic text-gray-700">{basics.label}</p>}
        <ContactWithIcons basics={basics} center className="mt-1.5 text-xs text-gray-700" accentClass="text-gray-600" />
      </div>

      {basics.summary && (
        <div>
          <ElegantSectionHeading>Summary</ElegantSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <ElegantSectionHeading>Professional Experience</ElegantSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  {job.position && <p className="text-xs font-bold">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs text-gray-600">{[job.startDate, job.endDate].filter(Boolean).join(" – ")}</p>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  {job.company && <p className="text-xs italic text-gray-700">{job.company}</p>}
                  {job.location && <p className="shrink-0 text-xs italic text-gray-600">{job.location}</p>}
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
          <ElegantSectionHeading>Education</ElegantSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs text-gray-600">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</p>
                  )}
                </div>
                {edu.institution && <p className="text-xs italic text-gray-700">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <ElegantSectionHeading>Skills</ElegantSectionHeading>
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

// ── Professional — ATS B&W, inline name + title (Ahmed Hassan) ─

function ProfessionalSectionHeading({ children }) {
  return (
    <h2 className="mb-2 mt-4 border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  );
}

function ProfessionalDashList({ description }) {
  if (!description) return null;
  const items = description.split("\n").filter((l) => l.trim());
  if (items.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5 text-xs leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex gap-1.5">
          <span aria-hidden="true">–</span>
          <span>{item.trim()}</span>
        </li>
      ))}
    </ul>
  );
}

function ProfessionalPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);
  const profileParts = (basics.profiles || [])
    .filter((p) => p.url || p.network)
    .map((p) => (p.url || p.network).replace(/^https?:\/\//, ""));
  const allContact = [...contactParts, ...profileParts];

  return (
    <div className="text-black">
      {basics.name && (
        <h1 className="text-3xl font-bold">
          {basics.name}
          {basics.label && (
            <span className="ml-2 text-base font-normal italic text-gray-600">{basics.label}</span>
          )}
        </h1>
      )}
      {allContact.length > 0 && (
        <p className="mt-1 text-xs text-gray-700">{allContact.join("  |  ")}</p>
      )}

      {basics.summary && (
        <div>
          <ProfessionalSectionHeading>Summary</ProfessionalSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <ProfessionalSectionHeading>Professional Experience</ProfessionalSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs">
                    {job.company && <span className="font-bold">{job.company}</span>}
                    {job.position && (
                      <span className="italic">{job.company ? ", " : ""}{job.position}</span>
                    )}
                  </p>
                  <div className="shrink-0 text-right text-xs text-gray-600">
                    {(job.startDate || job.endDate) && (
                      <p>{[job.startDate, job.endDate].filter(Boolean).join(" – ")}</p>
                    )}
                    {job.location && <p>{job.location}</p>}
                  </div>
                </div>
                <ProfessionalDashList description={job.description} />
              </div>
            ))}
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div>
          <ProfessionalSectionHeading>Education</ProfessionalSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid flex items-start justify-between gap-4">
                <p className="text-xs">
                  <span className="font-bold">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</span>
                  {edu.institution && <span className="italic">, {edu.institution}</span>}
                </p>
                {(edu.startDate || edu.endDate) && (
                  <p className="shrink-0 text-right text-xs text-gray-600">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <ProfessionalSectionHeading>Skills</ProfessionalSectionHeading>
          <p className="text-xs leading-relaxed">
            {skills.flatMap((g) => g.skills || []).join("  |  ")}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Hybrid — Skills-led + chronological timeline ─────────

function HybridSectionHeading({ children }) {
  return (
    <h2 className="mb-2 mt-4 border-b-2 border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  );
}

function HybridPreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);
  const profileParts = (basics.profiles || [])
    .filter((p) => p.url || p.network)
    .map((p) => (p.url || p.network).replace(/^https?:\/\//, ""));

  return (
    <div className="text-black">
      {/* Header: left-aligned */}
      <div>
        {basics.name && <h1 className="text-2xl font-bold">{basics.name}</h1>}
        {basics.label && <p className="text-sm text-gray-700">{basics.label}</p>}
        {(contactParts.length > 0 || profileParts.length > 0) && (
          <p className="mt-1 text-xs text-gray-600">
            {[...contactParts, ...profileParts].join("  |  ")}
          </p>
        )}
      </div>

      {basics.summary && (
        <div>
          <HybridSectionHeading>Summary</HybridSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {/* Core Skills directly under the summary — hybrid signature */}
      {skills?.length > 0 && (
        <div>
          <HybridSectionHeading>Core Skills</HybridSectionHeading>
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

      {work?.length > 0 && (
        <div>
          <HybridSectionHeading>Experience</HybridSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-4">
                  {job.position && <p className="text-xs font-bold">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs font-semibold text-gray-700">
                      {[job.startDate, job.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {(job.company || job.location) && (
                  <p className="text-xs text-gray-600">
                    {[job.company, job.location].filter(Boolean).join(" · ")}
                  </p>
                )}
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
          <HybridSectionHeading>Education</HybridSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                  </p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs font-semibold text-gray-700">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {edu.institution && <p className="text-xs text-gray-600">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Accent — Single column, deep blue accent ─────────────

function AccentSectionHeading({ children }) {
  return (
    <div className="mb-2 mt-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-blue-800">{children}</h2>
      <div className="mt-0.5 h-0.5 w-10 bg-blue-800" />
    </div>
  );
}

function AccentPreview({ basics, work, education, skills }) {
  return (
    <div className="text-gray-800">
      {/* Header: left-aligned, accent name */}
      <div className="border-b border-gray-300 pb-3">
        {basics.name && <h1 className="text-3xl font-bold text-blue-800">{basics.name}</h1>}
        {basics.label && <p className="mt-0.5 text-sm text-gray-700">{basics.label}</p>}
        <ContactWithIcons
          basics={basics}
          className="mt-1.5 text-xs text-gray-600"
          accentClass="text-blue-800"
        />
      </div>

      {basics.summary && (
        <div>
          <AccentSectionHeading>Profile</AccentSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {work?.length > 0 && (
        <div>
          <AccentSectionHeading>Experience</AccentSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  {job.position && <p className="text-xs font-bold text-black">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs font-semibold text-blue-800">
                      {[job.startDate, job.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {(job.company || job.location) && (
                  <p className="text-xs italic text-gray-600">
                    {[job.company, job.location].filter(Boolean).join(" · ")}
                  </p>
                )}
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
          <AccentSectionHeading>Education</AccentSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-bold text-black">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                  </p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs font-semibold text-blue-800">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {edu.institution && <p className="text-xs italic text-gray-600">{edu.institution}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <AccentSectionHeading>Skills</AccentSectionHeading>
          <div className="space-y-1">
            {skills.map((group, i) => (
              <div key={i} className="text-xs">
                {group.category && <span className="font-bold text-black">{group.category}: </span>}
                <span>{(group.skills || []).join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Graduate — Education-first for entry level ───────────

function GraduateSectionHeading({ children }) {
  return (
    <h2 className="mb-2 mt-4 border-b border-black pb-1 text-xs font-bold uppercase tracking-widest text-black">
      {children}
    </h2>
  );
}

function GraduatePreview({ basics, work, education, skills }) {
  const contactParts = [basics.email, basics.phone, basics.location].filter(Boolean);
  const profileParts = (basics.profiles || [])
    .filter((p) => p.url || p.network)
    .map((p) => (p.url || p.network).replace(/^https?:\/\//, ""));

  return (
    <div className="text-black">
      {/* Compact centered header */}
      <div className="text-center">
        {basics.name && <h1 className="text-2xl font-bold">{basics.name}</h1>}
        {basics.label && <p className="text-sm text-gray-700">{basics.label}</p>}
        {(contactParts.length > 0 || profileParts.length > 0) && (
          <p className="mt-1 text-xs text-gray-600">
            {[...contactParts, ...profileParts].join("  •  ")}
          </p>
        )}
      </div>

      {basics.summary && (
        <div>
          <GraduateSectionHeading>Objective</GraduateSectionHeading>
          <p className="text-xs leading-relaxed whitespace-pre-line">{basics.summary}</p>
        </div>
      )}

      {/* Education FIRST — graduate signature */}
      {education?.length > 0 && (
        <div>
          <GraduateSectionHeading>Education</GraduateSectionHeading>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-4">
                  {edu.institution && <p className="text-xs font-bold">{edu.institution}</p>}
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-xs text-gray-600">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {(edu.degree || edu.fieldOfStudy) && (
                  <p className="text-xs italic text-gray-700">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div>
          <GraduateSectionHeading>Skills</GraduateSectionHeading>
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

      {work?.length > 0 && (
        <div>
          <GraduateSectionHeading>Experience</GraduateSectionHeading>
          <div className="space-y-3">
            {work.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-start justify-between gap-4">
                  {job.position && <p className="text-xs font-bold">{job.position}</p>}
                  {(job.startDate || job.endDate) && (
                    <p className="shrink-0 text-xs text-gray-600">
                      {[job.startDate, job.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )}
                </div>
                {(job.company || job.location) && (
                  <p className="text-xs italic text-gray-700">
                    {[job.company, job.location].filter(Boolean).join(" · ")}
                  </p>
                )}
                <div className="text-xs leading-relaxed">
                  <BulletList description={job.description} />
                </div>
              </div>
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
  hybrid: HybridPreview,
  accent: AccentPreview,
  graduate: GraduatePreview,
  modern: ModernPreview,
  clean: CleanPreview,
  minimal: MinimalPreview,
  technical: TechnicalPreview,
  sidebar: SidebarPreview,
  spotlight: SpotlightPreview,
  executive: ExecutivePreview,
  compact: CompactPreview,
  elegant: ElegantPreview,
  professional: ProfessionalPreview,
};

const PADDING = {
  hybrid: "p-8 sm:p-10",
  accent: "p-8 sm:p-10",
  graduate: "px-8 py-6 sm:px-10",
  modern: "px-8 py-6 sm:px-10",
  minimal: "p-6 sm:p-10",
  technical: "p-4",
  sidebar: "p-8 sm:p-10",
  spotlight: "p-8 sm:p-12",
  executive: "p-8 sm:p-10",
  compact: "px-8 py-5 sm:px-10",
  elegant: "p-8 sm:p-10",
};

// Bare template (no Card chrome) — shared by the on-screen preview and the
// /print route so the downloaded PDF matches the preview exactly.
export function ResumeTemplate({ data, template = "classic" }) {
  const { basics, work, education, skills } = data;
  const Preview = PREVIEWS[template] || ClassicPreview;
  const padding = PADDING[template] || "p-5 sm:p-8";

  return (
    <div
      data-resume-template={template}
      className={padding}
    >
      <Preview basics={basics} work={work} education={education} skills={skills} />
    </div>
  );
}

export default function ResumePreview({ data, template = "classic" }) {
  const { basics, work, education, skills } = data;
  const Preview = PREVIEWS[template] || ClassicPreview;
  const padding = PADDING[template] || "p-5 sm:p-8";

  return (
    <Card className="rounded-2xl border shadow-lg">
      <CardContent className={padding}>
        <Preview basics={basics} work={work} education={education} skills={skills} />
      </CardContent>
    </Card>
  );
}
