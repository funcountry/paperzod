import { describe, expect, it } from "vitest";

import { loadFixtureModule } from "../helpers/fixtures.js";
import { stableJson } from "../helpers/snapshots.js";

describe("test harness", () => {
  it("loads a fixture module", async () => {
    const fixture = await loadFixtureModule<{ id: string }>("../fixtures/source/demo-minimal.ts");
    expect(fixture.id).toBe("demo_minimal");
  });

  it("renders stable snapshot text", () => {
    expect(stableJson({ a: 1, b: 2 })).toMatchInlineSnapshot(`
      "{
        "a": 1,
        "b": 2
      }"
    `);
  });
});
