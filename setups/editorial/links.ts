import type { LinkInput, SetupPart } from "paperzod";

import { surfaceDocumentParts } from "./surfaces.ts";

function collectHelperLinks(parts: readonly SetupPart[]): LinkInput[] {
  return parts.flatMap((part) => part.links ?? []);
}

const manualLinks = [
  { id: "brief_researcher_role_contract_owned_by_role", kind: "owns", from: "brief_researcher", to: "brief_researcher_role_contract" },
  { id: "story_role_contract_owned_by_role", kind: "owns", from: "story_architect", to: "story_architect_role_contract" },
  { id: "brief_researcher_lane_contract_owned_by_step", kind: "owns", from: "brief_research_step", to: "brief_researcher_lane_contract" },
  { id: "story_architect_lane_contract_owned_by_step", kind: "owns", from: "story_architect_step", to: "story_architect_lane_contract" },
  { id: "brief_researcher_reads_comment_shape", kind: "reads", from: "brief_researcher", to: "workflow_comment_shape" },
  {
    id: "brief_researcher_reads_specialist_turn_shape",
    kind: "reads",
    from: "brief_researcher",
    to: "workflow_specialist_turn_shape"
  },
  { id: "story_step_reads_packet_shape", kind: "reads", from: "story_architect_step", to: "packet_shape_section" },
  { id: "story_step_reads_quality_bar", kind: "reads", from: "story_architect_step", to: "quality_bar_section" },
  { id: "gate_section_owned_by_gate", kind: "owns", from: "editorial_acceptance_gate", to: "gate_what_critic_judges" },
  { id: "gate_reads_quality_bar", kind: "reads", from: "editorial_acceptance_gate", to: "quality_bar_section" },
  { id: "brief_research_step_grounds_simple_clear", kind: "grounds", from: "brief_research_step", to: "editorial_simple_clear_ref" },
  { id: "story_step_grounds_requirements", kind: "grounds", from: "story_architect_step", to: "editorial_structured_requirements_ref" },
  { id: "story_step_references_research_kb", kind: "references", from: "story_architect_step", to: "audience_research_reference" }
] satisfies LinkInput[];

export const links = [...collectHelperLinks(surfaceDocumentParts), ...manualLinks];
