import type { SetupInput } from "../../src/source/builders.ts";

const secondSetupSeed = {
  id: "core_dev",
  name: "Core Dev",
  description: "The canonical non-Lessons proving setup for a different Paperclip workflow.",
  roles: [
    {
      id: "shared_role",
      name: "Shared Role",
      purpose: "Coordinate the core-dev workflow and keep the shared release doctrine coherent."
    }
  ],
  workflowSteps: [
    {
      id: "release_readiness_step",
      roleId: "shared_role",
      purpose: "Prepare the release-readiness packet and route it into the final review.",
      requiredInputIds: [],
      supportInputIds: ["release_protocol_reference"],
      requiredOutputIds: ["release_readiness_packet"],
      stopLine: "Stop once the release packet is stable enough for final review.",
      nextGateId: "release_readiness_gate"
    }
  ],
  reviewGates: [
    {
      id: "release_readiness_gate",
      name: "Release Readiness Gate",
      purpose: "Judge whether the release packet is ready for handoff.",
      checkIds: ["release_readiness_packet"]
    }
  ],
  packetContracts: [
    {
      id: "release_readiness_contract",
      name: "Release Readiness",
      conceptualArtifactIds: ["release_readiness_packet"]
    }
  ],
  artifacts: [
    {
      id: "release_readiness_packet",
      name: "RELEASE_READINESS.md",
      artifactClass: "required",
      runtimePath: "_authoring/RELEASE_READINESS.md"
    },
    {
      id: "release_protocol_standard",
      name: "Release Protocol Standard",
      artifactClass: "reference"
    }
  ],
  surfaces: [
    {
      id: "coordinator_home",
      surfaceClass: "role_home",
      runtimePath: "paperclip_home/agents/coordinator/AGENTS.md"
    },
    {
      id: "core_dev_readme",
      surfaceClass: "shared_entrypoint",
      runtimePath: "paperclip_home/project_homes/core_dev/shared/README.md",
      title: "Core Dev Shared Doctrine",
      intro: [
        { kind: "paragraph", text: "This folder is the shared doctrine home for the Core Dev setup." },
        { kind: "paragraph", text: "Start here, then open the one surface that owns your current release question." }
      ]
    },
    {
      id: "release_workflow_surface",
      surfaceClass: "workflow_owner",
      runtimePath: "paperclip_home/project_homes/core_dev/shared/workflows/AUTHORITATIVE_CORE_DEV_WORKFLOW.md",
      title: "Core Dev Workflow",
      intro: [
        { kind: "paragraph", text: "This file owns the top-level Core Dev release workflow." },
        { kind: "paragraph", text: "Use it for release order, owner routing, and final handoff expectations." }
      ]
    },
    {
      id: "release_gate_surface",
      surfaceClass: "gate",
      runtimePath: "paperclip_home/project_homes/core_dev/shared/gates/RELEASE_READINESS_GATE.md",
      title: "Release Readiness Gate"
    },
    {
      id: "release_how_to_surface",
      surfaceClass: "how_to",
      runtimePath: "paperclip_home/project_homes/core_dev/shared/runbooks/RELEASE_PROTOCOL.md",
      title: "Release Protocol"
    }
  ],
  surfaceSections: [
    { id: "coordinator_read_first", surfaceId: "coordinator_home", stableSlug: "read-first", title: "Read First" },
    { id: "coordinator_role_contract", surfaceId: "coordinator_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "shared_release_order", surfaceId: "core_dev_readme", stableSlug: "read-order", title: "Release Order" },
    { id: "workflow_release_shape", surfaceId: "release_workflow_surface", stableSlug: "release-shape", title: "Release Shape" },
    { id: "gate_final_checks", surfaceId: "release_gate_surface", stableSlug: "final-checks", title: "Final Checks" },
    { id: "how_to_protocol", surfaceId: "release_how_to_surface", stableSlug: "protocol", title: "Protocol" }
  ],
  references: [
    {
      id: "release_protocol_reference",
      referenceClass: "support_reference",
      name: "Release Protocol",
      sourcePath: "paperclip_home/project_homes/core_dev/shared/runbooks/RELEASE_PROTOCOL.md"
    }
  ],
  generatedTargets: [
    {
      id: "coordinator_home_read_first_target",
      path: "paperclip_home/agents/coordinator/AGENTS.md",
      sourceIds: ["shared_role"],
      sectionId: "coordinator_read_first"
    },
    {
      id: "coordinator_home_role_contract_target",
      path: "paperclip_home/agents/coordinator/AGENTS.md",
      sourceIds: ["shared_role"],
      sectionId: "coordinator_role_contract"
    },
    {
      id: "core_dev_readme_target",
      path: "paperclip_home/project_homes/core_dev/shared/README.md",
      sourceIds: ["release_readiness_step"],
      sectionId: "shared_release_order"
    },
    {
      id: "release_workflow_target",
      path: "paperclip_home/project_homes/core_dev/shared/workflows/AUTHORITATIVE_CORE_DEV_WORKFLOW.md",
      sourceIds: ["release_readiness_step"],
      sectionId: "workflow_release_shape"
    },
    {
      id: "release_gate_target",
      path: "paperclip_home/project_homes/core_dev/shared/gates/RELEASE_READINESS_GATE.md",
      sourceIds: ["release_readiness_gate"],
      sectionId: "gate_final_checks"
    },
    {
      id: "release_how_to_target",
      path: "paperclip_home/project_homes/core_dev/shared/runbooks/RELEASE_PROTOCOL.md",
      sourceIds: ["release_protocol_reference"],
      sectionId: "how_to_protocol"
    }
  ],
  links: [
    { id: "coordinator_home_documents_role", kind: "documents", from: "coordinator_home", to: "shared_role" },
    { id: "coordinator_read_first_documents_role", kind: "documents", from: "coordinator_read_first", to: "shared_role" },
    { id: "coordinator_role_contract_documents_role", kind: "documents", from: "coordinator_role_contract", to: "shared_role" },
    { id: "shared_release_order_documents_step", kind: "documents", from: "shared_release_order", to: "release_readiness_step" },
    { id: "workflow_release_shape_documents_step", kind: "documents", from: "workflow_release_shape", to: "release_readiness_step" },
    { id: "release_gate_surface_documents_gate", kind: "documents", from: "release_gate_surface", to: "release_readiness_gate" },
    { id: "gate_final_checks_documents_gate", kind: "documents", from: "gate_final_checks", to: "release_readiness_gate" },
    { id: "release_how_to_surface_documents_reference", kind: "documents", from: "release_how_to_surface", to: "release_protocol_reference" },
    { id: "how_to_protocol_documents_reference", kind: "documents", from: "how_to_protocol", to: "release_protocol_reference" }
  ]
} satisfies SetupInput;

export default secondSetupSeed;
