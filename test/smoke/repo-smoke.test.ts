import { describe, expect, it } from "vitest";

import { packageRootReady } from "../../src/index.js";

describe("repo bootstrap", () => {
  it("loads the root entrypoint", () => {
    expect(packageRootReady).toBe(true);
  });
});
