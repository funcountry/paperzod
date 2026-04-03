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
    expect(alpha.data.catalogs.find((catalog) => catalog.kind === "command")?.entries.map((entry) => entry.id)).toEqual([
      "doctor",
      "alpha_doctor"
    ]);
    expect(beta.data.catalogs.find((catalog) => catalog.kind === "env_var")?.entries[0]?.display).toBe("BETA_SHARED_API_URL");
    expect(alpha.data.registries[0]?.entries.map((entry) => entry.id)).toEqual(["pass", "alpha_hold"]);
    expect(beta.data.registries[0]?.entries.map((entry) => entry.id)).toEqual(["pass", "beta_revise"]);
    expect(beta.data.packetContracts[0]?.runtimeArtifactIds).toEqual(["packet_runtime"]);
    expect(beta.data.artifacts[1]?.compatibilityOnly).toBe(true);
    expect(beta.data.artifacts[1]?.runtimePath).toBe("generated/beta/PACKET.md");
  });
});
