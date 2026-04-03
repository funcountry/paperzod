import { defineRole, defineSetup, defineWorkflowStep } from "../../../src/source/index.js";

const demoMinimalSeed = defineSetup({
  id: "demo_minimal",
  name: "Demo Minimal",
  roles: [
    defineRole({ id: "author", name: "Author", purpose: "Create the artifact." }),
    defineRole({ id: "critic", name: "Critic", purpose: "Review the artifact." })
  ],
  workflowSteps: [
    defineWorkflowStep({
      id: "draft_packet",
      roleId: "author",
      purpose: "Draft the first packet.",
      requiredInputIds: [],
      supportInputIds: ["research_notes"],
      interimArtifactIds: ["draft_notes"],
      requiredOutputIds: ["packet_v1"],
      stopLine: "Stop after the first packet draft is ready for review.",
      nextGateId: "critic_gate"
    })
  ],
  reviewGates: [
    {
      id: "critic_gate",
      name: "Critic Gate",
      purpose: "Review the first packet.",
      checkIds: ["packet_v1"]
    }
  ],
  packetContracts: [
    {
      id: "packet_contract",
      name: "Packet Contract",
      conceptualArtifactIds: ["packet_v1"]
    }
  ],
  artifacts: [
    { id: "research_notes", name: "Research Notes", artifactClass: "support" },
    { id: "draft_notes", name: "Draft Notes", artifactClass: "support", conceptualOnly: true },
    { id: "packet_v1", name: "PACKET_V1.md", artifactClass: "required", runtimePath: "generated/PACKET_V1.md" }
  ],
  surfaces: [
    {
      id: "author_home",
      surfaceClass: "role_home",
      runtimePath: "generated/roles/author/AGENTS.md",
      requiredSectionSlugs: ["role-contract"]
    },
    { id: "workflow_surface", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }
  ],
  surfaceSections: [
    { id: "role_contract", surfaceId: "author_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "workflow_section", surfaceId: "workflow_surface", stableSlug: "default-order", title: "Default Order" }
  ],
  generatedTargets: [
    { id: "author_home_target", path: "generated/roles/author/AGENTS.md", sourceIds: ["author"], sectionId: "role_contract" },
    { id: "workflow_target", path: "generated/WORKFLOW.md", sourceIds: ["draft_packet", "critic_gate"], sectionId: "workflow_section" }
  ],
  links: [
    { id: "author_home_documents_author", kind: "documents", from: "author_home", to: "author" },
    { id: "role_contract_documents_author", kind: "documents", from: "role_contract", to: "author" },
    { id: "workflow_section_documents_step", kind: "documents", from: "workflow_section", to: "draft_packet" },
    { id: "step_supports_notes", kind: "supports", from: "draft_packet", to: "research_notes" },
    { id: "step_produces_packet", kind: "produces", from: "draft_packet", to: "packet_v1" },
    { id: "gate_checks_packet", kind: "checks", from: "critic_gate", to: "packet_v1" }
  ]
});

export default demoMinimalSeed;
