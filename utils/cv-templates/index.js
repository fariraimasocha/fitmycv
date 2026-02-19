import { renderClassic } from "./classic";
import { renderModern } from "./modern";
import { renderClean } from "./clean";
import { renderMinimal } from "./minimal";
import { renderCreative } from "./creative";
import { renderTechnical } from "./technical";

export const CV_TEMPLATES = {
  classic: { id: "classic", name: "Classic", render: renderClassic },
  modern: { id: "modern", name: "Modern", render: renderModern },
  clean: { id: "clean", name: "Clean", render: renderClean },
  minimal: { id: "minimal", name: "Minimal", render: renderMinimal },
  creative: { id: "creative", name: "Creative", render: renderCreative },
  technical: { id: "technical", name: "Technical", render: renderTechnical },
};

export const TEMPLATE_LIST = Object.values(CV_TEMPLATES);
export const DEFAULT_TEMPLATE = "classic";
