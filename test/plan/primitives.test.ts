import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { buildCompilePlan } from "../../src/plan/index.js";
import { composeSetup, defineRoleHomeTemplate, defineSetup, normalizeSetup, projectDocumentSections } from "../../src/source/index.js";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";

function requireGraph(input: unknown) {
  const normalized = normalizeSetup(input);
  expect(normalized.success).toBe(true);
  if (!normalized.success) {
    throw new Error("Expected setup normalization to succeed.");
  }

  const graph = buildGraph(normalized.data);
  expect(graph.success).toBe(true);
  if (!graph.success) {
    throw new Error("Expected graph build to succeed.");
  }

  return graph.data;
}

describe("compile plan primitives", () => {
  it("builds a stable compile plan for demo_minimal", () => {
    const graph = requireGraph(demoMinimalSeed);
    const result = buildCompilePlan(graph);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      setupId: result.data.setupId,
      documents: result.data.documents,
      sections: result.data.sections,
      pathManifest: result.data.pathManifest
    }).toMatchInlineSnapshot(`
      {
        "documents": [
          {
            "generatedTargetIds": [
              "author_home_target",
            ],
            "id": "author_home",
            "path": "generated/roles/author/AGENTS.md",
            "sectionIds": [
              "role_contract",
            ],
            "sourceIds": [
              "author",
              "author_home",
              "role_contract",
            ],
            "surfaceClass": "role_home",
            "surfaceId": "author_home",
          },
          {
            "generatedTargetIds": [
              "workflow_target",
            ],
            "id": "workflow_surface",
            "path": "generated/WORKFLOW.md",
            "sectionIds": [
              "workflow_section",
            ],
            "sourceIds": [
              "critic_gate",
              "draft_packet",
              "workflow_section",
              "workflow_surface",
            ],
            "surfaceClass": "workflow_owner",
            "surfaceId": "workflow_surface",
          },
        ],
        "pathManifest": {
          "author_home": "generated/roles/author/AGENTS.md",
          "workflow_surface": "generated/WORKFLOW.md",
        },
        "sections": [
          {
            "documentId": "author_home",
            "id": "role_contract",
            "sourceIds": [
              "author",
              "role_contract",
            ],
            "stableSlug": "role-contract",
            "surfaceSectionId": "role_contract",
            "title": "Role Contract",
          },
          {
            "documentId": "workflow_surface",
            "id": "workflow_section",
            "sourceIds": [
              "critic_gate",
              "draft_packet",
              "workflow_section",
            ],
            "stableSlug": "default-order",
            "surfaceSectionId": "workflow_section",
            "title": "Default Order",
          },
        ],
        "setupId": "demo_minimal",
      }
    `);
  });

  it("fails when a runtime surface has no generated source backing", () => {
    const graph = requireGraph({
      id: "plan_missing_backing",
      name: "Plan Missing Backing",
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }]
    });

    const result = buildCompilePlan(graph);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["plan.document_missing_source_backing"]);
  });

  it("fails when a planned section has no declared generation provenance", () => {
    const graph = requireGraph({
      id: "plan_missing_section_provenance",
      name: "Plan Missing Section Provenance",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when complete.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["surface_1"] }],
      links: [{ id: "documents_1", kind: "documents", from: "section_1", to: "step_1" }]
    });

    const result = buildCompilePlan(graph);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["plan.section_missing_generation_provenance"]);
  });

  it("accepts explicit section-level generated target provenance", () => {
    const graph = requireGraph({
      id: "plan_explicit_section_target",
      name: "Plan Explicit Section Target",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when complete.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"], sectionId: "section_1" }],
      links: [{ id: "documents_1", kind: "documents", from: "section_1", to: "step_1" }]
    });

    const result = buildCompilePlan(graph);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.sections[0]?.sourceIds).toEqual(["section_1", "step_1"]);
  });

  it("fails invalid generated_from provenance links", () => {
    const graph = requireGraph({
      id: "plan_invalid_generated_from",
      name: "Plan Invalid Generated From",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Do work." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when complete.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check output.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"] }],
      links: [
        { id: "documents_1", kind: "documents", from: "section_1", to: "step_1" },
        { id: "generated_from_bad_source", kind: "generated_from", from: "role_1", to: "section_1" },
        { id: "generated_from_bad_target", kind: "generated_from", from: "target_1", to: "surface_1" }
      ]
    });

    const result = buildCompilePlan(graph);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "plan.generated_from_source_invalid",
      "plan.generated_from_target_invalid",
      "plan.section_missing_generation_provenance"
    ]);
  });

  it("omits sparse optional role-home sections from the compile plan when a destination does not configure them", () => {
    const roleHomeTemplate = defineRoleHomeTemplate({
      id: "role_home_sparse_plan",
      sections: [
        { key: "readFirst", title: "Read First" },
        { key: "roleContract", title: "Role Contract" },
        { key: "standards", title: "Standards And Support", emissionPolicy: "whenConfigured" },
        {
          key: "copyStandards",
          title: "Copy Standards",
          parentKey: "standards",
          emissionPolicy: "whenConfigured"
        }
      ] as const,
      requiredSections: ["readFirst", "roleContract"] as const
    });

    const graph = requireGraph(
      composeSetup(
        defineSetup({
          id: "plan_sparse_role_home",
          name: "Plan Sparse Role Home",
          roles: [
            { id: "writer", name: "Writer", purpose: "Draft the issue." },
            { id: "critic", name: "Critic", purpose: "Review the issue." }
          ]
        }),
        ...projectDocumentSections(roleHomeTemplate, {
          destinations: [
            {
              surfaceId: "writer_home",
              runtimePath: "generated/writer/AGENTS.md",
              roleId: "writer",
              sections: {
                copyStandards: {
                  body: [{ kind: "paragraph", text: "Use the approved copy checklist before publishing." }]
                }
              }
            },
            {
              surfaceId: "critic_home",
              runtimePath: "generated/critic/AGENTS.md",
              roleId: "critic"
            }
          ]
        })
      )
    );

    const result = buildCompilePlan(graph);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.documents.map((document) => ({
      id: document.id,
      sectionIds: document.sectionIds
    }))).toEqual([
      {
        id: "writer_home",
        sectionIds: [
          "writer_home_read_first",
          "writer_home_role_contract",
          "writer_home_standards",
          "writer_home_copy_standards"
        ]
      },
      {
        id: "critic_home",
        sectionIds: ["critic_home_read_first", "critic_home_role_contract"]
      }
    ]);
  });
});
