import { describe, expect, it } from "vitest";

import sharedOverridesSeed from "../fixtures/source/shared-overrides.js";
import { normalizeSetup } from "../../src/source/normalize.js";

describe("shared overrides normalization", () => {
  it("preserves setup-local wording and compatibility mappings", () => {
    const alpha = normalizeSetup(sharedOverridesSeed.alpha);
    const beta = normalizeSetup(sharedOverridesSeed.beta);

    expect(alpha.success).toBe(true);
    expect(beta.success).toBe(true);

    if (!alpha.success || !beta.success) {
      return;
    }

    expect(alpha.data.roles[0]?.purpose).toBe("Reusable role.");
    expect(beta.data.roles[0]?.purpose).toBe("Reusable role with beta-local wording.");
    expect(beta.data.packetContracts[0]?.runtimeArtifactIds).toEqual(["beta_packet_runtime"]);
    expect(beta.data.artifacts[1]?.compatibilityOnly).toBe(true);
    expect(beta.data.artifacts[1]?.runtimePath).toBe("generated/beta/PACKET.md");
  });
});
