import type { SurfaceClass } from "./defs.js";

export interface PlannedDocument {
  id: string;
  surfaceId: string;
  surfaceClass: SurfaceClass;
  path: string;
  generatedTargetIds: string[];
  sourceIds: string[];
  sectionIds: string[];
}

export interface PlannedSection {
  id: string;
  documentId: string;
  surfaceSectionId: string;
  stableSlug: string;
  title: string;
  parentSectionId?: string | undefined;
  sourceIds: string[];
}

export interface CompilePlan {
  setupId: string;
  documents: PlannedDocument[];
  sections: PlannedSection[];
  documentById: Record<string, PlannedDocument>;
  sectionById: Record<string, PlannedSection>;
  pathManifest: Record<string, string>;
}
