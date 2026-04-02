import type { PacketContractInput, ReviewGateInput, WorkflowStepInput } from "paperzod";

export const workflowSteps = [
  {
    id: "brief_research_step",
    roleId: "brief_researcher",
    purpose: "Define what the piece needs to communicate, what it does not cover, and the evidence behind those calls.",
    requiredInputIds: [],
    supportInputIds: ["editorial_simple_clear_ref", "audience_research_reference"],
    requiredOutputIds: ["editorial_brief_packet"],
    stopLine: "Stop once the editorial brief packet is coherent enough for story outlining to trust.",
    nextStepId: "story_architect_step"
  },
  {
    id: "story_architect_step",
    roleId: "story_architect",
    purpose: "Turn the upstream brief into a story outline with explicit structure and deferred work.",
    requiredInputIds: ["editorial_brief_contract"],
    supportInputIds: ["packet_shape_standard_artifact", "quality_bar_standard_artifact", "editorial_structured_requirements_ref"],
    requiredOutputIds: ["story_outline_packet"],
    stopLine: "Stop once the story outline is stable enough for the critic to judge.",
    nextGateId: "editorial_acceptance_gate"
  }
] satisfies WorkflowStepInput[];

export const reviewGates = [
  {
    id: "editorial_acceptance_gate",
    name: "Editorial Acceptance Gate",
    purpose: "Judge whether the packet chain is trustworthy and the quality bar still holds.",
    checkIds: ["story_outline_packet", "quality_bar_section"]
  }
] satisfies ReviewGateInput[];

export const packetContracts = [
  {
    id: "editorial_brief_contract",
    name: "Editorial Brief",
    conceptualArtifactIds: ["editorial_brief_packet"],
    runtimeArtifactIds: ["prior_research_notes_md", "brief_request_md", "source_notes_md"]
  },
  {
    id: "story_outline_contract",
    name: "Story Outline",
    conceptualArtifactIds: ["story_outline_packet"],
    runtimeArtifactIds: ["story_outline_runtime"]
  }
] satisfies PacketContractInput[];
