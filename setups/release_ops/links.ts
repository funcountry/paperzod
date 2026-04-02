import type { LinkInput, SetupPart } from "paperzod";

import { surfaceDocumentParts } from "./surfaces.ts";

function collectHelperLinks(parts: readonly SetupPart[]): LinkInput[] {
  return parts.flatMap((part) => part.links ?? []);
}

export const links = collectHelperLinks(surfaceDocumentParts);
