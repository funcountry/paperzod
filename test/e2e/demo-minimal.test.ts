import { describe, expect, it } from "vitest";

import { compileSetup, createTargetAdapter } from "../../src/index.js";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";

describe("demo_minimal e2e", () => {
  it("compiles end to end with stable plan, manifest, and markdown", () => {
    const result = compileSetup(
      demoMinimalSeed,
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "out"
      })
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      manifest: result.data.manifest,
      plan: {
        documents: result.data.plan.documents,
        sections: result.data.plan.sections
      },
      rendered: result.data.documents.map((document) => ({
        id: document.id,
        path: document.path,
        markdown: document.markdown
      }))
    }).toMatchInlineSnapshot(`
      {
        "manifest": {
          "adapterName": "test",
          "documentPaths": {
            "author_home": "/repo/out/generated/roles/author/AGENTS.md",
            "workflow_surface": "/repo/out/generated/WORKFLOW.md",
          },
          "outputRoot": "out",
          "repoRoot": "/repo",
        },
        "plan": {
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
        },
        "rendered": [
          {
            "id": "author_home",
            "markdown": "# Role Home: Author

      This role-home document states the contract for one runtime role.

      <a id="role-contract"></a>
      ## Role Contract

      Create the artifact.

      - Reads: none
      ",
            "path": "generated/roles/author/AGENTS.md",
          },
          {
            "id": "workflow_surface",
            "markdown": "# Workflow Owner

      This workflow owner document describes the operational turn order and stop lines.

      <a id="default-order"></a>
      ## Default Order

      Draft the first packet.

      - Role: author
      - Reads: none
      - Required inputs: none
      - Support inputs: research_notes
      - Interim artifacts: draft_notes
      - Required outputs: packet_v1
      - Stop line: Stop after the first packet draft is ready for review.
      - Next gate: critic_gate
      ",
            "path": "generated/WORKFLOW.md",
          },
        ],
      }
    `);
  });

  it("fails loudly on workflow drift", () => {
    const result = compileSetup(
      {
        ...demoMinimalSeed,
        workflowSteps: demoMinimalSeed.workflowSteps.map((step) => ({ ...step, nextGateId: undefined }))
      },
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "out"
      })
    );

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["check.workflow.missing_route"]);
  });
});
