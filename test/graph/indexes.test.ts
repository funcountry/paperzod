import { describe, expect, it } from "vitest";

import { buildGraph, getCheckTargets, getReadSections, getReadersOfSection } from "../../src/graph/index.js";
import { normalizeSetup } from "../../src/source/index.js";
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

describe("graph indexes", () => {
  it("builds stable indexes for the demo fixture", () => {
    const graph = requireGraph(demoMinimalSeed);

    expect({
      roleIdByWorkflowStepId: graph.indexes.roleIdByWorkflowStepId,
      workflowStepIdsByRoleId: graph.indexes.workflowStepIdsByRoleId,
      producerIdsByArtifactId: graph.indexes.producerIdsByArtifactId,
      consumerIdsByArtifactId: graph.indexes.consumerIdsByArtifactId,
      supporterIdsByArtifactId: graph.indexes.supporterIdsByArtifactId,
      checkerIdsByArtifactId: graph.indexes.checkerIdsByArtifactId,
      routeTargetIdsByNodeId: graph.indexes.routeTargetIdsByNodeId,
      surfaceSectionIdsBySurfaceId: graph.indexes.surfaceSectionIdsBySurfaceId,
      generatedSourceIdsByTargetId: graph.indexes.generatedSourceIdsByTargetId
    }).toMatchInlineSnapshot(`
      {
        "checkerIdsByArtifactId": {
          "packet_v1": [
            "critic_gate",
          ],
        },
        "consumerIdsByArtifactId": {},
        "generatedSourceIdsByTargetId": {
          "author_home_target": [
            "author",
          ],
          "workflow_target": [
            "critic_gate",
            "draft_packet",
          ],
        },
        "producerIdsByArtifactId": {
          "packet_v1": [
            "draft_packet",
          ],
        },
        "roleIdByWorkflowStepId": {
          "draft_packet": "author",
        },
        "routeTargetIdsByNodeId": {
          "draft_packet": [
            "critic_gate",
          ],
        },
        "supporterIdsByArtifactId": {
          "draft_notes": [
            "draft_packet",
          ],
          "research_notes": [
            "draft_packet",
          ],
        },
        "surfaceSectionIdsBySurfaceId": {
          "author_home": [
            "role_contract",
          ],
          "workflow_surface": [
            "workflow_section",
          ],
        },
        "workflowStepIdsByRoleId": {
          "author": [
            "draft_packet",
          ],
        },
      }
    `);
  });

  it("supports ownership and producer lookups", () => {
    const graph = requireGraph(demoMinimalSeed);

    expect(graph.indexes.roleIdByWorkflowStepId.draft_packet).toBe("author");
    expect(graph.indexes.workflowStepIdsByRoleId.author).toEqual(["draft_packet"]);
    expect(graph.indexes.producerIdsByArtifactId.packet_v1).toEqual(["draft_packet"]);
    expect(graph.indexes.surfaceIdBySectionId.workflow_section).toBe("workflow_surface");
  });

  it("indexes documentation, grounding, references, runtime mappings, and generation provenance", () => {
    const graph = requireGraph({
      id: "index_links",
      name: "Index Links",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Read and write." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit output.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop once the artifact exists."
        }
      ],
      artifacts: [
        { id: "artifact_1", name: "Artifact 1", artifactClass: "required" },
        { id: "runtime_1", name: "Runtime 1", artifactClass: "legacy", runtimePath: "generated/RUNTIME.md", compatibilityOnly: true }
      ],
      surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
      surfaceSections: [{ id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" }],
      references: [{ id: "ref_1", referenceClass: "grounding_reference", name: "Grounding Ref", sourcePath: "docs/ref/GROUNDING.md" }],
      generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["step_1"] }],
      links: [
        { id: "documents_1", kind: "documents", from: "section_1", to: "step_1" },
        { id: "grounds_1", kind: "grounds", from: "step_1", to: "ref_1" },
        { id: "references_1", kind: "references", from: "role_1", to: "ref_1" },
        { id: "runtime_map_1", kind: "maps_to_runtime", from: "artifact_1", to: "runtime_1" },
        { id: "generated_from_1", kind: "generated_from", from: "target_1", to: "section_1" }
      ]
    });

    expect(graph.indexes.documentedByNodeId.step_1).toEqual(["section_1"]);
    expect(graph.indexes.groundingReferenceIdsByNodeId.step_1).toEqual(["ref_1"]);
    expect(graph.indexes.referenceIdsByNodeId.role_1).toEqual(["ref_1"]);
    expect(graph.indexes.runtimeMappingIdsBySourceId.artifact_1).toEqual(["runtime_1"]);
    expect(graph.indexes.generatedSourceIdsByTargetId.target_1).toEqual(["section_1", "step_1"]);
    expect(graph.indexes.generatedTargetIdsBySourceId.step_1).toEqual(["target_1"]);
  });

  it("indexes exact section reads and non-artifact gate checks", () => {
    const graph = requireGraph({
      id: "index_reads_and_checks",
      name: "Index Reads And Checks",
      roles: [{ id: "role_1", name: "Role 1", purpose: "Read exact doctrine sections." }],
      workflowSteps: [
        {
          id: "step_1",
          roleId: "role_1",
          purpose: "Emit and then rely on packet doctrine.",
          requiredInputIds: [],
          requiredOutputIds: ["artifact_1"],
          stopLine: "Stop when the packet is ready.",
          nextGateId: "gate_1"
        }
      ],
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check packet and standards.", checkIds: ["packet_1", "section_2"] }],
      packetContracts: [{ id: "packet_1", name: "Packet 1", conceptualArtifactIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required" }],
      surfaces: [{ id: "surface_1", surfaceClass: "standard", runtimePath: "generated/STANDARD.md" }],
      surfaceSections: [
        { id: "section_1", surfaceId: "surface_1", stableSlug: "read-first", title: "Read First" },
        { id: "section_2", surfaceId: "surface_1", stableSlug: "quality-bar", title: "Quality Bar" }
      ],
      links: [
        { id: "role_reads_section", kind: "reads", from: "role_1", to: "section_1" },
        { id: "step_reads_section", kind: "reads", from: "step_1", to: "section_2" }
      ]
    });

    expect(graph.indexes.readSectionIdsByReaderId.role_1).toEqual(["section_1"]);
    expect(graph.indexes.readSectionIdsByReaderId.step_1).toEqual(["section_2"]);
    expect(graph.indexes.readerIdsBySectionId.section_1).toEqual(["role_1"]);
    expect(graph.indexes.readerIdsBySectionId.section_2).toEqual(["step_1"]);
    expect(graph.indexes.checkerIdsByNodeId.packet_1).toEqual(["gate_1"]);
    expect(graph.indexes.checkerIdsByNodeId.section_2).toEqual(["gate_1"]);
    expect(graph.indexes.checkedNodeIdsByCheckerId.gate_1).toEqual(["packet_1", "section_2"]);

    expect(getReadSections(graph, "role_1").map((section) => section.id)).toEqual(["section_1"]);
    expect(getReadersOfSection(graph, "section_2").map((node) => node.id)).toEqual(["step_1"]);
    expect(getCheckTargets(graph, "gate_1").map((node) => node.id)).toEqual(["packet_1", "section_2"]);
  });
});
