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
            "acceptance_critic_gate_surface": "/repo/paperclip_agents/paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
            "dossier_role_home": "/repo/paperclip_agents/paperclip_home/agents/section_dossier_engineer/AGENTS.md",
            "lessons_readme": "/repo/paperclip_agents/paperclip_home/project_homes/lessons/shared/README.md",
            "packet_shapes_standard": "/repo/paperclip_agents/paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
            "section_dossier_workflow": "/repo/paperclip_agents/paperclip_home/project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
          },
          "outputRoot": "paperclip_agents",
          "repoRoot": "/repo",
        },
        "rendered": [
          {
            "id": "dossier_role_home",
            "markdown": "# Section Dossier Engineer

      You are the Section Dossier Engineer.

      Your repo-owned role home is \`paperclip_home/agents/section_dossier_engineer/AGENTS.md\`.

      <a id="read-first"></a>
      ## Read First

      Read these shared doctrine surfaces before taking a turn.

      - Read \`Comment Shape\`.

      <a id="role-contract"></a>
      ## Role Contract

      Own the section dossier lane and produce the section dossier packet.

      - Do not reteach downstream lesson flow.
      - Do not rename locked section concepts in later lanes.
      ",
            "path": "paperclip_home/agents/section_dossier_engineer/AGENTS.md",
          },
          {
            "id": "lessons_readme",
            "markdown": "# Lessons Shared Doctrine

      This folder is the live shared doctrine home for the Lessons project.

      Start here, then open the one surface that owns your current question.

      <a id="read-order"></a>
      ## Read Order

      Define what the section teaches, what it does not teach, and the evidence behind those calls.

      - Current owner: Section Dossier Engineer
      - Read before acting: Specialist Turn Shape
      - Required inputs: none
      - Support inputs: Lessons Workflow Simple Clear
      - Interim artifacts: none
      - Outputs the next owner may trust: SECTION_DOSSIER.md
      - Stop line: Stop once the section dossier packet is coherent enough for the critic to judge.
      - Hand off to gate: Lessons Acceptance Critic
      ",
            "path": "paperclip_home/project_homes/lessons/shared/README.md",
          },
          {
            "id": "section_dossier_workflow",
            "markdown": "# Section Dossier Engineer Workflow

      This file defines the shared workflow for the Section Dossier Engineer lane.

      It does not define handoff mechanics, the shared packet file rules, or critic verdicts.

      <a id="what-this-lane-must-do"></a>
      ## What This Lane Must Do

      Use this section as the lane contract for the \`Section Dossier\` packet.

      Define what the section teaches, what it does not teach, and the evidence behind those calls.

      - Current owner: Section Dossier Engineer
      - Read before acting: Specialist Turn Shape
      - Required inputs: none
      - Support inputs: Lessons Workflow Simple Clear
      - Interim artifacts: none
      - Outputs the next owner may trust: SECTION_DOSSIER.md
      - Stop line: Stop once the section dossier packet is coherent enough for the critic to judge.
      - Hand off to gate: Lessons Acceptance Critic
      ",
            "path": "paperclip_home/project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
          },
          {
            "id": "packet_shapes_standard",
            "markdown": "# Lessons Packet Shapes

      This file owns the packet families used to start Lessons work.

      Use it to answer one question: what packet shape should I create for this job?

      <a id="comment-shape"></a>
      ## Comment Shape

      Use this section as the shared standard for \`Comment Shape Standard\`.

      - Current standard source: \`Comment Shape Standard\`.

      <a id="specialist-turn-shape"></a>
      ## Specialist Turn Shape

      Use this section as the shared standard for \`Specialist Turn Shape Standard\`.

      - Current standard source: \`Specialist Turn Shape Standard\`.
      ",
            "path": "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
          },
          {
            "id": "acceptance_critic_gate_surface",
            "markdown": "# Lessons Acceptance Critic Criteria

      This file owns what Lessons Acceptance Critic checks before work moves on.

      Use it with the governing workflow and quality-bar surfaces for this gate.

      <a id="what-the-critic-judges"></a>
      ## What the critic judges

      Judge whether the dossier lane proved the section burden and handed off a trustworthy packet.

      - Checks that must pass: SECTION_DOSSIER.md, What This Lane Must Do
      - Read before acting: none
      ",
            "path": "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
          },
        ],
        "sections": [
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
            "documentId": "section_dossier_workflow",
            "id": "workflow_lane_contract",
            "sourceIds": [
              "section_dossier_step",
              "workflow_lane_contract",
            ],
            "stableSlug": "what-this-lane-must-do",
            "title": "What This Lane Must Do",
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
            "documentId": "acceptance_critic_gate_surface",
            "id": "gate_what_critic_judges",
            "sourceIds": [
              "gate_what_critic_judges",
              "lessons_acceptance_critic_gate",
            ],
            "stableSlug": "what-the-critic-judges",
            "title": "What the critic judges",
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
