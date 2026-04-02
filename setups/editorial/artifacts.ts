import type { ArtifactInput } from "paperzod";

export const artifacts = [
  { id: "editorial_brief_packet", name: "EDITORIAL_BRIEF.md", artifactClass: "required", runtimePath: "_authoring/EDITORIAL_BRIEF.md" },
  { id: "story_outline_packet", name: "STORY_OUTLINE.md", artifactClass: "required", runtimePath: "_authoring/STORY_OUTLINE.md" },
  {
    id: "prior_research_notes_md",
    name: "PRIOR_RESEARCH_NOTES.md",
    artifactClass: "legacy",
    runtimePath: "_authoring/PRIOR_RESEARCH_NOTES.md",
    compatibilityOnly: true
  },
  { id: "brief_request_md", name: "BRIEF_REQUEST.md", artifactClass: "legacy", runtimePath: "_authoring/BRIEF_REQUEST.md", compatibilityOnly: true },
  { id: "source_notes_md", name: "SOURCE_NOTES.md", artifactClass: "legacy", runtimePath: "_authoring/SOURCE_NOTES.md", compatibilityOnly: true },
  {
    id: "story_outline_runtime",
    name: "STORY_OUTLINE_RUNTIME.md",
    artifactClass: "legacy",
    runtimePath: "_authoring/STORY_OUTLINE_RUNTIME.md",
    compatibilityOnly: true
  },
  { id: "comment_shape_contract", name: "Comment Shape", artifactClass: "reference" },
  { id: "specialist_turn_shape_contract", name: "Specialist Turn Shape", artifactClass: "reference" },
  { id: "packet_shape_standard_artifact", name: "Packet Shape Standard", artifactClass: "reference" },
  { id: "quality_bar_standard_artifact", name: "Quality Bar Standard", artifactClass: "reference" }
] satisfies ArtifactInput[];
