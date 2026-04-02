import { describe, expect, it } from "vitest";

import { normalizeSetup } from "../../src/index.js";
import lessonsVerticalSliceSeed from "../fixtures/source/lessons-vertical-slice.js";

describe("lessons_vertical_slice source model", () => {
  it("models the required Lessons surface families and exact sections honestly", () => {
    const result = normalizeSetup(lessonsVerticalSliceSeed);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      setup: result.data.setup,
      surfaceClasses: result.data.surfaces.map((surface) => surface.surfaceClass),
      surfacePaths: result.data.surfaces.map((surface) => surface.runtimePath),
      sectionTitles: result.data.surfaceSections.map((section) => section.title),
      referenceClasses: result.data.references.map((reference) => reference.referenceClass)
    }).toMatchInlineSnapshot(`
      {
        "referenceClasses": [
          "imported_reference",
        ],
        "sectionTitles": [
          "Read First",
          "Role Contract",
          "Read Order",
          "What This Lane Must Do",
          "Comment Shape",
          "Specialist Turn Shape",
          "What the critic judges",
        ],
        "setup": {
          "description": "A narrow proving slice for the Lessons doctrine shape.",
          "id": "lessons_vertical_slice",
          "kind": "setup",
          "name": "Lessons Vertical Slice",
        },
        "surfaceClasses": [
          "role_home",
          "shared_entrypoint",
          "packet_workflow",
          "standard",
          "gate",
        ],
        "surfacePaths": [
          "paperclip_home/agents/section_dossier_engineer/AGENTS.md",
          "paperclip_home/project_homes/lessons/shared/README.md",
          "paperclip_home/project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
          "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
          "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
        ],
      }
    `);
  });
});
