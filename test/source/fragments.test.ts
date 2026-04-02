import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

import { loadFragments } from "../../src/source/index.js";
import { withTempDir } from "../helpers/fs.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("loadFragments", () => {
  it("loads paragraphs, nested lists, and fenced code blocks from an explicit file URL base", async () => {
    await withTempDir(async (dir) => {
      const fragmentsDir = path.join(dir, "fragments");
      await mkdir(fragmentsDir, { recursive: true });
      await writeFile(
        path.join(fragmentsDir, "overview.md"),
        [
          "Start with the shared workflow.",
          "Then open the current brief.",
          "",
          "- Shared workflow",
          "- Current brief",
          "  - Verify the current owner first.",
          "  - Then open the packet.",
          "",
          "1. Draft the issue.",
          "2. Send it to critic.",
          "  1. Keep the reviewer notes in scope.",
          "",
          "```sh",
          "paperzod compile setups/editorial/index.ts --repo-root . --output-root generated --write",
          "```",
          ""
        ].join("\n"),
        "utf8"
      );

      const loaded = loadFragments(pathToFileURL(`${fragmentsDir}/`), { overview: "overview.md" });

      expect(loaded.overview).toEqual([
        { kind: "paragraph", text: "Start with the shared workflow. Then open the current brief." },
        {
          kind: "unordered_list",
          items: [
            "Shared workflow",
            {
              text: "Current brief",
              children: ["Verify the current owner first.", "Then open the packet."]
            }
          ]
        },
        {
          kind: "ordered_list",
          items: ["Draft the issue.", { text: "Send it to critic.", children: ["Keep the reviewer notes in scope."] }]
        },
        {
          kind: "code_block",
          language: "sh",
          code: "paperzod compile setups/editorial/index.ts --repo-root . --output-root generated --write"
        }
      ]);
    });
  });

  it("rejects relative string bases", () => {
    expect(() => loadFragments("fragments", { overview: "overview.md" })).toThrowError(
      'Fragment base "fragments" must be an absolute path or file URL.'
    );
  });

  it("fails loudly on unsupported headings with file context", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "heading.md"), "# Heading\n", "utf8");

      expect(() => loadFragments(dir, { heading: "heading.md" })).toThrowError(
        new RegExp(`${escapeRegExp(path.join(dir, "heading.md"))}:1: Headings are not supported`)
      );
    });
  });

  it("rejects fragment paths that escape the explicit base", async () => {
    await withTempDir(async (dir) => {
      const fragmentsDir = path.join(dir, "fragments");
      await mkdir(fragmentsDir, { recursive: true });
      await writeFile(path.join(dir, "outside.md"), "Outside\n", "utf8");

      expect(() => loadFragments(fragmentsDir, { outside: "../outside.md" })).toThrowError(
        `Fragment path "../outside.md" escapes the explicit fragment base "${fragmentsDir}".`
      );
    });
  });
});
