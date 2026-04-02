import { describe, expect, it } from "vitest";

import demoMinimalSeed from "../fixtures/source/demo-minimal.js";
import { defineRole, defineSetup, defineWorkflowStep } from "../../src/source/builders.js";
import { normalizeSetup } from "../../src/source/normalize.js";

describe("setup normalization", () => {
  it("normalizes the demo fixture into a stable SetupDef", () => {
    const result = normalizeSetup(demoMinimalSeed);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data).toMatchInlineSnapshot(`
      {
        "artifacts": [
          {
            "artifactClass": "support",
            "id": "research_notes",
            "kind": "artifact",
            "name": "Research Notes",
            "setupId": "demo_minimal",
          },
          {
            "artifactClass": "support",
            "conceptualOnly": true,
            "id": "draft_notes",
            "kind": "artifact",
            "name": "Draft Notes",
            "setupId": "demo_minimal",
          },
          {
            "artifactClass": "required",
            "id": "packet_v1",
            "kind": "artifact",
            "name": "PACKET_V1.md",
            "runtimePath": "generated/PACKET_V1.md",
            "setupId": "demo_minimal",
          },
        ],
        "generatedTargets": [
          {
            "id": "author_home_target",
            "kind": "generated_target",
            "path": "generated/roles/author/AGENTS.md",
            "sectionId": "role_contract",
            "setupId": "demo_minimal",
            "sourceIds": [
              "author",
            ],
          },
          {
            "id": "workflow_target",
            "kind": "generated_target",
            "path": "generated/WORKFLOW.md",
            "sectionId": "workflow_section",
            "setupId": "demo_minimal",
            "sourceIds": [
              "draft_packet",
              "critic_gate",
            ],
          },
        ],
        "links": [
          {
            "from": "author_home",
            "id": "author_home_documents_author",
            "kind": "documents",
            "setupId": "demo_minimal",
            "to": "author",
          },
          {
            "from": "role_contract",
            "id": "role_contract_documents_author",
            "kind": "documents",
            "setupId": "demo_minimal",
            "to": "author",
          },
          {
            "from": "workflow_section",
            "id": "workflow_section_documents_step",
            "kind": "documents",
            "setupId": "demo_minimal",
            "to": "draft_packet",
          },
          {
            "from": "draft_packet",
            "id": "step_supports_notes",
            "kind": "supports",
            "setupId": "demo_minimal",
            "to": "research_notes",
          },
          {
            "from": "draft_packet",
            "id": "step_produces_packet",
            "kind": "produces",
            "setupId": "demo_minimal",
            "to": "packet_v1",
          },
          {
            "from": "critic_gate",
            "id": "gate_checks_packet",
            "kind": "checks",
            "setupId": "demo_minimal",
            "to": "packet_v1",
          },
        ],
        "packetContracts": [
          {
            "conceptualArtifactIds": [
              "packet_v1",
            ],
            "id": "packet_contract",
            "kind": "packet_contract",
            "name": "Packet Contract",
            "setupId": "demo_minimal",
          },
        ],
        "references": [],
        "reviewGates": [
          {
            "checkIds": [
              "packet_v1",
            ],
            "id": "critic_gate",
            "kind": "review_gate",
            "name": "Critic Gate",
            "purpose": "Review the first packet.",
            "setupId": "demo_minimal",
          },
        ],
        "roles": [
          {
            "id": "author",
            "kind": "role",
            "name": "Author",
            "purpose": "Create the artifact.",
            "setupId": "demo_minimal",
          },
          {
            "id": "critic",
            "kind": "role",
            "name": "Critic",
            "purpose": "Review the artifact.",
            "setupId": "demo_minimal",
          },
        ],
        "setup": {
          "id": "demo_minimal",
          "kind": "setup",
          "name": "Demo Minimal",
        },
        "surfaceSections": [
          {
            "id": "role_contract",
            "kind": "surface_section",
            "setupId": "demo_minimal",
            "stableSlug": "role-contract",
            "surfaceId": "author_home",
            "title": "Role Contract",
          },
          {
            "id": "workflow_section",
            "kind": "surface_section",
            "setupId": "demo_minimal",
            "stableSlug": "default-order",
            "surfaceId": "workflow_surface",
            "title": "Default Order",
          },
        ],
        "surfaces": [
          {
            "id": "author_home",
            "kind": "surface",
            "runtimePath": "generated/roles/author/AGENTS.md",
            "setupId": "demo_minimal",
            "surfaceClass": "role_home",
          },
          {
            "id": "workflow_surface",
            "kind": "surface",
            "runtimePath": "generated/WORKFLOW.md",
            "setupId": "demo_minimal",
            "surfaceClass": "workflow_owner",
          },
        ],
        "workflowSteps": [
          {
            "id": "draft_packet",
            "interimArtifactIds": [
              "draft_notes",
            ],
            "kind": "workflow_step",
            "nextGateId": "critic_gate",
            "purpose": "Draft the first packet.",
            "requiredInputIds": [],
            "requiredOutputIds": [
              "packet_v1",
            ],
            "roleId": "author",
            "setupId": "demo_minimal",
            "stopLine": "Stop after the first packet draft is ready for review.",
            "supportInputIds": [
              "research_notes",
            ],
          },
        ],
      }
    `);
  });

  it("treats builder and plain-object setup declarations the same", () => {
    const builderSetup = defineSetup({
      id: "equivalence",
      name: "Equivalence",
      roles: [defineRole({ id: "role_1", name: "Role 1", purpose: "Do work." })],
      workflowSteps: [
        defineWorkflowStep({
          id: "step_1",
          roleId: "role_1",
          purpose: "Produce output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop.",
          nextGateId: "gate_1"
        })
      ]
    });

    const plainSetup = {
      id: "equivalence",
      name: "Equivalence",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Produce output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop.",
          nextGateId: "gate_1"
        }
      ]
    };

    expect(normalizeSetup(builderSetup)).toEqual(normalizeSetup(plainSetup));
  });
});
