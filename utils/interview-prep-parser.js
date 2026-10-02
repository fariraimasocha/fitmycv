import { extractJsonString } from "./llm-json.js";
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
