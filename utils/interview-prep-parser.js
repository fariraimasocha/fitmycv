/**
 * Parse the OpenAI response into structured interview prep data.
 */
export function parseInterviewPrepResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    stories: Array.isArray(raw.stories)
      ? raw.stories.map((s) => ({
          requirement: s.requirement || "",
          situation: s.situation || "",
          task: s.task || "",
          action: s.action || "",
          result: s.result || "",
          reflection: s.reflection || "",
        }))
      : [],
    redFlagQA: Array.isArray(raw.redFlagQA)
      ? raw.redFlagQA.map((q) => ({
          question: q.question || "",
          suggestedAnswer: q.suggestedAnswer || "",
        }))
      : [],
    talkingPoints: Array.isArray(raw.talkingPoints) ? raw.talkingPoints.filter(Boolean) : [],
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

  throw new Error("No JSON found in interview prep response");
}

function cleanJsonString(str) {
  let cleaned = str
    .trim()
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\/\/.*$/gm, "");

  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
    return match
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  });

  return cleaned;
}
