import { describe, expect, it } from "vitest";

import { buildGraph } from "../../src/graph/index.js";
import { renderDocuments } from "../../src/markdown/index.js";
import { buildCompilePlan } from "../../src/plan/index.js";
import { normalizeSetup } from "../../src/source/index.js";

function renderAll(input: unknown) {
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

  return Object.fromEntries(renderDocuments(graph.data, plan.data).map((document) => [document.id, document.markdown]));
}

describe("extended surface renderers", () => {
  it("renders standards, gates, references, how-to, and coordination surfaces", () => {
    const rendered = renderAll({
      id: "render_extended",
      name: "Render Extended",
      reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check the packet.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Artifact 1", artifactClass: "required", runtimePath: "generated/ARTIFACT.md" }],
      references: [
        {
          id: "ref_1",
          referenceClass: "runtime_reference",
          name: "Poker KB",
          sourcePath: "technical_references/POKER_KB.md"
        }
      ],
      surfaces: [
        { id: "standard_surface", surfaceClass: "standard", runtimePath: "generated/STANDARD.md" },
        { id: "gate_surface", surfaceClass: "gate", runtimePath: "generated/GATE.md" },
        { id: "reference_surface", surfaceClass: "technical_reference", runtimePath: "generated/REFERENCE.md" },
        { id: "how_to_surface", surfaceClass: "how_to", runtimePath: "generated/HOW_TO.md" },
        { id: "coordination_surface", surfaceClass: "coordination", runtimePath: "generated/COORDINATION.md" }
      ],
      surfaceSections: [
        { id: "standard_section", surfaceId: "standard_surface", stableSlug: "rule", title: "Rule" },
        { id: "gate_section", surfaceId: "gate_surface", stableSlug: "criteria", title: "Criteria" },
        { id: "reference_section", surfaceId: "reference_surface", stableSlug: "source", title: "Source" },
        { id: "how_to_section", surfaceId: "how_to_surface", stableSlug: "steps", title: "Steps" },
        { id: "coordination_section", surfaceId: "coordination_surface", stableSlug: "handoff", title: "Handoff" }
      ],
      generatedTargets: [
        { id: "target_standard", path: "generated/STANDARD.md", sourceIds: ["artifact_1"], sectionId: "standard_section" },
        { id: "target_gate", path: "generated/GATE.md", sourceIds: ["gate_1"], sectionId: "gate_section" },
        { id: "target_reference", path: "generated/REFERENCE.md", sourceIds: ["ref_1"], sectionId: "reference_section" },
        { id: "target_how_to", path: "generated/HOW_TO.md", sourceIds: ["artifact_1"], sectionId: "how_to_section" },
        { id: "target_coordination", path: "generated/COORDINATION.md", sourceIds: ["artifact_1"], sectionId: "coordination_section" }
      ],
      links: [
        { id: "documents_standard", kind: "documents", from: "standard_section", to: "artifact_1" },
        { id: "documents_gate", kind: "documents", from: "gate_surface", to: "gate_1" },
        { id: "documents_gate_section", kind: "documents", from: "gate_section", to: "gate_1" },
        { id: "documents_reference", kind: "documents", from: "reference_surface", to: "ref_1" },
        { id: "documents_reference_section", kind: "documents", from: "reference_section", to: "ref_1" },
        { id: "documents_how_to", kind: "documents", from: "how_to_section", to: "artifact_1" },
        { id: "documents_coordination", kind: "documents", from: "coordination_section", to: "artifact_1" }
      ]
    });

    expect(rendered).toMatchInlineSnapshot(`
      {
        "coordination_surface": "# Coordination

      This coordination document records shared execution expectations.

      <a id="handoff"></a>
      ## Handoff

      Artifact class: required.

      - Runtime path: generated/ARTIFACT.md
      - Conceptual only: no
      - Compatibility only: no
      ",
        "gate_surface": "# Gate: Gate 1

      This gate document records review and acceptance checks.

      <a id="criteria"></a>
      ## Criteria

      Check the packet.

      - Checks: artifact_1
      - Reads: none
      ",
        "how_to_surface": "# How To

      This how-to document explains a repeatable operational procedure.

      <a id="steps"></a>
      ## Steps

      Artifact class: required.

      - Runtime path: generated/ARTIFACT.md
      - Conceptual only: no
      - Compatibility only: no
      ",
        "reference_surface": "# Technical Reference: Poker KB

      This technical reference captures support material that shapes implementation.

      <a id="source"></a>
      ## Source

      Reference class: runtime_reference.

      - Source path: technical_references/POKER_KB.md
      - URL: none
      ",
        "standard_surface": "# Standard

      This standard document records reusable doctrine rules.

      <a id="rule"></a>
      ## Rule

      Artifact class: required.

      - Runtime path: generated/ARTIFACT.md
      - Conceptual only: no
      - Compatibility only: no
      ",
      }
    `);
  });
});
