import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import editorialVerticalSliceSeed from "../fixtures/source/editorial-vertical-slice.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "."
    })
  );
}

describe("editorial_vertical_slice e2e", () => {
  it("compiles a real Editorial-shaped vertical slice with stable paths and sections", () => {
    const result = compile(editorialVerticalSliceSeed);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      manifest: result.data.manifest,
      exactDependencies: {
        roleReads: result.data.graph.indexes.readSectionIdsByReaderId.brief_researcher,
        stepReads: result.data.graph.indexes.readSectionIdsByReaderId.brief_research_step,
        gateChecks: result.data.graph.indexes.checkedNodeIdsByCheckerId.editorial_acceptance_gate,
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
            "editorial_brief_packet",
            "workflow_lane_contract",
          ],
          "roleReads": [
            "standard_comment_shape",
          ],
          "sectionOwners": {
            "gate_what_critic_judges": [
              "editorial_acceptance_gate",
            ],
            "role_contract": [
              "brief_researcher",
            ],
            "workflow_lane_contract": [
              "brief_research_step",
            ],
          },
          "stepReads": [
            "standard_specialist_turn_shape",
          ],
        },
        "manifest": {
          "adapterName": "paperclip_markdown",
          "documentPaths": {
            "acceptance_critic_gate_surface": "/repo/paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md",
            "brief_researcher_home": "/repo/paperclip_home/agents/brief_researcher/AGENTS.md",
            "brief_researcher_workflow": "/repo/paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md",
            "editorial_readme": "/repo/paperclip_home/project_homes/editorial/shared/README.md",
            "packet_shapes_standard": "/repo/paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md",
          },
          "outputRoot": ".",
          "ownedScopes": [],
          "repoRoot": "/repo",
        },
        "rendered": [
          {
            "id": "brief_researcher_home",
            "markdown": "# Brief Researcher

      Core job: Own the editorial brief lane and produce the editorial brief packet.

      <a id="read-first"></a>
      ## Read First

      Read these shared doctrine surfaces before taking a turn.

      - Read \`Comment Shape\`.

      <a id="role-contract"></a>
      ## Role Contract

      - Do not prewrite downstream story structure.
      - Do not rename locked editorial concepts in later lanes.
      ",
            "path": "paperclip_home/agents/brief_researcher/AGENTS.md",
          },
          {
            "id": "editorial_readme",
            "markdown": "# Shared Entrypoint

      This shared entrypoint introduces the setup-wide doctrine surface.

      <a id="read-order"></a>
      ## Read Order

      Define what the section teaches, what it does not teach, and the evidence behind those calls.

      - Current owner: Brief Researcher
      - Read before acting: Specialist Turn Shape
      - Required inputs: none
      - Support inputs: Editorial Workflow Simple Clear
      - Interim artifacts: none
      - Outputs the next owner may trust: EDITORIAL_BRIEF.md
      - Stop line: Stop once the editorial brief packet is coherent enough for the quality gate to judge.
      - Hand off to gate: Editorial Acceptance Gate
      ",
            "path": "paperclip_home/project_homes/editorial/shared/README.md",
          },
          {
            "id": "brief_researcher_workflow",
            "markdown": "# Brief Researcher Workflow

      This file defines the shared workflow for the Brief Researcher lane.

      It does not define handoff mechanics, the shared packet file rules, or critic verdicts.

      <a id="what-this-lane-must-do"></a>
      ## What This Lane Must Do

      Use this section as the lane contract for the \`Editorial Brief\` packet.

      Define what the section teaches, what it does not teach, and the evidence behind those calls.

      - Current owner: Brief Researcher
      - Read before acting: Specialist Turn Shape
      - Required inputs: none
      - Support inputs: Editorial Workflow Simple Clear
      - Interim artifacts: none
      - Outputs the next owner may trust: EDITORIAL_BRIEF.md
      - Stop line: Stop once the editorial brief packet is coherent enough for the quality gate to judge.
      - Hand off to gate: Editorial Acceptance Gate
      ",
            "path": "paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md",
          },
          {
            "id": "packet_shapes_standard",
            "markdown": "# Editorial Packet Shapes

      This file records the shared standard for Editorial Packet Shapes.

      <a id="comment-shape"></a>
      ## Comment Shape

      Use this section as the shared standard for \`Comment Shape Standard\`.

      - Current standard source: \`Comment Shape Standard\`.

      <a id="specialist-turn-shape"></a>
      ## Specialist Turn Shape

      Use this section as the shared standard for \`Specialist Turn Shape Standard\`.

      - Current standard source: \`Specialist Turn Shape Standard\`.
      ",
            "path": "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md",
          },
          {
            "id": "acceptance_critic_gate_surface",
            "markdown": "# Editorial Acceptance Gate

      This file owns what Editorial Acceptance Gate checks before work moves on.

      Use it with the governing workflow and any supporting standards for this gate.

      <a id="what-the-critic-judges"></a>
      ## What the critic judges

      Judge whether the brief lane proved the content burden and handed off a trustworthy packet.

      - Checks that must pass: EDITORIAL_BRIEF.md, What This Lane Must Do
      - Read before acting: none
      ",
            "path": "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md",
          },
        ],
        "sections": [
          {
            "documentId": "brief_researcher_home",
            "id": "role_read_first",
            "sourceIds": [
              "brief_researcher",
              "role_read_first",
            ],
            "stableSlug": "read-first",
            "title": "Read First",
          },
          {
            "documentId": "brief_researcher_home",
            "id": "role_contract",
            "sourceIds": [
              "brief_researcher",
              "role_contract",
            ],
            "stableSlug": "role-contract",
            "title": "Role Contract",
          },
          {
            "documentId": "editorial_readme",
            "id": "shared_read_order",
            "sourceIds": [
              "brief_research_step",
              "shared_read_order",
            ],
            "stableSlug": "read-order",
            "title": "Read Order",
          },
          {
            "documentId": "brief_researcher_workflow",
            "id": "workflow_lane_contract",
            "sourceIds": [
              "brief_research_step",
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
              "editorial_acceptance_gate",
              "gate_what_critic_judges",
            ],
            "stableSlug": "what-the-critic-judges",
            "title": "What the critic judges",
          },
        ],
      }
    `);
  });

  it("keeps section identity stable when a Editorial section title is renamed", () => {
    const original = compile(editorialVerticalSliceSeed);
    const renamed = compile({
      ...editorialVerticalSliceSeed,
      surfaceSections: editorialVerticalSliceSeed.surfaceSections.map((section) =>
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
    const originalRoleHome = original.data.documents.find((document) => document.id === "brief_researcher_home")?.markdown;
    const renamedRoleHome = renamed.data.documents.find((document) => document.id === "brief_researcher_home")?.markdown;

    expect(originalStandard).toContain("## Comment Shape");
    expect(renamedStandard).toContain("## Comment Pattern");
    expect(originalRoleHome).toBe(renamedRoleHome);
  });
});
