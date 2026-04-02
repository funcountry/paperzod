import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import lessonsVerticalSliceSeed from "../fixtures/source/lessons-vertical-slice.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

describe("lessons_vertical_slice e2e", () => {
  it("compiles a real Lessons-shaped vertical slice with stable paths and sections", () => {
    const result = compile(lessonsVerticalSliceSeed);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      manifest: result.data.manifest,
      exactDependencies: {
        roleReads: result.data.graph.indexes.readSectionIdsByReaderId.section_dossier_engineer,
        stepReads: result.data.graph.indexes.readSectionIdsByReaderId.section_dossier_step,
        gateChecks: result.data.graph.indexes.checkedNodeIdsByCheckerId.lessons_acceptance_critic_gate,
        sectionOwners: {
          role_contract: result.data.graph.indexes.ownerIdsByNodeId.role_contract,
          workflow_lane_contract: result.data.graph.indexes.ownerIdsByNodeId.workflow_lane_contract,
          gate_what_critic_judges: result.data.graph.indexes.ownerIdsByNodeId.gate_what_critic_judges
        }
      },
      sections: result.data.plan.sections.map((section) => ({
        id: section.id,
        documentId: section.documentId,
        stableSlug: section.stableSlug,
        title: section.title,
        sourceIds: section.sourceIds
      })),
      rendered: result.data.documents.map((document) => ({
        id: document.id,
        path: document.path,
        markdown: document.markdown
      }))
    }).toMatchInlineSnapshot(`
      {
        "exactDependencies": {
          "gateChecks": [
            "section_dossier_packet",
            "workflow_lane_contract",
          ],
          "roleReads": [
            "standard_comment_shape",
          ],
          "sectionOwners": {
            "gate_what_critic_judges": [
              "lessons_acceptance_critic_gate",
            ],
            "role_contract": [
              "section_dossier_engineer",
            ],
            "workflow_lane_contract": [
              "section_dossier_step",
            ],
          },
          "stepReads": [
            "standard_specialist_turn_shape",
          ],
        },
        "manifest": {
          "adapterName": "paperclip_markdown",
          "documentPaths": {
            "acceptance_critic_gate_surface": "/repo/paperclip_agents/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
            "dossier_role_home": "/repo/paperclip_agents/project_homes/lessons/roles/section_dossier_engineer/AGENTS.md",
            "lessons_readme": "/repo/paperclip_agents/project_homes/lessons/shared/README.md",
            "packet_shapes_standard": "/repo/paperclip_agents/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
            "section_dossier_workflow": "/repo/paperclip_agents/project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
          },
          "outputRoot": "paperclip_agents",
          "repoRoot": "/repo",
        },
        "rendered": [
          {
            "id": "dossier_role_home",
            "markdown": "# Role Home: Section Dossier Engineer

      This role-home document states the contract for one runtime role.

      <a id="read-first"></a>
      ## Read First

      Own the section dossier lane and produce the section dossier packet.

      - Boundary: Do not reteach downstream lesson flow.
      - Boundary: Do not rename locked section concepts in later lanes.
      - Reads: standard_comment_shape

      <a id="role-contract"></a>
      ## Role Contract

      Own the section dossier lane and produce the section dossier packet.

      - Boundary: Do not reteach downstream lesson flow.
      - Boundary: Do not rename locked section concepts in later lanes.
      - Reads: standard_comment_shape
      ",
            "path": "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md",
          },
          {
            "id": "acceptance_critic_gate_surface",
            "markdown": "# Gate: Lessons Acceptance Critic

      This gate document records review and acceptance checks.

      <a id="what-the-critic-judges"></a>
      ## What the critic judges

      Judge whether the dossier lane proved the section burden and handed off a trustworthy packet.

      - Checks: section_dossier_packet, workflow_lane_contract
      - Reads: none
      ",
            "path": "project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
          },
          {
            "id": "packet_shapes_standard",
            "markdown": "# Standard

      This standard document records reusable doctrine rules.

      <a id="comment-shape"></a>
      ## Comment Shape

      Artifact class: reference.

      - Runtime path: none
      - Conceptual only: no
      - Compatibility only: no

      <a id="specialist-turn-shape"></a>
      ## Specialist Turn Shape

      Artifact class: reference.

      - Runtime path: none
      - Conceptual only: no
      - Compatibility only: no
      ",
            "path": "project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
          },
          {
            "id": "section_dossier_workflow",
            "markdown": "# Packet Workflow: Section Dossier

      This packet workflow document describes the trusted packet contract.

      <a id="what-this-lane-must-do"></a>
      ## What This Lane Must Do

      Define what the section teaches, what it does not teach, and the evidence behind those calls.

      - Role: section_dossier_engineer
      - Reads: standard_specialist_turn_shape
      - Required inputs: none
      - Support inputs: lessons_simple_clear_ref
      - Interim artifacts: none
      - Required outputs: section_dossier_packet
      - Stop line: Stop once the section dossier packet is coherent enough for the critic to judge.
      - Next gate: lessons_acceptance_critic_gate
      ",
            "path": "project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
          },
          {
            "id": "lessons_readme",
            "markdown": "# Shared Entrypoint

      This shared entrypoint introduces the setup-wide doctrine surface.

      <a id="read-order"></a>
      ## Read Order

      Define what the section teaches, what it does not teach, and the evidence behind those calls.

      - Role: section_dossier_engineer
      - Reads: standard_specialist_turn_shape
      - Required inputs: none
      - Support inputs: lessons_simple_clear_ref
      - Interim artifacts: none
      - Required outputs: section_dossier_packet
      - Stop line: Stop once the section dossier packet is coherent enough for the critic to judge.
      - Next gate: lessons_acceptance_critic_gate
      ",
            "path": "project_homes/lessons/shared/README.md",
          },
        ],
        "sections": [
          {
            "documentId": "acceptance_critic_gate_surface",
            "id": "gate_what_critic_judges",
            "sourceIds": [
              "gate_what_critic_judges",
              "lessons_acceptance_critic_gate",
            ],
            "stableSlug": "what-the-critic-judges",
            "title": "What the critic judges",
          },
          {
            "documentId": "dossier_role_home",
            "id": "role_read_first",
            "sourceIds": [
              "role_read_first",
              "section_dossier_engineer",
            ],
            "stableSlug": "read-first",
            "title": "Read First",
          },
          {
            "documentId": "dossier_role_home",
            "id": "role_contract",
            "sourceIds": [
              "role_contract",
              "section_dossier_engineer",
            ],
            "stableSlug": "role-contract",
            "title": "Role Contract",
          },
          {
            "documentId": "lessons_readme",
            "id": "shared_read_order",
            "sourceIds": [
              "section_dossier_step",
              "shared_read_order",
            ],
            "stableSlug": "read-order",
            "title": "Read Order",
          },
          {
            "documentId": "packet_shapes_standard",
            "id": "standard_comment_shape",
            "sourceIds": [
              "comment_shape_standard",
              "standard_comment_shape",
            ],
            "stableSlug": "comment-shape",
            "title": "Comment Shape",
          },
          {
            "documentId": "packet_shapes_standard",
            "id": "standard_specialist_turn_shape",
            "sourceIds": [
              "specialist_turn_shape_standard",
              "standard_specialist_turn_shape",
            ],
            "stableSlug": "specialist-turn-shape",
            "title": "Specialist Turn Shape",
          },
          {
            "documentId": "section_dossier_workflow",
            "id": "workflow_lane_contract",
            "sourceIds": [
              "section_dossier_step",
              "workflow_lane_contract",
            ],
            "stableSlug": "what-this-lane-must-do",
            "title": "What This Lane Must Do",
          },
        ],
      }
    `);
  });

  it("keeps section identity stable when a Lessons section title is renamed", () => {
    const original = compile(lessonsVerticalSliceSeed);
    const renamed = compile({
      ...lessonsVerticalSliceSeed,
      surfaceSections: lessonsVerticalSliceSeed.surfaceSections.map((section) =>
        section.id === "standard_comment_shape" ? { ...section, title: "Comment Pattern" } : section
      )
    });

    expect(original.success).toBe(true);
    expect(renamed.success).toBe(true);
    if (!original.success || !renamed.success) {
      return;
    }

    expect(original.data.manifest).toEqual(renamed.data.manifest);

    const originalStandard = original.data.documents.find((document) => document.id === "packet_shapes_standard")?.markdown;
    const renamedStandard = renamed.data.documents.find((document) => document.id === "packet_shapes_standard")?.markdown;
    const originalRoleHome = original.data.documents.find((document) => document.id === "dossier_role_home")?.markdown;
    const renamedRoleHome = renamed.data.documents.find((document) => document.id === "dossier_role_home")?.markdown;

    expect(originalStandard).toContain("## Comment Shape");
    expect(renamedStandard).toContain("## Comment Pattern");
    expect(originalRoleHome).toBe(renamedRoleHome);
  });
});
