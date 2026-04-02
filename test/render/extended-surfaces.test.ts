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
      reviewGates: [{ id: "gate_1", name: "Lessons Acceptance Critic", purpose: "Check the packet.", checkIds: ["artifact_1"] }],
      artifacts: [{ id: "artifact_1", name: "Packet Shape Standard", artifactClass: "reference" }],
      references: [
        {
          id: "ref_1",
          referenceClass: "runtime_reference",
          name: "Poker KB",
          sourcePath: "paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md"
        },
        {
          id: "ref_2",
          referenceClass: "support_reference",
          name: "Lessons GitHub Access Protocol",
          sourcePath: "paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md"
        },
        {
          id: "ref_3",
          referenceClass: "support_reference",
          name: "Lessons PSMobile Bootstrap",
          sourcePath: "paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md"
        }
      ],
      surfaces: [
        {
          id: "standard_surface",
          surfaceClass: "standard",
          runtimePath: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md"
        },
        {
          id: "gate_surface",
          surfaceClass: "gate",
          runtimePath: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md"
        },
        {
          id: "reference_surface",
          surfaceClass: "technical_reference",
          runtimePath: "paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md"
        },
        {
          id: "how_to_surface",
          surfaceClass: "how_to",
          runtimePath: "paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md"
        },
        {
          id: "coordination_surface",
          surfaceClass: "coordination",
          runtimePath: "paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md"
        }
      ],
      surfaceSections: [
        { id: "standard_section", surfaceId: "standard_surface", stableSlug: "packet-shape", title: "Packet Shape" },
        { id: "gate_section", surfaceId: "gate_surface", stableSlug: "what-the-critic-judges", title: "What the critic judges" },
        { id: "reference_section", surfaceId: "reference_surface", stableSlug: "poker-kb", title: "Poker KB" },
        { id: "how_to_section", surfaceId: "how_to_surface", stableSlug: "github-access", title: "GitHub Access" },
        { id: "coordination_section", surfaceId: "coordination_surface", stableSlug: "bootstrap", title: "Bootstrap" }
      ],
      generatedTargets: [
        {
          id: "target_standard",
          path: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
          sourceIds: ["artifact_1"],
          sectionId: "standard_section"
        },
        {
          id: "target_gate",
          path: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
          sourceIds: ["gate_1"],
          sectionId: "gate_section"
        },
        {
          id: "target_reference",
          path: "paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md",
          sourceIds: ["ref_1"],
          sectionId: "reference_section"
        },
        {
          id: "target_how_to",
          path: "paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md",
          sourceIds: ["ref_2"],
          sectionId: "how_to_section"
        },
        {
          id: "target_coordination",
          path: "paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md",
          sourceIds: ["ref_3"],
          sectionId: "coordination_section"
        }
      ],
      links: [
        { id: "documents_standard", kind: "documents", from: "standard_section", to: "artifact_1" },
        { id: "documents_gate", kind: "documents", from: "gate_surface", to: "gate_1" },
        { id: "documents_gate_section", kind: "documents", from: "gate_section", to: "gate_1" },
        { id: "documents_reference", kind: "documents", from: "reference_surface", to: "ref_1" },
        { id: "documents_reference_section", kind: "documents", from: "reference_section", to: "ref_1" },
        { id: "documents_how_to", kind: "documents", from: "how_to_section", to: "ref_2" },
        { id: "documents_coordination", kind: "documents", from: "coordination_section", to: "ref_3" }
      ]
    });

    for (const markdown of Object.values(rendered)) {
      expect(markdown).not.toContain("Artifact class:");
      expect(markdown).not.toContain("Reference class:");
      expect(markdown).not.toContain("Conceptual only:");
      expect(markdown).not.toContain("Compatibility only:");
    }

    expect(rendered).toMatchInlineSnapshot(`
      {
        "coordination_surface": "# Lessons PSMobile Bootstrap

      This file owns attached-checkout startup and runtime handling.

      <a id="bootstrap"></a>
      ## Bootstrap

      Use this guide when the current task depends on \`Lessons PSMobile Bootstrap\`.

      - Coordination source: \`paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md\`.
      ",
        "gate_surface": "# Lessons Acceptance Critic Criteria

      This file owns what Lessons Acceptance Critic checks before work moves on.

      Use it with the governing workflow and quality-bar surfaces for this gate.

      <a id="what-the-critic-judges"></a>
      ## What the critic judges

      Check the packet.

      - Checks that must pass: Packet Shape Standard
      - Read before acting: none
      ",
        "how_to_surface": "# Lessons GitHub Access Protocol

      This file is the shared GitHub access guide for the Lessons project.

      <a id="github-access"></a>
      ## GitHub Access

      Use this guide when the current task depends on \`Lessons GitHub Access Protocol\`.

      - Procedure source: \`paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md\`.
      ",
        "reference_surface": "# Poker KB

      This file owns the Lessons-local PokerKB runner path, URL routing, query discipline, and example commands.

      Use it when the current task needs repo-owned PokerKB runner or query discipline guidance.

      <a id="poker-kb"></a>
      ## Poker KB

      Use this section when the current task needs the local PokerKB runner or query-discipline guidance.

      - Reference source: \`paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md\`.
      ",
        "standard_surface": "# Lessons Packet Shapes

      This file owns the packet families used to start Lessons work.

      Use it to answer one question: what packet shape should I create for this job?

      <a id="packet-shape"></a>
      ## Packet Shape

      Use this section when the current job needs the canonical packet-shape rule.

      - Current standard source: \`Packet Shape Standard\`.
      ",
      }
    `);
  });
});
