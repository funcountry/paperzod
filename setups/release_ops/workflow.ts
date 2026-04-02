import type { PacketContractInput, ReviewGateInput, WorkflowStepInput } from "paperzod";

export const workflowSteps = [
  {
    id: "release_readiness_step",
    roleId: "coordinator",
    purpose: "Prepare the release-readiness packet and route it into the final review.",
    requiredInputIds: [],
    supportInputIds: ["release_protocol_reference"],
    requiredOutputIds: ["release_readiness_packet"],
    stopLine: "Stop once the release packet is stable enough for final review.",
    nextGateId: "release_readiness_gate"
  }
] satisfies WorkflowStepInput[];

export const reviewGates = [
  {
    id: "release_readiness_gate",
    name: "Release Readiness Gate",
    purpose: "Judge whether the release packet is ready for handoff.",
    checkIds: ["release_readiness_packet"]
  }
] satisfies ReviewGateInput[];

export const packetContracts = [
  {
    id: "release_readiness_contract",
    name: "Release Readiness",
    conceptualArtifactIds: ["release_readiness_packet"]
  }
] satisfies PacketContractInput[];
