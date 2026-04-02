import type { GeneratedTargetInput, SetupPart } from "paperzod";

import { surfaceDocumentParts } from "./surfaces.ts";

function collectGeneratedTargets(parts: readonly SetupPart[]): GeneratedTargetInput[] {
  return parts.flatMap((part) => part.generatedTargets ?? []);
}

export const generatedTargets = collectGeneratedTargets(surfaceDocumentParts);
