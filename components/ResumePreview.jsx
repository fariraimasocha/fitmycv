import { Card, CardContent } from "@/components/ui/card";

function SectionHeading({ children }) {
  return (
    <h2 className="mb-3 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
      {children}
    </h2>
  );
}

export default function ResumePreview({ data }) {
  const { basics, work, education, skills } = data;

  const contactParts = [basics.email, basics.phone, basics.location].filter(
    Boolean,
  );

  return (
    <Card className="rounded-2xl border shadow-lg">
      <CardContent className="space-y-6 p-8">
        {/* Header */}
        <div className="text-center">
          {basics.name && (
            <h1 className="text-2xl font-bold text-gray-900">{basics.name}</h1>
          )}
          {basics.label && (
            <p className="mt-1 text-sm font-medium text-gray-600">
              {basics.label}
            </p>
          )}
          {contactParts.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {contactParts.join("  |  ")}
            </p>
          )}
          {basics.profiles?.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {basics.profiles
                .filter((p) => p.network || p.url)
                .map((p) =>
                  p.url ? `${p.network || "Link"}: ${p.url}` : p.network,
                )
                .join("  |  ")}
            </p>
          )}
        </div>

        {/* Professional Summary */}
        {basics.summary && (
          <div>
            <SectionHeading>Professional Summary</SectionHeading>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {basics.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {work?.length > 0 && (
          <div>
            <SectionHeading>Work Experience</SectionHeading>
            <div className="space-y-4">
              {work.map((job, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between">
                    <div>
                      {job.position && (
                        <p className="text-sm font-semibold text-gray-900">
                          {job.position}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {[job.company, job.location].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    {(job.startDate || job.endDate) && (
                      <p className="shrink-0 text-sm text-gray-500">
                        {job.startDate}
                        {job.startDate && job.endDate ? " – " : ""}
                        {job.endDate}
                      </p>
                    )}
                  </div>
                  {job.description && (
                    <p className="mt-1 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                      {job.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {[edu.degree, edu.fieldOfStudy]
                        .filter(Boolean)
                        .join(" in ")}
                    </p>
                    {edu.institution && (
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-sm text-gray-500">
                      {edu.startDate}
                      {edu.startDate && edu.endDate ? " – " : ""}
                      {edu.endDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <SectionHeading>Skills</SectionHeading>
            <div className="space-y-2">
              {skills.map((group, i) => (
                <div key={i} className="text-sm">
                  {group.category && (
                    <span className="font-semibold text-gray-900">
                      {group.category}:{" "}
                    </span>
                  )}
                  <span className="text-gray-700">
                    {(group.skills || []).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
