import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import releaseOpsSetup from "../../setups/release_ops/index.ts";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "."
    })
  );
}

describe("release_ops e2e", () => {
  it("compiles the same pipeline for a non-editorial setup", () => {
    const result = compile(releaseOpsSetup);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect({
      manifest: result.data.manifest,
      rendered: Object.fromEntries(result.data.documents.map((document) => [document.id, document.markdown]))
    }).toMatchSnapshot();
  });

  it("preserves the setup-local role override through rendering", () => {
    const result = compile(releaseOpsSetup);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    const roleHome = result.data.documents.find((document) => document.id === "coordinator_home")?.markdown;
    expect(roleHome).toContain("Coordinate the release workflow and keep the shared release operations doctrine coherent.");
  });
});
