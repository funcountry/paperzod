import { describe, expect, it } from "vitest";

import { validateSetup } from "../../src/index.js";
import editorialSetup from "../../setups/editorial/index.ts";

describe("editorial_full source model", () => {
  it("represents the full Editorial requirement shape without hacks", () => {
    const result = validateSetup(editorialSetup);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      setup: result.data.setup,
      surfaceClasses: [...new Set(result.data.surfaces.map((surface) => surface.surfaceClass))].sort(),
      packetContracts: result.data.packetContracts.map((contract) => ({
        id: contract.id,
        conceptualArtifactIds: contract.conceptualArtifactIds,
        runtimeArtifactIds: contract.runtimeArtifactIds ?? []
      })),
      references: result.data.references.map((reference) => ({
        id: reference.id,
        referenceClass: reference.referenceClass,
        sourcePath: reference.sourcePath ?? null
      })),
      keySections: result.data.surfaceSections
        .filter((section) =>
          ["Read First", "Role Contract", "Comment Shape", "Specialist Turn Shape", "What This Lane Must Do", "What the critic judges"].includes(
            section.title
          )
        )
        .map((section) => section.title)
        .sort()
    }).toMatchSnapshot();
  });
});
