import { describe, expect, it } from "vitest";

import { compileSetup, createTargetAdapter } from "../../src/index.js";
import editorialExample from "../fixtures/source/editorial-example.js";

describe("editorial example e2e", () => {
  it("compiles the helper-backed proving example end to end", () => {
    const result = compileSetup(
      editorialExample,
      createTargetAdapter({
        name: "test",
        repoRoot: "/repo",
        outputRoot: "out"
      })
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.manifest.documentPaths).toEqual({
      writer_home: "/repo/out/generated/editorial/roles/writer/AGENTS.md",
      critic_home: "/repo/out/generated/editorial/roles/critic/AGENTS.md",
      publisher_home: "/repo/out/generated/editorial/roles/publisher/AGENTS.md",
      editorial_workflow: "/repo/out/generated/editorial/shared/AUTHORITATIVE_WORKFLOW.md",
      draft_quality_standard: "/repo/out/generated/editorial/standards/DRAFT_QUALITY.md"
    });

    const rendered = Object.fromEntries(result.data.documents.map((document) => [document.id, document.markdown]));

    expect(rendered.writer_home).toContain("Read the shared workflow, then the draft-quality standard, then the current brief.");
    expect(rendered.editorial_workflow).toContain("Move one issue from draft to publish in a fixed order.");
    expect(rendered.editorial_workflow).toContain("Writer drafts the issue.");
    expect(rendered.draft_quality_standard).toContain("The draft matches the brief.");
    expect(rendered.publisher_home).toContain("Publish the issue only after critic review passes.");
  });
});
