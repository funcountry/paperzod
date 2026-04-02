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
        surfaceSections: [
          { id: "read_first", surfaceId: "author_home", stableSlug: "read-first", title: "Read First" },
          { id: "role_contract", surfaceId: "author_home", stableSlug: "role-contract", title: "Role Contract" }
        ],
        generatedTargets: [
          { id: "target_1", path: "generated/roles/author/AGENTS.md", sourceIds: ["author"], sectionId: "read_first" },
          { id: "target_2", path: "generated/roles/author/AGENTS.md", sourceIds: ["author"], sectionId: "role_contract" }
        ],
        links: [
          { id: "documents_surface_role", kind: "documents", from: "author_home", to: "author" },
          { id: "documents_read_first_role", kind: "documents", from: "read_first", to: "author" },
          { id: "documents_role_contract_role", kind: "documents", from: "role_contract", to: "author" }
        ]
      },
      "author_home"
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# Author

      You are the Author.

      Your repo-owned role home is \`generated/roles/author/AGENTS.md\`.

      <a id="read-first"></a>
      ## Read First

      Read these shared doctrine surfaces before taking a turn.

      - No additional shared doctrine reads are declared yet.

      <a id="role-contract"></a>
      ## Role Contract

      Create the packet.

      - Do not skip the stop line.
      - Do not rewrite shared doctrine.
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

      - Current owner: Author
      - Read before acting: none
      - Required inputs: none
      - Support inputs: none
      - Interim artifacts: none
      - Outputs the next owner may trust: PACKET_V1.md
      - Stop line: Stop once the first draft exists.
      - Hand off to gate: Gate 1
      "
    `);
  });

  it("renders a project-home root document with a doctrine map", () => {
    const markdown = renderDocument(
      {
        id: "render_project_home",
        name: "Render Project Home",
        roles: [{ id: "project_lead", name: "Project Lead", purpose: "Route the work." }],
        workflowSteps: [
          {
            id: "route_work",
            roleId: "project_lead",
            purpose: "Route the work to the right owner.",
            requiredInputIds: [],
            requiredOutputIds: ["packet_v1"],
            stopLine: "Stop once the next owner is obvious.",
            nextStepId: "route_followthrough"
          },
          {
            id: "route_followthrough",
            roleId: "project_lead",
            purpose: "Handle followthrough.",
            requiredInputIds: ["packet_v1"],
            requiredOutputIds: ["packet_v2"],
            stopLine: "Stop once followthrough is complete."
          }
        ],
        artifacts: [
          { id: "packet_v1", name: "PACKET_V1.md", artifactClass: "required" },
          { id: "packet_v2", name: "PACKET_V2.md", artifactClass: "required" }
        ],
        surfaces: [
          {
            id: "project_home_root",
            surfaceClass: "project_home_root",
            runtimePath: "paperclip_home/project_homes/lessons/README.md"
          },
          {
            id: "shared_readme",
            surfaceClass: "shared_entrypoint",
            runtimePath: "paperclip_home/project_homes/lessons/shared/README.md"
          },
          {
            id: "workflow_surface",
            surfaceClass: "workflow_owner",
            runtimePath: "paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md"
          },
          {
            id: "lead_home",
            surfaceClass: "role_home",
            runtimePath: "paperclip_home/agents/project_lead/AGENTS.md"
          }
        ],
        surfaceSections: [
          { id: "project_home_map", surfaceId: "project_home_root", stableSlug: "project-home-map", title: "Project Home Map" },
          { id: "shared_read_order", surfaceId: "shared_readme", stableSlug: "read-order", title: "Read Order" },
          { id: "owner_map", surfaceId: "workflow_surface", stableSlug: "owner-map", title: "Owner Map" },
          { id: "lead_read_first", surfaceId: "lead_home", stableSlug: "read-first", title: "Read First" },
          { id: "lead_role_contract", surfaceId: "lead_home", stableSlug: "role-contract", title: "Role Contract" }
        ],
        generatedTargets: [
          { id: "root_target", path: "paperclip_home/project_homes/lessons/README.md", sourceIds: ["route_work"], sectionId: "project_home_map" },
          { id: "shared_target", path: "paperclip_home/project_homes/lessons/shared/README.md", sourceIds: ["route_work"], sectionId: "shared_read_order" },
          {
            id: "workflow_target",
            path: "paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
            sourceIds: ["route_work"],
            sectionId: "owner_map"
          },
          { id: "home_read_target", path: "paperclip_home/agents/project_lead/AGENTS.md", sourceIds: ["project_lead"], sectionId: "lead_read_first" },
          {
            id: "home_contract_target",
            path: "paperclip_home/agents/project_lead/AGENTS.md",
            sourceIds: ["project_lead"],
            sectionId: "lead_role_contract"
          }
        ],
        links: [
          { id: "root_documents_step", kind: "documents", from: "project_home_map", to: "route_work" },
          { id: "shared_documents_step", kind: "documents", from: "shared_read_order", to: "route_work" },
          { id: "workflow_surface_documents_step", kind: "documents", from: "workflow_surface", to: "route_work" },
          { id: "workflow_section_documents_step", kind: "documents", from: "owner_map", to: "route_work" },
          { id: "home_documents_role", kind: "documents", from: "lead_home", to: "project_lead" },
          { id: "home_read_documents_role", kind: "documents", from: "lead_read_first", to: "project_lead" },
          { id: "home_contract_documents_role", kind: "documents", from: "lead_role_contract", to: "project_lead" }
        ]
      },
      "project_home_root"
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# Project Home

      This project-home root maps the runtime doctrine surface for one Paperclip project home.

      <a id="project-home-map"></a>
      ## Project Home Map

      Use this project home as the runtime doctrine map for this project.

      1. Start with \`paperclip_home/project_homes/lessons/shared/README.md\` for the shared doctrine entrypoint.
      2. Use \`paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md\` as the authoritative workflow owner for routing and handoff decisions.
      3. Use \`paperclip_home/agents/<role>/AGENTS.md\` for role-local guidance.
      "
    `);
  });
});
