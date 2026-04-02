import type { ArtifactInput } from "paperzod";

export const artifacts = [
  { id: "section_dossier_packet", name: "SECTION_DOSSIER.md", artifactClass: "required", runtimePath: "_authoring/SECTION_DOSSIER.md" },
  { id: "lesson_plan_packet", name: "LESSON_PLAN.md", artifactClass: "required", runtimePath: "_authoring/LESSON_PLAN.md" },
  {
    id: "prior_knowledge_map_md",
    name: "PRIOR_KNOWLEDGE_MAP.md",
    artifactClass: "legacy",
    runtimePath: "_authoring/PRIOR_KNOWLEDGE_MAP.md",
    compatibilityOnly: true
  },
  { id: "brief_md", name: "BRIEF.md", artifactClass: "legacy", runtimePath: "_authoring/BRIEF.md", compatibilityOnly: true },
  { id: "concepts_md", name: "CONCEPTS.md", artifactClass: "legacy", runtimePath: "_authoring/CONCEPTS.md", compatibilityOnly: true },
  {
    id: "lesson_plan_runtime",
    name: "LESSON_PLAN_RUNTIME.md",
    artifactClass: "legacy",
    runtimePath: "_authoring/LESSON_PLAN_RUNTIME.md",
    compatibilityOnly: true
  },
  { id: "comment_shape_contract", name: "Comment Shape", artifactClass: "reference" },
  { id: "specialist_turn_shape_contract", name: "Specialist Turn Shape", artifactClass: "reference" },
  { id: "packet_shape_standard_artifact", name: "Packet Shape Standard", artifactClass: "reference" },
  { id: "quality_bar_standard_artifact", name: "Quality Bar Standard", artifactClass: "reference" }
] satisfies ArtifactInput[];
