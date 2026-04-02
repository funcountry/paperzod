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

describe("role-home and shared renderers", () => {
  it("renders a readable role-home document", () => {
    const markdown = renderDocument(
      {
        id: "render_role_home",
        name: "Render Role Home",
        roles: [
          {
            id: "author",
            name: "Author",
            purpose: "Create the packet.",
            boundaries: ["Do not skip the stop line.", "Do not rewrite shared doctrine."]
          }
        ],
        surfaces: [{ id: "author_home", surfaceClass: "role_home", runtimePath: "generated/roles/author/AGENTS.md" }],
        surfaceSections: [{ id: "read_first", surfaceId: "author_home", stableSlug: "read-first", title: "Read First" }],
        generatedTargets: [{ id: "target_1", path: "generated/roles/author/AGENTS.md", sourceIds: ["author"], sectionId: "read_first" }],
        links: [
          { id: "documents_surface_role", kind: "documents", from: "author_home", to: "author" },
          { id: "documents_section_role", kind: "documents", from: "read_first", to: "author" }
        ]
      },
      "author_home"
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# Role Home: Author

      This role-home document states the contract for one runtime role.

      <a id="read-first"></a>
      ## Read First

      Create the packet.

      - Boundary: Do not skip the stop line.
      - Boundary: Do not rewrite shared doctrine.
      - Reads: none
      "
    `);
  });

  it("renders a readable shared entrypoint document", () => {
    const markdown = renderDocument(
      {
        id: "render_shared",
        name: "Render Shared",
        roles: [{ id: "author", name: "Author", purpose: "Draft the packet." }],
        workflowSteps: [
          {
            id: "draft_packet",
            roleId: "author",
            purpose: "Draft the first packet.",
            requiredInputIds: [],
            requiredOutputIds: ["packet_v1"],
            stopLine: "Stop once the first draft exists.",
            nextGateId: "gate_1"
          }
        ],
        reviewGates: [{ id: "gate_1", name: "Gate 1", purpose: "Check the draft.", checkIds: ["packet_v1"] }],
        artifacts: [{ id: "packet_v1", name: "PACKET_V1.md", artifactClass: "required" }],
        surfaces: [{ id: "shared_readme", surfaceClass: "shared_entrypoint", runtimePath: "generated/shared/README.md" }],
        surfaceSections: [{ id: "default_order", surfaceId: "shared_readme", stableSlug: "default-order", title: "Default Order" }],
        generatedTargets: [{ id: "target_1", path: "generated/shared/README.md", sourceIds: ["draft_packet"], sectionId: "default_order" }],
        links: [{ id: "documents_step", kind: "documents", from: "default_order", to: "draft_packet" }]
      },
      "shared_readme"
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# Shared Entrypoint

      This shared entrypoint introduces the setup-wide doctrine surface.

      <a id="default-order"></a>
      ## Default Order

      Draft the first packet.

      - Role: author
      - Reads: none
      - Required inputs: none
      - Support inputs: none
      - Interim artifacts: none
      - Required outputs: packet_v1
      - Stop line: Stop once the first draft exists.
      - Next gate: gate_1
      "
    `);
  });
});
