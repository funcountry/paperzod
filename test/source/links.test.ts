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

  it("rejects invalid link kinds", () => {
    expect(linkSchema.safeParse({ id: "bad_1", kind: "bad_kind", from: "node_a", to: "node_b" }).success).toBe(false);
  });
});
