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
    skills: mapSkills(raw),
  };
}

function extractJsonString(text) {
  // Try to extract from markdown code block first
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return cleanJsonString(codeBlockMatch[1]);
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return cleanJsonString(jsonMatch[0]);
  }

  throw new Error("No JSON found in LLM response");
}

function cleanJsonString(str) {
  return (
    str
      .trim()
      // Remove trailing commas before } or ]
      .replace(/,\s*([}\]])/g, "$1")
      // Remove single-line comments
      .replace(/\/\/.*$/gm, "")
  );
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
