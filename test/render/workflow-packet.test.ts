import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { renderPlannedDocument } from "../../src/markdown/index.js";
import { buildCompilePlan } from "../../src/plan/index.js";
import { normalizeSetup } from "../../src/source/index.js";

function renderDocument(input: unknown, documentId: string): string {
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

  const plan = buildCompilePlan(graph.data);
  expect(plan.success).toBe(true);
  if (!plan.success) {
    throw new Error("Expected plan build to succeed.");
  }

  return renderPlannedDocument(graph.data, plan.data, documentId).markdown;
}

describe("workflow and packet renderers", () => {
  it("renders a workflow-owner document", () => {
    const markdown = renderDocument(
      {
        id: "render_workflow",
        name: "Render Workflow",
        roles: [{ id: "author", name: "Author", purpose: "Draft the packet." }],
        workflowSteps: [
          {
            id: "draft_packet",
            roleId: "author",
            purpose: "Draft the first packet.",
            requiredInputIds: [],
            supportInputIds: ["notes"],
            interimArtifactIds: ["draft_notes"],
            requiredOutputIds: ["packet_v1"],
            stopLine: "Stop once the packet is ready for review.",
            nextGateId: "gate_1"
          }
        ],
        reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check the packet.", checkIds: ["packet_v1"] }],
        artifacts: [
          { id: "notes", name: "Notes", artifactClass: "support" },
          { id: "draft_notes", name: "Draft Notes", artifactClass: "support", conceptualOnly: true },
          { id: "packet_v1", name: "PACKET_V1.md", artifactClass: "required" }
        ],
        surfaces: [
          {
            id: "workflow_surface",
            surfaceClass: "workflow_owner",
            runtimePath: "paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md"
          }
        ],
        surfaceSections: [{ id: "lane_order", surfaceId: "workflow_surface", stableSlug: "owner-map", title: "Owner Map" }],
        generatedTargets: [
          {
            id: "target_1",
            path: "paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
            sourceIds: ["draft_packet"],
            sectionId: "lane_order"
          }
        ],
        links: [{ id: "documents_step", kind: "documents", from: "lane_order", to: "draft_packet" }]
      },
      "workflow_surface"
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# Workflow Owner

      Use this file for represented workflow order, owner routing, and lane contracts.

      <a id="owner-map"></a>
      ## Owner Map

      Use this section to understand the represented workflow order for the current setup.

      1. Author: Draft the first packet.

      This section currently documents the Author lane.

      - Read before acting: none
      - Required inputs: none
      - Support inputs: Notes
      - Interim artifacts: Draft Notes
      - Outputs the next owner may trust: PACKET_V1.md
      - Stop line: Stop once the packet is ready for review.
      - Hand off to gate: Gate 1
      "
    `);
  });

  it("renders a packet-workflow document", () => {
    const markdown = renderDocument(
      {
        id: "render_packet",
        name: "Render Packet",
        roles: [{ id: "author", name: "Author", purpose: "Draft the packet." }],
        workflowSteps: [
          {
            id: "draft_packet",
            roleId: "author",
            purpose: "Draft the first packet.",
            requiredInputIds: [],
            supportInputIds: ["notes"],
            interimArtifactIds: ["draft_notes"],
            requiredOutputIds: ["packet_v1"],
            stopLine: "Stop once the packet is ready for review.",
            nextGateId: "gate_1"
          }
        ],
        reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check the packet.", checkIds: ["packet_v1"] }],
        artifacts: [
          { id: "notes", name: "Notes", artifactClass: "support" },
          { id: "draft_notes", name: "Draft Notes", artifactClass: "support", conceptualOnly: true },
          { id: "packet_v1", name: "PACKET_V1.md", artifactClass: "required" },
          { id: "packet_runtime", name: "PACKET_RUNTIME.md", artifactClass: "legacy", runtimePath: "generated/PACKET.md", compatibilityOnly: true }
        ],
        packetContracts: [
          {
            id: "packet_contract",
            name: "Packet Contract",
            conceptualArtifactIds: ["packet_v1"],
            runtimeArtifactIds: ["packet_runtime"]
          }
        ],
        surfaces: [{ id: "packet_surface", surfaceClass: "packet_workflow", runtimePath: "generated/PACKET_WORKFLOW.md" }],
        surfaceSections: [
          { id: "packet_shape", surfaceId: "packet_surface", stableSlug: "what-this-lane-must-do", title: "What This Lane Must Do" }
        ],
        generatedTargets: [
          { id: "target_1", path: "generated/PACKET_WORKFLOW.md", sourceIds: ["packet_contract"], sectionId: "packet_shape" }
        ],
        links: [
          { id: "documents_surface_contract", kind: "documents", from: "packet_surface", to: "packet_contract" },
          { id: "documents_section_step", kind: "documents", from: "packet_shape", to: "draft_packet" }
        ]
      },
      "packet_surface"
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# Author Workflow

      This file defines the shared workflow for the Author lane.

      It does not define handoff mechanics, the shared packet file rules, or critic verdicts.

      <a id="what-this-lane-must-do"></a>
      ## What This Lane Must Do

      Use this section as the lane contract for the \`Packet Contract\` packet.

      Draft the first packet.

      - Current owner: Author
      - Read before acting: none
      - Required inputs: none
      - Support inputs: Notes
      - Interim artifacts: Draft Notes
      - Outputs the next owner may trust: PACKET_V1.md
      - Stop line: Stop once the packet is ready for review.
      - Hand off to gate: Gate 1
      "
    `);
  });
});
