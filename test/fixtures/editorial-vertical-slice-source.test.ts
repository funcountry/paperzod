import { describe, expect, it } from "vitest";

import { normalizeSetup } from "../../src/index.js";
import editorialVerticalSliceSeed from "../fixtures/source/editorial-vertical-slice.js";

describe("editorial_vertical_slice source model", () => {
  it("models the required Editorial surface families and exact sections honestly", () => {
    const result = normalizeSetup(editorialVerticalSliceSeed);
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
          "description": "A narrow proving slice for the editorial doctrine shape.",
          "id": "editorial_vertical_slice",
          "kind": "setup",
          "name": "Editorial Vertical Slice",
        },
        "surfaceClasses": [
          "role_home",
          "shared_entrypoint",
          "packet_workflow",
          "standard",
          "gate",
        ],
        "surfacePaths": [
          "paperclip_home/agents/brief_researcher/AGENTS.md",
          "paperclip_home/project_homes/editorial/shared/README.md",
          "paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md",
          "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md",
          "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md",
        ],
      }
    `);
  });
});
