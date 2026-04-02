import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import secondSetupSeed from "../fixtures/source/second-setup.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

describe("second_setup e2e", () => {
  it("compiles the same pipeline for a non-Lessons setup", () => {
    const result = compile(secondSetupSeed);
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
    const result = compile(secondSetupSeed);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    const roleHome = result.data.documents.find((document) => document.id === "coordinator_home")?.markdown;
    expect(roleHome).toContain("Coordinate the core-dev workflow and keep the shared release doctrine coherent.");
  });
});
