import type { LinkInput, SetupPart } from "paperzod";

import { surfaceDocumentParts } from "./surfaces.ts";

function collectHelperLinks(parts: readonly SetupPart[]): LinkInput[] {
  return parts.flatMap((part) => part.links ?? []);
}

const manualLinks = [
  { id: "dossier_role_contract_owned_by_role", kind: "owns", from: "section_dossier_engineer", to: "dossier_role_contract" },
  { id: "lesson_role_contract_owned_by_role", kind: "owns", from: "lessons_lesson_architect", to: "lesson_architect_role_contract" },
  { id: "section_dossier_lane_contract_owned_by_step", kind: "owns", from: "section_dossier_step", to: "section_dossier_lane_contract" },
  { id: "lesson_architect_lane_contract_owned_by_step", kind: "owns", from: "lesson_architect_step", to: "lesson_architect_lane_contract" },
  { id: "dossier_role_reads_comment_shape", kind: "reads", from: "section_dossier_engineer", to: "workflow_comment_shape" },
  {
    id: "dossier_role_reads_specialist_turn_shape",
    kind: "reads",
    from: "section_dossier_engineer",
    to: "workflow_specialist_turn_shape"
  },
  { id: "lesson_step_reads_packet_shape", kind: "reads", from: "lesson_architect_step", to: "packet_shape_section" },
  { id: "lesson_step_reads_quality_bar", kind: "reads", from: "lesson_architect_step", to: "quality_bar_section" },
  { id: "gate_section_owned_by_gate", kind: "owns", from: "lessons_acceptance_critic_gate", to: "gate_what_critic_judges" },
  { id: "gate_reads_quality_bar", kind: "reads", from: "lessons_acceptance_critic_gate", to: "quality_bar_section" },
  { id: "dossier_step_grounds_simple_clear", kind: "grounds", from: "section_dossier_step", to: "lessons_simple_clear_ref" },
  { id: "lesson_step_grounds_requirements", kind: "grounds", from: "lesson_architect_step", to: "lessons_structured_requirements_ref" },
  { id: "lesson_step_references_poker_kb", kind: "references", from: "lesson_architect_step", to: "poker_kb_reference" }
] satisfies LinkInput[];

export const links = [...collectHelperLinks(surfaceDocumentParts), ...manualLinks];
