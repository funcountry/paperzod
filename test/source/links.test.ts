import { describe, expect, it } from "vitest";

import { linkSchema } from "../../src/source/schemas.js";

describe("source link schemas", () => {
  const linkKinds = [
    "owns",
    "reads",
    "produces",
    "consumes",
    "supports",
    "checks",
    "routes_to",
    "documents",
    "grounds",
    "references",
    "maps_to_runtime",
    "generated_from"
  ] as const;

  it.each(linkKinds)("accepts valid %s links", (kind) => {
    expect(linkSchema.safeParse({ id: `${kind}_1`, kind, from: "node_a", to: "node_b" }).success).toBe(true);
  });

  it("accepts read links with conditional and contextual guidance", () => {
    expect(
      linkSchema.safeParse({
        id: "reads_1",
        kind: "reads",
        from: "role_1",
        to: "surface_1",
        condition: "When you are deciding which shared owner governs the issue.",
        context: "Read the full shared map before opening packet-specific docs."
      }).success
    ).toBe(true);
  });

  it("rejects read-only metadata on non-read links", () => {
    expect(
      linkSchema.safeParse({
        id: "owns_1",
        kind: "owns",
        from: "role_1",
        to: "surface_1",
        condition: "Never valid here."
      }).success
    ).toBe(false);
  });

  it("rejects invalid link kinds", () => {
    expect(linkSchema.safeParse({ id: "bad_1", kind: "bad_kind", from: "node_a", to: "node_b" }).success).toBe(false);
  });
});
