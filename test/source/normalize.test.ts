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
        "catalogs": [],
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
        "registries": [],
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

  it("preserves authored surface preambles and section bodies", () => {
    const result = normalizeSetup({
      id: "authored_content",
      name: "Authored Content",
      surfaces: [
        {
          id: "surface_1",
          surfaceClass: "project_home_root",
          runtimePath: "paperclip_home/project_homes/editorial/README.md",
          preamble: [
            { kind: "paragraph", text: "This project home maps the runtime doctrine surface." },
            {
              kind: "rule_list",
              items: [
                "Start at the shared README.",
                { text: "Do not treat tools docs as runtime owners.", children: ["Do not route runtime law through tools/README.md."] }
              ]
            },
            {
              kind: "definition_list",
              items: [
                {
                  term: "packet",
                  definitions: ["The current handoff bundle.", "Only trust what the current owner proved."]
                }
              ]
            },
            {
              kind: "table",
              headers: ["Owner", "Primary doc"],
              rows: [["Editorial Project Lead", "AUTHORITATIVE_EDITORIAL_WORKFLOW.md"]]
            },
            {
              kind: "example",
              title: "Example compile command",
              blocks: [{ kind: "code_block", code: "paperzod compile setups/editorial/index.ts", language: "sh" }]
            },
            {
              kind: "good_bad_examples",
              good: [
                {
                  title: "Good routing move",
                  blocks: [{ kind: "paragraph", text: "Open the shared owner before packet-specific doctrine." }]
                }
              ],
              bad: [
                {
                  title: "Bad routing move",
                  blocks: [{ kind: "paragraph", text: "Jump straight into critic doctrine by habit." }]
                }
              ]
            }
          ]
        }
      ],
      surfaceSections: [
        {
          id: "section_1",
          surfaceId: "surface_1",
          stableSlug: "project-home-map",
          title: "Project Home Map",
          body: [
            { kind: "paragraph", text: "Read the shared entrypoint before lane-specific docs." },
            {
              kind: "ordered_steps",
              items: ["Open README.", { text: "Open AUTHORITATIVE workflow.", children: ["Then open only the named owner."] }]
            },
            { kind: "code_block", code: "paperzod compile setups/editorial/index.ts", language: "sh" }
          ]
        }
      ],
      roles: [{ id: "role_1", name: "Role 1", purpose: "Read the project doctrine honestly." }],
      links: [
        {
          id: "role_reads_project_home",
          kind: "reads",
          from: "role_1",
          to: "surface_1",
          condition: "When you need the shared owner map.",
          context: "Read the whole project-home root before deeper shared docs."
        }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.surfaces).toEqual([
      {
        kind: "surface",
        id: "surface_1",
        setupId: "authored_content",
        surfaceClass: "project_home_root",
        runtimePath: "paperclip_home/project_homes/editorial/README.md",
        preamble: [
          { kind: "paragraph", text: "This project home maps the runtime doctrine surface." },
          {
            kind: "rule_list",
            items: [
              "Start at the shared README.",
              { text: "Do not treat tools docs as runtime owners.", children: ["Do not route runtime law through tools/README.md."] }
            ]
          },
          {
            kind: "definition_list",
            items: [
              {
                term: "packet",
                definitions: ["The current handoff bundle.", "Only trust what the current owner proved."]
              }
            ]
          },
          {
            kind: "table",
            headers: ["Owner", "Primary doc"],
            rows: [["Editorial Project Lead", "AUTHORITATIVE_EDITORIAL_WORKFLOW.md"]]
          },
          {
            kind: "example",
            title: "Example compile command",
            blocks: [{ kind: "code_block", code: "paperzod compile setups/editorial/index.ts", language: "sh" }]
          },
          {
            kind: "good_bad_examples",
            good: [
              {
                title: "Good routing move",
                blocks: [{ kind: "paragraph", text: "Open the shared owner before packet-specific doctrine." }]
              }
            ],
            bad: [
              {
                title: "Bad routing move",
                blocks: [{ kind: "paragraph", text: "Jump straight into critic doctrine by habit." }]
              }
            ]
          }
        ]
      }
    ]);
    expect(result.data.surfaceSections).toEqual([
      {
        kind: "surface_section",
        id: "section_1",
        setupId: "authored_content",
        surfaceId: "surface_1",
        stableSlug: "project-home-map",
        title: "Project Home Map",
        body: [
          { kind: "paragraph", text: "Read the shared entrypoint before lane-specific docs." },
          {
            kind: "ordered_steps",
            items: ["Open README.", { text: "Open AUTHORITATIVE workflow.", children: ["Then open only the named owner."] }]
          },
          { kind: "code_block", code: "paperzod compile setups/editorial/index.ts", language: "sh" }
        ]
      }
    ]);
    expect(result.data.links).toEqual([
      {
        id: "role_reads_project_home",
        setupId: "authored_content",
        kind: "reads",
        from: "role_1",
        to: "surface_1",
        condition: "When you need the shared owner map.",
        context: "Read the whole project-home root before deeper shared docs."
      }
    ]);
  });

  it("preserves authored subsection hierarchy on nested surface sections", () => {
    const result = normalizeSetup({
      id: "hierarchical_sections",
      name: "Hierarchical Sections",
      surfaces: [{ id: "surface_1", surfaceClass: "shared_entrypoint", runtimePath: "paperclip_home/project_homes/editorial/shared/README.md" }],
      surfaceSections: [
        { id: "terms", surfaceId: "surface_1", stableSlug: "terms", title: "Terms" },
        { id: "workflow_items", surfaceId: "surface_1", stableSlug: "workflow-items", title: "Workflow Items", parentSectionId: "terms" },
        { id: "poker_items", surfaceId: "surface_1", stableSlug: "story-items", title: "Editorial Story Items", parentSectionId: "terms" },
        { id: "lesson_root", surfaceId: "surface_1", stableSlug: "lesson-root", title: "Lesson Root", parentSectionId: "poker_items" }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.surfaceSections).toEqual([
      {
        kind: "surface_section",
        id: "terms",
        setupId: "hierarchical_sections",
        surfaceId: "surface_1",
        stableSlug: "terms",
        title: "Terms"
      },
      {
        kind: "surface_section",
        id: "workflow_items",
        setupId: "hierarchical_sections",
        surfaceId: "surface_1",
        stableSlug: "workflow-items",
        title: "Workflow Items",
        parentSectionId: "terms"
      },
      {
        kind: "surface_section",
        id: "poker_items",
        setupId: "hierarchical_sections",
        surfaceId: "surface_1",
        stableSlug: "story-items",
        title: "Editorial Story Items",
        parentSectionId: "terms"
      },
      {
        kind: "surface_section",
        id: "lesson_root",
        setupId: "hierarchical_sections",
        surfaceId: "surface_1",
        stableSlug: "lesson-root",
        title: "Lesson Root",
        parentSectionId: "poker_items"
      }
    ]);
  });

  it("normalizes registries and artifact evidence contracts", () => {
    const result = normalizeSetup({
      id: "registry_evidence_setup",
      name: "Registry Evidence Setup",
      registries: [
        {
          id: "publish_result",
          name: "Publish Result",
          description: "Allowed result values.",
          entries: [
            { id: "pass", label: "PASS" },
            { id: "fail", label: "FAIL", description: "The check failed." }
          ]
        }
      ],
      artifacts: [
        {
          id: "authority_note",
          name: "Authority Note",
          artifactClass: "required",
          evidence: {
            requiredArtifactIds: ["pre_publish_audit"],
            requiredClaims: [
              {
                id: "result",
                label: "Result",
                allowedValue: { registryId: "publish_result", entryId: "pass" }
              }
            ]
          }
        }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.registries).toEqual([
      {
        id: "publish_result",
        name: "Publish Result",
        description: "Allowed result values.",
        entries: [
          { id: "pass", label: "PASS" },
          { id: "fail", label: "FAIL", description: "The check failed." }
        ]
      }
    ]);
    expect(result.data.artifacts).toEqual([
      {
        kind: "artifact",
        id: "authority_note",
        setupId: "registry_evidence_setup",
        name: "Authority Note",
        artifactClass: "required",
        evidence: {
          requiredArtifactIds: ["pre_publish_audit"],
          requiredClaims: [
            {
              id: "result",
              label: "Result",
              allowedValue: { registryId: "publish_result", entryId: "pass" }
            }
          ]
        }
      }
    ]);
  });

  it("normalizes command catalogs, required section contracts, and typed inline refs without rendering them early", () => {
    const result = normalizeSetup({
      id: "typed_refs_normalize",
      name: "Typed Refs Normalize",
      catalogs: [{ kind: "command", entries: [{ id: "paperclip_status", display: "./paperclip status" }] }],
      artifacts: [{ id: "action_authority", name: "ACTION_AUTHORITY.md", artifactClass: "required" }],
      surfaces: [
        {
          id: "author_home",
          surfaceClass: "role_home",
          runtimePath: "generated/author/AGENTS.md",
          requiredSectionSlugs: ["read-first", "role-contract"],
          preamble: [
            {
              kind: "paragraph",
              text: ["Read ", { kind: "ref", refKind: "artifact", id: "action_authority" }, " before taking final action."]
            }
          ]
        }
      ],
      surfaceSections: [
        {
          id: "read_first",
          surfaceId: "author_home",
          stableSlug: "read-first",
          title: "Read First",
          body: [
            {
              kind: "paragraph",
              text: ["Run ", { kind: "ref", refKind: "catalog_entry", catalogKind: "command", entryId: "paperclip_status" }, " first."]
            }
          ]
        }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.catalogs).toEqual([{ kind: "command", entries: [{ id: "paperclip_status", display: "./paperclip status" }] }]);
    expect(result.data.surfaces[0]?.requiredSectionSlugs).toEqual(["read-first", "role-contract"]);
    expect(result.data.surfaces[0]?.preamble?.[0]).toEqual({
      kind: "paragraph",
      text: ["Read ", { kind: "ref", refKind: "artifact", id: "action_authority" }, " before taking final action."]
    });
    expect(result.data.surfaceSections[0]?.body?.[0]).toEqual({
      kind: "paragraph",
      text: ["Run ", { kind: "ref", refKind: "catalog_entry", catalogKind: "command", entryId: "paperclip_status" }, " first."]
    });
  });
});
