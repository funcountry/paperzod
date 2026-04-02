import { defineRole, defineSetup } from "../../../src/source/index.js";

export const sharedRole = defineRole({
  id: "shared_role",
  name: "Shared Role",
  purpose: "Reusable role."
});

export const alpha = defineSetup({
  id: "alpha",
  name: "Alpha Setup",
  roles: [sharedRole],
  reviewGates: [
    {
      id: "shared_gate",
      name: "Shared Gate",
      purpose: "Shared gate with alpha wording.",
      checkIds: ["alpha_packet"]
    }
  ],
  packetContracts: [{ id: "alpha_contract", name: "Alpha Contract", conceptualArtifactIds: ["alpha_packet"] }],
  artifacts: [
    { id: "alpha_packet", name: "ALPHA_PACKET.md", artifactClass: "required", runtimePath: "generated/alpha/PACKET.md" }
  ],
  surfaces: [
    { id: "alpha_home", surfaceClass: "role_home", runtimePath: "generated/alpha/roles/shared_role/AGENTS.md" },
    { id: "alpha_gate_surface", surfaceClass: "gate", runtimePath: "generated/alpha/gates/shared_gate.md" },
    { id: "alpha_packet_surface", surfaceClass: "packet_workflow", runtimePath: "generated/alpha/packets/contract.md" }
  ],
  surfaceSections: [
    { id: "alpha_role_contract", surfaceId: "alpha_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "alpha_gate_criteria", surfaceId: "alpha_gate_surface", stableSlug: "criteria", title: "Criteria" },
    { id: "alpha_packet_shape", surfaceId: "alpha_packet_surface", stableSlug: "packet-shape", title: "Packet Shape" }
  ],
  generatedTargets: [
    { id: "alpha_home_target", path: "generated/alpha/roles/shared_role/AGENTS.md", sourceIds: ["shared_role"], sectionId: "alpha_role_contract" },
    { id: "alpha_gate_target", path: "generated/alpha/gates/shared_gate.md", sourceIds: ["shared_gate"], sectionId: "alpha_gate_criteria" },
    { id: "alpha_packet_target", path: "generated/alpha/packets/contract.md", sourceIds: ["alpha_contract"], sectionId: "alpha_packet_shape" }
  ],
  links: [
    { id: "alpha_home_documents_role", kind: "documents", from: "alpha_home", to: "shared_role" },
    { id: "alpha_role_contract_documents_role", kind: "documents", from: "alpha_role_contract", to: "shared_role" },
    { id: "alpha_gate_documents_gate", kind: "documents", from: "alpha_gate_surface", to: "shared_gate" },
    { id: "alpha_gate_criteria_documents_gate", kind: "documents", from: "alpha_gate_criteria", to: "shared_gate" },
    { id: "alpha_packet_documents_contract", kind: "documents", from: "alpha_packet_surface", to: "alpha_contract" },
    { id: "alpha_packet_shape_documents_contract", kind: "documents", from: "alpha_packet_shape", to: "alpha_contract" }
  ]
});

export const beta = defineSetup({
  id: "beta",
  name: "Beta Setup",
  roles: [{ ...sharedRole, purpose: "Reusable role with beta-local wording." }],
  reviewGates: [
    {
      id: "shared_gate",
      name: "Shared Gate",
      purpose: "Shared gate with beta wording.",
      checkIds: ["beta_packet"]
    }
  ],
  packetContracts: [
    {
      id: "beta_contract",
      name: "Beta Contract",
      conceptualArtifactIds: ["beta_packet"],
      runtimeArtifactIds: ["beta_packet_runtime"]
    }
  ],
  artifacts: [
    { id: "beta_packet", name: "BETA_PACKET.md", artifactClass: "required" },
    {
      id: "beta_packet_runtime",
      name: "BETA_PACKET_RUNTIME.md",
      artifactClass: "legacy",
      runtimePath: "generated/beta/PACKET.md",
      compatibilityOnly: true
    }
  ],
  surfaces: [
    { id: "beta_home", surfaceClass: "role_home", runtimePath: "generated/beta/roles/shared_role/AGENTS.md" },
    { id: "beta_gate_surface", surfaceClass: "gate", runtimePath: "generated/beta/gates/shared_gate.md" },
    { id: "beta_packet_surface", surfaceClass: "packet_workflow", runtimePath: "generated/beta/packets/contract.md" }
  ],
  surfaceSections: [
    { id: "beta_role_contract", surfaceId: "beta_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "beta_gate_criteria", surfaceId: "beta_gate_surface", stableSlug: "criteria", title: "Criteria" },
    { id: "beta_packet_shape", surfaceId: "beta_packet_surface", stableSlug: "packet-shape", title: "Packet Shape" }
  ],
  generatedTargets: [
    { id: "beta_home_target", path: "generated/beta/roles/shared_role/AGENTS.md", sourceIds: ["shared_role"], sectionId: "beta_role_contract" },
    { id: "beta_gate_target", path: "generated/beta/gates/shared_gate.md", sourceIds: ["shared_gate"], sectionId: "beta_gate_criteria" },
    { id: "beta_packet_target", path: "generated/beta/packets/contract.md", sourceIds: ["beta_contract"], sectionId: "beta_packet_shape" }
  ],
  links: [
    { id: "beta_home_documents_role", kind: "documents", from: "beta_home", to: "shared_role" },
    { id: "beta_role_contract_documents_role", kind: "documents", from: "beta_role_contract", to: "shared_role" },
    { id: "beta_gate_documents_gate", kind: "documents", from: "beta_gate_surface", to: "shared_gate" },
    { id: "beta_gate_criteria_documents_gate", kind: "documents", from: "beta_gate_criteria", to: "shared_gate" },
    { id: "beta_packet_documents_contract", kind: "documents", from: "beta_packet_surface", to: "beta_contract" },
    { id: "beta_packet_shape_documents_contract", kind: "documents", from: "beta_packet_shape", to: "beta_contract" }
  ]
});

const sharedOverridesSeed = {
  sharedRole,
  alpha,
  beta
};

export default sharedOverridesSeed;
