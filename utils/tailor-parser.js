/**
 * Parse the Groq LLM response into structured tailored CV + cover letter data.
 * Handles markdown code blocks, JSON quirks, and missing fields.
 */
export function parseTailorResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    tailoredCV: {
      basics: extractBasics(raw.cv || raw),
      work: mapWork(raw.cv || raw),
      education: mapEducation(raw.cv || raw),
      skills: mapSkills(raw.cv || raw),
    },
    coverLetter: raw.coverLetter || raw.cover_letter || "",
  };
}

function extractJsonString(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return cleanJsonString(codeBlockMatch[1]);
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return cleanJsonString(jsonMatch[0]);
  }

  throw new Error("No JSON found in LLM response");
}

function cleanJsonString(str) {
  let cleaned = str
    .trim()
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\/\/.*$/gm, "");

  // Escape literal control characters inside JSON string values
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
    return match
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  });

  return cleaned;
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

function mapSkills(raw) {
  const skills = raw.skills || [];

  if (skills.length > 0 && Array.isArray(skills[0]?.keywords || skills[0]?.skills)) {
    return skills.map((s) => ({
      category: s.name || s.category || "General",
      skills: s.keywords || s.skills || [],
    }));
  }

  if (skills.length > 0 && typeof skills[0] === "string") {
    return [{ category: "General", skills }];
  }

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
