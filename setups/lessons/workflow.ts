import type { PacketContractInput, ReviewGateInput, WorkflowStepInput } from "paperzod";

export const workflowSteps = [
  {
    id: "section_dossier_step",
    roleId: "section_dossier_engineer",
    purpose: "Define what the section teaches, what it does not teach, and the receipts behind those calls.",
    requiredInputIds: [],
    supportInputIds: ["lessons_simple_clear_ref", "poker_kb_reference"],
    requiredOutputIds: ["section_dossier_packet"],
    stopLine: "Stop once the section dossier packet is coherent enough for lesson planning to trust.",
    nextStepId: "lesson_architect_step"
  },
  {
    id: "lesson_architect_step",
    roleId: "lessons_lesson_architect",
    purpose: "Turn the upstream dossier into a lesson plan with explicit teaching burden and deferred work.",
    requiredInputIds: ["section_dossier_contract"],
    supportInputIds: ["packet_shape_standard_artifact", "quality_bar_standard_artifact", "lessons_structured_requirements_ref"],
    requiredOutputIds: ["lesson_plan_packet"],
    stopLine: "Stop once the lesson plan is stable enough for the critic to judge.",
    nextGateId: "lessons_acceptance_critic_gate"
  }
] satisfies WorkflowStepInput[];

export const reviewGates = [
  {
    id: "lessons_acceptance_critic_gate",
    name: "Lessons Acceptance Critic",
    purpose: "Judge whether the packet chain is trustworthy and the quality bar still holds.",
    checkIds: ["lesson_plan_packet", "quality_bar_section"]
  }
] satisfies ReviewGateInput[];

export const packetContracts = [
  {
    id: "section_dossier_contract",
    name: "Section Dossier",
    conceptualArtifactIds: ["section_dossier_packet"],
    runtimeArtifactIds: ["prior_knowledge_map_md", "brief_md", "concepts_md"]
  },
  {
    id: "lesson_plan_contract",
    name: "Lesson Plan",
    conceptualArtifactIds: ["lesson_plan_packet"],
    runtimeArtifactIds: ["lesson_plan_runtime"]
  }
] satisfies PacketContractInput[];
