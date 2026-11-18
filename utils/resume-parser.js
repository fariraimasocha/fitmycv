import { extractJsonString } from "./llm-json.js";
/**
 * Parse the Groq LLM response into structured resume data.
 * Handles markdown code blocks, JSON quirks, and missing fields.
 */
export function parseResumeFromResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    basics: extractBasics(raw),
    work: mapWork(raw),
    education: mapEducation(raw),
    certifications: mapCertifications(raw),
    references: mapReferences(raw),
    skills: mapSkills(raw),
  };
}

function extractBasics(raw) {
  const b = raw.basics || {};
  const location = b.location;
  const locationStr =
    typeof location === "string"
      ? location
      : location
        ? [location.city, location.region, location.countryCode]
            .filter(Boolean)
            .join(", ")
        : "";

  return {
    name: b.name || "",
    label: b.label || "",
    email: b.email || "",
    phone: b.phone || "",
    summary: b.summary || "",
    location: locationStr,
    profiles: (b.profiles || []).map((p) => ({
      network: p.network || "",
      url: p.url || "",
    })),
  };
}

function mapWork(raw) {
  const work = raw.work || [];
  return work.map((w) => ({
    company: w.company || w.name || "",
    position: w.position || w.title || "",
    location: w.location || "",
    startDate: w.startDate || "",
    endDate: w.endDate || "",
    description: Array.isArray(w.highlights)
      ? w.highlights.join("\n")
      : w.summary || w.description || "",
  }));
}

function mapEducation(raw) {
  const edu = raw.education || [];
  return edu.map((e) => ({
    institution: e.institution || "",
    degree: e.studyType || e.degree || "",
    fieldOfStudy: e.area || e.fieldOfStudy || "",
    startDate: e.startDate || "",
    endDate: e.endDate || "",
  }));
}

const str = (v) => (typeof v === "string" ? v.trim() : "");

// Entries with no name are dropped, so an empty section never reaches the CV.
export function mapCertifications(raw) {
  const list = raw.certifications || raw.certificates || [];
  if (!Array.isArray(list)) return [];
  return list
    .map((c) => (typeof c === "string" ? { name: c } : c || {}))
    .map((c) => ({
      name: str(c.name || c.title),
      issuer: str(c.issuer || c.authority),
      date: str(c.date),
    }))
    .filter((c) => c.name);
}

export function mapReferences(raw) {
  const list = raw.references || [];
  if (!Array.isArray(list)) return [];
  return list
    .map((r) => ({
      name: str(r?.name),
      title: str(r?.title || r?.position),
      company: str(r?.company || r?.organization),
      email: str(r?.email),
      phone: str(r?.phone),
    }))
    .filter((r) => r.name);
}

function mapSkills(raw) {
  const skills = raw.skills || [];

  // If skills are already in {category, skills[]} format
  if (skills.length > 0 && Array.isArray(skills[0]?.keywords || skills[0]?.skills)) {
    return skills.map((s) => ({
      category: s.name || s.category || "General",
      skills: s.keywords || s.skills || [],
    }));
  }

  // If skills are flat strings, group them
  if (skills.length > 0 && typeof skills[0] === "string") {
    return [{ category: "General", skills }];
  }

  // If skills have name/level format (JSON Resume)
  if (skills.length > 0 && skills[0]?.name && !skills[0]?.keywords) {
    return [
      {
        category: "General",
        skills: skills.map((s) => s.name),
      },
    ];
  }

  return [];
}
