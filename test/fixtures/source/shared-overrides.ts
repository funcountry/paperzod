import { applyKeyedOverrides, defineRole, defineSetup } from "../../../src/source/index.js";

export const sharedRole = defineRole({
  id: "shared_role",
  name: "Shared Role",
  purpose: "Reusable role."
});

const sharedSetup = defineSetup({
  id: "shared_base",
  name: "Shared Base",
  roles: [sharedRole],
  reviewGates: [
    {
      id: "shared_gate",
      name: "Shared Gate",
      purpose: "Shared gate with shared wording.",
      checkIds: ["packet"]
    }
  ],
  packetContracts: [{ id: "shared_contract", name: "Shared Contract", conceptualArtifactIds: ["packet"] }],
  artifacts: [
    { id: "packet", name: "SHARED_PACKET.md", artifactClass: "required", runtimePath: "generated/shared/PACKET.md" },
    {
      id: "packet_runtime",
      name: "SHARED_PACKET_RUNTIME.md",
      artifactClass: "legacy",
      runtimePath: "generated/shared/PACKET_RUNTIME.md",
      compatibilityOnly: true
    }
  ],
  surfaces: [
    { id: "home", surfaceClass: "role_home", runtimePath: "generated/shared/roles/shared_role/AGENTS.md" },
    { id: "gate_surface", surfaceClass: "gate", runtimePath: "generated/shared/gates/shared_gate.md" },
    { id: "packet_surface", surfaceClass: "packet_workflow", runtimePath: "generated/shared/packets/contract.md" }
  ],
  surfaceSections: [
    { id: "role_contract", surfaceId: "home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "gate_criteria", surfaceId: "gate_surface", stableSlug: "criteria", title: "Criteria" },
    { id: "packet_shape", surfaceId: "packet_surface", stableSlug: "packet-shape", title: "Packet Shape" }
  ],
  generatedTargets: [
    { id: "home_target", path: "generated/shared/roles/shared_role/AGENTS.md", sourceIds: ["shared_role"], sectionId: "role_contract" },
    { id: "gate_target", path: "generated/shared/gates/shared_gate.md", sourceIds: ["shared_gate"], sectionId: "gate_criteria" },
    { id: "packet_target", path: "generated/shared/packets/contract.md", sourceIds: ["shared_contract"], sectionId: "packet_shape" }
  ],
  links: [
    { id: "home_documents_role", kind: "documents", from: "home", to: "shared_role" },
    { id: "role_contract_documents_role", kind: "documents", from: "role_contract", to: "shared_role" },
    { id: "gate_documents_gate", kind: "documents", from: "gate_surface", to: "shared_gate" },
    { id: "gate_criteria_documents_gate", kind: "documents", from: "gate_criteria", to: "shared_gate" },
    { id: "packet_documents_contract", kind: "documents", from: "packet_surface", to: "shared_contract" },
    { id: "packet_shape_documents_contract", kind: "documents", from: "packet_shape", to: "shared_contract" }
  ]
});

export const alpha = defineSetup({
  ...applyKeyedOverrides(sharedSetup, {
    reviewGates: [
      {
        id: "shared_gate",
        replace: (current) => ({ ...current, purpose: "Shared gate with alpha wording." })
      }
    ],
    packetContracts: [
      {
        id: "shared_contract",
        replace: (current) => ({ ...current, name: "Alpha Contract" })
      }
    ],
    artifacts: [
      {
        id: "packet",
        replace: (current) => ({ ...current, name: "ALPHA_PACKET.md", runtimePath: "generated/alpha/PACKET.md" })
      },
      {
        id: "packet_runtime",
        replace: (current) => ({ ...current, name: "ALPHA_PACKET_RUNTIME.md", runtimePath: "generated/alpha/PACKET_RUNTIME.md" })
      }
    ],
    surfaces: [
      {
        id: "home",
        replace: (current) => ({ ...current, runtimePath: "generated/alpha/roles/shared_role/AGENTS.md" })
      },
      {
        id: "gate_surface",
        replace: (current) => ({ ...current, runtimePath: "generated/alpha/gates/shared_gate.md" })
      },
      {
        id: "packet_surface",
        replace: (current) => ({ ...current, runtimePath: "generated/alpha/packets/contract.md" })
      }
    ],
    generatedTargets: [
      {
        id: "home_target",
        replace: (current) => ({ ...current, path: "generated/alpha/roles/shared_role/AGENTS.md" })
      },
      {
        id: "gate_target",
        replace: (current) => ({ ...current, path: "generated/alpha/gates/shared_gate.md" })
      },
      {
        id: "packet_target",
        replace: (current) => ({ ...current, path: "generated/alpha/packets/contract.md" })
      }
    ]
  }),
  id: "alpha",
  name: "Alpha Setup"
});

export const beta = defineSetup({
  ...applyKeyedOverrides(sharedSetup, {
    roles: [
      {
        id: "shared_role",
        replace: (current) => ({ ...current, purpose: "Reusable role with beta-local wording." })
      }
    ],
    reviewGates: [
      {
        id: "shared_gate",
        replace: (current) => ({ ...current, purpose: "Shared gate with beta wording." })
      }
    ],
    packetContracts: [
      {
        id: "shared_contract",
        replace: (current) => ({
          ...current,
          name: "Beta Contract",
          runtimeArtifactIds: ["packet_runtime"]
        })
      }
    ],
    artifacts: [
      {
        id: "packet",
        replace: ({ id, artifactClass }) => ({
          id,
          name: "BETA_PACKET.md",
          artifactClass
        })
      },
      {
        id: "packet_runtime",
        replace: (current) => ({ ...current, name: "BETA_PACKET_RUNTIME.md", runtimePath: "generated/beta/PACKET.md" })
      }
    ],
    surfaces: [
      {
        id: "home",
        replace: (current) => ({ ...current, runtimePath: "generated/beta/roles/shared_role/AGENTS.md" })
      },
      {
        id: "gate_surface",
        replace: (current) => ({ ...current, runtimePath: "generated/beta/gates/shared_gate.md" })
      },
      {
        id: "packet_surface",
        replace: (current) => ({ ...current, runtimePath: "generated/beta/packets/contract.md" })
      }
    ],
    generatedTargets: [
      {
        id: "home_target",
        replace: (current) => ({ ...current, path: "generated/beta/roles/shared_role/AGENTS.md" })
      },
      {
        id: "gate_target",
        replace: (current) => ({ ...current, path: "generated/beta/gates/shared_gate.md" })
      },
      {
        id: "packet_target",
        replace: (current) => ({ ...current, path: "generated/beta/packets/contract.md" })
      }
    ]
  }),
  id: "beta",
  name: "Beta Setup"
});

const sharedOverridesSeed = {
  sharedRole,
  alpha,
  beta
};

export default sharedOverridesSeed;
