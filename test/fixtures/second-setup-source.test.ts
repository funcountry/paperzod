import { describe, expect, it } from "vitest";

import { normalizeSetup } from "../../src/index.js";
import secondSetupSeed from "../fixtures/source/second-setup.js";

describe("second_setup source model", () => {
  it("represents a non-Lessons setup with a different surface mix and path shape", () => {
    const result = normalizeSetup(secondSetupSeed);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      setup: result.data.setup,
      paths: result.data.surfaces.map((surface) => surface.runtimePath),
      surfaceClasses: [...new Set(result.data.surfaces.map((surface) => surface.surfaceClass))].sort(),
      rolePurposes: result.data.roles.map((role) => role.purpose)
    }).toMatchSnapshot();
  });
});
