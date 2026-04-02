import { describe, expect, it } from "vitest";

import { validateSetup } from "../../src/index.js";
import releaseOpsSetup from "../../setups/release_ops/index.ts";

describe("release_ops source model", () => {
  it("represents a non-editorial setup with a different surface mix and path shape", () => {
    const result = validateSetup(releaseOpsSetup);
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
